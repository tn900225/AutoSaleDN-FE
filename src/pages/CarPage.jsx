import React, { useEffect, useState, useCallback } from "react";
import CarFilterSidebar from "../components/CarFilterSidebar";
import CarPageMain from "../components/CarPageMain";
import { getApiBaseUrl } from "../../util/apiconfig";
import { useLocation } from "react-router-dom";

const PER_PAGE = 5;

async function fetchCars(filters = {}, page = 1, perPage = PER_PAGE) {
  const token = localStorage.getItem("token");
  const queryParams = new URLSearchParams();
  const API_BASE = getApiBaseUrl();

  if (filters.keyword) queryParams.append("keyword", filters.keyword);
  if (filters.paymentType) queryParams.append("paymentType", filters.paymentType);
  if (filters.priceFrom !== null && filters.priceFrom !== "") queryParams.append("priceFrom", filters.priceFrom);
  if (filters.priceTo !== null && filters.priceTo !== "") queryParams.append("priceTo", filters.priceTo);
  if (filters.vatDeduction) queryParams.append("vatDeduction", filters.vatDeduction.toString());
  if (filters.discountedCars) queryParams.append("discountedCars", filters.discountedCars.toString());
  if (filters.premiumPartners) queryParams.append("premiumPartners", filters.premiumPartners.toString());
  if (filters.registrationFrom !== null && filters.registrationFrom !== "") queryParams.append("registrationFrom", filters.registrationFrom);
  if (filters.registrationTo !== null && filters.registrationTo !== "") queryParams.append("registrationTo", filters.registrationTo);
  if (filters.mileageFrom !== null && filters.mileageFrom !== "") queryParams.append("mileageFrom", filters.mileageFrom);
  if (filters.mileageTo !== null && filters.mileageTo !== "") queryParams.append("mileageTo", filters.mileageTo);
  if (filters.transmission) queryParams.append("transmission", filters.transmission);
  if (filters.fuelType) queryParams.append("fuelType", filters.fuelType);
  if (filters.powerUnit) queryParams.append("powerUnit", filters.powerUnit);
  if (filters.powerFrom !== null && filters.powerFrom !== "") queryParams.append("powerFrom", filters.powerFrom);
  if (filters.powerTo !== null && filters.powerTo !== "") queryParams.append("powerTo", filters.powerTo);
  if (filters.vehicleType) queryParams.append("vehicleType", filters.vehicleType);
  if (filters.driveType4x4) queryParams.append("driveType4x4", filters.driveType4x4.toString());
  if (filters.exteriorColor) queryParams.append("exteriorColor", filters.exteriorColor);
  if (filters.features && filters.features.length > 0) {
    filters.features.forEach(feature => {
      queryParams.append("features", feature);
    });
  }

  queryParams.append("page", page.toString());
  queryParams.append("perPage", perPage.toString());

  const queryString = queryParams.toString();
  const url = `${API_BASE}/api/User/cars${queryString ? `?${queryString}` : ""}`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch cars");
    }

    const data = await res.json();


    if (Array.isArray(data)) {
        console.warn("API response is an array, not an object with totalPages/totalResults. Pagination will not work correctly without backend changes.");
        return {
            cars: data,
            totalPages: Math.ceil(data.length / perPage) || 1,
            totalResults: data.length
        };
    }

    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export default function CarPage() {
  const location = useLocation(); 
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Khởi tạo state currentFilters bằng cách kiểm tra location.state ngay lập tức
  const [currentFilters, setCurrentFilters] = useState(() => {
    const defaultFilters = {
      keyword: '',
      paymentType: 'cash',
      priceFrom: null,
      priceTo: null,
      vatDeduction: false,
      discountedCars: false,
      premiumPartners: false,
      registrationFrom: null,
      registrationTo: null,
      mileageFrom: null,
      mileageTo: null,
      transmission: '',
      fuelType: '',
      powerUnit: 'kW',
      powerFrom: null,
      powerTo: null,
      vehicleType: '',
      driveType4x4: false,
      exteriorColor: '',
      features: [],
      sortBy: 'newest',
    };
    // Nếu có filter ban đầu, trộn nó với các filter mặc định
    if (location.state && location.state.initialFilter) {
      return { ...defaultFilters, ...location.state.initialFilter };
    }
    return defaultFilters;
  });

  const handleFilterChange = useCallback((newFilters) => {
    setCurrentFilters(prevFilters => {
      // Chỉ reset trang nếu các giá trị filter thực sự thay đổi
      const changedFilterKeys = Object.keys(newFilters).filter(key => key !== 'sortBy' && prevFilters[key] !== newFilters[key]);
      if (changedFilterKeys.length > 0 || (newFilters.features && JSON.stringify(prevFilters.features) !== JSON.stringify(newFilters.features))) {
        setCurrentPage(1);
      }
      return { ...prevFilters, ...newFilters };
    });
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSortChange = useCallback((newSortBy) => {
    setCurrentFilters(prevFilters => {
      return { ...prevFilters, sortBy: newSortBy };
    });
  }, []);

  const sortCarsLocally = useCallback((carsArray, sortByOption) => {
    if (!carsArray || carsArray.length === 0) return [];

    let sortedCars = [...carsArray]; 

    switch (sortByOption) {
        case 'price-asc':
            sortedCars.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sortedCars.sort((a, b) => b.price - a.price);
            break;
        case 'mileage-asc':
            sortedCars.sort((a, b) => a.mileage - b.mileage);
            break;
        case 'mileage-desc':
            sortedCars.sort((a, b) => b.mileage - a.mileage);
            break;
        case 'year-asc':
            sortedCars.sort((a, b) => a.year - b.year);
            break;
        case 'year-desc':
            sortedCars.sort((a, b) => b.year - a.year);
            break;
        case 'newest': 
        default:
            sortedCars.sort((a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime());
            break;
    }
    return sortedCars;
  }, []); 

  useEffect(() => {
    const loadCars = async () => {
      setLoading(true);
      try {
        const data = await fetchCars(currentFilters, currentPage, PER_PAGE);
        setCars(data.cars);
        setTotalPages(data.totalPages);
        setTotalResults(data.totalResults);
      } catch (error) {
        console.error("Error fetching cars:", error);
        setCars([]);
        setTotalPages(1);
        setTotalResults(0);
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, [currentFilters, currentPage]);

  const carsToDisplay = sortCarsLocally(cars, currentFilters.sortBy);

  return (
    <div className="min-h-screen bg-[#f6f8fd] py-8 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto flex flex-col md:flex-row gap-6">
        <CarFilterSidebar onFilter={handleFilterChange} currentFilters={currentFilters} />
        <CarPageMain
          cars={carsToDisplay}
          loading={loading}
          totalResults={totalResults}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          sortBy={currentFilters.sortBy}
          onSortChange={handleSortChange}
        />
      </div>
    </div>
  );
}
