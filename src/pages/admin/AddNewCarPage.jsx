import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

export default function AddNewCarPage() {
  const [form, setForm] = useState({
    model_id: "",
    user_id: "",
    year: "",
    mileage: "",
    price: "",
    location: "",
    condition: "Good",
    RentSell: "Sell",
    description: "",
    certified: false,
    vin: "",
    color_id: "",
    color: "",
    interior_color: "",
    transmission: "",
    engine: "",
    fuel_type: "",
    car_type: "",
    seating_capacity: "",
    registration_fee: "",
    tax_rate: "",
    quantity_imported: "",
    import_date: "",
    import_price: "",
    notes: "",
    feature_ids: [],
  });
  const [imageUrls, setImageUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [models, setModels] = useState([]);
  const [colors, setColors] = useState([]);
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch("/api/Admin/cars/add-form-data", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((r) => r.json())
      .then((data) => {
        setModels(data.models);
        setColors(data.colors);
        setFeatures(data.features);
      });
  }, []);

  // Upload image handler
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    const uploadedUrls = [];
    for (let file of files) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/Admin/upload-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      uploadedUrls.push(data.url);
    }
    setImageUrls((prev) => [...prev, ...uploadedUrls]);
    setUploading(false);
  };

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
    const payload = {
      ...form,
      ModelId: form.model_id,
      UserId: form.user_id,
      Year: Number(form.year),
      Mileage: Number(form.mileage),
      Price: Number(form.price),
      QuantityImported: Number(form.quantity_imported),
      ImportPrice: Number(form.import_price),
      ImportDate: form.import_date,
      ImageUrls: imageUrls,
      FeatureIds: form.feature_ids,
      ColorId: form.color_id ? Number(form.color_id) : null,
      SeatingCapacity: Number(form.seating_capacity),
      RegistrationFee: Number(form.registration_fee),
      TaxRate: Number(form.tax_rate),
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
    if (data.success) {
      setForm({
        model_id: "",
        user_id: "",
        year: "",
        mileage: "",
        price: "",
        location: "",
        condition: "Good",
        RentSell: "Sell",
        description: "",
        certified: false,
        vin: "",
        color_id: "",
        color: "",
        interior_color: "",
        transmission: "",
        engine: "",
        fuel_type: "",
        car_type: "",
        seating_capacity: "",
        registration_fee: "",
        tax_rate: "",
        quantity_imported: "",
        import_date: "",
        import_price: "",
        notes: "",
        feature_ids: [],
      });
      setImageUrls([]);
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

            <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-md shadow-xl rounded-3xl border border-gray-100 p-8 grid gap-8 grid-cols-1 md:grid-cols-2">
              {/* Basic Information Card */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                    <select name="model_id" value={form.model_id} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-all duration-200">
                      <option value="">Choose Model</option>
                      {models.map((m) => (
                        <option key={m.modelId} value={m.modelId}>
                          {m.manufacturerName} - {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                    <input name="year" value={form.year} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-all duration-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mileage</label>
                    <input name="mileage" value={form.mileage} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-all duration-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                    <select name="condition" value={form.condition} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-all duration-200">
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Specifications Card */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                    <select name="color_id" value={form.color_id} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-all duration-200">
                      <option value="">Choose Color</option>
                      {colors.map((c) => (
                        <option key={c.colorId || c.ColorId} value={c.colorId || c.ColorId}>
                          {c.name || c.Name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Seating Capacity</label>
                    <input name="seating_capacity" value={form.seating_capacity} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-all duration-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                    <input name="fuel_type" value={form.fuel_type} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-all duration-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
                    <input name="transmission" value={form.transmission} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-all duration-200" />
                  </div>
                </div>
              </div>

              {/* Pricing and Import Card */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Pricing & Import</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                    <input name="price" value={form.price} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-all duration-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity Imported</label>
                    <input name="quantity_imported" value={form.quantity_imported} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-all duration-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Import Price</label>
                    <input name="import_price" value={form.import_price} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-all duration-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Import Date</label>
                    <input name="import_date" value={form.import_date} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-all duration-200" type="date" />
                  </div>
                </div>
              </div>

              {/* Features and Images Card */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Features & Images</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {features.map((f) => (
                        <label key={f.featureId || f.FeatureId} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <input
                            type="checkbox"
                            checked={form.feature_ids.includes(f.featureId || f.FeatureId)}
                            onChange={() => handleFeatureChange(f.featureId || f.FeatureId)}
                            className="rounded border-gray-300 text-violet-500 focus:ring-violet-400" />
                          <span className="text-sm text-gray-600">{f.name || f.Name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <input type="file" multiple onChange={handleImageUpload}
                          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 file:transition-colors" />
                        {uploading && <div className="text-violet-500 animate-pulse">Uploading...</div>}
                      </div>
                      <div className="grid grid-cols-4 gap-3">
                        {imageUrls.map((url, i) => (
                          <div key={i} className="relative">
                            <img src={url} alt="" className="w-full h-20 object-cover rounded-lg border border-gray-200 shadow-sm" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-full flex justify-end">
                <button type="submit"
                  className="px-8 py-3 bg-violet-500 text-white rounded-xl hover:bg-violet-600 focus:ring-2 focus:ring-violet-300 focus:ring-offset-2 focus:ring-offset-white transition-all duration-200">
                  Add Car
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}