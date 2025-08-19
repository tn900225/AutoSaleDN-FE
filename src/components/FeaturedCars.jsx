import React from "react";
import cars from "../data/cars";

export default function FeaturedCars() {
  return (
    <section className="bg-[#f7fafd] py-12">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#06204e] mb-7">Xe nổi bật</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
          {cars.slice(0, 4).map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-xl shadow hover:shadow-lg border border-[#e2e8f0] hover:-translate-y-1 transition overflow-hidden group"
            >
              <div className="relative">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-52 object-cover group-hover:scale-105 transition"
                />
                <span className="absolute top-3 left-3 bg-[#06204e] text-xs text-white px-3 py-1 rounded-full font-semibold">
                  {car.brand}
                </span>
              </div>
              <div className="p-4 pb-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#06204e]">{car.name}</h3>
                  <span className="text-[#00ADF6] text-lg font-extrabold">{car.price.toLocaleString()} ₫</span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[#5373ad] text-sm mt-2">
                  <span>{car.year}</span>
                  <span>• {car.km.toLocaleString()} km</span>
                  <span>• {car.location}</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <span className="bg-[#e6f6fd] text-[#0098d7] px-2 py-0.5 rounded text-xs">{car.fuel}</span>
                  <span className="bg-[#e6f6fd] text-[#0098d7] px-2 py-0.5 rounded text-xs">{car.transmission}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}