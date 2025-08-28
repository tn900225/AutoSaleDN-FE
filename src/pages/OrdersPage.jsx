import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from "../components/Login";
import Swal from 'sweetalert2';
import {
  InformationCircleIcon,
  WalletIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  TruckIcon,
  MapPinIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PhoneIcon,
  UserIcon,
  DocumentTextIcon,
  BanknotesIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';


export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // States for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All'); // Default to show all statuses

  const fetchOrders = async () => { // Moved fetchOrders into a separate function
    setLoading(true);
    setShowSignInModal(false);

    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const ordersResponse = await fetch("/api/Customer/orders", {
        method: 'GET',
        headers: headers,
      });

      if (ordersResponse.ok) {
        const data = await ordersResponse.json();
        setOrders(data);
      } else if (ordersResponse.status === 401) {
        setShowSignInModal(true);
      } else {
        const errorData = await ordersResponse.json();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `Failed to fetch orders: ${errorData.message || ordersResponse.statusText}`,
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Could not connect to the server to fetch orders. Please try again.",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(); // Initial fetch
  }, []); // Empty dependency array means it runs once on mount

  const getStatusConfig = (status) => {
    switch (status) {
      case "Sold":
        return {
          bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
          textColor: 'text-green-700',
          icon: CheckCircleIcon,
          borderColor: 'border-green-200'
        };
      case "On Hold":
        return {
          bgColor: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
          textColor: 'text-yellow-700',
          icon: ClockIcon,
          borderColor: 'border-yellow-200'
        };
      case "Deposit Paid":
        return {
          bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
          textColor: 'text-blue-700',
          icon: CreditCardIcon,
          borderColor: 'border-blue-200'
        };
      case "Available":
        return {
          bgColor: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
          textColor: 'text-emerald-700',
          icon: CheckCircleIcon,
          borderColor: 'border-emerald-200'
        };
      default:
        return {
          bgColor: 'bg-gradient-to-r from-gray-500 to-gray-600',
          textColor: 'text-gray-700',
          icon: ExclamationTriangleIcon,
          borderColor: 'border-gray-200'
        };
    }
  };

  const getStatusBadgeClass = (status) => {
    return getStatusConfig(status).bgColor;
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedOrder(null);
  };

   const handlePayRemaining = async () => {
    if (selectedOrder) {
      Swal.fire({
        icon: "info",
        title: "Pay Remaining Amount",
        text: `Do you want to pay ₫${selectedOrder.remainingBalance.toLocaleString('en-US')} for order #${selectedOrder.orderNumber}?`,
        showCancelButton: true,
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const token = localStorage.getItem('token');
            if (!token) {
              Swal.fire({
                icon: 'error',
                title: 'Authentication Error',
                text: 'Please log in again to proceed.',
              });
              return;
            }

            const orderId = selectedOrder.saleId;
            const fullPaymentPayload = {
              paymentMethod: "Bank Transfer", // Assuming 'Bank Transfer' for a direct payment.
              actualDeliveryDate: selectedOrder.expectedDeliveryDate, 
            };

            const response = await fetch(`/api/Customer/orders/${orderId}/full-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify(fullPaymentPayload),
            });

            if (response.ok) {
              const data = await response.json();
              Swal.fire({
                icon: "success",
                title: "Success!",
                text: data.message,
                confirmButtonText: "OK",
              }).then(() => {
                handleCloseDetailModal();
                fetchOrders();
              });
            } else {
              const errorData = await response.json();
              Swal.fire({
                icon: "error",
                title: "Error",
                text: errorData.message || `Failed to process payment: ${response.statusText}`,
                confirmButtonText: "OK",
              });
            }
          } catch (error) {
            console.error("Error processing full payment:", error);
            Swal.fire({
              icon: "error",
              title: "Network Error",
              text: "Could not connect to the server to process payment. Please try again.",
              confirmButtonText: "OK",
            });
          }
        }
      });
    }
  };

  // Memoized filtered orders for performance
  const filteredOrders = useMemo(() => {
    let currentOrders = [...orders];

    // Apply search term filter
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentOrders = currentOrders.filter(order =>
        order.orderNumber?.toLowerCase().includes(lowerCaseSearchTerm) ||
        order.carDetails?.make?.toLowerCase().includes(lowerCaseSearchTerm) ||
        order.carDetails?.model?.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    // Apply status filter
    if (filterStatus !== 'All') {
      currentOrders = currentOrders.filter(order =>
        order.currentSaleStatus === filterStatus
      );
    }

    return currentOrders;
  }, [orders, searchTerm, filterStatus]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3452e1]"></div>
          <p className="text-[#3452e1] text-lg font-semibold">Loading your orders...</p>
        </div>
      </div>
    );
  }

  const hasOrdersToShow = filteredOrders.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#253887] mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your car purchases</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-grow w-full lg:w-auto">
              <input
                type="text"
                placeholder="Search by Order No. or Car Name..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3452e1] focus:border-transparent shadow-sm transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>

            <div className="w-full lg:w-auto">
              <select
                className="w-full lg:w-48 px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#3452e1] focus:border-transparent bg-white text-gray-700 transition-all duration-200"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Available">Available</option>
                <option value="On Hold">On Hold</option>
                <option value="Deposit Paid">Deposit Paid</option>
                <option value="Sold">Sold</option>
              </select>
            </div>
          </div>
        </div>

        {!hasOrdersToShow && !loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="mb-6">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                <InformationCircleIcon className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-[#253887] mb-2">
                {orders.length === 0 ? "No Orders Yet" : "No Matching Orders"}
              </h3>
              <p className="text-gray-600">
                {orders.length === 0
                  ? "You haven't placed any orders yet. Start exploring our amazing car collection!"
                  : "No orders match your search and filter criteria. Try adjusting your filters."
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
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Vehicle</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Due Date</th>
                    <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredOrders.map(order => (
                    <tr key={order.orderId} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-[#253887]">#{order.orderNumber || order.orderId}</div>
                        <div className="text-xs text-gray-500">
                          {order.orderDate ? new Date(order.orderDate).toLocaleDateString('vi-VN') : 'N/A'}
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
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.currentSaleStatus)} text-white shadow-sm`}>
                          {order.currentSaleStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.currentSaleStatus === "Deposit Paid" && order.remainingBalance > 0 ? (
                          <div className="flex items-center">
                            <CalendarDaysIcon className="h-4 w-4 text-gray-400 mr-1" />
                            {order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toLocaleDateString('vi-VN') : 'N/A'}
                          </div>
                        ) : (
                          <span className="text-gray-500">
                            {order.currentSaleStatus === "Sold" ? "Completed" : "N/A"}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="inline-flex items-center justify-center w-10 h-10 text-[#3452e1] hover:text-white hover:bg-[#3452e1] rounded-full transition-all duration-200 hover:shadow-md"
                          title="View Details"
                        >
                          <InformationCircleIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* NEW REDESIGNED MODAL */}
        {showDetailModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl mx-auto max-h-[95vh] overflow-hidden flex flex-col">

              {/* Header */}
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-gray-200 px-8 py-6 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
                    <p className="text-gray-600">Order #{selectedOrder.orderNumber || selectedOrder.orderId}</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseDetailModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-8 space-y-8">

                  {/* Order Status Timeline */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900">Order Status</h3>
                      <div className="flex items-center space-x-3">
                        {(() => {
                          const statusConfig = getStatusConfig(selectedOrder.currentSaleStatus);
                          const StatusIcon = statusConfig.icon;
                          return (
                            <>
                              <StatusIcon className={`h-6 w-6 ${statusConfig.textColor}`} />
                              <span className={`px-4 py-2 rounded-full text-white font-semibold text-sm ${statusConfig.bgColor}`}>
                                {selectedOrder.currentSaleStatus}
                              </span>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="relative">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col items-center space-y-2">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <ShoppingCartIcon className="h-4 w-4 text-white" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-900">Order Placed</p>
                            <p className="text-xs text-gray-500">
                              {selectedOrder.orderDate ? new Date(selectedOrder.orderDate).toLocaleDateString('vi-VN') : 'N/A'}
                            </p>
                          </div>
                        </div>

                        <div className={`flex-1 h-0.5 mx-4 ${selectedOrder.depositPaymentDetails ? 'bg-green-500' : 'bg-gray-300'}`}></div>

                        <div className="flex flex-col items-center space-y-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedOrder.depositPaymentDetails ? 'bg-green-500' : 'bg-gray-300'}`}>
                            <CreditCardIcon className={`h-4 w-4 ${selectedOrder.depositPaymentDetails ? 'text-white' : 'text-gray-500'}`} />
                          </div>
                          <div className="text-center">
                            <p className={`text-sm font-medium ${selectedOrder.depositPaymentDetails ? 'text-gray-900' : 'text-gray-500'}`}>Deposit Paid</p>
                            <p className="text-xs text-gray-500">
                              {selectedOrder.depositPaymentDetails?.dateOfPayment
                                ? new Date(selectedOrder.depositPaymentDetails.dateOfPayment).toLocaleDateString('vi-VN')
                                : 'Pending'
                              }
                            </p>
                          </div>
                        </div>

                        <div className={`flex-1 h-0.5 mx-4 ${selectedOrder.fullPaymentDetails ? 'bg-green-500' : 'bg-gray-300'}`}></div>

                        <div className="flex flex-col items-center space-y-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedOrder.fullPaymentDetails ? 'bg-green-500' : 'bg-gray-300'}`}>
                            <BanknotesIcon className={`h-4 w-4 ${selectedOrder.fullPaymentDetails ? 'text-white' : 'text-gray-500'}`} />
                          </div>
                          <div className="text-center">
                            <p className={`text-sm font-medium ${selectedOrder.fullPaymentDetails ? 'text-gray-900' : 'text-gray-500'}`}>Full Payment</p>
                            <p className="text-xs text-gray-400">
                              {selectedOrder.fullPaymentDetails?.dateOfPayment
                                ? new Date(selectedOrder.fullPaymentDetails.dateOfPayment).toLocaleDateString('vi-VN')
                                : 'Pending'
                              }
                            </p>
                          </div>
                        </div>

                        <div className={`flex-1 h-0.5 mx-4 ${selectedOrder.actualDeliveryDate ? 'bg-green-500' : 'bg-gray-300'}`}></div>

                        <div className="flex flex-col items-center space-y-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedOrder.actualDeliveryDate ? 'bg-green-500' : 'bg-gray-300'}`}>
                            <TruckIcon className={`h-4 w-4 ${selectedOrder.actualDeliveryDate ? 'text-white' : 'text-gray-500'}`} />
                          </div>
                          <div className="text-center">
                            <p className={`text-sm font-medium ${selectedOrder.actualDeliveryDate ? 'text-gray-900' : 'text-gray-500'}`}>Delivered</p>
                            <p className="text-xs text-gray-400">
                              {selectedOrder.actualDeliveryDate
                                ? new Date(selectedOrder.actualDeliveryDate).toLocaleDateString('vi-VN')
                                : 'Pending'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Vehicle Information */}
                    <div className="space-y-6">
                      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            🚗
                          </div>
                          Vehicle Details
                        </h3>

                        <div className="space-y-4">
                          {selectedOrder.carDetails?.imageUrl && (
                            <img
                              src={selectedOrder.carDetails.imageUrl}
                              alt="Car"
                              className="w-full h-48 rounded-lg object-cover border border-gray-200"
                            />
                          )}

                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-xl font-bold text-gray-900 mb-3">
                              {selectedOrder.carDetails ? `${selectedOrder.carDetails.make} ${selectedOrder.carDetails.model}` : 'N/A'}
                            </h4>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Year:</span>
                                <span className="font-medium text-gray-900">{selectedOrder.carDetails?.year || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Mileage:</span>
                                <span className="font-medium text-gray-900">
                                  {selectedOrder.carDetails?.mileage ? `${selectedOrder.carDetails.mileage.toLocaleString()} km` : 'N/A'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Engine:</span>
                                <span className="font-medium text-gray-900">{selectedOrder.carDetails?.engine || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Transmission:</span>
                                <span className="font-medium text-gray-900">{selectedOrder.carDetails?.transmission || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between col-span-2">
                                <span className="text-gray-600">Fuel Type:</span>
                                <span className="font-medium text-gray-900">{selectedOrder.carDetails?.fuelType || 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Payment Summary */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                            💰
                          </div>
                          Payment Summary
                        </h3>

                        <div className="space-y-4">
                          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-blue-700 font-medium">Total Amount</span>
                              <span className="text-2xl font-bold text-blue-900">
                                ₫{selectedOrder.finalPrice ? selectedOrder.finalPrice.toLocaleString('vi-VN') : 'N/A'}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                              <span className="text-gray-600">Deposit Paid</span>
                              <span className="font-semibold text-green-600">
                                ₫{selectedOrder.depositPaymentDetails?.amount ? selectedOrder.depositPaymentDetails.amount.toLocaleString('vi-VN') : '0'}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                              <span className="text-gray-600">Remaining Balance</span>
                              <span className="font-semibold text-red-600">
                                ₫{selectedOrder.remainingBalance ? selectedOrder.remainingBalance.toLocaleString('vi-VN') : '0'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order & Delivery Information */}
                    <div className="space-y-6">

                      {/* Seller Information */}
                      {selectedOrder.sellerDetails && (
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                              🏪
                            </div>
                            Seller Information
                          </h3>

                          <div className="space-y-4">
                            {/* Store Information */}
                            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
                              <h4 className="font-semibold text-orange-800 mb-3 flex items-center">
                                🏢 Store Details
                              </h4>
                              <div className="grid grid-cols-1 gap-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-orange-700">Store Name:</span>
                                  <span className="font-medium text-orange-900">{selectedOrder.pickupLocationDetails.name || 'N/A'}</span>
                                </div>
                                <div className="flex items-start justify-between">
                                  <span className="text-orange-700">Address:</span>
                                  <span className="font-medium text-orange-900 text-right max-w-xs">
                                    {selectedOrder.pickupLocationDetails.address || 'N/A'}
                                  </span>
                                </div>
                                {selectedOrder.sellerDetails.storePhone && (
                                  <div className="flex justify-between">
                                    <span className="text-orange-700">Store Phone:</span>
                                    <span className="font-medium text-orange-900">{selectedOrder.sellerDetails.storePhone}</span>
                                  </div>
                                )}
                                {selectedOrder.sellerDetails.storeEmail && (
                                  <div className="flex justify-between">
                                    <span className="text-orange-700">Store Email:</span>
                                    <span className="font-medium text-orange-900">{selectedOrder.sellerDetails.storeEmail}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Seller Contact Information */}
                            {selectedOrder.sellerDetails.sellerInfo && (
                              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                                <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                                  👤 Sales Representative
                                </h4>
                                <div className="grid grid-cols-1 gap-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-blue-700">Name:</span>
                                    <span className="font-medium text-blue-900">{selectedOrder.sellerDetails.sellerInfo.fullName || 'N/A'}</span>
                                  </div>
                                  {selectedOrder.sellerDetails.sellerInfo.role && (
                                    <div className="flex justify-between">
                                      <span className="text-blue-700">Role:</span>
                                      <span className="font-medium text-blue-900">{selectedOrder.sellerDetails.sellerInfo.role}</span>
                                    </div>
                                  )}
                                  {selectedOrder.sellerDetails.sellerInfo.phoneNumber && (
                                    <div className="flex justify-between">
                                      <span className="text-blue-700">Phone:</span>
                                      <span className="font-medium text-blue-900">{"0" + selectedOrder.sellerDetails.sellerInfo.phoneNumber}</span>
                                    </div>
                                  )}
                                  {selectedOrder.sellerDetails.sellerInfo.email && (
                                    <div className="flex justify-between">
                                      <span className="text-blue-700">Email:</span>
                                      <span className="font-medium text-blue-900">{selectedOrder.sellerDetails.sellerInfo.email}</span>
                                    </div>
                                  )}
                                </div>

                                {/* Contact Actions */}
                                <div className="mt-4 flex flex-wrap gap-2">
                                  {selectedOrder.sellerDetails.sellerInfo.phoneNumber && (
                                    <a
                                      href={`tel:${selectedOrder.sellerDetails.sellerInfo.phoneNumber}`}
                                      className="inline-flex items-center px-3 py-2 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-colors duration-200"
                                    >
                                      <PhoneIcon className="h-3 w-3 mr-1" />
                                      Call
                                    </a>
                                  )}
                                  {selectedOrder.sellerDetails.sellerInfo.email && (
                                    <a
                                      href={`mailto:${selectedOrder.sellerDetails.sellerInfo.email}?subject=Regarding Order ${selectedOrder.orderNumber || selectedOrder.orderId}`}
                                      className="inline-flex items-center px-3 py-2 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors duration-200"
                                    >
                                      ✉️ Email
                                    </a>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Payment History */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                            📋
                          </div>
                          Payment History
                        </h3>

                        <div className="space-y-4">
                          {/* Deposit Payment */}
                          {selectedOrder.depositPaymentDetails && (
                            <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                  <span className="font-semibold text-green-800">Deposit Payment</span>
                                </div>
                                <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                  {selectedOrder.depositPaymentDetails.paymentStatus || 'Completed'}
                                </span>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-green-700">Amount:</span>
                                  <span className="font-semibold text-green-800">
                                    ₫{selectedOrder.depositPaymentDetails.amount ? selectedOrder.depositPaymentDetails.amount.toLocaleString('vi-VN') : 'N/A'}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-green-700">Method:</span>
                                  <span className="text-green-800">{selectedOrder.depositPaymentDetails.paymentMethod || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-green-700">Date:</span>
                                  <span className="text-green-800">
                                    {selectedOrder.depositPaymentDetails.dateOfPayment ? new Date(selectedOrder.depositPaymentDetails.dateOfPayment).toLocaleDateString('vi-VN') : 'N/A'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Full Payment */}
                          {selectedOrder.fullPaymentDetails ? (
                            <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                  <span className="font-semibold text-green-800">Full Payment</span>
                                </div>
                                <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                  {selectedOrder.fullPaymentDetails.paymentStatus || 'Completed'}
                                </span>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-green-700">Amount:</span>
                                  <span className="font-semibold text-green-800">
                                    ₫{selectedOrder.fullPaymentDetails.amount ? selectedOrder.fullPaymentDetails.amount.toLocaleString('vi-VN') : 'N/A'}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-green-700">Method:</span>
                                  <span className="text-green-800">{selectedOrder.fullPaymentDetails.paymentMethod || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-green-700">Date:</span>
                                  <span className="text-green-800">
                                    {selectedOrder.fullPaymentDetails.dateOfPayment ? new Date(selectedOrder.fullPaymentDetails.dateOfPayment).toLocaleDateString('vi-VN') : 'N/A'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            /* Remaining Payment */
                            selectedOrder.remainingBalance > 0 && (
                              <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center space-x-2">
                                    <ClockIcon className="h-5 w-5 text-orange-600" />
                                    <span className="font-semibold text-orange-800">Remaining Payment</span>
                                  </div>
                                  <span className="text-sm text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                                    Pending
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-orange-700">Amount Due:</span>
                                  <span className="font-bold text-xl text-orange-800">
                                    {selectedOrder.remainingBalance.toLocaleString('vi-VN')} ₫
                                  </span>
                                </div>
                                {selectedOrder.expectedDeliveryDate && (
                                  <div className="flex justify-between items-center">
                                    <span className="text-orange-700">Payment Due Date:</span>
                                    <span className="font-semibold text-orange-800">
                                      {
                                        // Calculate and format the date: Expected Delivery Date - 1 day
                                        new Date(new Date(selectedOrder.expectedDeliveryDate).setDate(new Date(selectedOrder.expectedDeliveryDate).getDate() - 1)).toLocaleDateString('vi-VN')
                                      }
                                    </span>
                                  </div>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* Delivery Information */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                            🚚
                          </div>
                          Delivery Information
                        </h3>

                        {selectedOrder.shippingAddressDetails ? (
                          <div className="space-y-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="grid grid-cols-1 gap-3 text-sm">
                                <div className="flex items-center space-x-2">
                                  <UserIcon className="h-4 w-4 text-gray-500" />
                                  <span className="text-gray-600">Recipient:</span>
                                  <span className="font-medium text-gray-900">{selectedOrder.shippingAddressDetails.recipientName || 'N/A'}</span>
                                </div>
                                <div className="flex items-start space-x-2">
                                  <MapPinIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                                  <div>
                                    <span className="text-gray-600">Address:</span>
                                    <p className="font-medium text-gray-900">
                                      {selectedOrder.shippingAddressDetails.address || 'N/A'}<br />
                                      {selectedOrder.shippingAddressDetails.city}, {selectedOrder.shippingAddressDetails.state} {selectedOrder.shippingAddressDetails.zipCode}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <CalendarDaysIcon className="h-4 w-4 text-gray-500" />
                                  <span className="text-gray-600">Expected Delivery:</span>
                                  <span className="font-medium text-gray-900">
                                    {selectedOrder.expectedDeliveryDate ? new Date(selectedOrder.expectedDeliveryDate).toLocaleDateString('vi-VN') : 'N/A'}
                                  </span>
                                </div>
                                {selectedOrder.actualDeliveryDate && (
                                  <div className="flex items-center space-x-2">
                                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                    <span className="text-gray-600">Actual Delivery:</span>
                                    <span className="font-medium text-green-700">
                                      {new Date(selectedOrder.actualDeliveryDate).toLocaleDateString('vi-VN')}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : selectedOrder.pickupLocationDetails ? (
                          <div className="space-y-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="grid grid-cols-1 gap-3 text-sm">
                                <div className="flex items-center space-x-2">
                                  <span className="text-gray-600">Option:</span>
                                  <span className="font-medium text-gray-900">{selectedOrder.deliveryOption || 'Pickup'}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-gray-600">Location:</span>
                                  <span className="font-medium text-gray-900">{selectedOrder.pickupLocationDetails.name || 'N/A'}</span>
                                </div>
                                <div className="flex items-start space-x-2">
                                  <MapPinIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                                  <span className="font-medium text-gray-900">{selectedOrder.pickupLocationDetails.address || 'N/A'}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <CalendarDaysIcon className="h-4 w-4 text-gray-500" />
                                  <span className="text-gray-600">Expected Pickup:</span>
                                  <span className="font-medium text-gray-900">
                                    {selectedOrder.expectedDeliveryDate ? new Date(selectedOrder.expectedDeliveryDate).toLocaleDateString('vi-VN') : 'N/A'}
                                  </span>
                                </div>
                                {selectedOrder.actualDeliveryDate && (
                                  <div className="flex items-center space-x-2">
                                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                    <span className="text-gray-600">Actual Pickup:</span>
                                    <span className="font-medium text-green-700">
                                      {new Date(selectedOrder.actualDeliveryDate).toLocaleDateString('vi-VN')}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <ExclamationTriangleIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600">No delivery/pickup information available.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="bg-gray-50 border-t border-gray-200 px-8 py-6 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Order placed on {selectedOrder.orderDate ? new Date(selectedOrder.orderDate).toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </div>
                <div className="flex space-x-4">
                  {selectedOrder.currentSaleStatus === "Deposit Paid" && selectedOrder.remainingBalance > 0 && (
                    <button
                      onClick={handlePayRemaining}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl flex items-center gap-3 hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold"
                    >
                      <WalletIcon className="h-5 w-5" />
                      <span>Pay Remaining Balance</span>
                      <span className="bg-white bg-opacity-20 px-3 py-1 rounded-lg text-sm">
                        ₫{selectedOrder.remainingBalance.toLocaleString('vi-VN')}
                      </span>
                    </button>
                  )}
                  <button
                    onClick={handleCloseDetailModal}
                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-300 transition-colors duration-200 font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Login
        show={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onLoginSuccess={() => {

        }}
      />
    </div>
  );
}