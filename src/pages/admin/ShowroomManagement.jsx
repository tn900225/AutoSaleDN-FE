import React, { useState, useEffect } from 'react';
import {
  Car,
  MapPin,
  TrendingUp,
  Package,
  Calendar,
  DollarSign,
  Eye,
  ArrowRight,
  BarChart3,
  TrendingDown,
  Clock,
  Users,
  Filter,
  Download
} from 'lucide-react';
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

export default function ShowroomManagement() {
  const [selectedShowroom, setSelectedShowroom] = useState(null);
  const [viewMode, setViewMode] = useState('overview'); // 'overview', 'detail'
  const [dateFilter, setDateFilter] = useState('thisMonth');
  const [showrooms, setShowrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const fetchShowrooms = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/Admin/showrooms', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch showrooms');
      }
      const data = await response.json();
      setShowrooms(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchShowroomDetail = async (showroomId) => {
    try {
      setLoading(true);
      const [showroomRes, salesRes, inventoryRes, brandsRes] = await Promise.all([
        fetch(`/api/Admin/showrooms/${showroomId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`/api/Admin/showrooms/${showroomId}/sales`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`/api/Admin/showrooms/${showroomId}/inventory`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`/api/Admin/showrooms/${showroomId}/brands`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!showroomRes.ok || !salesRes.ok || !inventoryRes.ok || !brandsRes.ok) {
        throw new Error('Failed to fetch showroom details');
      }

      const [showroom, sales, inventory, brands] = await Promise.all([
        showroomRes.json(),
        salesRes.json(),
        inventoryRes.json(),
        brandsRes.json(),
      ]);

      // Calculate total cars in inventory and popular models
      let totalCarsInInventory = 0;
      const modelCounts = {}; // { modelName: { count: N, sold: M, revenue: R, imageUrl: '' } }

      inventory.forEach(item => {
        totalCarsInInventory += item.quantity;

        const modelName = item.car ? item.car.modelName : item.model;
        const manufacturerName = item.car ? item.car.manufacturerName : item.brand;
        const unitPrice = item.unitPrice;

        if (!modelCounts[modelName]) {
          modelCounts[modelName] = {
            count: 0,
            sold: 0,
            revenue: 0,
            brand: manufacturerName,
            imageUrl: `/path/to/car/image/${modelName ? modelName.toLowerCase().replace(/\s/g, '-') : 'default'}.png`
          };
        }
        modelCounts[modelName].count += item.quantity;

        if (item.transactionType === 2 || item.type === "Xuất hàng") {
          modelCounts[modelName].sold += Math.abs(item.quantity);
          modelCounts[modelName].revenue += Math.abs(item.quantity) * (unitPrice || 0);
        }
      });

      const popularModels = Object.keys(modelCounts).map(modelName => ({
        name: modelName,
        ...modelCounts[modelName]
      })).sort((a, b) => b.sold - a.sold);

      setSelectedShowroom({
        ...showroom,
        salesData: sales,
        inventory: inventory,
        brands: brands,
        totalCars: totalCarsInInventory,
        models: popularModels,
      });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShowrooms();
  }, []);

  const handleShowroomDetail = async (showroomId) => {
    await fetchShowroomDetail(showroomId);
    setViewMode('detail');
  };

  const handleExportReport = async (showroomId) => {
    try {
      const response = await fetch(`/api/Admin/showrooms/export`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ showroomId: showroomId }),
      });
      if (!response.ok) {
        throw new Error('Failed to export report');
      }
      alert('Report exported successfully!');
    } catch (err) {
      setError(err.message);
      alert(`Error exporting report: ${err.message}`);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Updated formatDate to handle ISO date strings
  const formatDate = (dateString, index, totalDays) => {
    if (!dateString || typeof dateString !== 'string') return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ''; // Invalid date
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed

    if (totalDays <= 15) {
      return `${day}/${month}`;
    } else {
      if (parseInt(day) === 1 || parseInt(day) === 10 || parseInt(day) === 20 || index === totalDays - 1) {
        return `${day}/${month}`;
      }
      return '';
    }
  };

  const formatDateTime = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getTransactionTypeLabel = (type) => {
    if (typeof type === 'number') {
      switch (type) {
        case 1:
          return 'Import';
        case 2:
          return 'Sale';
        case 3:
          return 'Adjustment';
        case 4:
          return 'Transfer';
        default:
          return 'Other';
      }
    } else if (typeof type === 'string') {
      switch (type) {
        case 'Nhập hàng':
          return 'Import';
        case 'Xuất hàng':
          return 'Sale';
        default:
          return 'Other';
      }
    }
    return 'Unknown';
  };

  const handleBackToOverview = () => {
    setSelectedShowroom(null);
    setViewMode('overview');
  };

  const getTotalRevenue = () => {
    return showrooms.reduce((total, showroom) => total + showroom.revenue, 0);
  };

  const getTotalCars = () => {
    return showrooms.reduce((total, showroom) => total + showroom.totalCars, 0);
  };

  const getTotalSold = () => {
    return showrooms.reduce((total, showroom) => total + showroom.soldThisMonth, 0);
  };

  if (loading && viewMode === 'detail') {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-lg text-gray-700">Loading showroom details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-lg text-red-600">Error: {error}</p>
          <button
            onClick={() => {
              if (viewMode === 'overview') fetchShowrooms();
              if (viewMode === 'detail' && selectedShowroom) fetchShowroomDetail(selectedShowroom.id);
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (viewMode === 'detail' && selectedShowroom) {
    const maxSold = Math.max(...selectedShowroom.salesData.map(s => s.sold || 0)); // Default to 0 if sold is undefined
    const safeMaxSold = maxSold === 0 ? 1 : maxSold;
    const totalSalesDays = selectedShowroom.salesData.length;
    console.log('Sales Data:', selectedShowroom.salesData); // Debug sales data

    // Dữ liệu và tùy chọn cho biểu đồ Chart.js
    const chartData = {
      labels: selectedShowroom.salesData.map((day, index) => formatDate(day.saleDate, index, totalSalesDays)),
      datasets: [{
        label: 'Sales',
        data: selectedShowroom.salesData.map(day => day.sold || 0), // Default to 0 if sold is missing
        backgroundColor: '#3B82F6',
        hoverBackgroundColor: '#2563EB',
        borderRadius: 8,
        barThickness: Math.min(60, 100 / totalSalesDays * 10),
        maxBarThickness: 60
      }]
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1F2937',
          titleFont: { size: 12 },
          bodyFont: { size: 12 },
          padding: 8,
          cornerRadius: 4,
          callbacks: {
            label: (context) => `${context.parsed.y} sold`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            font: { size: 12 },
            color: '#4B5563',
            maxRotation: totalSalesDays > 15 ? 45 : 0,
            minRotation: totalSalesDays > 15 ? 45 : 0
          }
        },
        y: {
          grid: { borderDash: [5, 5], color: '#E5E7EB' },
          ticks: {
            font: { size: 12 },
            color: '#4B5563',
            beginAtZero: true,
            max: safeMaxSold * 1.2 // Add padding to max value
          }
        }
      }
    };

    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-y-auto">
          <AdminTopbar />
          <main className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <button
                  onClick={handleBackToOverview}
                  className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowRight className="h-5 w-5 rotate-180" />
                </button>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">{selectedShowroom.name}</h1>
                  <p className="text-gray-600">{selectedShowroom.location}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleExportReport(selectedShowroom.id)}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-semibold text-gray-900">{formatCurrency(selectedShowroom.revenue)}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  {selectedShowroom.revenueGrowth > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${selectedShowroom.revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(selectedShowroom.revenueGrowth)}% vs. last month
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Cars Sold</p>
                    <p className="text-2xl font-semibold text-gray-900">{selectedShowroom.soldThisMonth}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Car className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">This month</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Inventory</p>
                    <p className="text-2xl font-semibold text-gray-900">{selectedShowroom.totalCars}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">Currently in stock</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Number of Brands</p>
                    <p className="text-2xl font-semibold text-gray-900">{selectedShowroom.brands.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">Currently offered</p>
              </div>
            </div>

            {/* Charts and Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Sales Chart */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Sales Performance</h3>
                <div className="relative h-64">
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </div>

              {/* Brand Performance */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Brand Performance</h3>
                <div className="space-y-4">
                  {selectedShowroom.brands.map((brand, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-sm">{brand.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{brand.name}</h4>
                          <p className="text-sm text-gray-600">{brand.count} cars</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(brand.revenue)}</p>
                        <p className="text-sm text-gray-600">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Inventory and Models */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Inventory */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Inventory Transaction History</h3>
                  <button className="text-blue-600 hover:text-blue-800 text-sm">View All</button>
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                  {selectedShowroom.inventory.slice(0, 10).map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 ${item.quantity > 0 ? 'bg-green-100' : 'bg-red-100'} rounded-lg flex items-center justify-center mr-3`}>
                          <Package className={`h-4 w-4 ${item.quantity > 0 ? 'text-green-600' : 'text-red-600'}`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.car ? item.car.modelName : item.model} ({item.car ? item.car.manufacturerName : ''})</p>
                          <p className="text-sm text-gray-600">{formatDateTime(item.transactionDate || item.date)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${item.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {item.quantity > 0 ? `+${item.quantity}` : item.quantity}
                        </p>
                        <p className="text-sm text-gray-600">{getTransactionTypeLabel(item.transactionType || item.type)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Models */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Popular Car Models</h3>
                <div className="space-y-4">
                  {selectedShowroom.models.map((model, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden mr-3">
                          <img
                            src={model.imageUrl}
                            alt={model.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center" style={{ display: 'none' }}>
                            <Car className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{model.name}</h4>
                          <p className="text-sm text-gray-600">{model.brand}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{model.count} cars</p>
                        <p className="text-sm text-blue-600">{model.sold} sold</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <AdminTopbar />
        <main className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Showroom Management</h1>
              <p className="text-gray-600">Monitor and manage showroom performance</p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="thisMonth">This Month</option>
                <option value="lastMonth">Last Month</option>
                <option value="thisYear">This Year</option>
              </select>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-semibold text-gray-900">{formatCurrency(getTotalRevenue())}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Cars Sold</p>
                  <p className="text-2xl font-semibold text-gray-900">{getTotalSold()}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Car className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Inventory</p>
                  <p className="text-2xl font-semibold text-gray-900">{getTotalCars()}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Showrooms</p>
                  <p className="text-2xl font-semibold text-gray-900">{showrooms.length}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Showroom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {showrooms.map((showroom) => (
              <div key={showroom.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{showroom.name}</h3>
                      <p className="text-sm text-gray-600">{showroom.location}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleShowroomDetail(showroom.id)}
                    className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Revenue</p>
                    <p className="text-lg font-semibold text-gray-900">{formatCurrency(showroom.revenue)}</p>
                    <div className="flex items-center mt-1">
                      {showroom.revenueGrowth > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      <span className={`text-xs ${showroom.revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {Math.abs(showroom.revenueGrowth)}%
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Cars Sold/Month</p>
                    <p className="text-lg font-semibold text-gray-900">{showroom.soldThisMonth}</p>
                    <p className="text-xs text-gray-500">Inventory: {showroom.totalCars}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Top Brands</h4>
                  <div className="space-y-2">
                    {showroom.brands.slice(0, 2).map((brand, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md flex items-center justify-center mr-2">
                            <span className="text-white text-xs font-bold">{brand.name.charAt(0)}</span>
                          </div>
                          <span className="text-sm text-gray-700">{brand.name}</span>
                        </div>
                        <span className="text-sm text-gray-600">{brand.count} cars</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Recent Activity</h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Last Updated: {formatDateTime(showroom.lastUpdated || new Date().toISOString())}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Managed by: {showroom.sellerName || 'Unknown'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}