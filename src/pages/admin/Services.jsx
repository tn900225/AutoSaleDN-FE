import React from "react";

export default function Services() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col justify-between py-8">
        <div>
          <div className="flex items-center px-8 mb-12">
            <div className="text-2xl font-bold text-gray-800">AutoSaleDN.</div>
          </div>
          <nav className="flex flex-col gap-2">
            {[
              { label: "Dashboard" },
              { label: "Assets" },
              { label: "Booking" },
              { label: "Sell Cars" },
              { label: "Buy Cars" },
              { label: "Services", active: true },
              { label: "Calender" },
              { label: "Messages" },
            ].map((item) => (
              <a
                key={item.label}
                className={`flex items-center px-8 py-2 rounded-md text-gray-700 hover:bg-violet-50 transition ${
                  item.active ? "bg-violet-100 text-violet-700" : ""
                }`}
                href="#"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="px-8">
          <a
            href="#"
            className="block text-gray-500 hover:text-gray-900 mb-2"
          >
            Settings
          </a>
          <a
            href="#"
            className="block text-gray-500 hover:text-gray-900"
          >
            Log out
          </a>
        </div>
      </aside>
      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 px-8 flex items-center justify-between bg-white border-b">
          <div className="flex items-center w-full max-w-md relative">
            <input
              type="text"
              placeholder="Search or type"
              className="w-full px-12 py-2 border rounded-lg bg-gray-50 outline-none"
            />
            <span className="absolute left-4 text-gray-400">
              <svg width="18" height="18" fill="none" stroke="currentColor"><circle cx="8" cy="8" r="7" strokeWidth="2"/><path d="M16 16l-3.5-3.5" strokeWidth="2" strokeLinecap="round"/></svg>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <svg width="22" height="22" fill="none" stroke="currentColor">
                <path d="M11 21c1.1 0 2-.9 2-2h-4a2 2 0 002 2zM18 16v-5c0-3.07-1.63-5.64-5-6.32V4a1 1 0 10-2 0v.68C7.63 5.36 6 7.92 6 11v5l-1 1v1h14v-1l-1-1z" />
              </svg>
            </button>
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white flex items-center justify-center">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="profile" />
            </div>
          </div>
        </header>
        {/* Content */}
        <main className="flex-1 px-8 py-8 overflow-y-auto">
          <div className="flex gap-8 mb-8">
            {/* Service Station */}
            <div className="flex-1 bg-white rounded-xl p-8">
              <div className="text-lg font-bold mb-6">Service Station</div>
              <div className="grid grid-cols-10 gap-3 mb-4">
                {["A1","A2","A3","A4","A5","A6","A7","A8","A9","A10"].map((s, i) => (
                  <div key={s} className={`h-12 flex items-center justify-center rounded-xl text-sm font-semibold ${s === "A4" ? "bg-red-200 text-red-600" : "bg-gray-100 text-gray-500"}`}>{s}</div>
                ))}
                {["B1","B2","B3","B4","B5","B6","B7","B8","B9","B10"].map((s, i) => (
                  <div key={s} className={`h-12 flex items-center justify-center rounded-xl text-sm font-semibold ${s === "B7" ? "bg-violet-200 text-violet-600" : s === "B1" ? "bg-red-200 text-red-600" : "bg-gray-100 text-gray-500"}`}>{s}</div>
                ))}
              </div>
              <div className="flex gap-4 mb-8">
                <label className="flex items-center gap-2">
                  <input type="radio" name="stationStatus" className="form-radio text-green-500" defaultChecked /> <span className="text-sm text-gray-500">Ready</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="stationStatus" className="form-radio text-red-500" /> <span className="text-sm text-gray-500">Booked</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="stationStatus" className="form-radio text-violet-500" /> <span className="text-sm text-gray-500">Current Station</span>
                </label>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-lg font-bold mb-2">Your Order</div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-24 h-24 rounded-full border-4 border-violet-300 flex items-center justify-center text-2xl font-bold text-violet-500">5,<span className="text-lg text-gray-700">2h</span></div>
                  <div>
                    <div className="flex items-center gap-2 mb-1"><span className="w-3 h-3 bg-green-400 rounded-full"></span> Brake fluid change <span className="ml-2 text-violet-500 font-semibold">$32</span></div>
                    <div className="flex items-center gap-2 mb-1"><span className="w-3 h-3 bg-violet-400 rounded-full"></span> Diagnostics <span className="ml-2 text-violet-500 font-semibold">$32</span></div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 bg-violet-200 rounded-full"></span> External Washing <span className="ml-2 text-violet-500 font-semibold">$10</span></div>
                  </div>
                </div>
                <button className="w-full bg-violet-500 hover:bg-violet-600 text-white font-bold py-3 rounded-full transition mb-3">Add Services</button>
                <button className="w-full bg-violet-500 hover:bg-violet-600 text-white font-bold py-3 rounded-full transition">Pay $86</button>
              </div>
            </div>
            {/* Service Required */}
            <div className="flex-1 flex flex-col gap-8">
              <div className="bg-white rounded-xl p-8">
                <div className="text-lg font-bold mb-6">Service Required</div>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="w-2.5 h-2.5 bg-green-400 rounded-full inline-block"></span>
                    <span className="font-semibold text-gray-700">Center Care</span>
                    <span className="ml-auto text-gray-400">Price : <span className="font-semibold text-violet-500">$48</span></span>
                    <span className="ml-4 text-gray-400">Processing : 1 hours</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="w-2.5 h-2.5 bg-violet-400 rounded-full inline-block"></span>
                    <span className="font-semibold text-gray-700">Diagnostics</span>
                    <span className="ml-auto text-gray-400">Price : <span className="font-semibold text-violet-500">$78</span></span>
                    <span className="ml-4 text-gray-400">Processing : 2 hours</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="w-2.5 h-2.5 bg-violet-200 rounded-full inline-block"></span>
                    <span className="font-semibold text-gray-700">Inner Cleaning</span>
                    <span className="ml-auto text-gray-400">Price : <span className="font-semibold text-violet-500">$78</span></span>
                    <span className="ml-4 text-gray-400">Processing : 1 hours</span>
                  </div>
                </div>
              </div>
              {/* Service Schedule */}
              <div className="bg-white rounded-xl p-8">
                <div className="text-lg font-bold mb-6">Service Schedule</div>
                <div className="flex flex-col gap-4">
                  <label className="flex items-center gap-3">
                    <input type="radio" className="form-radio text-violet-500" name="schedule" defaultChecked />
                    <span className="text-sm text-gray-700">Upgrade your favorite car periodically</span>
                    <span className="ml-auto text-gray-400 text-xs">Today, 10.00</span>
                    <span className="ml-2 text-gray-400 text-xs">Fix Price : <span className="font-semibold text-violet-500">$1,200</span></span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="radio" className="form-radio text-violet-500" name="schedule" />
                    <span className="text-sm text-gray-700">Buy spare parts for suspension</span>
                    <span className="ml-auto text-gray-400 text-xs">Today, 14.00</span>
                    <span className="ml-2 text-gray-400 text-xs">Fix Price : <span className="font-semibold text-violet-500">$1,400</span></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          {/* Bottom Cards */}
          <div className="mt-8 grid grid-cols-4 gap-6">
            <div className="bg-white rounded-xl px-6 py-5 flex flex-col items-center">
              <img src="https://cdn-icons-png.flaticon.com/512/854/854894.png" className="w-14 h-14 mb-3" alt="Oil Level" />
              <div className="text-sm font-bold text-gray-700">Oil Level</div>
              <div className="text-xs text-gray-400">Engine | Don’t Replace</div>
              <div className="w-full h-1 rounded-full bg-violet-200 mt-3"></div>
            </div>
            <div className="bg-white rounded-xl px-6 py-5 flex flex-col items-center">
              <img src="https://cdn-icons-png.flaticon.com/512/854/854894.png" className="w-14 h-14 mb-3" alt="Brake Pads" />
              <div className="text-sm font-bold text-gray-700">Brake Pads</div>
              <div className="text-xs text-gray-400">Wheels | Still Good</div>
              <div className="w-full h-1 rounded-full bg-green-300 mt-3"></div>
            </div>
            <div className="bg-white rounded-xl px-6 py-5 flex flex-col items-center">
              <img src="https://cdn-icons-png.flaticon.com/512/854/854894.png" className="w-14 h-14 mb-3" alt="Steering" />
              <div className="text-sm font-bold text-gray-700">Steering</div>
              <div className="text-xs text-gray-400">Drivetrain | Need Change</div>
              <div className="w-full h-1 rounded-full bg-orange-300 mt-3"></div>
            </div>
            <div className="bg-white rounded-xl px-6 py-5 flex flex-col items-center">
              <img src="https://cdn-icons-png.flaticon.com/512/854/854894.png" className="w-14 h-14 mb-3" alt="Oil Level" />
              <div className="text-sm font-bold text-gray-700">Oil Level</div>
              <div className="text-xs text-gray-400">Engine | Don’t Replace</div>
              <div className="w-full h-1 rounded-full bg-orange-400 mt-3"></div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}