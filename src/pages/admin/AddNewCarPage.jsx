import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import VehiclePhotosUpload from "../../components/admin/VehiclePhotosUpload";
import { getApiBaseUrl } from "../../../util/apiconfig";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

// Helper constants for select options (Giữ nguyên)
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

const formInit = {
  modelId: "",
  year: "",
  mileage: "",
  price: "",
  condition: "Good",
  description: "",
  certified: false,
  vin: "",
  color: "",
  interiorColor: "",
  transmission: "",
  engine: "",
  fuelType: "",
  carType: "",
  seatingCapacity: "",
  registrationFee: "",
  taxRate: "",
  featureIds: [],
  storeLocationId: "",
};

export default function AddNewCarPage() {
  const [formData, setFormData] = useState(formInit);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [carModels, setCarModels] = useState([]);
  const [carColors, setCarColors] = useState([]);
  const [features, setFeatures] = useState([]);
  const [storeLocationsWithUsers, setStoreLocationsWithUsers] = useState([]);

  const API_BASE = getApiBaseUrl();

  const selectedFileNames = imagePreviews.map(item => item.name).join(", ");


  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE}/api/admin/cars/add-form-data`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to load form data");
        }
        const data = await response.json();
        setCarModels(data.models || []);
        setCarColors(data.colors || []);
        setFeatures(data.features || []);
      } catch (error) {
        console.error("Error fetching form data:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to load form data. Please try again.",
        });
      }
    };

    const fetchStoreLocations = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE}/api/admin/storelocations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch store locations.");
        }
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setStoreLocationsWithUsers(result.data);
        } else {
          console.error("API returned an error or unexpected data format:", result.message);
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: result.message || "Failed to load store locations due to data format. Please try again.",
          });
        }
      } catch (error) {
        console.error("Error fetching store locations:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to load store locations. Please try again.",
        });
      }
    };

    fetchFormData();
    fetchStoreLocations();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFeatureChange = (e) => {
    const featureId = Number(e.target.value);
    setFormData((prev) => {
      const newFeatureIds = prev.featureIds.includes(featureId)
        ? prev.featureIds.filter((id) => id !== featureId)
        : [...prev.featureIds, featureId];
      return { ...prev, featureIds: newFeatureIds };
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const selectedStoreLocation = storeLocationsWithUsers.find(
        (item) => item.storeLocation.storeLocationId === parseInt(formData.storeLocationId)
      );

      if (!selectedStoreLocation) {
        throw new Error("Invalid store location selected. Please refresh and try again.");
      }

      const userIdFromStore = selectedStoreLocation.userId;

      // 2. Chuẩn bị dữ liệu để gửi lên API
      const imageUrls = imagePreviews
        .filter((item) => item.type === "image")
        .map((item) => item.url);
      const videoUrls = imagePreviews
        .filter((item) => item.type === "video")
        .map((item) => item.url);

      const dataToSend = {
        ...formData,
        userId: userIdFromStore,
        imageUrls: imageUrls,
        year: parseInt(formData.year),
        mileage: parseFloat(formData.mileage),
        price: parseFloat(formData.price),
        registrationFee: parseFloat(Number(formData.registrationFee).toFixed(2)),
        taxRate: parseFloat(Number(formData.taxRate).toFixed(2)),
        seatingCapacity: parseInt(formData.seatingCapacity),
        videoUrls: videoUrls,
        storeLocationId: parseInt(formData.storeLocationId),
      };

      console.log("Sending data:", dataToSend);

      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/api/admin/cars/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: result.message || "Car and showroom allocation added successfully!",
          timer: 2000,
          showConfirmButton: false,
        });
        setFormData(formInit);
        setImageFiles([]);
        setImagePreviews([]);
      } else {
        throw new Error(result.message || "Failed to add car.");
      }
    } catch (error) {
      console.error("Error adding new car:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.message || "Something went wrong while adding the car.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center leading-tight">
              Add New Vehicle to Inventory
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <section className="p-6 border border-gray-200 rounded-xl bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-800 mb-5">
                  Basic Vehicle Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="modelId" className="block text-gray-700 font-medium mb-2">
                      Model <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="modelId"
                      name="modelId"
                      value={formData.modelId}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 bg-white"
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
                    <label htmlFor="year" className="block text-gray-700 font-medium mb-2">
                      Year <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="year"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 bg-white"
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
                    <label htmlFor="mileage" className="block text-gray-700 font-medium mb-2">
                      Mileage (km) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="mileage"
                      name="mileage"
                      value={formData.mileage}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                      placeholder="e.g., 50000"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="price" className="block text-gray-700 font-medium mb-2">
                      Price (VND) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                      placeholder="e.g., 750000000"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="condition" className="block text-gray-700 font-medium mb-2">
                      Condition <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="condition"
                      name="condition"
                      value={formData.condition}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 bg-white"
                      required
                    >
                      {CONDITION_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="storeLocationId" className="block text-gray-700 font-medium mb-2">
                      Assign to Showroom <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="storeLocationId"
                      name="storeLocationId"
                      value={formData.storeLocationId}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 bg-white"
                    >
                      <option value="">Select Showroom</option>
                      {storeLocationsWithUsers.map((item) => (
                        <option key={item.storeLocation.storeLocationId} value={item.storeLocation.storeLocationId}>
                          {item.storeLocation.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                      Description
                    </label>
                    <ReactQuill
                      theme="snow"
                      value={formData.description}
                      onChange={(content) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: content,
                        }))
                      }
                      className="bg-white rounded-xl quill-editor-lg"
                      required
                    />
                  </div>

                  <div className="flex items-center col-span-2">
                    <input
                      type="checkbox"
                      id="certified"
                      name="certified"
                      checked={formData.certified}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                    />
                    <label htmlFor="certified" className="ml-3 text-gray-700 font-medium">
                      Certified Pre-Owned
                    </label>
                  </div>
                </div>
              </section>

              {/* Specification Details */}
              <section className="p-6 border border-gray-200 rounded-xl bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-800 mb-5">
                  Vehicle Specifications
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="vin" className="block text-gray-700 font-medium mb-2">
                      VIN (Vehicle Identification Number)
                    </label>
                    <input
                      type="text"
                      id="vin"
                      name="vin"
                      value={formData.vin}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                      placeholder="e.g., 123ABC456DEF789GH"
                    />
                  </div>
                  <div>
                    <label htmlFor="color" className="block text-gray-700 font-medium mb-2">
                      Exterior Color
                    </label>
                    <select
                      id="color"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 bg-white"
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
                    <label htmlFor="interiorColor" className="block text-gray-700 font-medium mb-2">
                      Interior Color
                    </label>
                    <input
                      type="text"
                      id="interiorColor"
                      name="interiorColor"
                      value={formData.interiorColor}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                      placeholder="e.g., Black Leather, Beige Fabric"
                    />
                  </div>
                  <div>
                    <label htmlFor="transmission" className="block text-gray-700 font-medium mb-2">
                      Transmission
                    </label>
                    <select
                      id="transmission"
                      name="transmission"
                      value={formData.transmission}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 bg-white"
                    >
                      <option value="">Select Transmission</option>
                      {TRANSMISSION_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="engine" className="block text-gray-700 font-medium mb-2">
                      Engine
                    </label>
                    <input
                      type="text"
                      id="engine"
                      name="engine"
                      value={formData.engine}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                      placeholder="e.g., 2.0L Turbo, V6"
                    />
                  </div>
                  <div>
                    <label htmlFor="fuelType" className="block text-gray-700 font-medium mb-2">
                      Fuel Type
                    </label>
                    <select
                      id="fuelType"
                      name="fuelType"
                      value={formData.fuelType}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 bg-white"
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
                    <label htmlFor="carType" className="block text-gray-700 font-medium mb-2">
                      Car Type
                    </label>
                    <select
                      id="carType"
                      name="carType"
                      value={formData.carType}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 bg-white"
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
                    <label htmlFor="seatingCapacity" className="block text-gray-700 font-medium mb-2">
                      Seating Capacity
                    </label>
                    <select
                      id="seatingCapacity"
                      name="seatingCapacity"
                      value={formData.seatingCapacity}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 bg-white"
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

              {/* Pricing Details */}
              <section className="p-6 border border-gray-200 rounded-xl bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-800 mb-5">
                  Pricing Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="registrationFee" className="block text-gray-700 font-medium mb-2">
                      Registration Fee (VND)
                    </label>
                    <input
                      type="number"
                      id="registrationFee"
                      name="registrationFee"
                      value={formData.registrationFee}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                      placeholder="e.g., 2000000"
                    />
                  </div>
                  <div>
                    <label htmlFor="taxRate" className="block text-gray-700 font-medium mb-2">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      id="taxRate"
                      name="taxRate"
                      value={formData.taxRate}
                      onChange={handleInputChange}
                      step="0.01"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                      placeholder="e.g., 10"
                    />
                  </div>
                </div>
              </section>

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
                        checked={formData.featureIds.includes(feature.featureId)}
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
                          setImagePreviews((prev) => {
                            const updated = prev.filter((_, i) => i !== idx);
                            return updated;
                          });
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

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setFormData(formInit);
                    setImageFiles([]);
                    setImagePreviews([]);
                  }}
                  className="px-6 py-3 bg-gray-200 rounded-xl text-gray-700 hover:bg-gray-300 transition-colors"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-3 bg-blue-600 rounded-xl text-white hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {uploading ? "Adding Car..." : "Add Car"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}