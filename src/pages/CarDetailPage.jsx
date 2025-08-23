import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

const formatCurrency = (num) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", minimumFractionDigits: 0 }).format(num);

const TAGS_COLOR = [
  "bg-blue-100 text-blue-800",
  "bg-purple-100 text-purple-800",
  "bg-yellow-100 text-yellow-800",
  "bg-green-100 text-green-800",
  "bg-red-100 text-red-800",
  "bg-orange-100 text-orange-800",
  "bg-cyan-100 text-cyan-800",
];

const FEATURE_CATEGORIES = [
  {
    title: "Security & Safety",
    keys: ["ABS", "ESP", "Emergency braking assist", "Airbags", "Lane keeping system", "Alarm", "Parking sensors", "Hill-start assist", "Rain sensor", "Isofix", "Immobilizer", "Auto-dimming mirrors", "Tire pressure monitoring"]
  },
  {
    title: "Comfort & Convenience",
    keys: ["Keyless", "Navigation", "Rear view camera", "Apple CarPlay", "Android Auto", "Digital cockpit", "LED headlights", "Automatic air conditioning", "Cruise control", "Electric windows", "Heated seats", "Bluetooth", "Multifunction steering wheel", "Parking sensors", "Ambient lighting", "Voice control"]
  },
  {
    title: "Other Features",
    keys: ["GPS", "Sunroof", "Leather Seats"]
  }
];

const steps = [
  { number: "01.", label: "Overview", anchor: "overview" },
  { number: "02.", label: "Details", anchor: "details" },
  { number: "03.", label: "Features", anchor: "features" },
  { number: "04.", label: "Financing", anchor: "financing" },
  { number: "05.", label: "Price History", anchor: "pricehistory" },
  { number: "06.", label: "Comparison", anchor: "comparison" },
];

export default function CarDetailPage({ carId: propCarId }) {
  const params = useParams();
  const navigate = useNavigate();
  const carId = propCarId || params.id;

  const [showStickySteps, setShowStickySteps] = useState(false);
  const overviewRef = useRef(null);
  const detailsRef = useRef(null);
  const featuresRef = useRef(null);
  const financingRef = useRef(null);
  const priceHistoryRef = useRef(null);
  const comparisonRef = useRef(null);

  const [galleryIndex, setGalleryIndex] = useState(0);
  const [downPayment, setDownPayment] = useState(20);

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const priceHistory = [
    { date: "01/01/2024", price: 22480 },
    { date: "01/07/2025", price: 22480 },
  ];

  const similarCars = [
    {
      image: "https://cdn.carvago.com/img/s/seat-arona-fr-dsg.jpg",
      name: "Seat Arona 1.0 TSI FR DSG 81 kW",
      price: 22480,
      tags: [
        "Keyless", "Navigation", "Automatic", "Apple CarPlay", "Android Auto", "Adaptive cruise control", "Digital cockpit", "LED headlights"
      ],
      details: ["6/2022", "17 000 km"],
      highlight: true,
    },
    {
      image: "https://cdn.carvago.com/img/s/seat-arona-style.jpg",
      name: "Seat Arona 1.0 TSI Style DSG 81 kW",
      price: 19780,
      tags: [
        "Automatic", "LED headlights", "Parking sensors", "Apple CarPlay", "Android Auto"
      ],
      details: ["5/2022", "27 000 km"],
      highlight: false,
    },
  ];

  const [lightboxImage, setLightboxImage] = useState(null);

  const handleLightbox = (imgUrl) => {
    setLightboxImage(imgUrl);
  };

  const handleCloseLightbox = () => {
    setLightboxImage(null);
  };

  useEffect(() => {
    setLoading(true);
    setError("");
    fetchCarDetail(carId)
      .then((data) => setCar(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [carId]);

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById("car-overview-hero");
      if (!hero) return;
      const { bottom } = hero.getBoundingClientRect();
      setShowStickySteps(bottom <= 0);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleStepNavClick = (idx) => {
    const refsArr = [overviewRef, detailsRef, featuresRef, financingRef, priceHistoryRef, comparisonRef];
    refsArr[idx]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    );
  if (error) return <div className="text-center text-red-600">{error}</div>;
  if (!car) return <div className="text-center text-red-600">Car not found</div>;

  const {
    year,
    mileage,
    price,
    location,
    condition,
    listingStatus,
    datePosted,
    model,
    specification = [],
    images = [],
    features = [],
    pricing = [],
  } = car;

  const spec = specification?.[0] || {};
  const priceInfo = pricing?.[0] || {};
  const regFee = priceInfo.registrationFee || 0;
  const vat = Math.round(price * 0.19);
  const priceNoVat = price - vat;

  const featureNames = features.map(f => f.name);
  
  const groupedFeatures = FEATURE_CATEGORIES.map(cat => ({
    title: cat.title,
    keys: featureNames.filter(featureName => cat.keys.includes(featureName))
  })).filter(cat => cat.keys.length > 0);

  const handleShowAllFeatures = () => {
    setShowAllFeatures(true);
  };

  const handleCloseFeatures = () => {
    setShowAllFeatures(false);
  };

  return (
    <div className="bg-[#f5f7fa] min-h-screen pb-16">
      {/* Features Modal */}
      {showAllFeatures && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="max-w-4xl w-full bg-white rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-900">Features</h2>
              <button 
                onClick={handleCloseFeatures}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {groupedFeatures.map(cat => (
                <div key={cat.title} className="space-y-4">
                  <div className="text-lg font-semibold text-gray-700">{cat.title}</div>
                  <ul className="list-none grid grid-cols-2 gap-3">
                    {cat.keys.map((f, i) => (
                      <li key={f} className="flex items-center gap-2 text-blue-800 bg-blue-50 rounded-lg p-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-6xl max-h-[90vh]">
            <img 
              src={lightboxImage} 
              alt="Car detail"
              className="w-full h-full object-contain"
              onClick={handleCloseLightbox}
            />
            <button 
              onClick={handleCloseLightbox}
              className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full p-2"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div
        className={`fixed top-0 left-0 w-full z-30 bg-white transition-all duration-300 shadow-sm ${showStickySteps ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none translate-y-[-100%]"}`}
        style={{ minHeight: "52px" }}
      >
        <div className="flex justify-center items-center gap-2 py-3 select-none">
          {steps.map((step, i) => (
            <React.Fragment key={step.number}>
              <button
                type="button"
                className={`font-bold text-[#3452e1] text-base mx-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-transparent transition-colors hover:text-blue-700`}
                onClick={() => handleStepNavClick(i)}
                tabIndex={0}
              >
                {step.number}
              </button>
              <span className="text-[#253887] text-base mr-3 font-medium">{step.label}</span>
              {i !== steps.length - 1 && (
                <span className="text-[#bfc8dc] font-bold px-1">|</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div id="car-overview-hero" ref={overviewRef} className="max-w-7xl mx-auto px-4 mt-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div>
          <div className="text-3xl font-bold text-blue-900 mb-1">{model?.manufacturer?.name} {model?.name} {spec.engine ? `- ${spec.engine}` : ""}</div>
          <div className="text-gray-500 flex items-center gap-2">
            {year && <span>{year}</span>}
            {mileage && <span>· {mileage.toLocaleString()} km</span>}
            {spec.transmission && <span>· {spec.transmission}</span>}
            {spec.fuelType && <span>· {spec.fuelType}</span>}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {featureNames.slice(0, 8).map((f, i) => (
            <span 
              key={f} 
              className={`rounded-full px-3 py-1 text-sm font-semibold ${TAGS_COLOR[i % TAGS_COLOR.length]} transition-transform hover:scale-105`}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-6 px-4 grid grid-cols-1 md:grid-cols-3 gap-6" ref={detailsRef}>
        <div className="md:col-span-2">
          <div className="relative w-full">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">Gallery</span>
              <span className="text-sm text-gray-600">{galleryIndex + 1} - {Math.min(galleryIndex + 3, images.length)} of {images.length}</span>
            </div>
            <div className="relative w-full">
              <button
                type="button"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 transition-all"
                onClick={() => setGalleryIndex(Math.max(0, galleryIndex - 1))}
                disabled={galleryIndex === 0}
              >
                <span className="flex">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#3452e1" strokeWidth="2" className="w-6 h-6">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </span>
              </button>
              <button
                type="button"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 transition-all"
                onClick={() => setGalleryIndex(Math.min(images.length - 1, galleryIndex + 1))}
                disabled={galleryIndex === images.length - 1}
              >
                <span className="flex">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#3452e1" strokeWidth="2" className="w-6 h-6">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </span>
              </button>
              <div className="relative w-full flex gap-4">
                {images.slice(galleryIndex, galleryIndex + 3).map((img, i) => (
                  <div 
                    key={img.imageId || i}
                    className="flex-1 relative aspect-video border border-gray-200 rounded-lg overflow-hidden cursor-pointer"
                    style={{ minWidth: '350px', maxWidth: '100%' }}
                    onClick={() => handleLightbox(img.url)}
                  >
                    <img
                      src={img.url}
                      alt={img.filename || `Car image ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.transition = 'transform 0.3s ease';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-opacity duration-300 flex items-center justify-center">
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                        <path d="M16 1v3m0 0v8m0-8h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0zm0 2a7 7 0 01-7 7h-.01A7 7 0 0121 12z"/>
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-4 sticky top-28">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 text-lg">Car price</span>
                <span className="text-3xl font-bold text-blue-900">{formatCurrency(price)}</span>
              </div>
              <div className="flex flex-col gap-1 text-sm text-gray-500">
                <div>Price without VAT: {formatCurrency(priceNoVat)}</div>
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3452e1" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>Free delivery</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 mt-4">
                <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl px-4 py-3 font-semibold transition-all">
                  <div className="flex items-center justify-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 1v3m0 0v8m0-8h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0zm0 2a7 7 0 01-7 7h-.01A7 7 0 0121 12z"/>
                    </svg>
                    Buy Now
                  </div>
                </button>
                <button className="flex-1 border border-blue-600 text-blue-600 rounded-xl px-4 py-3 font-semibold transition-colors hover:bg-blue-50">
                  <div className="flex items-center justify-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Financing {formatCurrency(647)}
                  </div>
                </button>
              </div>
              <div className="mt-6 pt-4 border-t">
                <div className="text-sm text-gray-700">
                  <div className="flex justify-between py-1">
                    <span>Services total</span>
                    <span>{formatCurrency(1146)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Registration</span>
                    <span>{formatCurrency(regFee)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Delivery</span>
                    <span>{formatCurrency(199)}</span>
                  </div>
                  <div className="flex justify-between py-1 font-semibold text-blue-900 border-t pt-2 mt-2">
                    <span>Total price</span>
                    <span>{formatCurrency(price + 1146 + regFee + 199)}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Total price excluding VAT</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div ref={featuresRef} className="max-w-7xl mx-auto mt-12 px-4 grid grid-cols-1 md:grid-cols-3 gap-6" id="car-details-section">
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl p-6 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 mb-6">
              {[
                { label: "First registration", value: year || "-" },
                { label: "Mileage", value: mileage ? mileage.toLocaleString() + " km" : "-" },
                { label: "Engine", value: spec.engine || "-" },
                { label: "Transmission", value: spec.transmission || "-" },
                { label: "Fuel", value: spec.fuelType || "-" },
                { label: "Body", value: spec.carType || "-" },
                { label: "Seats", value: spec.seatingCapacity || "-" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col">
                  <div className="text-sm text-gray-400 font-bold uppercase tracking-wider">{item.label}</div>
                  <div className="text-xl font-bold text-blue-900 mt-1">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="hidden md:block" />
      </div>

      <div ref={financingRef} className="max-w-7xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-xl p-6 mb-6">
          <div className="text-xl font-bold text-blue-900 mb-4">Features</div>
          <div className="grid grid-cols-1 gap-6">
            {groupedFeatures.map(cat => (
              <div key={cat.title} className="space-y-4">
                <div className="text-lg font-semibold text-gray-700">{cat.title}</div>
                <ul className="list-none grid grid-cols-1 gap-3">
                  {cat.keys.map((f, i) => (
                    <li key={f} className="flex items-center gap-2 text-blue-800 bg-blue-50 rounded-lg p-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div ref={priceHistoryRef} className="max-w-7xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-xl p-6 mb-6">
          <div className="bg-[#e6f0fa] rounded-xl p-4 flex items-center mb-4 gap-6">
            <img
              src="https://img.freepik.com/free-vector/car-loan-concept-illustration_114360-11388.jpg"
              alt="Financing"
              className="w-32 h-20 object-cover rounded-lg"
            />
            <div>
              <div className="text-xl font-bold text-blue-900">Finance your new car from 99 € per month!</div>
              <div className="text-gray-600 text-sm mt-1">0 online steps - Approval within 1 hour</div>
              <button className="mt-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-xl px-4 py-2 text-sm font-semibold hover:shadow-lg transition-all">
                Financing details →
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center text-sm mb-2">
              <span>Payback period</span>
              <span className="font-bold text-blue-900">48 months</span>
            </div>
            <div className="w-full flex items-center">
              <input
                type="range"
                min={12}
                max={72}
                value={48}
                readOnly
                className="flex-1 accent-blue-600"
              />
              <span className="ml-4 text-xs text-gray-600">months</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-4 mb-2">
              <span>Down payment</span>
              <span className="font-bold text-blue-900">{downPayment}% ≈ {formatCurrency((price * downPayment) / 100)}</span>
            </div>
            <div className="relative w-full">
              <input
                type="range"
                min={0}
                max={50}
                step={5}
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="absolute left-0 w-full h-2 bg-blue-100 rounded-full mt-1"></div>
            </div>
            <div className="flex gap-4 mt-4 text-sm">
              <div className="flex-1">Monthly payment</div>
              <div className="flex-1 text-right font-bold text-blue-900">
                {formatCurrency(((price - (price * downPayment) / 100) / 48))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div ref={comparisonRef} className="max-w-7xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-xl p-6 mb-6">
          <div className="text-xl font-bold text-blue-900 mb-4">Price History</div>
          <div className="relative w-full h-40">
            <div className="w-full h-full">
              <svg width="100%" height="100%" viewBox="0 0 340 100">
                <polyline
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="3"
                  points={priceHistory.map((ph, i) => `${30 + i * 140},${100 - (ph.price - 22000) / 5}`).join(" ")}
                />
                {priceHistory.map((ph, i) => (
                  <circle 
                    key={i} 
                    cx={30 + i * 140} 
                    cy={100 - (ph.price - 22000) / 5} 
                    r="5" 
                    fill="#2563eb"
                  />
                ))}
              </svg>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white to-transparent"></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-4">
            {priceHistory.map((ph, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="font-medium">{formatCurrency(ph.price)}</div>
                <div className="text-gray-400">{ph.date}</div>
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-400 mt-2 text-center">
            How the car price changed during its validation
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8" id="comparison-section">
        <div className="bg-white rounded-xl p-6 mb-6 flex flex-col gap-4">
          <div className="text-xl font-bold text-blue-900 mb-4">Similar Cars</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {similarCars.map((c, i) => (
              <div 
                key={i} 
                className={`rounded-xl shadow-sm p-4 border ${c.highlight ? "border-blue-700" : "border-gray-200"} bg-white transition-all hover:shadow-lg`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden">
                    <img 
                      src={c.image} 
                      alt={c.name} 
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 bg-white/80 p-2 rounded-full">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3452e1" strokeWidth="2">
                        <path d="M12 2a10 10 0 0 0-10 10c0 4.42 3.58 8 8 8s8-3.58 8-8a10 10 0 0 0-10-10z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-blue-900 text-center">{c.name}</div>
                  <div className="flex justify-center gap-2 text-sm text-gray-500">
                    {c.details.map((d, j) => (
                      <span key={j} className="px-2 py-1 bg-gray-100 rounded-full">
                        {d}
                      </span>
                    ))}
                  </div>
                  <div className="text-3xl font-bold text-blue-900 text-center">{formatCurrency(c.price)}</div>
                  <div className="flex flex-wrap justify-center gap-2 mt-3">
                    {c.tags.map((tag, j) => (
                      <span
                        key={j}
                        className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

async function fetchCarDetail(carId) {
  const token = localStorage.getItem("token");
  const url = `/api/Customer/cars/${carId}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch car detail");
  }
  return await res.json();
}