import React, { useState } from "react";
import Register from "./Register";

export default function HeaderUserDropdown({ onLoginClick }) {
  const [showRegister, setShowRegister] = useState(false);

  const handleShowRegister = (e) => {
    e.preventDefault(); // Prevent default navigation
    setShowRegister(true);
  };
  const handleCloseRegister = () => {
    setShowRegister(false);
  };

  return (
    <>
      <div className="">
        {/* Arrow/top pointer */}
        
        <div className="py-4 px-7 flex flex-col gap-1">
          {/* Menu items */}
          <a href="/saved-searches" className="flex items-center gap-3 py-2 text-[#253887] hover:bg-[#f6f8fd] rounded-lg transition font-medium text-base">
            {/* Saved searches icon */}
            <svg width={22} height={22} fill="none" stroke="#3452e1" strokeWidth="1.6" viewBox="0 0 24 24">
              <rect x="4" y="4" width="16" height="16" rx="4"/><path d="M8 12l3 3 5-5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Saved searches
          </a>
          <a href="/last-searches" className="flex items-center gap-3 py-2 text-[#253887] hover:bg-[#f6f8fd] rounded-lg transition font-medium text-base">
            {/* Last searches icon */}
            <svg width={22} height={22} fill="none" stroke="#3452e1" strokeWidth="1.6" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9"/><path d="M12 8v5l3 3" strokeLinecap="round"/>
            </svg>
            Last searches
          </a>
          <a href="/favourite-cars" className="flex items-center gap-3 py-2 text-[#253887] hover:bg-[#f6f8fd] rounded-lg transition font-medium text-base">
            {/* Heart icon */}
            <svg width={22} height={22} fill="none" stroke="#3452e1" strokeWidth="1.6" viewBox="0 0 24 24">
              <path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5A5.5 5.5 0 017.5 3c1.74 0 3.41.81 4.5 2.09A5.5 5.5 0 0116.5 3 5.5 5.5 0 0122 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21z" />
            </svg>
            Favorite cars
          </a>
          <a href="/cars/orders" className="flex items-center gap-3 py-2 text-[#253887] hover:bg-[#f6f8fd] rounded-lg transition font-medium text-base">
            {/* Car icon */}
            <svg width={22} height={22} fill="none" stroke="#3452e1" strokeWidth="1.6" viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="6" rx="2"/><circle cx="7" cy="17" r="1.5"/><circle cx="17" cy="17" r="1.5"/><path d="M6 11V8a2 2 0 012-2h8a2 2 0 012 2v3"/>
            </svg>
            Orders in progress
          </a>
        </div>
        <div className="border-t border-gray-200 px-7 py-5">
          {/* Login button */}
          <button
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#3452e1] to-[#425ae7] text-white font-bold rounded-lg py-3 shadow transition hover:from-[#253887] hover:to-[#3452e1] text-base mb-3"
            onClick={onLoginClick}
          >
            <svg width={20} height={20} fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="9" r="4" />
              <path d="M4 20c0-3.314 3.134-6 7-6s7 2.686 7 6" />
            </svg>
            Login
          </button>
          <div className="text-center text-[#425187] text-sm">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-[#3452e1] font-semibold hover:underline"
              onClick={handleShowRegister}
            >
              Register
            </a>
          </div>
        </div>
      </div>
      <Register
        show={showRegister}
        onClose={handleCloseRegister}
        onShowLogin={onLoginClick}
      />
    </>
  );
}