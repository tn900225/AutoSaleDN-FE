import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AccountMenu = ({ user, onLogout }) => {
  // Generate avatar initials from user name
  const getInitials = (name) => {
    if (!name) return '??';
    const strName = String(name);
    const cleanName = strName.replace(/[^\w\s]/g, '').trim();
    if (!cleanName) return '??';

    const names = cleanName.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0].substring(0, 2).toUpperCase();
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/'); // Redirect to home page after logout
  };

  return (
    <div className="flex flex-col gap-2 p-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#3452e1] flex items-center justify-center text-white font-bold text-lg">
          {getInitials(user.fullName)}
        </div>
        <div>
          <h6 className="text-[#253887] font-semibold text-sm">{user.fullName}</h6>
          <p className="text-[#666] text-xs">{user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-[#253887] hover:text-[#3452e1] transition duration-200"
        >
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="#3452e1"
            strokeWidth="1.6"
          >
            <path
              d="M16 17L21 12M21 12L16 7M21 12H9M12 17C12 17.2956 12 17.4434 11.989 17.5714C11.8748 18.902 10.8949 19.9968 9.58503 20.2573C9.45903 20.2823 9.31202 20.2987 9.01835 20.3313L7.99694 20.4448C6.46248 20.6153 5.69521 20.7005 5.08566 20.5055C4.27293 20.2454 3.60942 19.6515 3.26118 18.8725C3 18.2882 3 17.5162 3 15.9723V8.0277C3 6.48377 3 5.7118 3.26118 5.12752C3.60942 4.34848 4.27293 3.7546 5.08566 3.49453C5.69521 3.29947 6.46246 3.38472 7.99694 3.55522L9.01835 3.66871C9.31212 3.70135 9.45901 3.71767 9.58503 3.74273C10.8949 4.00316 11.8748 5.09804 11.989 6.42861C12 6.55663 12 6.70442 12 7"
            />
          </svg>
          <span className="text-sm">Logout</span>
        </button>
      </div>

      <hr className="border-t border-gray-200" />

      <div className="space-y-2">
        <Link
          to="/mybooking"
          className="flex items-center gap-3 py-2 text-[#253887] hover:bg-[#f6f8fd] rounded-lg transition font-medium text-base"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="#3452e1"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Xe hơi */}
            <rect x="3" y="11" width="18" height="6" rx="2" ry="2" />
            <circle cx="7.5" cy="17.5" r="1.5" />
            <circle cx="16.5" cy="17.5" r="1.5" />
            {/* Đồng hồ trên nóc xe */}
            <circle cx="12" cy="6" r="3" />
            <path d="M12 5v1.5l1.2 1.2" />
          </svg>
          <span>Schedule Test Drive</span>
        </Link>


        <Link
          to="/wishlist"
          className="flex items-center gap-3 py-2 text-[#253887] hover:bg-[#f6f8fd] rounded-lg transition font-medium text-base"
        >
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="#3452e1"
            strokeWidth="1.6"
          >
            <path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5A5.5 5.5 0 017.5 3c1.74 0 3.41.81 4.5 2.09A5.5 5.5 0 0116.5 3 5.5 5.5 0 0122 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21z" />
          </svg>
          <span>WishList cars</span>
        </Link>

        <Link
          to="/cars/orders"
          className="flex items-center gap-3 py-2 text-[#253887] hover:bg-[#f6f8fd] rounded-lg transition font-medium text-base"
        >
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="#3452e1"
            strokeWidth="1.6"
          >
            <rect x="3" y="11" width="18" height="6" rx="2" />
            <circle cx="7" cy="17" r="1.5" />
            <circle cx="17" cy="17" r="1.5" />
            <path d="M6 11V8a2 2 0 012-2h8a2 2 0 012 2v3" />
          </svg>
          <span>Orders in progress</span>
        </Link>
      </div>

      <hr className="border-t border-gray-200" />

      <div className="space-y-2">
        <Link
          to="/profile"
          className="flex items-center gap-3 py-2 text-[#253887] hover:bg-[#f6f8fd] rounded-lg transition font-medium text-base"
        >
          <svg
            viewBox="0 0 1024 1024"
            width="22"
            height="22"
            class="icon"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M365.6 864.7c-22.7-9.4-38.5-10.4-69.9-7.1-32.2 3.3-45.1 3.2-64.5-4.1-13.1-4.9-25.2-13-36.7-24.4-11.5-11.5-19.5-23.6-24.5-36.7-7.3-19.4-7.4-32.3-4.1-64.5 3.2-31.5 2.3-47.3-7.1-69.9-7.4-17.9-17-30.6-31.4-43.5-3-2.7-6.2-5.4-10.4-8.9 1.9 1.6-8.5-7-11.2-9.1-29.4-24.6-42.9-47-42.9-84.7s13.5-60.1 42.9-84.7c2.6-2.2 13.1-10.7 11.2-9.1-4.3 3.5-7.4 6.2-10.4 8.9-14.3 12.9-23.9 25.5-31.4 43.5-9.4 22.7-10.4 38.5-7.1 69.9 3.3 32.2 3.2 45.1-4.1 64.5-4.9 13.1-13 25.2-24.4 36.7-11.5 11.5-23.6 19.5-36.7 24.4-19.4 7.3-32.3 7.4-64.5 4.1-31.5-3.2-47.3-2.3-69.9 7.1-17.9 7.4-30.6 17-43.5 31.4-2.7 3-5.4 6.2-8.9 10.4 1.6-1.9-7 8.5-9.1 11.2-24.6 29.4-47 42.9-84.7 42.9s-60.1-13.5-84.7-42.9c-2.2-2.6-10.7-13.1-9.1-11.2-3.5-4.3-6.2-7.4-8.9-10.4-12.9-14.3-25.6-23.9-43.5-31.3z" fill="#3e47dd"></path>
              <path d="M376.3 838.8c74.4 30.8 67.7 93.7 135.4 93.7s61.1-62.9 135.4-93.7c74.4-30.8 114.1 18.4 162-29.5s-1.3-87.7 29.5-162c30.8-74.4 93.7-67.7 93.7-135.4s-62.9-61.1-93.7-135.4c-30.8-74.4 18.4-114.1-29.5-162s-87.7 1.3-162-29.5c-74.4-30.8-67.7-93.7-135.4-93.7S450.6 154.2 376.3 185c-74.4 30.8-114.1-18.4-162 29.5s1.3 87.7-29.5 162c-30.8 74.2-93.7 67.5-93.7 135.3s62.9 61.1 93.7 135.4c30.8 74.4-18.4 114.1 29.5 162s87.6-1.3 162 29.6z" fill="#FFFFFF"></path>
              <path d="M511.8 792.2c-154.9 0-280.5-125.6-280.5-280.5S356.9 231.2 511.8 231.2s280.5 125.6 280.5 280.5-125.7 280.5-280.5 280.5z" fill="#3e47dd"></path>
              <path d="M511.8 736.1c123.9 0 224.4-100.5 224.4-224.4S635.7 287.4 511.8 287.4 287.4 387.8 287.4 511.8s100.4 224.3 224.4 224.3z" fill="#FFFFFF"></path>
            </g>
          </svg>
          <span>Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default AccountMenu;
