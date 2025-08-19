import React, { useRef } from "react";

// You can install Swiper for React: npm install swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const slides = [
  {
    href: "/cars?with-discount=true",
    banner: true,
    icon: (
      <svg viewBox="0 0 16 16" width={20} height={20} fill="none">
        <path d="M3 13L13 3M3 6.5V3h3.5" stroke="#3452e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "Discount",
    headline: <>Thousands of cars<br/>with a discount</>,
    carsCount: "368 815 cars",
    image: "/images/discount_1x.webp",
    image2x: "/images/discount_2x.webp",
    alt: "discount cars",
  },
  {
    href: "/cars?car-style[]=CARSTYLE_SUV_OFFROAD",
    title: "SUV",
    image: "/images/suv.webp",
    alt: "SUV",
  },
  {
    href: "/cars?family-cars=1",
    title: "Family car",
    image: "/images/family.webp",
    alt: "Family car",
  },
  {
    href: "/cars?car-style[]=CARSTYLE_ESTATE_CAR",
    title: "Estate",
    image: "/images/combi.webp",
    alt: "Estate",
  },
  {
    href: "/cars?city-cars=1",
    title: "City",
    image: "/images/city.webp",
    alt: "City",
  },
  {
    href: "/cars?premium-cars=1",
    title: "Luxury",
    image: "/images/luxury.webp",
    alt: "Luxury",
  },
  {
    href: "/cars?mileage-to=15000&registration-date-from=2023",
    title: "Nearly new",
    image: "/images/almost-new.webp",
    alt: "Nearly new",
  },
  {
    href: "/cars?sports-cars=1",
    title: "Sport",
    image: "/images/sport.webp",
    alt: "Sport",
  },
];

export default function PopularCar() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section className="bg-white py-10 border-b border-[#e6e9f3]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#253887] mb-7">Popular at Carvago</h2>
        <div className="relative">
          <Swiper
            slidesPerView={1.15}
            spaceBetween={24}
            breakpoints={{
              640: { slidesPerView: 2.2 },
              1024: { slidesPerView: 3.5 },
              1280: { slidesPerView: 4.5 },
            }}
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
            {slides.map((slide, idx) =>
              slide.banner ? (
                <SwiperSlide key={idx}>
                  <a href={slide.href} className="block group relative rounded-2xl bg-gradient-to-br from-[#f7fafd] to-white shadow hover:shadow-lg transition overflow-hidden px-6 pt-6 pb-5 h-[330px]">
                    <div className="flex items-center gap-2 mb-2">
                      {slide.icon}
                      <span className="text-[#3452e1] font-bold text-sm">{slide.label}</span>
                    </div>
                    <h4 className="text-xl font-extrabold text-[#253887] mb-2" dangerouslySetInnerHTML={{__html: slide.headline}} />
                    <p className="text-[#3452e1] font-semibold flex items-center gap-2">
                      {slide.carsCount}
                      <svg viewBox="0 0 24 24" width={18} height={18} fill="#3452e1"><path d="M9 6l6 6-6 6" stroke="#3452e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </p>
                    <img
                      src={slide.image}
                      srcSet={`${slide.image2x} 2x`}
                      alt={slide.alt}
                      className="absolute bottom-0 right-0 w-[220px] h-[130px] object-contain z-10"
                      style={{zIndex: 1}}
                    />
                  </a>
                </SwiperSlide>
              ) : (
                <SwiperSlide key={idx}>
                  <a href={slide.href} className="block group relative rounded-2xl bg-white border border-[#e6e9f3] shadow hover:shadow-lg transition overflow-hidden px-6 pt-8 pb-5 h-[230px] flex flex-col items-start">
                    <h4 className="text-lg font-extrabold text-[#253887] mb-3 flex items-center gap-2">
                      {slide.title}
                      <svg viewBox="0 0 24 24" width={18} height={18} fill="none"><path d="M16.33 10H3" stroke="#3452e1" strokeWidth="1.67" strokeLinecap="round"/><path d="M12.17 4.17L18 10l-5.83 5.83" stroke="#3452e1" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </h4>
                    <img
                      src={slide.image}
                      alt={slide.alt}
                      width={200}
                      height={120}
                      className="w-[200px] h-[120px] object-contain"
                    />
                  </a>
                </SwiperSlide>
              )
            )}
            {/* Navigation */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 z-20">
              <button ref={prevRef} className="swiper-btn-prev bg-white border rounded-full shadow p-2 hover:bg-[#f6f8fd] transition" aria-label="Previous slide">
                <svg viewBox="0 0 24 24" width={22} height={22} fill="none"><path d="M15 6l-6 6 6 6" stroke="#3452e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
            <div className="absolute top-1/2 right-0 -translate-y-1/2 z-20">
              <button ref={nextRef} className="swiper-btn-next bg-white border rounded-full shadow p-2 hover:bg-[#f6f8fd] transition" aria-label="Next slide">
                <svg viewBox="0 0 24 24" width={22} height={22} fill="none"><path d="M9 6l6 6-6 6" stroke="#3452e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </Swiper>
        </div>
      </div>
    </section>
  );
}