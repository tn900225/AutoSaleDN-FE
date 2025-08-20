import React, { useState, useEffect } from "react";

// Simple SVG icons (replace with your system if you have icon lib)
const icons = {
  contact: (
    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{color: "#3e47dd"}}>
      <circle cx="12" cy="7" r="4" stroke="currentColor"/>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 21c0-3.866 3.582-7 8-7s8 3.134 8 7"/>
    </svg>
  ),
  billing: (
    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{color: "#3e47dd"}}>
      <rect width="20" height="14" x="2" y="5" rx="2" stroke="currentColor"/>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 10h20"/>
    </svg>
  ),
  password: (
    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{color: "#3e47dd"}}>
      <rect width="18" height="11" x="3" y="11" rx="2" stroke="currentColor"/>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  ),
  notification: (
    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{color: "#3e47dd"}}>
      <path d="M15 17h5l-1.405-1.405C18.37 14.803 18 13.872 18 13V9.5a6.5 6.5 0 10-13 0V13c0 .872-.37 1.803-1.595 2.595L3 17h5m7 0v1a3 3 0 11-6 0v-1m6 0H9" stroke="currentColor"/>
    </svg>
  ),
  chevronDown: (
    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24" style={{color: "#3e47dd"}}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  ),
  chevronUp: (
    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24" style={{color: "#3e47dd"}}>
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
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
};

// --- Contact Information Accordion ---
function ContactInfoAccordion({ user }) {
  // Mock user data (replace with real user prop or state)
  const [form, setForm] = useState({
    name: user?.name || "Sơn",
    surname: user?.surname || "Đinh Ngọc",
    email: user?.email || "son.dinhngoc@example.com",
    phone: user?.phone || "0987654321",
  });

  // Assume all fields are valid
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <form className="px-8 pb-8 pt-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-9">
        <div>
          <label className="block text-xs font-bold mb-2 uppercase tracking-wider">Name</label>
          <div className="relative">
            <input
              name="name"
              className="w-full border-2 rounded-lg px-4 py-3 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary border-green-400"
              value={form.name}
              onChange={handleChange}
              style={{ paddingRight: 32 }}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2">{icons.check}</span>
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold mb-2 uppercase tracking-wider">Surname</label>
          <div className="relative">
            <input
              name="surname"
              className="w-full border-2 rounded-lg px-4 py-3 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary border-green-400"
              value={form.surname}
              onChange={handleChange}
              style={{ paddingRight: 32 }}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2">{icons.check}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-9">
        <div>
          <label className="block text-xs font-bold mb-2 uppercase tracking-wider">Email</label>
          <div className="relative">
            <input
              name="email"
              type="email"
              disabled
              className="w-full border-2 rounded-lg px-4 py-3 text-lg font-semibold bg-gray-100 text-gray-500 cursor-not-allowed"
              value={form.email}
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold mb-2 uppercase tracking-wider">Telephone number</label>
          <div className="relative flex items-center border-2 border-green-400 rounded-lg px-4 py-3 text-lg font-semibold bg-white">
            <span className="mr-2">
              <span className="inline-block w-7 h-5 rounded overflow-hidden align-middle">
                <img src="https://hatscripts.github.io/circle-flags/flags/vn.svg" alt="VN" className="w-full h-full object-cover" />
              </span>
            </span>
            <span className="mr-2 text-gray-700 font-semibold">+84</span>
            <input
              name="phone"
              className="flex-1 focus:outline-none bg-transparent font-bold"
              value={form.phone}
              onChange={handleChange}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2">{icons.check}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-16 py-3 rounded-lg text-white font-bold text-lg bg-gradient-to-r from-blue-500 to-blue-700 shadow"
        >
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
function BillingInfoAccordion() {
  const [customerType, setCustomerType] = useState("Consumer");
  const [districts, setDistricts] = useState([]);
  const [city, setCity] = useState("");
  const [postal, setPostal] = useState("34117");
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [sameAsBilling, setSameAsBilling] = useState(true);

  useEffect(() => {
    fetchDaNangDistricts().then(setDistricts);
  }, []);
  return (
    <div className="px-8 pb-8 pt-2">
      <div className="flex gap-3 mb-8">
        <button
          type="button"
          className={`px-10 py-3 rounded-lg font-semibold text-lg ${customerType === "Consumer"
            ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow"
            : "bg-[#f5f7fa] text-[#191e3e] border border-[#e2e8f0]"}`}
          onClick={() => setCustomerType("Consumer")}
        >
          Consumer
        </button>
        <button
          type="button"
          className={`px-10 py-3 rounded-lg font-semibold text-lg ${customerType === "Company"
            ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow"
            : "bg-[#f5f7fa] text-[#191e3e] border border-[#e2e8f0]"}`}
          onClick={() => setCustomerType("Company")}
        >
          Company
        </button>
      </div>
      <div className="font-bold text-center text-lg text-[#6d6d6d] mb-6">
        <span className="inline-block w-24 border-t align-middle"></span>
        <span className="mx-4 text-[#2e49c9]">Billing address</span>
        <span className="inline-block w-24 border-t align-middle"></span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-xs font-bold mb-2 uppercase tracking-wider">Street</label>
          <input
            className="w-full border-2 rounded-lg px-4 py-3 text-lg font-semibold focus:outline-none"
            value={street} onChange={e => setStreet(e.target.value)}
            placeholder="Street"
          />
        </div>
        <div>
          <label className="block text-xs font-bold mb-2 uppercase tracking-wider">House number</label>
          <input
            className="w-full border-2 rounded-lg px-4 py-3 text-lg font-semibold focus:outline-none"
            value={houseNumber} onChange={e => setHouseNumber(e.target.value)}
            placeholder="House number"
          />
        </div>
        <div>
          <label className="block text-xs font-bold mb-2 uppercase tracking-wider">Postal code</label>
          <div className="relative">
            <input
              className="w-full border-2 rounded-lg px-4 py-3 text-lg font-semibold focus:outline-none border-green-400 pr-8"
              value={postal} onChange={e => setPostal(e.target.value)}
              placeholder="Postal code"
            />
            {postal && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2">{icons.check}</span>
            )}
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold mb-2 uppercase tracking-wider">District</label>
          <select
            className="w-full border-2 rounded-lg px-4 py-3 text-lg font-semibold focus:outline-none"
            value={city}
            onChange={e => setCity(e.target.value)}
          >
            <option value="">Select district</option>
            {districts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-xs font-bold mb-2 uppercase tracking-wider">Country</label>
          <div className="relative flex items-center border-2 border-green-400 rounded-lg px-4 py-3 text-lg font-semibold bg-white">
            <span className="mr-2">
              <img
                src="https://hatscripts.github.io/circle-flags/flags/vn.svg"
                alt="VN"
                className="w-7 h-7 object-cover rounded-full"
              />
            </span>
            <span className="font-semibold text-gray-800">Vietnam</span>
            <span className="ml-auto">{icons.check}</span>
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-center">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={sameAsBilling}
            onChange={e => setSameAsBilling(e.target.checked)}
            className="accent-blue-600 w-5 h-5"
          />
          <span className="ml-2 font-bold text-primary">Same as billing address</span>
        </label>
      </div>
      <div className="flex justify-end mt-8">
        <button
          type="submit"
          className="px-16 py-3 rounded-lg text-white font-bold text-lg bg-gradient-to-r from-blue-500 to-blue-700 shadow"
        >
          Save
        </button>
      </div>
    </div>
  );
}

// --- Change Password Accordion ---
function PasswordAccordion() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  return (
    <div className="px-8 pb-8 pt-2">
      <form>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold mb-2 uppercase tracking-wider">Current password</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                className="w-full border-2 rounded-lg px-4 py-3 text-lg font-semibold focus:outline-none pr-10"
                placeholder="Current password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                tabIndex={-1}
                onClick={() => setShowCurrent((v) => !v)}
              >
                {icons.eye}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold mb-2 uppercase tracking-wider">New password</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                className="w-full border-2 rounded-lg px-4 py-3 text-lg font-semibold focus:outline-none pr-10"
                placeholder="New password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                tabIndex={-1}
                onClick={() => setShowNew((v) => !v)}
              >
                {icons.eye}
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-8">
          <button
            type="submit"
            className="px-16 py-3 rounded-lg text-white font-bold text-lg bg-gradient-to-r from-blue-500 to-blue-700 shadow"
          >
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
    label: "Billing information",
    icon: icons.billing,
    detail: <BillingInfoAccordion />,
  },
  {
    label: "Change password",
    icon: icons.password,
    detail: <PasswordAccordion />,
  },
  {
    label: "Notification settings",
    icon: icons.notification,
    detail: <NotificationSettingsAccordion />,
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