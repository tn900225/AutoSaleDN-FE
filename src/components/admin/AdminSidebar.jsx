import { NavLink } from "react-router-dom";
import {
    HiOutlineViewGrid,
    HiOutlineDocumentText,
    HiOutlineCalendar,
    HiOutlineChat,
    HiOutlineCog,
    HiOutlineLogout,
    HiOutlineUsers,
  } from "react-icons/hi";
  import { FaWrench , FaCar} from "react-icons/fa";

  const sidebarItems = [
    { label: "Dashboard", icon: HiOutlineViewGrid, path: "/admin/dashboard" },
    { label: "Assets", icon: HiOutlineDocumentText, path: "/admin/assets" },
    { label: "Customers", icon: HiOutlineUsers, path: "/admin/customers"},
    { label: "Car", icon: FaCar, path: "/admin/cars"},
    { label: "Booking", icon: HiOutlineCalendar, path: "/admin/booking" },
    { label: "Services", icon: FaWrench, path: "/admin/services" },
    { label: "Calender", icon: HiOutlineCalendar, path: "/admin/calender" },
    { label: "Messages", icon: HiOutlineChat, path: "/admin/messages" }
  ];

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-white min-h-screen border-r flex flex-col justify-between">
      <div>
        <div className="flex items-center h-20 px-8 font-bold text-2xl">
          <span className="text-violet-600 text-3xl mr-2">M</span>otiv.
        </div>
        <nav className="mt-4 flex flex-col gap-1">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-8 py-3 rounded-l-full font-medium text-gray-700 transition ${
                  isActive ? "bg-violet-50 text-violet-600" : "hover:bg-gray-50"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="mb-8 flex flex-col gap-1 px-8">
        <NavLink
          to="/admin/settings"
          className="flex items-center gap-3 py-2 text-gray-500 hover:text-violet-600"
        >
          <HiOutlineCog className="w-5 h-5" />
          Settings
        </NavLink>
        <NavLink
          to="/logout"
          className="flex items-center gap-3 py-2 text-gray-500 hover:text-violet-600"
        >
          <HiOutlineLogout className="w-5 h-5" />
          Log out
        </NavLink>
      </div>
    </aside>
  );
}