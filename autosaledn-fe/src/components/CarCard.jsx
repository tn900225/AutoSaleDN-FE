// src/components/CarCard.jsx
import React from "react";

export default function CarCard({ car }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(price);
  };

  return (
    <a
      href={`/car/${car.id}/${car.make.toLowerCase().replace(/\s/g, '-')}-${car.model.toLowerCase().replace(/\s/g, '-')}`}
      className="flex flex-col bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
    >
      {/* Image carousel */}
      <div className="relative">
        <div className="overflow-hidden rounded-t-xl">
          <img
            alt={`${car.make} ${car.model} image number 1`}
            src={car.imageUrl}
            className="w-full h-48 object-cover"
            loading="lazy"
          />
        </div>
        {/* Carousel badge */}
        <div className="absolute bottom-2 left-2 bg-[#253887] text-white text-xs px-2 py-1 rounded flex items-center gap-1">
          <svg width={18} height={18} viewBox="0 0 18 18" className="inline-block">
            <rect x={2} y={4} width={14} height={10} rx={2} fill="white" stroke="#3452e1" />
            <circle cx={5} cy={14} r={1} fill="#3452e1" />
            <circle cx={13} cy={14} r={1} fill="#3452e1" />
          </svg>
          {car.imagesCount}
        </div>
      </div>
      {/* Car info */}
      <div className="p-4 flex flex-col gap-2">
        <div>
          <h4 className="font-bold text-lg text-[#253887]">{car.make} {car.model}</h4>
          <p className="text-xs text-[#425187]">(Comb.) {car.consumption} • {car.co2} • class {car.emissionClass}</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-[#253887]">
          <div className="flex items-center gap-1">
            <svg width={18} height={18} viewBox="0 0 18 18"><circle cx={9} cy={9} r={8} stroke="#3452e1" strokeWidth={1.5} fill="none"/><rect x={8} y={4} width={2} height={7} rx={1} fill="#3452e1"/></svg>
            <span>{car.powerKw} kW ({car.powerHp} hp)</span>
          </div>
          <div className="flex items-center gap-1">
            <svg width={18} height={18} viewBox="0 0 18 18"><rect x={3} y={5} width={12} height={8} rx={2} stroke="#3452e1" strokeWidth={1.5} fill="none"/><rect x={7} y={7} width={4} height={4} rx={1} fill="#3452e1"/></svg>
            <span>{car.registrationDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg width={18} height={18} viewBox="0 0 18 18"><rect x={2} y={8} width={14} height={2} rx={1} fill="#3452e1"/><circle cx={5} cy={13} r={1} fill="white"/><circle cx={13} cy={13} r={1} fill="white"/></svg>
            <span>{car.mileage}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg width={18} height={18} viewBox="0 0 18 18"><rect x={5} y={5} width={8} height={8} rx={2} stroke="#3452e1" strokeWidth={1.5} fill="none"/><path d="M9 5v8" stroke="#3452e1" strokeWidth={1.5}/></svg>
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg width={18} height={18} viewBox="0 0 18 18"><rect x={3} y={5} width={12} height={8} rx={2} stroke="#3452e1" strokeWidth={1.5} fill="none"/><rect x={7} y={9} width={4} height={2} rx={1} fill="#3452e1"/></svg>
            <span>{car.fuel}</span>
          </div>
        </div>
        {/* Features preview */}
        <div className="flex flex-wrap gap-2">
          {car.features.slice(0, 5).map((feat) => // Hiển thị tối đa 5 tính năng chính
            <span key={feat} className="bg-[#f4f7fc] text-[#3452e1] px-2 py-1 rounded text-xs">{feat}</span>
          )}
          {car.features.length > 5 && (
            <button className="ml-1 text-[#3452e1] text-xs font-semibold hover:underline flex items-center gap-1">
              {car.features.length - 5} more
              <svg width={14} height={14} viewBox="0 0 14 14">
                <path d="M7 5v4M5 9h4" stroke="#3452e1" strokeWidth={2} strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
        {/* Delivery & monthly */}
        <div className="flex flex-wrap items-center gap-4 mt-2">
          <div className="flex items-center gap-1">
            <svg width={18} height={18} viewBox="0 0 18 18"><rect x={2} y={5} width={14} height={8} rx={2} fill="#3452e1"/><circle cx={5} cy={13} r={1} fill="white"/><circle cx={13} cy={13} r={1} fill="white"/></svg>
            <span>{car.deliveryLocation}, delivery:</span>
            <span className="font-bold text-[#3452e1]">{formatPrice(car.deliveryPrice)}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg width={18} height={18} viewBox="0 0 18 18"><rect x={3} y={5} width={12} height={8} rx={2} fill="#3452e1"/><rect x={7} y={9} width={4} height={2} rx={1} fill="white"/></svg>
            <span>Monthly payment:</span>
            <span className="font-bold text-[#3452e1]">{formatPrice(car.monthlyPayment)}</span>
          </div>
        </div>
        {/* Price */}
        <div className="flex items-end gap-2 mt-2">
          <div>
            <div className="text-xs text-[#14b8a6] font-medium">Very good price</div>
            <div className="flex items-end gap-2">
              <div className="text-2xl font-bold text-[#3452e1]">{formatPrice(car.priceEuro)}</div>
              <div className="flex flex-col text-xs text-gray-500 leading-tight">
                <span>{formatPrice(car.priceWithoutVat)}</span>
                <span>without VAT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}