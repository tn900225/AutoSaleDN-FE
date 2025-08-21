import React from "react";

export default function Messages() {
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
              { label: "Messages", active: true },
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
              {/* bell icon */}
              <svg width="22" height="22" fill="none" stroke="currentColor">
                <path d="M11 21c1.1 0 2-.9 2-2h-4a2 2 0 002 2zM18 16v-5c0-3.07-1.63-5.64-5-6.32V4a1 1 0 10-2 0v.68C7.63 5.36 6 7.92 6 11v5l-1 1v1h14v-1l-1-1z" />
              </svg>
            </button>
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white flex items-center justify-center">
              {/* Avatar */}
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="profile" />
            </div>
          </div>
        </header>
        {/* Content */}
        <main className="flex flex-1 overflow-hidden">
          {/* Chat List */}
          <div className="w-96 bg-white border-r p-8 overflow-y-auto">
            <div className="font-bold text-xl mb-6">Messages</div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 rounded-lg bg-gray-100 focus:outline-none"
              />
            </div>
            {/* Pinned */}
            <div className="mb-6">
              <div className="uppercase text-xs text-gray-400 mb-2">Pinned</div>
              <div className="flex items-center gap-4 py-2">
                <img
                  src="https://randomuser.me/api/portraits/men/34.jpg"
                  className="w-12 h-12 rounded-full object-cover"
                  alt=""
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Killan James</span>
                    <span className="text-xs text-gray-400">4:30 PM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-green-400">Typing...</span>
                  </div>
                </div>
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full inline-block"></span>
              </div>
            </div>
            {/* All Message */}
            <div className="uppercase text-xs text-gray-400 mb-2">All Message</div>
            {/* List */}
            {[
              {
                img: "https://randomuser.me/api/portraits/men/37.jpg",
                name: "Desian Tam",
                lastMsg: "Hello! Everyone",
                time: "9:36 AM",
                status: "read",
              },
              {
                img: "https://randomuser.me/api/portraits/men/39.jpg",
                name: "Ahmed Medi",
                lastMsg: "Wow really Cool 🔥",
                time: "1:15 AM",
                status: "unread",
              },
              {
                img: "https://randomuser.me/api/portraits/women/56.jpg",
                name: "Claudia Maudi",
                lastMsg: "Nice",
                time: "4:30 PM",
                status: "read",
              },
              {
                img: "https://randomuser.me/api/portraits/men/44.jpg",
                name: "Novita",
                lastMsg: "yah, nice design",
                time: "4:30 PM",
                status: "read",
              },
              {
                img: "https://randomuser.me/api/portraits/women/57.jpg",
                name: "Milie Nose",
                lastMsg: "Awesome 🔥",
                time: "8:20 PM",
                status: "unread",
              },
              {
                img: "https://randomuser.me/api/portraits/men/42.jpg",
                name: "Ikhsan SD",
                lastMsg: "🎤 Voice message",
                time: "yesterday",
                status: "read",
              },
              {
                img: "https://randomuser.me/api/portraits/men/46.jpg",
                name: "Aditya",
                lastMsg: "publish now",
                time: "yesterday",
                status: "read",
              },
            ].map((m, i) => (
              <div key={i} className="flex items-center gap-4 py-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                <img src={m.img} className="w-12 h-12 rounded-full object-cover" alt="" />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">{m.name}</span>
                    <span className="text-xs text-gray-400">{m.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{m.lastMsg}</span>
                  </div>
                </div>
                {m.status === "unread" && (
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full inline-block"></span>
                )}
              </div>
            ))}
          </div>
          {/* Chat window */}
          <div className="flex-1 flex flex-col px-8 py-8 overflow-y-auto">
            {/* Chat header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <img
                  src="https://randomuser.me/api/portraits/men/34.jpg"
                  className="w-12 h-12 rounded-full object-cover"
                  alt=""
                />
                <div>
                  <div className="text-lg font-semibold text-gray-800">Killan James</div>
                  <div className="text-xs text-gray-400">Active Now</div>
                </div>
              </div>
              <div className="flex gap-4">
                <button className="p-2 rounded-full hover:bg-gray-100 border">
                  <svg width="18" height="18" fill="none" stroke="currentColor"><path d="M15 12v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h1"/><path d="M15 5V4a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-1"/><path d="M9 12l6-6"/></svg>
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 border">
                  <svg width="18" height="18" fill="none" stroke="currentColor"><circle cx="9" cy="9" r="7" strokeWidth="2"/><path d="M15 15l-3.5-3.5" strokeWidth="2" strokeLinecap="round"/></svg>
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 border">
                  <svg width="18" height="18" fill="none" stroke="currentColor"><path d="M9 16a7 7 0 100-14 7 7 0 000 14z" /><path d="M15 15l-3.5-3.5" strokeLinecap="round" /></svg>
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 border">
                  <svg width="18" height="18" fill="none" stroke="currentColor"><circle cx="9" cy="9" r="7" strokeWidth="2"/><path d="M9 12l6-6"/></svg>
                </button>
              </div>
            </div>
            {/* Messages */}
            <div className="flex flex-col gap-4 mb-6">
              {/* Received */}
              <div className="flex gap-4 items-end">
                <img src="https://randomuser.me/api/portraits/men/34.jpg" className="w-10 h-10 rounded-full object-cover" alt="" />
                <div>
                  <div className="bg-gray-100 px-5 py-3 rounded-2xl text-gray-700 max-w-md">
                    Hi, I hope you are doing well, yesterday you have gave a pen This very nice, i am very happy for this.yesterday you have gave a pen This very nice
                  </div>
                  <div className="text-xs text-gray-400 mt-1 text-right">4:30 PM</div>
                </div>
              </div>
              {/* Sent */}
              <div className="flex gap-4 items-end justify-end">
                <div>
                  <div className="bg-violet-500 text-white px-5 py-3 rounded-2xl max-w-md">
                    yea I'm well, Thank you, i am very happy for this.yesterday you have gave a pen This very nice
                  </div>
                  <div className="text-xs text-gray-400 mt-1 text-right">4:30 PM</div>
                </div>
                <img src="https://randomuser.me/api/portraits/men/32.jpg" className="w-10 h-10 rounded-full object-cover" alt="" />
              </div>
              {/* Received */}
              <div className="flex gap-4 items-end">
                <img src="https://randomuser.me/api/portraits/men/34.jpg" className="w-10 h-10 rounded-full object-cover" alt="" />
                <div>
                  <div className="bg-gray-100 px-5 py-3 rounded-2xl text-gray-700 max-w-md">
                    Hi, I hope you are doing well, yesterday you have gave a pen This very nice
                  </div>
                </div>
              </div>
              {/* Received */}
              <div className="flex gap-4 items-end">
                <img src="https://randomuser.me/api/portraits/men/34.jpg" className="w-10 h-10 rounded-full object-cover" alt="" />
                <div>
                  <div className="bg-gray-100 px-5 py-3 rounded-2xl text-gray-700 max-w-md">
                    i am very happy for this.yesterday you have gave a pen This very nice
                  </div>
                </div>
              </div>
              {/* Sent */}
              <div className="flex gap-4 items-end justify-end">
                <div>
                  <div className="bg-violet-500 text-white px-5 py-3 rounded-2xl max-w-md">
                    yea I'm well, Thank you, i am very happy for this.yesterday you have gave a pen This very nice
                  </div>
                  <div className="text-xs text-gray-400 mt-1 text-right">4:30 PM</div>
                </div>
                <img src="https://randomuser.me/api/portraits/men/32.jpg" className="w-10 h-10 rounded-full object-cover" alt="" />
              </div>
              {/* Voice message */}
              <div className="flex gap-4 items-end">
                <img src="https://randomuser.me/api/portraits/men/34.jpg" className="w-10 h-10 rounded-full object-cover" alt="" />
                <div className="bg-gray-100 px-5 py-3 rounded-2xl max-w-md flex items-center gap-4">
                  <svg width="40" height="40"><circle cx="20" cy="20" r="18" stroke="#A78BFA" strokeWidth="2" fill="none" /><polygon points="16,14 26,20 16,26" fill="#A78BFA" /></svg>
                  <div>
                    <div className="w-32 h-2 bg-violet-200 rounded-full mb-1">
                      <div className="h-2 bg-violet-500 rounded-full w-2/3"></div>
                    </div>
                    <span className="text-xs text-gray-400">1:25</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Message input */}
            <div className="flex items-center gap-4 mt-auto">
              <input
                type="text"
                placeholder="Type Something..."
                className="flex-1 px-6 py-3 bg-gray-100 rounded-full outline-none"
              />
              <button className="bg-violet-500 hover:bg-violet-600 text-white rounded-full px-5 py-3">
                <svg width="22" height="22" fill="none" stroke="currentColor"><path d="M2 12l9-9 9 9M12 3v18"/></svg>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}