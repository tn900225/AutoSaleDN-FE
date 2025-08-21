import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import VehiclePhotosUpload from "../../components/admin/VehiclePhotosUpload";

// Helper constants for select options
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
  { value: "other", label: "Other" }
];
const CONDITION_OPTIONS = [
  { value: "Excellent", label: "Excellent" },
  { value: "Good", label: "Good" },
  { value: "Fair", label: "Fair" }
];
const RENTSELL_OPTIONS = [
  { value: "Sell", label: "Sell" },
  { value: "Rent", label: "Rent" }
];

export default function AddNewCarPage() {
  // Main car form state
  const [form, setForm] = useState({
    model_id: "",
    user_id: "",
    year: "",
    mileage: "",
    price: "",
    location: "",
    condition: "Good",
    rent_sell: "Sell",
    description: "",
    certified: false,
    vin: "",
    exterior_color: "",
    interior_color: "",
    transmission: "",
    engine: "",
    fuel_type: "",
    car_type: "",
    seating_capacity: "",
    registration_fee: "",
    tax_rate: "",
    color_id: "",
    quantity_imported: "",
    import_date: "",
    import_price: "",
    notes: "",
    feature_ids: []
  });

  // Vehicle photo state (for delayed upload)
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Form data
  const [models, setModels] = useState([]);
  const [colors, setColors] = useState([]);
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/Admin/cars/add-form-data", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setModels(data.models);
        setColors(data.colors);
        setFeatures(data.features);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFeatureChange = (fid) => {
    setForm((f) => {
      let list = f.feature_ids.includes(fid)
        ? f.feature_ids.filter((id) => id !== fid)
        : [...f.feature_ids, fid];
      return { ...f, feature_ids: list };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    const uploadedUrls = [];
    
    // Upload all images to Cloudinary
    for (let file of imageFiles) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "YOUR_UNSIGNED_UPLOAD_PRESET");
      const res = await fetch("https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      uploadedUrls.push(data.secure_url);
    }

    // Prepare payload with only supported fields
    const payload = {
      ModelId: form.model_id,
      UserId: form.user_id,
      Year: Number(form.year),
      Mileage: Number(form.mileage),
      Price: Number(form.price),
      Location: form.location,
      Condition: form.condition,
      RentSell: form.rent_sell,
      Description: form.description,
      Certified: form.certified,
      Vin: form.vin,
      ExteriorColor: form.exterior_color,
      InteriorColor: form.interior_color,
      Transmission: form.transmission,
      Engine: form.engine,
      FuelType: form.fuel_type,
      CarType: form.car_type,
      SeatingCapacity: Number(form.seating_capacity),
      RegistrationFee: Number(form.registration_fee),
      TaxRate: Number(form.tax_rate),
      ColorId: form.color_id ? Number(form.color_id) : null,
      QuantityImported: Number(form.quantity_imported),
      ImportDate: form.import_date,
      ImportPrice: Number(form.import_price),
      Notes: form.notes,
      FeatureIds: form.feature_ids,
      ImageUrls: uploadedUrls
    };

    const token = localStorage.getItem("token");
    const res = await fetch("/api/Admin/cars/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    
    Swal.fire({
      icon: data.success ? "success" : "error",
      title: data.success ? "Add car successfully!" : "Operation failed!",
      text: data.message || "",
    });
    setUploading(false);
    
    if (data.success) {
      setForm({
        model_id: "",
        user_id: "",
        year: "",
        mileage: "",
        price: "",
        location: "",
        condition: "Good",
        rent_sell: "Sell",
        description: "",
        certified: false,
        vin: "",
        exterior_color: "",
        interior_color: "",
        transmission: "",
        engine: "",
        fuel_type: "",
        car_type: "",
        seating_capacity: "",
        registration_fee: "",
        tax_rate: "",
        color_id: "",
        quantity_imported: "",
        import_date: "",
        import_price: "",
        notes: "",
        feature_ids: []
      });
      setImageFiles([]);
      setImagePreviews([]);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-violet-50 to-blue-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminTopbar />
        <main className="flex-1 flex flex-col px-4 py-8 md:px-12 md:py-10 overflow-y-auto bg-gradient-to-br from-[#f5f6ff] via-[#eaeaff] to-[#f7f8fa]">
          <div className="max-w-6xl mx-auto w-full">
            <div className="text-4xl font-bold text-gray-800 mb-3 tracking-tight">Add New Car</div>
            <p className="text-gray-600 mb-10">Fill in all the information to add a new car to your inventory.</p>

            <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-md shadow-xl rounded-3xl border border-gray-100 p-8 grid gap-8 grid-cols-1">
              {/* Section: Vehicle Basic */}
              <section className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Vehicle Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Model */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Model <span className="text-red-500">*</span></label>
                    <select
                      name="model_id"
                      value={form.model_id}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
                    >
                      <option value="">Choose Model</option>
                      {models.map((m) => (
                        <option key={m.modelId} value={m.modelId}>{m.manufacturerName} - {m.name}</option>
                      ))}
                    </select>
                  </div>
                  {/* Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year <span className="text-red-500">*</span></label>
                    <select
                      name="year"
                      value={form.year}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
                    >
                      <option value="">Choose Year</option>
                      {YEAR_OPTIONS.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                  {/* Mileage */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mileage <span className="text-red-500">*</span></label>
                    <input
                      name="mileage"
                      type="number"
                      value={form.mileage}
                      onChange={handleChange}
                      required
                      placeholder="Vehicle mileage"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
                    />
                  </div>
                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price <span className="text-red-500">*</span></label>
                    <input
                      name="price"
                      type="number"
                      value={form.price}
                      onChange={handleChange}
                      required
                      placeholder="Vehicle price"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
                    />
                  </div>
                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location <span className="text-red-500">*</span></label>
                    <input
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      required
                      placeholder="Vehicle location"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
                    />
                  </div>
                  {/* Condition */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Condition <span className="text-red-500">*</span></label>
                    <select
                      name="condition"
                      value={form.condition}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
                    >
                      <option value="">Choose Condition</option>
                      {CONDITION_OPTIONS.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  {/* Rent/Sell */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rent/Sell <span className="text-red-500">*</span></label>
                    <select
                      name="rent_sell"
                      value={form.rent_sell}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
                    >
                      <option value="">Choose Type</option>
                      {RENTSELL_OPTIONS.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </div>
                  {/* Description */}
                  <div className="col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Enter vehicle description"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
                    />
                  </div>
                </div>
              </section>

              {/* Section: Vehicle Specifications */}
              <section className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Vehicle Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Exterior Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Exterior Color</label>
                    <input
                      name="exterior_color"
                      value={form.exterior_color}
                      onChange={handleChange}
                      placeholder="Exterior color"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
                    />
                  </div>
                  {/* Interior Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Interior Color</label>
                    <input
                      name="interior_color"
                      value={form.interior_color}
                      onChange={handleChange}
                      placeholder="Interior color"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
                    />
                  </div>
                  {/* Transmission */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
                    <input
                      name="transmission"
                      value={form.transmission}
                      onChange={handleChange}
                      placeholder="Transmission type"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
                    />
                  </div>
                  {/* Engine */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Engine</label>
                    <input
                      name="engine"
                      value={form.engine}
                      onChange={handleChange}
                      placeholder="Engine specification"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
                    />
                  </div>
                  {/* Fuel Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                    <select
                      name="fuel_type"
                      value={form.fuel_type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
                    >
                      <option value="">Choose Fuel Type</option>
                      {FUEL_TYPE_OPTIONS.map((f) => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                      ))}
                    </select>
                  </div>
                  {/* Car Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Car Type</label>
                    <input
                      name="car_type"
                      value={form.car_type}
                      onChange={handleChange}
                      placeholder="Car type"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
                    />
                  </div>
                  {/* Seating Capacity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Seating Capacity</label>
                    <input
                      name="seating_capacity"
                      type="number"
                      value={form.seating_capacity}
                      onChange={handleChange}
                      placeholder="Number of seats"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
                    />
                  </div>
                </div>
              </section>

              {/* Section: Pricing */}
              <section className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Pricing Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Registration Fee */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Registration Fee</label>
                    <input
                      name="registration_fee"
                      type="number"
                      value={form.registration_fee}
                      onChange={handleChange}
                      placeholder="Registration fee"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
                    />
                  </div>
                  {/* Tax Rate */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                    <input
                      name="tax_rate"
                      type="number"
                      value={form.tax_rate}
                      onChange={handleChange}
                      placeholder="Tax rate"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
                    />
                  </div>
                </div>
              </section>

              {/* Section: Inventory */}
              <section className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Inventory Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Color ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Color ID</label>
                    <select
                      name="color_id"
                      value={form.color_id}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
                    >
                      <option value="">Choose Color</option>
                      {colors.map((c) => (
                        <option key={c.colorId} value={c.colorId}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  {/* Quantity Imported */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity Imported</label>
                    <input
                      name="quantity_imported"
                      type="number"
                      value={form.quantity_imported}
                      onChange={handleChange}
                      placeholder="Quantity imported"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
                    />
                  </div>
                  {/* Import Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Import Date</label>
                    <input
                      type="date"
                      name="import_date"
                      value={form.import_date}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
                    />
                  </div>
                  {/* Import Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Import Price</label>
                    <input
                      name="import_price"
                      type="number"
                      value={form.import_price}
                      onChange={handleChange}
                      placeholder="Import price"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
                    />
                  </div>
                  {/* Notes */}
                  <div className="col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Additional notes"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
                    />
                  </div>
                </div>
              </section>

              {/* Section: Features */}
              <section className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {features.map((f) => (
                    <div key={f.featureId} className="flex items-center">
                      <input
                        type="checkbox"
                        name={`feature_${f.featureId}`}
                        checked={form.feature_ids.includes(f.featureId)}
                        onChange={() => handleFeatureChange(f.featureId)}
                        className="mr-2"
                      />
                      <label className="block text-sm font-medium text-gray-700">{f.name}</label>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section: Images */}
              <section className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Vehicle Images</h3>
                <VehiclePhotosUpload
                  files={imageFiles}
                  setFiles={setImageFiles}
                  previews={imagePreviews}
                  setPreviews={setImagePreviews}
                />
              </section>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setForm({
                      model_id: "",
                      user_id: "",
                      year: "",
                      mileage: "",
                      price: "",
                      location: "",
                      condition: "Good",
                      rent_sell: "Sell",
                      description: "",
                      certified: false,
                      vin: "",
                      exterior_color: "",
                      interior_color: "",
                      transmission: "",
                      engine: "",
                      fuel_type: "",
                      car_type: "",
                      seating_capacity: "",
                      registration_fee: "",
                      tax_rate: "",
                      color_id: "",
                      quantity_imported: "",
                      import_date: "",
                      import_price: "",
                      notes: "",
                      feature_ids: []
                    });
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
                  {uploading ? "Uploading..." : "Add Car"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}