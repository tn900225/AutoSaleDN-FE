import { NavLink, useNavigate } from "react-router-dom";
import React from "react";
import {
    HiOutlineViewGrid,
    HiOutlineBriefcase,
    HiOutlineCalendar,
    HiOutlineChat,
    HiOutlineCog,
    HiOutlineLogout,
    HiOutlineUsers,
    HiUserGroup,
    HiOutlineDocumentText,
    HiOutlineMail
} from "react-icons/hi";
import { FaWrench, FaCar, FaTools, FaPalette, FaBuilding } from "react-icons/fa"; // Added FaPalette and FaBuilding icons

const sidebarItems = [
    { label: "Dashboard", icon: HiOutlineViewGrid, path: "/seller/dashboard" },
    { label: "ShowRoom", icon: HiOutlineBriefcase, path: "/seller/order-management" },
    { label: "Manage Posts", icon: HiOutlineDocumentText, path: "/seller/manage-posts" },
    { label: "Messages", icon: HiOutlineMail, path: "/seller/manage-message" },
    { label: "Manage Booking", icon: HiOutlineCalendar, path: "/seller/manage-booking" }
    
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