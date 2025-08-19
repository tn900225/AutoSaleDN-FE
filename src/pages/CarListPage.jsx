import React from "react";
import cars from "../data/cars";
import CarList from "../components/CarList";
import SearchBar from "../components/SearchBar";

export default function CarListPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#002244] mb-6">Danh sách xe</h1>
      <SearchBar />
      <CarList cars={cars} />
    </div>
  );
}