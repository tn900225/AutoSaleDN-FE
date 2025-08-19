import React from "react";

export default function Hero() {
  return (
    <section className="bg-[#f6f8fd] border-b border-[#e6e9f3]">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between py-12 px-4 md:px-8 gap-8">
        {/* Left: illustration (optional, can add image/svg here) */}
        <div className="hidden md:flex items-center justify-center w-2/5 min-w-[310px]">
          {/* Placeholder for possible hero illustration */}
          <div className="rounded-full bg-gradient-to-br from-[#e9ecfa] to-[#f6f8fd] w-72 h-72 flex items-center justify-center">
            {/* You can place an SVG car or other illustration here */}
          </div>
        </div>
        {/* Center: Content */}
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#253887] mb-6 leading-tight">
            You choose your car online.<br className="hidden md:block"/> We inspect it and deliver it.
          </h1>
          {/* Search Form */}
          <div className="bg-white shadow rounded-xl p-6 w-full max-w-xl">
            <form className="flex flex-col gap-6" id="form-homepage-filter">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Make/Model */}
                <div>
                  <label htmlFor="make" className="sr-only">Make or model</label>
                  <div className="relative">
                    <input
                      id="make"
                      name="make"
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-[#253887] placeholder:text-gray-400 focus:ring-2 focus:ring-[#3452e1] focus:border-[#3452e1] transition"
                      placeholder="Make or model"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg width={16} height={16} fill="none" viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" stroke="#253887" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                  </div>
                </div>
                {/* Mileage */}
                <div>
                  <label htmlFor="mileage-to" className="sr-only">Mileage</label>
                  <div className="relative">
                    <input
                      id="mileage-to"
                      name="mileage-to"
                      type="number"
                      inputMode="numeric"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-[#253887] placeholder:text-gray-400 focus:ring-2 focus:ring-[#3452e1] focus:border-[#3452e1] transition"
                      placeholder="Mileage"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg width={16} height={16} fill="none" viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" stroke="#253887" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                  </div>
                </div>
                {/* Registration from */}
                <div>
                  <label htmlFor="registration-date-from" className="sr-only">Registration from</label>
                  <div className="relative">
                    <input
                      id="registration-date-from"
                      name="registration-date-from"
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-[#253887] placeholder:text-gray-400 focus:ring-2 focus:ring-[#3452e1] focus:border-[#3452e1] transition"
                      placeholder="Registration from"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg width={16} height={16} fill="none" viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" stroke="#253887" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                  </div>
                </div>
                {/* Price up to */}
                <div>
                  <label htmlFor="price-to" className="sr-only">Price up to</label>
                  <div className="relative">
                    <input
                      id="price-to"
                      name="price-to"
                      type="number"
                      inputMode="numeric"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-[#253887] placeholder:text-gray-400 focus:ring-2 focus:ring-[#3452e1] focus:border-[#3452e1] transition"
                      placeholder="Price up to"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg width={16} height={16} fill="none" viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" stroke="#253887" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {/* VAT deduction checkbox */}
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-[#3452e1] h-5 w-5 rounded border border-gray-300" />
                  <span className="text-[#253887] text-sm font-medium">VAT deduction</span>
                </label>
                {/* Spacer */}
                <div className="flex-1" />
                {/* Search + Advanced search */}
                <button type="submit" className="bg-[#3452e1] hover:bg-[#253887] text-white font-bold rounded-lg px-6 py-2 shadow-sm transition" data-testid="feature.car_selector.search">
                  1&nbsp;021&nbsp;567 Offers
                </button>
                <button type="button" className="flex items-center gap-1 border border-[#3452e1] text-[#3452e1] hover:bg-[#e9ecfa] font-semibold px-4 py-2 rounded-lg transition text-sm">
                  Advanced search
                  <svg width={20} height={20} fill="none" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke="#3452e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Benefits */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-10">
        <ul className="flex flex-col md:flex-row gap-6">
          {/* Benefit 1 */}
          <li className="flex-1 bg-white shadow rounded-xl p-6 flex items-start gap-4">
            <img src="/images/icons/finance-32.svg" alt="Money-back guarantee" className="w-10 h-10 flex-shrink-0" />
            <div>
              <h6 className="text-[#253887] font-bold text-lg mb-1">Money back guarantee</h6>
              <p className="text-[#425187] text-sm mb-2">If you don't fall in love with the vehicle, simply return it to us.</p>
              <button className="text-[#3452e1] font-semibold text-sm flex items-center gap-1 hover:underline">
                More
                <svg width={16} height={16} fill="#3452e1" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" fill="#3452e1"/><path d="M8.65 4c0-.36-.29-.65-.65-.65s-.65.29-.65.65v2.35H4a.65.65 0 100 1.3h3.35V12c0 .36.29.65.65.65s.65-.29.65-.65V7.65H12a.65.65 0 100-1.3H8.65V4z" fill="#fff"/></svg>
              </button>
            </div>
          </li>
          {/* Benefit 2 */}
          <li className="flex-1 bg-white shadow rounded-xl p-6 flex items-start gap-4">
            <img src="/images/icons/caraudit-32.svg" alt="Safe purchase" className="w-10 h-10 flex-shrink-0" />
            <div>
              <h6 className="text-[#253887] font-bold text-lg mb-1">Safe purchase</h6>
              <p className="text-[#425187] text-sm mb-2">We guarantee the technical condition of every vehicle sold.</p>
              <button className="text-[#3452e1] font-semibold text-sm flex items-center gap-1 hover:underline">
                More
                <svg width={16} height={16} fill="#3452e1" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" fill="#3452e1"/><path d="M8.65 4c0-.36-.29-.65-.65-.65s-.65.29-.65.65v2.35H4a.65.65 0 100 1.3h3.35V12c0 .36.29.65.65.65s.65-.29.65-.65V7.65H12a.65.65 0 100-1.3H8.65V4z" fill="#fff"/></svg>
              </button>
            </div>
          </li>
          {/* Benefit 3 */}
          <li className="flex-1 bg-white shadow rounded-xl p-6 flex items-start gap-4">
            <img src="/images/icons/legal-32.svg" alt="6-month warranty" className="w-10 h-10 flex-shrink-0" />
            <div>
              <h6 className="text-[#253887] font-bold text-lg mb-1">6-month warranty</h6>
              <p className="text-[#425187] text-sm mb-2">In addition, with every car you receive an extended warranty.</p>
              <button className="text-[#3452e1] font-semibold text-sm flex items-center gap-1 hover:underline">
                More
                <svg width={16} height={16} fill="#3452e1" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" fill="#3452e1"/><path d="M8.65 4c0-.36-.29-.65-.65-.65s-.65.29-.65.65v2.35H4a.65.65 0 100 1.3h3.35V12c0 .36.29.65.65.65s.65-.29.65-.65V7.65H12a.65.65 0 100-1.3H8.65V4z" fill="#fff"/></svg>
              </button>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}