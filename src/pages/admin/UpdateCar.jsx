import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaSave, FaTimes } from "react-icons/fa";
import { Car, X } from "lucide-react";
import Swal from "sweetalert2";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import VehiclePhotosUpload from "../../components/admin/VehiclePhotosUpload";

// Helper constants for select options from AddNewCarPage.jsx
const YEAR_OPTIONS = Array.from({ length: 76 }, (_, i) => 2025 - i);
const FUEL_TYPE_OPTIONS = [
  { value: "petrol", label: "Petrol" },
  { value: "diesel", label: "Diesel" },
  { value: "electricity", label: "Electricity" },
  { value: "lpg", label: "Propane (LPG)" },
  { value: "hybrid", label: "Hybrid" },
  { value: "hydrogen", label: "Hydrogen" },
  { value: "natural_gas", label: "Natural Gas (CNG)" },
  { value: "methanol", label: "Methanol" },
  { value: "biodiesel", label: "Biodiesel" },
  { value: "synthetic_fuel", label: "Synthetic Fuel" },
  { value: "ethanol", label: "Ethanol" },
  { value: "other", label: "Other" },
];
const CONDITION_OPTIONS = [
  { value: "Excellent", label: "Excellent" },
  { value: "Good", label: "Good" },
  { value: "Fair", label: "Fair" },
];
const TRANSMISSION_OPTIONS = [
  { value: "Automatic", label: "Automatic" },
  { value: "Manual", label: "Manual" },
];
const CAR_TYPE_OPTIONS = [
  { value: "Sedan", label: "Sedan" },
  { value: "SUV", label: "SUV" },
  { value: "Coupe", label: "Coupe" },
  { value: "Hatchback", label: "Hatchback" },
  { value: "Truck", label: "Truck" },
  { value: "Minivan", label: "Minivan" },
  { value: "Convertible", label: "Convertible" },
  { value: "Wagon", label: "Wagon" },
];
const SEATING_CAPACITY_OPTIONS = Array.from({ length: 8 }, (_, i) => ({
  value: (i + 1).toString(),
  label: (i + 1).toString(),
}));

const initialFormState = {
  modelId: "",
  userId: "",
  year: "",
  mileage: "",
  price: "",
  condition: "",
  rentSell: "",
  exteriorColor: "", // Tên thuộc tính này sẽ được giữ lại trong form state
  vin: "",
  interiorColor: "",
  transmission: "",
  engine: "",
  fuelType: "",
  carType: "",
  seatingCapacity: "",
  registrationFee: "",
  taxRate: "",
  description: "",
  certified: false,
  featureIds: [],
  storeLocationId: "",
};

function UpdateCar() {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [carModels, setCarModels] = useState([]);
  const [carColors, setCarColors] = useState([]);
  const [features, setFeatures] = useState([]);
  const [storeLocationsWithUsers, setStoreLocationsWithUsers] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        };

        const carResponse = await fetch(`/api/admin/cars/${listingId}`, { headers });
        if (carResponse.status === 401) {
          Swal.fire({ icon: "error", title: "Unauthorized", text: "Please log in again." });
          navigate("/login");
          return;
        }
        if (!carResponse.ok) {
          throw new Error("Failed to fetch car details");
        }
        const carData = await carResponse.json();

        const formDataResponse = await fetch("/api/admin/cars/add-form-data", { headers });
        if (!formDataResponse.ok) {
          throw new Error("Failed to load form data");
        }
        const formData = await formDataResponse.json();
        setCarModels(formData.models || []);
        setCarColors(formData.colors || []);
        setFeatures(formData.features || []);

        const storeLocationsResponse = await fetch("/api/admin/storelocations", { headers });
        if (!storeLocationsResponse.ok) {
          throw new Error("Failed to fetch store locations.");
        }
        const storeLocationData = await storeLocationsResponse.json();
        if (storeLocationData.success && Array.isArray(storeLocationData.data)) {
            setStoreLocationsWithUsers(storeLocationData.data);
        } else {
            console.error("API returned an error or unexpected data format:", storeLocationData.message);
        }
        
        setForm({
            ...initialFormState,
            ...carData,
            modelId: parseInt(carData.modelId) || "",
            userId: carData.userId || "",
            year: parseInt(carData.year) || "",
            mileage: carData.mileage || "",
            price: carData.price || "",
            condition: carData.condition || "",
            // Gán giá trị màu sắc từ API (tên thuộc tính là 'color')
            exteriorColor: carData.color || "", 
            vin: carData.vin || "",
            interiorColor: carData.interiorColor || "",
            transmission: carData.transmission || "",
            engine: carData.engine || "",
            fuelType: carData.fuelType || "",
            carType: carData.carType || "",
            seatingCapacity: carData.seatingCapacity || "",
            registrationFee: carData.registrationFee || "",
            taxRate: carData.taxRate || "",
            description: carData.description || "",
            certified: carData.certified || false,
            // Đảm bảo lấy đúng mảng ID từ API
            featureIds: carData.features ? carData.features.map(f => f.featureId) : [],
            // Lấy showroomId từ mảng showrooms của carData
            storeLocationId: carData.showrooms?.[0]?.showroomId || "",
        });
        
        const previewImages = carData.imageUrl?.map(url => ({ type: "image", url, name: url.split('/').pop() })) || [];
        const previewVideos = carData.videoUrl?.map(url => ({ type: "video", url, name: url.split('/').pop() })) || [];
        setImagePreviews([...previewImages, ...previewVideos]);

      } catch (err) {
        console.error("Error fetching car:", err);
        setError(err.message);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load car details. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [listingId, navigate]);

  const selectedFileNames = imagePreviews.map(item => item.name).join(", ");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  
  // New handler for the rich text editor
  const handleDescriptionChange = (content) => {
    setForm((prev) => ({
      ...prev,
      description: content,
    }));
  };

  const handleFeatureChange = (e) => {
    const featureId = Number(e.target.value);
    setForm((prev) => {
      const newFeatureIds = prev.featureIds.includes(featureId)
        ? prev.featureIds.filter((id) => id !== featureId)
        : [...prev.featureIds, featureId];
      return { ...prev, featureIds: newFeatureIds };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageUrls = imagePreviews
        .filter((item) => item.type === "image")
        .map((item) => item.url);
      const videoUrls = imagePreviews
        .filter((item) => item.type === "video")
        .map((item) => item.url);

      // Tạo payload đầy đủ để gửi đi, khớp với cấu trúc AddCarDto
      const dataToSend = {
        ...form,
        imageUrls: imageUrls,
        videoUrls: videoUrls,
        year: parseInt(form.year),
        mileage: parseFloat(form.mileage),
        price: parseFloat(form.price),
        registrationFee: parseFloat(Number(form.registrationFee).toFixed(2)),
        taxRate: parseFloat(Number(form.taxRate).toFixed(2)),
        seatingCapacity: parseInt(form.seatingCapacity),
        storeLocationId: parseInt(form.storeLocationId),
        modelId: parseInt(form.modelId),
        // Chỉnh lại tên thuộc tính để khớp với API khi gửi đi
        color: form.exteriorColor,
      };

      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/cars/${listingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update car");
      }

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Car updated successfully!",
        timer: 1800,
        showConfirmButton: false,
      });

      navigate("/admin/cars");
    } catch (err) {
      console.error("Error updating car:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to update car. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-gray-600 text-lg font-semibold">
          Loading...
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mt-4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-red-600 text-lg font-semibold">
          Error: {error}
          <button
            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all duration-300"
            onClick={() => navigate("/admin/cars")}
          >
            Back to Vehicles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminTopbar />
        <main className="flex-1 flex flex-col px-8 py-6 overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white rounded-2xl shadow-lg mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Car className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Edit Vehicle</h2>
                  <p className="text-blue-100 text-sm">
                    {carModels.find(m => m.modelId == form.modelId)?.manufacturerName || "N/A"} -{" "}
                    {carModels.find(m => m.modelId == form.modelId)?.name || "N/A"} ({form.year})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate("/admin/cars")}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Details */}
              <section className="p-6 border border-gray-200 rounded-xl bg-gray-50">
                <h3 className="text-xl font-bold text-gray-800 mb-5">Basic Details</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="modelId" className="block text-sm font-semibold text-gray-700 mb-2">
                      Model <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="modelId"
                      name="modelId"
                      value={form.modelId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-300"
                      required
                    >
                      <option value="">Select Model</option>
                      {carModels.map((model) => (
                        <option key={model.modelId} value={model.modelId}>
                          {model.manufacturerName} - {model.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="storeLocationId" className="block text-sm font-semibold text-gray-700 mb-2">
                      Showroom <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="storeLocationId"
                      name="storeLocationId"
                      value={form.storeLocationId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-300"
                      required
                    >
                      <option value="">Select Showroom</option>
                      {storeLocationsWithUsers.map((item) => (
                        <option key={item.storeLocation.storeLocationId} value={item.storeLocation.storeLocationId}>
                          {item.storeLocation.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Year <span className="text-red-500">*</span>
                    </label>
                    <select
                        type="number"
                        name="year"
                        value={form.year}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-300"
                        required
                    >
                        <option value="">Select Year</option>
                        {YEAR_OPTIONS.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Mileage (km) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="mileage"
                      value={form.mileage}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Price (VND) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Condition <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="condition"
                      value={form.condition}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-300"
                      required
                    >
                      <option value="">Select condition</option>
                      {CONDITION_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="certified"
                      name="certified"
                      checked={form.certified}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="certified" className="ml-3 text-sm font-semibold text-gray-700">
                        Certified Pre-Owned
                    </label>
                  </div>
                </div>
              </section>

              {/* Specifications */}
              <section className="p-6 border border-gray-200 rounded-xl bg-gray-50">
                <h3 className="text-xl font-bold text-gray-800 mb-5">Specifications</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">VIN <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="vin"
                      value={form.vin}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Exterior Color <span className="text-red-500">*</span></label>
                    <select
                      name="exteriorColor"
                      value={form.exteriorColor}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-300"
                      required
                    >
                      <option value="">Select Color</option> 
                      {carColors.map((color) => (
                        <option key={color.colorId} value={color.name}>
                          {color.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Interior Color <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="interiorColor"
                      value={form.interiorColor}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Transmission <span className="text-red-500">*</span></label>
                    <select
                      name="transmission"
                      value={form.transmission}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-300"
                      required
                    >
                      <option value="">Select Transmission </option>
                      {TRANSMISSION_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Engine <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="engine"
                      value={form.engine}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Fuel Type <span className="text-red-500">*</span></label>
                    <select
                      name="fuelType"
                      value={form.fuelType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-300"
                      required
                    >
                      <option value="">Select Fuel Type</option>
                      {FUEL_TYPE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Car Type <span className="text-red-500">*</span></label>
                    <select
                      name="carType"
                      value={form.carType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-300"
                      required
                    >
                      <option value="">Select Car Type</option>
                      {CAR_TYPE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Seating Capacity <span className="text-red-500">*</span></label>
                    <select
                      type="number"
                      name="seatingCapacity"
                      value={form.seatingCapacity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-300"
                      required
                    >
                      <option value="">Select Capacity</option>
                      {SEATING_CAPACITY_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>
            </div>

            <hr className="my-8 border-gray-200" />

            {/* Features */}
            <section className="p-6 border border-gray-200 rounded-xl bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-800 mb-5">
                  Features
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {features.map((feature) => (
                    <div key={feature.featureId} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`feature-${feature.featureId}`}
                        name="featureIds"
                        value={feature.featureId}
                        checked={form.featureIds.includes(feature.featureId)}
                        onChange={handleFeatureChange}
                        className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                      />
                      <label htmlFor={`feature-${feature.featureId}`} className="ml-3 text-gray-700">
                        {feature.name}
                      </label>
                    </div>
                  ))}
                  {features.length === 0 && (
                    <p className="text-gray-500 col-span-full">No features available.</p>
                  )}
                </div>
              </section>

            <hr className="my-8 border-gray-200" />

            {/* Vehicle Photos Upload */}
            <section className="p-6 border border-gray-200 rounded-xl bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-800 mb-5">
                Vehicle Photos/Videos
              </h2>
              <VehiclePhotosUpload
                setImagePreviews={setImagePreviews}
              />
              {selectedFileNames.length > 0 && (
                <div className="text-sm text-gray-700 mb-2 whitespace-normal break-words mt-2">
                  {selectedFileNames}
                </div>
              )}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {imagePreviews.map((item, idx) => (
                    <div key={item.url || idx} className="relative group">
                      {item.type === "image" ? (
                        <img
                          src={item.url}
                          alt={`preview-${idx}`}
                          className="w-full h-40 object-cover rounded-xl shadow"
                        />
                      ) : (
                        <video
                          controls
                          className="w-full h-40 rounded-xl shadow object-cover"
                        >
                          <source src={item.url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
                        }}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow hover:bg-red-700"
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  ))}
              </div>
            </section>

            <hr className="my-8 border-gray-200" />

            {/* Pricing and Description */}
            <section className="p-6 border border-gray-200 rounded-xl bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800 mb-5">Pricing & Description</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Registration Fee (VND) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="registrationFee"
                    value={form.registrationFee}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tax Rate (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="taxRate"
                    value={form.taxRate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-300"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  {/* Replace textarea with ReactQuill */}
                  <ReactQuill 
                    theme="snow"
                    value={form.description}
                    onChange={handleDescriptionChange}
                    className="bg-white rounded-xl quill-editor-lg"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Form Actions */}
            <div className="mt-8 flex justify-end gap-4 border-t border-gray-100 pt-6">
              <button
                type="button"
                onClick={() => navigate("/admin/cars")}
                className="px-6 py-3 rounded-xl font-semibold text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default UpdateCar;