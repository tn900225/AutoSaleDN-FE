import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import { useNavigate } from 'react-router-dom';
import Chart from "react-apexcharts";
import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Calendar, BarChart3, DollarSign, Car, Star, MapPin, Package, Users, Activity, Target, Eye, Award,ArrowRight, AlertTriangle } from "lucide-react";
import { getApiBaseUrl } from "../../../util/apiconfig";

const fetchRevenueData = async () => {
  const token = localStorage.getItem('token');
  const currentYear = new Date().getFullYear();
  const API_BASE = getApiBaseUrl();

  const monthlyData = [];
  for (let month = 1; month <= 12; month++) {
    const url = `${API_BASE}/Seller/reports/revenue/monthly?year=${currentYear}&month=${month}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch monthly revenue");
    }
    const data = await res.json();
    monthlyData.push(data.totalRevenue);
  }

  // Get yearly data for comparison for the seller's showroom
  const yearlyData = [];
  for (let year = currentYear - 2; year <= currentYear; year++) {
    const url = `${API_BASE}/Seller/reports/revenue/yearly?year=${year}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch yearly revenue");
    }
    const data = await res.json();
    yearlyData.push(data.totalRevenue);
  }

  return {
    monthly: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      values: monthlyData
    },
    yearly: {
      labels: [(currentYear - 2).toString(), (currentYear - 1).toString(), currentYear.toString()],
      values: yearlyData
    }
  };
};

// Giả định có endpoint API để lấy dữ liệu dashboard của riêng seller
const fetchSellerDashboardData = async () => {
  const token = localStorage.getItem('token');
  const API_BASE = getApiBaseUrl();
  try {
    const topCarsRes = await fetch(`${API_BASE}/Seller/reports/top-selling-cars`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const topCars = await topCarsRes.json();

    const showroomRes = await fetch(`${API_BASE}/Seller/reports/my-showroom-inventory`, {
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

  const handleShowroomDetail = (showroomId) => {
    // Seller có thể xem chi tiết showroom của mình
    navigate(`/seller/showroom/${showroomId}`);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Gọi các hàm fetch đã thay đổi
        const [revenue, dashboard] = await Promise.all([
          fetchRevenueData(),
          fetchSellerDashboardData()
        ]);
        setRevenueData(revenue);
        setDashboardData(dashboard);
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
    const yearlyData = revenueData.yearly.values || [];

    const currentYearTotal = currentYearData.reduce((a, b) => a + (b || 0), 0);
    const lastYearTotal = yearlyData[yearlyData.length - 2] || 0;

    const bestMonthIndex = currentYearData.length > 0
      ? currentYearData.indexOf(Math.max(...currentYearData))
      : 0;
    const worstMonthIndex = currentYearData.length > 0
      ? currentYearData.indexOf(Math.min(...currentYearData))
      : 0;

    const yearGrowth = lastYearTotal > 0 ? ((currentYearTotal - lastYearTotal) / lastYearTotal * 100) : 0;

    // Các thông tin này sẽ chỉ dành cho showroom của seller
    const sellerShowroom = dashboardData?.showroomInventory || {};

    return {
      currentYearTotal,
      lastYearTotal,
      yearGrowth: yearGrowth.toFixed(1),
      bestMonth: {
        month: revenueData.monthly.labels[bestMonthIndex],
        revenue: currentYearData[bestMonthIndex] || 0
      },
      worstMonth: {
        month: revenueData.monthly.labels[worstMonthIndex],
        revenue: currentYearData[worstMonthIndex] || 0
      },
      averageMonthly: (currentYearTotal / 12).toFixed(0),
      totalCarsSold: dashboardData?.topCars?.reduce((acc, car) => acc + car.totalSold, 0) || 0,
      totalInventory: sellerShowroom.totalCars || 0,
      sellerShowroom
    };
  };

  const insights = calculateStrategicInsights();

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminTopbar />
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
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminTopbar />
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
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <AdminTopbar />
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="flex items-center mb-4 md:mb-0">
                <Activity className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
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
                    <p className="text-2xl font-bold text-gray-900">${insights?.averageMonthly?.toLocaleString() || 0}</p>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Best: {insights?.bestMonth?.month} (${insights?.bestMonth?.revenue?.toLocaleString() || 0})
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
              <div className="text-sm text-gray-500">
                Location: {sellerShowroom?.location || 'N/A'}
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
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Selling Cars (My Showroom)</h3>
              <div className="space-y-4">
                {dashboardData?.topCars?.map((car, index) => (
                  <div key={car.ModelId} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                        <img
                          src={car.imageUrl || `${API_BASE}/api/placeholder/64/64`}
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
              </div>
            </div>

            {/* My Showroom Inventory - Đã đơn giản hóa để hiển thị 1 showroom duy nhất */}
            {sellerShowroom && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">My Showroom Inventory</h3>
                  <span className="text-sm text-gray-500">
                    {sellerShowroom.totalCars} vehicles
                  </span>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-5 border border-gray-200 hover:shadow-md transition-all duration-300">
                  {/* Showroom Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{sellerShowroom.location}</h4>
                        <p className="text-sm text-gray-600">{sellerShowroom.totalCars} vehicles available</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleShowroomDetail(sellerShowroom.showroomId || sellerShowroom.location)}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </button>
                  </div>

                  {/* Enhanced Brand and Model Display */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Top Brands */}
                    <div className="bg-white rounded-lg p-4 border border-gray-100">
                      <div className="flex items-center mb-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                        <h5 className="text-sm font-semibold text-gray-900">Top Brands</h5>
                      </div>
                      <div className="space-y-2">
                        {sellerShowroom.brands?.slice(0, 3).map((brand, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md flex items-center justify-center mr-3">
                                <span className="text-white text-xs font-bold">
                                  {brand.brandName?.charAt(0)}
                                </span>
                              </div>
                              <span className="text-sm font-medium text-gray-700">{brand.brandName}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                {brand.count} cars
                              </span>
                            </div>
                          </div>
                        ))}
                        {sellerShowroom.brands?.length > 3 && (
                          <div className="text-center">
                            <span className="text-xs text-gray-500">
                              +{sellerShowroom.brands.length - 3} more brands
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Available Models */}
                    <div className="bg-white rounded-lg p-4 border border-gray-100">
                      <div className="flex items-center mb-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                        <h5 className="text-sm font-semibold text-gray-900">Popular Models</h5>
                      </div>
                      <div className="space-y-2">
                        {sellerShowroom.models?.slice(0, 3).map((model, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gray-200 rounded-md overflow-hidden mr-3">
                                <img
                                  src={model.imageUrl || '/api/placeholder/32/32'}
                                  alt={model.modelName}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                                <div className="w-full h-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center" style={{ display: 'none' }}>
                                  <Car className="h-4 w-4 text-white" />
                                </div>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-700 block">{model.modelName}</span>
                                <span className="text-xs text-gray-500">{model.brandName}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                {model.availableQuantity} units
                              </span>
                            </div>
                          </div>
                        ))}
                        {sellerShowroom.models?.length > 3 && (
                          <div className="text-center">
                            <span className="text-xs text-gray-500">
                              +{sellerShowroom.models.length - 3} more models
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-600">
                          <strong className="text-gray-900">{sellerShowroom.brands?.length || 0}</strong> brands
                        </span>
                        <span className="text-gray-600">
                          <strong className="text-gray-900">{sellerShowroom.models?.length || 0}</strong> models
                        </span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <span className="text-xs">Last updated: {sellerShowroom.lastUpdated || 'Today'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}