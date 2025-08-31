import React, { useState, useEffect } from "react";
import CarReviews from "../components/CarReviews";
import Pagination from "../components/Pagination";
import { getApiBaseUrl } from "../../util/apiconfig";

const StarRating = ({ value }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        className="w-4 h-4"
        fill={i < Math.round(value) ? "#FFBB35" : "#D7E1EF"}
        viewBox="0 0 16 16"
      >
        <path d="M7.67839 12.0633C7.87475 11.9385 8.12553 11.9385 8.32189 12.0633L11.7238 14.2246C12.1746 14.511 12.7469 14.1098 12.6313 13.5883L11.7073 9.41905C11.6608 9.20927 11.73 8.99065 11.8888 8.84588L14.9917 6.01634C15.3776 5.66449 15.1609 5.02182 14.6408 4.97537L10.6141 4.61577C10.3895 4.59571 10.1951 4.45142 10.1109 4.24224L8.55672 0.382247C8.35491 -0.118953 7.64536 -0.118952 7.44356 0.382248L5.88937 4.24224C5.80515 4.45142 5.61076 4.59571 5.38617 4.61577L1.35947 4.97537C0.839355 5.02182 0.622709 5.66449 1.00856 6.01634L4.11148 8.84588C4.27024 8.99065 4.33947 9.20927 4.29298 9.41905L3.36898 13.5883C3.2534 14.1098 3.82565 14.511 4.27652 14.2246L7.67839 12.0633Z" />
      </svg>
    ))}
  </div>
);

const ReviewBlogList = ({ blogs }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {blogs.map((blog) => (
        <a
          href={blog.carLink || '#'}
          key={blog.id}
          className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col group transition hover:shadow-xl hover:-translate-y-1"
        >
          {blog.image && (
            <div className="relative h-52 w-full overflow-hidden">
              <img
                src={blog.image}
                alt={`Review from ${blog.name}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          )}

          <div className="p-6 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                    <h3 className="font-bold text-lg text-gray-800">{blog.name}</h3>
                    {blog.flag && <span className="ml-2">{blog.flag}</span>}
                </div>
                <StarRating value={blog.rating} />
            </div>

            <p className="text-gray-600 flex-grow mb-4">"{blog.text}"</p>

            {blog.carModel && (
                <div className="mt-auto border-t pt-4 flex items-center gap-3">
                    {blog.carLogo && <img src={blog.carLogo} alt={blog.carModel} className="h-8 w-8 object-contain" />}
                    <span className="font-semibold text-gray-700">{blog.carModel}</span>
                </div>
            )}
          </div>
        </a>
      ))}
    </div>
  );
}



const trustLogos = [
  { src: "/images/kfz-betrieb.fd3ec3f4.svg", alt: "kfz-betrieb" },
  { src: "/images/morgen.eb1cc565.svg", alt: "Mannheimer Morgen" },
  { src: "/images/auto-presse.762db679.svg", alt: "Auto Presse" },
  { src: "/images/focus.0ba729fa.svg", alt: "Focus Online" },
];

const BLOGS_PER_PAGE = 15;

export default function CarReview() {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const API_BASE = getApiBaseUrl();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/User/reviews`);
        if (!res.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await res.json();
        
        const formattedReviews = data.map(review => ({
          id: review.saleId,
          image: review.images && review.images.length > 0 ? review.images[0] : "https://storage.alpha-analytics.cz/resize/342d2025-960e-4cfd-a0f2-08ff0386a0fe?fit=outside&height=338&namespace=carvago-review-prod&width=540&withoutEnlargement=false",
          name: review.userName || "Anonymous",
          rating: review.rating,
          text: review.content,
          flag: null, 
          flagLabel: "",
          carLogo: "",
          carModel: "",
          carLink: "#",
        }));

        setReviews(formattedReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [API_BASE]);

  const totalPages = Math.ceil(reviews.length / BLOGS_PER_PAGE);
  const currentBlogs = reviews.slice(
    (page - 1) * BLOGS_PER_PAGE,
    page * BLOGS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section */}
      <div
        className="relative w-full h-[480px] flex items-center"
        style={{
          background: "url('../images/hero-image-2200.webp') center/cover no-repeat",
        }}
      >
        <div className="absolute w-full h-full bg-white bg-opacity-30 z-10"></div>
        <div className="relative z-20 flex flex-col justify-center h-full pl-[6vw]">
          <div className="text-blue-700 font-bold mb-2 tracking-widest text-base">AUTOSALEDN REVIEWS</div>
          <h1 className="text-6xl font-extrabold text-gray-900 leading-[1.1] max-w-2xl">
            What do our<br />customers say about us?
          </h1>
        </div>
      </div>

      <div className="w-full bg-white pb-32 pt-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between relative">
          <div className="flex-1">
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-6">Trust us</div>
            <div className="flex flex-row gap-10 items-center">
              {trustLogos.map((logo, idx) => (
                <img key={idx} src={logo.src} alt={logo.alt} className="h-8 object-contain grayscale" />
              ))}
            </div>
          </div>
          <div className="flex-1" />
          <div className="absolute left-1/2 transform -translate-x-1/2 lg:static lg:translate-x-0 w-full lg:w-auto flex justify-center mt-[-90px] lg:mt-0 z-30">
            <CarReviews />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <h2 className="text-3xl font-extrabold mb-8 text-gray-800">Customer reviews</h2>
        <ReviewBlogList blogs={currentBlogs} />
        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
      <hr />
    </div>
  );
}