import React, { useState, useEffect } from 'react';
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import { useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { format } from 'date-fns';

const formatDate = (date) => {
  if (!date) return '-';
  return format(new Date(date), 'dd/MM/yyyy');
};

export default function TransactionDetail() {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransactionDetails();
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

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  if (!transaction) return <div className="flex items-center justify-center h-screen">Transaction not found</div>;

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar />
        <main className="p-8 bg-gray-50 min-h-screen">
          <div className="flex items-center gap-4 mb-6">
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => window.history.back()}
            >
              <FaArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              Transaction Details
            </h1>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Transaction Info */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-violet-700">Transaction Information</h3>
                <div className="space-y-4">
                  <div>
                    <div className="font-medium text-gray-600">Transaction Date</div>
                    <div className="text-gray-900">{formatDate(transaction.saleDate || transaction.SaleDate)}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-600">Status</div>
                    <div className="text-gray-900">{transaction.saleStatus || transaction.SaleStatus}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-600">Final Price</div>
                    <div className="text-gray-900">
                      {Number(transaction.finalPrice || transaction.FinalPrice).toLocaleString(undefined, { 
                        style: "currency", 
                        currency: "USD" 
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-violet-700">Customer Information</h3>
                <div className="space-y-4">
                  <div>
                    <div className="font-medium text-gray-600">Full Name</div>
                    <div className="text-gray-900">{transaction.customer?.fullName || transaction.Customer?.fullName}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-600">Email</div>
                    <div className="text-gray-900">{transaction.customer?.email || transaction.Customer?.email}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-600">Mobile</div>
                    <div className="text-gray-900">{transaction.customer?.mobile || transaction.Customer?.mobile || '-'}</div>
                  </div>
                </div>
              </div>

              {/* Car Info */}
              <div className="col-span-2">
                <h3 className="text-xl font-semibold mb-4 text-violet-700">Vehicle Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="font-medium text-gray-600">Manufacturer</div>
                    <div className="text-gray-900">{transaction.car?.Manufacturer || transaction.Car?.Manufacturer}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-600">Model</div>
                    <div className="text-gray-900">{transaction.car?.Model || transaction.Car?.Model}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-600">Year</div>
                    <div className="text-gray-900">{transaction.car?.Year || transaction.Car?.Year}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-600">Mileage</div>
                    <div className="text-gray-900">{transaction.car?.Mileage || transaction.Car?.Mileage || '-'}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-600">Color</div>
                    <div className="text-gray-900">{transaction.car?.Color || transaction.Car?.Color || '-'}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-600">Transmission</div>
                    <div className="text-gray-900">{transaction.car?.Transmission || transaction.Car?.Transmission || '-'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
