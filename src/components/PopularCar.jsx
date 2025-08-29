import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    href: "/cars?with-discount=true",
    banner: true,
    icon: (
      <svg viewBox="0 0 16 16" width={16} height={16} fill="none">
        <path d="M3 13L13 3M3 6.5V3h3.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "Discount",
    headline: "Thousands of cars<br>with a discount",
    carsCount: "296 838 cars",
    image: "/images/discount_1x.webp",
    image2x: "/images/discount_2x.webp",
    filter: { discountedCars: true },
    alt: "discount cars",
  },
  {
    href: "/cars?car-style[]=CARSTYLE_SUV_OFFROAD",
    title: "SUV",
    image: "/images/suv.webp",
    alt: "SUV",
    filter: { vehicleType: 'SUV' },
  },
  {
    href: "/cars?family-cars=1",
    title: "SEDAN",
    image: "/images/family.webp",
    alt: "SEDAN",
    filter: { vehicleType: 'SEDAN'},
  },
  {
    href: "/cars?car-style[]=CARSTYLE_ESTATE_CAR",
    title: "Estate",
    image: "/images/combi.webp",
    alt: "Estate",
    filter: { vehicleType: 'ESTATE' },
  },
  {
    href: "/cars?city-cars=1",
    title: "City",
    image: "/images/city.webp",
    alt: "City",
    filter: { vehicleType: 'CITY' },
  },
  {
    href: "/cars?premium-cars=1",
    title: "Luxury",
    image: "/images/luxury.webp",
    alt: "Luxury",
    filter: { vehicleType: 'LUXURY'},
  },
  {
    href: "/cars?mileage-to=15000&registration-date-from=2023",
    title: "Nearly new",
    image: "/images/almost-new.webp",
    alt: "Nearly new",
    filter: { registrationFrom: "2023" },
  },
  {
    href: "/cars?sports-cars=1",
    title: "Sport",
    image: "/images/sport.webp",
    alt: "Sport",
    filter: { vehicleType: 'SPORT' },
  },
];

export default function PopularCar() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const navigate = useNavigate();

  const handleSlideClick = (filter) => {
    // Chuyển hướng đến trang /cars và truyền đối tượng filter qua state
    navigate("/cars", { state: { initialFilter: filter } });
  };

  return (
    <section className="bg-white py-10 border-b border-[#e6e9f3]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#253887] mb-7">Popular at AutoSaleDN</h2>
        <div className="relative">
          <Swiper
            slidesPerView="auto"
            spaceBetween={32}
            modules={[Navigation, Pagination]}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            pagination={{ clickable: true }}
            onInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }}
            className="!pb-10"
          >
            {slides.map((slide, idx) => (
              <SwiperSlide
                key={idx}
                style={
                  slide.banner
                    ? { width: 410, minWidth: 410, maxWidth: 410 }
                    : { width: 260, minWidth: 260, maxWidth: 260 }
                }
                className="group cursor-pointer" // Thêm cursor-pointer để tạo hiệu ứng click
                onClick={() => {
                  if (slide.filter) {
                    handleSlideClick(slide.filter);
                  }
                }}
              >
                {slide.banner ? (
                  <div
                    className="block relative rounded-2xl shadow border border-transparent transition-all duration-200 hover:shadow-2xl hover:-translate-y-1 hover:border-[#F79C2E] focus:outline-none"
                    style={{
                      background: "linear-gradient(120deg, #FFE6B9 0%, #FFD595 100%)",
                      height: 200,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      padding: "24px 24px 20px 24px"
                    }}
                  >
                    {/* Discount badge */}
                    <div className="flex items-center mb-3">
                      <span
                        className="flex items-center gap-2 px-3 py-1 rounded-md text-white font-bold text-sm"
                        style={{
                          background: "#F79C2E",
                          fontSize: 14,
                          lineHeight: "20px",
                          boxShadow: "0px 2px 8px 0px #F79C2E20"
                        }}
                      >
                        <span className="w-4 h-4 flex items-center justify-center">{slide.icon}</span>
                        {slide.label}
                      </span>
                    </div>
                    {/* Headline */}
                    <div className="mb-4">
                      <h4
                        className="text-2xl font-extrabold text-[#253887] leading-tight"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                        dangerouslySetInnerHTML={{ __html: slide.headline }}
                      />
                    </div>
                    {/* Cars count */}
                    <p className="text-[#253887] font-bold text-lg flex items-center gap-1 mb-2">
                      {slide.carsCount}
                      <svg viewBox="0 0 24 24" width={20} height={20} fill="none">
                        <path d="M9 6l6 6-6 6" stroke="#253887" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </p>
                    {/* Car image */}
                    <img
                      src={slide.image}
                      srcSet={slide.image2x ? `${slide.image2x} 2x` : undefined}
                      alt={slide.alt}
                      className="absolute bottom-3 right-3 w-[200px] h-[90px] object-contain pointer-events-none"
                      style={{ zIndex: 1 }}
                    />
                  </div>
                ) : (
                  <div
                    className="block relative rounded-2xl bg-white border border-[#e6e9f3] shadow transition-all duration-200 hover:shadow-2xl hover:-translate-y-1 hover:border-[#3452e1] focus:outline-none px-6 pt-8 pb-5 h-[200px] flex flex-col items-start"
                  >
                    <h4 className="text-lg font-extrabold text-[#253887] mb-3 flex items-center gap-2">
                      {slide.title}
                      <svg viewBox="0 0 24 24" width={18} height={18} fill="none"><path d="M16.33 10H3" stroke="#3452e1" strokeWidth="1.67" strokeLinecap="round"/><path d="M12.17 4.17L18 10l-5.83 5.83" stroke="#3452e1" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </h4>
                    <img
                      src={slide.image}
                      alt={slide.alt}
                      width={140}
                      height={80}
                      className="w-[140px] h-[80px] object-contain"
                    />
                  </div>
                )}
              </SwiperSlide>
            ))}
            {/* Navigation */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 z-20">
              <button ref={prevRef} className="swiper-btn-prev bg-white border rounded-full shadow p-2 hover:bg-[#f6f8fd] transition" aria-label="Previous slide">
                <svg viewBox="0 0 24 24" width={22} height={22} fill="none"><path d="M15 6l-6 6 6 6" stroke="#253887" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
            <div className="absolute top-1/2 right-0 -translate-y-1/2 z-20">
              <button ref={nextRef} className="swiper-btn-next bg-white border rounded-full shadow p-2 hover:bg-[#f6f8fd] transition" aria-label="Next slide">
                <svg viewBox="0 0 24 24" width={22} height={22} fill="none"><path d="M9 6l6 6-6 6" stroke="#253887" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </Swiper>
        </div>
      </div>
    </section>
  );
}
