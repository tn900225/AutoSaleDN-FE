// src/pages/CarDetailPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import Login from "../components/Login";
// import PrePurchaseFormModal from "../components/PrePurchaseFormModal"; // Không cần import ở đây nữa

const formatCurrency = (num) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(num);

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleString("en-US", options);
};

// Đảm bảo hàm này xử lý tốt cả YouTube và các URL video trực tiếp
const getEmbedUrlAndType = (url) => {
  // Regex mạnh mẽ hơn cho YouTube
  const youtubeRegExp = /^(?:http(?:s)?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?$/;
  const match = url.match(youtubeRegExp);
  if (match && match[1]) {
    // Thêm autoplay và rel=0 cho Lightbox, nhưng sẽ loại bỏ chúng khi hiển thị trong lưới nhỏ
    return { url: `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0`, type: 'youtube' };
  }
  // Kiểm tra nếu là URL video trực tiếp (ví dụ: .mp4, .webm)
  if (/\.(mp4|webm|ogg)$/i.test(url)) {
    return { url: url, type: 'direct-video' };
  }
  // Mặc định là một URL không xác định (có thể là URL nhúng sẵn từ dịch vụ khác)
  return { url: url, type: 'unknown' };
};

const FEATURE_CATEGORIES = [
  {
    title: "Safety & Security",
    keys: [
      "ABS",
      "ESP",
      "Emergency Brake Assist",
      "Airbags",
      "Lane Keep Assist",
      "Warning System",
      "Parking Sensors",
      "Hill Start Assist",
      "Rain Sensor",
      "ISOFIX",
      "Anti-theft",
      "Auto-adjusting Mirrors",
      "Tire Pressure Monitor",
    ],
  },
  {
    title: "Comfort & Convenience",
    keys: [
      "Keyless Entry",
      "GPS Navigation",
      "Reverse Camera",
      "Apple CarPlay",
      "Android Auto",
      "Digital Dashboard",
      "LED Lights",
      "Automatic Climate Control",
      "Cruise Control",
      "Power Windows",
      "Heated Seats",
      "Bluetooth",
      "Multifunctional Steering",
      "Parking Sensors",
      "Interior Lighting",
      "Voice Control",
    ],
  },
  {
    title: "Premium Features",
    keys: ["GPS", "Sunroof", "Leather Seats"],
  },
];

export default function CarDetailPage({ carId: propCarId }) {
  const params = useParams();
  const navigate = useNavigate();
  const carId = propCarId || params.id;

  const [car, setCar] = useState(null);
  const [similarCars, setSimilarCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [photoGalleryIndex, setPhotoGalleryIndex] = useState(0);
  const [videoGalleryIndex, setVideoGalleryIndex] = useState(0);
  const [lightboxContent, setLightboxContent] = useState(null); 
  const [downPayment, setDownPayment] = useState(20);
  const [paybackPeriod, setPaybackPeriod] = useState(48);
  const [featureSearch, setFeatureSearch] = useState("");
  const heroRef = useRef(null);
  const [showSignInModal, setShowSignInModal] = useState(false);

  const [isCarSold, setIsCarSold] = useState(false);
  const [saleInfoText, setSaleInfoText] = useState("");

  useEffect(() => {
    const fetchCarData = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch car details
        const carResponse = await fetch(`/api/User/cars/${carId}`);
        if (!carResponse.ok) {
          throw new Error(`HTTP error! Status: ${carResponse.status}`);
        }
        const carData = await carResponse.json();

        let taxRateValue = 0.085; // Default value

        if (carData.pricing && carData.pricing[0] && typeof carData.pricing[0].taxRate === 'number') {
            taxRateValue = carData.pricing[0].taxRate;
            // Normalize taxRate: If it's a value like 8.5 (for 8.5%), divide by 100
            // Assuming tax rates are typically below 100% (e.g., 0.085 or 8.5, not 850)
            if (taxRateValue > 1) {
                taxRateValue = taxRateValue / 100;
            }
        }
        let carSoldStatus = false;
        let saleText = "";

        if (carData.currentSaleStatus === "Sold" ||
            carData.currentSaleStatus === "On Hold" ||
            carData.currentSaleStatus === "Pending Deposit" || // Thêm trạng thái Pending
            carData.currentSaleStatus === "Pending Full Payment") // Thêm trạng thái Pending
        {
            carSoldStatus = true;
            // Prefer currentPaymentStatus for detailed text if available, otherwise use currentSaleStatus
            saleText = carData.currentPaymentStatus || carData.currentSaleStatus;
            // You might want to refine saleText for "Pending" statuses
            if (carData.currentSaleStatus === "Pending Deposit") {
                saleText = "Pending Deposit";
            } else if (carData.currentSaleStatus === "Pending Full Payment") {
                saleText = "Pending Full Payment";
            } else if (carData.currentSaleStatus === "On Hold" && saleText === "Deposit Made") {
                saleText = "Deposit Placed"; // Match what's displayed on the button
            } else if (carData.currentSaleStatus === "Sold" && saleText === "Full Payment Made") {
                saleText = "Sold"; // Match what's displayed on the button
            }
        }
        setIsCarSold(carSoldStatus);
        setSaleInfoText(saleText);

        // Map API data to match the component's expected structure
        const mappedCar = {
          id: carData.listingId,
          year: carData.year,
          mileage: carData.mileage,
          price: carData.price,
          location: carData.showrooms?.[0]?.address || "Unknown Location",
          condition: carData.condition,
          listingStatus: carData.salesHistory?.[0]?.statusName || "Available",
          datePosted: carData.datePosted,
          description: carData.description,
          model: {
            name: carData.model?.name || "Unknown Model",
            manufacturer: {
              name: carData.model?.manufacturer?.name || "Unknown Manufacturer",
            },
          },
          specification: carData.specification?.[0]
            ? {
                engine: carData.specification[0].engine || "Unknown",
                transmission: carData.specification[0].transmission || "Unknown",
                fuelType: carData.specification[0].fuelType || "Unknown",
                carType: carData.specification[0].carType || "Unknown",
                seatingCapacity: carData.specification[0].seatingCapacity || 0,
                color: { name: carData.specification[0].exteriorColor || "Unknown" },
              }
            : {},
          images: carData.images?.map((img) => ({
            imageId: img.imageId,
            url: img.url,
            filename: img.filename,
          })) || [],
          videoURLs: carData.carVideo?.map((video) => {
            const { url, type } = getEmbedUrlAndType(video.url);
            return {
                id: video.id,
                originalUrl: video.url, // Keep original for reference if needed
                embedUrl: url,
                type: type
            };
          }) || [],
          features: carData.features?.map((f) => ({ name: f.name })) || [],
          pricing: carData.pricing?.[0]
            ? {
                registrationFee: carData.pricing[0].registrationFee || 0,
                dealerFee: 500, // Static dealer fee as in original
                taxRate: taxRateValue
              }
            : { registrationFee: 0, dealerFee: 500, taxRate: 0.085 },
          showrooms: carData.showrooms?.map((s) => ({
            id: s.storeLocationId, // Đảm bảo ID này khớp với ID bạn mong đợi trong PrePurchaseFormModal
            name: s.name,
            address: s.address,
            phone: s.Phone || "+1 (555) 123-4567", // Fallback phone
          })) || [],
          currentSaleStatus: carData.currentSaleStatus, // Pass new status from API
          currentPaymentStatus: carData.currentPaymentStatus // Pass new status from API
        };

        setCar(mappedCar);

        // Fetch similar cars
        const similarCarsResponse = await fetch(`/api/User/cars/${carId}/similar`);
        if (!similarCarsResponse.ok) {
          throw new Error(`HTTP error! Status: ${similarCarsResponse.status}`);
        }
        const similarCarsData = await similarCarsResponse.json();
        console.log("similarCarsData", similarCarsData); // Debug the response

        // Map similar cars to match the component's expected structure
        const mappedSimilarCars = similarCarsData.map((sc) => ({
          id: sc.listingId,
          name: sc.name || "Unknown Car",
          image: sc.image || "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop",
          price: sc.price || 0,
          details: sc.details
            ? [sc.details.engine || "Unknown", sc.details.transmission || "Unknown", sc.details.fuelType || "Unknown"]
            : ["Unknown", "Unknown", "Unknown"],
          tags: sc.tags || [],
        }));

        setSimilarCars(mappedSimilarCars);
      } catch (err) {
        setError(`Failed to fetch car data: ${err.message}`);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCarData();
  }, [carId]);

  // Lightbox now accepts embedUrl and its type
  const handleLightbox = (embedUrl, type = 'image') => {
    setLightboxContent({ content: embedUrl, type });
  };
  const handleCloseLightbox = () => setLightboxContent(null);

  const handleTestDrive = async (showroom) => {
    try {
      const { value } = await Swal.fire({
        title: "Schedule Test Drive",
        html: `
          <input id="swal-name" class="swal2-input" placeholder="Full Name">
          <input id="swal-phone" class="swal2-input" placeholder="Phone Number">
          <input id="swal-email" class="swal2-input" placeholder="Email Address">
          <input id="swal-date" class="swal2-input" type="datetime-local">
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Schedule",
        confirmButtonColor: "#3B82F6",
        preConfirm: () => {
          const name = document.getElementById("swal-name").value;
          const phone = document.getElementById("swal-phone").value;
          const email = document.getElementById("swal-email").value;
          const date = document.getElementById("swal-date").value;
          if (!name || !phone || !email || !date) {
            Swal.showValidationMessage("Please fill in all fields");
            return false;
          }
          return { name, phone, email, preferredDate: date };
        },
      });

      if (value) {
        await Swal.fire({
          icon: "success",
          title: "Test Drive Scheduled!",
          text: `Your test drive at ${showroom.name} has been scheduled successfully. We'll contact you shortly.`,
          confirmButtonText: "Great!",
          confirmButtonColor: "#10B981",
        });
      }
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Booking Failed",
        text: `Unable to schedule test drive: ${err.message}`,
        confirmButtonText: "Try Again",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  const handlePurchase = async () => {
    if (!car || !car.id) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Car details not available for purchase.",
        confirmButtonText: "OK",
      });
      return;
    }
     if (isCarSold) {
        Swal.fire({
            icon: "info",
            title: "Car Status",
            // Use saleInfoText from state directly, as it's prepared from backend
            text: `This car is currently ${saleInfoText.toLowerCase()}. It is not available for purchase.`,
            confirmButtonText: "OK",
        });
        return;
    }


    try {
        const token = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json',
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const userResponse = await fetch("/api/User/me", {
          method: 'GET',
          headers: headers,
        });

        if (userResponse.ok) {
          navigate(`/cars/${car.id}/purchase-terms`);
        } else if (userResponse.status === 401) {
          setShowSignInModal(true);
        } else {
          const errorData = await userResponse.json();
          Swal.fire({
            icon: "error",
            title: "Error",
            text: `Failed to verify login status: ${errorData.message || userResponse.statusText}`,
            confirmButtonText: "OK",
          });
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        Swal.fire({
          icon: "error",
          title: "Network Error",
          text: "Could not connect to the server to verify login status. Please try again.",
          confirmButtonText: "OK",
        });
      }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-opacity-75"></div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-red-600 text-lg">{error || "Car data not available."}</div>
      </div>
    );
  }

  const {
    year,
    mileage,
    price,
    location,
    condition,
    listingStatus,
    datePosted,
    description,
    model,
    specification = {},
    images = [],
    videoURLs = [],
    features = [],
    pricing = {},
    showrooms = [],
    currentSaleStatus
  } = car;

  const spec = specification || {};
  const priceInfo = pricing || {};
  const regFee = priceInfo.registrationFee || 0;
  const dealerFee = priceInfo.dealerFee || 0;
  const tax = Math.round(price * (priceInfo.taxRate || 0.085));
  const totalPrice = price + regFee + dealerFee + tax;
  const featureNames = features.map((f) => f.name);
  const filteredFeatures = featureNames.filter((f) => f.toLowerCase().includes(featureSearch.toLowerCase()));
  const groupedFeatures = FEATURE_CATEGORIES.map((cat) => ({
    title: cat.title,
    keys: filteredFeatures.filter((featureName) => cat.keys.includes(featureName)),
  })).filter((cat) => cat.keys.length > 0);
  const monthlyPayment = ((price - (price * downPayment) / 100) * 1.05) / paybackPeriod;

  // Determine grid classes for video gallery
  let videoGridClasses = "grid grid-cols-1 gap-6 mb-6";
  if (videoURLs.length === 1) {
    videoGridClasses += " md:grid-cols-1";
  } else if (videoURLs.length === 2) {
    videoGridClasses += " md:grid-cols-2";
  } else if (videoURLs.length === 3) {
    videoGridClasses += " md:grid-cols-3";
  } else if (videoURLs.length >= 4) {
    videoGridClasses += " md:grid-cols-2 lg:grid-cols-4";
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Hero Section */}
      <div ref={heroRef} className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-sm font-medium">
                   <span className={`px-3 py-1 rounded-full ${isCarSold ? 'bg-red-500' : 'bg-green-500'} text-white`}>
                    {isCarSold ? (saleInfoText) : (car.listingStatus || "Available")} 
                  </span>
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full">{condition}</span>
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  {model?.manufacturer?.name} <br />
                  <span className="text-blue-400">{model?.name}</span>
                </h1>
                <div className="flex flex-wrap gap-3 text-sm">
                  {year && <span className="bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">{year}</span>}
                  {mileage && (
                    <span className="bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">{mileage.toLocaleString()} miles</span>
                  )}
                  {spec.transmission && (
                    <span className="bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">{spec.transmission}</span>
                  )}
                  {spec.fuelType && (
                    <span className="bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">{spec.fuelType}</span>
                  )}
                </div>
              </div>
              {/* Description removed from here */}
              <div className="space-y-4">
                <div className="text-5xl font-bold text-green-400">{formatCurrency(price)}</div>
                <div className="flex flex-wrap gap-4">
                  {isCarSold ? (
                    <button
                      className="bg-gray-400 text-white font-bold px-8 py-4 rounded-xl shadow-lg cursor-not-allowed"
                      disabled
                    >
                      {saleInfoText === "Deposit Made" ? "Deposit Placed" : (saleInfoText === "Full Payment Made" ? "Sold" : (saleInfoText || "Not Available"))}
                    </button>
                  ) : (
                    <button
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                      onClick={handlePurchase}
                    >
                      Buy Now
                    </button>
                  )}
                  <button
                    className="border-2 border-white hover:bg-white hover:text-gray-900 font-bold px-8 py-4 rounded-xl transition-all duration-200"
                    onClick={() => handleTestDrive(showrooms[0] || {})}
                  >
                    Schedule Test Drive
                  </button>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src={images[0]?.url || "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop"}
                  alt="Car hero"
                  className="w-full h-80 lg:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Price Breakdown</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Vehicle Price</span>
                <span className="font-semibold text-xl">{formatCurrency(price)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Registration Fee</span>
                <span className="font-semibold">{formatCurrency(regFee)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Documentation Fee</span>
                <span className="font-semibold">{formatCurrency(dealerFee)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Tax ({(priceInfo.taxRate * 100).toFixed(1)}%)</span>
                <span className="font-semibold">{formatCurrency(tax)}</span>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between items-center py-2">
                <span className="text-xl font-bold text-gray-900">Total Price</span>
                <span className="text-2xl font-bold text-green-600">{formatCurrency(totalPrice)}</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Financing Calculator</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Down Payment: {downPayment}% ({formatCurrency((price * downPayment) / 100)})
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    step={5}
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Term: {paybackPeriod} months
                  </label>
                  <input
                    type="range"
                    min={12}
                    max={84}
                    step={12}
                    value={paybackPeriod}
                    onChange={(e) => setPaybackPeriod(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600">Estimated Monthly Payment</div>
                  <div className="text-2xl font-bold text-blue-600">{formatCurrency(monthlyPayment)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Photo Gallery</h2>
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {images.slice(photoGalleryIndex, photoGalleryIndex + 3).map((img, i) => (
              <div
                key={img.imageId || i}
                className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => handleLightbox(img.url, 'image')}
              >
                <img
                  src={img.url}
                  alt={img.filename || `Car image ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/90 rounded-full p-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6l4-2-4-2z" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Photo Gallery Navigation */}
          <div className="flex justify-center space-x-4">
            <button
              className="bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg transition-all disabled:opacity-50"
              onClick={() => setPhotoGalleryIndex(Math.max(0, photoGalleryIndex - 1))}
              disabled={photoGalleryIndex === 0}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              className="bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg transition-all disabled:opacity-50"
              onClick={() => setPhotoGalleryIndex(Math.min(images.length - 3, photoGalleryIndex + 1))}
              disabled={photoGalleryIndex >= images.length - 3}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
          {/* Photo Thumbnail Strip */}
          {/* <div className="flex justify-center space-x-2 mt-6 overflow-x-auto pb-2">
            {images.map((img, i) => (
              <img
                key={img.imageId || i}
                src={img.url}
                alt={`Thumbnail ${i + 1}`}
                className={`w-20 h-12 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                  photoGalleryIndex <= i && i < photoGalleryIndex + 3 ? "border-blue-500 shadow-md" : "border-transparent hover:border-gray-300"
                }`}
                onClick={() => setPhotoGalleryIndex(i)}
              />
            ))}
          </div> */}
        </div>
      </div>

      {/* Video Gallery */}
      {videoURLs.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Video Gallery</h2>
          <div className="relative">
            {/* Dynamic grid classes based on video count */}
            <div className={videoGridClasses}>
              {videoURLs.slice(videoGalleryIndex, videoGalleryIndex + (videoURLs.length === 1 ? 1 : (videoURLs.length === 2 ? 2 : (videoURLs.length === 3 ? 3 : 4)))).map((video, i) => (
                <div
                  key={video.id || i}
                  className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-xl transition-all duration-300 bg-gray-200"
                  onClick={() => handleLightbox(video.embedUrl, 'video')} // Mở lightbox với video embed URL
                >
                  {video.type === 'youtube' ? (
                    <iframe
                      src={video.embedUrl.replace('?autoplay=1&rel=0', '')} // <-- Thêm .replace() ở đây
                      title={`Video ${i + 1}`}
                      frameBorder="0"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" // allowFullScreen bị xóa khỏi đây
                      // allowFullScreen // Disable fullscreen for small embeds for better UX
                      className="w-full h-full object-cover"
                    ></iframe>
                  ) : video.type === 'direct-video' ? (
                    <video controls muted className="w-full h-full object-cover">
                      <source src={video.embedUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    // Fallback for unknown video types or if embedUrl is not suitable for iframe/video tag
                    <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 text-sm">
                        Không thể hiển thị video: {video.originalUrl}
                    </div>
                  )}
                  {/* Overlay for play icon (only if not a direct video with controls) */}
                  {!(video.type === 'direct-video') && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white/90 rounded-full p-3">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                  )}
                </div>
              ))}
            </div>
            {/* Video Gallery Navigation - Only show if more than 1 video */}
            {videoURLs.length > (videoURLs.length === 1 ? 1 : (videoURLs.length === 2 ? 2 : (videoURLs.length === 3 ? 3 : 4))) && (
                <div className="flex justify-center space-x-4">
                  <button
                    className="bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg transition-all disabled:opacity-50"
                    onClick={() => setVideoGalleryIndex(Math.max(0, videoGalleryIndex - 1))}
                    disabled={videoGalleryIndex === 0}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    className="bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg transition-all disabled:opacity-50"
                    onClick={() => setVideoGalleryIndex(Math.min(videoURLs.length - (videoURLs.length === 1 ? 1 : (videoURLs.length === 2 ? 2 : (videoURLs.length === 3 ? 3 : 4))), videoGalleryIndex + 1))}
                    disabled={videoGalleryIndex >= videoURLs.length - (videoURLs.length === 1 ? 1 : (videoURLs.length === 2 ? 2 : (videoURLs.length === 3 ? 3 : 4)))}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </button>
                </div>
            )}
            {/* Video Thumbnail Strip (displaying actual video in small size) - only show if more than 1 video */}
            {videoURLs.length > 1 && (
                <div className="flex justify-center space-x-2 mt-6 overflow-x-auto pb-2">
                  {videoURLs.map((video, i) => (
                    <div
                      key={video.id || i}
                      className={`w-20 h-12 flex-shrink-0 object-cover rounded-lg cursor-pointer border-2 transition-all overflow-hidden ${
                        (videoGalleryIndex <= i && i < videoGalleryIndex + (videoURLs.length === 1 ? 1 : (videoURLs.length === 2 ? 2 : (videoURLs.length === 3 ? 3 : 4)))) ? "border-blue-500 shadow-md" : "border-transparent hover:border-gray-300"
                      }`}
                      onClick={() => setVideoGalleryIndex(i)}
                    >
                        {video.type === 'youtube' ? (
                            <img
                              src={`https://img.youtube.com/vi/${video.embedUrl.split('/')[4].split('?')[0]}/default.jpg`}
                              alt={`Video thumbnail ${i + 1}`}
                              className="w-full h-full object-cover"
                            />
                        ) : video.type === 'direct-video' ? (
                            <video muted className="w-full h-full object-cover">
                                <source src={video.embedUrl} type="video/mp4" />
                            </video>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 text-xs">Video</div>
                        )}
                    </div>
                  ))}
                </div>
            )}
          </div>
        </div>
      )}

      {/* Vehicle specification */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Vehicle specification</h2>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Year", value: year || "-", icon: "📅" },
              { label: "Mileage", value: mileage ? `${mileage.toLocaleString()} miles` : "-", icon: "🛣️" },
              { label: "Engine", value: spec.engine || "-", icon: "⚙️" },
              { label: "Transmission", value: spec.transmission || "-", icon: "🔧" },
              { label: "Fuel Type", value: spec.fuelType || "-", icon: "⛽" },
              { label: "Body Type", value: spec.carType || "-", icon: "🚗" },
              { label: "Seating", value: spec.seatingCapacity ? `${spec.seatingCapacity} seats` : "-", icon: "👥" },
              { label: "Color", value: spec.color?.name || "-", icon: "🎨" },
            ].map((item, i) => (
              <div
                key={i}
                className="text-center space-y-3 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100"
              >
                <div className="text-2xl">{item.icon}</div>
                <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">{item.label}</div>
                <div className="text-lg font-bold text-gray-900">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Description Section (New Position) */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">More Description</h2>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <p className="text-lg text-gray-700 leading-relaxed">
            {description || "Không có mô tả nào được cung cấp cho chiếc xe này."}
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Features & Equipment</h2>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search features..."
              value={featureSearch}
              onChange={(e) => setFeatureSearch(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {groupedFeatures.map((category) => (
              <div key={category.title} className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  {category.title}
                </h3>
                <div className="space-y-3">
                  {category.keys.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg"
                    >
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="3"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </div>
                      <span className="text-gray-800 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Showroom Locations */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Available at Showrooms</h2>
        {showrooms.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {showrooms.map((showroom) => (
              <div
                key={showroom.showroomId}
                className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300"
              >
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900">{showroom.name}</h3>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-center space-x-3">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span>{showroom.address}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      <span>{showroom.phone}</span>
                    </div>
                  </div>
                  <div className="flex space-x-4 pt-4">
                    <button
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105"
                      onClick={() => handleTestDrive(showroom)}
                    >
                      Schedule Test Drive
                    </button>
                    <button
                      className="px-6 py-3 border-2 border-gray-200 hover:border-gray-300 rounded-xl transition-all duration-200"
                      onClick={() => window.open(`tel:${showroom.phone}`, "_self")}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-gray-500 text-lg">Hiện không có sẵn tại bất kỳ showroom nào.</div>
          </div>
        )}
      </div>

      {/* Similar Cars */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Similar Vehicles</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {similarCars.map((similarCar) => (
            <div
              key={similarCar.id}
              className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
              onClick={() => navigate(`/cars/${similarCar.id}`)}
            >
              <div className="relative">
                <img src={similarCar.image} alt={similarCar.name} className="w-full h-48 object-cover" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-gray-900">
                  {formatCurrency(similarCar.price)}
                </div>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-gray-900">{similarCar.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {similarCar.details.map((detail, j) => (
                    <span
                      key={j}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {detail}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {similarCar.tags.map((tag, j) => (
                    <span
                      key={j}
                      className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button className="w-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 font-semibold py-3 rounded-xl transition-all duration-200">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxContent && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-6xl max-h-[90vh] w-full">
            {lightboxContent.type === 'image' ? (
              <img src={lightboxContent.content} alt="Car detail" className="w-full h-full object-contain rounded-lg" />
            ) : (
              // For videos in lightbox, ensure autoplay is enabled
              <iframe
                src={lightboxContent.content}
                title="Car Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg"
                style={{ aspectRatio: '16/9' }} // Maintain aspect ratio for videos
              ></iframe>
            )}
            <button
              onClick={handleCloseLightbox}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-3 text-gray-900 transition-all duration-200"
              aria-label="Close lightbox"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Navigation arrows in lightbox (adjust for combined content) */}
            {/* For simplicity, navigation in lightbox is currently only for images. */}
            {lightboxContent.type === 'image' && (
              <>
                <button
                  onClick={() => {
                    const currentIndex = images.findIndex((img) => img.url === lightboxContent.content);
                    const prevIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
                    setLightboxContent({ content: images[prevIndex].url, type: 'image' });
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 text-gray-900 transition-all duration-200"
                  aria-label="Previous image"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    const currentIndex = images.findIndex((img) => img.url === lightboxContent.content);
                    const nextIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
                    setLightboxContent({ content: images[nextIndex].url, type: 'image' });
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 text-gray-900 transition-all duration-200"
                  aria-label="Next image"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </button>
              </>
            )}
            {/* If you want video navigation, you'd add similar logic here, but for videoURLs */}
          </div>
        </div>
      )}
       {/* Login Modal */}
      <Login
        show={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onLoginSuccess={() => {
          setShowSignInModal(false);
          handlePurchase();
        }}
      />

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold">
                Ready to Own This {model?.manufacturer?.name} {model?.name}?
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Don't miss out on this exceptional vehicle. Contact us today for more information or to schedule a test drive.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {isCarSold ? (
                <button
                  className="bg-gray-400 text-white font-bold px-12 py-4 rounded-xl shadow-lg cursor-not-allowed text-lg"
                  disabled
                >
                  {saleInfoText === "Deposit Made" ? "Deposit Placed" : (saleInfoText === "Full Payment Made" ? "Sold" : (saleInfoText || "Not Available"))}
                  {/* Cần điều chỉnh logic hiển thị saleInfoText cho các trạng thái chờ */}
                </button>
              ) : (
                <button
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-12 py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 text-lg"
                  onClick={handlePurchase}
                >
                  Buy Now - {formatCurrency(price)}
                </button>
              )}
              <button
                className="border-2 border-white hover:bg-white hover:text-gray-900 font-bold px-12 py-4 rounded-xl transition-all duration-200 text-lg"
                onClick={() => handleTestDrive(showrooms[0] || {})}
              >
                Schedule Test Drive
              </button>
            </div>
            <div className="grid md:grid-cols-3 gap-8 pt-12 text-center">
              <div className="space-y-2">
                <div className="text-2xl">🏆</div>
                <h3 className="text-lg font-semibold">Premium Quality</h3>
                <p className="text-gray-300 text-sm">Thoroughly inspected and certified vehicles</p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl">💰</div>
                <h3 className="text-lg font-semibold">Best Price Guarantee</h3>
                <p className="text-gray-300 text-sm">Competitive pricing with flexible financing</p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl">🛡️</div>
                <h3 className="text-lg font-semibold">Extended Warranty</h3>
                <p className="text-gray-300 text-sm">Comprehensive coverage for peace of mind</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}

CarDetailPage.propTypes = {
  carId: PropTypes.string,
};