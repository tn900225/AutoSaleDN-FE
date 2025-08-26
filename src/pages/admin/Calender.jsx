import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

export default function AdminCalender() {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminTopbar />
        <main className="p-8">
          <div className="text-2xl font-semibold mb-6">Calender</div>
          <div className="grid grid-cols-3 gap-6">
            {/* Calendar & Filters */}
            <div>
              <div className="bg-white rounded-2xl p-6 mb-6">
                <div className="font-semibold text-lg mb-2">March, 2022</div>
                <div className="flex gap-3 mb-4">
                  <button className="px-4 py-1 rounded-lg bg-gray-100 text-gray-800 font-medium">
                    Week
                  </button>
                  <button className="px-4 py-1 rounded-lg bg-violet-100 text-violet-600 font-medium">
                    Month
                  </button>
                </div>
                {/* Calendar grid */}
                <div className="grid grid-cols-7 text-center gap-y-3">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                    <div key={d} className="text-xs text-gray-400">
                      {d}
                    </div>
                  ))}
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
                    <div
                      key={date}
                      className={`py-1.5 rounded-full ${
                        date === 16
                          ? "bg-violet-500 text-white font-semibold"
                          : "text-gray-700"
                      }`}
                    >
                      {date}
                    </div>
                  ))}
                </div>
              </div>
              {/* Upcoming Events */}
              <div className="bg-white rounded-2xl p-6">
                <div className="font-semibold mb-3">Upcoming Events</div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-3 items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span className="text-xs font-medium">
                      09:00 Drift Series Firs Round <span className="text-gray-400">JDM</span>
                    </span>
                    <span className="flex ml-auto text-xs">+8</span>
                  </div>
                  <div className="flex gap-3 items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-xs font-medium">
                      12:00 Drift Series Firs Round <span className="text-gray-400">JDM</span>
                    </span>
                    <span className="flex ml-auto text-xs">+5</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Filters + Event List */}
            <div className="col-span-2 flex flex-col gap-6">
              <div className="flex gap-4 mb-4">
                <button className="px-5 py-2 rounded-lg bg-gray-100 text-gray-900 font-medium">
                  Toyota
                </button>
                <button className="px-5 py-2 rounded-lg bg-gray-100 text-gray-900 font-medium">
                  Time
                </button>
                <button className="px-5 py-2 rounded-lg bg-gray-100 text-gray-900 font-medium">
                  Status
                </button>
                <button className="px-5 py-2 rounded-lg bg-blue-100 text-blue-600 font-medium">
                  Day
                </button>
                <button className="px-5 py-2 rounded-lg bg-white text-gray-900 font-medium border">
                  <span className="text-gray-600">Mar 15, 2022</span>
                </button>
              </div>
              {/* Event Timeline */}
              <div className="bg-white rounded-2xl p-6">
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="bg-purple-400 rounded-md py-2 px-4 text-white font-medium flex justify-between">
                      <span>08:00 am Moto Track Day</span>
                      <span>154K</span>
                    </div>
                  </div>
                  <div>
                    <div className="bg-purple-500 rounded-md py-2 px-4 text-white font-medium flex justify-between">
                      <span>
                        09:45 Drift Swires Second Round <span className="ml-3 text-xs">1h 45 min</span>
                      </span>
                      <span>JDM</span>
                    </div>
                  </div>
                  <div>
                    <div className="bg-blue-400 rounded-md py-2 px-4 text-white font-medium flex justify-between">
                      <span>10:00 am Moto Track Day</span>
                      <span>154K</span>
                    </div>
                  </div>
                  <div>
                    <div className="bg-gray-200 rounded-md py-2 px-4 text-gray-700 font-medium flex justify-between">
                      <span>10:45 am Drift Swires Second Round</span>
                      <span>58K</span>
                    </div>
                  </div>
                  <div>
                    <div className="bg-green-400 rounded-md py-2 px-4 text-white font-medium flex justify-between">
                      <span>01:00 pm Moto Track Day</span>
                      <span>145K</span>
                    </div>
                  </div>
                  <div>
                    <div className="bg-orange-400 rounded-md py-2 px-4 text-white font-medium flex justify-between">
                      <span>02:00 pm Private Event</span>
                      <span>134K</span>
                    </div>
                  </div>
                  <div>
                    <div className="bg-gray-200 rounded-md py-2 px-4 text-gray-700 font-medium flex justify-between">
                      <span>10:45 am Drift Swires Second Round</span>
                      <span>58K</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}