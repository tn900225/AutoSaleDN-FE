import React from "react";

export default function SearchBar({ onSearch }) {
  return (
    <form
      className="flex flex-col md:flex-row items-center gap-3 bg-white p-4 rounded-lg shadow mt-4 max-w-2xl mx-auto"
      onSubmit={e => { e.preventDefault(); onSearch && onSearch(); }}
    >
      <input
        type="text"
        className="flex-1 border border-[#00ADF6] rounded px-4 py-2 focus:outline-none"
        placeholder="Nhập tên xe, hãng xe hoặc từ khoá..."
      />
      <button
        type="submit"
        className="bg-[#00ADF6] text-white px-8 py-2 rounded font-semibold hover:bg-[#008ecc] transition"
      >
        Tìm xe
      </button>
    </form>
  );
}