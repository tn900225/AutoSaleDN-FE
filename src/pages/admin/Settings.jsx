import React, { useState } from "react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("Profile");

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col justify-between py-8">
        <div>
          <div className="flex items-center px-8 mb-12">
            <div className="text-2xl font-bold text-gray-800">Motiv.</div>
          </div>
          <nav className="flex flex-col gap-2">
            {[
              { label: "Dashboard" },
              { label: "Assets" },
              { label: "Booking" },
              { label: "Sell Cars" },
              { label: "Buy Cars" },
              { label: "Services" },
              { label: "Calender" },
              { label: "Messages" },
              { label: "Settings", active: true },
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
          <div className="text-2xl font-bold mb-8">Settings</div>
          {/* Tabs */}
          <div className="flex gap-8 border-b mb-8">
            {["My details", "Profile", "Password", "Email", "Notification"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 -mb-px font-semibold text-gray-700 focus:outline-none border-b-2 ${
                  activeTab === tab ? "border-violet-500 text-violet-700" : "border-transparent"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          {/* Profile Tab */}
          {activeTab === "Profile" && (
            <div className="bg-white rounded-xl p-8 max-w-2xl">
              <div className="text-lg font-bold mb-6">Profile</div>
              <div className="text-gray-400 mb-8">Update your photo and personal details here.</div>
              <div className="grid grid-cols-2 gap-8 mb-6">
                <div>
                  <label className="block text-gray-500 font-semibold mb-2">Live in</label>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-5 h-5 text-gray-400">
                      <svg width="18" height="18" fill="none" stroke="currentColor"><path d="M9 2a7 7 0 017 7c0 4.5-7 11-7 11S2 13.5 2 9a7 7 0 017-7z"/><circle cx="9" cy="9" r="2.5"/></svg>
                    </span>
                    <input type="text" className="w-full px-4 py-2 rounded-lg border bg-gray-50 outline-none" defaultValue="Zuichi, Switzerland" />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-500 font-semibold mb-2">Street Address</label>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-5 h-5 text-gray-400">
                      <svg width="18" height="18" fill="none" stroke="currentColor"><path d="M4 8V4a4 4 0 018 0v4M2 8h12v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8z"/></svg>
                    </span>
                    <input type="text" className="w-full px-4 py-2 rounded-lg border bg-gray-50 outline-none" defaultValue="2445 Crosswind Drive" />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-500 font-semibold mb-2">Email Address</label>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-5 h-5 text-gray-400">
                      <svg width="18" height="18" fill="none" stroke="currentColor"><path d="M2 4a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V4z"/><path d="M2 4l6 5 6-5"/></svg>
                    </span>
                    <input type="text" className="w-full px-4 py-2 rounded-lg border bg-gray-50 outline-none" defaultValue="uihutofficial@gmail.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-500 font-semibold mb-2">Date Of Birth</label>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-5 h-5 text-gray-400">
                      <svg width="18" height="18" fill="none" stroke="currentColor"><rect x="2" y="4" width="14" height="12" rx="2"/><path d="M16 8H2"/><path d="M6 2v2"/><path d="M12 2v2"/></svg>
                    </span>
                    <input type="text" className="w-full px-4 py-2 rounded-lg border bg-gray-50 outline-none" defaultValue="07.12.195" />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-500 font-semibold mb-2">Gender</label>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-5 h-5 text-gray-400">
                      <svg width="18" height="18" fill="none" stroke="currentColor"><circle cx="9" cy="7" r="4"/><path d="M9 11v4"/><path d="M5 15h8"/></svg>
                    </span>
                    <input type="text" className="w-full px-4 py-2 rounded-lg border bg-gray-50 outline-none" defaultValue="Male" />
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <div className="font-semibold text-gray-500 mb-2">Your photo</div>
                <div className="flex items-center gap-6">
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" className="w-16 h-16 rounded-full object-cover" alt="" />
                  <div className="flex gap-4">
                    <button className="text-red-500 font-semibold">Delete</button>
                    <button className="text-violet-500 font-semibold">Update</button>
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-2">This will be displayed on your profile.</div>
              </div>
              <div>
                <div className="font-semibold text-gray-500 mb-2">Social Profiles</div>
                <div className="flex flex-col gap-2">
                  <input type="text" className="px-4 py-2 rounded-lg border bg-gray-50 outline-none" defaultValue="facebook.com/" />
                  <input type="text" className="px-4 py-2 rounded-lg border bg-gray-50 outline-none" defaultValue="twitter.com/" />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}