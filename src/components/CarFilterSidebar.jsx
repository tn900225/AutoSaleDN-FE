import React, { useState, useEffect, useCallback } from "react";
import SelectMakePopup from "./SelectMakePopup";
import { getApiBaseUrl } from "../../util/apiconfig";

const FilterInput = ({ placeholder, value, onChange, type = "text", ...props }) => (
  <input
    {...props}
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="w-full border border-[#bcc6dd] rounded-lg px-4 py-2 text-[#1c274c] bg-white focus:border-[#3452e1] focus:ring-2 focus:ring-[#3452e1] transition"
  />
);


export default function CarFilterSidebar({ onFilter, currentFilters }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [paymentType, setPaymentType] = useState(currentFilters.paymentType || "cash");
  const [transmission, setTransmission] = useState(currentFilters.transmission || "");
  const [keyword, setKeyword] = useState(currentFilters.keyword || "");

  const API_BASE = getApiBaseUrl();

  // Convert currentFilters.priceFrom and priceTo back to the format for selectedPriceRange
  const getInitialPriceRange = (filters) => {
    if (filters.priceFrom === null && filters.priceTo === null) return "";
    if (filters.priceFrom !== null && filters.priceTo === null) return `${filters.priceFrom}-max`;
    if (filters.priceFrom !== null && filters.priceTo !== null) return `${filters.priceFrom}-${filters.priceTo}`;
    return "";
  };

  const [selectedPriceRange, setSelectedPriceRange] = useState(getInitialPriceRange(currentFilters));
  const [vatDeduction, setVatDeduction] = useState(currentFilters.vatDeduction || false);
  const [discountedCars, setDiscountedCars] = useState(currentFilters.discountedCars || false);
  const [premiumPartners, setPremiumPartners] = useState(currentFilters.premiumPartners || false);

  // Convert currentFilters.registrationFrom and registrationTo back to the format for selectedRegistrationYearRange
  const getInitialRegistrationYearRange = (filters) => {
    if (filters.registrationFrom === null && filters.registrationTo === null) return "";
    if (filters.registrationFrom === 0 && filters.registrationTo === 2004) return "before-2005"; // Special case for "Before 2005"
    if (filters.registrationFrom !== null && filters.registrationFrom === filters.registrationTo) return `${filters.registrationFrom}-${filters.registrationTo}`;
    return "";
  };

  const [selectedRegistrationYearRange, setSelectedRegistrationYearRange] = useState(getInitialRegistrationYearRange(currentFilters));

  // Convert currentFilters.mileageFrom and mileageTo back to the format for selectedMileageRange
  const getInitialMileageRange = (filters) => {
    if (filters.mileageFrom === null && filters.mileageTo === null) return "";
    if (filters.mileageFrom !== null && filters.mileageTo === null) return `${filters.mileageFrom}-max`;
    if (filters.mileageFrom !== null && filters.mileageTo !== null) return `${filters.mileageFrom}-${filters.mileageTo}`;
    return "";
  };
  const [selectedMileageRange, setSelectedMileageRange] = useState(getInitialMileageRange(currentFilters));

  const [vehicleType, setVehicleType] = useState(currentFilters.vehicleType || "");
  const [fuelType, setFuelType] = useState(currentFilters.fuelType || ""); // Đảm bảo khai báo state fuelType

  const [driveType4x4, setDriveType4x4] = useState(currentFilters.driveType4x4 || false);
  const [selectedExteriorColor, setSelectedExteriorColor] = useState(currentFilters.exteriorColor || "");
  const [selectedFeatures, setSelectedFeatures] = useState(currentFilters.features || []);

  const [showAllFeatures, setShowAllFeatures] = useState(false);

  // State to store dynamically fetched options
  const [registrationYearOptions, setRegistrationYearOptions] = useState([]);
  const [mileageOptions, setMileageOptions] = useState([]);
  const [priceRangeOptions, setPriceRangeOptions] = useState([]);
  const [allFeaturesOptions, setAllFeaturesOptions] = useState([]);
  const [vehicleTypeOptions, setVehicleTypeOptions] = useState([]);
  const [fuelTypeOptions, setFuelTypeOptions] = useState([]);


  // --- Fetch filter options from API on component mount ---
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const yearsRes = await fetch(`${API_BASE}/api/User/cars/years`);
        if (yearsRes.ok) {
          const yearsData = await yearsRes.json();
          const options = [{ value: "", label: "Any Year" }];
          yearsData.forEach(year => options.push({ value: `${year}-${year}`, label: `${year}` }));
          // Add "Before 2005" option if applicable and not already present
          if (!options.some(opt => opt.value === "before-2005")) {
            options.push({ value: "before-2005", label: "Before 2005" });
          }
          setRegistrationYearOptions(options);
        }

        const mileageRes = await fetch(`${API_BASE}/api/User/cars/mileage-ranges`);
        if (mileageRes.ok) {
          const mileageData = await mileageRes.json();
          setMileageOptions([{ value: "", label: "Any Mileage" }, ...mileageData]);
        }

        const priceRes = await fetch(`${API_BASE}/api/User/cars/price-ranges`);
        if (priceRes.ok) {
          const priceData = await priceRes.json();
          setPriceRangeOptions([{ value: "", label: "Any Price" }, ...priceData]);
        }

        const featuresRes = await fetch(`${API_BASE}/api/User/cars/features`);
        if (featuresRes.ok) {
          const featuresData = await featuresRes.json();
          setAllFeaturesOptions(featuresData);
        }

        const vehicleTypeRes = await fetch(`${API_BASE}/api/User/cars/vehicle-types`);
        if (vehicleTypeRes.ok) {
          const vehicleTypesData = await vehicleTypeRes.json();
          setVehicleTypeOptions(vehicleTypesData.map(type => ({ value: type, label: type })));
        }
        const fuelTypeRes = await fetch(`${API_BASE}/api/User/cars/fuel-types`);
        if (fuelTypeRes.ok) {
          const fuelTypesData = await fuelTypeRes.json();
          // Remove the "All Fuel Types" entry from here
          setFuelTypeOptions(fuelTypesData.map(type => ({ value: type, label: type })));
        }

      } catch (error) {
        console.error("Failed to fetch filter options:", error);
      }
    };

    fetchFilterOptions();
  }, []); // Empty dependency array means this runs once on mount

  // --- Synchronize local state with currentFilters prop ---
  // This useEffect ensures that when currentFilters changes (e.g., from a URL param change
  // or initial load), the sidebar inputs reflect those filters.
  useEffect(() => {
    setPaymentType(currentFilters.paymentType || "cash");
    setTransmission(currentFilters.transmission || "");
    setFuelType(currentFilters.fuelType || ""); // Đồng bộ với currentFilters.fuelType
    setKeyword(currentFilters.keyword || "");
    setSelectedPriceRange(getInitialPriceRange(currentFilters)); // Use helper
    setVatDeduction(currentFilters.vatDeduction || false);
    setDiscountedCars(currentFilters.discountedCars || false);
    setPremiumPartners(currentFilters.premiumPartners || false);
    setSelectedRegistrationYearRange(getInitialRegistrationYearRange(currentFilters)); // Use helper
    setSelectedMileageRange(getInitialMileageRange(currentFilters)); // Use helper
    setVehicleType(currentFilters.vehicleType || "");
    setDriveType4x4(currentFilters.driveType4x4 || false);
    setSelectedExteriorColor(currentFilters.exteriorColor || "");
    setSelectedFeatures(currentFilters.features || []);
  }, [currentFilters]); // Rerun when currentFilters prop changes

  const handleOpenPopup = () => setIsPopupOpen(true);
  const handleClosePopup = () => setIsPopupOpen(false);


  const SelectInput = ({ placeholder, value, onChange, options, ...props }) => (
    <div className="relative w-full">
      <select
        {...props}
        value={value}
        onChange={onChange}
        className="w-full border border-[#bcc6dd] rounded-lg px-4 py-2 pr-8 text-[#1c274c] bg-white focus:border-[#3452e1] focus:ring-2 focus:ring-[#3452e1] appearance-none transition cursor-pointer"
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option.value || option.label} value={option.value}>{option.label}</option>
        ))}
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

  const parseRange = (rangeString) => {
    if (!rangeString) return { from: null, to: null };
    if (rangeString === "before-2005") return { from: 0, to: 2004 }; // Specific for year, using 0 as a placeholder for "any year before"
    if (rangeString.endsWith("-max")) {
      const from = parseFloat(rangeString.split('-')[0]);
      return { from: from, to: null };
    }
    const [fromStr, toStr] = rangeString.split('-');
    return { from: parseFloat(fromStr), to: parseFloat(toStr) };
  };

  // No resetFormFields() call in handleSubmit anymore
  const handleSubmit = (e) => {
    e.preventDefault();

    const registrationRange = parseRange(selectedRegistrationYearRange);
    const mileageRange = parseRange(selectedMileageRange);
    const priceRange = parseRange(selectedPriceRange);

    const newFilters = {
      keyword,
      paymentType,
      priceFrom: priceRange.from,
      priceTo: priceRange.to,
      vatDeduction,
      discountedCars,
      premiumPartners,
      registrationFrom: registrationRange.from,
      registrationTo: registrationRange.to,
      mileageFrom: mileageRange.from,
      mileageTo: mileageRange.to,
      transmission,
      fuelType, // ĐÃ SỬA: Đảm bảo sử dụng fuelType
      vehicleType,
      driveType4x4,
      exteriorColor: selectedExteriorColor,
      features: selectedFeatures,
    };

    onFilter(newFilters); // Apply filters via parent callback
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      keyword: '',
      paymentType: 'cash',
      priceFrom: null,
      priceTo: null,
      vatDeduction: false,
      discountedCars: false,
      premiumPartners: false,
      registrationFrom: null,
      registrationTo: null,
      mileageFrom: null,
      mileageTo: null,
      transmission: '',
      fuelType: '', // ĐÃ SỬA: Đặt lại fuelType trong defaultFilters
      powerUnit: 'kW',
      powerFrom: null,
      powerTo: null,
      vehicleType: '',
      driveType4x4: false,
      exteriorColor: '',
      features: [],
    };
    onFilter(defaultFilters); // Inform parent about filter reset
    // Reset local form fields by updating state to default/empty values
    setKeyword('');
    setPaymentType('cash');
    setSelectedPriceRange('');
    setVatDeduction(false);
    setDiscountedCars(false);
    setPremiumPartners(false);
    setSelectedRegistrationYearRange('');
    setSelectedMileageRange('');
    setTransmission('');
    setFuelType(''); // ĐÃ SỬA: Đặt lại state fuelType
    setVehicleType('');
    setDriveType4x4(false);
    setSelectedExteriorColor('');
    setSelectedFeatures([]);
    setShowAllFeatures(false);
  };


  return (
    <aside className="w-full md:w-[340px] bg-white rounded-xl shadow-lg p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xl font-bold text-[#253887]">Filters</h4>
        <button
          type="button"
          onClick={handleResetFilters}
          className="text-[#3452e1] text-sm font-semibold hover:underline"
        >
          Reset Filters
        </button>
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
        {/* <button className="flex-1 flex flex-col items-center py-2 text-gray-400 font-semibold focus:outline-none">
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
        </button> */}
      </div>

      <form id="form-search-filter" className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <section>
          <FilterInput
            placeholder="Search car by keyword..."
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-[#3452e1] text-white font-bold rounded-lg py-2 text-lg transition hover:bg-[#253887] focus:outline-none mt-2"
          >
            Search
          </button>
        </section>

        <section className="pb-4 border-b border-[#e6e8f0]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#253887] font-semibold">Price (VND)</span>
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
          <SelectInput
            placeholder="Select Price Range"
            value={selectedPriceRange}
            onChange={(e) => setSelectedPriceRange(e.target.value)}
            options={priceRangeOptions}
          />
          <div className="flex flex-col gap-2 mt-2">
           
          </div>
        </section>

        <section className="pb-4 border-b border-[#e6e8f0]">
          <div className="mb-2 text-xs font-extrabold uppercase text-[#1c274c] tracking-wider">REGISTRATION YEAR</div>
          <SelectInput
            placeholder="Select Year Range"
            value={selectedRegistrationYearRange}
            onChange={(e) => setSelectedRegistrationYearRange(e.target.value)}
            options={registrationYearOptions}
          />
        </section>

        <section className="pb-4 border-b border-[#e6e8f0]">
          <div className="mb-2 text-xs font-extrabold uppercase text-[#1c274c] tracking-wider">MILEAGE (KM)</div>
          <SelectInput
            placeholder="Select Mileage Range"
            value={selectedMileageRange}
            onChange={(e) => setSelectedMileageRange(e.target.value)}
            options={mileageOptions}
          />
        </section>

        <section className="pb-4 border-b border-[#e6e8f0]">
          <div className="mb-2 text-xs font-extrabold uppercase text-[#1c274c] tracking-wider">TRANSMISSION</div>
          <ToggleGroup
            options={[
              { value: "", label: "Any" },
              { value: "Automatic", label: "Automatic" },
              { value: "Manual", label: "Manual" },
            ]}
            value={transmission}
            setValue={setTransmission}
            blueActive={true}
            rounded={true}
          />
        </section>

        <section className="pb-4 border-b border-[#e6e8f0]">
          <div className="mb-2 text-xs font-extrabold uppercase text-[#1c274c] tracking-wider">FUEL TYPE</div>
          <div className="mb-2">
            <SelectInput
              placeholder="All Fuel Types"
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value)}
              options={fuelTypeOptions}
            />
          </div>
        </section>

        <section className="pb-4 border-b border-[#e6e8f0]">
          <div className="mb-2 text-xs font-extrabold uppercase text-[#1c274c] tracking-wider">VEHICLE TYPE</div>
          <div className="mb-2">
            <SelectInput
              placeholder="All Vehicle Types"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              options={vehicleTypeOptions}
            />
          </div>

        </section>

        <section className="border-b border-[#e6e8f0] pt-4">
          <div className="mb-2 text-xs font-extrabold uppercase text-[#1c274c] tracking-wider">FEATURES</div>
          <div className="flex flex-col gap-2">
            {allFeaturesOptions.slice(0, showAllFeatures ? allFeaturesOptions.length : 4).map(feat => (
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
          {allFeaturesOptions.length > 4 && (
            <button
              type="button"
              className="mt-3 ml-1 text-[#3452e1] text-[15px] font-semibold hover:underline flex items-center gap-1"
              onClick={() => setShowAllFeatures(!showAllFeatures)}
            >
              {showAllFeatures ? "Show less" : "Show more"} features
              <svg width={16} height={16} fill="none" viewBox="0 0 16 16" className={`transform transition-transform ${showAllFeatures ? 'rotate-180' : ''}`}>
                <path d="M7 4l4 4-4 4" stroke="#3452e1" strokeWidth={2} strokeLinecap="round" />
              </svg>
            </button>
          )}
        </section>
      </form>
      <div className="border-t border-[#e6e8f0] pt-6 pb-2 flex">
        <button
          type="button"
          className="w-full bg-white text-[#3452e1] font-bold rounded-lg py-3 border-2 border-[#3452e1] transition hover:bg-[#e9ecfa] focus:outline-none"
          onClick={handleResetFilters}
        >
          Reset Filters
        </button>
      </div>
      {isPopupOpen && <SelectMakePopup onClose={handleClosePopup} />}
    </aside>
  );
}