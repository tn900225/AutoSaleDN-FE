import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import Swal from "sweetalert2";

const PAGE_SIZE_OPTIONS = [4, 8, 12];

function getStatusBadge(status, availableUnits) {
  if (status === "Maintenance")
    return (
      <span className="inline-block px-3 py-1 text-xs rounded-full bg-red-100 text-red-500 font-semibold">
        Maintenance
      </span>
    );
  if (status === "Unavailable")
    return (
      <span className="inline-block px-3 py-1 text-xs rounded-full bg-gray-200 text-gray-500 font-semibold">
        Unavailable
      </span>
    );
  return (
    <span className="inline-block px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-600 font-semibold">
      Available
      {availableUnits !== undefined && (
        <span className="ml-1 font-normal">{availableUnits} Unit</span>
      )}
    </span>
  );
}

const formInit = {
  model_id: "",
  user_id: "",
  year: "",
  mileage: "",
  price: "",
  location: "",
  condition: "Good",
  RentSell: "Sell",
  color: "",
};

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState(formInit);
  const [loading, setLoading] = useState(false);

  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("add"); // add, edit, delete
  const [modalCar, setModalCar] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[1]);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch cars
  const fetchCars = () => {
    fetch("/api/Admin/cars", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.status === 401) {
          window.location.href = "/login";
          return [];
        }
        return r.json();
      })
      .then(setCars);
  };

  useEffect(() => {
    fetchCars();
    // eslint-disable-next-line
  }, []);

  // Derived: filtered + paginated
  const filteredCars = cars.filter(
    (car) =>
      (car.model_name || car.model || car.Model || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (car.Manufacturer || car.manufacturer || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (car.location || "").toLowerCase().includes(search.toLowerCase())
  );
  const displayedCars = filteredCars.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalPages = Math.ceil(filteredCars.length / pageSize);

  // Modal handlers
  const openEditModal = (car) => {
    setModalType("edit");
    setModalCar(car);
    setForm({
      model_id: car.model_id || car.ModelId || car.modelId || "",
      user_id: car.user_id || car.UserId || car.userId || "",
      year: car.year || "",
      mileage: car.mileage || "",
      price: car.price || "",
      location: car.location || "",
      condition: car.condition || "Good",
      RentSell: car.RentSell || "",
      color: car.color || car.Color || "",
    });
    setOpenModal(true);
  };

  const openDeleteModal = (car) => {
    setModalType("delete");
    setModalCar(car);
    setOpenModal(true);
  };

  // Modal submit
  const handleModalSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      let url = "/api/Admin/cars";
      let method = "POST";
      if (modalType === "edit") {
        url = `/api/Admin/cars/${modalCar.listing_id || modalCar.ListingId}`;
        method = "PUT";
      }
      let fetchOptions = {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      };
      if (modalType === "delete") {
        url = `/api/Admin/cars/${modalCar.listing_id || modalCar.ListingId}`;
        method = "DELETE";
        fetchOptions = {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      }

      const res = await fetch(url, fetchOptions);
      const data = await res.json();

      setOpenModal(false);
      setLoading(false);

      Swal.fire({
        icon: data.success ? "success" : "error",
        title: data.success
          ? modalType === "add"
            ? "Add car successfully!"
            : modalType === "edit"
            ? "Update car successfully!"
            : "Delete successfully!"
          : "Operation failed!",
        text: data.message || "",
        timer: 1800,
        showConfirmButton: false,
      });

      fetchCars();
      setForm(formInit);
    } catch (error) {
      setLoading(false);
      setOpenModal(false);
      Swal.fire({
        icon: "error",
        title: "Operation failed!",
        text: error.message,
        timer: 1800,
        showConfirmButton: false,
      });
    }
  };

  // Page navigation
  const goToPage = (p) => {
    setPage(Math.max(1, Math.min(p, totalPages)));
  };

  // Card layout for each car
  const renderCarCard = (car) => (
    <div
      key={car.listing_id || car.ListingId}
      className="flex bg-white rounded-2xl mb-6 shadow-sm overflow-hidden border border-gray-100"
    >
      {/* Image */}
      <div className="flex items-center justify-center w-60 bg-gray-50">
        <img
          src={
            car.images && car.images.length > 0
              ? car.images[0]
              : "https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg"
          }
          alt="Car"
          className="object-contain w-48 h-32"
        />
      </div>
      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row items-center px-8 py-6 gap-6">
        {/* Left: car info */}
        <div className="flex-1 flex flex-col gap-1 items-start">
          <div className="text-base text-gray-500 font-semibold leading-tight">
            {car.Manufacturer || car.manufacturer || ""}
          </div>
          <div className="text-2xl font-extrabold text-gray-800 leading-tight mb-1">
            {car.model_name || car.model || car.Model || "Model"}
          </div>
          <div className="flex items-center gap-3">
            {/* Status & Units */}
            {getStatusBadge(car.status || car.Status || "Available", car.available_units || car.Available_Units)}
            {/* Color */}
            <span className="inline-block px-2 py-1 text-xs rounded-md bg-gray-200 text-gray-600 font-semibold ml-2">
              {car.color || car.Color || "No color"}
            </span>
          </div>
        </div>
        {/* Transmission, Capacity */}
        <div className="flex flex-col gap-2 min-w-[100px] items-start">
          <div className="flex items-center gap-2">
            <span className="inline-block px-2 py-1 rounded-md bg-gray-50 border font-bold text-gray-500 text-xs">
              H
            </span>
            <span className="text-xs font-medium text-gray-400">Transmission</span>
            <span className="ml-2 text-base text-gray-700 font-semibold">
              {car.transmission || car.Transmission || "Automatic"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <HiUserGroup className="text-gray-500 w-5 h-5" />
            <span className="text-xs font-medium text-gray-400">Capacity</span>
            <span className="ml-2 text-base text-gray-700 font-semibold">
              {car.seating_capacity || car.seatingCapacity || car.SeatingCapacity || 5} seats
            </span>
          </div>
        </div>
        {/* Price */}
        <div className="flex flex-col items-center min-w-[140px]">
          <span className="text-xs text-gray-400 font-medium mb-1">Price</span>
          <span className="text-2xl font-bold text-gray-800">
            ${car.price}
            <span className="ml-1 text-xs text-gray-400 font-medium">/days</span>
          </span>
        </div>
        {/* Select */}
        <div className="flex flex-col items-center justify-center min-w-[120px]">
          <button
            className="w-24 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-bold transition"
            type="button"
          >
            Select
          </button>
        </div>
      </div>
      {/* Edit/Delete */}
      <div className="flex flex-col items-center justify-center gap-2 bg-gray-100 px-4 min-w-[90px]">
        <button
          className="w-16 py-1 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-blue-50"
          onClick={() => openEditModal(car)}
        >
          Edit
        </button>
        <button
          className="w-16 py-1 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-red-50"
          onClick={() => openDeleteModal(car)}
        >
          Delete
        </button>
      </div>
    </div>
  );

  // Modal UI
  const renderModal = () => {
    if (!openModal) return null;
    if (modalType === "delete") {
      return (
        <Modal onClose={() => setOpenModal(false)}>
          <div className="p-8 flex flex-col items-center">
            <h2 className="text-xl font-bold mb-2 text-gray-800">Are you sure you want to delete this car?</h2>
            <div className="mb-4 text-gray-500">
              {modalCar?.Manufacturer} {modalCar?.model_name || modalCar?.model || modalCar?.Model}
            </div>
            <div className="flex gap-4">
              <button
                className="px-6 py-2 rounded-lg bg-red-500 text-white font-semibold"
                onClick={handleModalSubmit}
                disabled={loading}
              >
                Delete
              </button>
              <button className="px-6 py-2 rounded-lg bg-gray-200" onClick={() => setOpenModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      );
    }
    // Add/Edit form (not shown anymore, Add moved to separate page)
    if (modalType === "edit") {
      return (
        <Modal onClose={() => setOpenModal(false)}>
          <form className="p-8 grid grid-cols-2 gap-4 w-[420px] max-w-full" onSubmit={handleModalSubmit}>
            <h2 className="col-span-2 text-xl font-bold mb-2 text-gray-800">
              Edit Car
            </h2>
            <div>
              <label className="block text-sm mb-1">Model Id</label>
              <input
                name="model_id"
                value={form.model_id}
                onChange={e => setForm(f => ({ ...f, model_id: e.target.value }))}
                className="input-form"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">User Id</label>
              <input
                name="user_id"
                value={form.user_id}
                onChange={e => setForm(f => ({ ...f, user_id: e.target.value }))}
                className="input-form"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Year</label>
              <input
                name="year"
                value={form.year}
                onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
                className="input-form"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Mileage</label>
              <input
                name="mileage"
                value={form.mileage}
                onChange={e => setForm(f => ({ ...f, mileage: e.target.value }))}
                className="input-form"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Price</label>
              <input
                name="price"
                value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                className="input-form"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Location</label>
              <input
                name="location"
                value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                className="input-form"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Condition</label>
              <select
                name="condition"
                value={form.condition}
                onChange={e => setForm(f => ({ ...f, condition: e.target.value }))}
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
                onChange={e => setForm(f => ({ ...f, RentSell: e.target.value }))}
                className="input-form"
              >
                <option value="Rent">Rent</option>
                <option value="Sell">Sell</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Color</label>
              <input
                name="color"
                value={form.color}
                onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                className="input-form"
              />
            </div>
            <div className="col-span-2 text-right mt-2">
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-violet-500 text-white font-medium"
                disabled={loading}
              >
                Update
              </button>
            </div>
          </form>
        </Modal>
      );
    }
    return null;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminTopbar />
        <main className="flex-1 flex flex-col px-8 py-6 overflow-y-auto">
          {/* Top controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            {/* Search & filters */}
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1">
                <input
                  className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-200"
                  placeholder="Search client name, car, etc"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <FaSearch />
                </span>
              </div>
              {/* Dummy filters */}
              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white text-gray-500 text-sm font-medium">
                Car Type{" "}
                <svg
                  width="14"
                  height="8"
                  viewBox="0 0 14 8"
                  fill="none"
                >
                  <path
                    d="M1 1L7 7L13 1"
                    stroke="#A0AEC0"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white text-gray-500 text-sm font-medium">
                Status{" "}
                <svg
                  width="14"
                  height="8"
                  viewBox="0 0 14 8"
                  fill="none"
                >
                  <path
                    d="M1 1L7 7L13 1"
                    stroke="#A0AEC0"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            {/* Add Unit */}
            <button
              className="bg-pink-500 text-white px-6 py-2 rounded-lg font-bold shadow"
              onClick={() => navigate("/admin/add-new-car")}
            >
              Add Car
            </button>
          </div>

          {/* Modal */}
          {renderModal()}

          {/* Car List */}
          <div className="flex-1">
            {displayedCars.length === 0 ? (
              <div className="text-center py-16 text-gray-400 bg-white rounded-xl">
                No cars found.
              </div>
            ) : (
              <div>{displayedCars.map(renderCarCard)}</div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-8 gap-3">
            <div className="flex items-center gap-3">
              <span className="text-gray-500 text-sm">Results per page</span>
              <select
                className="border rounded px-2 py-1"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                {PAGE_SIZE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-1">
              <button
                className="px-2 py-1 rounded border text-gray-500"
                disabled={page === 1}
                onClick={() => goToPage(page - 1)}
              >
                <FaChevronLeft />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`px-3 py-1 rounded ${
                    page === i + 1
                      ? "bg-violet-500 text-white font-bold"
                      : "border text-gray-700 bg-white"
                  }`}
                  onClick={() => goToPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="px-2 py-1 rounded border text-gray-500"
                disabled={page === totalPages}
                onClick={() => goToPage(page + 1)}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
          {/* Footer */}
          <footer className="mt-6 text-xs text-gray-400 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>Copyright © {new Date().getFullYear()} AutoSaleDN.</div>
            <div className="flex gap-4">
              <a href="#" className="hover:underline">
                Privacy Policy
              </a>
              <a href="#" className="hover:underline">
                Term and conditions
              </a>
              <a href="#" className="hover:underline">
                Contact
              </a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-xl overflow-hidden shadow-lg relative">
        <button
          className="absolute top-2 right-3 text-xl text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}