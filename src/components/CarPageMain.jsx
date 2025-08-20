import React, { useState } from "react";
import { mockCars } from "../data/mockCars"; // Đảm bảo mockData.js nằm cùng thư mục hoặc sửa lại đường dẫn cho phù hợp

const PER_PAGE = 5;
const totalResults = 826224; // Hiển thị trên UI, không liên quan tới mock data thực tế

// Helper: tạo mảng pagination thông minh
function getPagination(current, total) {
  let pages = [];
  if (total <= 6) {
    // Hiển thị tất cả nếu ít trang
    for (let i = 1; i <= total; ++i) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push('...');
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); ++i) {
      pages.push(i);
    }
    if (current < total - 2) pages.push('...');
    pages.push(total);
  }
  return pages;
}

export default function CarListPage() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(mockCars.length / PER_PAGE);
  const visibleCars = mockCars.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="min-h-screen bg-[#f4f6fc] pb-10">
      {/* Header */}
      <header className="bg-white shadow flex items-center px-6 py-3 mb-7 sticky top-0 z-10">
        <img src="/images/thumb_buyonline_2x.af169d63.webp" alt="" className="w-12 h-12 rounded-lg mr-3" />
        <span className="font-extrabold text-lg text-[#253887]">How to buy a car online</span>
        <div className="flex-1" />
        <button className="border font-semibold border-[#3452e1] text-[#3452e1] bg-white rounded-lg px-5 py-2 hover:bg-[#e9ecfa] transition ml-4">
          Find out more <span className="ml-1">&#9662;</span>
        </button>
      </header>

      {/* Content container */}
      <div className="max-w-5xl mx-auto px-4">
        {/* Title */}
        <h2 className="text-3xl font-extrabold text-[#253887] mb-1 mt-2">Verified cars</h2>
        {/* Results & sort */}
        <div className="flex items-center gap-8 mb-5">
          <span className="font-semibold text-[#253887]">
            <span className="text-lg font-extrabold">{totalResults.toLocaleString()}</span> results
          </span>
          <span className="flex items-center gap-1 text-[#253887] font-semibold">
            Newest ad <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16"><path d="M8 10l4-4H4l4 4Z" fill="currentColor" /></svg>
          </span>
        </div>

        {/* Pagination top */}
        <div className="flex items-center gap-2 justify-end mb-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`w-9 h-9 rounded bg-[#3452e1] text-white font-bold flex items-center justify-center transition ${page === 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-[#253887]"}`}
          >
            <svg width={20} height={20} fill="none" viewBox="0 0 20 20">
              <path d="M12.5 15l-5-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {getPagination(page, totalPages).map((p, i) =>
            p === '...' ? (
              <span key={i} className="px-2 text-[#253887]">...</span>
            ) : (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded border font-bold ${
                  page === p
                    ? "bg-[#3452e1] text-white border-[#3452e1]"
                    : "bg-white text-[#3452e1] hover:bg-[#e9ecfa]"
                }`}
                aria-current={page === p ? "page" : undefined}
              >
                {p}
              </button>
            )
          )}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`w-9 h-9 rounded bg-[#3452e1] text-white font-bold flex items-center justify-center transition ${
              page === totalPages ? "opacity-30 cursor-not-allowed" : "hover:bg-[#253887]"
            }`}
          >
            <svg width={20} height={20} fill="none" viewBox="0 0 20 20">
              <path d="M7.5 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Car cards */}
        <div className="flex flex-col gap-6">
          {visibleCars.map(car => (
            <div key={car.id} data-testid="feature.car.card" className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden border group">
              <div role="group" className="flex">
                {/* Image & carousel mock */}
                <a
                  href={`/car/${car.id}/${car.make.toLowerCase().replace(/\s/g, "-")}-${car.model.toLowerCase().replace(/\s/g, "-")}-${car.powerKw}-kw`}
                  data-testid="feature.car.card_serp"
                  className="flex-shrink-0 w-[277px] relative block gtm-element-visibility-impressions-list"
                  data-car-id={car.id}
                >
                  {/* Heart button */}
                  <div className="absolute top-2 right-2 z-10">
                    <button className="bg-white rounded-full p-1 shadow">
                      <svg viewBox="0 0 24 24" strokeWidth="2px" data-icon-id="heartfilled24" className="w-6 h-6 text-[#3452e1]">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#253887" />
                      </svg>
                    </button>
                  </div>
                  {/* Carousel mockup */}
                  <div className="w-[277px] h-[180px] overflow-hidden relative bg-[#e9ecfa]">
                    <img
                      alt={`${car.make} ${car.model} ${car.powerKw} kW image number 1`}
                      src={car.imageUrl}
                      loading="eager"
                      className="w-full h-full object-cover transition group-hover:scale-105"
                      decoding="async"
                    />
                    {/* Photo count badge */}
                    <div data-testid="carousel-photo-count-badge" className="absolute bottom-2 left-2 bg-white/90 rounded px-2 py-1 flex items-center gap-1 text-[#3452e1] font-bold text-xs shadow">
                      <svg viewBox="0 0 24 24" data-icon-id="image24" className="w-5 h-5"><rect x="4" y="7" width="16" height="10" rx="2" fill="#3452e1" /><circle cx="7" cy="17" r="1.5" fill="white" /><circle cx="17" cy="17" r="1.5" fill="white" /></svg>
                      <p>{car.imagesCount}</p>
                    </div>
                  </div>
                </a>
                {/* Info */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <div className="mb-3">
                      <h4 className="text-[#253887] text-xl font-extrabold" data-testid="feature.car.card_serp_row_title">
                        {car.make} {car.model} {car.powerKw && <span className="font-normal">{car.powerKw} kW</span>}
                      </h4>
                    </div>
                    {/* Main specs */}
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-[#253887] text-base font-medium mb-2">
                      <span data-testid="desc-power" className="flex items-center gap-1">
                        <i className="w-5 h-5 text-[#253887] ri-flashlight-fill" data-icon-id="engine24"></i>
                        <span className="font-semibold">{car.powerKw} kW</span>
                        <span data-testid="desc-power-value" className="ml-1 text-xs text-[#888]">({car.powerHp} hp)</span>
                      </span>
                      <span data-testid="desc-registration-date" className="flex items-center gap-1">
                        <i className="w-5 h-5 text-[#253887] ri-calendar-2-line" data-icon-id="calendar24"></i>
                        {car.registrationDate}
                      </span>
                      <span data-testid="desc-mileage" className="flex items-center gap-1">
                        <i className="w-5 h-5 text-[#253887] ri-road-map-line" data-icon-id="road24"></i>
                        {car.mileage}
                      </span>
                      <span className="flex items-center gap-1">
                        <i className="w-5 h-5 text-[#253887] ri-settings-2-line" data-icon-id="transmission24"></i>
                        {car.transmission}
                      </span>
                      <span data-testid="desc-fuel-type" className="flex items-center gap-1">
                        <i className="w-5 h-5 text-[#253887] ri-flashlight-line" data-icon-id="lightning24"></i>
                        {car.fuel}
                      </span>
                    </div>
                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-2">
                      {car.features.slice(0, 5).map(f => (
                        <span key={f} className="bg-[#e9ecfa] text-[#3452e1] rounded px-3 py-1 text-sm font-medium">{f}</span>
                      ))}
                      {car.features.length > 5 &&
                        <span className="bg-[#e9ecfa] text-[#3452e1] rounded px-3 py-1 text-sm font-medium">
                          +{car.features.length - 5} more
                        </span>
                      }
                    </div>
                    {/* Delivery & payment */}
                    <div className="flex flex-wrap gap-8 mt-4 mb-2 text-sm font-medium">
                      <span className="flex items-center gap-2 text-[#253887]">
                        <i className="w-5 h-5 text-[#3452e1] ri-map-pin-line" data-icon-id="mappin24"></i>
                        {car.deliveryLocation}, delivery: <span className="font-bold text-[#3452e1] ml-1">€{car.deliveryPrice.toLocaleString()}</span>
                      </span>
                      <span className="flex items-center gap-2 text-[#253887]">
                        <i className="w-5 h-5 text-[#3452e1] ri-calculator-line" data-icon-id="calculator24"></i>
                        Monthly payment: <span className="font-bold text-[#3452e1] ml-1">€{car.monthlyPayment.toLocaleString()}</span>
                      </span>
                    </div>
                  </div>
                  {/* Price block */}
                  <div className="flex flex-col items-end">
                    <h4 className="text-2xl font-bold text-[#253887]" data-testid="feature.serp_car_card.price">
                      €{car.priceEuro.toLocaleString()}
                    </h4>
                    <div data-testid="feature.serp_car_card.price_without_tax" className="text-sm text-gray-500 font-medium">
                      €{car.priceWithoutVat.toLocaleString()} <span className="text-[#3452e1]">without VAT</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination bottom */}
        <div className="flex items-center justify-between bg-[#f4f6fc] py-6 px-4 mt-7">
          {/* Back to top button like image 1 */}
          <button
            type="button"
            className="flex items-center gap-2 text-[#3452e1] hover:underline font-bold bg-transparent shadow-none border-none outline-none focus:outline-none active:outline-none select-none transition"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            tabIndex={0}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M12 19V5" stroke="#3452e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 12l7-7 7 7" stroke="#3452e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[#3452e1] font-bold">Back to top</span>
          </button>
          {/* Pagination */}
          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`w-9 h-9 rounded bg-[#3452e1] text-white font-bold flex items-center justify-center transition ${page === 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-[#253887]"}`}
            >
              <svg width={20} height={20} fill="none" viewBox="0 0 20 20">
                <path d="M12.5 15l-5-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {getPagination(page, totalPages).map((p, i) =>
              p === '...' ? (
                <span key={i} className="px-2 text-[#253887]">...</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded border font-bold ${
                    page === p
                      ? "bg-[#3452e1] text-white border-[#3452e1]"
                      : "bg-white text-[#3452e1] hover:bg-[#e9ecfa]"
                  }`}
                  aria-current={page === p ? "page" : undefined}
                >
                  {p}
                </button>
              )
            )}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`w-9 h-9 rounded bg-[#3452e1] text-white font-bold flex items-center justify-center transition ${page === totalPages ? "opacity-30 cursor-not-allowed" : "hover:bg-[#253887]"}`}
            >
              <svg width={20} height={20} fill="none" viewBox="0 0 20 20">
                <path d="M7.5 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}