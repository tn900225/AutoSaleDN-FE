import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#002244] text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="font-semibold">© {new Date().getFullYear()} carvago.com</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-[#00ADF6]">Chính sách bảo mật</a>
          <a href="#" className="hover:text-[#00ADF6]">Điều khoản sử dụng</a>
          <a href="#" className="hover:text-[#00ADF6]">Facebook</a>
        </div>
      </div>
    </footer>
  );
}