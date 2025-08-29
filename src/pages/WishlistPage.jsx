import React, { useState, useEffect } from 'react';
import { useWishlist } from '../hooks/useWishlist';
import { useNavigate } from 'react-router-dom';
import CarCard from '../components/CarCard';
import { getApiBaseUrl } from "../../util/apiconfig";
import { ArrowUpIcon, HeartIcon } from '@heroicons/react/24/solid';

const API_BASE = getApiBaseUrl();

const fetchCarsByIds = async (carIds) => {
  if (carIds.length === 0) {
    console.log("fetchCarsByIds: No car IDs to fetch. Returning an empty array.");
    return [];
  }

  console.log("fetchCarsByIds: Fetching details for car IDs:", carIds);

  try {
    // Create an array of fetch promises for each car ID
    const promises = carIds.map(async (carId) => {
      console.log(`fetchCarsByIds: Fetching car with ID: ${carId}`);
      const carResponse = await fetch(`${API_BASE}/api/User/cars/${carId}`);
      if (!carResponse.ok) {
        // Throw an error if the response is not successful
        throw new Error(`HTTP error! Status: ${carResponse.status} for carId: ${carId}`);
      }
      const carData = await carResponse.json();
      console.log(`fetchCarsByIds: Successfully fetched data for car ID: ${carId}`, carData);
      return carData;
    });

    // Wait for all promises to resolve and return the array of car data
    const cars = await Promise.all(promises);
    console.log("fetchCarsByIds: All car data fetched successfully.", cars);
    return cars;
  } catch (error) {
    console.error("fetchCarsByIds: Failed to fetch car details:", error);
    // Return an empty array or handle the error as appropriate for your app
    return [];
  }
};

export default function WishlistPage() {
  const { wishlistItems } = useWishlist();
  const [wishlistCars, setWishlistCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  // This is where you get the paginated data
  const totalPages = Math.ceil(wishlistCars.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCars = wishlistCars.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  useEffect(() => {
    console.log("WishlistPage: useEffect triggered.");
    const loadWishlistCars = async () => {
      console.log("WishlistPage: Starting to load wishlist cars.");
      setLoading(true);
      const cars = await fetchCarsByIds(wishlistItems);
      setWishlistCars(cars);
      setLoading(false);
      console.log("WishlistPage: Finished loading. Wishlist cars state is now:", cars);
    };

    loadWishlistCars();
  }, [wishlistItems]);

  console.log("WishlistPage: Current loading state:", loading);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
        <span className="text-3xl font-extrabold text-[#3452e1] animate-pulse">Loading...</span>
        <span className="mt-2 text-[#3452e1] text-lg font-bold">Please wait while we fetch your favorite cars.</span>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full">
        <div className="p-6 md:p-10 flex flex-col items-center justify-center w-full">
          <h3 className="text-2xl md:text-3xl font-bold text-[#253887] mb-4">
            WishList Car
          </h3>
          <div className="flex flex-col items-center text-center">
            <img
              alt="car with a heart in the background"
              src="/images/favorite-cars.svg"
              className="w-96 h-96 mb-6"
            />
            <p className="text-gray-500 mb-4 px-4">
              You add a car to wishlist by clicking on a heart icon.
            </p>
            <button
            type="button"
            onClick={() => navigate('/cars')}
            className="px-6 py-3 bg-[#3452e1] text-white font-semibold rounded-md hover:bg-opacity-90 transition-colors"
          >
            Back to Shopping Car
          </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto flex-1 px-4 py-6 md:px-6">
      <h2 className="text-4xl font-extrabold text-[#253887] mb-6">Your Wishlist</h2>
      <div className="flex flex-col gap-8">
        {/* Sửa từ wishlistCars thành currentCars để hiển thị phân trang */}
        {currentCars.map(car => (
          <CarCard key={car.listingId} car={car} />
        ))}
      </div>
      {/* Thêm phần phân trang vào đây */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-10 gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-1 border rounded-md ${currentPage === index + 1 ? 'bg-[#3452e1] text-white' : 'bg-white text-[#253887]'}`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Back to top button */}
      <div className="flex justify-center mt-10">
        <button
          type="button"
          className="flex items-center gap-2 text-[#3452e1] hover:underline font-bold bg-transparent border-none outline-none focus:outline-none active:outline-none select-none transition"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          tabIndex={0}
        >
          <ArrowUpIcon className="w-5 h-5 text-[#3452e1]" />
          <span className="text-[#3452e1] font-bold">Back to top</span>
        </button>
      </div>
    </div>
  );
}