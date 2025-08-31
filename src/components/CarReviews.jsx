import React, { useState, useEffect } from "react";
import { getApiBaseUrl } from "../../util/apiconfig"; // Import để sử dụng API

// --- Component phụ để render các ngôi sao ---
// Component này có thể xử lý số lẻ (vd: 4.8) để hiển thị nửa sao
const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      // Sao đầy
      stars.push(<svg key={i} className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.954L10 0l2.951 5.956 6.561.954-4.756 4.635 1.122 6.545z" /></svg>);
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      // Nửa sao
      stars.push(
        <svg key={i} className="w-8 h-8" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="halfStarGradient">
              <stop offset="50%" stopColor="#FACC15"/>
              <stop offset="50%" stopColor="#E5E7EB" stopOpacity="1"/>
            </linearGradient>
          </defs>
          <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.954L10 0l2.951 5.956 6.561.954-4.756 4.635 1.122 6.545z" fill="url(#halfStarGradient)" />
        </svg>
      );
    } else {
      // Sao trống
      stars.push(<svg key={i} className="w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.954L10 0l2.951 5.956 6.561.954-4.756 4.635 1.122 6.545z" /></svg>);
    }
  }
  return <div className="flex items-center">{stars}</div>;
};


export default function CarReviews() {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const API_BASE = getApiBaseUrl();

  useEffect(() => {
    const fetchReviewsData = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/User/reviews`);
        if (!res.ok) throw new Error("Could not fetch reviews");
        const data = await res.json();
        setReviews(data);

        if (data.length > 0) {
          const totalRating = data.reduce((acc, review) => acc + review.rating, 0);
          setAverageRating(totalRating / data.length);
        }
      } catch (error) {
        console.error("Error in CarReviews component:", error);
      }
    };
    fetchReviewsData();
  }, [API_BASE]);

  return (
    <section className="w-full max-w-xl bg-white shadow-lg rounded-xl px-8 py-8 flex flex-col items-center gap-2 border border-gray-100">
      {/* Stars and review count - DYNAMIC */}
      <div className="flex items-center mb-4">
        {reviews.length > 0 ? (
          <>
            <StarRating rating={averageRating} />
            <span className="ml-3 text-gray-500 text-base">({reviews.length} reviews)</span>
          </>
        ) : (
          <span className="text-gray-500">Loading reviews...</span>
        )}
      </div>
      <div className="text-5xl font-bold text-gray-800 mb-2">
        {averageRating > 0 ? averageRating.toFixed(1) : "N/A"}
      </div>
      <div className="italic text-center text-lg text-gray-600 mt-2">
        “If you're not happy, neither are we!”
      </div>
    </section>
  );
}