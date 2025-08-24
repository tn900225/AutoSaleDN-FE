import React, { useEffect, useState, useMemo } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import { FaEdit, FaTrash, FaTimes, FaSearch, FaFilter, FaEye, FaCheckCircle, FaExclamationCircle, FaUserCheck, FaUserSlash } from "react-icons/fa";
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const inputClass =
  "w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg bg-white text-gray-700 text-base focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-500 transition-colors placeholder-gray-400 shadow-sm";
const filterInputClass =
  "px-4 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-700 w-full text-base focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition-colors placeholder-gray-400 shadow-sm";

const formInit = {
  fullName: "",
  email: "",
  mobile: "",
  province: "",
  password: "",
  storeLocationId: "",
  status: true
};

const formatDate = (date) => {
  if (!date) return '-';
  return format(new Date(date), 'dd/MM/yyyy');
};

const Alert = ({ message, type, onClose }) => {
  const alertClasses = {
    success: "bg-green-100 border-green-400 text-green-700",
    error: "bg-red-100 border-red-400 text-red-700",
    info: "bg-blue-100 border-blue-400 text-blue-700",
    warning: "bg-yellow-100 border-yellow-400 text-yellow-700"
  };

  const iconClasses = {
    success: <FaCheckCircle className="mr-2" />,
    error: <FaExclamationCircle className="mr-2" />,
    info: <FaExclamationCircle className="mr-2" />,
    warning: <FaExclamationCircle className="mr-2" />
  };

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center p-4 mb-4 text-sm rounded-lg shadow-md border ${alertClasses[type]}`} role="alert">
      {iconClasses[type]}
      <div>
        <span className="font-medium">{type.charAt(0).toUpperCase() + type.slice(1)}:</span> {message}
      </div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 bg-transparent text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-200 inline-flex items-center justify-center h-8 w-8"
        onClick={onClose}
        aria-label="Close"
      >
        <FaTimes />
      </button>
    </div>
  );
};

export default function EmployeeAdmin() {
  const [sellers, setSellers] = useState([]);
  const [form, setForm] = useState(formInit);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("info");

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewSeller, setViewSeller] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [showrooms, setShowrooms] = useState([]);

  useEffect(() => {
    const fetchShowrooms = async () => {
      try {
        const response = await fetch('/api/Admin/showrooms', {
          headers: { Authorization: `Bearer ${getToken()}` }
        });

        if (!response.ok) throw new Error('Failed to fetch showrooms');
        const data = await response.json();
        setShowrooms(data);
      } catch (error) {
        console.error('Error fetching showrooms:', error);
      }
    };
    fetchShowrooms();
  }, []);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/Admin/sellers', {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch sellers');
      const data = await response.json();

      const showroomsResponse = await fetch('/api/Admin/showrooms', {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      if (!showroomsResponse.ok) throw new Error('Failed to fetch showrooms');
      const showrooms = await showroomsResponse.json();

      const sellerShowroomMap = new Map();
      showrooms.forEach(showroom => {
        sellerShowroomMap.set(showroom.id, showroom.name);
      });

      const sellersWithShowroom = data.map(seller => ({
        ...seller,
        showroomName: sellerShowroomMap.get(seller.storeLocationId) || 'None'
      }));

      setSellers(sellersWithShowroom);
    } catch (error) {
      console.error('Error fetching sellers:', error);
      setAlertMessage('Failed to fetch sellers');
      setAlertType('error');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const filteredSellers = useMemo(() => {
    let result = [...sellers];

    if (statusFilter && statusFilter !== "All") {
      result = result.filter(s => s.status === (statusFilter === "Active"));
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        s =>
          (s.fullName && s.fullName.toLowerCase().includes(term)) ||
          (s.email && s.email.toLowerCase().includes(term)) ||
          (s.mobile && s.mobile.toLowerCase().includes(term)) ||
          (s.province && s.province.toLowerCase().includes(term)) ||
          (s.showroomName && s.showroomName.toLowerCase().includes(term))
      );
    }

    const totalPages = Math.ceil(result.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedResult = result.slice(startIndex, endIndex);

    return {
      data: paginatedResult,
      totalPages,
      totalItems: result.length
    };
  }, [sellers, searchTerm, statusFilter, currentPage]);

  const getToken = () => localStorage.getItem('token');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch('/api/Admin/sellers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) throw new Error('Failed to add seller');
      const data = await response.json();

      const showroom = showrooms.find(s => s.id === form.storeLocationId);
      const newSeller = {
        ...data,
        showroomName: showroom ? showroom.name : 'None'
      };

      setSellers([...sellers, newSeller]);
      setAlertMessage('Employee added successfully');
      setAlertType('success');
      setShowAlert(true);

      fetchSellers();

      setForm(formInit);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding seller:', error);
      setAlertMessage('Failed to add employee');
      setAlertType('error');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`/api/Admin/sellers/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) throw new Error('Failed to update seller');
      const data = await response.json();

      const showroom = showrooms.find(s => s.id === form.storeLocationId);
      const updatedSeller = {
        ...data,
        showroomName: showroom ? showroom.name : 'None'
      };

      setSellers(sellers.map(s => s.userId === editingId ? updatedSeller : s));
      setAlertMessage('Employee updated successfully');
      setAlertType('success');
      setShowAlert(true);

      fetchSellers();

      setForm(formInit);
      setEditingId(null);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating seller:', error);
      setAlertMessage('Failed to update employee');
      setAlertType('error');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (seller, currentStatus) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/Admin/sellers/toggle-status/${seller.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ status: !currentStatus })
      });

      if (!response.ok) throw new Error('Failed to update status');

      setSellers(sellers.map(s => s.userId === seller.userId ? {
        ...s,
        status: !currentStatus
      } : s));

      setAlertMessage(`Seller status updated successfully`);
      setAlertType('success');
      setShowAlert(true);

      fetchSellers();
    } catch (error) {
      console.error('Error updating status:', error);
      setAlertMessage('Failed to update status');
      setAlertType('error');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (seller) => {
    const sellerShowroom = showrooms.find(showroom => showroom.id === seller.storeLocationId);
    setViewSeller({
      ...seller,
      showroomName: sellerShowroom ? sellerShowroom.name : 'None'
    });
    setShowViewModal(true);
  };

  const handleEdit = (seller) => {
    const sellerShowroom = showrooms.find(showroom => showroom.id === seller.storeLocationId);

    setForm({
      ...seller,
      storeLocationId: sellerShowroom ? sellerShowroom.id : ""
    });
    setEditingId(seller.userId);
    setShowEditModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setForm(formInit);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setForm(formInit);
    setEditingId(null);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewSeller(null);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < filteredSellers.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminTopbar />

        <main className="flex-1 px-8 py-8 overflow-y-auto">
          {showAlert && (
            <Alert
              message={alertMessage}
              type={alertType}
              onClose={() => setShowAlert(false)}
            />
          )}

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Employee Management</h1>
              <button
                onClick={() => {
                  setForm(formInit);
                  setShowAddModal(true);
                }}
                className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition duration-200"
              >
                Add New Employee
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={filterInputClass}
                  />
                  <FaSearch className="absolute right-3 top-2.5 text-gray-400" />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={filterInputClass}
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 font-bold text-left rounded-tl-xl">Full Name</th>
                    <th className="py-3 px-4 font-bold text-left">Email</th>
                    <th className="py-3 px-4 font-bold text-left">Mobile</th>
                    <th className="py-3 px-4 font-bold text-left">Province</th>
                    <th className="py-3 px-4 font-bold text-left">Showroom</th>
                    <th className="py-3 px-4 font-bold text-left">Status</th>
                    <th className="py-3 px-4 font-bold text-center rounded-tr-xl w-40">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSellers.data.map((seller, idx) => (
                    <tr key={seller.userId} className={`border-t last:border-b transition hover:bg-violet-50 ${idx % 2 === 1 ? "bg-gray-50" : ""}`}>
                      <td className="py-3 px-4">{seller.fullName}</td>
                      <td className="py-3 px-4">{seller.email}</td>
                      <td className="py-3 px-4">{seller.mobile}</td>
                      <td className="py-3 px-4">{seller.province}</td>
                      <td className="py-3 px-4">{seller.showroomName || 'None'} </td>
                      <td className="py-3 px-4">
                        {seller.status ? (
                          <span className="inline-flex items-center text-green-500 font-medium">
                            <FaCheckCircle className="mr-1" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-red-500 font-medium">
                            <FaTimes className="mr-1" /> Deactivated
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center flex justify-center items-center gap-2">
                        <div className="flex gap-2">
                        <button
                            onClick={() => handleView(seller)}
                            className="inline-block text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 p-2 rounded-full transition"
                            title="View Details"
                          >
                            <FaEye size={18} />
                          </button>
                          <button
                            onClick={() => handleEdit(seller)}
                            className="inline-block mr-1 text-violet-600 hover:text-violet-800 bg-violet-50 hover:bg-violet-100 p-2 rounded-full transition"
                            title="Edit"
                          >
                            <FaEdit size={18} />
                          </button>

                          
                          <button
                            className={`inline-block p-2 rounded-full transition 
                                                      ${seller.status
                                ? "text-orange-500 hover:text-orange-700 bg-orange-50 hover:bg-orange-100"
                                : "text-green-500 hover:text-green-700 bg-green-50 hover:bg-green-100"
                              }`}
                            title={seller.status ? "Deactivate Account" : "Activate Account"}
                            onClick={() => handleToggleStatus(seller, seller.status)}
                          >
                            {seller.status ? <FaUserSlash size={18} /> : <FaUserCheck size={18} />}
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-500">
                Showing {filteredSellers.data.length} of {filteredSellers.totalItems} employees
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500">Page {currentPage} of {filteredSellers.totalPages}</span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === filteredSellers.totalPages}
                  className="px-3 py-1 rounded-md text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center pb-4">
              <h3 className="text-lg font-medium">Add New Employee</h3>
              <button
                onClick={handleCloseAddModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className={inputClass + " placeholder:font-light"}
                      type="password"
                      autoComplete="new-password"
                      placeholder={"Enter password"}
                      required
                    />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mobile</label>
                <input
                  type="tel"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Province</label>
                <input
                  type="text"
                  name="province"
                  value={form.province}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Showroom</label>
                <select
                  name="storeLocationId"
                  value={form.storeLocationId}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="">Select Showroom</option>
                  {showrooms.map(showroom => (
                    <option key={showroom.id} value={showroom.id}>
                      {showroom.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCloseAddModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-md hover:bg-violet-700 disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center pb-4">
              <h3 className="text-lg font-medium">Update Employee</h3>
              <button
                onClick={handleCloseEditModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={inputClass}
                  required
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mobile</label>
                <input
                  type="tel"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Province</label>
                <input
                  type="text"
                  name="province"
                  value={form.province}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Showroom</label>
                <select
                  name="storeLocationId"
                  value={form.storeLocationId}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="">Select Showroom</option>
                  {showrooms.map(showroom => (
                    <option key={showroom.id} value={showroom.id}>
                      {showroom.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-md hover:bg-violet-700 disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showViewModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-6 border rounded-xl shadow-xl bg-white max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Employee Details</h3>
              <button
                onClick={handleCloseViewModal}
                className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-violet-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <FaUserCheck className="text-violet-500 w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900">{viewSeller.fullName}</h4>
                      <p className="text-sm text-gray-500">{viewSeller.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${viewSeller.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {viewSeller.status ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="font-medium text-gray-600">Mobile:</div>
                  <div className="mt-1 text-gray-900">{viewSeller.mobile}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-600">Province:</div>
                  <div className="mt-1 text-gray-900">{viewSeller.province}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-600">Showroom:</div>
                  <div className="mt-1 text-gray-900">{viewSeller.showroomName}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-600">Created At:</div>
                  <div className="mt-1 text-gray-900">{formatDate(viewSeller.createdAt)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}