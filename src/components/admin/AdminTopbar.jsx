import { HiOutlineSearch, HiOutlineBell } from "react-icons/hi";

export default function AdminTopbar() {
  return (
    <header className="flex items-center justify-between px-10 h-20 bg-white border-b">
      <div className="flex items-center w-1/2">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search or type"
            className="w-full px-4 py-2 pl-10 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-200"
          />
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <button className="relative">
          <HiOutlineBell className="w-6 h-6 text-gray-500" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        <div>
          <img
            src="/admin-avatar.png"
            alt="Admin"
            className="w-10 h-10 rounded-full object-cover border-2 border-violet-200"
          />
        </div>
      </div>
    </header>
  );
}