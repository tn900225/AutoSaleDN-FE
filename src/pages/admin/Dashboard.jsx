import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const stats = [
  { label: "Energy", value: 45, color: "violet", icon: "⚡" },
  { label: "Range", value: 157, color: "pink", icon: "🛣" },
  { label: "Break fluid", value: 9, color: "purple", icon: "💧" },
  { label: "Tire Wear", value: 25, color: "yellow", icon: "🟡" },
];

const recommendCars = [
  {
    name: "Mini Cooper",
    percent: 64,
    image: "/car-1.png",
    bg: "bg-yellow-100",
    stats: { views: "132K", price: "$32/h" },
  },
  {
    name: "Porsche 911 Carrera",
    percent: 74,
    image: "/car-2.png",
    bg: "bg-blue-50",
    stats: { views: "130K", price: "$28/h" },
  },
  {
    name: "Porsche 911 Carrera",
    percent: 74,
    image: "/car-3.png",
    bg: "bg-pink-50",
    stats: { views: "130K", price: "$28/h" },
  },
];

export default function AdminDashboard() {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminTopbar />
        <main className="p-8 grid grid-cols-1 gap-6">
          <div className="grid grid-cols-4 gap-6">
            {stats.map((item) => (
              <div
                key={item.label}
                className={`rounded-2xl ${item.color === "violet"
                  ? "bg-violet-200"
                  : item.color === "pink"
                  ? "bg-pink-100"
                  : item.color === "purple"
                  ? "bg-purple-100"
                  : "bg-yellow-100"
                } p-6 flex flex-col items-center`}
              >
                <div className="text-4xl mb-2">{item.icon}</div>
                <div className="text-2xl font-bold">
                  {item.value}
                  {item.label === "Energy" ? "%" : item.label === "Range" ? "K%" : "%"}
                </div>
                <div className="text-gray-600 mt-1">{item.label}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6 mt-6">
            {/* Miles Statistics */}
            <div className="bg-white rounded-2xl p-6">
              <div className="font-semibold mb-2">Miles Statistics</div>
              {/* Bar chart placeholder */}
              <div className="flex items-end h-32 gap-5 mt-5">
                {[1, 2, 3, 4, 5, 6].map((item, idx) => (
                  <div
                    key={item}
                    className={`w-6 rounded-t-lg ${idx === 2 ? "bg-blue-500 h-24" : "bg-gray-200 h-16"}`}
                  >
                    {idx === 2 && (
                      <span className="absolute -mt-8 ml-2 text-xs bg-white px-1 py-0.5 rounded shadow">
                        1PM
                        <br />
                        157K
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {/* Car Statistics */}
            <div className="bg-white rounded-2xl p-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Car Statistics</span>
                <div className="flex gap-2 text-xs">
                  <button className="px-2 py-1 rounded bg-orange-100 text-orange-600">Day</button>
                  <button className="px-2 py-1 rounded text-gray-500">Week</button>
                  <button className="px-2 py-1 rounded text-gray-500">Month</button>
                </div>
              </div>
              {/* Line chart placeholder */}
              <div className="w-full h-28 bg-gradient-to-t from-orange-100 to-transparent rounded-lg relative mt-2">
                <svg className="absolute w-full h-full">
                  <polyline
                    fill="none"
                    stroke="#fd7e14"
                    strokeWidth="3"
                    points="0,60 40,50 80,65 120,30 160,50 200,40 240,20 280,30"
                  />
                </svg>
              </div>
            </div>
          </div>
          {/* Recommend Cars */}
          <div className="grid grid-cols-3 gap-6 mt-6">
            {recommendCars.map((car) => (
              <div key={car.name} className={`rounded-2xl ${car.bg} p-4 flex flex-col gap-2`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">{car.percent}% Recommend</span>
                  <span className="text-gray-400">⛶</span>
                </div>
                <img src={car.image} alt={car.name} className="w-full h-24 object-contain" />
                <div className="font-medium">{car.name}</div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{car.stats.views} 👁️</span>
                  <span>{car.stats.price}</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}