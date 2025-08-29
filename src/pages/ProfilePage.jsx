import React, { useState, useEffect } from "react";
import { useUserContext } from "../components/context/UserContext";
import { getApiBaseUrl } from "../../util/apiconfig";
import Swal from "sweetalert2";

const API_BASE = getApiBaseUrl();

const icons = {
  contact: (
    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ color: "#3e47dd" }}>
      <circle cx="12" cy="7" r="4" stroke="currentColor" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 21c0-3.866 3.582-7 8-7s8 3.134 8 7" />
    </svg>
  ),
  billing: (
    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ color: "#3e47dd" }}>
      <rect width="20" height="14" x="2" y="5" rx="2" stroke="currentColor" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 10h20" />
    </svg>
  ),
  password: (
    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ color: "#3e47dd" }}>
      <rect width="18" height="11" x="3" y="11" rx="2" stroke="currentColor" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  ),
  notification: (
    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ color: "#3e47dd" }}>
      <path d="M15 17h5l-1.405-1.405C18.37 14.803 18 13.872 18 13V9.5a6.5 6.5 0 10-13 0V13c0 .872-.37 1.803-1.595 2.595L3 17h5m7 0v1a3 3 0 11-6 0v-1m6 0H9" stroke="currentColor" />
    </svg>
  ),
  chevronDown: (
    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24" style={{ color: "#3e47dd" }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  ),
  chevronUp: (
    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24" style={{ color: "#3e47dd" }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  ),
  check: (
    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  eye: (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
};

function ContactInfoAccordion() {
  const { user, setUser } = useUserContext();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    province: ""
  });

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || "",
        email: user.email || "",
        mobile: user.mobile || "",
        province: user.province || ""
      });
    }
  }, [user]);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/customer/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Profile updated successfully!",
          confirmButtonColor: "#3e47dd"
        });
        setUser?.(form);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Failed to update profile!",
          confirmButtonColor: "#d33"
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "System error",
        text: "An unexpected error occurred. Please try again later.",
        confirmButtonColor: "#d33"
      });
    }
  };

  return (
    <form className="px-8 pb-8 pt-2" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-9">
        <div>
          <label className="block text-xs font-bold mb-2 uppercase tracking-wider">Name</label>
          <input
            name="fullName"
            className="w-full border-2 rounded-lg px-4 py-3"
            value={form.fullName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-xs font-bold mb-2 uppercase tracking-wider">Province</label>
          <input
            name="province"
            className="w-full border-2 rounded-lg px-4 py-3"
            value={form.province}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-9">
        <div>
          <label className="block text-xs font-bold mb-2 uppercase tracking-wider">Email</label>
          <input
            name="email"
            type="email"
            disabled
            className="w-full border-2 rounded-lg px-4 py-3 bg-gray-100 text-gray-500"
            value={form.email}
          />
        </div>
        <div>
          <label className="block text-xs font-bold mb-2 uppercase tracking-wider">Telephone number</label>
          <input
            name="mobile"
            className="w-full border-2 rounded-lg px-4 py-3"
            value={form.mobile}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button type="submit" className="px-16 py-3 rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-700 shadow">
          Save
        </button>
      </div>
    </form>
  );
}

// --- Billing Info Accordion (as previous version) ---
async function fetchDaNangDistricts() {
  const resp = await fetch("https://provinces.open-api.vn/api/p/48?depth=2");
  const data = await resp.json();
  return data.districts.map(d => d.name);
}


// --- Change Password Accordion ---
function PasswordAccordion() {
  const [dto, setDto] = useState({ oldPassword: "", newPassword: "" });

  const handleChange = e => {
    setDto(d => ({ ...d, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
  e.preventDefault();

  // ✅ validate before calling API
  if (!dto.newPassword || dto.newPassword.length < 8) {
    Swal.fire({
      icon: "warning",
      title: "Invalid password",
      text: "New password must be at least 8 characters long.",
      confirmButtonColor: "#f59e0b"
    });
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/customer/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(dto)
    });
    const data = await res.json();

    if (res.ok) {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Password updated successfully!",
        confirmButtonColor: "#3e47dd"
      });
      setDto({ oldPassword: "", newPassword: "" });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: data.message || "Failed to change password!",
        confirmButtonColor: "#d33"
      });
    }
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: "error",
      title: "System error",
      text: "An unexpected error occurred. Please try again later.",
      confirmButtonColor: "#d33"
    });
  }
};

  return (
    <div className="px-8 pb-8 pt-2">
      <form onSubmit={handleSubmit}>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold mb-2 uppercase tracking-wider">Current password</label>
            <input
              type="password"
              name="oldPassword"
              className="w-full border-2 rounded-lg px-4 py-3"
              value={dto.oldPassword}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-2 uppercase tracking-wider">New password</label>
            <input
              type="password"
              name="newPassword"
              className="w-full border-2 rounded-lg px-4 py-3"
              value={dto.newPassword}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex justify-end mt-8">
          <button type="submit" className="px-16 py-3 rounded-lg bg-blue-600 text-white">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

// --- Notification Settings Accordion ---
function NotificationSettingsAccordion() {
  const [favVeh, setFavVeh] = useState(true);
  const [savedSearch, setSavedSearch] = useState(true);

  return (
    <div className="px-8 pb-8 pt-2">
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-white border rounded-xl px-6 py-5">
          <div>
            <div className="font-bold text-lg text-[#181e3e]">Favourite vehicles</div>
            <div className="text-sm text-[#6d6d6d]">Send notifications about discounts on favourite vehicles</div>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only"
              checked={favVeh}
              onChange={() => setFavVeh((v) => !v)}
            />
            <span className="w-11 h-6 flex items-center bg-gray-200 rounded-full p-1 duration-300 ease-in-out">
              <span
                className={`bg-blue-600 w-5 h-5 rounded-full shadow-md transform duration-300 ease-in-out ${favVeh ? "translate-x-5" : ""}`}
              />
            </span>
          </label>
        </div>
        <div className="flex items-center justify-between bg-white border rounded-xl px-6 py-5">
          <div>
            <div className="font-bold text-lg text-[#181e3e]">Saved searches</div>
            <div className="text-sm text-[#6d6d6d]">Send notifications of new offers based on saved search filters.</div>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only"
              checked={savedSearch}
              onChange={() => setSavedSearch((v) => !v)}
            />
            <span className="w-11 h-6 flex items-center bg-gray-200 rounded-full p-1 duration-300 ease-in-out">
              <span
                className={`bg-blue-600 w-5 h-5 rounded-full shadow-md transform duration-300 ease-in-out ${savedSearch ? "translate-x-5" : ""}`}
              />
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}

// Accordion config
const ACCORDIONS = [
  {
    label: "Contact information",
    icon: icons.contact,
    detail: <ContactInfoAccordion />,
  },
  {
    label: "Change password",
    icon: icons.password,
    detail: <PasswordAccordion />,
  },
];

export default function ProfilePage() {
  const [open, setOpen] = useState(-1);

  return (
    <div className="min-h-screen bg-[#ecf1f7] py-12">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-8 text-[#181e3e]">My profile</h2>
        <div className="space-y-6">
          {ACCORDIONS.map((item, idx) => (
            <div key={item.label} className="rounded-xl bg-white shadow-sm">
              <button
                className="flex w-full items-center justify-between px-7 py-6 rounded-xl focus:outline-none"
                onClick={() => setOpen(open === idx ? -1 : idx)}
                aria-expanded={open === idx}
                aria-controls={`accordion-details-${idx}`}
              >
                <div className="flex items-center gap-4">
                  {item.icon}
                  <span className="text-lg font-semibold text-[#181e3e]">{item.label}</span>
                </div>
                <span className="ml-2">
                  {open === idx ? icons.chevronUp : icons.chevronDown}
                </span>
              </button>
              {open === idx && (
                <div
                  className="border-t"
                  id={`accordion-details-${idx}`}
                >
                  {item.detail}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}