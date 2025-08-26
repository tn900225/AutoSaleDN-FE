// src/pages/PurchaseTermsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
// import PrePurchaseFormModal from "../components/PrePurchaseFormModal"; // Không cần import modal nữa

const formatCurrency = (num) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(num);

export default function PurchaseTermsPage() {
  const { carId } = useParams(); // Get carId from URL
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false); // New state for checkbox
  // const [showPrePurchaseModal, setShowPrePurchaseModal] = useState(false); // Không cần state này nữa

  useEffect(() => {
    const fetchCarDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/User/cars/${carId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const carData = await response.json();
        let taxRateValue = 0.085; // Default value

        if (carData.pricing && carData.pricing[0] && typeof carData.pricing[0].taxRate === 'number') {
            taxRateValue = carData.pricing[0].taxRate;
            // Normalize taxRate: If it's a value like 8.5 (for 8.5%), divide by 100
            if (taxRateValue > 1) {
                taxRateValue = taxRateValue / 100;
            }
        }
        const mappedCar = {
            id: carData.listingId,
            model: {
                name: carData.model?.name || "Unknown Model",
                manufacturer: {
                    name: carData.model?.manufacturer?.name || "Unknown Manufacturer",
                },
            },
            price: carData.price,
            pricing: carData.pricing?.[0]
                ? {
                    registrationFee: carData.pricing[0].registrationFee || 0,
                    dealerFee: 500,
                    taxRate: taxRateValue
                }
                : { registrationFee: 0, dealerFee: 500, taxRate: 0.085 },
            showrooms: carData.showrooms?.map(s => ({
              id: s.storeLocationId,
              name: s.name,
              address: s.address,
              phone: s.Phone || "+1 (555) 123-4567"
            })) || [],
            sellerInfo: carData.sellerInfo || { name: "Auto Sales Inc.", contact: "sales@autosales.com" },
        };
        setCar(mappedCar);
      } catch (err) {
        setError(`Failed to load car details: ${err.message}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (carId) {
      fetchCarDetails();
    }
  }, [carId]);

  // Hàm xử lý khi người dùng đồng ý và muốn tiến hành thanh toán
  const handleAcceptAndProceed = async () => {
    if (!agreedToTerms) {
        Swal.fire({
            icon: "warning",
            title: "Terms Not Agreed",
            text: "Please accept the terms and conditions to proceed.",
            confirmButtonText: "Understood",
            confirmButtonColor: "#3B82F6",
        });
        return;
    }

    if (!car) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Car details not loaded. Please try again.",
        });
        return;
    }
    
    navigate(`/cars/${car.id}/confirm-orders`, { state: { car: car, showrooms: car.showrooms } });
  };

  const handleDecline = () => {
    navigate(`/cars/${carId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-opacity-75"></div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-red-600 text-lg">{error || "Car data not available."}</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 text-center">
            Terms and Conditions of Vehicle Purchase
          </h1>
          <p className="text-lg text-gray-700 mb-8 text-center">
            Please read the following terms carefully before proceeding with the purchase of the{" "}
            <span className="font-semibold">{car.model.manufacturer.name} {car.model.name}</span>.
          </p>

          <div className="prose max-w-none text-gray-700 space-y-4 mb-10">
            {/* Terms and Conditions */}
            <h3>1. Pricing and Payment</h3>
            <p>The listed vehicle price is {formatCurrency(car.price)}. This price does not include related fees such as registration fees, dealer fees, and taxes.</p>
            <p>The estimated total transaction value is: <span className="font-semibold">{formatCurrency(car.price + (car.pricing.registrationFee || 0) + (car.pricing.dealerFee || 0) + Math.round(car.price * (car.pricing.taxRate || 0.085)))}</span>. The customer is responsible for full payment of these fees.</p>
            <p>Payment methods include cash payment, bank financing, or leasing. Details on financing options will be provided separately upon request.</p>

            <h3>2. Vehicle Condition</h3>
            <p>The vehicle is sold "as-is". Customers have the right to thoroughly inspect the vehicle before purchase. Any existing defects or damages have been disclosed or can be inspected at the showroom.</p>
            <p>We commit to providing the most accurate information regarding the vehicle's maintenance history and condition.</p>

            <h3>3. Customer Rights and Responsibilities</h3>
            <ul>
              <li>Customers have the right to request vehicle documents, maintenance history, and any related information.</li>
              <li>Customers are responsible for providing accurate and complete personal information to finalize the purchase process.</li>
              <li>Upon signing the contract and payment, vehicle ownership will be transferred to the customer in accordance with legal regulations.</li>
            </ul>

            <h3>4. Return and Refund Policy</h3>
            <p>Due to the nature of the product being a used vehicle, we do not apply a return or refund policy after the transaction has been completed and the vehicle has been handed over, unless there is a separate agreement or mandatory legal provision.</p>

            <h3>5. Warranty</h3>
            <p>The vehicle may be covered by a remaining manufacturer's warranty or an extended dealer warranty (if applicable). Please ask our sales staff for more details on the specific warranty policy for each vehicle.</p>
            <p>Any issues arising after purchase and falling outside the warranty scope will be the customer's responsibility.</p>

            <h3>6. Information Security</h3>
            <p>Customer personal information will be kept strictly confidential and used only for the purpose of completing the purchase transaction and related services.</p>

            <h3>7. Dispute Resolution</h3>
            <p>Any disputes arising during the transaction process will be resolved in a cooperative spirit. If an agreement cannot be reached, both parties may bring the matter to a competent court for resolution.</p>
          </div>

          {/* Checkbox "I agree" */}
          <div className="flex items-center justify-center mb-6">
            <input
              type="checkbox"
              id="agree-terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="agree-terms" className="ml-3 text-lg font-medium text-gray-900">
              I agree to the terms and conditions
            </label>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <button
              onClick={handleAcceptAndProceed}
              // Button is disabled if agreedToTerms is false
              disabled={!agreedToTerms}
              className={`font-bold py-3 px-8 rounded-xl shadow-md transition-all duration-200 ${
                agreedToTerms
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Proceed to Payment
            </button>
            <button
              onClick={handleDecline}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-8 rounded-xl shadow-md transition-all duration-200"
            >
              Cancel and Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}