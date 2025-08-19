import React from "react";
import { useParams } from "react-router-dom";
import cars from "../data/cars";

export default function CarDetailPage() {
  const { carId } = useParams();
  const car = cars.find((c) => c.id === carId);

  if (!car) return <div className="text-center py-12">Không tìm thấy xe!</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-10">
      <div className="flex-1">
        <img src={car.image} alt={car.name} className="w-full h-96 object-cover rounded-lg shadow" />
      </div>
      <div className="md:w-1/2 flex flex-col gap-6">
        <h2 className="text-3xl font-bold text-[#002244]">{car.name}</h2>
        <div className="text-xl text-[#00ADF6] font-semibold">{car.price.toLocaleString()} ₫</div>
        <ul className="space-y-1 text-gray-700">
          <li><strong>Hãng:</strong> {car.brand}</li>
          <li><strong>Năm SX:</strong> {car.year}</li>
          <li><strong>Màu:</strong> {car.color}</li>
          <li><strong>Số km:</strong> {car.km.toLocaleString()} km</li>
          <li><strong>Loại nhiên liệu:</strong> {car.fuel}</li>
          <li><strong>Hộp số:</strong> {car.transmission}</li>
          <li><strong>Khu vực:</strong> {car.location}</li>
        </ul>
        <button className="bg-[#00ADF6] text-white px-8 py-3 rounded font-bold text-lg hover:bg-[#008ecc] transition mt-6">Liên hệ mua xe</button>
      </div>
    </div>
  );
}