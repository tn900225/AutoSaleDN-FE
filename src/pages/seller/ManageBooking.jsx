import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getApiBaseUrl } from '../../../util/apiconfig';
import { Calendar, Car, MapPin, Tag, Hash, X, Info, Clock, User, Mail, Phone, Search, Filter, Edit, FileText } from 'lucide-react';
import SellerSidebar from "../../components/seller/SellerSidebar";
import SellerTopbar from "../../components/seller/SellerTopbar";


const getToken = () => localStorage.getItem('token');

// === CÁC COMPONENT PHỤ ===

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-20">
    <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-blue-600"></div>
  </div>
);

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 text-blue-500 mt-1">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-md font-semibold text-gray-800 break-words">{value}</p>
    </div>
  </div>
);

const BookingDetailModal = ({ booking, onClose }) => {
  if (!booking) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-50 rounded-lg shadow-xl w-full max-w-3xl animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b flex justify-between items-center bg-white rounded-t-lg">
          <div>
            <p className="text-sm font-semibold text-blue-600">BOOKING ID #{booking.bookingId}</p>
            <h2 className="text-2xl font-bold text-gray-900">{booking.car.manufacturerName} {booking.car.modelName}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X size={24} /></button>
        </div>
        <div className="p-8 max-h-[70vh] overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer & Booking Info */}
          <div className="space-y-6">
            <div className="p-4 bg-white rounded-lg border">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><User /> Customer Details</h3>
              <div className="space-y-4">
                <DetailItem icon={<User size={18}/>} label="Full Name" value={booking.customer.fullName} />
                <DetailItem icon={<Mail size={18}/>} label="Email" value={booking.customer.email} />
                <DetailItem icon={<Phone size={18}/>} label="Phone Number" value={booking.customer.mobile || 'N/A'} />
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Info /> Appointment Details</h3>
              <div className="space-y-4">
                <DetailItem icon={<Tag size={18}/>} label="Status" value={booking.status} />
                <DetailItem icon={<Clock size={18}/>} label="Booking Date" value={new Date(booking.bookingDate).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })} />
                <DetailItem icon={<Car size={18}/>} label="Has License" value={booking.hasLicense ? 'Yes' : 'No'} />
              </div>
            </div>
          </div>
          {/* Car & Showroom Info */}
          <div className="space-y-6">
            <div className="p-4 bg-white rounded-lg border">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Car /> Vehicle Details</h3>
              <div className="space-y-4">
                <DetailItem icon={<Tag size={18}/>} label="Manufacturer" value={booking.car.manufacturerName} />
                <DetailItem icon={<Tag size={18}/>} label="Model" value={booking.car.modelName} />
                <DetailItem icon={<Calendar size={18}/>} label="Year" value={booking.car.year} />
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><MapPin /> Showroom Details</h3>
              <DetailItem icon={<MapPin size={18}/>} label="Location" value={`${booking.showroom.showroomName} - ${booking.showroom.address}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const UpdateStatusModal = ({ booking, onClose, onUpdate }) => {
  const [newStatus, setNewStatus] = useState(booking.status);
  const allowedStatuses = ["Confirmed", "Completed", "Canceled"];

  const handleUpdate = () => {
    onUpdate(booking.bookingId, newStatus);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Update Status for Booking #{booking.bookingId}</h2>
        </div>
        <div className="p-6 space-y-4">
          <p>Current Status: <span className="font-semibold">{booking.status}</span></p>
          <div>
            <label htmlFor="status-select" className="block text-sm font-medium text-gray-700 mb-1">New Status:</label>
            <select
              id="status-select"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {booking.status === "Pending" && <option value="Pending">Pending</option>}
              {allowedStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="p-4 bg-gray-50 flex justify-end gap-3 rounded-b-lg">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
          <button onClick={handleUpdate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Update</button>
        </div>
      </div>
    </div>
  );
};


// === COMPONENT CHÍNH CỦA TRANG ===

const BookingManagementPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [updatingBooking, setUpdatingBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();
  const apiBaseUrl = getApiBaseUrl();

  const fetchBookings = useCallback(async () => {
    const token = getToken();
    if (!token) { navigate('/login'); return; }
    try {
      setLoading(true);
      const response = await fetch(`${apiBaseUrl}/api/Seller/test-drives`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to load bookings.');
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [apiBaseUrl, navigate]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const filteredBookings = useMemo(() => {
    return bookings
      .filter(b => statusFilter === 'All' || b.status === statusFilter)
      .filter(b => {
        const term = searchTerm.toLowerCase();
        return b.customer.fullName.toLowerCase().includes(term) ||
               b.customer.email.toLowerCase().includes(term) ||
               `${b.car.manufacturerName} ${b.car.modelName}`.toLowerCase().includes(term);
      });
  }, [bookings, statusFilter, searchTerm]);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    const token = getToken();
    try {
      const response = await fetch(`${apiBaseUrl}/api/Seller/test-drives/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to update status.');
      }
      Swal.fire('Success', 'Booking status updated successfully!', 'success');
      // Update local state for immediate UI feedback
      setBookings(prev => prev.map(b => b.bookingId === bookingId ? { ...b, status: newStatus } : b));
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Pending': 'bg-yellow-100 text-yellow-800', 'Confirmed': 'bg-green-100 text-green-800',
      'Canceled': 'bg-red-100 text-red-800', 'Completed': 'bg-blue-100 text-blue-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  return (
      <div className="flex h-screen bg-gray-50">
              <SellerSidebar />
              <div className="flex-1 flex flex-col min-h-screen">
                <SellerTopbar />
        <main className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Booking Management</h1>
        
        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search by customer, email, or car..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto pl-10 pr-4 py-2 border rounded-lg appearance-none focus:ring-2 focus:ring-blue-500">
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option><option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option><option value="Canceled">Canceled</option>
            </select>
          </div>
        </div>

        {loading ? <LoadingSpinner /> : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['Customer', 'Car', 'Showroom', 'Date', 'Status', 'Actions'].map(head =>
                      <th key={head} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{head}</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBookings.length > 0 ? filteredBookings.map((b) => (
                    <tr key={b.bookingId}>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="font-semibold text-gray-900">{b.customer.fullName}</div><div className="text-sm text-gray-500">{b.customer.email}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="font-semibold text-gray-900">{b.car.manufacturerName} {b.car.modelName}</div><div className="text-sm text-gray-500">{b.car.year}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{b.showroom.showroomName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(b.bookingDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(b.status)}`}>{b.status}</span></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-4">
                        <button onClick={() => setUpdatingBooking(b)} className="flex items-center gap-1 text-yellow-600 hover:text-yellow-900"><Edit size={16} /> Update</button>
                        <button onClick={() => setSelectedBooking(b)} className="flex items-center gap-1 text-blue-600 hover:text-blue-900"><FileText size={16} /> Details</button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="6" className="text-center py-10 text-gray-500">No bookings found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {selectedBooking && <BookingDetailModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />}
      {updatingBooking && <UpdateStatusModal booking={updatingBooking} onClose={() => setUpdatingBooking(null)} onUpdate={handleUpdateStatus} />}
    </main>
         </div>
    </div>
  );
};

export default BookingManagementPage;