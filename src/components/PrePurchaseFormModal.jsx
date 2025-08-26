import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

const formatCurrency = (num) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(num);

export default function PrePurchasePage() {
  const { carId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const initialShowrooms = location.state?.showrooms || [];
  const carFromState = location.state?.car || null;

  const [userData, setUserData] = useState(null);
  const [sellerData, setSellerData] = useState(null);
  const [showrooms, setShowrooms] = useState(initialShowrooms);
  const [selectedShowroom, setSelectedShowroom] = useState('');
  const [loadingUser, setLoadingUser] = useState(true);
  const [errorUser, setErrorUser] = useState('');
  const [loadingSeller, setLoadingSeller] = useState(false);
  const [errorSeller, setErrorSeller] = useState('');

  // New states for delivery and payment
  const [deliveryOption, setDeliveryOption] = useState('pickup'); // 'pickup' or 'shipping'
  const [shippingAddressInfo, setShippingAddressInfo] = useState({ // Dữ liệu nếu chọn "Ship tới chỗ khác"
    name: '',
    address: '',
    phone: ''
  });
  const [useUserProfileAddress, setUseUserProfileAddress] = useState(true); // Mặc định dùng địa chỉ user profile
  const [paymentMethod, setPaymentMethod] = useState(''); // e.g., 'bank_transfer', 'credit_card', 'cash_on_delivery'

  const SHIPPING_COST = 150; // Phí ship cố định, bạn có thể thay đổi

  // Effect để fetch thông tin xe và showroom nếu chưa có từ state
  useEffect(() => {
    if (!initialShowrooms || initialShowrooms.length === 0 || !carFromState) {
        const fetchCarAndShowrooms = async () => {
            setLoadingUser(true);
            setErrorUser('');
            try {
                const response = await fetch(`/api/User/cars/${carId}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch car data: ${response.statusText}`);
                }
                const carData = await response.json();

                let taxRateValue = 0.085;
                if (carData.pricing && carData.pricing[0] && typeof carData.pricing[0].taxRate === 'number') {
                    taxRateValue = carData.pricing[0].taxRate;
                    if (taxRateValue > 1) {
                        taxRateValue = taxRateValue / 100;
                    }
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
                };
                setCar(mappedCar);
                setShowrooms(mappedCar.showrooms);
            } catch (err) {
                setErrorUser('Failed to load car and showroom information. ' + err.message);
                console.error("Error fetching car and showroom data in PrePurchasePage:", err);
            } finally {
                setLoadingUser(false);
            }
        };
        fetchCarAndShowrooms();
    } else {
        setLoadingUser(false);
    }
  }, [carId, initialShowrooms, carFromState]);

  // Fetch user data
  useEffect(() => {
    setLoadingUser(true);
    setErrorUser('');
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch("/api/User/me", { headers });
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
  }, []);

  // Fetch seller data when selectedShowroom changes
  useEffect(() => {
    if (selectedShowroom && selectedShowroom !== '') {
      setLoadingSeller(true);
      setErrorSeller('');
      setSellerData(null);

      const fetchSellerData = async () => {
        try {
          const token = localStorage.getItem('token');
          const headers = { 'Content-Type': 'application/json' };
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }

          const apiUrl = `/api/Customer/${selectedShowroom}/seller`;
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

  const handleConfirm = async () => {
    if (!selectedShowroom && deliveryOption === 'pickup') {
      Swal.fire({
        icon: 'warning',
        title: 'Showroom Required',
        text: 'Please select a showroom for pickup.',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (deliveryOption === 'shipping') {
      if (!paymentMethod) {
        Swal.fire({
          icon: 'warning',
          title: 'Payment Method Required',
          text: 'Please select a payment method for shipping.',
          confirmButtonText: 'OK',
        });
        return;
      }
      if (!useUserProfileAddress) {
        // Validate custom shipping address
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
    } else if (deliveryOption === 'pickup') {
        if (!selectedShowroom) {
            Swal.fire({
                icon: 'warning',
                title: 'Showroom Required',
                text: 'Please select a showroom for pickup.',
                confirmButtonText: 'OK',
            });
            return;
        }
         if (!paymentMethod) { // Payment method is required for pickup too
            Swal.fire({
              icon: 'warning',
              title: 'Payment Method Required',
              text: 'Please select a payment method for pickup.',
              confirmButtonText: 'OK',
            });
            return;
        }
    }


    if (userData && sellerData && !errorUser && !errorSeller && car) {
      const price = car.price;
      const regFee = car.pricing?.registrationFee || 0;
      const dealerFee = car.pricing?.dealerFee || 0;
      const tax = Math.round(price * (car.pricing?.taxRate || 0.085));
      const shippingCost = deliveryOption === 'shipping' ? SHIPPING_COST : 0;
      const totalPrice = price + regFee + dealerFee + tax + shippingCost;

      let deliveryDetails = '';
      if (deliveryOption === 'pickup') {
        const confirmedShowroom = showrooms.find(sr => String(sr.id) === String(selectedShowroom));
        deliveryDetails = `Pick up at Showroom: ${confirmedShowroom?.name || 'N/A'}`;
      } else { // shipping
        const finalShippingAddress = useUserProfileAddress
          ? `${userData?.address || 'N/A'}, ${userData?.city || 'N/A'}, ${userData?.province || 'N/A'}`
          : `${shippingAddressInfo.address}, Phone: ${shippingAddressInfo.phone}, Recipient: ${shippingAddressInfo.name}`;
        deliveryDetails = `Ship to: ${finalShippingAddress}`;
      }

      try {
        await Swal.fire({
            icon: "success",
            title: "Order Placed!",
            html: `
                <p>Thank you for your purchase! Our sales team will contact you within 24 hours to complete the transaction.</p>
                <p class="mt-2 text-sm text-gray-600"><strong>Total Amount:</strong> ${formatCurrency(totalPrice)}</p>
                <p class="mt-1 text-sm text-gray-600"><strong>Delivery:</strong> ${deliveryDetails}</p>
                <p class="mt-1 text-sm text-gray-600"><strong>Payment Method:</strong> ${paymentMethod.replace(/_/g, ' ').toUpperCase()}</p>
            `,
            confirmButtonText: "Excellent!",
            confirmButtonColor: "#10B981",
        });
        navigate(`/cars/${car.id}`);
      } catch (err) {
          await Swal.fire({
              icon: "error",
              title: "Purchase Failed",
              text: `Unable to process purchase: ${err.message}`,
              confirmButtonText: "Try Again",
              confirmButtonColor: "#EF4444",
          });
      }
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'User, Seller or Car data is missing or has errors. Cannot proceed.',
            confirmButtonText: 'OK',
        });
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
    // Reset showroom selection if switching to shipping
    if (e.target.value === 'shipping') {
      setSelectedShowroom('');
    }
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  // Calculate total price for display
  const calculateTotalPrice = () => {
    if (!car) return 0;
    const price = car.price;
    const regFee = car.pricing?.registrationFee || 0;
    const dealerFee = car.pricing?.dealerFee || 0;
    const tax = Math.round(price * (car.pricing?.taxRate || 0.085));
    const shipping = deliveryOption === 'shipping' ? SHIPPING_COST : 0;
    return price + regFee + dealerFee + tax + shipping;
  };


  if (loadingUser || !car) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-opacity-75"></div>
        <p className="ml-4 text-gray-700">Loading car details and user info...</p>
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
                  <p className="text-red-800 font-medium">{errorSeller}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                 {/* Delivery Options */}
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
                        <label className="flex items-center text-gray-700 font-medium cursor-pointer">
                            <input
                                type="radio"
                                name="deliveryOption"
                                value="shipping"
                                checked={deliveryOption === 'shipping'}
                                onChange={handleDeliveryOptionChange}
                                className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="ml-3">Ship to Address (+$<span className="font-semibold">{SHIPPING_COST}</span>)</span>
                        </label>
                    </div>

                    {deliveryOption === 'pickup' && (
                        <div className="mt-4 space-y-2">
                            <label htmlFor="showroom-select" className="block text-sm font-semibold text-gray-700 mb-2">
                                Select Showroom
                            </label>
                            <div className="relative">
                                <select
                                id="showroom-select"
                                className="block w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md appearance-none cursor-pointer"
                                value={selectedShowroom}
                                onChange={handleShowroomChange}
                                >
                                <option value="">Choose your preferred showroom</option>
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
                    )}

                    {deliveryOption === 'shipping' && (
                        <div className="mt-4 space-y-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
                            <h4 className="text-lg font-semibold text-gray-800">Shipping Address</h4>
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

                {/* Two Column Layout for User and Seller Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* User Information Card */}
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

                  {/* Seller Information Card */}
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

            {/* Payment Options */}
            <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm mt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <svg className="w-6 h-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Payment Method
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
                            value="credit_card"
                            checked={paymentMethod === 'credit_card'}
                            onChange={handlePaymentMethodChange}
                            className="h-5 w-5 text-purple-600 border-gray-300 focus:ring-purple-500"
                        />
                        <span className="ml-3 font-medium text-gray-700">Credit Card</span>
                    </label>
                    <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="cash_on_delivery"
                            checked={paymentMethod === 'cash_on_delivery'}
                            onChange={handlePaymentMethodChange}
                            className="h-5 w-5 text-purple-600 border-gray-300 focus:ring-purple-500"
                        />
                        <span className="ml-3 font-medium text-gray-700">Cash on Delivery</span>
                    </label>
                </div>
                {!paymentMethod && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg mt-4">
                        <p className="text-red-800 text-sm font-medium">Please select a payment method to proceed.</p>
                    </div>
                )}
            </div>

            {/* Order Summary */}
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
                    <div className="border-t border-gray-300 pt-3 mt-3 flex justify-between items-center text-xl font-bold text-gray-900">
                        <span>Total Payable:</span>
                        <span>{formatCurrency(calculateTotalPrice())}</span>
                    </div>
                </div>
            </div>

          </div>

          {/* Fixed Action Buttons */}
          <div className="flex-shrink-0 flex flex-col sm:flex-row gap-3 p-6 pt-4 border-t border-gray-200/50 bg-white/80 backdrop-blur-sm rounded-b-2xl">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 hover:shadow-md active:scale-95 border border-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={loadingUser || errorUser || loadingSeller || errorSeller || !userData || !sellerData || !car || !paymentMethod || (deliveryOption === 'pickup' && !selectedShowroom) || (deliveryOption === 'shipping' && !useUserProfileAddress && (!shippingAddressInfo.name || !shippingAddressInfo.address || !shippingAddressInfo.phone))}
              className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-all duration-200 active:scale-95 ${
                (loadingUser || errorUser || loadingSeller || errorSeller || !userData || !sellerData || !car || !paymentMethod || (deliveryOption === 'pickup' && !selectedShowroom) || (deliveryOption === 'shipping' && !useUserProfileAddress && (!shippingAddressInfo.name || !shippingAddressInfo.address || !shippingAddressInfo.phone)))
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-300'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl border border-transparent'
              }`}
            >
              {(loadingUser || loadingSeller) ? (
                <span className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Loading...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Confirm & Proceed
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}