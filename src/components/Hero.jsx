import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getApiBaseUrl } from "../../util/apiconfig";

// URL ảnh nền
const HERO_BG =
  "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1500&q=80";

export default function Hero() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);
  const API_BASE = getApiBaseUrl();

  // State cho các trường nhập liệu của form tìm kiếm
  const [keyword, setKeyword] = useState('');
  const [selectedMileageRange, setSelectedMileageRange] = useState('');
  const [selectedRegistrationYear, setSelectedRegistrationYear] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [vatDeduction, setVatDeduction] = useState(false);

  // State để lưu các tùy chọn được tải động từ API
  const [mileageOptions, setMileageOptions] = useState([]);
  const [registrationYearOptions, setRegistrationYearOptions] = useState([]);
  const [priceRangeOptions, setPriceRangeOptions] = useState([]);

  // Tải các tùy chọn bộ lọc từ API khi component được mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [mileageRes, yearsRes, priceRes] = await Promise.all([
          fetch(`${API_BASE}/api/User/cars/mileage-ranges`),
          fetch(`${API_BASE}/api/User/cars/years`),
          fetch(`${API_BASE}/api/User/cars/price-ranges`)
        ]);

        if (mileageRes.ok) {
          const mileageData = await mileageRes.json();
          setMileageOptions([{ value: "", label: "Mileage up to" }, ...mileageData]);
        }
        if (yearsRes.ok) {
          const yearsData = await yearsRes.json();
          const yearOptions = yearsData.map(year => ({ value: `${year}`, label: `${year}` }));
          setRegistrationYearOptions([{ value: "", label: "Registration from" }, ...yearOptions]);
        }
        if (priceRes.ok) {
          const priceData = await priceRes.json();
          setPriceRangeOptions([{ value: "", label: "Price up to" }, ...priceData]);
        }
      } catch (error) {
        console.error("Failed to fetch hero filter options:", error);
      }
    };

    fetchFilterOptions();
  }, [API_BASE]);

  // Hàm helper để phân tích chuỗi khoảng giá trị
  const parseRange = (rangeString) => {
    if (!rangeString || !rangeString.includes('-')) return { from: null, to: null };
    const [fromStr, toStr] = rangeString.split('-');
    if (toStr === 'max') {
        return { from: parseFloat(fromStr), to: null };
    }
    return { from: parseFloat(fromStr), to: parseFloat(toStr) };
  };

  // Hàm xử lý việc gửi form tìm kiếm chính
  const handleSubmit = (e) => {
    e.preventDefault();
    const priceRange = parseRange(selectedPriceRange);
    const mileageRange = parseRange(selectedMileageRange);

    const filters = {
      keyword,
      priceFrom: priceRange.from,
      priceTo: priceRange.to,
      registrationFrom: selectedRegistrationYear ? parseInt(selectedRegistrationYear, 10) : null,
      registrationTo: null,
      mileageFrom: mileageRange.from,
      mileageTo: mileageRange.to,
      vatDeduction,
    };

    navigate("/cars", { state: { initialFilter: filters } });
  };

  const benefitDetails = [
    "You have 14 days to return the car after delivery. We refund your money in full if you are not satisfied and the car is in the same condition as delivered.",
    "Every car is inspected by our certified experts. You receive a detailed CarAudit™ report on technical and legal state, so you can buy with full peace of mind.",
    "Your car comes with a free 6-month warranty covering major mechanical and electrical components. Drive worry-free right from the start.",
  ];

  const benefits = [
    { img: "/images/finance-32.svg", alt: "Money-back guarantee", title: "Money back guarantee", desc: "If you don't fall in love with the vehicle, simply return it to us." },
    { img: "/images/caraudit-32.svg", alt: "Safe purchase", title: "Safe purchase", desc: "We guarantee the technical condition of every vehicle sold." },
    { img: "/images/legal-32.svg", alt: "6-month warranty", title: "6-month warranty", desc: "In addition, with every car you receive an extended warranty." },
  ];

  const detailClass = "bg-white text-[#253887] rounded-xl p-4 shadow border border-[#e6e9f3] text-sm";

  const SelectInput = ({ value, onChange, options, name }) => (
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-[#253887] placeholder:text-gray-400 focus:ring-2 focus:ring-[#3452e1] focus:border-[#3452e1] transition appearance-none cursor-pointer"
      >
        {options.map(option => (
          <option key={option.value || option.label} value={option.value}>{option.label}</option>
        ))}
      </select>
      <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg width={16} height={16} fill="none" viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" stroke="#253887" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
    </div>
  );

  return (
    <section
      className="relative bg-[#f6f8fd] border-b border-[#e6e9f3]"
      style={{
        backgroundImage: `linear-gradient(rgba(36,56,135,0.56), rgba(36,56,135,0.56)), url('${HERO_BG}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between py-12 px-4 md:px-8 gap-8">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#fff] mb-6 leading-tight drop-shadow-lg">
            You choose your car online.<br className="hidden md:block" /> We inspect it and you pick it up at our showroom.
          </h1>
          <div className="bg-white shadow rounded-xl p-6 w-full max-w-xl">
            <form className="flex flex-col gap-6" id="form-homepage-filter" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Make/Model */}
                <div>
                  <label htmlFor="make" className="sr-only">Make or model</label>
                  <input
                    id="make"
                    name="make"
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-[#253887] placeholder:text-gray-400 focus:ring-2 focus:ring-[#3452e1] focus:border-[#3452e1] transition"
                    placeholder="Make or model (e.g., Toyota)"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
                {/* Mileage */}
                <SelectInput
                  name="mileage-to"
                  value={selectedMileageRange}
                  onChange={(e) => setSelectedMileageRange(e.target.value)}
                  options={mileageOptions}
                />
                {/* Registration from */}
                <SelectInput
                  name="registration-date-from"
                  value={selectedRegistrationYear}
                  onChange={(e) => setSelectedRegistrationYear(e.target.value)}
                  options={registrationYearOptions}
                />
                {/* Price up to */}
                <SelectInput
                  name="price-to"
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  options={priceRangeOptions}
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-[#3452e1] h-5 w-5 rounded border border-gray-300"
                    checked={vatDeduction}
                    onChange={(e) => setVatDeduction(e.target.checked)}
                  />
                  <span className="text-[#253887] text-sm font-medium">VAT deduction</span>
                </label>
                <div className="flex-1" />
                <button type="submit" className="bg-[#3452e1] hover:bg-[#253887] text-white font-bold rounded-lg px-6 py-2 shadow-sm transition" data-testid="feature.car_selector.search">
                  Search Cars
                </button>
                {/* === NÚT ĐÃ ĐƯỢC CẬP NHẬT === */}
                <button
                  type="button"
                  className="flex items-center gap-1 border border-[#3452e1] text-[#3452e1] hover:bg-[#e9ecfa] font-semibold px-4 py-2 rounded-lg transition text-sm"
                  onClick={() => navigate('/cars')}
                >
                  Advanced search
                  <svg width={20} height={20} fill="none" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke="#3452e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Benefits Section */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col md:flex-row gap-6">
          {benefits.map((b, i) => (
            <div key={b.title} className="flex flex-col items-center flex-1">
              <div className="bg-white shadow rounded-xl p-6 flex items-start gap-4 w-full min-h-[184px]">
                <img src={b.img} alt={b.alt} className="w-10 h-10 flex-shrink-0" />
                <div>
                  <h6 className="text-[#253887] font-bold text-lg mb-1">{b.title}</h6>
                  <p className="text-[#425187] text-sm mb-2">{b.desc}</p>
                  <button
                    type="button"
                    className="text-[#3452e1] font-semibold text-sm flex items-center gap-1 hover:underline focus:outline-none"
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  >
                    {openIndex === i ? "Less" : "More"}
                    <svg width={16} height={16} fill="#3452e1" viewBox="0 0 16 16">
                      <circle cx="8" cy="8" r="8" fill="#3452e1" />
                      {openIndex === i ? (
                        <rect x="4" y="7.25" width="8" height="1.5" rx="0.75" fill="#fff" />
                      ) : (
                        <>
                          <rect x="4" y="7.25" width="8" height="1.5" rx="0.75" fill="#fff" />
                          <rect x="7.25" y="4" width="1.5" height="8" rx="0.75" fill="#fff" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>
              <div
                className={`transition-all duration-300 ${openIndex === i ? "max-h-[200px] mt-3 opacity-100" : "max-h-0 mt-0 opacity-0 pointer-events-none"} overflow-hidden w-full`}
                aria-hidden={openIndex !== i}
              >
                <div className={detailClass}>
                  {benefitDetails[i]}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}