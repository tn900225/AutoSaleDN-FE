import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getApiBaseUrl } from "../../util/apiconfig";

const formatCurrency = (num) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(num);

export default function PrePurchasePage() {
  const { carId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const API_BASE = getApiBaseUrl();

  const initialShowrooms = location.state?.showrooms || [];
  const carFromState = location.state?.car || null;

  const [car, setCar] = useState(carFromState);
  const [userData, setUserData] = useState(null);
  const [sellerData, setSellerData] = useState(null);
  const [showrooms, setShowrooms] = useState(initialShowrooms);
  const [selectedShowroom, setSelectedShowroom] = useState('');
  const [loadingUser, setLoadingUser] = useState(true);
  const [errorUser, setErrorUser] = useState('');
  const [loadingSeller, setLoadingSeller] = useState(false);
  const [errorSeller, setErrorSeller] = useState('');

  // States for delivery and payment
  const [deliveryOption, setDeliveryOption] = useState('pickup'); // 'pickup' or 'shipping'
  const [shippingAddressInfo, setShippingAddressInfo] = useState({
    name: '',
    address: '',
    phone: ''
  });
  const [useUserProfileAddress, setUseUserProfileAddress] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState(''); // for full purchase
  const [depositPaymentMethod, setDepositPaymentMethod] = useState(''); // for deposit
  const [paymentType, setPaymentType] = useState('full'); // 'full' or 'installment'

  // States for deposit and purchase type logic
  const [isDepositPaid, setIsDepositPaid] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState(''); // For agreed delivery date
  const [paymentDueDate, setPaymentDueDate] = useState(''); // For calculated payment due date
  const [isProcessingDeposit, setIsProcessingDeposit] = useState(false); // For deposit button loading
  const [isProcessingFullPayment, setIsProcessingFullPayment] = useState(false); // For full payment button loading
  const [isProcessingGateway, setIsProcessingGateway] = useState(false); // For payment gateway redirect loading
  const [purchaseType, setPurchaseType] = useState('deposit'); // 'deposit' or 'full_payment'

  // State to store the orderId after deposit is placed
  const [currentOrderId, setCurrentOrderId] = useState(null);

  // State for the contract viewing modal
  const [contractModal, setContractModal] = useState({ open: false, content: '' });

  const MIN_DEPOSIT = 5000000;
  const MAX_DEPOSIT = 10000000;
  const SHIPPING_COST = 3500000;

  const getToken = () => localStorage.getItem('token');

  // Effect to fetch car and showroom information if not already in state
  useEffect(() => {
    if (!carFromState || initialShowrooms.length === 0) {
      const fetchCarAndShowrooms = async () => {
        setLoadingUser(true);
        setErrorUser('');
        try {
          const response = await fetch(`${API_BASE}/api/User/cars/${carId}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch car data: ${response.statusText}`);
          }
          const carData = await response.json();

          let taxRateValue = 0.085;
          if (carData.pricing && carData.pricing[0] && typeof carData.pricing[0].taxRate === 'number') {
            taxRateValue = carData.pricing[0].taxRate / 100;
          }

          const mappedCar = {
            id: carData.listingId,
            model: {
              name: carData.model?.name || "Unknown Model",
              manufacturer: {
                name: carData.model?.manufacturer?.name || "Unknown Manufacturer",
              },
            },
            price: carData.price,
            pricing: carData.pricing?.[0]
              ? {
                registrationFee: carData.pricing[0].registrationFee || 0,
                dealerFee: 500,
                taxRate: taxRateValue
              }
              : { registrationFee: 0, dealerFee: 500, taxRate: 0.085 },
            showrooms: carData.showrooms?.map(s => ({
              id: s.storeLocationId,
              name: s.name,
              address: s.address,
              phone: s.Phone || "+1 (555) 123-4567"
            })) || [],
            sellerInfo: carData.sellerInfo || { name: "Auto Sales Inc.", contact: "sales@autosales.com" },
            vin: carData.vin
          };

          setCar(mappedCar);
          setShowrooms(mappedCar.showrooms);
          if (mappedCar.showrooms.length > 0) {
            setSelectedShowroom(String(mappedCar.showrooms[0].id));
          }
        } catch (err) {
          setErrorUser('Failed to load car and showroom information. ' + err.message);
          console.error("Error fetching car and showroom data in PrePurchasePage:", err);
        } finally {
          setLoadingUser(false);
        }
      };
      fetchCarAndShowrooms();
    } else {
      setCar(carFromState);
      setShowrooms(initialShowrooms);
      if (initialShowrooms.length > 0 && !selectedShowroom) {
        setSelectedShowroom(String(initialShowrooms[0].id));
      }
      setLoadingUser(false);
    }
  }, [carId]);

  // Fetch user data
  useEffect(() => {
    if (!userData && !errorUser) {
      setLoadingUser(true);
      setErrorUser('');
      const fetchUserData = async () => {
        try {
          const token = getToken();
          const headers = { 'Content-Type': 'application/json' };
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }

          const response = await fetch(`${API_BASE}/api/User/me`, { headers });
          if (!response.ok) {
            if (response.status === 401) {
              throw new Error('Authentication failed. Please log in again.');
            }
            throw new Error(`Failed to fetch user data: ${response.statusText}`);
          }
          const data = await response.json();
          setUserData(data);
        } catch (err) {
          setErrorUser('Failed to load user information. ' + err.message);
          console.error("Error fetching user data in PrePurchasePage:", err);
        } finally {
          setLoadingUser(false);
        }
      };
      fetchUserData();
    }
  }, [userData, errorUser]);

  // Fetch seller data when selectedShowroom changes
  useEffect(() => {
    if (selectedShowroom && selectedShowroom !== '') {
      setLoadingSeller(true);
      setErrorSeller('');
      setSellerData(null);

      const fetchSellerData = async () => {
        try {
          const token = getToken();
          const headers = { 'Content-Type': 'application/json' };
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }

          const apiUrl = `${API_BASE}/api/Customer/${selectedShowroom}/seller`;
          const response = await fetch(apiUrl, { headers });

          if (!response.ok) {
            if (response.status === 404) {
              throw new Error('No seller found for the selected showroom.');
            }
            if (response.status === 401) {
              throw new Error('Authentication failed for seller data. Please log in again.');
            }
            throw new Error(`Failed to load seller information: ${response.statusText}`);
          }
          const data = await response.json();
          setSellerData(data);
        } catch (err) {
          setErrorSeller(`Failed to load seller information: ${err.message}.`);
          console.error("Error fetching seller data in PrePurchasePage:", err);
        } finally {
          setLoadingSeller(false);
        }
      };
      fetchSellerData();
    } else {
      setSellerData(null);
      setErrorSeller('');
      setLoadingSeller(false);
    }
  }, [selectedShowroom]);

  useEffect(() => {
    console.log("--- useEffect for Momo callback initiated ---");
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
              let paymentPurposeText = "payment";
              if (momoExtraData) {
                try {
                  const decodedExtraData = atob(momoExtraData);
                  const parts = decodedExtraData.split('|');
                  if (parts.length > 1) {
                    paymentPurposeText = parts[1] === "deposit" ? "deposit" : "full payment";
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

                if (carId) {
                  navigate(`/cars/orders`, { replace: true });
                } else {
                  navigate('/some-success-page', { replace: true });
                }
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Payment Verification Failed!",
                text: `There was an issue verifying your payment on our system. Please contact support. (Error Code: ${data.resultCode})`,
                confirmButtonText: "Try Again",
                confirmButtonColor: "#EF4444",
              }).then(() => {
                if (carId) {
                  navigate(`/cars/${carId}/confirm-orders}`, { replace: true });
                } else {
                  navigate('/some-error-page', { replace: true });
                }
              });
            }
          })
          .catch(error => {
            console.error("❌ Failed to send data to /api/Momo/momo_ipn:", error);
            Swal.fire({
              icon: "error",
              title: "Connection Error!",
              text: `Could not connect to the server to verify your payment. Please try again or contact support.`,
              confirmButtonText: "Try Again",
              confirmButtonColor: "#EF4444",
            }).then(() => {
              if (carId) {
                navigate(`/cars/${carId}/confirm-orders`, { replace: true });
              } else {
                navigate('/some-error-page', { replace: true });
              }
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
          console.log(`Navigating back to /cars/${carId} after payment failure.`);
          if (carId) {
            navigate(`/cars/${carId}/confirm-orders`, { replace: true });
          } else {
            navigate('/some-failure-page', { replace: true });
          }
        });
        setIsProcessingGateway(false);
        console.log("--- useEffect for Momo callback finished ---");
      }

    } else {
      console.log("No MoMo callback parameters (errorCode) found in URL. Skipping MoMo callback processing.");
    }
  }, [location.search, navigate, carId]);

  const calculateTotalPrice = () => {
    if (!car) return 0;
    const price = car.price;
    const regFee = car.pricing?.registrationFee || 0;
    const dealerFee = car.pricing?.dealerFee || 0;
    const tax = Math.round(price * (car.pricing?.taxRate || 0.085));
    const shipping = deliveryOption === 'shipping' ? SHIPPING_COST : 0;
    return price + regFee + dealerFee + tax + shipping;
  };

  const calculateDepositAmount = () => {
    const tenPercent = Math.round(calculateTotalPrice() * 0.1);
    return Math.min(MAX_DEPOSIT, Math.max(MIN_DEPOSIT, tenPercent));
  };

  const depositAmount = calculateDepositAmount();
  const remainingBalance = calculateTotalPrice() - depositAmount;

  const getRequestType = (paymentMethod) => {
    switch (paymentMethod) {
      case 'e_wallet_momo_test':
        return 'captureMoMoWallet';
      case 'atm_domestic_card':
        return 'payWithATM';
      case 'qr_banking':
        return 'payWithCC';
      default:
        return 'captureMoMoWallet';
    }
  };

  const initiateMomoPayment = async (saleId, amount, purpose, paymentMethod) => {
    setIsProcessingGateway(true);
    try {
      const token = getToken();
      const payload = {
        saleId: saleId,
        amount: amount,
        paymentPurpose: purpose,
        requestType: getRequestType(paymentMethod),
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

  const handleDeposit = async () => {
    if (!car) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Car Data',
        text: 'Car details are not loaded. Please try again.',
        confirmButtonText: 'OK',
      });
      return;
    }
    if (!selectedShowroom) {
      Swal.fire({
        icon: 'warning',
        title: 'Showroom Required',
        text: 'Please select a showroom.',
        confirmButtonText: 'OK',
      });
      return;
    }
    if (!depositPaymentMethod) {
      Swal.fire({
        icon: 'warning',
        title: 'Deposit Payment Method Required',
        text: 'Please select a method to pay the deposit.',
        confirmButtonText: 'OK',
      });
      return;
    }
    if (deliveryOption === 'shipping' && !useUserProfileAddress) {
      if (!shippingAddressInfo.name || !shippingAddressInfo.address || !shippingAddressInfo.phone) {
        Swal.fire({
          icon: 'warning',
          title: 'Shipping Information Incomplete',
          text: 'Please fill in all shipping address details.',
          confirmButtonText: 'OK',
        });
        return;
      }
    }

    setIsProcessingDeposit(true);

    try {
      const token = getToken();
      const payload = {
        listingId: car.id,
        totalPrice: calculateTotalPrice(),
        depositAmount: depositAmount,
        deliveryOption: deliveryOption,
        selectedShowroomId: deliveryOption === 'pickup' ? Number(selectedShowroom) : null,
        useUserProfileAddress: deliveryOption === 'shipping' ? useUserProfileAddress : false,
        shippingAddressInfo: deliveryOption === 'shipping' && !useUserProfileAddress ? shippingAddressInfo : null,
        depositPaymentMethod: depositPaymentMethod,
        expectedDeliveryDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
      };

      if (depositPaymentMethod === 'e_wallet_momo_test' || depositPaymentMethod === 'atm_domestic_card' || depositPaymentMethod === 'qr_banking') {
        const createOrderResponse = await fetch(`${API_BASE}/api/Customer/orders/deposit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ ...payload, depositPaymentMethod: depositPaymentMethod })
        });

        if (!createOrderResponse.ok) {
          const errorData = await createOrderResponse.json();
          throw new Error(errorData.message || 'Failed to create pending deposit order.');
        }
        const orderConfirmation = await createOrderResponse.json();
        setCurrentOrderId(orderConfirmation.orderId);

        await initiateMomoPayment(orderConfirmation.orderId, depositAmount, 'deposit', depositPaymentMethod);
      } else {
        const response = await fetch(`${API_BASE}/api/Customer/orders/deposit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to process deposit on server.');
        }

        const depositConfirmation = await response.json();
        setIsDepositPaid(true);
        setCurrentOrderId(depositConfirmation.orderId);

        const apiExpectedDeliveryDate = depositConfirmation.expectedDeliveryDate ? new Date(depositConfirmation.expectedDeliveryDate) : new Date(new Date().setDate(new Date().getDate() + 30));
        setDeliveryDate(apiExpectedDeliveryDate.toISOString().split('T')[0]);

        const calculatedPaymentDueDate = new Date(apiExpectedDeliveryDate);
        calculatedPaymentDueDate.setDate(apiExpectedDeliveryDate.getDate() - 10);
        setPaymentDueDate(calculatedPaymentDueDate.toISOString().split('T')[0]);

        await Swal.fire({
          icon: "success",
          title: "Deposit Payment Successful!",
          html: `
          <p>Your deposit of <strong>${formatCurrency(depositAmount)}</strong> has been successfully processed.</p>
          <p class="mt-2 text-sm text-gray-600">A confirmation email has been sent to your email address. Please check your inbox (and spam/junk folder).</p>
          <p class="mt-1 text-sm text-gray-600">Our sales team will contact you soon to complete the purchase contract and full payment.</p>
          <p class="mt-1 text-sm text-gray-600">Vehicle delivery is scheduled for: <strong>${apiExpectedDeliveryDate.toLocaleDateString('en-US')}</strong></p>
          <p class="mt-1 text-sm text-gray-600">Full payment is due by: <strong>${calculatedPaymentDueDate.toLocaleDateString('en-US')}</strong></p>
        `,
          confirmButtonText: "OK",
          confirmButtonColor: "#10B981",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/orders');
          }
        });
      }
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Deposit Failed",
        text: `Unable to process deposit: ${err.message}`,
        confirmButtonText: "OK",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setIsProcessingDeposit(false);
    }
  };

  const handleFullPayment = async () => {
    // 1. Validate required data before payment
    if (!paymentMethod) {
      Swal.fire({
        icon: 'warning',
        title: 'Payment Method Required',
        text: 'Please select a payment method for the full order.',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (!car) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Car Data',
        text: 'Car details are not loaded. Please try again.',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (!selectedShowroom) {
      Swal.fire({
        icon: 'warning',
        title: 'Showroom Required',
        text: 'Please select a showroom.',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (deliveryOption === 'shipping' && !useUserProfileAddress) {
      if (!shippingAddressInfo.name || !shippingAddressInfo.address || !shippingAddressInfo.phone) {
        Swal.fire({
          icon: 'warning',
          title: 'Shipping Information Incomplete',
          text: 'Please fill in all shipping address details.',
          confirmButtonText: 'OK',
        });
        return;
      }
    }

    setIsProcessingFullPayment(true);

    try {
      const token = getToken();

      if (purchaseType === 'full_payment') {
        // Full payment from the start - need to create deposit order first, then process full payment
        const depositPayload = {
          listingId: car.id,
          totalPrice: calculateTotalPrice(),
          depositAmount: Math.max(MIN_DEPOSIT, Math.round(calculateTotalPrice() * 0.1)),
          deliveryOption: deliveryOption,
          selectedShowroomId: deliveryOption === 'pickup' ? Number(selectedShowroom) : null,
          useUserProfileAddress: deliveryOption === 'shipping' ? useUserProfileAddress : false,
          shippingAddressInfo: deliveryOption === 'shipping' && !useUserProfileAddress ? shippingAddressInfo : null,
          depositPaymentMethod: paymentMethod,
          expectedDeliveryDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
        };

        const createOrderResponse = await fetch(`${API_BASE}/api/Customer/orders/deposit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(depositPayload)
        });

        if (!createOrderResponse.ok) {
          const errorData = await createOrderResponse.json();
          throw new Error(errorData.message || 'Failed to create order for full payment.');
        }

        const orderConfirmation = await createOrderResponse.json();
        const orderId = orderConfirmation.orderId;
        setCurrentOrderId(orderId);

        const fullPaymentPayload = {
          paymentMethod: paymentMethod,
          actualDeliveryDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
        };

        if (paymentMethod === 'e_wallet_momo_test') {
          const fullPaymentResponse = await fetch(`${API_BASE}/api/Customer/orders/full-payment?orderId=${orderId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(fullPaymentPayload)
          });

          if (!fullPaymentResponse.ok) {
            const errorData = await fullPaymentResponse.json();
            throw new Error(errorData.message || 'Failed to process full payment.');
          }

          // Then initiate Momo payment
          await initiateMomoPayment(orderId, calculateTotalPrice(), 'full_payment');
        } else {
          const fullPaymentResponse = await fetch(`${API_BASE}/api/Customer/orders/full-payment?orderId=${orderId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(fullPaymentPayload)
          });

          if (!fullPaymentResponse.ok) {
            const errorData = await fullPaymentResponse.json();
            throw new Error(errorData.message || 'Failed to process full payment.');
          }

          // Handle successful API response
          await Swal.fire({
            icon: "success",
            title: "Purchase Complete!",
            html: `<p>Thank you for your purchase! Your full payment has been processed.</p>
            <p>Delivery is scheduled for: <strong>${new Date(fullPaymentPayload.actualDeliveryDate).toLocaleDateString()}</strong></p>
            <p>A confirmation email has been sent to your email address.</p>`,
            confirmButtonText: "OK",
            confirmButtonColor: "#10B981",
          }).then(() => {
            navigate('/orders');
          });
        }
      } else if (purchaseType === 'deposit') {
        // Completing remaining payment after deposit
        const orderIdToUse = currentOrderId || location.state?.orderId;
        if (!orderIdToUse) {
          Swal.fire({
            icon: 'error',
            title: 'Order ID Missing',
            text: 'Cannot proceed with full payment. Please ensure a deposit has been placed first to create an order.',
            confirmButtonText: 'OK',
          });
          return;
        }

        const fullPaymentPayload = {
          paymentMethod: paymentMethod,
          actualDeliveryDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
        };

        if (paymentMethod === 'e_wallet_momo_test') {
          // Process full payment first, then redirect to Momo
          const fullPaymentResponse = await fetch(`${API_BASE}/api/Customer/orders/full-payment?orderId=${orderIdToUse}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(fullPaymentPayload)
          });

          if (!fullPaymentResponse.ok) {
            const errorData = await fullPaymentResponse.json();
            throw new Error(errorData.message || 'Failed to process remaining payment.');
          }

          // Then initiate Momo payment for remaining balance
          await initiateMomoPayment(orderIdToUse, remainingBalance, 'full_payment');
        } else {
          // Handle non-gateway payment methods
          const fullPaymentResponse = await fetch(`${API_BASE}/api/Customer/orders/full-payment?orderId=${orderIdToUse}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(fullPaymentPayload)
          });

          if (!fullPaymentResponse.ok) {
            const errorData = await fullPaymentResponse.json();
            throw new Error(errorData.message || 'Failed to process remaining payment.');
          }

          // Handle successful API response
          await Swal.fire({
            icon: "success",
            title: "Payment Complete!",
            html: `<p>Thank you! Your remaining payment has been processed successfully.</p>
            <p>Your order is now complete.</p>
            <p>A confirmation email has been sent to your email address.</p>`,
            confirmButtonText: "OK",
            confirmButtonColor: "#10B981",
          }).then(() => {
            navigate('/orders');
          });
        }
      }
    } catch (err) {
      // Error handling
      await Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: `Unable to process payment: ${err.message}`,
        confirmButtonText: "Try Again",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setIsProcessingFullPayment(false);
    }
  };

  const handleShowroomChange = (e) => {
    setSelectedShowroom(e.target.value);
  };

  const handleShippingAddressInfoChange = (e) => {
    const { name, value } = e.target;
    setShippingAddressInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleDeliveryOptionChange = (e) => {
    setDeliveryOption(e.target.value);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleDepositPaymentMethodChange = (e) => {
    setDepositPaymentMethod(e.target.value);
  };

  const generateContractContent = () => {
    const currentShowroom = showrooms.find(sr => String(sr.id) === String(selectedShowroom));
    const deliveryAddress = deliveryOption === 'shipping'
      ? (useUserProfileAddress ? `${userData?.address || 'N/A'}, ${userData?.city || 'N/A'}, ${userData?.province || 'N/A'}` : `${shippingAddressInfo.address}, ${shippingAddressInfo.name}, ${shippingAddressInfo.phone}`)
      : 'N/A';
    const pickupLocation = deliveryOption === 'pickup'
      ? `${currentShowroom?.name || 'N/A'} at ${currentShowroom?.address || 'N/A'}`
      : 'N/A';

    const currentDeliveryDate = deliveryDate ? new Date(deliveryDate).toLocaleDateString('en-US') : 'Not yet determined';
    const currentPaymentDueDate = paymentDueDate ? new Date(paymentDueDate).toLocaleDateString('en-US') : 'Not yet determined';

    let deliverySection = '';
    if (deliveryAddress !== 'N/A' && deliveryOption === 'shipping') {
      deliverySection += `Delivery will be arranged to: ${deliveryAddress}\n`;
    }
    if (pickupLocation !== 'N/A' && deliveryOption === 'pickup') {
      deliverySection += `Pickup/Sale Location: ${pickupLocation}\n`;
    }
    deliverySection += `Expected Delivery Date: ${currentDeliveryDate}`;

    return `
      VEHICLE PURCHASE AGREEMENT

      Agreement No: 1
      Date: ${new Date().toLocaleDateString('en-US')}

      This sales contract is entered into as of ${new Date().toLocaleDateString('en-US')} by and between

      Seller:
      ${sellerData?.fullName || 'Seller One'}
      Mailing address: Ha Noi

      and

      Buyer:
      ${userData?.fullName || 'Customer One'}
      Mailing address: ${userData?.address || '123 Nguyen Chi Thanh, Hai Chau, TP. Da Nang'}
      collectively referred to as the "Parties", both of whom agree to be bound by this Agreement.

      The Seller is the manufacturer and distributor of the following product(s):

      ${car?.model?.manufacturer?.name || 'Toyota'} ${car?.model?.name || 'Vios'} (${car?.year || '2022'}), VIN: ${car?.vin || '13225699123'}
      Condition: ${car?.condition || 'New'}
      Transmission: ${car?.transmission || 'AT'}
      Seating Capacity: ${car?.seatingCapacity || '5'} seats
      Fuel Type: ${car?.fuelType || 'Petrol'}

      The Buyer wishes to purchase the aforementioned product(s).

      THEREFORE, the Parties agree as follows:

      1. Sale of Goods. The Seller shall make available for sale, and the Buyer shall
      purchase the Goods.

      2. Delivery and Shipping.
      ${deliverySection}

      3. Purchase Price and Payments.
      The Seller agrees to sell the Goods to the Buyer for ${formatCurrency(calculateTotalPrice())}.

      The Seller will provide an invoice to the Buyer at the time of delivery or pick-up.
      All invoices must be paid, in full, within 30 days.
      Payment Due Date: ${currentPaymentDueDate}
      Any balances not paid within 7 days will be subject to a 5% late payment penalty.

      4. Inspection of Goods and Rejection. The Buyer is entitled to inspect the
      Goods promptly upon delivery or receipt. The Buyer shall have a reasonable
      period, not exceeding 3 days, from the date of delivery to thoroughly inspect the Goods and
      ensure they conform to the specifications and quality agreed upon in this
      Agreement. If the Goods do not meet the agreed-upon standards or are found
      to be damaged, the Buyer has the right to reject the Goods.

      This agreement is made in two (02) copies of equal legal value, with each party retaining one (01) copy.
      ${new Date().getFullYear()} AutoSaleDN Company. All rights reserved.
    `;
  };

  const handleViewContract = () => {
    const content = generateContractContent();
    setContractModal({ open: true, content: content });
  };

  const handlePurchaseTypeChange = (e) => {
    setPurchaseType(e.target.value);
    setPaymentMethod('');
    setDepositPaymentMethod('');
    setIsDepositPaid(false);
    setDeliveryDate('');
    setPaymentDueDate('');
    setCurrentOrderId(null);
    if (e.target.value === 'full_payment') {
      const today = new Date();
      const delivery = new Date(today.setDate(today.getDate() + 30));
      const paymentDue = new Date(delivery);
      paymentDue.setDate(delivery.getDate() - 1);
      setDeliveryDate(delivery.toISOString().split('T')[0]);
      setPaymentDueDate(paymentDue.toISOString().split('T')[0]);
    } else {
      setDeliveryDate('');
      setPaymentDueDate('');
    }
  };

  if (loadingUser || !car || isProcessingGateway) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-opacity-75"></div>
        <p className="ml-4 text-gray-700">
          {isProcessingGateway ? 'Redirecting to payment gateway or verifying payment...' : 'Loading car details and user info...'}
        </p>
      </div>
    );
  }

  if (errorUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-red-600 text-lg p-4 bg-red-100 border border-red-400 rounded-lg shadow-md">
          <p>Error: {errorUser}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
          {/* Header Section */}
          <div className="text-center pb-4 flex-shrink-0">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
              Confirm Purchase Details for {car?.model?.manufacturer?.name} {car?.model?.name}
            </h2>
            <p className="text-gray-600 text-lg font-medium">
              Select your preferred options and verify your information
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mt-4"></div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 py-2">
            {/* Car Information Display */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 shadow-sm mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-6 h-6 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5 5 0 000 1.986V19H4.276a1 1 0 00-.765 1.637l1.392 1.392A1 1 0 005.637 23H18a1 1 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 00-2-2h10a2 2 0 012-2z" />
                </svg>
                Car Information
              </h3>
              <div className="space-y-2 text-lg">
                <div className="flex justify-between items-center text-gray-700">
                  <span>Manufacturer:</span>
                  <span className="font-semibold">{car?.model?.manufacturer?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center text-gray-700">
                  <span>Model:</span>
                  <span className="font-semibold">{car?.model?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center text-gray-700">
                  <span>Car Price:</span>
                  <span className="font-semibold">{formatCurrency(car.price)}</span>
                </div>
              </div>
            </div>

            {/* Showroom Selection & User/Seller Info */}
            {loadingSeller ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-600 mt-4 font-medium">Loading seller information...</p>
              </div>
            ) : errorSeller ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-800 text-sm font-medium">{errorSeller}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13 21.314A2 2 0 0110.172 21H7a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2zM12 10a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Select Sales Showroom
                  </h3>
                  <div className="relative">
                    <select
                      id="showroom-select"
                      className="block w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md appearance-none cursor-pointer"
                      value={selectedShowroom}
                      onChange={handleShowroomChange}
                    >
                      <option value="">Choose your preferred showroom to purchase from</option>
                      {showrooms.map((showroom) => (
                        <option key={showroom.id} value={String(showroom.id)}>
                          {showroom.name || 'Unknown'} - {showroom.address || 'No address'}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {showrooms.length === 0 && (
                    <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-lg mt-2">
                      <p className="text-amber-800 text-sm font-medium">No showrooms available for this car. Please contact support.</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Delivery Options
                  </h3>
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-6">
                    <label className="flex items-center text-gray-700 font-medium cursor-pointer">
                      <input
                        type="radio"
                        name="deliveryOption"
                        value="pickup"
                        checked={deliveryOption === 'pickup'}
                        onChange={handleDeliveryOptionChange}
                        className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-3">Pick up at Showroom</span>
                    </label>
                    {/* <label className="flex items-center text-gray-700 font-medium cursor-pointer">
                      <input
                        type="radio"
                        name="deliveryOption"
                        value="shipping"
                        checked={deliveryOption === 'shipping'}
                        onChange={handleDeliveryOptionChange}
                        className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-3">Ship to Address (+$<span className="font-semibold">{formatCurrency(SHIPPING_COST)}</span>)</span>
                    </label> */}
                  </div>

                  {deliveryOption === 'shipping' && (
                    <div className="mt-4 space-y-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">Shipping Address</h4>
                      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-6">
                        <label className="flex items-center text-gray-700 font-medium cursor-pointer">
                          <input
                            type="radio"
                            name="shippingAddressOption"
                            value="profile"
                            checked={useUserProfileAddress}
                            onChange={() => setUseUserProfileAddress(true)}
                            className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="ml-3">Use my profile address</span>
                        </label>
                        <label className="flex items-center text-gray-700 font-medium cursor-pointer">
                          <input
                            type="radio"
                            name="shippingAddressOption"
                            value="other"
                            checked={!useUserProfileAddress}
                            onChange={() => setUseUserProfileAddress(false)}
                            className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="ml-3">Ship to a different address</span>
                        </label>
                      </div>

                      {useUserProfileAddress ? (
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                          <p className="text-sm font-medium text-gray-600">Address:</p>
                          <p className="text-base text-gray-800 font-semibold">
                            {userData?.address || 'N/A'}, {userData?.city || 'N/A'}, {userData?.province || 'N/A'}
                          </p>
                          <p className="text-sm font-medium text-gray-600 mt-2">Phone:</p>
                          <p className="text-base text-gray-800 font-semibold">
                            {userData?.mobile || 'N/A'}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div>
                            <label htmlFor="shipping-name" className="block text-sm font-medium text-gray-700">Recipient Name</label>
                            <input
                              type="text"
                              id="shipping-name"
                              name="name"
                              value={shippingAddressInfo.name}
                              onChange={handleShippingAddressInfoChange}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="Full Name"
                            />
                          </div>
                          <div>
                            <label htmlFor="shipping-address" className="block text-sm font-medium text-gray-700">Address</label>
                            <input
                              type="text"
                              id="shipping-address"
                              name="address"
                              value={shippingAddressInfo.address}
                              onChange={handleShippingAddressInfoChange}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="Street, City, Province/State, Postal Code"
                            />
                          </div>
                          <div>
                            <label htmlFor="shipping-phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input
                              type="tel"
                              id="shipping-phone"
                              name="phone"
                              value={shippingAddressInfo.phone}
                              onChange={handleShippingAddressInfoChange}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="e.g., +1234567890"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {userData && (
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50/50 p-4 rounded-xl border border-gray-200/50 shadow-inner">
                      <div className="flex items-center mb-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-2">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <h3 className="text-base font-bold text-gray-800">Your Information</h3>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-500">Full Name</p>
                            <p className="text-sm text-gray-800 font-semibold truncate">{userData?.fullName || userData?.name || 'N/A'}</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-500">Email Address</p>
                            <p className="text-sm text-gray-800 font-semibold truncate">{userData?.email || 'N/A'}</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-500">Phone Number</p>
                            <p className="text-sm text-gray-800 font-semibold">{userData?.mobile || 'N/A'}</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-500">Province</p>
                            <p className="text-sm text-gray-800 font-semibold">{userData?.province || 'N/A'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-200/50">
                        <p className="text-xs text-gray-500 italic flex items-start">
                          <svg className="w-3 h-3 text-blue-500 mr-1 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Information from your profile
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedShowroom && sellerData && (
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50/50 p-4 rounded-xl border border-blue-200/50 shadow-inner">
                      <div className="flex items-center mb-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mr-2">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                        </div>
                        <h3 className="text-base font-bold text-gray-800">Seller Information</h3>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-500">Seller Name</p>
                            <p className="text-sm text-gray-800 font-semibold truncate">{sellerData.fullName || sellerData.name || 'N/A'}</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-1.5 flex-shrink-0"></div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-500">Email Address</p>
                            <p className="text-sm text-gray-800 font-semibold truncate">{sellerData.email || 'N/A'}</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-1.5 flex-shrink-0"></div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-500">Phone Number</p>
                            <p className="text-sm text-gray-800 font-semibold">{sellerData.mobile || sellerData.phone || 'N/A'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-200/50">
                        <p className="text-xs text-gray-500 italic flex items-start">
                          <svg className="w-3 h-3 text-green-500 mr-1 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Showroom contact details
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {selectedShowroom && !sellerData && !loadingSeller && !errorSeller && (
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-lg">
                    <p className="text-amber-800 text-sm font-medium">No seller information found for this showroom.</p>
                  </div>
                )}
              </div>
            )}

            {/* Payment Type Selection */}
            <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm mt-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Payment method
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="fullPayment"
                      name="paymentType"
                      value="full"
                      checked={paymentType === 'full'}
                      onChange={() => setPaymentType('full')}
                      className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="fullPayment" className="ml-2 block text-sm font-medium text-gray-700">
                      Full Payment
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="installment"
                      name="paymentType"
                      value="installment"
                      checked={paymentType === 'installment'}
                      onChange={() => setPaymentType('installment')}
                      className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="installment" className="ml-2 block text-sm font-medium text-gray-700">
                      Installment
                    </label>
                  </div>
                </div>
              </div>

            </div>

            {purchaseType === 'deposit' && (
              <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm mt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Deposit Information
                </h3>
                <div className="space-y-2 text-lg">
                  <div className="flex justify-between items-center text-gray-700">
                    <span>Deposit (5-10 million VND):</span>
                    <span className="font-semibold text-green-700">{formatCurrency(depositAmount)}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Deposit Payment Method</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                      <input
                        type="radio"
                        name="depositPaymentMethod"
                        value="e_wallet_momo_test"
                        checked={depositPaymentMethod === 'e_wallet_momo_test'}
                        onChange={handleDepositPaymentMethodChange}
                        className="h-5 w-5 text-green-600 border-gray-300 focus:ring-green-500"
                      />
                      <span className="ml-3 font-medium text-gray-700">MoMo</span>
                    </label>
                  </div>
                  {!depositPaymentMethod && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg mt-4">
                      <p className="text-red-800 text-sm font-medium">Please select a deposit payment method.</p>
                    </div>
                  )}
                </div>

                {isDepositPaid && (
                  <div className="mt-6 space-y-2">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Key Dates</h4>
                    <div className="flex justify-between items-center text-gray-700">
                      <span>Calculated Delivery Date:</span>

                      <span className="font-semibold">
                        {(() => {
                          const today = new Date();
                          const deliveryDate = new Date(today.setDate(today.getDate() + 30));
                          return deliveryDate.toLocaleDateString('vi-VN');
                        })()}

                      </span>
                    </div>
                    <div className="flex justify-between items-center text-gray-700">
                      <span>Payment Due Date:</span>
                      <span className="font-semibold">

                        {(() => {
                          const today = new Date();
                          const deliveryDate = new Date(today.setDate(today.getDate() + 30));
                          const paymentDueDate = new Date(deliveryDate.setDate(deliveryDate.getDate() - 1));
                          return paymentDueDate.toLocaleDateString('vi-VN');
                        })()}

                      </span>
                    </div>
                  </div>
                )}

                <div className="mt-4 text-center">
                  <p className="text-sm font-semibold text-gray-800 mb-2">Purchase Agreement</p>
                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <button
                      onClick={handleViewContract}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Agreement
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 italic">You can view the agreement at any time.</p>
                </div>
              </div>
            )}

            {purchaseType === 'full_payment' && (
              <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm mt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <svg className="w-6 h-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Full Payment Method
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={handlePaymentMethodChange}
                      className="h-5 w-5 text-purple-600 border-gray-300 focus:ring-purple-500"
                    />
                    <span className="ml-3 font-medium text-gray-700">Bank Transfer</span>
                  </label>
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="e_wallet_momo_test"
                      checked={paymentMethod === 'e_wallet_momo_test'}
                      onChange={handlePaymentMethodChange}
                      className="h-5 w-5 text-purple-600 border-gray-300 focus:ring-purple-500"
                    />
                    <span className="ml-3 font-medium text-gray-700">E-Wallet (Momo Test)</span>
                  </label>
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="installment_plan"
                      checked={paymentMethod === 'installment_plan'}
                      onChange={handlePaymentMethodChange}
                      className="h-5 w-5 text-purple-600 border-gray-300 focus:ring-purple-500"
                    />
                    <span className="ml-3 font-medium text-gray-700">Installment Plan</span>
                  </label>
                </div>
                {!paymentMethod && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg mt-4">
                    <p className="text-red-800 text-sm font-medium">Please select a full payment method to proceed.</p>
                  </div>
                )}
                <div className="mt-6 space-y-2">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Key Dates</h4>
                  <div className="flex justify-between items-center text-gray-700">
                    <span>Calculated Delivery Date:</span>

                    <span className="font-semibold">
                      {(() => {
                        const today = new Date();
                        const deliveryDate = new Date(today.setDate(today.getDate() + 30));
                        return deliveryDate.toLocaleDateString('vi-VN');
                      })()}

                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-700">
                    <span>Payment Due Date:</span>
                    <span className="font-semibold">

                      {(() => {
                        const today = new Date();
                        const deliveryDate = new Date(today.setDate(today.getDate() + 30));
                        const paymentDueDate = new Date(deliveryDate.setDate(deliveryDate.getDate() - 1));
                        return paymentDueDate.toLocaleDateString('vi-VN');
                      })()}

                    </span>
                  </div>
                  {(() => {
                    const today = new Date();
                    const deliveryDate = new Date(today.setDate(today.getDate() + 30));
                    return !deliveryDate ? (
                      <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg mt-4">
                        <p className="text-red-800 text-sm font-medium">Delivery date is not set. This is required to proceed with full payment.</p>
                      </div>
                    ) : null;
                  })()}
                </div>
              </div>
            )}

            <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Order Summary
              </h3>
              <div className="space-y-2 text-lg">
                <div className="flex justify-between items-center text-gray-700">
                  <span>Vehicle Price:</span>
                  <span className="font-semibold">{formatCurrency(car.price)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-700">
                  <span>Registration Fee:</span>
                  <span className="font-semibold">{formatCurrency(car.pricing?.registrationFee || 0)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-700">
                  <span>Dealer Fee:</span>
                  <span className="font-semibold">{formatCurrency(car.pricing?.dealerFee || 0)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-700">
                  <span>Tax ({((car.pricing?.taxRate || 0.085) * 100).toFixed(1)}%):</span>
                  <span className="font-semibold">{formatCurrency(Math.round(car.price * (car.pricing?.taxRate || 0.085)))}</span>
                </div>
                {deliveryOption === 'shipping' && (
                  <div className="flex justify-between items-center text-gray-700">
                    <span>Shipping Cost:</span>
                    <span className="font-semibold">{formatCurrency(SHIPPING_COST)}</span>
                  </div>
                )}
                {purchaseType === 'deposit' && (
                  <>
                    <div className="flex justify-between items-center text-gray-700 font-bold text-lg border-t border-dashed border-gray-300 pt-2 mt-2">
                      <span>Deposit Amount (30%):</span>
                      <span className="font-semibold text-green-700">{formatCurrency(depositAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-700 font-bold text-lg border-t border-dashed border-gray-300 pt-2 mt-2">
                      <span>Remaining Balance:</span>
                      <span className="font-semibold text-red-700">{formatCurrency(remainingBalance)}</span>
                    </div>
                  </>
                )}
                <div className="border-t border-gray-300 pt-3 mt-3 flex justify-between items-center text-xl font-bold text-gray-900">
                  <span>Total Payable:</span>
                  <span>{formatCurrency(calculateTotalPrice())}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 flex flex-col sm:flex-row gap-3 p-6 pt-4 border-t border-gray-200/50 bg-white/80 backdrop-blur-sm rounded-b-2xl">
            <button
              onClick={() => navigate(`/cars/${carId}`)}
              className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 hover:shadow-md active:scale-95 border border-gray-200"
            >
              Cancel
            </button>
            {purchaseType === 'deposit' && !isDepositPaid ? (
              <button
                onClick={handleDeposit}
                disabled={isProcessingDeposit || loadingUser || errorUser || loadingSeller || errorSeller || !userData || !sellerData || !car || !selectedShowroom || !depositPaymentMethod || (deliveryOption === 'shipping' && !useUserProfileAddress && (!shippingAddressInfo.name || !shippingAddressInfo.address || !shippingAddressInfo.phone))}
                className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-all duration-200 active:scale-95 ${(isProcessingDeposit || loadingUser || errorUser || loadingSeller || errorSeller || !userData || !sellerData || !car || !selectedShowroom || !depositPaymentMethod || (deliveryOption === 'shipping' && !useUserProfileAddress && (!shippingAddressInfo.name || !shippingAddressInfo.address || !shippingAddressInfo.phone)))
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-300'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl border border-transparent'
                  }`}
              >
                {(isProcessingDeposit || loadingUser || loadingSeller) ? (
                  <span className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing Deposit...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Place Deposit ({formatCurrency(depositAmount)})
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                )}
              </button>
            ) : (
              <button
                onClick={handleFullPayment}
                disabled={isProcessingFullPayment || !deliveryDate || !paymentMethod || (purchaseType === 'deposit' && !isDepositPaid) || (deliveryOption === 'shipping' && !useUserProfileAddress && (!shippingAddressInfo.name || !shippingAddressInfo.address || !shippingAddressInfo.phone))}
                className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-all duration-200 active:scale-95 ${(isProcessingFullPayment || !deliveryDate || !paymentMethod || (purchaseType === 'deposit' && !isDepositPaid) || (deliveryOption === 'shipping' && !useUserProfileAddress && (!shippingAddressInfo.name || !shippingAddressInfo.address || !shippingAddressInfo.phone)))
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-300'
                  : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl border border-transparent'
                  }`}
              >
                {(isProcessingFullPayment || loadingUser || loadingSeller) ? (
                  <span className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing Payment...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    {purchaseType === 'deposit' ? `Make Full Payment (${formatCurrency(remainingBalance)})` : `Make Full Payment (${formatCurrency(calculateTotalPrice())})`}
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {contractModal.open && (
        <ContractViewerModal
          content={contractModal.content}
          onClose={() => setContractModal({ open: false, content: '' })}
        />
      )}
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-h-[95vh] overflow-hidden relative w-full max-w-2xl">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-3xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

function ContractViewerModal({ content, onClose }) {
  // Function to format the plain text content into a more structured HTML-like view
  const formatContractTextToHtml = (text) => {
    // Split the text into lines
    const lines = text.split('\n');
    let htmlContent = '';

    // Helper to add a paragraph with specific classes
    const addParagraph = (line, classes = 'mb-3 text-gray-700') => {
      if (line.trim()) {
        htmlContent += `<p class="${classes}">${line.trim()}</p>`;
      }
    };

    // Process each line to apply specific formatting
    lines.forEach(line => {
      if (line.includes('VEHICLE PURCHASE AGREEMENT')) {
        htmlContent += '<div class="text-center mb-8"><h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">VEHICLE PURCHASE AGREEMENT</h1><div class="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div></div>';
      } else if (line.startsWith('Agreement No:')) {
        htmlContent += `<div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg"><p class="text-lg font-semibold text-blue-800">${line.trim()}</p></div>`;
      } else if (line.startsWith('Date:')) {
        htmlContent += `<div class="bg-purple-50 border-l-4 border-purple-500 p-4 mb-6 rounded-r-lg"><p class="text-lg font-semibold text-purple-800">${line.trim()}</p></div>`;
        htmlContent += '<div class="my-8"><div class="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div></div>';
      } else if (line.includes('This sales contract')) {
        addParagraph(line, 'mb-6 text-gray-600 text-lg leading-relaxed italic');
      } else if (line.startsWith('Seller:') || line.startsWith('Buyer:')) {
        const isseller = line.startsWith('Seller:');
        const bgColor = isseller ? 'bg-emerald-50 border-emerald-500' : 'bg-amber-50 border-amber-500';
        const textColor = iseller ? 'text-emerald-800' : 'text-amber-800';
        htmlContent += `<div class="${bgColor} border-l-4 p-5 mt-8 mb-4 rounded-r-lg shadow-sm"><h3 class="text-xl font-bold ${textColor}">${line.trim()}</h3></div>`;
      } else if (line.includes('The Seller is the manufacturer and distributor')) {
        addParagraph(line, 'mt-6 mb-4 text-gray-600 leading-relaxed');
      } else if (line.includes('THEREFORE, the Parties agree as follows:')) {
        htmlContent += '<div class="mt-10 mb-8 text-center"><h3 class="text-2xl font-bold text-gray-800 mb-4">THEREFORE, the Parties agree as follows:</h3><div class="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div></div>';
      } else if (line.match(/^\d+\./) && line.includes('.')) { // Matches numbered sections like "1. Sale of Goods."
        htmlContent += `<div class="bg-white border border-gray-200 rounded-lg p-5 mt-6 mb-4 shadow-sm hover:shadow-md transition-shadow duration-200"><h4 class="text-lg font-semibold text-gray-800 flex items-center"><span class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">${line.trim().split('.')[0]}</span>${line.trim().substring(line.indexOf('.') + 1)}</h4></div>`;
      } else if (line.includes('SIGNATURES')) {
        htmlContent += '<div class="mt-16 mb-12 text-center"><h3 class="text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-4">SIGNATURES</h3><div class="w-20 h-1 bg-gradient-to-r from-gray-600 to-gray-800 mx-auto rounded-full"></div></div>';
      } else if (line.includes('SELLER') && line.includes('BUYER') && line.includes('WITNESS')) {
        htmlContent += '<div class="grid grid-cols-3 gap-6 text-center mb-8"><div class="bg-emerald-50 p-4 rounded-lg border border-emerald-200"><span class="font-bold text-emerald-800 text-lg">SELLER</span></div><div class="bg-amber-50 p-4 rounded-lg border border-amber-200"><span class="font-bold text-amber-800 text-lg">BUYER</span></div><div class="bg-blue-50 p-4 rounded-lg border border-blue-200"><span class="font-bold text-blue-800 text-lg">WITNESS</span></div></div>';
      } else if (line.includes('_______')) { // Signature lines
        htmlContent += '<div class="grid grid-cols-3 gap-6 mb-6"><div class="border-b-2 border-gray-400 pb-2 min-h-[3rem]"></div><div class="border-b-2 border-gray-400 pb-2 min-h-[3rem]"></div><div class="border-b-2 border-gray-400 pb-2 min-h-[3rem]"></div></div>';
      } else if (line.includes('(Signature)')) {
        htmlContent += '<div class="grid grid-cols-3 gap-6 text-center mb-8"><span class="text-sm text-gray-500 italic">(Signature)</span><span class="text-sm text-gray-500 italic">(Signature)</span><span class="text-sm text-gray-500 italic">(Signature)</span></div>';
      } else if (line.includes('This agreement is made in two (02) copies')) {
        htmlContent += `<div class="mt-12 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center"><p class="text-sm text-gray-600 italic">${line.trim()}</p></div>`;
      } else if (line.includes('©') && line.includes('AutoSaleDN Company')) {
        htmlContent += `<div class="mt-8 text-center"><p class="text-xs text-gray-400">${line.trim()}</p></div>`;
      } else if (line.trim()) { // Default for other non-empty lines
        addParagraph(line, 'mb-3 text-gray-700 leading-relaxed');
      }
    });

    return htmlContent;
  };

return (
    <Modal onClose={onClose}>
      {/* SỬA 1: Thêm `flex flex-col` để kích hoạt layout Flexbox */}
      <div className="bg-white rounded-3xl shadow-2xl max-h-[95vh] w-full max-w-5xl border-2 border-blue-100 flex flex-col">

        
        {/* Modal Header: Không cần thay đổi */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white relative">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="absolute -top-2 -right-2 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-1">Vehicle Purchase Agreement</h2>
                <p className="text-blue-100 text-sm">Legal Document Viewer</p>
              </div>
            </div>
            <button
              className="p-3 rounded-2xl bg-white/20 hover:bg-white/30 transition-all duration-300 border border-white/30 backdrop-blur-sm hover:scale-105"
              onClick={onClose}
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 p-10 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50/30 text-gray-800 leading-relaxed scrollbar-custom">
          <div
            className="animate-fade-in"
            dangerouslySetInnerHTML={{ __html: formatContractTextToHtml(content) }}
          />
        </div>

        {/* Modal Footer: Không cần thay đổi */}
        <div className="p-6 bg-white/80 backdrop-blur-sm border-t border-gray-200/50 flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Legal document - Please review carefully</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Close
            </button>
          </div>
        </div>
      </div>

      {/* CSS cho animation và scrollbar (đã gộp chung) */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .scrollbar-custom::-webkit-scrollbar {
          width: 8px;
        }
        .scrollbar-custom::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 4px;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #2563eb, #7c3aed);
        }
      `}</style>
    </Modal>
  );
}
