import React, { useState } from "react";

const PER_PAGE = 5;

function getPagination(current, total) {
  let pages = [];
  if (total <= 6) {
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

export default function CarPageMain({ cars, loading }) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil((cars?.length || 0) / PER_PAGE);
  const visibleCars = cars?.slice((page - 1) * PER_PAGE, page * PER_PAGE) || [];

  React.useEffect(() => {
    setPage(1);
  }, [cars]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[300px]">
        <span className="text-[#3452e1] text-lg font-bold">Loading cars...</span>
      </div>
    );
  }

  if (!cars || cars.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[300px]">
        <span className="text-[#253887] text-lg font-bold">No cars found.</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-3xl font-extrabold text-[#253887] mb-1 mt-2">Verified cars</h2>
      <div className="flex items-center gap-8 mb-5">
        <span className="font-semibold text-[#253887]">
          <span className="text-lg font-extrabold">{cars.length.toLocaleString()}</span> results
        </span>
        <span className="flex items-center gap-1 text-[#253887] font-semibold">
          Newest ad <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16"><path d="M8 10l4-4H4l4 4Z" fill="currentColor" /></svg>
        </span>
      </div>

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

      <div className="flex flex-col gap-6">
        {visibleCars.map(car => (
          <div key={car.listingId} data-testid="feature.car.card" className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden border group">
            <div role="group" className="flex">
              <a
                href={`/cars/${car.listingId}`}
                data-testid="feature.car.card_serp"
                className="flex-shrink-0 w-[277px] relative block"
                data-car-id={car.listingId}
              >
                <div className="absolute top-2 right-2 z-10">
                  <button className="bg-white rounded-full p-1 shadow">
                    <svg viewBox="0 0 24 24" strokeWidth="2px" data-icon-id="heartfilled24" className="w-6 h-6 text-[#3452e1]">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#253887" />
                    </svg>
                  </button>
                </div>
                <div className="w-[277px] h-[180px] overflow-hidden relative bg-[#e9ecfa]">
                  <img
                    alt={`${car.model.manufacturer.name} ${car.model.name} image`}
                    src={car.images[0]?.url || "/images/no-image.png"}
                    loading="eager"
                    className="w-full h-full object-cover transition group-hover:scale-105"
                    decoding="async"
                  />
                  <div data-testid="carousel-photo-count-badge" className="absolute bottom-2 left-2 bg-white/90 rounded px-2 py-1 flex items-center gap-1 text-[#3452e1] font-bold text-xs shadow">
                    <svg viewBox="0 0 24 24" data-icon-id="image24" className="w-5 h-5"><rect x="4" y="7" width="16" height="10" rx="2" fill="#3452e1" /><circle cx="7" cy="17" r="1.5" fill="white" /><circle cx="17" cy="17" r="1.5" fill="white" /></svg>
                    <p>{car.images?.length || 0}</p>
                  </div>
                </div>
              </a>
              <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                  <div className="mb-3">
                    <h4 className="text-[#253887] text-xl font-extrabold" data-testid="feature.car.card_serp_row_title">
                      {car.model.manufacturer.name} {car.model.name}
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-[#253887] text-base font-medium mb-2">
                    <span className="flex items-center gap-1">
                      <i className="w-5 h-5 text-[#253887] ri-flashlight-fill"></i>
                      <span className="font-semibold">{car.specifications[0]?.engine || 'N/A'}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="w-5 h-5 text-[#253887] ri-calendar-2-line"></i>
                      {car.year}
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="w-5 h-5 text-[#253887] ri-road-map-line"></i>
                      {car.mileage.toLocaleString()} km
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="w-5 h-5 text-[#253887] ri-settings-2-line"></i>
                      {car.specifications[0]?.transmission || 'N/A'}
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="w-5 h-5 text-[#253887] ri-flashlight-line"></i>
                      {car.specifications[0]?.fuelType || 'N/A'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(car.features || []).slice(0, 5).map(f => (
                      <span key={f.featureId} className="bg-[#e9ecfa] text-[#3452e1] rounded px-3 py-1 text-sm font-medium">{f.name}</span>
                    ))}
                    {car.features && car.features.length > 5 &&
                      <span className="bg-[#e9ecfa] text-[#3452e1] rounded px-3 py-1 text-sm font-medium">
                        +{car.features.length - 5} more
                      </span>
                    }
                  </div>
                  <div className="flex flex-wrap gap-8 mt-4 mb-2 text-sm font-medium">
                    <span className="flex items-center gap-2 text-[#253887]">
                      <i className="w-5 h-5 text-[#3452e1] ri-map-pin-line"></i>
                      {car.location}, delivery: <span className="font-bold text-[#3452e1] ml-1">€?</span>
                    </span>
                    <span className="flex items-center gap-2 text-[#253887]">
                      <i className="w-5 h-5 text-[#3452e1] ri-calculator-line"></i>
                      Monthly payment: <span className="font-bold text-[#3452e1] ml-1">€?</span>
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <h4 className="text-2xl font-bold text-[#253887]">
                    €{car.price.toLocaleString()}
                  </h4>
                  <div className="text-sm text-gray-500 font-medium">
                    €{(car.price / (1 + (car.pricing[0]?.taxRate || 0))).toLocaleString()} <span className="text-[#3452e1]">without VAT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between bg-[#f4f6fc] py-6 px-4 mt-7">
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
  );
}