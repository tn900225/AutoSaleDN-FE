
import { HiOutlineSearch, HiOutlineBell } from "react-icons/hi";

export default function SellerTopbar() {
  return (
    <header className="flex items-center justify-between px-10 h-20 bg-white border-b">
      <div className="flex items-center w-1/2">
      </div>
      <div className="flex items-center gap-6">
        <button className="relative">
          <HiOutlineBell className="w-6 h-6 text-gray-500" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        <div>
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Seller"
            className="w-10 h-10 rounded-full object-cover border-2 border-violet-200"
          />
        </div>
      </div>
    </header>
  );
}