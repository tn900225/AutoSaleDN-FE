import React, { useState, useEffect } from "react";
import { getApiBaseUrl } from "../../util/apiconfig";

// This component is now smarter and can handle decimal ratings
function StarRating({ value }) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => {
        const ratingValue = i + 1;
        let fill = "#D7E1EF"; // Default empty star color
        if (ratingValue <= value) {
          fill = "#FFBB35"; // Full star
        }
        // This logic can be expanded for half stars if needed, but rounding is often sufficient
        return (
          <svg
            key={i}
            width="18"
            height="18"
            fill={fill}
            viewBox="0 0 16 16"
          >
            <path d="M7.67839 12.0633C7.87475 11.9385 8.12553 11.9385 8.32189 12.0633L11.7238 14.2246C12.1746 14.511 12.7469 14.1098 12.6313 13.5883L11.7073 9.41905C11.6608 9.20927 11.73 8.99065 11.8888 8.84588L14.9917 6.01634C15.3776 5.66449 15.1609 5.02182 14.6408 4.97537L10.6141 4.61577C10.3895 4.59571 10.1951 4.45142 10.1109 4.24224L8.55672 0.382247C8.35491 -0.118953 7.64536 -0.118952 7.44356 0.382248L5.88937 4.24224C5.80515 4.45142 5.61076 4.59571 5.38617 4.61577L1.35947 4.97537C0.839355 5.02182 0.622709 5.66449 1.00856 6.01634L4.11148 8.84588C4.27024 8.99065 4.33947 9.20927 4.29298 9.41905L3.36898 13.5883C3.2534 14.1098 3.82565 14.511 4.27652 14.2246L7.67839 12.0633Z" />
          </svg>
        );
      })}
    </div>
  );
}

const CARDS_VISIBLE = 5;

export default function CustomerTestimonials() {
  const [reviews, setReviews] = useState([]);
  const [current, setCurrent] = useState(0);
  const [averageRating, setAverageRating] = useState(0); // State for average rating
  const API_BASE = getApiBaseUrl();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/User/reviews`);
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();
        setReviews(data);

        // Calculate average rating after fetching data
        if (data.length > 0) {
          const total = data.reduce((acc, review) => acc + review.rating, 0);
          setAverageRating(total / data.length);
        }

      } catch (err) {
        console.error("Error loading reviews:", err);
      }
    };

    fetchReviews();
  }, [API_BASE]); // Use API_BASE in dependency array

  const handlePrev = () => setCurrent((prev) => Math.max(prev - 1, 0));
  const handleNext = () =>
    setCurrent((prev) => Math.min(prev + 1, reviews.length - CARDS_VISIBLE));

  return (
    <div className="bg-white py-12 px-0">
      <div className="max-w-[1640px] mx-auto">
        {/* Title */}
        <h2 className="font-extrabold text-[2.4rem] text-[#20225b] mb-2 ml-12 mt-2 font-montserrat">
          What do our customers think?
        </h2>

        {/* --- RATING ROW UPDATED --- */}
        <div className="flex items-center gap-4 mb-7 ml-12">
          <span className="text-[2.4rem] font-bold text-[#20225b]">
            {averageRating > 0 ? averageRating.toFixed(1) : "..."}
          </span>
          <StarRating value={averageRating} />
          <span className="text-[#20225b] opacity-80 text-[1.08rem]">
            {reviews.length} reviews
          </span>
        </div>

        {/* Arrow controls */}
        <div className="flex items-center gap-4 ml-12 mb-6">
          <button
            onClick={handlePrev}
            className="w-[38px] h-[38px] border-2 border-[#3452e1] bg-white text-[#3452e1] rounded-lg flex items-center justify-center text-xl transition hover:bg-[#e7eafd] hover:border-[#253887] hover:text-[#253887] disabled:opacity-50"
            disabled={current === 0}
          >
            <svg width="20" height="20" fill="none">
              <path
                d="M13 6l-6 6 6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="w-[38px] h-[38px] border-2 border-[#3452e1] bg-white text-[#3452e1] rounded-lg flex items-center justify-center text-xl transition hover:bg-[#e7eafd] hover:border-[#253887] hover:text-[#253887] disabled:opacity-50"
            disabled={current >= reviews.length - CARDS_VISIBLE || reviews.length <= CARDS_VISIBLE}
          >
            <svg width="20" height="20" fill="none">
              <path
                d="M7 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Card list */}
        <div className="flex gap-7 px-12 mb-7 transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${current * (340 + 28)}px)` }}
        >
          {reviews.map((review) => (
            <div
              key={review.saleId}
              className="flex flex-col bg-white rounded-xl border border-[#e8eaf3] shadow-[0_2px_18px_0_rgba(32,34,91,0.10)] w-[340px] min-w-[340px] max-w-[340px] overflow-hidden"
            >
              <div className="h-[200px] w-full">
                <img
                  src={review.images?.[0] || "https://storage.alpha-analytics.cz/resize/342d2025-960e-4cfd-a0f2-08ff0386a0fe?fit=outside&height=338&namespace=carvago-review-prod&width=540&withoutEnlargement=false"}
                  alt={`Review from ${review.userName}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Card content */}
              <div className="flex flex-col px-5 pt-5 pb-4 flex-1">
                <div className="font-bold text-[#20225b] text-[1.07rem] mb-1">
                  {review.userName || "Anonymous"}
                </div>
                <div className="mb-2">
                  <StarRating value={review.rating} />
                </div>
                <p className="text-[#253887] opacity-95 text-[1rem] leading-[1.52] mb-2">
                  {review.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}