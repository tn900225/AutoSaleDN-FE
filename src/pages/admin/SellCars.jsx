import React from "react";

const ChartPlaceholder = () => (
  <div className="flex flex-col items-center justify-center h-full w-full">
    <span className="block w-32 h-32 bg-gray-200 rounded-full mb-4"></span>
    <span className="text-gray-400 text-sm">Chart here</span>
  </div>
);

const OfferCard = ({ name, percent }) => (
  <div className="bg-white rounded-xl shadow-sm px-6 py-5 flex items-center mb-5">
    <img
      src="https://randomuser.me/api/portraits/men/34.jpg"
      className="w-14 h-14 rounded-full object-cover mr-6"
      alt=""
    />
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-bold text-gray-700">{name}</div>
          <div className="text-sm text-red-500 font-semibold">$16,605</div>
          <div className="text-xs text-gray-400">
            average price market average is $16,224
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold text-green-500 text-lg">{percent}%</span>
          <span className="text-xs text-gray-400">Impression Share</span>
        </div>
      </div>
      <div className="flex items-center gap-6 mt-4">
        <div className="flex items-center gap-1">
          <svg width="24" height="24"><circle cx="12" cy="12" r="10" stroke="#A78BFA" strokeWidth="2" fill="none"/><text x="10" y="17" fontSize="10" fill="#A78BFA">$811</text></svg>
        </div>
        <div className="flex gap-6">
          <div className="flex items-center gap-1">
            <svg width="18" height="18" fill="none" stroke="#A78BFA"><circle cx="9" cy="9" r="8" strokeWidth="2"/><path d="M9 2v14" strokeWidth="2"/></svg>
            <span className="text-xs text-gray-500">$1,174</span>
            <span className="text-xs text-gray-400 ml-1">Model Spend</span>
          </div>
          <div className="flex items-center gap-1">
            <svg width="18" height="18" fill="none" stroke="#F87171"><circle cx="9" cy="9" r="8" strokeWidth="2"/><path d="M9 2v14" strokeWidth="2"/></svg>
            <span className="text-xs text-gray-500">$1,174</span>
            <span className="text-xs text-gray-400 ml-1">Model Spend</span>
          </div>
          <div className="flex items-center gap-1">
            <svg width="18" height="18" fill="none" stroke="#A78BFA"><circle cx="9" cy="9" r="8" strokeWidth="2"/><path d="M9 2v14" strokeWidth="2"/></svg>
            <span className="text-xs text-gray-500">$811</span>
            <span className="text-xs text-gray-400 ml-1">Spend per Unit Turned</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function SellCars() {
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
              { label: "Sell Cars", active: true },
              { label: "Buy Cars" },
              { label: "Services" },
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
        <main className="flex-1 overflow-y-auto px-8 py-8">
          <div className="text-2xl font-bold mb-8">Sell Cars</div>
          <div className="flex gap-8 mb-8">
            {/* Car Card */}
            <div className="bg-white rounded-xl p-8 flex-1 flex flex-col items-center justify-center">
              <div className="text-xl font-bold mb-4">2022 Mercedes Benz</div>
              <img
                src="https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg"
                className="w-80 h-40 object-contain"
                alt="2022 Mercedes Benz"
              />
            </div>
            {/* Tracking History */}
            <div className="bg-white rounded-xl p-8 flex-1">
              <div className="text-lg font-semibold mb-4">Tracking History</div>
              {/* Bar Chart */}
              <div className="flex items-end h-48 gap-2">
                {[12, 14, 23, 18, 17, 15, 20].map((v, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className={`w-8 rounded-full ${
                        i === 2 ? "bg-violet-400" : "bg-violet-200"
                      }`}
                      style={{ height: `${v * 4}px` }}
                    >
                      {i === 2 && (
                        <span className="relative -top-6 left-2 text-xs bg-violet-400 text-white rounded px-2 py-0.5 shadow">
                          23km/h
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 mt-1">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Offers */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-xl font-bold">Offers</div>
            <div className="flex gap-4">
              <button className="px-6 py-2 bg-violet-100 text-violet-700 rounded-full font-semibold">New</button>
              <button className="px-6 py-2 bg-violet-100 text-violet-700 rounded-full font-semibold">Toyota</button>
            </div>
          </div>
          <div>
            <OfferCard name="Killan James" percent={45} />
            <OfferCard name="Killan James" percent={55} />
          </div>
        </main>
      </div>
    </div>
  );
}