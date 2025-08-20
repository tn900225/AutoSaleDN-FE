import React from "react";

export default function CarFilterSidebar() {
  return (
    <aside className="w-full md:w-[340px] bg-white rounded-xl shadow-lg p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xl font-bold text-[#253887]">Filter</h4>
        <button
          type="button"
          aria-label="close"
          className="p-2 rounded hover:bg-gray-100 transition"
        >
          <svg width={20} height={20} fill="none" viewBox="0 0 20 20" className="text-[#253887]">
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex mb-4 border-b border-gray-200">
        <button className="flex-1 flex flex-col items-center py-2 text-[#3452e1] border-b-2 border-[#3452e1] font-semibold focus:outline-none">
          <svg width={20} height={20} fill="none" viewBox="0 0 20 20" className="mb-1">
            {/* Tab All icon */}
            <circle cx={10} cy={10} r={9} stroke="currentColor" strokeWidth={1.5} />
            <circle cx={7.5} cy={5.5} r={2} stroke="currentColor" strokeWidth={1.5} />
            <circle cx={12.5} cy={14.5} r={2} stroke="currentColor" strokeWidth={1.5} />
            <path d="M3.5 10h13" stroke="currentColor" strokeWidth={1.5} />
          </svg>
          <span className="text-sm">All</span>
        </button>
        <button className="flex-1 flex flex-col items-center py-2 text-gray-400 font-semibold focus:outline-none">
          <svg width={20} height={20} fill="none" viewBox="0 0 24 24" className="mb-1">
            {/* Tab Saved icon */}
            <rect x={5} y={3} width={14} height={18} rx={2} stroke="currentColor" strokeWidth={1.5} />
            <path d="M12 3v18" stroke="currentColor" strokeWidth={1.5} />
          </svg>
          <span className="text-sm">Saved</span>
        </button>
        <button className="flex-1 flex flex-col items-center py-2 text-gray-400 font-semibold focus:outline-none">
          <svg width={20} height={20} fill="none" viewBox="0 0 24 24" className="mb-1">
            {/* Tab History icon */}
            <circle cx={12} cy={12} r={9} stroke="currentColor" strokeWidth={1.5} />
            <path d="M12 7v5l4 2" stroke="currentColor" strokeWidth={1.5} />
          </svg>
          <span className="text-sm">History</span>
        </button>
      </div>

      {/* Filter Form */}
      <form id="form-search-filter" className="flex flex-col gap-5">
        {/* Make & Model */}
        <section>
          <label className="block text-[#253887] font-semibold mb-2">Make and model</label>
          <div className="flex items-center justify-between border rounded-lg px-3 py-2 cursor-pointer hover:border-[#3452e1] transition">
            <div className="flex items-center gap-2 text-[#3452e1]">
              <svg width={18} height={18} fill="currentColor" viewBox="0 0 16 16">
                <circle cx={8} cy={8} r={8} fill="#3452e1" />
                <path d="M8 4.5v3m0 0v3m0-3h-3m3 0h3" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" />
              </svg>
              <span>Add a car</span>
            </div>
            <svg width={16} height={16} fill="none" viewBox="0 0 16 16">
              <path d="M6 4l4 4-4 4" stroke="#253887" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </section>

        {/* Price */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#253887] font-semibold">Price (€)</span>
            <div className="flex items-center gap-4 text-sm">
              <label className="flex items-center gap-1">
                <input type="radio" name="payment-type" defaultChecked className="accent-[#3452e1]" /> Cash
              </label>
              <label className="flex items-center gap-1">
                <input type="radio" name="payment-type" className="accent-[#3452e1]" /> Instalments
              </label>
            </div>
          </div>
          <div className="flex gap-2">
            <input type="number" placeholder="From" className="w-1/2 border rounded-lg px-2 py-1 focus:border-[#3452e1] focus:ring-2 focus:ring-[#3452e1] transition" />
            <input type="number" placeholder="To" className="w-1/2 border rounded-lg px-2 py-1 focus:border-[#3452e1] focus:ring-2 focus:ring-[#3452e1] transition" />
          </div>
          <div className="flex items-center gap-3 mt-2">
            <label className="flex items-center gap-1 text-sm">
              <input type="checkbox" className="accent-[#3452e1]" /> VAT deduction
            </label>
            <label className="flex items-center gap-1 text-sm">
              <input type="checkbox" className="accent-[#3452e1]" /> Discounted cars
              <svg width={14} height={14} fill="currentColor" viewBox="0 0 16 16" className="text-gray-400">
                <circle cx={8} cy={8} r={7.5} stroke="currentColor" />
                <text x="8" y="11" textAnchor="middle" fontSize="10" fill="currentColor">i</text>
              </svg>
            </label>
            <label className="flex items-center gap-1 text-sm">
              <input type="checkbox" className="accent-[#3452e1]" /> Premium partners
              <svg width={14} height={14} fill="currentColor" viewBox="0 0 16 16" className="text-yellow-500">
                <polygon points="8,2 10,6 14,6 11,9 12,13 8,11 4,13 5,9 2,6 6,6" />
              </svg>
            </label>
          </div>
        </section>

        {/* Registration Date */}
        <section>
          <label className="block text-[#253887] font-semibold mb-2">Registration</label>
          <div className="flex gap-2">
            <input type="text" placeholder="From" className="w-1/2 border rounded-lg px-2 py-1 focus:border-[#3452e1] focus:ring-2 focus:ring-[#3452e1] transition" />
            <input type="text" placeholder="To" className="w-1/2 border rounded-lg px-2 py-1 focus:border-[#3452e1] focus:ring-2 focus:ring-[#3452e1] transition" />
          </div>
        </section>

        {/* Mileage */}
        <section>
          <label className="block text-[#253887] font-semibold mb-2">Mileage</label>
          <div className="flex gap-2">
            <input type="number" placeholder="From" className="w-1/2 border rounded-lg px-2 py-1 focus:border-[#3452e1] focus:ring-2 focus:ring-[#3452e1] transition" />
            <input type="number" placeholder="To" className="w-1/2 border rounded-lg px-2 py-1 focus:border-[#3452e1] focus:ring-2 focus:ring-[#3452e1] transition" />
          </div>
        </section>

        {/* Transmission */}
        <section>
          <label className="block text-[#253887] font-semibold mb-2">Transmission</label>
          <div className="flex gap-3 text-sm">
            <label className="flex items-center gap-1">
              <input type="checkbox" className="accent-[#3452e1]" /> Automatic
            </label>
            <label className="flex items-center gap-1">
              <input type="checkbox" className="accent-[#3452e1]" /> Manual
            </label>
          </div>
        </section>

        {/* Fuel */}
        <section>
          <label className="block text-[#253887] font-semibold mb-2">Fuel</label>
          <div className="flex gap-3 text-sm">
            <label className="flex items-center gap-1">
              <input type="checkbox" className="accent-[#3452e1]" /> Diesel
            </label>
            <label className="flex items-center gap-1">
              <input type="checkbox" className="accent-[#3452e1]" /> Petrol
            </label>
          </div>
        </section>

        {/* Power */}
        <section>
          <label className="block text-[#253887] font-semibold mb-2">Power</label>
          <div className="flex items-center gap-4 mb-2 text-sm">
            <label className="flex items-center gap-1">
              <input type="radio" name="power-unit" className="accent-[#3452e1]" /> hp
            </label>
            <label className="flex items-center gap-1">
              <input type="radio" name="power-unit" className="accent-[#3452e1]" /> kW
            </label>
          </div>
          <div className="flex gap-2">
            <input type="number" placeholder="From" className="w-1/2 border rounded-lg px-2 py-1 focus:border-[#3452e1] focus:ring-2 focus:ring-[#3452e1] transition" />
            <input type="number" placeholder="To" className="w-1/2 border rounded-lg px-2 py-1 focus:border-[#3452e1] focus:ring-2 focus:ring-[#3452e1] transition" />
          </div>
        </section>

        {/* Vehicle Type */}
        <section>
          <label className="block text-[#253887] font-semibold mb-2">Vehicle type</label>
          <select className="w-full border rounded-lg px-2 py-1 focus:border-[#3452e1] focus:ring-2 focus:ring-[#3452e1] transition">
            <option>All</option>
            <option>SUV</option>
            <option>Estate</option>
            <option>Hatchback</option>
            <option>Convertible</option>
          </select>
          <div className="flex items-center gap-2 mt-2 text-sm">
            <label className="flex items-center gap-1">
              <input type="checkbox" className="accent-[#3452e1]" /> Drive type 4x4
            </label>
          </div>
        </section>

        {/* Exterior color */}
        <section>
          <label className="block text-[#253887] font-semibold mb-2">Exterior color</label>
          <div className="flex flex-wrap gap-2">
            {["Black", "White", "Grey", "Red", "Blue", "Silver", "Green", "Beige", "Yellow", "Orange", "Brown", "Gold", "Purple"].map(color => (
              <label key={color} className="flex items-center gap-1 text-xs">
                <input type="checkbox" className="accent-[#3452e1]" />
                <span>{color}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Features */}
        <section>
          <label className="block text-[#253887] font-semibold mb-2">Features</label>
          <div className="flex flex-wrap gap-2 text-sm">
            {[
              "Air conditioning",
              "Cruise control",
              "Heated front seats",
              "Multifunctional steering wheel",
              "Navigation system",
              "Trailer coupling",
              "LED headlights",
              "Xenon headlights"
            ].map(feat => (
              <label key={feat} className="flex items-center gap-1">
                <input type="checkbox" className="accent-[#3452e1]" />
                <span>{feat}</span>
              </label>
            ))}
          </div>
          <button type="button" className="mt-2 text-[#3452e1] text-sm font-semibold hover:underline flex items-center gap-1">
            More features
            <svg width={18} height={18} fill="none" viewBox="0 0 18 18">
              <path d="M7 5l4 4-4 4" stroke="#3452e1" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </section>

        {/* Detailed search button */}
        <button type="button" className="w-full bg-[#3452e1] hover:bg-[#253887] text-white font-bold rounded-lg py-2 mt-2 transition">
          Detailed search
        </button>
      </form>

      {/* Offers button */}
      <div className="mt-4">
        <button type="button" className="w-full bg-[#3452e1] hover:bg-[#253887] text-white font-bold rounded-lg py-3 transition text-lg">
          826&nbsp;224 Offers
        </button>
      </div>

      {/* Info section */}
      <div className="bg-[#f6f8fd] rounded-xl p-4 mt-6 flex flex-col items-center">
        <div className="font-semibold text-[#253887] mb-2">
          What is AutoSaleDN and how does it work?
        </div>
        <button type="button" className="flex items-center gap-2 text-[#3452e1] font-semibold hover:underline">
          <svg width={22} height={22} fill="currentColor" viewBox="0 0 22 22">
            <circle cx={11} cy={11} r={11} fill="#3452e1" />
            <polygon points="9,7 16,11 9,15" fill="#fff" />
          </svg>
          Play video
        </button>
      </div>
    </aside>
  );
}