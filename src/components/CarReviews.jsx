import React from "react";

export default function CarReview() {
  return (
    <section className="w-full max-w-xl bg-white shadow-lg rounded-xl px-8 py-8 flex flex-col items-center gap-2 border border-gray-100">
      {/* Stars and review count */}
      <div className="flex items-center mb-4">
        {[...Array(4)].map((_, i) => (
          <svg key={i} className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.954L10 0l2.951 5.956 6.561.954-4.756 4.635 1.122 6.545z" />
          </svg>
        ))}
        {/* Half Star */}
        <svg className="w-8 h-8" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="halfStar" x1="0" x2="1" y1="0" y2="0">
              <stop offset="50%" stopColor="#FACC15"/>
              <stop offset="50%" stopColor="#E5E7EB"/>
            </linearGradient>
          </defs>
          <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.954L10 0l2.951 5.956 6.561.954-4.756 4.635 1.122 6.545z" fill="url(#halfStar)" />
        </svg>
        <span className="ml-3 text-gray-500 text-base">(1834 reviews)</span>
      </div>
      <div className="text-5xl font-bold text-gray-800 mb-2">4.8</div>
      <div className="italic text-center text-lg text-gray-600 mt-2">
        “If you're not happy, neither are we!”
      </div>
    </section>
  );
}