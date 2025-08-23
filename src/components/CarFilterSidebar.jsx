import React, { useState } from "react";
import SelectMakePopup from "./SelectMakePopup";

export default function CarFilterSidebar({ onFilter }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [paymentType, setPaymentType] = useState("cash");
  const [transmission, setTransmission] = useState("");
  const [fuel, setFuel] = useState("");
  const [powerUnit, setPowerUnit] = useState("kW");
  const [keyword, setKeyword] = useState("");

  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [vatDeduction, setVatDeduction] = useState(false);
  const [discountedCars, setDiscountedCars] = useState(false);
  const [premiumPartners, setPremiumPartners] = useState(false);
  const [registrationFrom, setRegistrationFrom] = useState("");
  const [registrationTo, setRegistrationTo] = useState("");
  const [mileageFrom, setMileageFrom] = useState("");
  const [mileageTo, setMileageTo] = useState("");
  const [powerFrom, setPowerFrom] = useState("");
  const [powerTo, setPowerTo] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [driveType4x4, setDriveType4x4] = useState(false);
  const [selectedExteriorColor, setSelectedExteriorColor] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  const handleOpenPopup = () => setIsPopupOpen(true);
  const handleClosePopup = () => setIsPopupOpen(false);

  const SelectInput = ({ placeholder, value, onChange, ...props }) => (
    <div className="relative w-full">
      <input
        {...props}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full border border-[#bcc6dd] rounded-lg px-4 py-2 pr-8 text-[#1c274c] bg-white focus:border-[#3452e1] focus:ring-2 focus:ring-[#3452e1] appearance-none transition cursor-pointer"
        readOnly
        tabIndex={0}
      />
      <svg
        className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
        width={16}
        height={16}
        fill="none"
        viewBox="0 0 16 16"
      >
        <path d="M4 6l4 4 4-4" stroke="#1c274c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );

  const ToggleGroup = ({ options, value, setValue, rounded = true, blueActive = false }) => (
    <div className={`flex w-full border border-[#bcc6dd] ${rounded ? "rounded-lg" : "rounded-md"} overflow-hidden`}>
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          className={`flex-1 py-2 text-center font-medium transition
            ${value === opt.value
              ? blueActive
                ? "bg-[#3452e1] text-white"
                : "bg-[#e9ecfa] text-[#3452e1]"
              : "bg-white text-[#1c274c] hover:bg-[#f4f6fc]"}
            ${opt.className || ""}`}
          onClick={() => setValue(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );

  const handleFeatureChange = (featureName) => {
    setSelectedFeatures(prevFeatures =>
      prevFeatures.includes(featureName)
        ? prevFeatures.filter(f => f !== featureName)
        : [...prevFeatures, featureName]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({
      keyword,
      paymentType,
      priceFrom: parseFloat(priceFrom) || null,
      priceTo: parseFloat(priceTo) || null,
      vatDeduction,
      discountedCars,
      premiumPartners,
      registrationFrom: parseInt(registrationFrom, 10) || null,
      registrationTo: parseInt(registrationTo, 10) || null,
      mileageFrom: parseInt(mileageFrom, 10) || null,
      mileageTo: parseInt(mileageTo, 10) || null,
      transmission,
      fuel,
      powerUnit,
      powerFrom: parseFloat(powerFrom) || null,
      powerTo: parseFloat(powerTo) || null,
      vehicleType,
      driveType4x4,
      exteriorColor: selectedExteriorColor,
      features: selectedFeatures,
    });
  };

  return (
    <aside className="w-full md:w-[340px] bg-white rounded-xl shadow-lg p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xl font-bold text-[#253887]">Filter</h4>
      </div>

      <div className="flex mb-4 border-b border-gray-200">
        <button className="flex-1 flex flex-col items-center py-2 text-[#3452e1] border-b-2 border-[#3452e1] font-semibold focus:outline-none">
          <svg width={20} height={20} fill="none" viewBox="0 0 20 20" className="mb-1">
            <circle cx={10} cy={10} r={9} stroke="currentColor" strokeWidth={1.5} />
            <circle cx={7.5} cy={5.5} r={2} stroke="currentColor" strokeWidth={1.5} />
            <circle cx={12.5} cy={14.5} r={2} stroke="currentColor" strokeWidth={1.5} />
            <path d="M3.5 10h13" stroke="currentColor" strokeWidth={1.5} />
          </svg>
          <span className="text-sm">All</span>
        </button>
        <button className="flex-1 flex flex-col items-center py-2 text-gray-400 font-semibold focus:outline-none">
          <svg width={20} height={20} fill="none" viewBox="0 0 24 24" className="mb-1">
            <rect x={5} y={3} width={14} height={18} rx={2} stroke="currentColor" strokeWidth={1.5} />
            <path d="M12 3v18" stroke="currentColor" strokeWidth={1.5} />
          </svg>
          <span className="text-sm">Saved</span>
        </button>
        <button className="flex-1 flex flex-col items-center py-2 text-gray-400 font-semibold focus:outline-none">
          <svg width={20} height={20} fill="none" viewBox="0 0 24 24" className="mb-1">
            <circle cx={12} cy={12} r={9} stroke="currentColor" strokeWidth={1.5} />
            <path d="M12 7v5l4 2" stroke="currentColor" strokeWidth={1.5} />
          </svg>
          <span className="text-sm">History</span>
        </button>
      </div>

      <form id="form-search-filter" className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <section>
          <input
            type="text"
            placeholder="Search car by keyword..."
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            className="w-full border border-[#bcc6dd] rounded-lg px-4 py-2 text-[#1c274c] bg-white focus:border-[#3452e1] focus:ring-2 focus:ring-[#3452e1] transition mb-2"
          />
          <button
            type="submit"
            className="w-full bg-[#3452e1] text-white font-bold rounded-lg py-2 text-lg transition hover:bg-[#253887] focus:outline-none"
          >
            Search
          </button>
        </section>

        <section>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#253887] font-semibold">Price (€)</span>
            <div
              data-testid="payment_type"
              className="flex bg-[#f4f6fc] rounded-lg px-2 py-1 w-fit"
            >
              <button
                type="button"
                data-test-value="installment"
                className={`px-4 py-1 rounded-lg font-medium transition
                    ${paymentType === "installment"
                      ? "bg-[#3452e1] text-white"
                      : "text-[#222] hover:bg-[#e9ecfa]"}`}
                onClick={() => setPaymentType("installment")}
                aria-pressed={paymentType === "installment"}
              >
                Instalments
              </button>
              <button
                type="button"
                data-test-value="cash"
                className={`px-4 py-1 rounded-lg font-medium transition ml-1
                    ${paymentType === "cash"
                      ? "bg-[#3452e1] text-white"
                      : "text-[#222] hover:bg-[#e9ecfa]"}`}
                onClick={() => setPaymentType("cash")}
                aria-pressed={paymentType === "cash"}
              >
                Cash
              </button>
              <input type="hidden" name="payment-type" value={paymentType} />
            </div>
          </div>
          <br />
          <div className="flex gap-2 mb-2 ">
            <SelectInput
              placeholder="From"
              type="number"
              value={priceFrom}
              onChange={(e) => setPriceFrom(e.target.value)}
            />
            <SelectInput
              placeholder="To"
              type="number"
              value={priceTo}
              onChange={(e) => setPriceTo(e.target.value)}
            />
          </div>
          <br />
          <div className="flex flex-col gap-2 mt-2">
            <label className="flex items-center gap-2 text-[#1c274c] text-[15px] font-medium">
              <input
                type="checkbox"
                className="w-5 h-5 border-[#bcc6dd] rounded focus:ring-[#3452e1]"
                checked={vatDeduction}
                onChange={(e) => setVatDeduction(e.target.checked)}
              />
              VAT deduction
            </label>
            <label className="flex items-center gap-2 text-[#1c274c] text-[15px] font-medium">
              <input
                type="checkbox"
                className="w-5 h-5 border-[#bcc6dd] rounded focus:ring-[#3452e1]"
                checked={discountedCars}
                onChange={(e) => setDiscountedCars(e.target.checked)}
              />
              Discounted cars
              <span className="ml-1 flex items-center">
                <svg width={18} height={18} fill="none" viewBox="0 0 18 18">
                  <circle cx={9} cy={9} r={8} stroke="#bcc6dd" strokeWidth={1.3} fill="#fff" />
                  <text x="9" y="13" textAnchor="middle" fontSize="11" fill="#bcc6dd" fontWeight="bold">i</text>
                </svg>
              </span>
            </label>
            <label className="flex items-center gap-2 text-[#1c274c] text-[15px] font-medium">
              <input
                type="checkbox"
                className="w-5 h-5 border-[#bcc6dd] rounded focus:ring-[#3452e1]"
                checked={premiumPartners}
                onChange={(e) => setPremiumPartners(e.target.checked)}
              />
              Premium partners
              <span className="ml-1 flex items-center">
                <svg width={18} height={18} fill="none" viewBox="0 0 18 18">
                  <circle cx={9} cy={9} r={8} stroke="#bcc6dd" strokeWidth={1.3} fill="#fff" />
                  <text x="9" y="13" textAnchor="middle" fontSize="11" fill="#bcc6dd" fontWeight="bold">i</text>
                </svg>
              </span>
            </label>
          </div>
        </section>

        <section>
          <div className="mb-2 text-xs font-extrabold uppercase text-[#1c274c] tracking-wider">REGISTRATION</div>
          <div className="flex gap-2">
            <SelectInput
              placeholder="From"
              type="number"
              value={registrationFrom}
              onChange={(e) => setRegistrationFrom(e.target.value)}
            />
            <SelectInput
              placeholder="To"
              type="number"
              value={registrationTo}
              onChange={(e) => setRegistrationTo(e.target.value)}
            />
          </div>
        </section>
        <section>
          <div className="mb-2 text-xs font-extrabold uppercase text-[#1c274c] tracking-wider">MILEAGE</div>
          <div className="flex gap-2">
            <SelectInput
              placeholder="From"
              type="number"
              value={mileageFrom}
              onChange={(e) => setMileageFrom(e.target.value)}
            />
            <SelectInput
              placeholder="To"
              type="number"
              value={mileageTo}
              onChange={(e) => setMileageTo(e.target.value)}
            />
          </div>
        </section>

        <section>
          <div className="mb-2 text-xs font-extrabold uppercase text-[#1c274c] tracking-wider">TRANSMISSION</div>
          <ToggleGroup
            options={[
              { value: "Automatic", label: "Automatic" }, // Values should match your API response
              { value: "Manual", label: "Manual" },       // Values should match your API response
              { value: "", label: "Any", className: "w-0 overflow-hidden opacity-0" } // Added "Any" option, hidden
            ]}
            value={transmission}
            setValue={setTransmission}
          />
        </section>

        <section>
          <div className="mb-2 text-xs font-extrabold uppercase text-[#1c274c] tracking-wider">FUEL</div>
          <ToggleGroup
            options={[
              { value: "Diesel", label: "Diesel" }, // Values should match your API response
              { value: "Gasoline", label: "Petrol" }, // Renamed Petrol to match your API response
              { value: "", label: "Any", className: "w-0 overflow-hidden opacity-0" } // Added "Any" option, hidden
            ]}
            value={fuel}
            setValue={setFuel}
          />
        </section>
        <section>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold uppercase text-[#1c274c] tracking-wider">POWER</span>
            <span className="flex gap-1">
              <button
                type="button"
                className={`px-2 py-1 text-xs font-bold rounded transition border border-[#bcc6dd] ${
                  powerUnit === "hp" ? "bg-[#e9ecfa] text-[#1c274c]" : "bg-white text-[#3452e1]"
                }`}
                onClick={() => setPowerUnit("hp")}
              >hp</button>
              <button
                type="button"
                className={`px-2 py-1 text-xs font-bold rounded transition border border-[#bcc6dd] ${
                  powerUnit === "kW" ? "bg-[#3452e1] text-white" : "bg-white text-[#3452e1]"
                }`}
                onClick={() => setPowerUnit("kW")}
              >kW</button>
            </span>
          </div>
          <div className="flex gap-2">
            <SelectInput
              placeholder="From"
              type="number"
              value={powerFrom}
              onChange={(e) => setPowerFrom(e.target.value)}
            />
            <SelectInput
              placeholder="To"
              type="number"
              value={powerTo}
              onChange={(e) => setPowerTo(e.target.value)}
            />
          </div>
        </section>

        <section>
          <div className="mb-2 text-xs font-extrabold uppercase text-[#1c274c] tracking-wider">VEHICLE TYPE</div>
          <div className="mb-2">
            <div className="relative w-full">
              <select
                className="w-full border border-[#bcc6dd] rounded-lg px-4 py-2 pr-8 text-[#1c274c] bg-white focus:border-[#3452e1] focus:ring-2 focus:ring-[#3452e1] appearance-none transition cursor-pointer"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
              >
                <option value="">All</option>
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Estate">Estate</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Convertible">Convertible</option>
              </select>
              <svg
                className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                width={16}
                height={16}
                fill="none"
                viewBox="0 0 16 16"
              >
                <path d="M4 6l4 4 4-4" stroke="#1c274c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <label className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              className="w-5 h-5 border-[#bcc6dd] rounded focus:ring-[#3452e1]"
              checked={driveType4x4}
              onChange={(e) => setDriveType4x4(e.target.checked)}
            />
            <span className="text-[#1c274c] text-[15px]">Drive type 4x4</span>
          </label>
        </section>


        <section>
          <div className="mb-2 text-xs font-extrabold uppercase text-[#1c274c] tracking-wider">EXTERIOR COLOR</div>
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { color: "#000", label: "Black" },
              { color: "#fff", label: "White", border: true },
              { color: "#a7b0bd", label: "Grey" },
              { color: "#e23c3c", label: "Red" },
              { color: "#456fed", label: "Blue" },
              { color: "#bfcbe3", label: "Silver" },
              { color: "#bfa678", label: "Beige" },
              { color: "#ffb84c", label: "Yellow" },
              { color: "#ff7a00", label: "Orange" },
              { color: "#a46a44", label: "Brown" },
              { color: "#6d66e8", label: "Purple" },
              { color: "#4fb548", label: "Green" }
            ].map(({ color, label, border }) => (
              <div
                key={label}
                className={`w-6 h-6 rounded-full cursor-pointer border-2 ${border ? "border-[#bcc6dd]" : "border-transparent"} ${
                  selectedExteriorColor === label ? 'ring-2 ring-[#3452e1]' : '' // Highlight selected color
                }`}
                style={{ background: color }}
                title={label}
                tabIndex={0}
                onClick={() => setSelectedExteriorColor(label)}
              />
            ))}
          </div>
        </section>

        <section className="border-t border-[#e6e8f0] pt-4">
          <div className="mb-2 text-xs font-extrabold uppercase text-[#1c274c] tracking-wider">FEATURES</div>
          <div className="flex flex-col gap-2">
            {[
              "GPS",
              "Sunroof", 
              "Leather Seats", 
              "Backup Camera", 
              "Bluetooth", 
              "Air conditioning",
              "Cruise control",
              "Heated front seats",
              "Multifunctional steering wheel",
              "Navigation system",
              "Trailer coupling",
              "LED headlights",
              "Xenon headlights"
            ].map(feat => (
              <label key={feat} className="flex items-center gap-3 text-[#1c274c] text-[15px] font-medium cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 border-[#bcc6dd] rounded focus:ring-[#3452e1]"
                  checked={selectedFeatures.includes(feat)}
                  onChange={() => handleFeatureChange(feat)}
                />
                {feat}
              </label>
            ))}
          </div>
          <button
            type="button"
            className="mt-3 ml-1 text-[#3452e1] text-[15px] font-semibold hover:underline flex items-center gap-1"
          >
            More features
            <svg width={16} height={16} fill="none" viewBox="0 0 16 16">
              <path d="M7 4l4 4-4 4" stroke="#3452e1" strokeWidth={2} strokeLinecap="round" />
            </svg>
          </button>
        </section>
      </form>
      <div className="border-t border-[#e6e8f0] pt-6 pb-2 flex">
        <button
          type="button"
          className="w-full bg-white text-[#3452e1] font-bold rounded-lg py-3 border-2 border-[#3452e1] text-lg transition hover:bg-[#e9ecfa] focus:outline-none"
          onClick={handleSubmit}
        >
          Detailed search
        </button>
      </div>
      {isPopupOpen && <SelectMakePopup onClose={handleClosePopup} />}
    </aside>
  );
}