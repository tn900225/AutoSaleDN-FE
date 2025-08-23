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

      setSelectedShowroom({
        ...showroom,
        salesData: sales,
        inventory: inventory,
        brands: brands,
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
      // Handle download or show success message
    } catch (err) {
      setError(err.message);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
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

  if (viewMode === 'detail' && selectedShowroom) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
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
                  Xuất báo cáo
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tổng doanh thu</p>
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
                    {Math.abs(selectedShowroom.revenueGrowth)}% so với tháng trước
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Xe đã bán</p>
                    <p className="text-2xl font-semibold text-gray-900">{selectedShowroom.soldThisMonth}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Car className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">Trong tháng này</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tồn kho</p>
                    <p className="text-2xl font-semibold text-gray-900">{selectedShowroom.totalCars}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">Hiện tại</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Số thương hiệu</p>
                    <p className="text-2xl font-semibold text-gray-900">{selectedShowroom.brands.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">Đang kinh doanh</p>
              </div>
            </div>

            {/* Charts and Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Sales Chart */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Doanh số bán hàng</h3>
                <div className="h-64 flex items-end space-x-2">
                  {selectedShowroom.salesData.map((day, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-600"
                        style={{ height: `${(day.sold / 5) * 100}%`, minHeight: '20px' }}
                      ></div>
                      <div className="text-xs text-gray-600 mt-2">{formatDate(day.date)}</div>
                      <div className="text-xs font-semibold text-gray-900">{day.sold} xe</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brand Performance */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Hiệu suất thương hiệu</h3>
                <div className="space-y-4">
                  {selectedShowroom.brands.map((brand, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-sm">{brand.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{brand.name}</h4>
                          <p className="text-sm text-gray-600">{brand.count} xe</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(brand.revenue)}</p>
                        <p className="text-sm text-gray-600">Doanh thu</p>
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
                  <h3 className="text-lg font-semibold">Lịch sử nhập kho</h3>
                  <button className="text-blue-600 hover:text-blue-800 text-sm">Xem tất cả</button>
                </div>
                <div className="space-y-3">
                  {selectedShowroom.inventory.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                          <Package className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.model}</p>
                          <p className="text-sm text-gray-600">{formatDate(item.date)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">+{item.quantity}</p>
                        <p className="text-sm text-green-600">{item.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Models */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Mẫu xe phổ biến</h3>
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
                          <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center" style={{display: 'none'}}>
                            <Car className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{model.name}</h4>
                          <p className="text-sm text-gray-600">{model.brand}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{model.count} xe</p>
                        <p className="text-sm text-blue-600">{model.sold} đã bán</p>
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
      <div className="flex-1 flex flex-col">
        <AdminTopbar />
        <main className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Quản Lí Showroom</h1>
              <p className="text-gray-600">Theo dõi và quản lý hiệu suất các showroom</p>
            </div>
            <div className="flex items-center space-x-3">
              <select 
                value={dateFilter} 
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="thisMonth">Tháng này</option>
                <option value="lastMonth">Tháng trước</option>
                <option value="thisYear">Năm này</option>
              </select>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Filter className="h-4 w-4 mr-2" />
                Lọc
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng doanh thu</p>
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
                  <p className="text-sm text-gray-600">Tổng xe bán</p>
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
                  <p className="text-sm text-gray-600">Tổng tồn kho</p>
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
                  <p className="text-sm text-gray-600">Showroom hoạt động</p>
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
                {/* Showroom Header */}
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
                    Chi tiết
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Doanh thu</p>
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
                    <p className="text-sm text-gray-600">Xe bán/tháng</p>
                    <p className="text-lg font-semibold text-gray-900">{showroom.soldThisMonth}</p>
                    <p className="text-xs text-gray-500">Tồn kho: {showroom.totalCars}</p>
                  </div>
                </div>

                {/* Top Brands */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Thương hiệu hàng đầu</h4>
                  <div className="space-y-2">
                    {showroom.brands.slice(0, 2).map((brand, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md flex items-center justify-center mr-2">
                            <span className="text-white text-xs font-bold">{brand.name.charAt(0)}</span>
                          </div>
                          <span className="text-sm text-gray-700">{brand.name}</span>
                        </div>
                        <span className="text-sm text-gray-600">{brand.count} xe</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Cập nhật gần đây</span>
                    <span className="text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      2 giờ trước
                    </span>
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