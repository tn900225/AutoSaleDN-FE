import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import { FaSearch, FaChevronLeft, FaChevronRight, FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import { X, Plus, Trash2, Car, MapPin, Check } from 'lucide-react';
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
  model_name:"",
  user_id: "",
  year: "",
  mileage: "",
  price: "",
  location: "",
  condition: "",
  RentSell: "",
  color: "",
};

export default function Cars() {
  // State cho modal phân bổ showroom
  const [showroomModal, setShowroomModal] = useState({ open: false, car: null, selectedShowroomId: null });
  const [viewAllocationModal, setViewAllocationModal] = useState({ open: false, car: null });
  // State for showroom list
  const [showroomList, setShowroomList] = useState([]);
  const [loadingShowrooms, setLoadingShowrooms] = useState(false);

  // Add the form state here
  const [form, setForm] = useState(formInit); //

  // Fetch showrooms from API
  const fetchShowrooms = async () => {
    setLoadingShowrooms(true);
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching showrooms with token:', token ? 'Token exists' : 'No token');
      
      const response = await fetch('/api/Admin/showrooms', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Showrooms API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch showrooms:', errorText);
        throw new Error('Failed to fetch showrooms');
      }
      
      const data = await response.json();
      console.log('Showrooms API response data:', data);
      
      // The API might be returning the array directly or nested under a 'data' property
      const showroomsData = Array.isArray(data) ? data : (data.data || []);
      
      // Map the API response to match the expected format
      const formattedShowrooms = showroomsData.map(showroom => {
        // Make sure we're using the correct property names from the API response
        const showroomId = showroom.showroomId || showroom.id;
        const showroomName = showroom.showroomName || showroom.name || 'Unnamed Showroom';
        
        if (!showroomId) {
          console.warn('Showroom missing ID:', showroom);
        }
        
        return {
          showroomId,
          showroomName
        };
      });
      
      console.log('Formatted showrooms:', formattedShowrooms);
      setShowroomList(formattedShowrooms);
    } catch (error) {
      console.error('Error fetching showrooms:', error);
      Swal.fire({ 
        icon: 'error', 
        title: 'Error',
        text: 'Failed to load showrooms. Please try again later.'
      });
      setShowroomList([]);
    } finally {
      setLoadingShowrooms(false);
    }
  };

  // Fetch showrooms on component mount
  useEffect(() => {
    fetchShowrooms();
  }, []);

  function openShowroomModal(car) {
    setShowroomModal({
      open: true,
      car,
      selectedShowroomId: null,
    });
  }

  function closeShowroomModal() {
    setShowroomModal({ open: false, car: null, selectedShowroomId: null });
  }

  async function handleSaveShowroomAllocation() {
    const { car, selectedShowroomId } = showroomModal;

    const allocationData = {
      listingId: car.listingId,
      showroomId: selectedShowroomId,
    };

    if (!allocationData.showroomId) {
      Swal.fire({ icon: 'warning', title: 'Please select a showroom!' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/allocations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(allocationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save allocation');
      }

      Swal.fire({ icon: 'success', title: 'Car allocated successfully!' });
      closeShowroomModal();
      // Also close the view modal if it's open for the same car
      if (viewAllocationModal.open && viewAllocationModal.car.listingId === car.listingId) {
        setViewAllocationModal({ open: false, car: null });
      }
      fetchCars(); // Refresh the car list
    } catch (error) {
      console.error('Error saving allocation:', error);
      Swal.fire({ icon: 'error', title: 'Oops...', text: error.message || 'Something went wrong!' });
    }
  }

  async function handleDeleteShowroom(car, showroom) {
    Swal.fire({
      icon: 'warning',
      title: 'Confirm Deletion',
      text: `Are you sure you want to delete the allocation for ${showroom.showroomName}?`,
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          // The backend expects the storeListingId, which is passed as 'inventoryId' in our DTO.
          const response = await fetch(`/api/admin/allocations/${showroom.inventoryId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete allocation');
          }

          Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Allocation has been deleted.' });
          setViewAllocationModal({ open: false, car: null }); // Close the main allocation view modal
          fetchCars(); // Refresh the data
        } catch (error) {
          console.error('Error deleting allocation:', error);
          Swal.fire({ icon: 'error', title: 'Oops...', text: error.message || 'Something went wrong!' });
        }
      }
    });
  }

  const [cars, setCars] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("add"); // add, edit, delete
  const [modalCar, setModalCar] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchCars = async () => {
    setLoading(true);
    try {
      console.log('Fetching cars with params:', { page, search });
      const response = await fetch(`/api/admin/cars?page=${page}&pageSize=10&search=${search}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      console.log('Cars API response status:', response.status);
      
      if (response.status === 401) {
        console.warn('Unauthorized - redirecting to login');
        navigate('/login');
        return;
      }
      
      const data = await response.json().catch(e => {
        console.error('Error parsing cars response:', e);
        return { data: [] };
      });
      
      console.log('Cars API response data:', data);
      
      // Process the cars data to ensure showrooms are properly formatted
      const processedCars = (data.data || []).map(car => ({
        ...car,
        // Ensure showrooms is always an array with the correct structure
        showrooms: (car.showrooms || []).map(s => ({
          showroomId: s.showroomId || s.id,
          showroomName: s.showroomName || s.name || 'Unknown Showroom',
          // Include any other necessary fields
          ...s
        }))
      }));
      
      console.log('Processed cars with showrooms:', processedCars);
      
      setCars(processedCars);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching cars:', error);
      Swal.fire({ icon: 'error', title: 'Failed to fetch cars' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [page, search]);

  // Derived: filtered + paginated
  const displayedCars = cars;

  // Modal handlers
  const openEditModal = (car) => {
    setModalType("edit");
    setModalCar(car);
    console.log("model ",car)
    setForm({
      model_id: car.modelName_id || car.ModelId || car.modelNameId || "",
      model_name:  car.modelName,
      user_id: car.user_id || car.UserId || car.userId || "",
      year: car.year || "",
      mileage: car.mileage || "",
      price: car.price || "",
      location: car.location || "",
      condition: car.condition || "Good",
      RentSell: car.RentSell || "",
      color: car.color || car.color || "",
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
      let url = "/api/admin/cars";
      let method = "POST";
      if (modalType === "edit") {
        url = `/api/admin/cars/${modalCar.listing_id || modalCar.ListingId}`;
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
        url = `/api/admin/cars/${modalCar.listing_id || modalCar.ListingId}`;
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
      key={car.id}
      className="bg-white rounded-3xl shadow-xl mb-8 border border-gray-100 hover:shadow-2xl transition-all duration-200"
    >
      <div className="flex flex-col md:flex-row gap-0 md:gap-8 p-6 md:p-8">
        {/* Ảnh xe */}
        <div className="flex-shrink-0 flex items-center justify-center w-full md:w-64 bg-gray-50 rounded-2xl overflow-hidden">
          <img
            src={car.images && car.images.length > 0 ? car.images[0] : "https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg"}
            alt="Car"
            className="object-contain w-full h-36 md:h-40"
          />
        </div>
        {/* Thông tin xe */}
        <div className="flex-1 flex flex-col gap-2 justify-between py-3">
          <div className="flex flex-col gap-1">
            <div className="text-2xl font-bold text-gray-800 mb-1 flex items-center gap-2">
              <span>{car.manufacturer}</span>
              <span className="text-base font-medium text-gray-500">{car.modelName}</span>
              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold">{car.year}</span>
              <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-semibold">{car.color}</span>
            </div>
          </div>
          <div className="flex gap-3 mt-2">
            <button
              className="px-3 py-1 rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-50 flex items-center gap-1 font-medium"
              onClick={() => openEditModal(car)}
            >
              <FaEdit className="text-lg" /> Sửa xe
            </button>
            <button
              className="px-3 py-1 rounded-lg border border-red-500 text-red-600 hover:bg-red-50 flex items-center gap-1 font-medium"
              onClick={() => openDeleteModal(car)}
            >
              <FaTrash className="text-lg" /> Xóa xe
            </button>
          </div>
        </div>
      </div>
      {/* Phân bổ showroom */}
      <div className="px-6 pb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="font-semibold text-gray-700 text-base">Phân bổ Showroom</span>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg flex items-center gap-1 font-semibold shadow"
            onClick={() => openShowroomModal(car)}
          >
            <FaPlus /> Thêm phân bổ
          </button>
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm bg-white rounded-xl">
            <thead>
              <tr className="bg-gray-50 text-gray-700">
                <th className="py-2 px-4 text-left">Showroom</th>
                <th className="py-2 px-4 text-left">Số lượng</th>
                <th className="py-2 px-4 text-left">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {(car.showrooms || []).map((sr) => (
                <tr key={sr.showroomId} className="border-b hover:bg-blue-50/50 transition">
                  <td className="py-2 px-4 font-medium">{sr.showroomName}</td>
                  <td className="py-2 px-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-bold text-xs">
                      {sr.quantity}
                    </span>
                  </td>
                  <td className="py-2 px-4 flex gap-2">
                    <button
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded font-semibold shadow"
                      onClick={() => openShowroomModal(car, sr)}
                    >
                      Sửa
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded font-semibold shadow"
                      onClick={() => handleDeleteShowroom(car, sr)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
              {(car.showrooms || []).length === 0 && (
                <tr key="no-showrooms">
                  <td colSpan={3} className="text-center text-gray-400 py-4">Chưa có phân bổ showroom nào cho xe này.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Modal UI
  const renderModal = () => {
    if (!openModal) return null;
    if (modalType === "delete") {
      return (
        <Modal onClose={() => setOpenModal(false)}>
          <div className="p-8 bg-white rounded-2xl shadow-2xl w-[450px] max-w-full text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-3 text-gray-800">
              Delete Vehicle
            </h2>
            
            <p className="text-gray-600 mb-2">
              Are you sure you want to delete this vehicle?
            </p>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-lg font-semibold text-gray-800">
                {modalCar?.manufacturer} {modalCar?.modelName}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                This action cannot be undone
              </p>
            </div>
            
            <div className="flex gap-3 justify-center">
              <button
                className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
                onClick={() => setOpenModal(false)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
              <button
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
                onClick={handleModalSubmit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Vehicle
                  </>
                )}
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
          <form 
            className="p-8 bg-white rounded-2xl shadow-2xl w-[500px] max-w-full" 
            onSubmit={handleModalSubmit}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                Edit Vehicle
              </h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Model ID</label>
                <input
                  name="modelId"
                  value={form.modelId}
                  onChange={e => setForm(f => ({ ...f, modelId: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Enter model ID"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">User ID</label>
                <input
                  name="userId"
                  value={form.userId}
                  onChange={e => setForm(f => ({ ...f, userId: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Enter user ID"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Year</label>
                <input
                  name="year"
                  value={form.year}
                  onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="2024"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Mileage</label>
                <input
                  name="mileage"
                  value={form.mileage}
                  onChange={e => setForm(f => ({ ...f, mileage: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="10,000 km"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  name="price"
                  value={form.price}
                  onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="$25,000"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="City, State"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Condition</label>
                <select
                  name="condition"
                  value={form.condition}
                  onChange={e => setForm(f => ({ ...f, condition: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white appearance-none cursor-pointer"
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Listing Type</label>
                <select
                  name="rentSell"
                  value={form.rentSell}
                  onChange={e => setForm(f => ({ ...f, rentSell: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white appearance-none cursor-pointer"
                >
                  <option value="Rent">For Rent</option>
                  <option value="Sell">For Sale</option>
                </select>
              </div>
              
              <div className="space-y-2 col-span-2">
                <label className="block text-sm font-medium text-gray-700">Color</label>
                <input
                  name="color"
                  value={form.color}
                  onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Pearl White, Midnight Black, etc."
                />
              </div>
            </div>
            
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setOpenModal(false)}
                className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Update Vehicle
                  </>
                )}
              </button>
            </div>
          </form>
        </Modal>
      );
    }
    return null;
  };

  // Handle showroom selection
  const handleSelectShowroom = (showroomId) => {
    setShowroomModal(prev => ({
      ...prev,
      selectedShowroomId: showroomId
    }));
  };

  // Handle save showroom allocation
  const handleSaveAllocation = async () => {
    const { car, selectedShowroomId } = showroomModal;
    
    console.log('Saving allocation with:', { car, selectedShowroomId });
    
    if (!selectedShowroomId) {
      Swal.fire('Error', 'Please select a showroom', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      console.log('Sending allocation request with token:', token ? 'Token exists' : 'No token');
      console.log('Sending allocation request with id:', car.listingId ? 'Token listingId' : 'No id');
      const requestBody = {
        listingId: car.listingId,
        showroomId: selectedShowroomId,
        quantity: 1 // Default quantity to 1
      };
      
      console.log('Request body:', requestBody);
      
      const response = await fetch('/api/Admin/allocations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Allocation response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Allocation error response:', errorText);
        let errorMessage = 'Failed to allocate car to showroom';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
        throw new Error(errorMessage);
      }

      const responseData = await response.json().catch(() => ({}));
      console.log('Allocation successful:', responseData);
      
      Swal.fire('Success', 'Car allocated to showroom successfully', 'success');
      setShowroomModal({ open: false, car: null, selectedShowroomId: null });
      fetchCars(); // Refresh the car list
    } catch (error) {
      console.error('Error allocating car to showroom:', error);
      Swal.fire('Error', error.message || 'Failed to allocate car to showroom', 'error');
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminTopbar />
        <main className="flex-1 flex flex-col px-8 py-6 overflow-y-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0M15 17a2 2 0 104 0" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Vehicle Management</h1>
                <p className="text-gray-600">Manage your car inventory and showroom allocations</p>
              </div>
            </div>
          </div>
  
          {/* Top controls */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Search & filters */}
              <div className="flex flex-1 gap-4">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Search by model, manufacturer, or color..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                  />
                  <div className="absolute left-4 top-3.5 text-gray-400">
                    <FaSearch className="w-4 h-4" />
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-600 text-sm font-medium hover:bg-gray-50 transition-all duration-200">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    Vehicle Type
                  </button>
                  <button className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-600 text-sm font-medium hover:bg-gray-50 transition-all duration-200">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    Status
                  </button>
                </div>
              </div>
              
              {/* Add Vehicle Button */}
              <button
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center gap-2"
                onClick={() => navigate("/admin/add-new-car")}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Vehicle
              </button>
            </div>
          </div>
  
          {/* Modals */}
          {renderModal()}
  
          {/* View Allocation Modal */}
          {viewAllocationModal.open && (
            <ViewAllocationModal
              car={viewAllocationModal.car}
              onClose={() => setViewAllocationModal({ open: false, car: null })}
              onEdit={(car, showroom) => {
                setViewAllocationModal({ open: false, car: null });
                openShowroomModal(car, showroom);
              }}
              onDelete={handleDeleteShowroom}
              onAdd={(car) => {
                setViewAllocationModal({ open: false, car: null });
                openShowroomModal(car);
              }}
            />
          )}
  
          {/* Showroom Modal */}
          {showroomModal.open && (
            <ShowroomModal
              open={showroomModal.open}
              car={showroomModal.car}
              setSelectedShowroomId={(id) => setShowroomModal(prev => ({ ...prev, selectedShowroomId: id }))}
              showroomList={showroomList}
              onSave={handleSaveAllocation}
              onClose={closeShowroomModal}
            />
          )}
  
          {/* Car List */}
          <div className="flex-1">
            {displayedCars.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0M15 17a2 2 0 104 0" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No vehicles found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search criteria or add a new vehicle to get started.</p>
                <button
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 inline-flex items-center gap-2"
                  onClick={() => navigate("/admin/add-new-car")}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Your First Vehicle
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Vehicle Inventory</h2>
                      <p className="text-gray-600 mt-1">Manage your fleet of vehicles</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-gray-500">
                        {displayedCars.length} vehicles found
                      </div>
                      <button
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center gap-2"
                        onClick={() => navigate("/admin/add-new-car")}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Vehicle
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                        <th className="py-4 px-6 text-left font-semibold text-gray-700">Vehicle</th>
                        <th className="py-4 px-6 text-left font-semibold text-gray-700">Details</th>
                        <th className="py-4 px-6 text-left font-semibold text-gray-700">Status</th>
                        <th className="py-4 px-6 text-left font-semibold text-gray-700">Allocations</th>
                        <th className="py-4 px-6 text-center font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedCars.map((car, index) => (
                        <tr 
                          key={car.id} 
                          className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 ${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                          }`}
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <img
                                  src={car.images && car.images.length > 0 ? car.images[0] : "https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg"}
                                  alt={car.modelName}
                                  className="w-16 h-12 object-cover rounded-lg shadow-sm border border-gray-200"
                                />
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              </div>
                              <div>
                                <div className="font-bold text-gray-800 text-base">{car.modelName}</div>
                                <div className="text-gray-600 text-sm">{car.manufacturer}</div>
                              </div>
                            </div>
                          </td>
                          
                          <td className="py-4 px-6">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">Year:</span>
                                <span className="font-medium text-gray-800">{car.year}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">Color:</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full border border-gray-300" style={{backgroundColor: car.color?.toLowerCase()}}></div>
                                  <span className="font-medium text-gray-800">{car.color}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              {getStatusBadge(car.status, car.availableUnits)}
                            </div>
                          </td>
                          
                          <td className="py-4 px-6">
                            <button
                              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold shadow-sm hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 flex items-center gap-2"
                              onClick={() => setViewAllocationModal({ open: true, car })}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View
                            </button>
                          </td>
                          
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-2 rounded-lg shadow-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-200 group"
                                onClick={() => openEditModal(car)}
                                title="Edit Vehicle"
                              >
                                <FaEdit className="w-4 h-4 group-hover:scale-110 transition-transform" />
                              </button>
                              <button
                                className={`p-2 rounded-lg shadow-sm transition-all duration-200 group ${
                                  car.status === 'Hidden' 
                                    ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700' 
                                    : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600'
                                }`}
                                // onClick={() => toggleHideCar(car)} // This function is not defined in the provided code snippet
                                title={car.status === 'Hidden' ? 'Show Vehicle' : 'Hide Vehicle'}
                              >
                                {car.status === 'Hidden' ? (
                                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                ) : (
                                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                  </svg>
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
  
          {/* Pagination */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mt-8 gap-4">
            <div className="flex items-center gap-3">
              <span className="text-gray-600 text-sm font-medium">Results per page</span>
              <select
                className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={10}
                onChange={(e) => {
                  // setPageSize(Number(e.target.value));
                  // setPage(1);
                }}
              >
                {PAGE_SIZE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <span className="text-gray-500 text-sm">
                Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, displayedCars.length)} of {displayedCars.length} results
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <FaChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      page === i + 1
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                        : "border border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
                    }`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              
              <button
                className="px-3 py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                <FaChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
  
          {/* Footer */}
          <footer className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span>Copyright {new Date().getFullYear()} AutoSaleDN. All rights reserved.</span>
              </div>
              <div className="flex gap-6">
                <a href="#" className="hover:text-blue-600 transition-colors duration-200">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-blue-600 transition-colors duration-200">
                  Terms & Conditions
                </a>
                <a href="#" className="hover:text-blue-600 transition-colors duration-200">
                  Contact Support
                </a>
              </div>
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
      <div className="bg-white rounded-xl overflow-hidden shadow-lg relative min-w-[320px]">
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

// Modal phân bổ showroom
// Modal xem phân bổ showroom
function ViewAllocationModal({ car, onClose, onAdd, onDelete }) {
  if (!car) return null;

  return (
    <Modal onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Showroom Allocations</h2>
                <p className="text-blue-100">{car.modelName}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="max-h-80 overflow-y-auto mb-6">
            {car.showrooms && car.showrooms.length > 0 ? (
              <div className="space-y-3">
                {car.showrooms.map((alloc) => (
                  <div key={alloc.showroomId} className="group bg-gradient-to-r from-slate-50 to-blue-50 hover:from-blue-50 hover:to-purple-50 rounded-xl p-4 border border-slate-200 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800">{alloc.showroomName}</h3>
                          <p className="text-sm text-slate-500">Active allocation</p>
                        </div>
                      </div>
                      <button
                        onClick={() => onDelete(car, alloc)}
                        className="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-600 mb-2">No Allocations Found</h3>
                <p className="text-slate-500">This vehicle hasn't been allocated to any showrooms yet.</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={() => onAdd(car)}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-200 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Allocation
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-slate-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}


// Modal phân bổ showroom
function ShowroomModal({ open, car, setSelectedShowroomId, showroomList, onSave, onClose }) {
  const availableShowrooms = showroomList.filter(
    sr => !(car?.showrooms || []).some(s => s.showroomId === sr.showroomId)
  );

  return (
    <Modal onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Allocate Vehicle</h2>
                <p className="text-emerald-100 text-sm">Select showroom for {car?.modelName || ''}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Form Content */}
        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Choose Showroom
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <select
                className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:bg-white transition-all duration-300 appearance-none cursor-pointer hover:border-slate-300"
                onChange={e => setSelectedShowroomId(Number(e.target.value))}
                defaultValue=""
              >
                <option value="" disabled>-- Select a showroom --</option>
                {availableShowrooms.length > 0 ? (
                  availableShowrooms.map(sr => (
                    <option key={sr.showroomId} value={sr.showroomId}>
                      {sr.showroomName}
                    </option>
                  ))
                ) : (
                  <option disabled>No showrooms available</option>
                )}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {availableShowrooms.length === 0 && (
              <p className="mt-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                All showrooms have been allocated to this vehicle.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-slate-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSave}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-200 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Confirm
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}