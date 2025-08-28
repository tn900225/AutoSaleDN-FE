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
  ExclamationTriangleIcon
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

  const handlePayRemaining = () => {
    if (selectedOrder) {
      Swal.fire({
        icon: "info",
        title: "Pay Remaining Amount",
        text: `Do you want to pay ₫${selectedOrder.remainingBalance.toLocaleString('vi-VN')} for order ${selectedOrder.orderNumber}?`,
        showCancelButton: true,
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          // TODO: Implement actual payment logic here
          Swal.fire("Success!", "Payment request sent. (This feature requires payment API integration).", "success");
          handleCloseDetailModal(); // Close modal after action
          // You might want to re-fetch orders after a payment attempt
          // fetchOrders();
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
                          {order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-US') : 'N/A'}
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
                            {order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toLocaleDateString('en-US') : 'N/A'}
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

        {showDetailModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl mx-auto relative max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-200 px-8 py-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-[#253887]">Order Details</h2>
                  <p className="text-gray-600">#{selectedOrder.orderNumber || selectedOrder.orderId}</p>
                </div>
                <button
                  onClick={handleCloseDetailModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              <div className="px-8 py-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6 border border-blue-100">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>

                      <h3 className="text-xl font-bold text-[#253887] mb-2">
                        {selectedOrder.carDetails ? `${selectedOrder.carDetails.make} ${selectedOrder.carDetails.model}` : 'N/A'}
                      </h3>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-600">Year:</span>
                          <span className="ml-2 text-gray-800">{selectedOrder.carDetails?.year || 'N/A'}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-600">Mileage:</span>
                          <span className="ml-2 text-gray-800">{selectedOrder.carDetails?.mileage ? selectedOrder.carDetails.mileage.toLocaleString() + ' km' : 'N/A'}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-600">Engine:</span>
                          <span className="ml-2 text-gray-800">{selectedOrder.carDetails?.engine || 'N/A'}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-600">Transmission:</span>
                          <span className="ml-2 text-gray-800">{selectedOrder.carDetails?.transmission || 'N/A'}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-600">Fuel Type:</span>
                          <span className="ml-2 text-gray-800">{selectedOrder.carDetails?.fuelType || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-4">
                      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <h4 className="font-semibold text-gray-800 mb-3">Order Summary</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Amount:</span>
                            <span className="text-2xl font-bold text-[#3452e1]">
                              ₫{selectedOrder.finalPrice ? selectedOrder.finalPrice.toLocaleString('vi-VN') : 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Order Date:</span>
                            <span className="text-gray-800">
                              {selectedOrder.orderDate ? new Date(selectedOrder.orderDate).toLocaleDateString('en-US') : 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Status:</span>
                            <span className={`px-3 py-1 rounded-full text-white font-semibold text-sm ${getStatusBadgeClass(selectedOrder.currentSaleStatus)}`}>
                              {selectedOrder.currentSaleStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {selectedOrder.depositPaymentDetails && (
                    <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                      <div className="flex items-center mb-3">
                        <CreditCardIcon className="h-5 w-5 text-blue-600 mr-2" />
                        <h4 className="font-semibold text-blue-800">Deposit Payment</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-blue-700">Amount:</span>
                          <span className="font-semibold text-blue-800">
                            ₫{selectedOrder.depositPaymentDetails.amount ? selectedOrder.depositPaymentDetails.amount.toLocaleString('vi-VN') : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Method:</span>
                          <span className="text-blue-800">{selectedOrder.depositPaymentDetails.paymentMethod || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Status:</span>
                          <span className="text-blue-800">{selectedOrder.depositPaymentDetails.paymentStatus || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Date:</span>
                          <span className="text-blue-800">
                            {selectedOrder.depositPaymentDetails.dateOfPayment ? new Date(selectedOrder.depositPaymentDetails.dateOfPayment).toLocaleDateString('en-US') : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedOrder.fullPaymentDetails && (
                    <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                      <div className="flex items-center mb-3">
                        <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                        <h4 className="font-semibold text-green-800">Full Payment</h4>
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
                          <span className="text-green-700">Status:</span>
                          <span className="text-green-800">{selectedOrder.fullPaymentDetails.paymentStatus || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Date:</span>
                          <span className="text-green-800">
                            {selectedOrder.fullPaymentDetails.dateOfPayment ? new Date(selectedOrder.fullPaymentDetails.dateOfPayment).toLocaleDateString('en-US') : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>


                <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <TruckIcon className="h-5 w-5 text-gray-600 mr-2" />
                    <h4 className="font-semibold text-gray-800">Delivery/Pickup Information</h4>
                  </div>

                  {selectedOrder.shippingAddressDetails ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="flex items-center mb-2">
                          <span className="font-medium text-gray-600 w-20">Option:</span>
                          <span className="text-gray-800">{selectedOrder.deliveryOption || 'Delivery'}</span>
                        </p>
                        <p className="flex items-center mb-2">
                          <span className="font-medium text-gray-600 w-20">Recipient:</span>
                          <span className="text-gray-800">{selectedOrder.shippingAddressDetails.recipientName || 'N/A'}</span>
                        </p>
                        <p className="flex items-start mb-2">
                          <MapPinIcon className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                          <span className="text-gray-800">
                            {`${selectedOrder.shippingAddressDetails.address}, ${selectedOrder.shippingAddressDetails.city}, ${selectedOrder.shippingAddressDetails.state} ${selectedOrder.shippingAddressDetails.zipCode}`}
                          </span>
                        </p>
                        <p className="flex items-center">
                          <span className="font-medium text-gray-600 w-20">Phone:</span>
                          <span className="text-gray-800">{selectedOrder.shippingAddressDetails.phoneNumber || 'N/A'}</span>
                        </p>
                      </div>
                      <div>
                        <p className="flex items-center mb-2">
                          <CalendarDaysIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="font-medium text-gray-600 mr-2">Expected:</span>
                          <span className="text-gray-800">
                            {selectedOrder.expectedDeliveryDate ? new Date(selectedOrder.expectedDeliveryDate).toLocaleDateString('en-US') : 'N/A'}
                          </span>
                        </p>
                        <p className="flex items-center">
                          <CheckCircleIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="font-medium text-gray-600 mr-2">Actual:</span>
                          <span className="text-gray-800">
                            {selectedOrder.actualDeliveryDate ? new Date(selectedOrder.actualDeliveryDate).toLocaleDateString('en-US') : 'Not Delivered Yet'}
                          </span>
                        </p>
                      </div>
                    </div>
                  ) : selectedOrder.pickupLocationDetails ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="flex items-center mb-2">
                          <span className="font-medium text-gray-600 w-20">Option:</span>
                          <span className="text-gray-800">{selectedOrder.deliveryOption || 'Pickup'}</span>
                        </p>
                        <p className="flex items-center mb-2">
                          <span className="font-medium text-gray-600 w-20">Location:</span>
                          <span className="text-gray-800">{selectedOrder.pickupLocationDetails.name || 'N/A'}</span>
                        </p>
                        <p className="flex items-start mb-2">
                          <MapPinIcon className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                          <span className="text-gray-800">{selectedOrder.pickupLocationDetails.address || 'N/A'}</span>
                        </p>
                        <p className="flex items-center">
                          <span className="font-medium text-gray-600 w-20">Phone:</span>
                          <span className="text-gray-800">{selectedOrder.pickupLocationDetails.phoneNumber || 'N/A'}</span>
                        </p>
                      </div>
                      <div>
                        <p className="flex items-center mb-2">
                          <CalendarDaysIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="font-medium text-gray-600 mr-2">Expected:</span>
                          <span className="text-gray-800">
                            {selectedOrder.expectedDeliveryDate ? new Date(selectedOrder.expectedDeliveryDate).toLocaleDateString('en-US') : 'N/A'}
                          </span>
                        </p>
                        <p className="flex items-center">
                          <CheckCircleIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="font-medium text-gray-600 mr-2">Actual:</span>
                          <span className="text-gray-800">
                            {selectedOrder.actualDeliveryDate ? new Date(selectedOrder.actualDeliveryDate).toLocaleDateString('en-US') : 'Not Picked Up Yet'}
                          </span>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <ExclamationTriangleIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">No detailed delivery/pickup information available.</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4">
                  {selectedOrder.currentSaleStatus === "Deposit Paid" && selectedOrder.remainingBalance > 0 && (
                    <button
                      onClick={handlePayRemaining}
                      className="bg-gradient-to-r from-[#3452e1] to-[#253887] text-white px-8 py-3 rounded-xl flex items-center gap-3 hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold"
                    >
                      <WalletIcon className="h-5 w-5" />
                      <span>Pay Remaining</span>
                      <span className="bg-white bg-opacity-20 px-2 py-1 rounded-lg text-sm">
                        ₫{selectedOrder.remainingBalance.toLocaleString('vi-VN')}
                      </span>
                    </button>
                  )}
                  <button
                    onClick={handleCloseDetailModal}
                    className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium"
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
          setShowSignInModal(false);
          
        }}
      />
    </div>
  );
}