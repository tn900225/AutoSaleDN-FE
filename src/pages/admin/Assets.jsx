import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

export default function AdminAssets() {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminTopbar />
        <main className="p-8 grid gap-6">
          <div className="text-2xl font-semibold mb-4">Assets</div>
          <div className="grid grid-cols-3 gap-6">
            {/* Fuel usage stats (left column) */}
            <div className="bg-blue-500 rounded-2xl p-6 flex flex-col items-center text-white relative">
              <div className="absolute inset-x-0 top-8 flex flex-col items-center">
                <div className="font-bold text-lg">Fuel Usage</div>
                <div className="text-3xl font-bold mb-4">2903.89 Ltr</div>
                <div className="font-bold text-lg mt-4">KM Driven</div>
                <div className="text-3xl font-bold mb-4">2903.89 Ltr</div>
                <div className="font-bold text-lg mt-4">Total Cost</div>
                <div className="text-xl font-bold mb-2">$3,00,290.00</div>
                <div className="font-bold text-lg mt-2">Top Speed</div>
                <div className="text-xl font-bold mb-2">$5.2K</div>
              </div>
              <img
                src="/car-top.png"
                alt="Car Top"
                className="w-[270px] h-[420px] object-contain mt-8"
                draggable={false}
              />
            </div>
            {/* Activity chart (center) */}
            <div className="col-span-2 grid grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Activity</span>
                  <span className="text-xs text-gray-400 cursor-pointer">View All</span>
                </div>
                {/* Chart placeholder */}
                <div className="w-full h-32 mt-2 relative">
                  <svg className="absolute w-full h-full">
                    <polyline
                      fill="none"
                      stroke="#a78bfa"
                      strokeWidth="4"
                      points="10,80 60,90 120,60 180,100 240,40 300,70"
                    />
                    <circle cx="60" cy="90" r="12" fill="#ede9fe" />
                    <circle cx="60" cy="90" r="7" fill="#a78bfa" />
                  </svg>
                  <div className="absolute left-14 top-12 text-center">
                    <div className="text-violet-600 text-2xl font-bold">50 Km</div>
                    <div className="text-xs text-gray-400">Traveled last month</div>
                  </div>
                </div>
                <div className="flex justify-between text-xs mt-6 text-gray-400">
                  {[...Array(7).keys()].map((i) => (
                    <span key={i}>12/9</span>
                  ))}
                </div>
              </div>
              {/* Notices, Sensors, Reminder */}
              <div className="flex flex-col gap-6">
                {/* Notices */}
                <div className="bg-white rounded-2xl p-4">
                  <div className="font-semibold mb-3">Noties</div>
                  <ul className="space-y-3">
                    <li className="flex gap-3 items-start">
                      <span className="mt-1 bg-violet-100 text-violet-600 rounded-full p-1.5">●</span>
                      <div>
                        <div className="font-medium">Monday, 6th April 2020</div>
                        <div className="text-xs text-gray-500">Book for General Service</div>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-600 rounded text-xs font-medium">COMPLETED</span>
                      </div>
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="mt-1 bg-pink-100 text-pink-600 rounded-full p-1.5">●</span>
                      <div>
                        <div className="font-medium">Thursday, 24th October 2021</div>
                        <div className="text-xs text-gray-500">Vehicle LV 001 has been marked for recall.</div>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-white text-gray-500 border border-gray-300 rounded text-xs font-medium">14:07 - 21/11/2021</span>
                      </div>
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="mt-1 bg-gray-200 text-gray-600 rounded-full p-1.5">●</span>
                      <div>
                        <div className="font-medium">Monday, 13th August 2018</div>
                        <div className="text-xs text-gray-500">Maintenance Completed, Collect</div>
                      </div>
                    </li>
                  </ul>
                </div>
                {/* Sensors */}
                <div className="bg-white rounded-2xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Available Sensors</span>
                    <span className="text-xs text-gray-400">Assets</span>
                  </div>
                  <ul className="mt-3 space-y-2">
                    <li className="flex items-center">
                      <input type="checkbox" checked readOnly className="accent-pink-500 mr-3" />
                      <span className="text-pink-600 font-semibold">Asset – Fuel Consumed (10)</span>
                    </li>
                    <li className="flex items-center">
                      <input type="checkbox" className="mr-3" />
                      <span>Asset – Odometer (km)</span>
                    </li>
                    <li className="flex items-center">
                      <input type="checkbox" className="mr-3" />
                      <span>Asset – Runtime (km)</span>
                    </li>
                    <li className="flex items-center">
                      <input type="checkbox" className="mr-3" />
                      <span>Asset – Speed (hr)</span>
                    </li>
                    <li className="flex items-center">
                      <input type="checkbox" className="mr-3" />
                      <span>Engine Temperature (deg C)</span>
                    </li>
                  </ul>
                  <button className="mt-3 px-4 py-1 rounded-lg bg-pink-100 text-pink-600 font-medium text-xs">See All</button>
                </div>
              </div>
            </div>
          </div>
          {/* Reminder Table */}
          <div className="bg-white rounded-2xl p-6 mt-4">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold">Reminder</span>
              <button className="px-4 py-1 rounded-lg bg-violet-500 text-white text-sm font-medium">+ Add New</button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 text-left">
                  <th className="py-2">Description</th>
                  <th>Due</th>
                  <th>Overdue</th>
                  <th>Author</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="py-2">Urgent Safety Recall</td>
                  <td>06/04/2022</td>
                  <td>08/04/2022</td>
                  <td>David Demo</td>
                  <td>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">Completed</span>
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="py-2">Urgent Safety Recall</td>
                  <td>06/04/2022</td>
                  <td>08/04/2022</td>
                  <td>David Demo</td>
                  <td>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">Completed</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}