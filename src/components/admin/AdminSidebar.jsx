import { NavLink, useNavigate } from "react-router-dom";
import React from "react";
import {
    HiOutlineViewGrid,
    HiOutlineBriefcase,
    HiOutlineChat,
    HiOutlineCog,
    HiOutlineLogout,
    HiOutlineUsers,
    HiUserGroup,
    HiOutlineCalculator
} from "react-icons/hi";
import { FaWrench, FaCar, FaTools, FaPalette, FaBuilding } from "react-icons/fa"; // Added FaPalette and FaBuilding icons

const sidebarItems = [
    { label: "Dashboard", icon: HiOutlineViewGrid, path: "/admin/dashboard" },
    { label: "ShowRoom", icon: HiOutlineBriefcase, path: "/admin/showroom" },
    { label: "Employee", icon: HiUserGroup, path: "/admin/employee" },
    { label: "Customers", icon: HiOutlineUsers, path: "/admin/customers" },
    { label: "Car", icon: FaCar, path: "/admin/cars" },
    { label: "Car Features", icon: FaTools, path: "/admin/car-features" },
    { label: "Car Colors", icon: FaPalette, path: "/admin/car-colors" },
    { label: "Manufacturers & Models", icon: FaBuilding, path: "/admin/car-manufacturers-models" },
    { label: "Price Prediction", icon: HiOutlineCalculator, path: "/admin/car-prediction" },
    { label: "Messages", icon: HiOutlineChat, path: "/admin/messages" }
];

export default function AdminSidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/', { replace: true });
    };

    return (
        <aside className="w-64 bg-white min-h-screen border-r flex flex-col justify-between">
            <div>
                <div className="flex items-center h-20 px-8 font-bold text-2xl">
                    <span className="text-violet-600 text-3xl mr-2">Auto</span>SaleDN.
                </div>
                <nav className="mt-4 flex flex-col gap-1">
                    {sidebarItems.map((item) => (
                        <NavLink
                            key={item.label}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-8 py-3 rounded-l-full font-medium text-gray-700 transition ${isActive ? "bg-violet-50 text-violet-600" : "hover:bg-gray-50"
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
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 py-2 text-gray-500 hover:text-violet-600 cursor-pointer"
                >
                    <HiOutlineLogout className="w-5 h-5" />
                    Log out
                </button>
            </div>
        </aside>
    );
}