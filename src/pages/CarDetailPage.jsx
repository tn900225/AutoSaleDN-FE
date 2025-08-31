// src/pages/CarDetailPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import Login from "../components/Login";
import { getApiBaseUrl } from "../../util/apiconfig";
import { useUserContext } from "../components/context/UserContext";
import { Calendar, Clock, UserCheck, MessageSquare, Car, Info, X, MapPin } from "lucide-react";

const formatCurrency = (num) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(num);

const LoanApplicationModal = ({ partner, car, loanDetails, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    dateOfBirth: '',
    address: '',
    email: ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full name is required.';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required.';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required.';
    if (!formData.address) newErrors.address = 'Address is required.';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'A valid email is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Pass the complete application data to the parent component
      onSubmit({
        ...formData,
        carListingId: car.listingId,
        partnerName: partner.name,
        loanAmount: loanDetails.loanAmount,
        interestRate: partner.interestRate,
        paybackPeriodMonths: loanDetails.paybackPeriod
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-5 border-b">
          <h3 className="text-xl font-bold">Loan Application with {partner.name}</h3>
          <p className="text-sm text-gray-500">For {car.model.manufacturer.name} {car.model.name}</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Form Fields */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input type="text" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
            </div>
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm ${errors.address ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
          </div>
          <div className="p-4 bg-gray-50 flex justify-end gap-3 rounded-b-lg">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Submit Application</button>
          </div>
        </form>
      </div>
    </div>
  );
};


const TestDriveModal = ({ car, onClose, onSubmit }) => {
  const [selectedShowroomId, setSelectedShowroomId] = useState('');
  const [formData, setFormData] = useState({ date: '', time: '', hasLicense: false, notes: '' });
  const [errors, setErrors] = useState({});

  // Tự động chọn showroom đầu tiên nếu chỉ có 1 lựa chọn
  useEffect(() => {
    if (car?.showrooms?.length === 1) {
      setSelectedShowroomId(car.showrooms[0].storeLocationId);
    }
  }, [car]);

  const validate = () => {
    const newErrors = {};
    if (!selectedShowroomId) newErrors.showroom = "Please select a showroom.";
    if (!formData.date) newErrors.date = "Please select a date.";
    if (!formData.time) newErrors.time = "Please select a time.";
    const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
    if (selectedDateTime < new Date()) {
      newErrors.dateTime = "The selected date and time cannot be in the past.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Available showrooms:", car.showrooms);
    console.log("Selected showroomId:", selectedShowroomId, typeof selectedShowroomId);
    console.log("Submitting booking with data:", { selectedShowroomId, formData });

    if (validate()) {
      // Vì selectedShowroomId được lưu dạng int, so sánh trực tiếp
      const selectedShowroom = car.showrooms.find(
        (s) => s.storeLocationId === selectedShowroomId
      );
      console.log("Selected showroom details:", selectedShowroom);
      if (!selectedShowroom || !selectedShowroom.storeListingId) {
        Swal.fire(
          "Error",
          "Could not find the car listing for the selected showroom.",
          "error"
        );
        return;
      }

      const bookingDateTime = new Date(`${formData.date}T${formData.time}`);

      onSubmit({
        storeListingId: selectedShowroom.storeListingId,
        bookingDate: bookingDateTime.toISOString(),
        hasLicense: formData.hasLicense,
        notes: formData.notes,
      });
    }
  };



  const minDate = new Date().toISOString().split("T")[0];

  const uniqueShowrooms = Array.from(new Map(
    (car?.showrooms || [])
      .filter(s => s && s.storeLocationId && s.storeListingId)
      .map(s => [s.storeLocationId, s])
  ).values());

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors">
          <X size={24} />
        </button>
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Schedule a Test Drive</h2>
          <p className="text-gray-600 mb-6">You are booking for: <span className="font-semibold">{car.model?.name}</span></p>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="showroom">Select Showroom</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <select
                  id="showroom"
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg transition-all 
        ${selectedShowroomId ? 'text-gray-900' : 'text-gray-400'} 
        ${errors.showroom ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
                  value={selectedShowroomId}
                  onChange={(e) => setSelectedShowroomId(Number(e.target.value))}
                >
                  <option value="">-- Choose a location --</option>

                  {/* Code đã được sửa để dùng đúng tên thuộc tính */}
                  {Array.from(new Map(
                    (car.showrooms || [])
                      .filter(s => s && s.storeLocationId && s.storeListingId) // 🔥 đảm bảo có storeListingId
                      .map(s => [s.storeLocationId, s])
                  ).values())
                    .map((showroom) => (
                      <option key={showroom.storeListingId} value={showroom.storeLocationId}>
                        {showroom.name} - {showroom.address}
                      </option>
                    ))}
                </select>
              </div>
              {errors.showroom && <p className="text-red-600 text-xs mt-1">{errors.showroom}</p>}
            </div>
            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="date">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="date"
                    id="date"
                    min={minDate}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg transition-all text-gray-900 placeholder-gray-400 ${errors.date ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                {errors.date && <p className="text-red-600 text-xs mt-1">{errors.date}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="time">Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="time"
                    id="time"
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg transition-all text-gray-900 placeholder-gray-400 ${errors.time ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
                {errors.time && <p className="text-red-600 text-xs mt-1">{errors.time}</p>}
              </div>
            </div>
            {errors.dateTime && <p className="text-red-600 text-xs mt-1">{errors.dateTime}</p>}

            {/* Has License */}
            <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <UserCheck className="text-gray-500" size={20} />
              <label htmlFor="hasLicense" className="text-sm font-medium text-gray-800">Do you have a valid driver's license?</label>
              <input
                type="checkbox"
                id="hasLicense"
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={formData.hasLicense}
                onChange={(e) => setFormData({ ...formData, hasLicense: e.target.checked })}
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="notes">Additional Notes (Optional)</label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 text-gray-400" size={20} />
                <textarea
                  id="notes"
                  rows="3"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 text-gray-900  placeholder-gray-400focus:border-blue-500 transition-all"
                  placeholder="e.g., specific features you want to test"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Car size={20} />
                <span>Confirm Booking</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


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
  const [sellerInfo, setSellerInfo] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState('');

  const [isCarSold, setIsCarSold] = useState(false);
  const [saleInfoText, setSaleInfoText] = useState("");

  const { user, chatWithSeller } = useUserContext();
  const [isTestDriveModalOpen, setIsTestDriveModalOpen] = useState(false);

  const [showLoanModal, setShowLoanModal] = useState(false);
  const [selectedPartnerForLoan, setSelectedPartnerForLoan] = useState(null);

  const API_BASE = getApiBaseUrl();



  const financingPartners = [
    {
      id: 'hdsaison',
      name: 'HD SAISON',
      images: 'https://www.hdsaison.com.vn/vnt_upload/weblink/Logo_website_01.png',
      interestRate: 7.9,
      contactUrl: 'https://www.hdsaison.com.vn/vn/lien-he.html',
      hotline: '1900-6929',
      rating: 4.5
    },
    {
      id: 'shinhan',
      name: 'Shinhan Bank',
      images: 'https://shinhan.com.vn/public/themes/shinhan/img/logo-01.svg',
      interestRate: 8.2,
      contactUrl: 'https://shinhan.com.vn/vi/contact',
      hotline: '1900-1577',
      rating: 4.3
    },
  ];

  const calculateMonthlyPayment = (principal, rate, months) => {
    const monthlyRate = rate / 100 / 12;
    const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    return payment;
  };

  const handlePartnerContact = (partner) => {
    window.open(partner.contactUrl, '_blank', 'noopener,noreferrer');
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-lg ${index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };
  const handleFinancingSubmit = async (applicationData) => {
    const API_BASE = getApiBaseUrl();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE}/api/Customer/financing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Add this line if your API requires authentication
        },
        body: JSON.stringify(applicationData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit application. Please try again.');
      }

      const result = await response.json();
      setShowLoanModal(false); // Close modal on success

      Swal.fire({
        title: 'Success!',
        text: result.message || 'Your application has been submitted successfully!',
        icon: 'success',
        confirmButtonText: 'Great!'
      });
      console.log("Generated Contract:", result.contract);

    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
      });
    }
  };

  useEffect(() => {
    const fetchCarData = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch car details
        const carResponse = await fetch(`${API_BASE}/api/User/cars/${carId}`);
        if (!carResponse.ok) {
          throw new Error(`HTTP error! Status: ${carResponse.status}`);
        }
        const carData = await carResponse.json();
        console.log("carData", carData); // Debug the response
        if (carData.userId) {
          setSellerInfo({
            id: carData.userId,
            name: carData.sellerName,
            email: carData.sellerEmail,
          });
        }

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
          carData.currentSaleStatus === "Pending Full Payment") {
          carSoldStatus = true;
          // Prefer currentPaymentStatus for detailed text if available, otherwise use currentSaleStatus
          saleText = carData.currentPaymentStatus || carData.currentSaleStatus;
          // You might want to refine saleText for "Pending" statuses
          if (carData.currentSaleStatus === "Pending Full Payment") {
            saleText = "Pending Full Payment";
          } else if (carData.currentSaleStatus === "On Hold" && saleText === "Deposit Made") {
            saleText = "Deposit Paid"; // Match what's displayed on the button
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
            storeListingId: s.storeListingId,
            storeLocationId: s.storeLocationId,
            name: s.name,
            address: s.address,
            phone: s.Phone || "+1 (555) 123-4567", // Fallback phone
          })) || [],
          currentSaleStatus: carData.currentSaleStatus, // Pass new status from API
          currentPaymentStatus: carData.currentPaymentStatus // Pass new status from API
        };

        setCar(mappedCar);

        // Fetch similar cars
        const similarCarsResponse = await fetch(`${API_BASE}/api/User/cars/${carId}/similar`);
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

  const handleTestDrive = () => {
    // Kiểm tra đăng nhập trước khi mở modal
    if (!user) {
      setShowSignInModal(true);
      return;
    }
    setIsTestDriveModalOpen(true);
  };

  const handleBookingSubmit = async (bookingData) => {
    const token = localStorage.getItem('token');
    const API_BASE = getApiBaseUrl();

    try {
      const response = await fetch(`${API_BASE}/api/Customer/test-drive`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to book test drive.");
      }

      setIsTestDriveModalOpen(false); // Đóng modal
      Swal.fire({
        icon: 'success',
        title: 'Booking Successful!',
        text: result.message,
        confirmButtonColor: "#3B82F6",
      });

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Booking Failed',
        text: error.message,
        confirmButtonColor: "#3B82F6",
      });
    }
  };


  const handleChatClick = () => {
    if (!user) {
      // setShowLogin(true); // Mở popup login nếu cần
      return;
    }

    if (chatWithSeller && sellerInfo) {
      chatWithSeller(sellerInfo);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Không thể bắt đầu',
        text: 'Không tìm thấy thông tin người bán để trò chuyện.',
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

      const userResponse = await fetch(`${API_BASE}/api/User/me`, {
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
        text: `We couldn't proceed with the purchase due to a server error. Please try again later.`,
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

  console.log("Rendering CarDetailPage with car:", car);

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
                    {
                      isCarSold
                        ? saleInfoText
                        : ['Pending Deposit', 'Available', 'Refunded', 'Cancelled'].includes(car.listingStatus)
                          ? 'Available'
                          : car.listingStatus
                    }
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
                  {/* Biến isActionDisabled sẽ quyết định cả 2 nút có bị vô hiệu hóa hay không */}
                  {(() => {
                    const isActionDisabled = !["Available", "Pending Deposit", "Refunded"].includes(car.listingStatus);

                    return (
                      <>
                        {/* Nút Buy Now */}
                        <button
                          className={`font-bold px-8 py-4 rounded-xl shadow-lg transition-all duration-200 ${isActionDisabled
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white transform hover:scale-105"
                            }`}
                          onClick={!isActionDisabled ? handlePurchase : undefined}
                          disabled={isActionDisabled}
                        >
                          {isActionDisabled ? car.listingStatus : "Buy Now"}
                        </button>

                        {/* Nút Schedule Test Drive */}
                        <button
                          className={`border-2 font-bold px-12 py-4 rounded-xl transition-all duration-200 text-lg ${isActionDisabled
                            ? "border-gray-500 text-gray-500 cursor-not-allowed"
                            : "border-white hover:bg-white hover:text-gray-900"
                            }`}
                          onClick={!isActionDisabled ? handleTestDrive : undefined}
                          disabled={isActionDisabled}
                        >
                          Schedule Test Drive
                        </button>
                      </>
                    );
                  })()}

                  {/* Render Modal */}
                  {isTestDriveModalOpen && (
                    <TestDriveModal
                      car={car}
                      onClose={() => setIsTestDriveModalOpen(false)}
                      onSubmit={handleBookingSubmit}
                    />
                  )}
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
      <div class="max-w-7xl mx-auto px-4 -mt-12 relative z-10">
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Price Breakdown</h2>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="space-y-4">
              <div class="flex justify-between items-center py-2">
                <span class="text-gray-600">Vehicle Price</span>
                <span class="font-semibold text-xl">{formatCurrency(price)}</span>
              </div>
              <div class="flex justify-between items-center py-2">
                <span class="text-gray-600">Registration Fee</span>
                <span class="font-semibold">{formatCurrency(regFee)}</span>
              </div>
              <div class="flex justify-between items-center py-2">
                <span class="text-gray-600">Tax ({(priceInfo.taxRate * 100).toFixed(1)}%)</span>
                <span class="font-semibold">{formatCurrency(tax)}</span>
              </div>
              <hr class="my-4" />
              <div class="flex justify-between items-center py-2">
                <span class="text-xl font-bold text-gray-900">Total Price</span>
                <span class="text-2xl font-bold text-green-600">{formatCurrency(totalPrice)}</span>
              </div>
            </div>
            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Financing Calculator</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Down Payment: {downPayment}% ({formatCurrency((price * downPayment) / 100)})
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    step={5}
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    class="w-full accent-blue-600"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Loan Term: {paybackPeriod} months
                  </label>
                  <input
                    type="range"
                    min={12}
                    max={84}
                    step={12}
                    value={paybackPeriod}
                    onChange={(e) => setPaybackPeriod(Number(e.target.value))}
                    class="w-full accent-blue-600"
                  />
                </div>
                <div class="bg-blue-100 rounded-lg p-3 my-3 text-center">
                  <div class="text-sm text-blue-800 font-semibold">Estimated Monthly Payment</div>
                  <div class="text-3xl font-extrabold text-blue-900">
                    {formatCurrency(
                      selectedPartner
                        ? calculateMonthlyPayment(
                          price - (price * downPayment) / 100,
                          financingPartners.find(p => p.id === selectedPartner)?.interestRate || 8.5,
                          paybackPeriod
                        )
                        : monthlyPayment
                    )}
                  </div>
                </div>
              </div>
              <div class="mt-6">
                <h4 class="text-lg font-semibold text-gray-900 mb-4">Financing Partners</h4>
                <div class="grid grid-cols-1 gap-3">
                  {financingPartners.map((partner) => {
                    const loanAmount = price - (price * downPayment) / 100;
                    const partnerMonthly = calculateMonthlyPayment(loanAmount, partner.interestRate, paybackPeriod);
                    const isSelected = selectedPartner === partner.id;

                    return (
                      <div
                        key={partner.id}
                        class={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                          }`}
                        onClick={() => setSelectedPartner(partner.id)}
                      >
                        <div class="flex items-center justify-between mb-2">
                          <div class="flex items-center gap-2">
                            <img src={partner.images} alt={`${partner.name} logo`} class="h-8 w-8 object-contain" />
                            <div>
                              <h5 class="font-semibold text-gray-900 text-sm">{partner.name}</h5>
                              <div class="flex items-center">
                                {renderStars(partner.rating)}
                                <span class="text-xs text-gray-500 ml-1">({partner.rating})</span>
                              </div>
                            </div>
                          </div>
                          <div class="text-right">
                            <div class="text-sm font-bold text-green-600">{partner.interestRate}%</div>
                            <div class="text-xs text-gray-500">interest rate</div>
                          </div>
                        </div>
                        <div class="bg-gray-50 rounded-lg p-2 mb-3 text-center">
                          <div class="text-xs text-gray-600">Monthly Installment</div>
                          <div class="text-lg font-bold text-blue-600">
                            {formatCurrency(partnerMonthly)}
                          </div>
                        </div>
                        <div class="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Open the modal and store the selected partner's info
                              setSelectedPartnerForLoan(partner);
                              setShowLoanModal(true);
                            }}
                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1 ${isSelected
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                          >
                            {/* You can replace this icon if you like */}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            Apply for Loan
                          </button>
                          <a
                            href={`tel:${partner.hotline}`}
                            onClick={(e) => e.stopPropagation()}
                            class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            title={`Call ${partner.hotline}`}
                          >
                            <svg class="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {selectedPartner && (
                  <div class="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <p class="text-sm text-green-700">
                      ✅ Selected: <strong>{financingPartners.find(p => p.id === selectedPartner)?.name}</strong>
                      <br />
                      Click "Contact" to be redirected to the partner's loan application page.
                    </p>
                  </div>
                )}
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
                    className={`w-20 h-12 flex-shrink-0 object-cover rounded-lg cursor-pointer border-2 transition-all overflow-hidden ${(videoGalleryIndex <= i && i < videoGalleryIndex + (videoURLs.length === 1 ? 1 : (videoURLs.length === 2 ? 2 : (videoURLs.length === 3 ? 3 : 4)))) ? "border-blue-500 shadow-md" : "border-transparent hover:border-gray-300"
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

            <p><div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: description || 'No description provided.' }}
            /></p>
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
                      onClick={handleChatClick}
                    >
                      Chat with Showroom
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
            <div className="text-gray-500 text-lg">Not yet Showrooms existting.</div>
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
                  {saleInfoText === "Deposit Made" ? "Deposit Paid" : (saleInfoText === "Full Payment Made" ? "Sold" : (saleInfoText || "Not Available"))}
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
      {showLoanModal && selectedPartnerForLoan && (
        <LoanApplicationModal
          partner={selectedPartnerForLoan}
          car={car}
          loanDetails={{
            // Ensure you have these state variables available in this component's scope
            loanAmount: price - (price * downPayment) / 100,
            paybackPeriod: paybackPeriod,
          }}
          onClose={() => setShowLoanModal(false)}
          onSubmit={handleFinancingSubmit}
        />
      )}
    </div>
  );

}

CarDetailPage.propTypes = {
  carId: PropTypes.string,
};