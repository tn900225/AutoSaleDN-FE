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
  Download,
  Upload,
  Plus
} from 'lucide-react';
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Swal from 'sweetalert2';
import { getApiBaseUrl } from "../../../util/apiconfig";

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

// New CreateShowroomModal component
const CreateShowroomModal = ({ isOpen, onClose, onShowroomCreated }) => {
  const API_BASE = getApiBaseUrl();
  const [showroomName, setShowroomName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/Admin/showrooms/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: showroomName, address })
      });
  
      if (response.ok) {
        Swal.fire('Success', 'Showroom created successfully!', 'success');
        onShowroomCreated();
        onClose();
      } else {
        // SỬA ĐỔI Ở ĐÂY: Sử dụng response.text() để đọc chuỗi văn bản thuần
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create showroom');
      }
    } catch (error) {
      Swal.fire('Error', `Error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300 ease-out">
      <div className="relative w-full max-w-md mx-4 p-6 bg-white rounded-lg shadow-2xl sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Create New Showroom</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="showroom-name" className="block text-sm font-medium text-gray-700 mb-1">
              Showroom Name
            </label>
            <input
              type="text"
              id="showroom-name"
              value={showroomName}
              onChange={(e) => setShowroomName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              placeholder="Enter showroom name"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="showroom-address" className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              id="showroom-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              placeholder="Enter address"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ShowroomManagement() {
  const API_BASE = getApiBaseUrl();
  const [selectedShowroom, setSelectedShowroom] = useState(null);
  const [viewMode, setViewMode] = useState('overview');
  const [dateFilter, setDateFilter] = useState('thisMonth');
  const [showrooms, setShowrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importData, setImportData] = useState([{ listingId: '', quantity: '' }]);
  const [carListings, setCarListings] = useState([]);
  const token = localStorage.getItem('token');
  const [showCreateShowroomModal, setShowCreateShowroomModal] = useState(false);

  const fetchShowrooms = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/Admin/showrooms`, {
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

  const fetchCarListings = async (showroomId) => {
    try {
      const response = await fetch(`${API_BASE}/api/Admin/showrooms/${showroomId}/car-listings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch car listings');
      }
      const data = await response.json();
      setCarListings(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchShowroomDetail = async (showroomId) => {
    try {
      setLoading(true);
      const [showroomRes, salesRes, inventoryRes, brandsRes] = await Promise.all([
        fetch(`${API_BASE}/api/Admin/showrooms/${showroomId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/api/Admin/showrooms/${showroomId}/sales`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/api/Admin/showrooms/${showroomId}/inventory`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/api/Admin/showrooms/${showroomId}/brands`, {
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

      let totalCarsInInventory = 0;
      const modelCounts = {};

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

      // Fetch car listings for the import modal
      await fetchCarListings(showroomId);
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
      const response = await fetch(`${API_BASE}/api/Admin/showrooms/export`, {
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

  const handleImportStock = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/Admin/showrooms/${selectedShowroom.id}/inventory/import`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: importData }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to import inventory');
      }
      await Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Inventory imported successfully!',
        confirmButtonText: 'OK'
      });
      setShowImportModal(false);
      setImportData([{ listingId: '', quantity: '' }]);
      await fetchShowroomDetail(selectedShowroom.id); // Refresh showroom details
    } catch (err) {
      setError(err.message);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Error importing inventory: ${err.message}`,
        confirmButtonText: 'OK'
      });
    }
  };

  const handleAddImportRow = () => {
    setImportData([...importData, { listingId: '', quantity: '' }]);
  };

  const handleImportChange = (index, field, value) => {
    const newImportData = [...importData];
    newImportData[index][field] = value;
    setImportData(newImportData);
  };

  const handleRemoveImportRow = (index) => {
    setImportData(importData.filter((_, i) => i !== index));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString, index, totalDays) => {
    if (!dateString || typeof dateString !== 'string') return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');

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
    const date = new Date(dateString);
    const vietnamDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, 
      timeZone: 'Asia/Ho_Chi_Minh',
    };
    return vietnamDate.toLocaleString('vi-VN', options);
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
    setCarListings([]);
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
  
  // New functions for the create showroom modal
  const handleCreateShowroom = () => {
    setShowCreateShowroomModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateShowroomModal(false);
  };

  const handleShowroomCreated = () => {
    fetchShowrooms();
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
    const maxSold = Math.max(...selectedShowroom.salesData.map(s => s.sold || 0));
    const safeMaxSold = maxSold === 0 ? 1 : maxSold;
    const totalSalesDays = selectedShowroom.salesData.length;

    const chartData = {
      labels: selectedShowroom.salesData.map((day, index) => formatDate(day.saleDate, index, totalSalesDays)),
      datasets: [{
        label: 'Sales',
        data: selectedShowroom.salesData.map(day => day.sold || 0),
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
            max: safeMaxSold * 1.2
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

            {/* Import Modal */}
            {showImportModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                  <h2 className="text-xl font-semibold mb-4">Import Inventory</h2>
                  <div className="space-y-4">
                    {importData.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <select
                          value={item.listingId}
                          onChange={(e) => handleImportChange(index, 'listingId', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Car Model</option>
                          {carListings.map((listing) => (
                            <option key={listing.listingId} value={listing.listingId}>
                              {listing.modelName} ({listing.manufacturerName})
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleImportChange(index, 'quantity', e.target.value)}
                          placeholder="Quantity"
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          min="1"
                        />
                        {importData.length > 1 && (
                          <button
                            onClick={() => handleRemoveImportRow(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={handleAddImportRow}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      + Add Another Item
                    </button>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => {
                        setShowImportModal(false);
                        setImportData([{ listingId: '', quantity: '' }]);
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleImportStock}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      disabled={importData.some(item => !item.listingId || !item.quantity || item.quantity <= 0)}
                    >
                      Import
                    </button>
                  </div>
                </div>
              </div>
            )}

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
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Sales Performance</h3>
                <div className="relative h-64">
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </div>

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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Showroom Management</h1>
              <p className="text-gray-600">Monitor and manage showroom performance</p>
            </div>
            <div className="flex items-center space-x-3">
              {/* Thêm nút "Create Showroom" ở đây */}
              <button
                onClick={handleCreateShowroom}
                className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Showroom
              </button>
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

          {/* Conditional rendering of the new modal */}
          <CreateShowroomModal
            isOpen={showCreateShowroomModal}
            onClose={handleCloseCreateModal}
            onShowroomCreated={handleShowroomCreated}
          />
          {/* Existing content of the component */}
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
                      <span>Managed by: {showroom.mainSeller ? showroom.mainSeller.fullName : 'Not yet managed'}</span>

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