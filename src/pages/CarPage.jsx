import React, { useEffect, useState } from "react";
import CarFilterSidebar from "../components/CarFilterSidebar";
import CarPageMain from "../components/CarPageMain";

async function fetchCars(filters = {}) {
  const token = localStorage.getItem("token");
  const queryParams = new URLSearchParams();


  if (filters.keyword) {
    queryParams.append("keyword", filters.keyword);
  }
  if (filters.paymentType) {
    queryParams.append("paymentType", filters.paymentType);
  }
  if (filters.priceFrom) {
    queryParams.append("priceFrom", filters.priceFrom);
  }
  if (filters.priceTo) {
    queryParams.append("priceTo", filters.priceTo);
  }
  if (filters.vatDeduction) {
    queryParams.append("vatDeduction", filters.vatDeduction);
  }
  if (filters.discountedCars) {
    queryParams.append("discountedCars", filters.discountedCars);
  }
  if (filters.premiumPartners) {
    queryParams.append("premiumPartners", filters.premiumPartners);
  }
  if (filters.registrationFrom) {
    queryParams.append("registrationFrom", filters.registrationFrom);
  }
  if (filters.registrationTo) {
    queryParams.append("registrationTo", filters.registrationTo);
  }
  if (filters.mileageFrom) {
    queryParams.append("mileageFrom", filters.mileageFrom);
  }
  if (filters.mileageTo) {
    queryParams.append("mileageTo", filters.mileageTo);
  }
  if (filters.transmission) {
    queryParams.append("transmission", filters.transmission);
  }
  if (filters.fuel) {
    queryParams.append("fuel", filters.fuel);
  }
  if (filters.powerUnit) {
    queryParams.append("powerUnit", filters.powerUnit);
  }
  if (filters.powerFrom) {
    queryParams.append("powerFrom", filters.powerFrom);
  }
  if (filters.powerTo) {
    queryParams.append("powerTo", filters.powerTo);
  }
  if (filters.vehicleType) {
    queryParams.append("vehicleType", filters.vehicleType);
  }
  if (filters.driveType4x4) {
    queryParams.append("driveType4x4", filters.driveType4x4);
  }
  if (filters.exteriorColor) {
    queryParams.append("exteriorColor", filters.exteriorColor);
  }
  if (filters.features && filters.features.length > 0) {
    filters.features.forEach(feature => {
      queryParams.append("features", feature);
    });
  }

  const queryString = queryParams.toString();
  const url = `/api/User/cars${queryString ? `?${queryString}` : ""}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch cars");
  }
  return await res.json();
}

export default function CarPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentFilters, setCurrentFilters] = useState({});

  useEffect(() => {
    setLoading(true);
    fetchCars(currentFilters)
      .then(setCars)
      .catch(error => {
        console.error("Error fetching cars:", error);
      })
      .finally(() => setLoading(false));
  }, [currentFilters]);

  const handleFilter = (filters) => {
    setCurrentFilters(filters);
  };

  return (
    <div className="min-h-screen bg-[#f6f8fd] py-8 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto flex flex-col md:flex-row gap-6">
        <CarFilterSidebar onFilter={handleFilter} />

        <CarPageMain cars={cars} loading={loading} />
      </div>
    </div>
  );
}