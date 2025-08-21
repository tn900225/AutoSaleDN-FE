import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const cars = [
  {
    name: "Porshe 718 Cayman S",
    type: "Coupe",
    image: "/car-1.png",
    seats: 4,
    transmission: "Manual",
    price: "$400/d",
    liked: false,
  },
  {
    name: "Porshe 718 Cayman S",
    type: "Coupe",
    image: "/car-2.png",
    seats: 4,
    transmission: "Manual",
    price: "$400/d",
    liked: true,
  },
  {
    name: "Porshe 718 Cayman S",
    type: "Coupe",
    image: "/car-3.png",
    seats: 4,
    transmission: "Manual",
    price: "$400/d",
    liked: false,
  },
  {
    name: "Porshe 718 Cayman S",
    type: "Coupe",
    image: "/car-4.png",
    seats: 4,
    transmission: "Manual",
    price: "$400/d",
    liked: false,
  },
  {
    name: "Porshe 718 Cayman S",
    type: "Coupe",
    image: "/car-5.png",
    seats: 4,
    transmission: "Manual",
    price: "$400/d",
    liked: false,
  },
  {
    name: "Porshe 718 Cayman S",
    type: "Coupe",
    image: "/car-6.png",
    seats: 4,
    transmission: "Manual",
    price: "$400/d",
    liked: false,
  },
  {
    name: "Porshe 718 Cayman S",
    type: "Coupe",
    image: "/car-7.png",
    seats: 4,
    transmission: "Manual",
    price: "$400/d",
    liked: false,
  },
  {
    name: "Porshe 718 Cayman S",
    type: "Coupe",
    image: "/car-8.png",
    seats: 4,
    transmission: "Manual",
    price: "$400/d",
    liked: false,
  },
];

export default function AdminBooking() {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminTopbar />
        <main className="p-8">
          <div className="text-2xl font-semibold mb-6">Booking</div>
          <div className="flex gap-4 mb-6">
            <button className="px-5 py-2 rounded-lg bg-gray-100 text-gray-900 font-medium">New</button>
            <button className="px-5 py-2 rounded-lg bg-gray-100 text-gray-900 font-medium">Toyota</button>
          </div>
          <div className="grid grid-cols-4 gap-6">
            {cars.map((car, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-2">
                <img src={car.image} alt={car.name} className="w-full h-28 object-contain mb-2" />
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{car.name}</div>
                    <div className="text-xs text-gray-400">{car.type}</div>
                  </div>
                  <button>
                    {car.liked ? (
                      <span className="text-pink-500 text-xl">♥</span>
                    ) : (
                      <span className="text-gray-400 text-xl">♡</span>
                    )}
                  </button>
                </div>
                <div className="flex gap-4 text-xs text-gray-500 items-center mt-1">
                  <span className="flex items-center gap-1">
                    <span role="img" aria-label="Seats">
                      👤
                    </span>
                    {car.seats}
                  </span>
                  <span>{car.transmission}</span>
                  <span className="ml-auto font-semibold text-gray-900">{car.price}</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}