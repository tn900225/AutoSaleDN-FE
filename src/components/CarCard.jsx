import React from "react";
import { Link } from "react-router-dom";

export default function CarCard({ car }) {
  return (
    <Link to={`/cars/${car.id}`} className="block bg-white shadow hover:shadow-xl rounded-lg overflow-hidden transition">
      <img src={car.image} alt={car.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <div className="text-lg font-bold text-[#002244] mb-1">{car.name}</div>
        <div className="text-[#00ADF6] font-semibold text-xl mb-2">{car.price.toLocaleString()} ₫</div>
        <div className="flex gap-2 text-gray-600 text-sm">
          <span>{car.year}</span>
          <span>•</span>
          <span>{car.km.toLocaleString()} km</span>
          <span>•</span>
          <span>{car.location}</span>
        </div>
      </div>
    </Link>
  );
}