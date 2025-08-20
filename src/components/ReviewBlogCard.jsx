import React from "react";

export default function ReviewBlogCard({ review }) {
  return (
    <div className="bg-white rounded-xl shadow-md flex flex-col overflow-hidden">
      {/* Review image */}
      <div className="aspect-[16/10] w-full">
        <img
          src={review.image}
          alt="carvago-review-prod"
          className="w-full h-full object-cover rounded-t-xl"
        />
      </div>
      <div className="p-5 flex flex-col flex-1">
        {/* Reviewer info and flag */}
        <div className="flex items-center gap-3 mb-2">
          <p className="font-semibold text-gray-900">{review.name}</p>
          <span title={review.flagLabel}>{review.flag}</span>
        </div>
        {/* Stars */}
        <div className="flex items-center mb-2">
          {[...Array(review.rating)].map((_, i) => (
            <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.954L10 0l2.951 5.956 6.561.954-4.756 4.635 1.122 6.545z" />
            </svg>
          ))}
        </div>
        {/* Review text */}
        <p className="mb-3 text-gray-700 flex-1">{review.text}</p>
        {/* Translated + View original */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
          {review.translated && (
            <>
              <span className="italic">Translated</span>
              <span>·</span>
              <button className="hover:underline text-blue-700">View original</button>
            </>
          )}
        </div>
        {/* Car info + button */}
        <div className="flex items-center gap-3 border-t pt-3 mt-3">
          <img
            src={review.carLogo}
            alt={review.carModel}
            className="w-11 h-11 object-contain"
          />
          <div className="flex-1">
            <p className="font-medium">{review.carModel}</p>
            <a
              href={review.carLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-1 text-blue-700 hover:underline text-sm"
            >
              Show similar cars
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}