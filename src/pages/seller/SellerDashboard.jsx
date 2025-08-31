import SellerSidebar from "../../components/seller/SellerSidebar";
import SellerTopbar from "../../components/seller/SellerTopbar";
import { useNavigate } from 'react-router-dom';
import Chart from "react-apexcharts";
import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Calendar, BarChart3, DollarSign, Car, Star, MapPin, Package, Users, Activity, Target, Eye, Award, ArrowRight, AlertTriangle } from "lucide-react";
import { getApiBaseUrl } from "../../../util/apiconfig";

const fetchRevenueData = async () => {
  const token = localStorage.getItem('token');
  const currentYear = new Date().getFullYear();
  const API_BASE = getApiBaseUrl();


  const monthlyData = [];
  for (let month = 1; month <= 12; month++) {
    const url = `${API_BASE}/api/Seller/reports/revenue/monthly?year=${currentYear}&month=${month}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) {
      monthlyData.push(0);
      continue;
    }
    const data = await res.json();
    monthlyData.push(data.totalRevenue);
  }

  const yearlyChartValues = [];
  const yearlyChartLabels = [];
  for (let year = currentYear - 2; year <= currentYear; year++) {
    const url = `${API_BASE}/api/Seller/reports/revenue/yearly?year=${year}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) {
      yearlyChartValues.push(0);
    } else {
      const data = await res.json();
      yearlyChartValues.push(data.totalRevenue);
    }
    yearlyChartLabels.push(year.toString());
  }

  const currentYearReportUrl = `${API_BASE}/api/Seller/reports/revenue/yearly?year=${currentYear}`;
  const yearlyRes = await fetch(currentYearReportUrl, { headers: { Authorization: `Bearer ${token}` } });
  if (!yearlyRes.ok) {
    const errorData = await yearlyRes.json();
    throw new Error(errorData.message || "Failed to fetch yearly revenue report");
  }
  const currentYearReport = await yearlyRes.json();

  return {
    monthly: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      values: monthlyData
    },
    yearly: { // Trả lại object 'yearly' cho biểu đồ
      labels: yearlyChartLabels,
      values: yearlyChartValues
    },
    currentYearReport: currentYearReport // Giữ lại báo cáo chi tiết cho các thẻ stats
  };
};

// Giả định có endpoint API để lấy dữ liệu dashboard của riêng seller
const fetchSellerDashboardData = async () => {
  const token = localStorage.getItem('token');
  const API_BASE = getApiBaseUrl();
  try {
    const topCarsRes = await fetch(`${API_BASE}/api/Seller/reports/top-selling-cars`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const topCars = await topCarsRes.json();

    const showroomRes = await fetch(`${API_BASE}/api/Seller/reports/my-showroom-inventory`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const showroomInventory = await showroomRes.json();


    return { topCars, showroomInventory };
  } catch (error) {
    throw new Error('Failed to fetch dashboard data: ' + error.message);
  }
};

export default function SellerDashboard() {
  const [selectedView, setSelectedView] = useState("monthly");
  const [revenueData, setRevenueData] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showroomProfile, setShowroomProfile] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const handleShowroomDetail = (showroomId) => {
    navigate(`/seller/showroom/${showroomId}`);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [revenue, dashboard] = await Promise.all([
          fetchRevenueData(),
          fetchSellerDashboardData()
        ]);
        setRevenueData(revenue);
        setDashboardData(dashboard);
        const token = localStorage.getItem('token');
        const API_BASE = getApiBaseUrl();
        const profileRes = await fetch(`${API_BASE}/api/seller/my-showroom-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setShowroomProfile(profileData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getChartSeries = () => {
    if (!revenueData) return [];
    switch (selectedView) {
      case "monthly":
        return [
          { name: "Monthly Revenue", data: revenueData.monthly.values }
        ];
      case "quarterly":
        const quarterlyData = [];
        for (let i = 0; i < revenueData.monthly.values.length; i += 3) {
          const quarterTotal = revenueData.monthly.values.slice(i, i + 3).reduce((a, b) => a + b, 0);
          quarterlyData.push(quarterTotal);
        }
        return [
          { name: "Quarterly Revenue", data: quarterlyData }
        ];
      case "yearly":
        return [
          { name: "Yearly Revenue", data: revenueData.yearly.values }
        ];
      default:
        return [];
    }
  };

  const getChartOptions = () => {
    if (!revenueData) return {};
    const options = {
      chart: {
        type: "area",
        height: 350,
        toolbar: { show: false },
        background: 'transparent'
      },
      colors: ["#3B82F6"],
      dataLabels: { enabled: false },
      stroke: {
        curve: "smooth",
        width: 3
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.3,
          opacityTo: 0.1,
          stops: [0, 90, 100]
        }
      },
      xaxis: {
        categories: selectedView === "yearly"
          ? revenueData.yearly.labels
          : selectedView === "quarterly"
            ? ["Q1", "Q2", "Q3", "Q4"]
            : revenueData.monthly.labels,
        labels: {
          style: {
            fontSize: '12px',
            colors: '#6B7280'
          }
        },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return `$${value.toLocaleString()}`;
          },
          style: {
            fontSize: '12px',
            colors: '#6B7280'
          }
        }
      },
      tooltip: {
        y: {
          formatter: function (value) {
            return `$${value.toLocaleString()}`;
          }
        }
      },
      grid: {
        borderColor: '#E5E7EB',
        strokeDashArray: 0,
        xaxis: {
          lines: { show: false }
        },
        yaxis: {
          lines: { show: true }
        }
      }
    };
    return options;
  };

  const calculateGrowth = (current, previous) => {
    if (!current || !previous) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const calculateStrategicInsights = () => {
    if (!revenueData) return null;

    const currentYearData = revenueData.monthly.values || [];

    const yearlyReport = revenueData.currentYearReport || {};

    const currentYearTotal = yearlyReport.totalRevenue || 0;

    const yearGrowth = yearlyReport.growthPercentage || 0;

    const bestMonthIndex = currentYearData.length > 0
      ? currentYearData.indexOf(Math.max(...currentYearData))
      : 0;
    const worstMonthIndex = currentYearData.length > 0
      ? currentYearData.indexOf(Math.min(...currentYearData))
      : 0;

    const sellerShowroom = dashboardData?.showroomInventory || {};

    return {
      currentYearTotal,
      lastYearTotal: yearlyReport.previousYearRevenue || 0,
      yearGrowth: yearGrowth.toFixed(1), // Sử dụng giá trị từ backend
      bestMonth: {
        month: revenueData.monthly.labels[bestMonthIndex],
        revenue: currentYearData[bestMonthIndex] || 0
      },
      worstMonth: {
        month: revenueData.monthly.labels[worstMonthIndex],
        revenue: currentYearData[worstMonthIndex] || 0
      },
      averageMonthly: (currentYearTotal / 12), // Đã sửa ở lần trước
      totalCarsSold: dashboardData?.topCars?.reduce((acc, car) => acc + car.totalSold, 0) || 0,
      totalInventory: sellerShowroom.totalCars || 0,
      sellerShowroom
    };
  };

  const insights = calculateStrategicInsights();

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <SellerSidebar />
        <div className="flex-1 flex flex-col">
          <SellerTopbar />
          <main className="flex-1 flex items-center justify-center">
            <div className="flex items-center space-x-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="text-xl text-gray-600">Loading dashboard...</span>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <SellerSidebar />
        <div className="flex-1 flex flex-col">
          <SellerTopbar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
              <p className="text-gray-600">{error}</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const sellerShowroom = insights?.sellerShowroom;

  return (
    <div className="flex h-screen bg-gray-50">
      <SellerSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <SellerTopbar />
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="flex items-center mb-4 md:mb-0">
                <Activity className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    {showroomProfile ? showroomProfile.name : "Seller Dashboard"}
                  </h1>
                  <p className="text-gray-600">Welcome back! Here's what's happening with your showroom.</p>
                </div>
              </div>
              <div className="flex bg-white rounded-xl shadow-sm p-1 border">
                {['monthly', 'quarterly', 'yearly'].map((view) => (
                  <button
                    key={view}
                    onClick={() => setSelectedView(view)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${selectedView === view
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                  >
                    {view.charAt(0).toUpperCase() + view.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Revenue */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {insights?.currentYearTotal
                        ? insights.currentYearTotal.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
                        : (0).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                {insights?.yearGrowth >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${insights?.yearGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {insights?.yearGrowth || 0}%
                </span>
                <span className="text-sm text-gray-500 ml-2">vs last year</span>
              </div>
            </div>

            {/* Monthly Average */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Monthly Average</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {(insights?.averageMonthly || 0).toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                        maximumFractionDigits: 0 // Làm tròn đến số nguyên gần nhất
                      })}
                    </p>                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Best: {insights?.bestMonth?.month} ({insights?.bestMonth?.revenue?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) || 0})
              </div>
            </div>

            {/* Cars Sold */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Car className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Cars Sold</p>
                    <p className="text-2xl font-bold text-gray-900">{insights?.totalCarsSold || 0}</p>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Top: {dashboardData?.topCars?.[0]?.modelName || 'N/A'}
              </div>
            </div>

            {/* Inventory */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Package className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">My Showroom Inventory</p>
                    <p className="text-2xl font-bold text-gray-900">{insights?.totalInventory || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Revenue Analytics</h3>
                  <p className="text-sm text-gray-500">
                    {selectedView === 'monthly' ? 'Monthly' : selectedView === 'quarterly' ? 'Quarterly' : 'Yearly'} revenue performance
                  </p>
                </div>
                <BarChart3 className="h-5 w-5 text-gray-400" />
              </div>
              <Chart
                options={getChartOptions()}
                series={getChartSeries()}
                type="area"
                height={350}
              />
            </div>

            {/* Strategic Insights */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Key Insights</h3>
                <Target className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Award className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-blue-900">Best Performance</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    {insights?.bestMonth?.month} generated ${insights?.bestMonth?.revenue?.toLocaleString() || 0} in revenue
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-900">Growth Rate</span>
                  </div>
                  <p className="text-sm text-green-700">
                    {insights?.yearGrowth || 0}% year-over-year growth
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Car className="h-5 w-5 text-purple-600 mr-2" />
                    <span className="text-sm font-medium text-purple-900">Top Seller</span>
                  </div>
                  <p className="text-sm text-purple-700">
                    {dashboardData?.topCars?.[0]?.modelName || 'N/A'} - {dashboardData?.topCars?.[0]?.totalSold || 0} units sold
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Selling Cars & My Showroom Inventory */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Selling Cars (Seller's showroom) */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Top Selling Cars (My Showroom)</h3>
                <span className="text-sm text-gray-500">
                  Page {currentPage} of {Math.ceil((dashboardData?.topCars?.length || 0) / itemsPerPage)}
                </span>
              </div>
              <div className="space-y-4">
                {dashboardData?.topCars
                  ?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((car, index) => (
                    <div key={car.ModelId} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                          <img
                            src={car.imageUrl || `/api/placeholder/64/64`}
                            alt={car.modelName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center" style={{ display: 'none' }}>
                            <Car className="h-8 w-8 text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 truncate">{car.modelName}</h4>
                            <p className="text-xs text-gray-500">{car.manufacturerName}</p>
                            <div className="flex items-center mt-1">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-600 ml-1">
                                {car.averageRating?.toFixed(1)} ({car.totalReviews})
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">${car.revenue?.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">{car.totalSold} sold</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                  >
                    Previous
                  </button>

                  <div className="flex space-x-1">
                    {Array.from({ length: Math.ceil((dashboardData?.topCars?.length || 0) / itemsPerPage) }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-md ${currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'}`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev =>
                      Math.min(prev + 1, Math.ceil((dashboardData?.topCars?.length || 0) / itemsPerPage)))
                    }
                    disabled={currentPage >= Math.ceil((dashboardData?.topCars?.length || 0) / itemsPerPage)}
                    className={`px-3 py-1 rounded-md ${currentPage >= Math.ceil((dashboardData?.topCars?.length || 0) / itemsPerPage)
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-blue-600 hover:bg-blue-50'}`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>


          </div>
        </main>
      </div>
    </div>
  );
}