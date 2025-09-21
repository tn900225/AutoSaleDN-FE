// src/components/CarPageMain.jsx

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowUpIcon,
  HeartIcon,
  PhotoIcon,
  MapPinIcon,
  ChevronDownIcon,
  BoltIcon,
  CalendarDaysIcon,
  ArrowPathIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/solid';
import { useWishlist } from '../hooks/useWishlist';

function getPagination(currentPage, totalPages, delta = 2) {
  const pages = [];
  if (totalPages > 0) {
    pages.push(1);
  }

  if (currentPage - delta > 2 && totalPages > 6) {
    pages.push('...');
  }

  for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
    pages.push(i);
  }

  if (currentPage + delta < totalPages - 1 && totalPages > 6) {
    pages.push('...');
  }

  if (totalPages > 1 && !pages.includes(totalPages)) {
    pages.push(totalPages);
  }

  return [...new Set(pages)].sort((a, b) => {
    if (a === '...' && b !== '...') return 1;
    if (b === '...' && a !== '...') return -1;
    if (a === '...' && b === '...') return 0;
    return a - b;
  });
}

export default function CarPageMain({
  cars,
  loading,
  totalResults,
  totalPages,
  currentPage,
  onPageChange,
  sortBy,
  onSortChange,
}) {
  const navigate = useNavigate();
  const { wishlistItems, addCarToWishlist, removeCarFromWishlist } = useWishlist();

  const getSaleStatusDisplay = (status) => {
    if (!status) {
      return "Available";
    }
    switch (status) {
      case "Available":
      case "Pending Deposit":
        return "Available";
      case "Sold":
        return "Sold";
      case "On Hold":
        return "On Hold";
      case "Deposit Paid":
      case "Pending Full Payment":
        return "Deposit Paid";
      case "Refunded":
      case "Cancelled":
        return "Available";
      default:
        return status;
    }
  };

  const getStatusBadgeClass = (status) => {
    const displayStatus = getSaleStatusDisplay(status);
    switch (displayStatus) {
      case "Sold":
        return 'bg-red-500';
      case "On Hold":
      case "Deposit Paid":
        return 'bg-orange-500';
      case "Available":
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleWishlistToggle = (carId, isWishlisted) => {
    if (isWishlisted) {
      removeCarFromWishlist(carId);
    } else {
      addCarToWishlist(carId);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[300px]">
        <span className="text-[#3452e1] text-lg font-bold">Loading cars...</span>
      </div>
    );
  }

  if (!cars || cars.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[300px]">
        <span className="text-[#253887] text-lg font-bold">No cars found matching your criteria.</span>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <h2 className="text-4xl font-extrabold text-[#253887] mb-6">Verified Cars</h2>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-6">
          <span className="font-semibold text-[#253887] text-xl">
            <span className="font-extrabold">{totalResults.toLocaleString()}</span> results
          </span>
          <div className="relative">
            <label htmlFor="sort-by" className="sr-only">Sort By</label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="appearance-none pr-8 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base font-semibold text-[#253887] cursor-pointer"
            >
              <option value="newest">Newest Ads</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="mileage-asc">Mileage: Low to High</option>
              <option value="mileage-desc">Mileage: High to Low</option>
              <option value="year-asc">Year: Oldest First</option>
              <option value="year-desc">Year: Newest First</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#253887]">
              <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {cars.map(car => {
          const firstSpec = car.specifications && car.specifications.length > 0 ? car.specifications[0] : {};
          const isWishlisted = wishlistItems.includes(car.listingId);
          const statusToDisplay = getSaleStatusDisplay(car.currentSaleStatus);
          const statusBadgeClass = getStatusBadgeClass(car.currentSaleStatus);

          return (
            <div key={car.listingId} data-testid="feature.car.card" className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 group flex flex-col md:flex-row">
              <button
                type="button"
                onClick={() => navigate(`/cars/${car.listingId}`)}
                className="flex-shrink-0 w-full md:w-[320px] relative block"
                aria-label={`View details for ${car.model.manufacturer.name} ${car.model.name}`}
              >
                <div className="w-full aspect-[4/3] overflow-hidden relative bg-[#e9ecfa]">
                  <div className="absolute top-3 right-3 z-10">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleWishlistToggle(car.listingId, isWishlisted);
                      }}
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
                    onError={(e) => {
                      e.target.src = "/images/no-image.png";
                    }}
                  />

                  <div
                    data-testid="carousel-photo-count-badge"
                    className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 text-[#3452e1] font-bold text-xs shadow-lg"
                  >
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
                        <div
                          key={showroom.storeLocationId}
                          className="flex flex-col text-[#253887] mt-2"
                        >
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
                    {car.price.toLocaleString('vi-VN')} ₫
                  </h4>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-[#f4f6fc] py-6 px-4 mt-10 rounded-lg shadow-inner">
          <button
            type="button"
            className="flex items-center gap-2 text-[#3452e1] hover:underline font-bold bg-transparent border-none outline-none focus:outline-none active:outline-none select-none transition"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            tabIndex={0}
          >
            <ArrowUpIcon className="w-5 h-5 text-[#3452e1]" />
            <span className="text-[#3452e1] font-bold">Back to top</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`w-10 h-10 rounded-full bg-[#3452e1] text-white font-bold flex items-center justify-center transition ${currentPage === 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-[#253887] focus:ring-2 focus:ring-[#3452e1] focus:ring-offset-2"}`}
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            {getPagination(currentPage, totalPages).map((p, i) =>
              p === '...' ? (
                <span key={i} className="px-2 text-[#253887] text-lg font-semibold">...</span>
              ) : (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`w-10 h-10 rounded-full border text-lg font-bold transition-all duration-200
                    ${currentPage === p
                      ? "bg-[#3452e1] text-white border-[#3452e1] shadow-md"
                      : "bg-white text-[#3452e1] border-gray-300 hover:bg-[#e9ecfa] hover:border-[#3452e1]"
                    } focus:ring-2 focus:ring-[#3452e1] focus:ring-offset-2`}
                  aria-current={currentPage === p ? "page" : undefined}
                >
                  {p}
                </button>
              )
            )}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`w-10 h-10 rounded-full bg-[#3452e1] text-white font-bold flex items-center justify-center transition ${currentPage === totalPages ? "opacity-40 cursor-not-allowed" : "hover:bg-[#253887] focus:ring-2 focus:ring-[#3452e1] focus:ring-offset-2"}`}
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}