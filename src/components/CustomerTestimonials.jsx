import React, { useState } from "react";

const reviews = [
  {
    name: "Paul M.",
    countryFlag: "/images/germany.svg",
    rating: 5,
    review: "We used AutoSaleDN on the recommendation of friends and have not regretted it. The car is as good as new and at a fraction of the original price. It serves us reliably and meets our needs completely. We were pleased about the warranty included in the price, but we are sure that we will not need to use it.",
    car: {
      brandLogo: "/images/toyota.webp",
      name: "Toyota RAV4",
      link: "/cars?model[]=MAKE_TOYOTA-MODELFAMILY_RAV4"
    },
    image: "https://storage.alpha-analytics.cz/resize/88895f8a-c061-4a1a-8448-2b760b4982bd?fit=outside&height=338&namespace=carvago-review-prod&width=540&withoutEnlargement=false",
    source: "https://www.google.com/maps/contrib/105675715770957779903/reviews?hl=cs"
  },
  {
    name: "Natascha S.",
    countryFlag: "/images/germany.svg",
    rating: 5,
    review: "I wanted a nice and well-maintained car, but a new one was beyond my financial means. It took me a long time to decide on a car on Carvag, but in the end I found a car and I'm very happy with it. It drives well and even has my favorite color. Thanks to the extended warranty, I feel that AutoSaleDN will take care of it if something goes wrong.",
    car: {
      brandLogo: "/images/audi.webp",
      name: "Audi A4",
      link: "/cars?model[]=MAKE_AUDI-MODELFAMILY_A4"
    },
    image: "https://storage.alpha-analytics.cz/resize/f0bb2b5a-5b53-4426-8cc0-2534f0672c79?fit=outside&height=338&namespace=carvago-review-prod&width=540&withoutEnlargement=false",
    source: "https://www.google.com/maps/contrib/105675715770957779903/reviews?hl=cs"
  },
  {
    name: "Hannah S.",
    countryFlag: "/images/germany.svg",
    rating: 5,
    review: "Hurray! I finally have the car I wanted so much. I'm glad that AutoSaleDN took care of everything and I didn't have to worry. In a word: great!",
    car: {
      brandLogo: "/images/mercedes_benz.webp",
      name: "Mercedes-Benz GLC 250",
      link: "/cars?model[]=MAKE_MERCEDES_BENZ-MODELFAMILY_GLC_250"
    },
    image: "https://storage.alpha-analytics.cz/resize/753631d2-0b86-4d1c-bc57-418d28da877c?fit=outside&height=338&namespace=carvago-review-prod&width=540&withoutEnlargement=false",
    source: "https://www.google.com/maps/contrib/104566869012127192795/reviews?authuser=2&hl=cs"
  },
  {
    name: "Muhittin B.",
    countryFlag: "/images/germany.svg",
    rating: 5,
    review: "Thank you very much for the uncomplicated and smooth handling of the purchase process. I can recommend you without reservation.",
    car: {
      brandLogo: "/images/volkswagen.webp",
      name: "Volkswagen Passat • 2022",
      link: "/cars?model[]=MAKE_VOLKSWAGEN-MODELFAMILY_PASSAT&registration-date-from=2022"
    },
    image: "https://storage.alpha-analytics.cz/resize/98c46a63-db32-41eb-971a-dd101c5607c3?fit=outside&height=338&namespace=carvago-review-prod&width=540&withoutEnlargement=false",
    source: "https://www.google.com/maps/contrib/104566869012127192795/reviews?authuser=2&hl=cs"
  },
  {
    name: "Friedrich M.",
    countryFlag: "/images/germany.svg",
    rating: 5,
    review: "I can only say praise and thanks. Buying through AutoSaleDN saved me a lot of time and worry.",
    car: {
      brandLogo: "/images/ford.webp",
      name: "Ford Explorer",
      link: "/cars?model[]=MAKE_FORD-MODELFAMILY_EXPLORER"
    },
    image: "https://storage.alpha-analytics.cz/resize/75ee7f27-4ce4-425d-9648-1d389b4caa01?fit=outside&height=338&namespace=carvago-review-prod&width=540&withoutEnlargement=false",
    source: "https://www.google.com/maps/contrib/104566869012127192795/reviews?authuser=2&hl=cs"
  },
];

const mediaLogos = [
  {
    href: "https://www.kfz-betrieb.vogel.de/die-naechste-gebrauchtwagenplattform-startet-a-a51287665d3d95cc6fd7c540d2802343/",
    title: "kfzBetrieb",
    logo: "/_next/static/media/kfz-betrieb.fd3ec3f4.svg#logo"
  },
  {
    href: "https://www.mannheimer-morgen.de/wirtschaft/auto_artikel,-auto-gebrauchtwagenhaendler-carvago-erreicht-deutschland-_arid,1878039.html",
    title: "mannheimerMorgen",
    logo: "/_next/static/media/morgen.eb1cc565.svg#logo"
  },
  {
    href: "https://auto-presse.de/autonews.php?newsid=6487352",
    title: "autoPresse",
    logo: "/_next/static/media/auto-presse.762db679.svg#logo"
  },
  {
    href: "https://www.focus.de/auto/news/schnaeppchen-auf-vier-raedern-ratgeber-guenstig-autos-kaufen_id_259510252.html",
    title: "focus",
    logo: "/_next/static/media/focus.0ba729fa.svg#logo"
  }
];

function StarRating({ value }) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="18" height="18" fill={i < value ? "#FFBB35" : "#D7E1EF"} viewBox="0 0 16 16">
          <path d="M7.67839 12.0633C7.87475 11.9385 8.12553 11.9385 8.32189 12.0633L11.7238 14.2246C12.1746 14.511 12.7469 14.1098 12.6313 13.5883L11.7073 9.41905C11.6608 9.20927 11.73 8.99065 11.8888 8.84588L14.9917 6.01634C15.3776 5.66449 15.1609 5.02182 14.6408 4.97537L10.6141 4.61577C10.3895 4.59571 10.1951 4.45142 10.1109 4.24224L8.55672 0.382247C8.35491 -0.118953 7.64536 -0.118952 7.44356 0.382248L5.88937 4.24224C5.80515 4.45142 5.61076 4.59571 5.38617 4.61577L1.35947 4.97537C0.839355 5.02182 0.622709 5.66449 1.00856 6.01634L4.11148 8.84588C4.27024 8.99065 4.33947 9.20927 4.29298 9.41905L3.36898 13.5883C3.2534 14.1098 3.82565 14.511 4.27652 14.2246L7.67839 12.0633Z" />
        </svg>
      ))}
    </div>
  );
}

const CARDS_VISIBLE = 5;

export default function CustomerTestimonials() {
  const [current, setCurrent] = useState(0);

  const handlePrev = () => setCurrent((prev) => Math.max(prev - 1, 0));
  const handleNext = () =>
    setCurrent((prev) =>
      Math.min(prev + 1, reviews.length - CARDS_VISIBLE)
    );

  return (
    <div className="bg-white py-12 px-0 min-h-screen">
      <div className="max-w-[1640px] mx-auto">
        {/* Title */}
        <h2 className="font-extrabold text-[2.4rem] text-[#20225b] mb-2 ml-12 mt-2 font-montserrat">
          What do our customers think?
        </h2>
        {/* Rating row */}
        <div className="flex items-center gap-4 mb-7 ml-12">
          <span className="text-[2.4rem] font-bold text-[#20225b]">4.8</span>
          <StarRating value={5} />
          <span className="text-[#20225b] opacity-80 text-[1.08rem]">1834 reviews</span>
        </div>
        {/* Arrow controls */}
        <div className="flex items-center gap-4 ml-12 mb-6">
          <button
            onClick={handlePrev}
            className="w-[38px] h-[38px] border-2 border-[#3452e1] bg-white text-[#3452e1] rounded-lg flex items-center justify-center text-xl transition hover:bg-[#e7eafd] hover:border-[#253887] hover:text-[#253887] disabled:opacity-50"
            disabled={current === 0}
          >
            <svg width="20" height="20" fill="none"><path d="M13 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button
            onClick={handleNext}
            className="w-[38px] h-[38px] border-2 border-[#3452e1] bg-white text-[#3452e1] rounded-lg flex items-center justify-center text-xl transition hover:bg-[#e7eafd] hover:border-[#253887] hover:text-[#253887] disabled:opacity-50"
            disabled={current >= reviews.length - CARDS_VISIBLE}
          >
            <svg width="20" height="20" fill="none"><path d="M7 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          {/* Dots */}
          <div className="flex gap-2">
            {Array.from({ length: reviews.length - CARDS_VISIBLE + 1 }).map((_, idx) => (
              <button
                key={idx}
                className={`w-[10px] h-[10px] rounded-full ${current === idx ? "bg-[#3452e1]" : "bg-[#d5dbed]"}`}
                onClick={() => setCurrent(idx)}
                aria-label={`Go to review set ${idx + 1}`}
              />
            ))}
          </div>
        </div>
        {/* Card list */}
        <div className="flex gap-7 px-12 mb-7 transition-all duration-300">
          {reviews
            .slice(current, current + CARDS_VISIBLE)
            .map((review, idx) => (
              <div
                key={idx}
                className="flex flex-col bg-white rounded-xl border border-[#e8eaf3] shadow-[0_2px_18px_0_rgba(32,34,91,0.10)] w-[340px] min-w-[340px] max-w-[340px] overflow-hidden"
              >
                {/* Review image */}
                <img
                  src={review.image}
                  alt=""
                  className="w-full h-[200px] object-cover rounded-t-xl"
                />
                {/* Card content */}
                <div className="flex flex-col px-5 pt-5 pb-2 flex-1">
                  <div className="flex items-center gap-2 font-bold text-[#20225b] text-[1.07rem] mb-1">
                    {review.name}
                    <img src={review.countryFlag} alt="" className="w-5 h-5" />
                  </div>
                  <div className="mb-2">
                    <StarRating value={review.rating} />
                  </div>
                  <p className="text-[#253887] opacity-95 text-[1rem] leading-[1.52] mb-2">{review.review}</p>

                </div>
                {/* Card footer */}
                <div className="border-t border-[#eceef7] px-5 py-3 bg-white flex items-center gap-3">
                  <img
                    src={review.car.brandLogo}
                    alt={review.car.name}
                    className="w-8 h-8 object-contain"
                  />
                  <div>
                    <div className="font-semibold text-[#253887] text-[1rem] leading-tight">{review.car.name}</div>
                    <a
                      href={review.car.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[#3452e1] text-[0.97rem] font-semibold underline gap-1"
                    >
                      Show similar cars
                      <svg width="18" height="18" fill="none" className="ml-1">
                        <path d="M9 6l6 6-6 6" stroke="#3452e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5 12h10" stroke="#3452e1" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
        </div>
        {/* Media trust */}
        <div className="mt-12 flex flex-col items-center">
          <p className="text-[#253887] text-base font-bold mb-3 tracking-wide uppercase">They also trust us in the media</p>
        </div>
      </div>
    </div>
  );
}