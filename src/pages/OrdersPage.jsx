import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Login from "../components/Login";
import Swal from 'sweetalert2';
import { StarIcon } from '@heroicons/react/24/solid';
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
  ShoppingCartIcon,
  ChatBubbleBottomCenterTextIcon, // Icon for review
  PencilIcon // Icon for editing
} from '@heroicons/react/24/outline';
import { getApiBaseUrl } from "../../util/apiconfig";

export default function OrdersPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [isProcessingGateway, setIsProcessingGateway] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [detailLoadingId, setDetailLoadingId] = useState(null);

  const [reviewData, setReviewData] = useState({
    id: null,
    rating: 0,
    comment: '',
    orderId: null,
    images: [] // <— danh sách { url, name }
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isUploadingReviewImgs, setIsUploadingReviewImgs] = useState(false);

  const API_BASE = getApiBaseUrl();

  // States for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
  });

  const getToken = () => localStorage.getItem('token');

  useEffect(() => {
    console.log("--- useEffect for Momo callback initiated (Orders Page) ---");
    const query = new URLSearchParams(location.search);

    const momopartnerCode = query.get('partnerCode');
    const momoOrderId = query.get('orderId');
    const momoExtraData = query.get('extraData');
    const momorequestId = query.get('requestId');
    const momoResultCode = query.get('errorCode');
    const momoAmount = query.get('amount');
    const momoTransId = query.get('transId');
    const momoOrderInfo = query.get('orderInfo');
    const momoOrderType = query.get('orderType');
    const momoMessage = query.get('message');
    const momoLocalMessage = query.get('localMessage');
    const momoResponseTime = query.get('responseTime');
    const momoPayType = query.get('payType');
    const momoSignature = query.get('signature');
    const momoAccessKey = query.get('accessKey');

    if (momoResultCode !== null) {
      console.log("--- Momo callback parameters detected, processing... ---");
      setIsProcessingGateway(true);

      if (momoResultCode === "0") {
        console.log("Momo Payment SUCCESS! Sending data to server...");

        const payload = {
          partnerCode: momopartnerCode,
          orderId: momoOrderId,
          extraData: momoExtraData,
          requestId: momorequestId,
          resultCode: momoResultCode,
          amount: momoAmount,
          transId: momoTransId,
          orderInfo: momoOrderInfo,
          orderType: momoOrderType,
          message: momoMessage,
          localMessage: momoLocalMessage,
          responseTime: momoResponseTime,
          payType: momoPayType,
          signature: momoSignature,
          accessKey: momoAccessKey
        };

        fetch(`${API_BASE}/api/Momo/momo_ipn`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
          .then(res => {
            if (!res.ok) {
              return res.json().then(err => { throw new Error(err.message || 'Server error occurred'); });
            }
            return res.json();
          })
          .then(data => {
            console.log("✅ Data sent successfully:", data);

            if (data.resultCode === "0") {
              // Determine payment purpose from extraData
              let paymentPurposeText = "remaining payment";
              if (momoExtraData) {
                try {
                  const decodedExtraData = atob(momoExtraData);
                  const parts = decodedExtraData.split('|');
                  if (parts.length > 1) {
                    paymentPurposeText = parts[1] === "deposit" ? "deposit" : "remaining payment";
                  }
                } catch (e) {
                  console.error("Error decoding extraData:", e);
                }
              }

              Swal.fire({
                icon: "success",
                title: "Payment Successful!",
                html: `Your ${paymentPurposeText} has been processed successfully.<br/>Please check your email; we've sent the detailed invoice there.`,
                confirmButtonText: "Complete",
                confirmButtonColor: "#10B981",
              }).then(() => {
                // Clean up URL and refresh orders
                window.history.replaceState({}, document.title, window.location.pathname);
                fetchOrders();
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Payment Verification Failed!",
                text: `There was an issue verifying your payment on our system. Please contact support. (Error Code: ${data.resultCode})`,
                confirmButtonText: "Try Again",
                confirmButtonColor: "#EF4444",
              }).then(() => {
                window.history.replaceState({}, document.title, window.location.pathname);
                fetchOrders();
              });
            }
          })
          .catch(error => {
            console.error("❌ Failed to send data to /api/Momo/momo_ipn:", error);
            Swal.fire({
              icon: "error",
              title: "Connection Error!",
              text: `Could not connect to the server to verify your payment. Please try again.`,
              confirmButtonText: "Try Again",
              confirmButtonColor: "#EF4444",
            }).then(() => {
              window.history.replaceState({}, document.title, window.location.pathname);
              fetchOrders();
            });
          })
          .finally(() => {
            setIsProcessingGateway(false);
            console.log("--- useEffect for Momo callback finished ---");
          });

      } else {
        console.log(`Momo Payment FAILED! Result Code: ${momoResultCode}, Message: ${momoMessage}`);
        Swal.fire({
          icon: "error",
          title: "Payment Failed!",
          text: `Your transaction could not be completed. Reason: ${momoMessage || 'Unknown error.'} (MoMo Code: ${momoResultCode})`,
          confirmButtonText: "Try Again",
          confirmButtonColor: "#EF4444",
        }).then(() => {
          window.history.replaceState({}, document.title, window.location.pathname);
        });
        setIsProcessingGateway(false);
        console.log("--- useEffect for Momo callback finished ---");
      }

    } else {
      console.log("No MoMo callback parameters (errorCode) found in URL. Skipping MoMo callback processing.");
    }
  }, [location.search]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    setShowSignInModal(false);

    try {
      const token = getToken();
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const ordersResponse = await fetch(`${API_BASE}/api/Customer/orders`, {
        method: 'GET',
        headers: headers,
      });

      if (ordersResponse.ok) {
        const responseData = await ordersResponse.json();

        // const uniqueOrders = getUniqueOrdersByLatestStatus(data);

        setOrders(responseData.data);

        setPagination(prev => ({
          ...prev,
          totalPages: Math.ceil(responseData.totalItems / prev.pageSize)
        }));
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

  const getUniqueOrdersByLatestStatus = (ordersList) => {
    const carMap = new Map();

    ordersList.forEach(order => {
      const possibleKeys = [
        order.carDetails?.carId,
        order.carId,
        order.vehicleId,
        `${order.carDetails?.make}-${order.carDetails?.model}-${order.carDetails?.year}`,
        order.orderNumber,
        order.orderId
      ].filter(Boolean);

      const carKey = possibleKeys[0];

      if (!carKey) return;

      const orderDate = new Date(order.orderDate || order.createdAt || order.updatedAt || Date.now());
      const currentOrder = carMap.get(carKey);

      if (!currentOrder) {
        carMap.set(carKey, order);
      } else {
        const currentDate = new Date(currentOrder.orderDate || currentOrder.createdAt || currentOrder.updatedAt || 0);

        // Updated status priority with the new status names
        const statusPriority = {
          'Pending Deposit': 1,
          'Deposit Paid': 2,
          'Pending Full Payment': 3,
          'Payment Complete': 4,
          'Ready for Delivery': 5,
          'Delivered': 6,
          'Cancelled': 7,
          'Refunded': 8,
          'Sold': 4, // 'Sold' is an alias for 'Payment Complete'
          'On Hold': 2, // 'On Hold' is an alias for 'Pending Full Payment'
          'Available': 1, // 'Available' is an alias for 'Pending Deposit'
        };

        const currentPriority = statusPriority[currentOrder.currentSaleStatus] || 0;
        const newPriority = statusPriority[order.currentSaleStatus] || 0;

        if (orderDate > currentDate || (orderDate.getTime() === currentDate.getTime() && newPriority > currentPriority)) {
          carMap.set(carKey, order);
        }
      }
    });

    const result = Array.from(carMap.values());
    console.log('Processed unique orders:', result.length, 'from original:', ordersList.length);
    return result;
  };

  useEffect(() => {
    fetchOrders();
  }, [pagination.currentPage]);

  const getStatusConfig = (status) => {
    switch (status) {
      case "Pending Deposit":
      case "Available":
        return {
          bgColor: 'bg-orange-500',
          textColor: 'text-white',
          icon: ClockIcon,
          name: 'Pending Deposit',
          dotColor: 'bg-orange-500'
        };
      case "Deposit Paid":
      case "On Hold":
        return {
          bgColor: 'bg-cyan-500',
          textColor: 'text-white',
          icon: CreditCardIcon,
          name: 'Deposit Paid',
          dotColor: 'bg-cyan-500'
        };
      case "Pending Full Payment":
        return {
          bgColor: 'bg-blue-600',
          textColor: 'text-white',
          icon: CreditCardIcon,
          name: 'Pending Full Payment',
          dotColor: 'bg-blue-600'
        };
      case "Payment Complete":
      case "Sold":
        return {
          bgColor: 'bg-green-600',
          textColor: 'text-white',
          icon: CheckCircleIcon,
          name: 'Payment Complete',
          dotColor: 'bg-green-600'
        };
      case "Ready for Delivery":
        return {
          bgColor: 'bg-teal-500',
          textColor: 'text-white',
          icon: TruckIcon,
          name: 'Ready for Delivery',
          dotColor: 'bg-teal-500'
        };
      case "Delivered":
        return {
          bgColor: 'bg-emerald-600',
          textColor: 'text-white',
          icon: CheckCircleIcon,
          name: 'Delivered',
          dotColor: 'bg-emerald-600'
        };
      case "Cancelled":
        return {
          bgColor: 'bg-red-600',
          textColor: 'text-white',
          icon: ExclamationTriangleIcon,
          name: 'Cancelled',
          dotColor: 'bg-red-600'
        };
      case "Refunded":
        return {
          bgColor: 'bg-gray-500',
          textColor: 'text-white',
          icon: ExclamationTriangleIcon,
          name: 'Refunded',
          dotColor: 'bg-gray-500'
        };
      default:
        return {
          bgColor: 'bg-gray-400',
          textColor: 'text-white',
          icon: ExclamationTriangleIcon,
          name: 'Unknown Status',
          dotColor: 'bg-gray-400'
        };
    }
  };

  const getStatusBadgeClass = (status) => {
    const config = getStatusConfig(status);
    return `${config.bgColor} ${config.textColor}`;
  };

  const handleViewDetails = async (order) => {
    setDetailLoadingId(order.orderId);

    try {
      const token = getToken();
      if (!token) {
        setShowSignInModal(true);
        setDetailLoadingId(null);
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      
      const detailResponse = await fetch(`${API_BASE}/api/Customer/orders/${order.orderId}`, {
        method: 'GET',
        headers: headers,
      });

      if (detailResponse.ok) {
        const detailedOrder = await detailResponse.json();

        const mappedOrder = {
          ...detailedOrder, 
          
          orderId: detailedOrder.saleId,
          orderDate: detailedOrder.createdAt,
          currentSaleStatus: detailedOrder.status,
          
          carDetails: {
            ...detailedOrder.carDetails,
            make: detailedOrder.carDetails?.manufacturerName,

            model: detailedOrder.carDetails?.modelName,

            imageUrl: detailedOrder.carDetails?.imageUrls?.[0] || null, 
          },

          pickupLocationDetails: detailedOrder.pickupLocation,
          shippingAddressDetails: detailedOrder.shippingAddress,
          depositPaymentDetails: detailedOrder.depositPayment,
          fullPaymentDetails: detailedOrder.fullPayment,
          StatusHistory: detailedOrder.statusHistory || [],
        };
        
        setSelectedOrder(mappedOrder);
        setShowDetailModal(true);

      } else {

        const errorData = await detailResponse.json();
        Swal.fire({
          icon: 'error',
          title: 'Could Not Load Details',
          text: errorData.message || 'The server returned an error. Please try again.',
        });
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'Could not connect to the server to get order details.',
      });
    } finally {
      setDetailLoadingId(null);
    }
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedOrder(null);
  };

  const handleOpenReviewModal = async (order) => {
    try {
      const token = getToken();
      if (!token) {
        Swal.fire({
          icon: 'error',
          title: 'Authentication Required',
          text: 'Please log in to leave a review.',
        });
        return;
      }

      const response = await fetch(
        `${API_BASE}/api/Customer/reviews/${order.orderId || order.saleId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const existingReview = await response.json();

        if (existingReview.exists) {
          // ✅ Nếu đã có review thì nạp dữ liệu vào state
          setReviewData({
            id: existingReview.id,
            rating: existingReview.rating,
            comment: existingReview.content,
            orderId: order.orderId || order.saleId,
            images: (existingReview.images || []).map((url) => ({ url })) // nạp lại ảnh
          });
        } else {
          // ✅ Nếu chưa có review thì reset state
          setReviewData({
            id: null,
            rating: 0,
            comment: '',
            orderId: order.orderId || order.saleId,
            images: []
          });
        }
      } else {
        // ✅ Nếu lỗi response thì cho phép review mới
        setReviewData({
          id: null,
          rating: 0,
          comment: '',
          orderId: order.orderId || order.saleId,
          images: []
        });
      }
    } catch (err) {
      console.error("Error checking review:", err);
      setReviewData({
        id: null,
        rating: 0,
        comment: '',
        orderId: order.orderId || order.saleId,
        images: []
      });
    }

    setShowReviewModal(true);
  };


  const uploadReviewImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'autosaledn'); // giữ nguyên preset

    const res = await fetch('https://api.cloudinary.com/v1_1/di6k4wpxl/image/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (!res.ok || !data.secure_url) {
      throw new Error(data.error?.message || 'Upload failed');
    }
    return data.secure_url;
  };

  const handleReviewImageSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setIsUploadingReviewImgs(true);
    try {
      const uploads = [];
      for (const file of files) {
        // chặn video tuyệt đối ở đây
        if (!file.type.startsWith('image/')) continue;
        const url = await uploadReviewImageToCloudinary(file);
        uploads.push({ url, name: file.name });
      }
      setReviewData((prev) => ({ ...prev, images: [...(prev.images || []), ...uploads] }));
    } catch (err) {
      console.error('Upload review images error:', err);
      Swal.fire({ icon: 'error', title: 'Upload failed', text: err.message || 'Try again.' });
    } finally {
      setIsUploadingReviewImgs(false);
      e.target.value = ''; // reset input
    }
  };

  const removeReviewImage = (idx) => {
    setReviewData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== idx),
    }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewData.rating || !reviewData.comment.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Review',
        text: 'Please provide both a rating and a comment.',
        confirmButtonText: 'OK',
      });
      return;
    }

    setIsSubmittingReview(true);
    try {
      const token = getToken();
      let response;

      const images = (reviewData.images || []).map((i) => i.url); // ✅ lấy danh sách URL ảnh

      if (reviewData.id) {
        // Update review
        response = await fetch(`${API_BASE}/api/Customer/reviews/${reviewData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            rating: reviewData.rating,
            content: reviewData.comment,
            images: images, // ✅ gửi kèm ảnh khi update
          })
        });
      } else {
        // New review
        response = await fetch(`${API_BASE}/api/Customer/reviews`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            carSaleId: reviewData.orderId,
            rating: reviewData.rating,
            content: reviewData.comment,
            images: images, // ✅ gửi kèm ảnh khi tạo mới
          })
        });
      }

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: reviewData.id ? 'Review Updated!' : 'Thank You!',
          text: reviewData.id
            ? 'Your review has been updated successfully.'
            : 'Your review has been submitted successfully.',
          confirmButtonText: 'OK',
        });
        setShowReviewModal(false);
        fetchOrders();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: error.message || 'There was an error submitting your review. Please try again.',
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };




  const handleRatingChange = (rating) => {
    setReviewData(prev => ({ ...prev, rating }));
  };

  const handleCommentChange = (e) => {
    setReviewData(prev => ({ ...prev, comment: e.target.value }));
  };

  const initiateMomoPayment = async (saleId, amount, purpose) => {
    setIsProcessingGateway(true);
    try {
      const token = getToken();
      const payload = {
        saleId: saleId,
        amount: amount,
        paymentPurpose: purpose,
        returnUrl: window.location.origin + window.location.pathname + window.location.search,
      };

      const response = await fetch(`${API_BASE}/api/Momo/create_payment_url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get Momo URL from server.');
      }

      const data = await response.json();
      window.location.href = data.payUrl;
    } catch (err) {
      setIsProcessingGateway(false);
      await Swal.fire({
        icon: "error",
        title: "Momo Initiation Failed",
        text: `Unable to initiate Momo payment: ${err.message}`,
        confirmButtonText: "Try Again",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  const handlePayRemaining = async () => {
    if (!selectedOrder) return;

    // Show payment method selection
    const { value: paymentMethod } = await Swal.fire({
      title: 'Select Payment Method',
      html: `
        <div class="text-left space-y-4">
          <div class="p-4 border border-gray-200 rounded-lg bg-blue-50">
            <p class="font-semibold mb-2">Order: #${selectedOrder.orderNumber || selectedOrder.orderId}</p>
            <p class="text-lg font-bold text-blue-600">Remaining Amount: ₫${(selectedOrder.remainingBalance || 0).toLocaleString('vi-VN')}</p>
          </div>
          <p class="text-gray-600">Choose your preferred payment method:</p>
        </div>
      `,
      input: 'radio',
      inputOptions: {
        'e_wallet_momo_test': '🏦 MoMo E-Wallet (Recommended)',
        'bank_transfer': '💳 Bank Transfer',
        'installment_plan': '💰 Installment Plan'
      },
      inputValidator: (value) => {
        if (!value) {
          return 'Please select a payment method!';
        }
      },
      showCancelButton: true,
      confirmButtonText: 'Continue',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'swal2-popup-custom'
      }
    });

    if (!paymentMethod) return;

    if (paymentMethod === 'e_wallet_momo_test') {
      try {
        setPaymentLoading(true);

        const token = getToken();
        if (!token) {
          Swal.fire({
            icon: 'error',
            title: 'Authentication Error',
            text: 'Please log in again to proceed.',
          });
          return;
        }

        const orderId = selectedOrder.saleId || selectedOrder.orderId;
        const fullPaymentPayload = {
          paymentMethod: paymentMethod,
          actualDeliveryDate: selectedOrder.expectedDeliveryDate || new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
        };

        const fullPaymentResponse = await fetch(`${API_BASE}/api/Customer/orders/full-payment?orderId=${orderId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(fullPaymentPayload)
        });

        if (!fullPaymentResponse.ok) {
          const errorData = await fullPaymentResponse.json();
          throw new Error(errorData.message || 'Failed to process remaining payment.');
        }

        await initiateMomoPayment(orderId, selectedOrder.remainingBalance, 'full_payment');

      } catch (error) {
        console.error("Error processing MoMo payment:", error);
        Swal.fire({
          icon: "error",
          title: "Payment Error",
          text: error.message || "Could not process MoMo payment. Please try again.",
          confirmButtonText: "OK",
        });
      } finally {
        setPaymentLoading(false);
      }
    } else {
      const paymentMethodText = paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 'Installment Plan';

      Swal.fire({
        icon: "info",
        title: `${paymentMethodText} Payment`,
        text: `Do you want to pay ₫${(selectedOrder.remainingBalance || 0).toLocaleString('vi-VN')} via ${paymentMethodText.toLowerCase()} for order #${selectedOrder.orderNumber}?`,
        showCancelButton: true,
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            setPaymentLoading(true);
            const token = getToken();
            if (!token) {
              Swal.fire({
                icon: 'error',
                title: 'Authentication Error',
                text: 'Please log in again to proceed.',
              });
              return;
            }

            const orderId = selectedOrder.saleId || selectedOrder.orderId;
            const fullPaymentPayload = {
              paymentMethod: paymentMethod,
              actualDeliveryDate: selectedOrder.expectedDeliveryDate || new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
            };

            const response = await fetch(`${API_BASE}/api/Customer/orders/full-payment?orderId=${orderId}`, {
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
                title: "Payment Successful!",
                text: `Your ${paymentMethodText.toLowerCase()} payment has been processed successfully.`,
                confirmButtonText: "OK",
              }).then(() => {
                handleCloseDetailModal();
                fetchOrders();
              });
            } else {
              const errorData = await response.json();
              Swal.fire({
                icon: "error",
                title: "Payment Failed",
                text: errorData.message || `Failed to process payment: ${response.statusText}`,
                confirmButtonText: "OK",
              });
            }
          } catch (error) {
            console.error(`Error processing ${paymentMethodText} payment:`, error);
            Swal.fire({
              icon: "error",
              title: "Network Error",
              text: "Could not connect to the server to process payment. Please try again.",
              confirmButtonText: "OK",
            });
          } finally {
            setPaymentLoading(false);
          }
        }
      });
    }
  };

  const filteredOrders = useMemo(() => {
    let currentOrders = [...orders];

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentOrders = currentOrders.filter(order =>
        order.orderNumber?.toLowerCase().includes(lowerCaseSearchTerm) ||
        order.carDetails?.make?.toLowerCase().includes(lowerCaseSearchTerm) ||
        order.carDetails?.model?.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    if (filterStatus !== 'All') {
      currentOrders = currentOrders.filter(order =>
        order.currentSaleStatus === filterStatus
      );
    }

    return currentOrders;
  }, [orders, searchTerm, filterStatus]);

  if (loading || isProcessingGateway) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3452e1]"></div>
          <p className="text-[#3452e1] text-lg font-semibold">
            {isProcessingGateway ? 'Processing payment...' : 'Loading your orders...'}
          </p>
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
                <option value="Deposit Paid">Deposit Paid</option>
                <option value="Payment Complete">Payment Complete</option>
                <option value="Ready for Delivery">Ready for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Refunded">Refunded</option>
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
                    {/* <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Due Date</th> */}
                    <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredOrders
                    .filter(order =>
                      order.currentSaleStatus !== "Available" &&
                      order.currentSaleStatus !== "Pending Deposit"
                    )
                    .map(order => (
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
                        <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                          <button
                            onClick={() => handleViewDetails(order)}
                            disabled={detailLoadingId === order.orderId}
                            className="inline-flex items-center justify-center w-10 h-10 text-[#3452e1] hover:text-white hover:bg-[#3452e1] rounded-full transition-all duration-200 hover:shadow-md"
                            title="View Details"
                          >
                            {detailLoadingId === order.orderId ? (
                              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <InformationCircleIcon className="h-5 w-5" />
                            )}
                          </button>
                          {order.currentSaleStatus === 'Delivered' && (
                            <button
                              onClick={() => handleOpenReviewModal(order)}
                              className="inline-flex items-center justify-center w-10 h-10 text-yellow-500 hover:text-white hover:bg-yellow-500 rounded-full transition-all duration-200 hover:shadow-md"
                              title="Leave a Review"
                            >
                              <StarIcon className="h-5 w-5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>

              </table>
              {hasOrdersToShow && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center space-x-4 mt-8">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page <strong>{pagination.currentPage}</strong> of <strong>{pagination.totalPages}</strong>
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl transform transition-all">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Review & Feedback</h2>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleReviewSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Rating
                  </label>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange(star)}
                        className="focus:outline-none"
                      >
                        <StarIcon
                          className={`h-10 w-10 ${star <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    id="comment"
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Share your experience with this order..."
                    value={reviewData.comment}
                    onChange={handleCommentChange}
                    required
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Photos (optional)</label>
                  <input
                    type="file"
                    accept="image/*"     // <- chỉ cho phép ảnh
                    multiple
                    onChange={handleReviewImageSelect}
                    className="mb-2"
                  />
                  {isUploadingReviewImgs && (
                    <p className="text-sm text-blue-600 animate-pulse">Uploading...</p>
                  )}

                  {!!(reviewData.images?.length) && (
                    <div className="mt-2 grid grid-cols-4 gap-2">
                      {reviewData.images.map((img, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={img.url}
                            alt={img.name || `img-${idx}`}
                            className="w-full h-20 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => removeReviewImage(idx)}
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border text-xs shadow"
                            title="Remove"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={isSubmittingReview}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    disabled={isSubmittingReview}
                  >
                    {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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
                    <h2 className="text-2xl font-bold text-gray-900">Order Details & History</h2>
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

                      {/* Enhanced Payment History */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                            📋
                          </div>
                          Payment History
                        </h3>

                        <div className="space-y-4">
                          {/* Payment Timeline */}
                          <div className="relative">
                            {/* Deposit Payment */}
                            {selectedOrder.depositPaymentDetails && (
                              <div className="relative pl-8 pb-6">
                                {/* Trạng thái đã hoàn thành */}
                                {selectedOrder.depositPaymentDetails.paymentStatus === 'completed' ? (
                                  <>
                                    <div className="absolute left-0 top-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow"></div>
                                    <div className="absolute left-1.5 top-5 w-0.5 h-full bg-gray-200"></div>
                                    <div className="border border-green-200 rounded-lg p-4 bg-green-50 ml-4">
                                      <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-2">
                                          {/* <CheckCircleIcon className="h-5 w-5 text-green-600" /> */}
                                          <span className="font-semibold text-green-800">Deposit Payment</span>
                                        </div>
                                        <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                          Completed ✓
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
                                        {selectedOrder.depositPaymentDetails.transactionId && (
                                          <div className="flex justify-between">
                                            <span className="text-green-700">Transaction ID:</span>
                                            <span className="text-green-800 font-mono text-xs">{selectedOrder.depositPaymentDetails.transactionId}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  /* Trạng thái chờ xử lý (pending) */
                                  <>
                                    <div className="absolute left-0 top-2 w-3 h-3 bg-orange-400 rounded-full border-2 border-white shadow animate-pulse"></div>
                                    <div className="absolute left-1.5 top-5 w-0.5 h-full bg-gray-200"></div>
                                    <div className="border border-orange-200 rounded-lg p-4 bg-orange-50 ml-4">
                                      <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-2">
                                          {/* <ClockIcon className="h-5 w-5 text-orange-600" /> */}
                                          <span className="font-semibold text-orange-800">Deposit Payment</span>
                                        </div>
                                        <span className="text-sm text-orange-600 bg-orange-100 px-2 py-1 rounded-full animate-pulse">
                                          Pending ⏳
                                        </span>
                                      </div>
                                      <div className="space-y-2 text-sm">
                                        <div className="flex justify-between items-center">
                                          <span className="text-orange-700">Amount:</span>
                                          <span className="font-bold text-xl text-orange-800">
                                            ₫{selectedOrder.depositPaymentDetails.amount ? selectedOrder.depositPaymentDetails.amount.toLocaleString('vi-VN') : 'N/A'}
                                          </span>
                                        </div>
                                        <div className="mt-3 p-3 bg-orange-100 rounded-lg border border-orange-200">
                                          <p className="text-orange-800 text-xs font-medium">
                                            💡 Payment is being processed. You will receive a confirmation shortly.
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            )}

                            {/* Full Payment or Remaining Payment */}
                            {selectedOrder.fullPaymentDetails ? (
                              <div className="relative pl-8">
                                <div className="absolute left-0 top-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow"></div>
                                <div className="border border-green-200 rounded-lg p-4 bg-green-50 ml-4">
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-2">
                                      {/* <CheckCircleIcon className="h-5 w-5 text-green-600" /> */}
                                      <span className="font-semibold text-green-800">Full Payment</span>
                                    </div>
                                    <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                      Completed ✓
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
                                    {selectedOrder.fullPaymentDetails.transactionId && (
                                      <div className="flex justify-between">
                                        <span className="text-green-700">Transaction ID:</span>
                                        <span className="text-green-800 font-mono text-xs">{selectedOrder.fullPaymentDetails.transactionId}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              /* Remaining Payment */
                              selectedOrder.remainingBalance > 0 && (
                                <div className="relative pl-8">
                                  <div className="absolute left-0 top-2 w-3 h-3 bg-orange-400 rounded-full border-2 border-white shadow animate-pulse"></div>
                                  <div className="border border-orange-200 rounded-lg p-4 bg-orange-50 ml-4">
                                    <div className="flex items-center justify-between mb-3">
                                      <div className="flex items-center space-x-2">
                                        {/* <ClockIcon className="h-5 w-5 text-orange-600" /> */}
                                        <span className="font-semibold text-orange-800">Remaining Payment</span>
                                      </div>
                                      <span className="text-sm text-orange-600 bg-orange-100 px-2 py-1 rounded-full animate-pulse">
                                        Pending ⏳
                                      </span>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between items-center">
                                        <span className="text-orange-700">Amount Due:</span>
                                        <span className="font-bold text-xl text-orange-800">
                                          ₫{(selectedOrder.remainingBalance || 0).toLocaleString('vi-VN')}
                                        </span>
                                      </div>
                                      {selectedOrder.expectedDeliveryDate && (
                                        <div className="flex justify-between items-center">
                                          <span className="text-orange-700">Payment Due Date:</span>
                                          <span className="font-semibold text-orange-800">
                                            {
                                              new Date(new Date(selectedOrder.expectedDeliveryDate).setDate(new Date(selectedOrder.expectedDeliveryDate).getDate() - 1)).toLocaleDateString('vi-VN')
                                            }
                                          </span>
                                        </div>
                                      )}
                                      <div className="mt-3 p-3 bg-orange-100 rounded-lg border border-orange-200">
                                        <p className="text-orange-800 text-xs font-medium">
                                          💡 Payment Methods Available: MoMo E-Wallet, Bank Transfer
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                          {/* Payment Summary Stats */}
                          <div className="mt-6 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border">
                            <h4 className="font-semibold text-gray-800 mb-3">Payment Summary</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="text-center p-2 bg-white rounded border">
                                <p className="text-gray-600">Total Paid</p>
                                <p className="font-bold text-green-600">
                                  ₫{((selectedOrder.depositPaymentDetails?.amount || 0) + (selectedOrder.fullPaymentDetails?.amount || 0)).toLocaleString('vi-VN')}
                                </p>
                              </div>
                              <div className="text-center p-2 bg-white rounded border">
                                <p className="text-gray-600">Remaining</p>
                                <p className="font-bold text-red-600">
                                  ₫{(selectedOrder.remainingBalance || 0).toLocaleString('vi-VN')}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* New section for Order Status History */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            🕒
                          </div>
                          Order Status History
                        </h3>
                        <div className="relative">
                          <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200 ml-1"></div>
                          {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 ? (
                            selectedOrder.statusHistory.map((history, index) => {
                              const statusConfig = getStatusConfig(history.name);
                              const StatusIcon = statusConfig.icon;
                              return (
                                <div key={index} className="flex items-start mb-6 last:mb-0">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center relative z-10 ${statusConfig.dotColor} text-white`}>
                                    <StatusIcon className="h-3 w-3" />
                                  </div>
                                  <div className="ml-6 flex-1 pt-0.5">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="font-semibold text-gray-900">
                                        {history.name}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {history.date ? new Date(history.date).toLocaleString('vi-VN', {
                                          year: 'numeric',
                                          month: 'numeric',
                                          day: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        }) : 'N/A'}
                                      </span>
                                    </div>
                                    {history.notes && (
                                      <p className="text-sm text-gray-600 mt-1">
                                        Notes: {history.notes}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <p className="text-gray-600 text-sm pl-8">No status history available.</p>
                          )}
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
                                  <span className="font-medium text-orange-900">{selectedOrder.pickupLocationDetails?.name || 'N/A'}</span>
                                </div>
                                <div className="flex items-start justify-between">
                                  <span className="text-orange-700">Address:</span>
                                  <span className="font-medium text-orange-900 text-right max-w-xs">
                                    {selectedOrder.pickupLocationDetails?.address || 'N/A'}
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
                      disabled={paymentLoading}
                      className={`bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl flex items-center gap-3 hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold ${paymentLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <WalletIcon className="h-5 w-5" />
                      <span>{paymentLoading ? 'Processing...' : 'Pay Remaining Balance'}</span>
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