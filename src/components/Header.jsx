import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Login from "./Login";
import HeaderUserDropdown from "./HeaderUserDropDown";

const navLinks = [
  { label: "Buy", to: "/cars" },
  { label: "How it works", to: "/how-auto-works" },
  { label: "Reviews", to: "/customer-reviews" },
  { label: "Services", to: "#", dropdown: true },
  { label: "Electric & Hybrid", to: "/electric-hybrid-vehicles" },
];

const servicesDropdown = [
  { label: "CarAudit™", to: "/caraudit" },
  { label: "Delivery", to: "/car-delivery" },
  { label: "Financing", to: "/car-financing" },
  { label: "Warranty", to: "/warranty" },
];

export default function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();
  const [showServices, setShowServices] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);

    useEffect(() => {
    if (!showDropdown) return;
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  return (
    <header className="bg-white border-b border-[#253887]">
      <div className="max-w-[1400px] mx-auto flex items-center h-16 px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center mr-10 select-none">
          <span className="text-[#3452e1] text-2xl font-extrabold italic font-[Montserrat,sans-serif] tracking-tight">
            AutoSaleDN
            <span className="text-[#3452e1] text-2xl font-extrabold not-italic align-super"></span>
          </span>
        </Link>
        {/* Menu */}
        <nav className="flex items-center gap-6">
          <Link to="/cars" className="text-[#253887] font-semibold text-base hover:text-[#3452e1] transition">Buy</Link>
          <Link to="/how-auto-works" className="text-[#253887] font-semibold text-base hover:text-[#3452e1] transition">How it works</Link>
          <Link to="/customer-reviews" className="text-[#253887] font-semibold text-base hover:text-[#3452e1] transition">Reviews</Link>
          {/* Services Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setShowServices(true)}
            onMouseLeave={() => setShowServices(false)}
          >
            <button
              className="flex items-center text-[#253887] font-semibold text-base hover:text-[#3452e1] transition"
              type="button"
            >
              Services
              <svg width={16} height={16} fill="none" className="ml-1">
                <path d="M4 6l4 4 4-4" stroke="#253887" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {showServices && (
              <div className="absolute left-0 top-full mt-2 w-40 bg-white border border-gray-200 shadow-md rounded z-50 animate-fade-in">
                {servicesDropdown.map((item) => (
                  <Link key={item.to} to={item.to} className="block px-4 py-2 text-[#253887] hover:bg-[#f6f8fd] text-sm">{item.label}</Link>
                ))}
              </div>
            )}
          </div>
          <Link to="/electric-hybrid-vehicles" className="text-[#253887] font-semibold text-base hover:text-[#3452e1] transition">Electric &amp; Hybrid</Link>
        </nav>
        {/* Actions */}
        <div className="flex items-center gap-7 ml-auto">
          {/* Heart */}
          <button className="p-1" aria-label="Favorites">
            <svg width={26} height={26} fill="none" stroke="#253887" strokeWidth={1.7} viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
          {/* Flag */}
          <button className="flex items-center" aria-label="Language">
            <img src="https://flagcdn.com/vn.svg" alt="VN" className="w-6 h-6 rounded-full border border-[#253887]" />
          </button>
          {/* User/Login */}
          <div
            className="relative flex items-center"
            ref={dropdownRef}
          >
            <button className="flex items-center gap-1 text-[#253887] font-semibold text-base" type="button" onClick={() => setShowDropdown((s) => !s)}>
              <svg width={26} height={26} fill="none" stroke="#253887" strokeWidth={1.7} viewBox="0 0 24 24">
                <circle cx="12" cy="9" r="4" />
                <path d="M4 20c0-3.314 3.134-6 7-6s7 2.686 7 6" />
              </svg>
              <span className="ml-1">Login</span>
              <svg width={16} height={16} fill="none" className="ml-1">
                <path d="M4 6l4 4 4-4" stroke="#253887" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {/* Dropdown (fake) */}
            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 shadow-md rounded z-50 min-w-[120px] py-2">
                 <HeaderUserDropdown onLoginClick={() => setShowSignInModal(true)} />
              </div>
            )}
          </div>
        </div>
      </div>
      <Login show={showSignInModal} onClose={() => setShowSignInModal(false)} />
    </header>
  );
}