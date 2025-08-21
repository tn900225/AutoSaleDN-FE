import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const formInit = { fullName: "", email: "", mobile: "", password: "" };

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(formInit);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch customers
  useEffect(() => {
    fetch("/api/customers")
      .then((r) => r.json())
      .then(setCustomers);
  }, []);

  // Handlers
  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleEdit = (cus) => {
    setForm({
      fullName: cus.fullName,
      email: cus.email,
      mobile: cus.mobile || "",
      password: "",
    });
    setEditingId(cus.user_id);
  };

  const handleCancel = () => {
    setForm(formInit);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/customers/${editingId}` : "/api/customers";
    const body = { ...form };
    if (!editingId) delete body.role; // role handled by backend
    if (editingId && !form.password) delete body.password;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    fetch("/api/customers")
      .then((r) => r.json())
      .then(setCustomers);

    setForm(formInit);
    setEditingId(null);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    await fetch(`/api/customers/${id}`, { method: "DELETE" });
    setCustomers(customers.filter((c) => c.user_id !== id));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminTopbar />
        <main className="p-8">
          <div className="mb-8 flex items-center justify-between">
            <div className="text-2xl font-semibold">Customers</div>
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
              <label className="block text-sm mb-1">Full Name</label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="input-form"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="input-form"
                type="email"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Mobile</label>
              <input
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                className="input-form"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">
                {editingId ? "New Password" : "Password"}
              </label>
              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                className="input-form"
                type="password"
                autoComplete="new-password"
                required={!editingId}
              />
            </div>
            <div className="col-span-4 text-right">
              <button
                className="px-6 py-2 rounded-lg bg-violet-500 text-white font-medium"
                disabled={loading}
              >
                {editingId ? "Update Customer" : "Add Customer"}
              </button>
            </div>
          </form>
          <div className="bg-white rounded-2xl p-6">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="text-gray-500 text-sm">
                  <th className="pb-2 font-semibold text-left">Full Name</th>
                  <th className="pb-2 font-semibold text-left">Email</th>
                  <th className="pb-2 font-semibold text-left">Mobile</th>
                  <th className="pb-2 font-semibold text-left">Role</th>
                  <th className="pb-2 font-semibold text-left w-32">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr
                    key={c.user_id}
                    className="border-t last:border-b hover:bg-gray-50"
                  >
                    <td className="py-2">{c.fullName}</td>
                    <td>{c.email}</td>
                    <td>{c.mobile}</td>
                    <td>{c.role}</td>
                    <td>
                      <button
                        className="inline-block mr-2 text-blue-600 hover:underline"
                        onClick={() => handleEdit(c)}
                      >
                        Edit
                      </button>
                      <button
                        className="inline-block text-red-500 hover:underline"
                        onClick={() => handleDelete(c.user_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {customers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-400">
                      No customers found.
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