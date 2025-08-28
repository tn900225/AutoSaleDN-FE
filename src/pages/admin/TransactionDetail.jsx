import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import { FaArrowLeft, FaDownload } from "react-icons/fa"; // Changed FaPrint to FaDownload
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import html2pdf from 'html2pdf.js'; // Import html2pdf
import AdminSidebar from "../../components/admin/AdminSidebar";
import { getApiBaseUrl } from "../../../util/apiconfig";
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
  const contractRef = useRef(null); // Create a ref for the contract content
  const API_BASE = getApiBaseUrl();
  useEffect(() => {
    console.log('Component mounted, transaction ID:', id);
    fetchTransactionDetails();
    // eslint-disable-next-line
  }, [id]);

  const fetchTransactionDetails = async () => {
    try {
      console.log('Fetching transaction details for ID:', id);
      const token = localStorage.getItem('token');
      console.log('Token exists:', !!token);
      
      const response = await fetch(`${API_BASE}/api/Admin/transactions/${id}`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (response.status === 401) {
        console.log('Unauthorized, redirecting to login');
        window.location.href = "/login";
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Transaction data received:', data);
      console.log('Transaction keys:', Object.keys(data));
      
      setTransaction(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching transaction details:', err);
      setError('Failed to load transaction details: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getVal = (...keys) => {
    let val = transaction;
    for (const k of keys) {
      if (!val) return null; 
      val = val[k] || val[k.charAt(0).toUpperCase() + k.slice(1)];
    }
    if (typeof val === 'string' && val.trim() === '') return null;
    return val ?? null; 
  };

  // Function to handle PDF download
  const handleDownloadPdf = () => {
    if (contractRef.current) {
      const element = contractRef.current;
      const opt = {
        margin:       0.5, // Adjusted margin to be smaller
        filename:     `PurchaseAgreement_${transaction.saleId}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, logging: true, dpi: 192, letterRendering: true },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] } // Helps control page breaks
      };
      // Use html2pdf to generate and download the PDF
      html2pdf().set(opt).from(element).save();
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-lg text-gray-700">Loading data...</div>;
  }
  
  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-600 text-lg">{error}</div>;
  }
  
  if (!transaction) {
    return <div className="flex items-center justify-center h-screen text-gray-700 text-lg">Transaction not found.</div>;
  }

  // Helper component for detail items - kept for other sections, but main contract will use direct JSX
  const DetailItem = ({ label, value, largeText = false, highlight = false, className = '' }) => (
    <div className={`pb-4 ${className}`}>
      <p className="font-medium text-gray-600 text-sm uppercase tracking-wide">{label}:</p>
      <p className={`mt-1 ${largeText ? 'text-xl' : 'text-lg'} ${highlight ? 'text-violet-700 font-bold' : 'text-gray-900 font-semibold'}`}>
        {value}
      </p>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 px-4 sm:px-8 flex items-center justify-between bg-white border-b border-gray-200 shadow-sm print:hidden">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              className="p-2 sm:p-3 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition duration-200"
              onClick={() => window.history.back()}
              aria-label="Back"
            >
              <FaArrowLeft size={18} sm:size={20} />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 truncate">Vehicle Purchase Agreement Details</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              className="flex items-center gap-1 sm:gap-2 px-3 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 text-sm sm:text-base"
              onClick={handleDownloadPdf} // Call the new download function
            >
              <FaDownload /> <span className="hidden sm:inline">Download PDF</span> {/* Changed text and icon */}
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 py-4 sm:px-8 sm:py-8 overflow-y-auto print:p-0 print:m-0 print:shadow-none">
          {/* Assign the ref to the div that wraps the entire contract content */}
          <div ref={contractRef} className="bg-white rounded-xl p-4 sm:p-8 shadow-lg print:rounded-none print:shadow-none print:p-6 max-w-4xl mx-auto">
            <div className="text-center mb-6 sm:mb-10 border-b pb-4 sm:pb-6 border-gray-200 print:mb-6 print:pb-4">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-2 sm:mb-3 tracking-tight">VEHICLE PURCHASE AGREEMENT</h2>
              <p className="text-base sm:text-xl text-gray-600 mb-1 sm:mb-2">Agreement No: <span className="font-bold text-gray-800">{transaction.saleId}</span></p>
              <p className="text-base sm:text-xl text-gray-600">Date: <span className="font-bold text-gray-800">{formatDate(transaction.saleDate)}</span></p>
            </div>

            {/* Contract Body - Mimicking SurveyJS structure */}
            <section className="mb-6 sm:mb-10 text-base sm:text-lg text-gray-900 leading-relaxed font-semibold">
                <div className="flex flex-wrap items-baseline -mt-1 sm:-mt-2">
                    <p className="inline pr-1" style={{ lineHeight: '36px' }}>
                        This sales contract (hereinafter referred to as the "Agreement") is entered into as of
                    </p>
                    {/* date */}
                    <span className="inline-block text-gray-800 border-b border-gray-400 px-2 min-w-[100px] w-full sm:w-auto sm:flex-grow text-center" style={{ lineHeight: '36px', fontWeight:'800' }}>
                       {formatDate(transaction.saleDate)}
                    </span>
                    <p className="inline pl-1 pr-1" style={{ lineHeight: '36px' }}>
                        by and between
                    </p>
                    {/* seller-name */}
                    <span className="inline-block text-gray-800 border-b border-gray-400 px-2 min-w-[150px] w-full sm:w-auto sm:flex-grow text-center" style={{ lineHeight: '36px' , fontWeight:'800'}}>
                        {getVal("seller", "fullName")}
                    </span>
                    <p className="inline pl-1 pr-1" style={{ lineHeight: '36px' }}>
                        with a mailing address of
                    </p>
                    {/* seller-address-line-1 */}
                    <span className="inline-block text-gray-800 border-b border-gray-400 px-2 min-w-[64px] w-full sm:w-auto sm:flex-grow text-center" style={{ lineHeight: '36px', fontWeight:'800' }}>
                        {getVal("seller", "province")}
                    </span>
                    <span className="inline-block w-full text-gray-800 px-2" style={{ lineHeight: '36px' }}>
                        {/* seller-address-line-2 (if available, add another line for address details) */}
                    </span>
                </div>
                <div className="flex flex-wrap items-baseline -mt-1 sm:-mt-2">
                    <p className="inline pr-1" style={{ lineHeight: '36px' }}>
                        (hereinafter referred to as the "Seller") and
                    </p>
                    {/* buyer-name */}
                    <span className="inline-block text-gray-800 border-b border-gray-400 px-2 min-w-[150px] w-full sm:w-auto sm:flex-grow text-center" style={{ lineHeight: '36px', fontWeight:'800' }}>
                        {getVal("customer", "fullName")}
                    </span>
                    <p className="inline pl-1 pr-1" style={{ lineHeight: '36px' }}>
                        with a mailing address of
                    </p>
                    {/* buyer-address-line-1 */}
                    <span className="inline-block text-gray-800 border-b border-gray-400 px-2 min-w-[64px] w-full sm:w-auto sm:flex-grow text-center" style={{ lineHeight: '36px', fontWeight:'800' }}>
                        {getVal("customer", "province")}
                    </span>
                    <span className="inline-block w-full text-gray-800 px-2" style={{ lineHeight: '36px' }}>
                        {/* buyer-address-line-2 (if available) */}
                    </span>
                </div>
                <p className="mt-2" style={{ lineHeight: '42px', marginBottom: '30px', marginTop: '-8px' }}>
                    (hereinafter referred to as the "Buyer"), collectively referred to as the "Parties", both
                    of whom agree to be bound by this Agreement.
                </p>

                <p style={{ lineHeight: '36px' }}>
                    The Seller is the manufacturer and distributor of the following product(s):
                </p>
                {/* goods */}
                <div className="border-b border-gray-400 py-2 mt-1 px-2 min-h-[40px] text-gray-800 whitespace-pre-line" style={{fontWeight:'800'}}>
                    {getVal("car", "manufacturer")} {getVal("car", "model")} ({getVal("car", "year")}), VIN: {getVal("car", "vin")}
                    <br/>
                    Condition: {getVal("car", "condition")}
                    <br/>
                    Transmission: {getVal("car", "transmission")}
                    <br/>
                    Seating Capacity: {getVal("car", "seatingCapacity")} seats
                    <br/>
                    Fuel Type: {getVal("car", "fuelType")}
                </div>
                <p className="mt-2" style={{ lineHeight: '42px', marginBottom: '30px', marginTop: '-8px' }}>
                    (hereinafter referred to as the "Goods").
                    <br />
                    The Buyer wishes to purchase the aforementioned product(s).
                </p>

                <p style={{ lineHeight: '42px', marginBottom: '-8px', marginTop: '-8px' }}>
                    <span className="font-bold">THEREFORE, the Parties agree as follows:</span>
                    <br />
                    <span className="font-bold">1. Sale of Goods.</span> The Seller shall make available for sale, and the Buyer shall purchase the Goods.
                    <br />
                    <span className="font-bold">2. Delivery and Shipping.</span>
                </p>
                {/* delivery-details */}
                <div className="border-b border-gray-400 py-2 mt-1 px-2 min-h-[40px] text-gray-800 whitespace-pre-line" >
                    Delivery will be arranged to: <span style={{fontWeight:'800'}}>{getVal("customer", "province")}</span>.
                    <br/>
                    Pickup/Sale Location: <span style={{fontWeight:'800'}}>{getVal("car", "location", "name")}</span> at <span style={{fontWeight:'800'}}>{getVal("car", "location", "address")}</span>.
                </div>

                <p style={{ lineHeight: '42px', marginBottom: '-8px', marginTop: '-8px' }}>
                    <span className="font-bold">3. Purchase Price and Payments.</span>
                </p>
                <div className="flex flex-wrap items-baseline -mt-1 sm:-mt-2">
                    <p className="inline pr-1" style={{ lineHeight: '36px' }}>
                        The Seller agrees to sell the Goods to the Buyer for
                    </p>
                    {/* price */}
                    <span className="inline-block text-gray-800 border-b border-gray-400 px-2 min-w-[64px] w-full sm:w-auto sm:flex-grow text-center" style={{ lineHeight: '36px',fontWeight:'800' }}>
                        {Number(transaction.finalPrice).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </span>
                    <p className="inline pl-1 pr-1" style={{ lineHeight: '36px' }}>
                        VND.
                    </p>
                </div>
                <p style={{ lineHeight: '42px', marginBottom: '-8px', marginTop: '-8px' }}>
                    The Seller will provide an invoice to the Buyer at the time of delivery or pick-up.
                </p>
                <div className="flex flex-wrap items-baseline -mt-1 sm:-mt-2">
                    <p className="inline pr-1" style={{ lineHeight: '36px' }}>
                        All invoices must be paid, in full, within
                    </p>
                    {/* terms */}
                    <span className="inline-block text-gray-800 border-b border-gray-400 px-2 min-w-[64px] w-full sm:w-[64px] text-center" style={{ lineHeight: '36px',fontWeight:'800' }}>
                        30 {/* Example value, replace if you have this in transaction data */}
                    </span>
                    <p className="inline pl-1 pr-1" style={{ lineHeight: '36px' }}>
                        days.
                    </p>
                </div>
                <div className="flex flex-wrap items-baseline -mt-1 sm:-mt-2">
                    <p className="inline pr-1" style={{ lineHeight: '36px' }}>
                        Any balances not paid within
                    </p>
                    {/* grace-period */}
                    <span className="inline-block text-gray-800 border-b border-gray-400 px-2 min-w-[48px] w-full sm:w-[48px] text-center" style={{ lineHeight: '36px' ,fontWeight:'800'}}>
                        7 {/* Example value */}
                    </span>
                    <p className="inline pl-1 pr-1" style={{ lineHeight: '36px' }}>
                        days will be subject to a
                    </p>
                    {/* penalty-percentage */}
                    <span className="inline-block text-gray-800 border-b border-gray-400 px-2 min-w-[48px] w-full sm:w-[48px] text-center" style={{ lineHeight: '36px' ,fontWeight:'800'}}>
                        5 {/* Example value */}
                    </span>
                    <p className="inline pl-1 pr-1" style={{ lineHeight: '36px' }}>
                        % late payment penalty.
                    </p>
                </div>

                <p style={{ lineHeight: '42px', marginBottom: '0px', marginTop: '-8px' }}>
                    <span className="font-bold">4. Inspection of Goods and Rejection.</span> The Buyer is entitled to inspect the Goods promptly upon delivery or receipt. The Buyer shall have a reasonable period, not exceeding
                </p>
                <div className="flex flex-wrap items-baseline">
                    {/* inspect-period */}
                    <span className="inline-block text-gray-800 border-b border-gray-400 px-2 min-w-[64px] w-full sm:w-[64px] text-center" style={{ lineHeight: '36px' ,fontWeight:'800'}}>
                        3 {/* Example value */}
                    </span>
                    <p className="inline pl-1" style={{ lineHeight: '36px' }}>
                        days, from the date of delivery to thoroughly inspect the Goods and
                    </p>
                </div>
                <p className="mt-2" style={{ lineHeight: '42px', marginBottom: '16px' }}>
                    ensure they conform to the specifications and quality agreed upon in this Agreement. If the Goods do not meet the agreed-upon standards or are found to be damaged, the Buyer has the right to reject the Goods.
                </p>
            </section>
            
            {/* Signatures */}
            <section className="mt-10 sm:mt-16 pt-4 sm:pt-8 border-t border-gray-200 print:mt-8 print:pt-4">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">SIGNATURES</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 print:grid-cols-3 print:gap-4">
                {/* Seller Signature */}
                <div className="text-center flex flex-col items-center">
                  <p className="font-medium text-gray-600 text-base sm:text-lg mb-3 sm:mb-4">SELLER</p>
                  <div className="w-full h-24 sm:h-32 border-b-2 border-dashed border-gray-400 flex items-center justify-center relative bg-gray-50 rounded-md overflow-hidden print:h-24 print:bg-transparent">
                    {transaction.saleStatus === 'Completed' && getVal("seller", "signature") ? (
                      <img 
                        src={getVal("seller", "signature")} 
                        alt="Seller Signature" 
                        className="w-full h-full object-contain p-1 sm:p-2"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm italic">Seller signed</span>
                    )}
                  </div>
                  <p className="text-base sm:text-lg text-gray-900 font-bold mt-3 sm:mt-4">{getVal("seller", "fullName")}</p>
                </div>

                {/* Buyer Signature */}
                <div className="text-center flex flex-col items-center">
                  <p className="font-medium text-gray-600 text-base sm:text-lg mb-3 sm:mb-4">BUYER</p>
                  <div className="w-full h-24 sm:h-32 border-b-2 border-dashed border-gray-400 flex items-center justify-center relative bg-gray-50 rounded-md overflow-hidden print:h-24 print:bg-transparent">
                    {transaction.saleStatus === 'Completed' && getVal("customer", "signature") ? (
                      <img 
                        src={getVal("customer", "signature")} 
                        alt="Buyer Signature" 
                        className="w-full h-full object-contain p-1 sm:p-2"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm italic">Buyer signed</span>
                    )}
                  </div>
                  <p className="text-base sm:text-lg text-gray-900 font-bold mt-3 sm:mt-4">{getVal("customer", "fullName")}</p>
                </div>

                {/* Witness Signature */}
                <div className="text-center flex flex-col items-center">
                  <p className="font-medium text-gray-600 text-base sm:text-lg mb-3 sm:mb-4">WITNESS</p>
                  <div className="w-full h-24 sm:h-32 border-b-2 border-dashed border-gray-400 flex items-center justify-center bg-gray-50 rounded-md print:h-24 print:bg-transparent">
                    <span className="text-gray-400 text-sm italic">WITNESS signed</span>
                  </div>
                  <p className="text-base sm:text-lg text-gray-900 font-bold mt-3 sm:mt-4">AutoSaleDN</p>
                </div>
              </div>
            </section>
            
            <footer className="mt-10 sm:mt-16 text-center text-gray-500 text-xs sm:text-sm print:mt-8 print:text-xs">
              <p>This agreement is made in two (02) copies of equal legal value, with each party retaining one (01) copy.</p>
              <p className="mt-1 sm:mt-2">&copy; {new Date().getFullYear()} AutoSaleDN Company. All rights reserved.</p>
            </footer>

          </div>
        </main>
      </div>
    </div>
  );
}