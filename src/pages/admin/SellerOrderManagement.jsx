import React, { useState, useEffect } from 'react';
import {
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PencilSquareIcon,
  EyeIcon,
  ShoppingCartIcon,
  MagnifyingGlassIcon,
  UserIcon,
  CreditCardIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import { getApiBaseUrl } from "../../../util/apiconfig";


const statusMap = {
  1: { name: 'Pending Deposit', color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
  2: { name: 'Deposit Paid', color: 'bg-blue-100 text-blue-800', icon: CreditCardIcon },
  3: { name: 'Pending Full Payment', color: 'bg-indigo-100 text-indigo-800', icon: CreditCardIcon },
  4: { name: 'Payment Complete', color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
  5: { name: 'Ready for Delivery', color: 'bg-teal-100 text-teal-800', icon: TruckIcon },
  6: { name: 'Delivered', color: 'bg-emerald-100 text-emerald-800', icon: CheckCircleIcon },
  7: { name: 'Cancelled', color: 'bg-red-100 text-red-800', icon: ExclamationTriangleIcon },
  8: { name: 'Refunded', color: 'bg-gray-100 text-gray-800', icon: ExclamationTriangleIcon },
};

// Hàm này lấy trạng thái mới nhất từ mảng statusHistory
const getLastStatus = (order) => {
  if (order.statusHistory && order.statusHistory.length > 0) {
    const sortedHistory = [...order.statusHistory].sort((a, b) => new Date(a.date) - new Date(b.date));
    return sortedHistory[sortedHistory.length - 1];
  }
  // Fallback nếu không có lịch sử, dùng trạng thái hiện tại
  return order.currentSaleStatus || { id: 0, name: 'Unknown' };
};

const SellerOrderManagement = () => {
  const API_BASE = getApiBaseUrl();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateData, setUpdateData] = useState({
    saleStatusId: '',
    estimatedDeliveryDate: '',
    actualDeliveryDate: '',
    notes: ''
  });
  const [filterStatusId, setFilterStatusId] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [updating, setUpdating] = useState(false);

  const getToken = () => localStorage.getItem('token');

  // Hàm này vẫn giữ nguyên chức năng lọc theo xe và lấy status mới nhất
  const getUniqueOrdersByVehicle = (ordersList) => {
    const vehicleMap = new Map();
    const statusPriority = {
      6: 6, // Delivered
      4: 5, // Payment Complete  
      5: 4, // Ready for Delivery
      2: 3, // Deposit Paid
      3: 2, // Pending Full Payment
      1: 1, // Pending Deposit
      7: 0, // Cancelled
      8: 0, // Refunded
      0: 0  // Unknown
    };

    ordersList.forEach(order => {
      let vehicleKey;
      
      if (order.carDetails?.listingId) {
        vehicleKey = order.carDetails.listingId.toString();
      } else if (order.carDetails) {
        vehicleKey = `${order.carDetails.make}_${order.carDetails.model}_${order.carDetails.year}_${order.carDetails.vin || ''}`;
      } else {
        vehicleKey = order.orderId || order.saleId;
      }

      if (!vehicleKey) return;

      const orderDate = new Date(order.orderDate || order.updatedAt || order.createdAt || 0);
      const currentOrder = vehicleMap.get(vehicleKey);

      if (!currentOrder) {
        vehicleMap.set(vehicleKey, order);
      } else {
        const currentDate = new Date(currentOrder.orderDate || currentOrder.updatedAt || currentOrder.createdAt || 0);
        const currentStatusId = getLastStatus(currentOrder)?.id || 0;
        const newStatusId = getLastStatus(order)?.id || 0;
        const currentPriority = statusPriority[currentStatusId] || 0;
        const newPriority = statusPriority[newStatusId] || 0;

        if (orderDate > currentDate || 
           (orderDate.getTime() === currentDate.getTime() && newPriority > currentPriority)) {
          vehicleMap.set(vehicleKey, order);
        }
      }
    });

    return Array.from(vehicleMap.values());
  };

  const fetchSellerOrders = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE}/api/Seller/orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const uniqueOrders = getUniqueOrdersByVehicle(data);
        setOrders(uniqueOrders);
      } else if (response.status === 401) {
        Swal.fire('Error', 'Please login to access seller dashboard', 'error');
      } else {
        const errorData = await response.json();
        Swal.fire('Error', `Failed to fetch orders: ${errorData.message || response.statusText}`, 'error');
      }
    } catch (error) {
      console.error('Error fetching seller orders:', error);
      Swal.fire('Error', 'Could not connect to server to fetch orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  const handleViewDetails = async (order) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE}/api/Seller/orders/${order.orderId || order.saleId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const detailedOrder = await response.json();
        // Sắp xếp lịch sử trạng thái theo ngày
        const sortedHistory = detailedOrder.statusHistory.sort((a, b) => new Date(a.date) - new Date(b.date));
        setSelectedOrder({ ...detailedOrder, statusHistory: sortedHistory });
      } else {
        setSelectedOrder(order);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      setSelectedOrder(order);
    }
    
    setShowDetailModal(true);
  };

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    const lastStatus = getLastStatus(order);
    setUpdateData({
      saleStatusId: lastStatus?.id.toString() || '1',
      estimatedDeliveryDate: order.expectedDeliveryDate ? order.expectedDeliveryDate.split('T')[0] : '',
      actualDeliveryDate: order.actualDeliveryDate ? order.actualDeliveryDate.split('T')[0] : '',
      notes: lastStatus?.notes || order.notes || ''
    });
    setShowUpdateModal(true);
  };

  const handleSaveUpdate = async () => {
    if (!selectedOrder) return;
    
    setUpdating(true);
    try {
      const token = getToken();
      const payload = {
        saleStatusId: parseInt(updateData.saleStatusId),
        expectedDeliveryDate: updateData.estimatedDeliveryDate ? new Date(updateData.estimatedDeliveryDate).toISOString() : null,
        actualDeliveryDate: updateData.actualDeliveryDate ? new Date(updateData.actualDeliveryDate).toISOString() : null,
        notes: updateData.notes
      };

      const response = await fetch(`${API_BASE}/api/Seller/orders/${selectedOrder.orderId || selectedOrder.saleId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        await fetchSellerOrders();
        setShowUpdateModal(false);
        Swal.fire('Success', 'Order status updated successfully!', 'success');
      } else {
        const errorData = await response.json();
        Swal.fire('Error', `Failed to update order status: ${errorData.message || response.statusText}`, 'error');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      Swal.fire('Error', 'Error updating order status. Please try again.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === '' || 
      (order.orderNumber && order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.customerInfo?.name && order.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.carDetails && `${order.carDetails.make} ${order.carDetails.model}`.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterStatusId === 'All' || (getLastStatus(order)?.id && getLastStatus(order).id.toString() === filterStatusId);
    
    return matchesSearch && matchesFilter;
  });

  const ordersToDisplay = filteredOrders;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3452e1]"></div>
          <p className="text-[#3452e1] text-lg font-semibold">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#253887] mb-2">Order Management</h1>
          <p className="text-gray-600">Manage customer orders and their sales status - One status per vehicle</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-grow w-full lg:w-auto">
              <input
                type="text"
                placeholder="Search by Order No., Customer Name, or Car..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3452e1] focus:border-transparent shadow-sm transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>

            <div className="w-full lg:w-auto">
              <select
                className="w-full lg:w-48 px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#3452e1] focus:border-transparent bg-white text-gray-700 transition-all duration-200"
                value={filterStatusId}
                onChange={(e) => setFilterStatusId(e.target.value)}
              >
                <option value="All">All Sale Status</option>
                {Object.entries(statusMap).map(([id, status]) => (
                  <option key={id} value={id}>{status.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        {ordersToDisplay.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="mb-6">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                <ShoppingCartIcon className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-[#253887] mb-2">No Orders Found</h3>
              <p className="text-gray-600">
                {orders.length === 0 
                  ? "No orders to manage yet." 
                  : "No orders match your search criteria."
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-[#f8faff] to-[#f0f4ff]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order Details</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Current Status</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {ordersToDisplay.map(order => {
                    const lastStatus = getLastStatus(order);
                    const statusConfig = statusMap[lastStatus.id] || { color: 'bg-gray-100 text-gray-800' };
                    return (
                      <tr key={`${order.carDetails?.listingId || order.orderId || order.saleId}_${lastStatus.id}`} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-[#253887]">#{order.orderNumber || order.orderId}</div>
                          <div className="text-xs text-gray-500">
                            {order.orderDate ? new Date(order.orderDate).toLocaleDateString('vi-VN') : 'N/A'}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            ₫{(order.finalPrice || 0).toLocaleString('vi-VN')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {order.customerInfo?.name || order.customerDetails?.fullName || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.customerInfo?.phone || order.customerDetails?.phoneNumber || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {order.carDetails?.imageUrl && (
                              <img
                                src={order.carDetails.imageUrl}
                                alt="Car"
                                className="h-12 w-12 rounded-lg object-cover mr-3 border border-gray-200"
                              />
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {order.carDetails ? `${order.carDetails.make} ${order.carDetails.model}` : 'N/A'}
                              </div>
                              <div className="text-xs text-gray-500">
                                {order.carDetails?.year || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusConfig.color}`}>
                            {lastStatus.name || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleViewDetails(order)}
                              className="inline-flex items-center justify-center w-8 h-8 text-blue-600 hover:text-white hover:bg-blue-600 rounded-full transition-all duration-200"
                              title="View Details"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(order)}
                              className="inline-flex items-center justify-center w-8 h-8 text-green-600 hover:text-white hover:bg-green-600 rounded-full transition-colors duration-200"
                              title="Update Status"
                            >
                              <PencilSquareIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Order Detail Modal */}
        {showDetailModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-auto max-h-[95vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-gray-200 px-8 py-6 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <ShoppingCartIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                    <p className="text-gray-600">#{selectedOrder.orderNumber || selectedOrder.orderId}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Customer Information */}
                  <div className="space-y-6">
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <UserIcon className="h-5 w-5 mr-2 text-blue-600" />
                        Customer Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium">{selectedOrder.customerInfo?.name || selectedOrder.customerDetails?.fullName || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone:</span>
                          <span className="font-medium">{selectedOrder.customerInfo?.phone || selectedOrder.customerDetails?.phoneNumber || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium">{selectedOrder.customerInfo?.email || selectedOrder.customerDetails?.email || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Vehicle Information */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Vehicle Details</h3>
                      {selectedOrder.carDetails?.imageUrl && (
                        <img
                          src={selectedOrder.carDetails.imageUrl}
                          alt="Car"
                          className="w-full h-48 rounded-lg object-cover mb-4 border border-gray-200"
                        />
                      )}
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Make & Model:</span>
                          <span className="font-medium">{selectedOrder.carDetails ? `${selectedOrder.carDetails.make} ${selectedOrder.carDetails.model}` : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Year:</span>
                          <span className="font-medium">{selectedOrder.carDetails?.year || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Price:</span>
                          <span className="font-medium">₫{(selectedOrder.finalPrice || 0).toLocaleString('vi-VN')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery & Payment Information */}
                  <div className="space-y-6">
                    {/* Status & Delivery Information */}
                    <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <TruckIcon className="h-5 w-5 mr-2 text-green-600" />
                        Status & Delivery Information
                      </h3>
                      <div className="space-y-3">
                        {/* HIỂN THỊ STATUS TIMELINE */}
                        {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 ? (
                          <div className="mb-4">
                            <h4 className="font-semibold mb-2 text-gray-700">Status Timeline</h4>
                            <div className="border-l-2 border-gray-200 pl-4 space-y-4">
                              {selectedOrder.statusHistory.map((status, idx) => {
                                const config = statusMap[status.id] || { color: 'bg-gray-100 text-gray-800' };
                                return (
                                  <div key={idx} className="relative">
                                    <div className="absolute w-4 h-4 bg-gray-400 rounded-full mt-1 -left-6 border-2 border-white" />
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>{status.name}</span>
                                    <p className="text-xs text-gray-500 mt-1">{status.date ? new Date(status.date).toLocaleString('vi-VN') : ''}</p>
                                    {status.notes && <p className="text-sm text-gray-600 mt-1">{status.notes}</p>}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusMap[selectedOrder.currentSaleStatus?.id]?.color || 'bg-gray-100 text-gray-800'}`}>
                              {selectedOrder.currentSaleStatus?.name || 'N/A'}
                            </span>
                          </div>
                        )}
                        {selectedOrder.expectedDeliveryDate && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Expected Date:</span>
                            <span className="font-medium">{new Date(selectedOrder.expectedDeliveryDate).toLocaleDateString('vi-VN')}</span>
                          </div>
                        )}
                        {selectedOrder.actualDeliveryDate && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Actual Date:</span>
                            <span className="font-medium text-green-600">{new Date(selectedOrder.actualDeliveryDate).toLocaleDateString('vi-VN')}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Payment Information */}
                    <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <CreditCardIcon className="h-5 w-5 mr-2 text-yellow-600" />
                        Payment Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Amount:</span>
                          <span className="font-bold text-lg">₫{(selectedOrder.finalPrice || 0).toLocaleString('vi-VN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Deposit Paid:</span>
                          <span className="font-medium text-green-600">₫{(selectedOrder.depositAmount || 0).toLocaleString('vi-VN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Remaining:</span>
                          <span className="font-medium text-red-600">₫{(selectedOrder.remainingBalance || 0).toLocaleString('vi-VN')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 border-t border-gray-200 px-8 py-6 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Order placed on {selectedOrder.orderDate ? new Date(selectedOrder.orderDate).toLocaleDateString('vi-VN') : 'N/A'}
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                        setShowDetailModal(false);
                        handleUpdateStatus(selectedOrder);
                    }}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Update Status
                  </button>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Update Status Modal */}
        {showUpdateModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Update Sale Status</h2>
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sale Status</label>
                  <select
                    value={updateData.saleStatusId}
                    onChange={(e) => setUpdateData({...updateData, saleStatusId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Object.entries(statusMap).map(([id, status]) => (
                      <option key={id} value={id}>{status.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expected Delivery Date</label>
                  <input
                    type="date"
                    value={updateData.estimatedDeliveryDate}
                    onChange={(e) => setUpdateData({...updateData, estimatedDeliveryDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {(updateData.saleStatusId === '6') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Actual Delivery Date</label>
                    <input
                      type="date"
                      value={updateData.actualDeliveryDate}
                      onChange={(e) => setUpdateData({...updateData, actualDeliveryDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                  <textarea
                    value={updateData.notes}
                    onChange={(e) => setUpdateData({...updateData, notes: e.target.value})}
                    rows={3}
                    placeholder="Add any notes about the delivery..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
                <button
                  onClick={() => setShowUpdateModal(false)}
                  disabled={updating}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveUpdate}
                  disabled={updating}
                  className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {updating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Update Status</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerOrderManagement;