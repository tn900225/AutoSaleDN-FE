import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaEdit, FaTrash, FaEye, FaCheck, FaTimes, FaUser, FaCar } from "react-icons/fa";
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import AdminSidebar from "../../components/admin/AdminSidebar";

const formatDate = (date) => {
  if (!date) return '-';
  try {
    return format(new Date(date), 'dd/MM/yyyy');
  } catch {
    return '-';
  }
};

export default function TransactionDetail() {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransactionDetails();
    // eslint-disable-next-line
  }, [id]);

  const fetchTransactionDetails = async () => {
    try {
      const response = await fetch(`/api/Admin/transactions/${id}`, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
      });
      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }
      const data = await response.json();
      setTransaction(data);
      setError(null);
    } catch (err) {
      setError('Failed to load transaction details');
    } finally {
      setLoading(false);
    }
  };

  const getVal = (...keys) => {
    let val = transaction;
    for (const k of keys) {
      if (!val) return "-";
      val = val[k] || val[k.charAt(0).toUpperCase() + k.slice(1)];
    }
    return val ?? "-";
  };

  const getTransactionRole = () => {
    if (transaction?.role) return transaction.role;
    if (transaction?.customer?.role) return transaction.customer.role;
    if (transaction?.Customer?.role) return transaction.Customer.role;
    return "Customer";
  };

  const getImages = () => {
    let imgs = getVal("car", "images") || getVal("Car", "images");
    if (!imgs && getVal("car", "image") !== "-") imgs = [getVal("car", "image")];
    if (!Array.isArray(imgs)) imgs = [];
    return imgs;
  };

  const getCarInfo = () => {
    const car = transaction?.car || transaction?.Car || {};
    return {
      manufacturer: car.Manufacturer ?? car.manufacturer ?? "-",
      model: car.Model ?? car.model ?? "-",
      year: car.Year ?? car.year ?? "-",
      mileage: car.Mileage ?? car.mileage ?? "-",
      price: car.Price ?? car.price ?? "-",
      location: car.Location ?? car.location ?? "-",
      condition: car.Condition ?? car.condition ?? "-",
      rentSell: car.RentSell ?? car.rentSell ?? "-",
      color: car.Color ?? car.color ?? "-",
      transmission: car.Transmission ?? car.transmission ?? "-",
      vin: car.Vin ?? car.vin ?? "-",
      description: car.Description ?? car.description ?? "-",
      certified: car.Certified ?? car.certified ?? undefined,
      images: car.Images ?? car.images ?? [],
    };
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  if (!transaction) return <div className="flex items-center justify-center h-screen">Transaction not found</div>;

  const carInfo = getCarInfo();
  const images = getImages().length > 0 ? getImages() : (carInfo.images || []);

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 px-8 flex items-center justify-between bg-white border-b">
          <div className="flex items-center w-full max-w-md relative">
            <input
              type="text"
              placeholder="Search or type"
              className="w-full px-12 py-2 border rounded-lg bg-gray-50 outline-none"
            />
            <span className="absolute left-4 text-gray-400">
              <svg width="18" height="18" fill="none" stroke="currentColor"><circle cx="8" cy="8" r="7" strokeWidth="2"/><path d="M16 16l-3.5-3.5" strokeWidth="2" strokeLinecap="round"/></svg>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700">
              <FaArrowLeft size={20} />
            </button>
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white flex items-center justify-center">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="profile" />
            </div>
          </div>
        </header>
        {/* Content */}
        <main className="flex-1 px-8 py-8 overflow-y-auto">
          <div className="flex items-center gap-4 mb-8">
            <button
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              onClick={() => window.history.back()}
              aria-label="Back"
            >
              <FaArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              Transaction Details
            </h1>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-sm font-semibold border border-violet-300">
                {getTransactionRole()}
              </span>
              <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700">
                <FaEye size={18} title="View Details" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700">
                <FaEdit size={18} title="Edit Transaction" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700">
                <FaTrash size={18} title="Delete Transaction" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Transaction Info */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <FaCheck className="text-green-500" size={20} />
                <h3 className="text-lg font-bold text-gray-800">Transaction Information</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">Date:</span>
                  <span className="text-gray-900">{formatDate(transaction.saleDate || transaction.SaleDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">Status:</span>
                  <span className="text-gray-900">{transaction.saleStatus || transaction.SaleStatus}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">Price:</span>
                  <span className="text-violet-600 font-semibold">
                    {Number(transaction.finalPrice || transaction.FinalPrice).toLocaleString(undefined, { style: "currency", currency: "USD" })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">Created:</span>
                  <span className="text-gray-900">{formatDate(transaction.createdAt || transaction.CreatedAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">Updated:</span>
                  <span className="text-gray-900">{formatDate(transaction.updatedAt || transaction.UpdatedAt)}</span>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <FaUser className="text-blue-500" size={20} />
                <h3 className="text-lg font-bold text-gray-800">Customer Information</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">Name:</span>
                  <span className="text-gray-900">{getVal("customer", "fullName")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">Email:</span>
                  <span className="text-gray-900">{getVal("customer", "email")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">Phone:</span>
                  <span className="text-gray-900">{getVal("customer", "mobile")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">Role:</span>
                  <span className="text-gray-900">{getTransactionRole()}</span>
                </div>
              </div>
            </div>

            {/* Car Info */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <FaCar className="text-orange-500" size={20} />
                <h3 className="text-lg font-bold text-gray-800">Vehicle Information</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">Make:</span>
                  <span className="text-gray-900">{carInfo.manufacturer}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">Model:</span>
                  <span className="text-gray-900">{carInfo.model}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">Year:</span>
                  <span className="text-gray-900">{carInfo.year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">Mileage:</span>
                  <span className="text-gray-900">{carInfo.mileage}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">Price:</span>
                  <span className="text-violet-600 font-semibold">{carInfo.price}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Car Info Full */}
          <div className="bg-white rounded-xl p-8 flex flex-col md:flex-row gap-8 mb-10">
            <div className="flex-shrink-0 w-full md:w-60">
              <div className="font-bold mb-4 text-violet-700 text-lg">Vehicle Images</div>
              {images.length > 0 ? (
                <div className="flex flex-row md:flex-col gap-2 md:gap-2">
                  {images.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Car image ${idx + 1}`}
                      className="rounded-xl w-28 h-20 md:w-56 md:h-32 object-cover border border-gray-200 shadow-sm"
                      style={{objectFit: 'cover'}}
                    />
                  ))}
                </div>
              ) : (
                <div className="w-56 h-32 flex items-center justify-center bg-gray-100 text-gray-400 rounded-xl border">
                  No Images
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="font-bold mb-4 text-violet-700 text-lg">Vehicle Information</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Manufacturer: </span>
                  <span className="text-gray-900">{carInfo.manufacturer}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Model: </span>
                  <span className="text-gray-900">{carInfo.model}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Year: </span>
                  <span className="text-gray-900">{carInfo.year}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Mileage: </span>
                  <span className="text-gray-900">{carInfo.mileage}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Price (listed): </span>
                  <span className="text-gray-900">{carInfo.price ? Number(carInfo.price).toLocaleString(undefined, { style: "currency", currency: "USD" }) : '-'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">VIN: </span>
                  <span className="text-gray-900">{carInfo.vin}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Location: </span>
                  <span className="text-gray-900">{carInfo.location}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Condition: </span>
                  <span className="text-gray-900">{carInfo.condition}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Type: </span>
                  <span className="text-gray-900">{carInfo.rentSell}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Certified: </span>
                  <span className="text-gray-900">{carInfo.certified === 1 ? "Yes" : carInfo.certified === 0 ? "No" : "-"}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Color: </span>
                  <span className="text-gray-900">{carInfo.color}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Transmission: </span>
                  <span className="text-gray-900">{carInfo.transmission}</span>
                </div>
              </div>
              <div className="mt-4 text-sm">
                <div className="font-medium text-gray-600">Description</div>
                <div className="text-gray-900 whitespace-pre-line">{carInfo.description}</div>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}