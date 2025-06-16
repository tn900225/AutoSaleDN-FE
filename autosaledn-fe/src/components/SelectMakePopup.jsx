import React from "react";

export default function SelectMakePopup({ onClose }) {
  // Dữ liệu giả lập cho các hãng xe phổ biến và tất cả các hãng
  const mostSearchedBrands = [
    { name: "Audi", imgSrc: "/images/audi.webp" },
    { name: "BMW", imgSrc: "/images/bmw.webp" },
    { name: "Citroën", imgSrc: "/images/citroen.webp" },
    { name: "Dacia", imgSrc: "/images/dacia.webp" },
    { name: "Fiat", imgSrc: "/images/fiat.webp" },
    { name: "Ford", imgSrc: "/images/ford.webp" },
    { name: "Hyundai", imgSrc: "/images/hyundai.webp" },
    { name: "Kia", imgSrc: "/images/kia.webp" },
    { name: "Mercedes-Benz", imgSrc: "/images/mercedes_benz.webp" },
    { name: "Peugeot", imgSrc: "/images/peugeot.webp" },
    { name: "Škoda", imgSrc: "/images/skoda.webp" },
    { name: "Volkswagen", imgSrc: "/images/volkswagen.webp" },
  ];

  const allBrands = [
    { name: "Abarth", imgSrc: "/images/abarth.webp" },
    { name: "Acura", imgSrc: "/images/acura.webp" },
    { name: "Aixam", imgSrc: "/images/aixam.webp" },
    { name: "Alfa Romeo", imgSrc: "/images/alfa_romeo.webp" },
    { name: "Alpina", imgSrc: "/images/alpina.webp" },
    { name: "Alpine", imgSrc: "/images/alpine.webp" },
    { name: "ARI Motors", imgSrc: "/images/ari_motors.webp" },
    { name: "Aston Martin", imgSrc: "/images/aston_martin.webp" },
  ];

  return (
    <div
      role="dialog"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose} // Đóng popup khi click ra ngoài
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md md:max-w-lg lg:max-w-xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Ngăn chặn sự kiện click lan truyền ra ngoài
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#253887]">Select make</h3>
          <button
            type="button"
            aria-label="close"
            className="p-2 rounded hover:bg-gray-100 transition"
            onClick={onClose}
          >
            <svg
              width={20}
              height={20}
              fill="none"
              viewBox="0 0 20 20"
              className="text-[#253887]"
            >
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-gray-200">
          <input
            placeholder="Make or model"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3452e1] focus:border-[#3452e1]"
            value=""
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Most searched tags */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-600 mb-3">Most searched tags</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
              {mostSearchedBrands.map((brand) => (
                <div
                  key={brand.name}
                  className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                >
                  <div className="w-8 h-8 flex items-center justify-center mb-1">
                    <img
                      width="32"
                      height="32"
                      src={brand.imgSrc}
                      alt={`${brand.name} logo`}
                      loading="lazy"
                      decoding="async"
                      style={{ objectFit: "contain", width: "32px", height: "32px" }}
                    />
                  </div>
                  <span className="text-xs text-center">{brand.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* All brands */}
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-3">All brands</p>
            <div className="flex flex-col gap-2">
              {allBrands.map((brand) => (
                <div
                  key={brand.name}
                  role="group"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <img
                        width="32"
                        height="32"
                        src={brand.imgSrc}
                        alt={`${brand.name} logo`}
                        loading="lazy"
                        decoding="async"
                        style={{ objectFit: "contain", width: "32px", height: "32px" }}
                      />
                    </div>
                    <span className="text-base font-medium text-[#253887]">{brand.name}</span>
                  </div>
                  <svg
                    width={16}
                    height={16}
                    fill="none"
                    viewBox="0 0 16 16"
                    className="text-gray-400"
                  >
                    <path
                      d="M6 4L10 8L6 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}