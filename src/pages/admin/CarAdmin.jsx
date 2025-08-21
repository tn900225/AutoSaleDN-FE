import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const formInit = {
  model_id: "",
  user_id: "",
  year: "",
  mileage: "",
  price: "",
  location: "",
  condition: "Good",
  RentSell: "Sell",
};

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState(formInit);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch cars
  useEffect(() => {
    fetch("/api/cars")
      .then((r) => r.json())
      .then(setCars);
  }, []);

  // Handlers
  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleEdit = (car) => {
    setForm({
      model_id: car.model_id,
      user_id: car.user_id,
      year: car.year,
      mileage: car.mileage,
      price: car.price,
      location: car.location || "",
      condition: car.condition,
      RentSell: car.RentSell,
    });
    setEditingId(car.listing_id);
  };

  const handleCancel = () => {
    setForm(formInit);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/cars/${editingId}` : "/api/cars";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    fetch("/api/cars")
      .then((r) => r.json())
      .then(setCars);

    setForm(formInit);
    setEditingId(null);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this car?")) return;
    await fetch(`/api/cars/${id}`, { method: "DELETE" });
    setCars(cars.filter((c) => c.listing_id !== id));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminTopbar />
        <main className="p-8">
          <div className="mb-8 flex items-center justify-between">
            <div className="text-2xl font-semibold">Cars</div>
            <button
              className="bg-violet-500 text-white px-5 py-2 rounded-lg font-medium shadow"
              onClick={handleCancel}
              disabled={!editingId}
              style={{ opacity: editingId ? 1 : 0.6 }}
            >
              {editingId ? "Cancel Edit" : "Add New"}
            </button>
          </div>
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-6 grid grid-cols-4 gap-4 mb-8 items-end"
          >
            <div>
              <label className="block text-sm mb-1">Model Id</label>
              <input
                name="model_id"
                value={form.model_id}
                onChange={handleChange}
                className="input-form"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">User Id</label>
              <input
                name="user_id"
                value={form.user_id}
                onChange={handleChange}
                className="input-form"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Year</label>
              <input
                name="year"
                value={form.year}
                onChange={handleChange}
                className="input-form"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Mileage</label>
              <input
                name="mileage"
                value={form.mileage}
                onChange={handleChange}
                className="input-form"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Price</label>
              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                className="input-form"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="input-form"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Condition</label>
              <select
                name="condition"
                value={form.condition}
                onChange={handleChange}
                className="input-form"
              >
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Rent/Sell</label>
              <select
                name="RentSell"
                value={form.RentSell}
                onChange={handleChange}
                className="input-form"
              >
                <option value="Rent">Rent</option>
                <option value="Sell">Sell</option>
              </select>
            </div>
            <div className="col-span-4 text-right">
              <button
                className="px-6 py-2 rounded-lg bg-violet-500 text-white font-medium"
                disabled={loading}
              >
                {editingId ? "Update Car" : "Add Car"}
              </button>
            </div>
          </form>
          <div className="bg-white rounded-2xl p-6">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="text-gray-500 text-sm">
                  <th className="pb-2 font-semibold text-left">Model Id</th>
                  <th className="pb-2 font-semibold text-left">User Id</th>
                  <th className="pb-2 font-semibold text-left">Year</th>
                  <th className="pb-2 font-semibold text-left">Mileage</th>
                  <th className="pb-2 font-semibold text-left">Price</th>
                  <th className="pb-2 font-semibold text-left">Location</th>
                  <th className="pb-2 font-semibold text-left">Condition</th>
                  <th className="pb-2 font-semibold text-left">Rent/Sell</th>
                  <th className="pb-2 font-semibold text-left w-32">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cars.map((c) => (
                  <tr
                    key={c.listing_id}
                    className="border-t last:border-b hover:bg-gray-50"
                  >
                    <td className="py-2">{c.model_id}</td>
                    <td>{c.user_id}</td>
                    <td>{c.year}</td>
                    <td>{c.mileage}</td>
                    <td>{c.price}</td>
                    <td>{c.location}</td>
                    <td>{c.condition}</td>
                    <td>{c.RentSell}</td>
                    <td>
                      <button
                        className="inline-block mr-2 text-blue-600 hover:underline"
                        onClick={() => handleEdit(c)}
                      >
                        Edit
                      </button>
                      <button
                        className="inline-block text-red-500 hover:underline"
                        onClick={() => handleDelete(c.listing_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {cars.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center py-6 text-gray-400">
                      No cars found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

// Style suggestion for input-form (add to your global css or tailwind config):
// .input-form { @apply w-full px-3 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-200 }