import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  HeartIcon,
  PhotoIcon,
  MapPinIcon,
  BoltIcon,
  CalendarDaysIcon,
  ArrowPathIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/solid';
import { useWishlist } from '../hooks/useWishlist';

const getSaleStatusDisplay = (status) => {
  if (!status) return "Available";
  switch (status) {
    case "Available":
    case "Pending Deposit": return "Available";
    case "Sold": return "Sold";
    case "On Hold": return "On Hold";
    case "Deposit Paid":
    case "Pending Full Payment": return "Deposit Paid";
    default: return status;
  }
};

const getStatusBadgeClass = (status) => {
  const displayStatus = getSaleStatusDisplay(status);
  switch (displayStatus) {
    case "Sold": return 'bg-red-500';
    case "On Hold":
    case "Deposit Paid": return 'bg-orange-500';
    case "Available": return 'bg-green-500';
    default: return 'bg-gray-500';
  }
};

export default function CarCard({ car }) {
  const navigate = useNavigate();
  const { wishlistItems, addCarToWishlist, removeCarFromWishlist } = useWishlist();
  const isWishlisted = wishlistItems.includes(car.listingId);

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (isWishlisted) {
      removeCarFromWishlist(car.listingId);
    } else {
      addCarToWishlist(car.listingId);
    }
  };

  const firstSpec = car.specification && car.specification.length > 0 ? car.specification[0] : {};
  const priceWithoutVat = car.price - (car.pricing && car.pricing.length > 0 ? car.pricing[0].taxRate : 0);
  const statusToDisplay = getSaleStatusDisplay(car.currentSaleStatus);
  const statusBadgeClass = getStatusBadgeClass(car.currentSaleStatus);

  return (
          <div data-testid="feature.car.card" className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 group flex flex-col md:flex-row">
      <button
        type="button"
        onClick={() => navigate(`/cars/${car.listingId}`)}
        className="flex-shrink-0 w-full md:w-[320px] relative block text-left p-0 m-0 border-none bg-none focus:outline-none cursor-pointer"
        data-car-id={car.listingId}
        style={{ all: "unset", cursor: "pointer" }}
      >
        <div className="w-full h-[220px] md:h-[240px] overflow-hidden relative bg-[#e9ecfa]">
          <div className="absolute top-3 right-3 z-10">
            <button
              type="button"
              onClick={handleWishlistToggle}
              className={`rounded-full p-2 shadow-md flex items-center justify-center transition-colors duration-200
                ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-[#3452e1]'}
                hover:bg-red-500 hover:text-white`}
            >
              <HeartIcon className="w-6 h-6" />
            </button>
          </div>
          <img
            alt={`${car.model.manufacturer.name} ${car.model.name} image`}
            src={car.images[0]?.url || "/images/no-image.png"}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            decoding="async"
          />
          <div data-testid="carousel-photo-count-badge" className="absolute bottom-3 left-3 bg-white/90 rounded-full px-3 py-1 flex items-center gap-1 text-[#3452e1] font-bold text-xs shadow">
            <PhotoIcon className="w-4 h-4" />
            <p>{car.images?.length || 0}</p>
          </div>
        </div>
      </button>
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <div className="mb-4">
            <h4 className="text-[#253887] text-2xl font-extrabold flex items-center gap-2" data-testid="feature.car.card_serp_row_title">
              <Link to={`/cars/${car.listingId}`} className="hover:text-blue-600 transition-colors">
                {car.model.manufacturer.name} {car.model.name}
              </Link>
              {statusToDisplay && (
                <span className={`px-2 py-1 rounded-full text-white font-semibold text-xs ${statusBadgeClass}`}>
                  {statusToDisplay}
                </span>
              )}
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 text-[#253887] text-base font-medium mb-4">
            <span className="flex items-center gap-2">
              <BoltIcon className="w-5 h-5 text-[#3452e1]" />
              <span className="font-bold">{firstSpec.engine || 'N/A'}</span>
            </span>
            <span className="flex items-center gap-2">
              <CalendarDaysIcon className="w-5 h-5 text-[#3452e1]" />
              <span className="font-bold">{car.year}</span>
            </span>
            <span className="flex items-center gap-2">
              <ArrowPathIcon className="w-5 h-5 text-[#3452e1]" />
              <span className="font-bold">{car.mileage.toLocaleString()} km</span>
            </span>
            <span className="flex items-center gap-2">
              <Cog6ToothIcon className="w-5 h-5 text-[#3452e1]" />
              <span className="font-bold">{firstSpec.transmission || 'N/A'}</span>
            </span>
            <span className="flex items-center gap-2">
              <BoltIcon className="w-5 h-5 text-[#3452e1]" />
              <span className="font-bold">{firstSpec.fuelType || 'N/A'}</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {(car.features || []).slice(0, 5).map(f => (
              <span key={f.featureId} className="bg-[#e9ecfa] text-[#3452e1] rounded-full px-3 py-1 text-sm font-medium">
                {f.name}
              </span>
            ))}
            {car.features && car.features.length > 5 &&
              <span className="bg-[#e9ecfa] text-[#3452e1] rounded-full px-3 py-1 text-sm font-medium">
                +{car.features.length - 5} more
              </span>
            }
          </div>
          <div className="flex flex-col gap-y-2 mt-4 text-sm font-medium">
            {car.showrooms && car.showrooms.length > 0 ? (
              car.showrooms.map((showroom) => (
                <div key={showroom.storeLocationId} className="flex flex-col text-[#253887] mt-2">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="w-5 h-5 text-[#3452e1]" />
                    <span className="leading-snug">
                      {showroom.name}
                      <br />
                      [{showroom.address}]
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <span className="flex items-center gap-2 text-[#253887]">
                <MapPinIcon className="w-5 h-5 text-[#3452e1]" />
                Unknown Location
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end mt-4">
          <h4 className="text-3xl font-bold text-[#253887]">
            ₫{car.price.toLocaleString('vi-VN')}
          </h4>
          <div className="text-sm text-gray-500 font-medium">
            ₫{priceWithoutVat.toLocaleString('vi-VN')} <span className="text-[#3452e1]">without VAT</span>
          </div>
        </div>
      </div>
    </div>

  );
}