import React, { useState } from "react";
import CarReviews from "../components/CarReviews";
import ReviewBlogList from "../components/ReviewBlogList";
import Pagination from "../components/Pagination";

const trustLogos = [
  {
    src: "/images/kfz-betrieb.fd3ec3f4.svg",
    alt: "kfz-betrieb",
  },
  {
    src: "/images/morgen.eb1cc565.svg",
    alt: "Mannheimer Morgen",
  },
  {
    src: "/images/auto-presse.762db679.svg",
    alt: "Auto Presse",
  },
  {
    src: "/images/focus.0ba729fa.svg",
    alt: "Focus Online",
  },
];

// Mock 20 blogs, each with unique data
const BLOGS = Array.from({ length: 20 }).map((_, idx) => ({
  id: idx,
  image: "https://storage.alpha-analytics.cz/resize/342d2025-960e-4cfd-a0f2-08ff0386a0fe?fit=outside&height=338&namespace=carvago-review-prod&width=540&withoutEnlargement=false",
  name: ["Maximilian S.", "Anna P.", "Lukas Z.", "Maria K.", "Jan N."][idx % 5],
  flag: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <g clipPath="url(#clip0_1_1408)">
        <path d="M0.746521 16.1739C2.44204 20.7435 6.84055 24 12.0001 24C17.1597 24 21.5582 20.7435 23.2537 16.1739L12.0001 15.1305L0.746521 16.1739Z" fill="#FFDA44"></path>
        <path d="M12.0001 0C6.84055 0 2.44204 3.2565 0.746521 7.82611L12.0001 8.86955L23.2537 7.82606C21.5582 3.2565 17.1597 0 12.0001 0Z" fill="black"></path>
        <path d="M0.746391 7.82611C0.264047 9.1261 0 10.5322 0 12C0 13.4678 0.264047 14.8739 0.746391 16.1739H23.2537C23.736 14.8739 24 13.4678 24 12C24 10.5322 23.736 9.1261 23.2536 7.82611H0.746391Z" fill="#D80027"></path>
      </g>
      <defs>
        <clipPath id="clip0_1_1408">
          <rect width="24" height="24" fill="white"></rect>
        </clipPath>
      </defs>
    </svg>
  ),
  flagLabel: "Germany",
  rating: 5,
  text:
    [
      "Today, thanks to Carvago, buying a car is as easy as buying a dress or a pair of shoes. Amazing!",
      "Super smooth process, great support and very professional service.",
      "I am really happy with my new car. Everything was handled online and the delivery was fast.",
      "Easy, transparent and trustworthy. Would definitely recommend Carvago!",
      "Fast, reliable, and stress-free experience. Thank you!",
    ][idx % 5],
  translated: true,
  carLogo: "/images/bmw.webp?width=48&height=48&fit=contain&withoutEnlargement=false",
  carModel: ["Cupra Formentor", "Volkswagen Golf", "BMW X5", "Škoda Octavia", "Audi A4"][idx % 5],
  carLink: "/cars?model[]=MAKE_CUPRA-MODELFAMILY_FORMENTOR",
}));

const BLOGS_PER_PAGE = 15;

export default function CarReview() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(BLOGS.length / BLOGS_PER_PAGE);

  const currentBlogs = BLOGS.slice(
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

      {/* Trust logos and Review summary */}
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
          {/* Review summary card */}
          <div className="absolute left-1/2 transform -translate-x-1/2 lg:static lg:translate-x-0 w-full lg:w-auto flex justify-center mt-[-90px] lg:mt-0 z-30">
            <CarReviews />
          </div>
        </div>
      </div>

      {/* Blog reviews section */}
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