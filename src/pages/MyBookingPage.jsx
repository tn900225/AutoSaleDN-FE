import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getApiBaseUrl } from '../../util/apiconfig';
import { Calendar, Car, MapPin, Tag, Hash, X, Info, Clock, UserCheck, MessageSquare, Search, Filter, FileText, XCircle } from 'lucide-react';

// === CÁC COMPONENT PHỤ (KHÔNG THAY ĐỔI NHIỀU) ===

const getToken = () => localStorage.getItem('token');

const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-blue-500"></div>
    </div>
);

const BookingDetailModal = ({ booking, onClose }) => {
    if (!booking) return null;

    const getStatusInfo = (status) => {
        switch (status) {
            case 'Pending':
                return {
                    style: 'bg-yellow-100 text-yellow-800 border-yellow-300',
                    icon: <Clock size={20} className="text-yellow-600" />
                };
            case 'Confirmed':
                return {
                    style: 'bg-green-100 text-green-800 border-green-300',
                    icon: <UserCheck size={20} className="text-green-600" />
                };
            case 'Canceled':
                return {
                    style: 'bg-red-100 text-red-800 border-red-300',
                    icon: <XCircle size={20} className="text-red-600" />
                };
            case 'Completed':
                return {
                    style: 'bg-blue-100 text-blue-800 border-blue-300',
                    icon: <Car size={20} className="text-blue-600" />
                };
            default:
                return {
                    style: 'bg-gray-100 text-gray-800 border-gray-300',
                    icon: <Info size={20} className="text-gray-600" />
                };
        }
    };

    const statusInfo = getStatusInfo(booking.status);

    // Component phụ cho mỗi mục chi tiết
    const DetailItem = ({ icon, label, value }) => (
        <div className="flex items-start gap-4">
            <div className="flex-shrink-0 text-blue-500 mt-1">{icon}</div>
            <div>
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="text-md font-semibold text-gray-800">{value}</p>
            </div>
        </div>
    );

    return (
        // Backdrop
        <div
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 transition-opacity duration-300"
            onClick={onClose}
        >
            {/* Modal Content */}
            <div
                className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-3xl transform transition-all duration-300 scale-95 animate-fade-in-up"
                onClick={(e) => e.stopPropagation()} // Ngăn việc click bên trong modal đóng modal
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white rounded-t-2xl">
                    <div>
                        <p className="text-sm font-semibold text-blue-600">BOOKING ID #{booking.bookingId}</p>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {booking.car.manufacturerName} {booking.car.modelName} ({booking.car.year})
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 max-h-[75vh] overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Cột trái - Thông tin chính */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Vehicle Info */}
                            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                                <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                                    <Car size={20} /> Vehicle Details
                                </h3>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                                    <DetailItem icon={<Tag size={18} />} label="Manufacturer" value={booking.car.manufacturerName} />
                                    <DetailItem icon={<Tag size={18} />} label="Model" value={booking.car.modelName} />
                                    <DetailItem icon={<Calendar size={18} />} label="Year" value={booking.car.year} />
                                    <DetailItem icon={<Info size={18} />} label="Condition" value={booking.car.condition} />
                                    <DetailItem icon={<Hash size={18} />} label="Mileage" value={`${booking.car.mileage?.toLocaleString()} km`} />
                                    <DetailItem icon={<Hash size={18} />} label="Price" value={`$${booking.car.price?.toLocaleString('en-US')}`} />
                                </div>
                            </div>

                            {/* Showroom Info */}
                            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                                <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                                    <MapPin size={20} /> Showroom Details
                                </h3>
                                <div className="space-y-4">
                                    <DetailItem icon={<Hash size={18} />} label="Showroom Name" value={booking.showroom.showroomName} />
                                    <DetailItem icon={<MapPin size={18} />} label="Address" value={booking.showroom.address} />
                                </div>
                            </div>

                        </div>

                        {/* Cột phải - Thông tin lịch hẹn */}
                        <div className="space-y-6">
                            <div className={`p-4 border rounded-lg flex items-center gap-4 ${statusInfo.style}`}>
                                {statusInfo.icon}
                                <div>
                                    <p className="text-sm font-medium opacity-80">Status</p>
                                    <p className="text-lg font-bold">{booking.status}</p>
                                </div>
                            </div>
                            {/* Thay đổi p-10 thành p-6 ở dòng dưới */}
                            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 space-y-5">
                                <DetailItem icon={<Clock size={18} />} label="Booking Date" value={new Date(booking.bookingDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} />
                                <DetailItem icon={<UserCheck size={18} />} label="License Held" value={booking.hasLicense ? "Yes" : "No"} />
                                <DetailItem icon={<MessageSquare size={18} />} label="Notes" value={booking.notes || "No additional notes."} />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};



// === COMPONENT CHÍNH CỦA TRANG (ĐÃ ĐƯỢC CẬP NHẬT) ===

const MyBookingsPage = () => {
    const [bookings, setBookings] = useState([]); // Master list from API
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const navigate = useNavigate();
    const apiBaseUrl = getApiBaseUrl();

    // Fetching data logic
    useEffect(() => {
        const fetchBookings = async () => {
            const token = getToken();
            if (!token) {
                Swal.fire('Not Authenticated', 'Please log in to view your bookings.', 'error');
                navigate('/login');
                return;
            }
            try {
                setLoading(true);
                const response = await fetch(`${apiBaseUrl}/api/Customer/test-drives`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.status === 401) navigate('/login');
                if (!response.ok) throw new Error('Failed to load bookings.');
                const data = await response.json();
                setBookings(data);
            } catch (error) {
                Swal.fire('Error', error.message, 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [apiBaseUrl, navigate]);

    // Logic for filtering and searching
    const filteredBookings = useMemo(() => {
        return bookings
            .filter(booking => {
                if (statusFilter === 'All') return true;
                return booking.status === statusFilter;
            })
            .filter(booking => {
                const searchTermLower = searchTerm.toLowerCase();
                const carName = `${booking.car.manufacturerName} ${booking.car.modelName}`.toLowerCase();
                const showroomName = booking.showroom.showroomName.toLowerCase();
                return carName.includes(searchTermLower) || showroomName.includes(searchTermLower);
            });
    }, [bookings, statusFilter, searchTerm]);

    // Handlers for actions
    const handleCancelBooking = (bookingId) => {
        Swal.fire({
            title: 'Are you sure you want to cancel?',
            text: "This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, cancel it',
            cancelButtonText: 'Keep it'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const token = getToken();
                if (!token) {
                    Swal.fire('Error', 'Authentication token not found. Please log in again.', 'error');
                    return;
                }

                try {
                    const response = await fetch(`${apiBaseUrl}/api/Customer/test-drives/${bookingId}/cancel`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!response.ok) {
                        // Try to get a more specific error message from the API
                        const errorData = await response.json().catch(() => ({ message: 'Failed to cancel the booking.' }));
                        throw new Error(errorData.message || 'An unknown error occurred.');
                    }

                    // If the API call is successful
                    Swal.fire(
                        'Canceled!',
                        'Your booking has been successfully canceled.',
                        'success'
                    );

                    // Update the UI by changing the status in the local state
                    setBookings(prevBookings =>
                        prevBookings.map(booking =>
                            booking.bookingId === bookingId
                                ? { ...booking, status: 'Canceled' }
                                : booking
                        )
                    );

                } catch (error) {
                    console.error("Cancellation error:", error);
                    Swal.fire(
                        'Error!',
                        error.message,
                        'error'
                    );
                }
            }
        });
    };

    const fetchBookingDetail = async (id) => {
        const token = getToken();
        try {
            const response = await fetch(`${apiBaseUrl}/api/Customer/test-drives/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Failed to fetch details");
            const data = await response.json();
            setSelectedBooking(data);
        } catch (error) {
            Swal.fire('Error', 'Could not load booking details.', 'error');
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            'Pending': 'bg-yellow-100 text-yellow-800',
            'Confirmed': 'bg-green-100 text-green-800',
            'Canceled': 'bg-red-100 text-red-800',
            'Completed': 'bg-blue-100 text-blue-800',
        };
        return styles[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-6">My Bookings</h1>

                {/* Filter and Search Controls */}
                <div className="mb-6 p-4 bg-white rounded-lg shadow-sm flex flex-col sm:flex-row gap-4 items-center">
                    <div className="relative w-full sm:w-2/3 lg:w-1/2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by car name or showroom..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                    </div>
                    <div className="relative w-full sm:w-1/3 lg:w-auto">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Canceled">Canceled</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                </div>

                {/* Bookings Table */}
                {loading ? <LoadingSpinner /> : (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Car</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Booking Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Showroom</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredBookings.length > 0 ? (
                                        filteredBookings.map((booking) => (
                                            <tr key={booking.bookingId} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">#{booking.bookingId}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-semibold text-gray-900">{booking.car.manufacturerName} {booking.car.modelName}</div>
                                                    <div className="text-sm text-gray-500">{booking.car.year}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {new Date(booking.bookingDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{booking.showroom.showroomName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(booking.status)}`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end gap-x-4">
                                                        <button
                                                            onClick={() => fetchBookingDetail(booking.bookingId)}
                                                            className="flex items-center gap-x-1.5 px-3 py-1.5 font-semibold text-sm rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
                                                        >
                                                            <FileText size={16} />
                                                            <span>Details</span>
                                                        </button>
                                                        {booking.status === 'Pending' && (
                                                            <button
                                                                onClick={() => handleCancelBooking(booking.bookingId)}
                                                                className="flex items-center gap-x-1.5 px-3 py-1.5 font-semibold text-sm rounded-md text-red-700 bg-red-100 hover:bg-red-200 transition-colors duration-200"
                                                            >
                                                                <XCircle size={16} />
                                                                <span>Cancel</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center py-10 px-6 text-gray-500">
                                                {bookings.length === 0 ? "You haven't made any bookings yet." : "No bookings match your criteria."}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
            {selectedBooking && <BookingDetailModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />}
        </div>
    );
};

export default MyBookingsPage;