import React, { useState } from "react";

// Icon SVGs for demo purpose
const icons = {
  exterior: (
    <svg width="32" height="32" fill="none"><rect x="6" y="14" width="20" height="11" rx="3" stroke="#253887" strokeWidth="2"/><circle cx="10" cy="27" r="2" fill="#253887"/><circle cx="22" cy="27" r="2" fill="#253887"/><rect x="11" y="16" width="10" height="5" rx="2" stroke="#253887" strokeWidth="1.5"/></svg>
  ),
  interior: (
    <svg width="32" height="32" fill="none"><rect x="9" y="12" width="14" height="10" rx="2" stroke="#253887" strokeWidth="2"/><rect x="13" y="16" width="6" height="6" rx="2" fill="#253887"/></svg>
  ),
  engine: (
    <svg width="32" height="32" fill="none"><rect x="9" y="16" width="14" height="7" rx="2" stroke="#253887" strokeWidth="2"/><circle cx="16" cy="19.5" r="1.5" fill="#253887"/></svg>
  ),
  chassis: (
    <svg width="32" height="32" fill="none"><rect x="7" y="22" width="18" height="3" rx="1.5" fill="#253887"/><rect x="14" y="12" width="4" height="10" rx="2" stroke="#253887" strokeWidth="2"/></svg>
  ),
  testdrive: (
    <svg width="32" height="32" fill="none"><rect x="8" y="20" width="16" height="3" rx="1.5" fill="#253887"/><path d="M8 24c4-8 12-8 16 0" stroke="#253887" strokeWidth="2"/></svg>
  ),
};

const checkGreen = (
  <svg width="18" height="18" fill="none">
    <circle cx="9" cy="9" r="9" fill="#44C776"/>
    <path d="M5 9l2.5 2.5L13 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const dots = (
  <span className="flex gap-1">
    {[...Array(5)].map((_, i) => (
      <span key={i} className="inline-block w-4 h-2 rounded-lg bg-[#44C776] opacity-90"></span>
    ))}
  </span>
);

// Mock data for car audit checks
const carAuditData = [
  {
    id: 1,
    mechanicReview: [
      "Car in the striking green Mamba paint. Very good condition, technically in perfect shape.",
      "No evidence of accidents or repainting. Suspension and brakes are in great shape.",
      "Minor scratches on the rear left door, but overall very well maintained.",
    ],
    mechanic: {
      name: "Horst B.",
      role: "Carvago Mechanic",
      avatar: "/images/HorstB.webp"
    },
    car: {
      image: "/images/skoda_octavia2.webp",
      name: "Škoda Octavia 2.0 TSI DSG RS 180 kW"
    },
    inspectionPoints: [
      { icon: icons.exterior, label: "Exterior" },
      { icon: icons.interior, label: "Interior" },
      { icon: icons.engine, label: "Engine" },
      { icon: icons.chassis, label: "Chassis" },
      { icon: icons.testdrive, label: "Testdrive" },
    ],
    checkedPoints: 270,
    partners: [
      { src: "/images/pirelli.svg", alt: "Pirelli" },
      { src: "/images/tuv.svg", alt: "Carvago" },
      { src: "/images/dekra.svg", alt: "Dekra" }
    ]
  },
  {
    id: 2,
    mechanicReview: [
      "Excellent paintwork and interior, the engine is running smoothly with no leaks.",
      "Tires are new, all safety systems functional.",
      "The navigation system is up-to-date and all lights are working properly.",
    ],
    mechanic: {
      name: "Julia K.",
      role: "Carvago Mechanic",
      avatar: "/images/KlausA.webp"
    },
    car: {
      image: "/images/bmw_x1.webp",
      name: "BMW 320i xDrive M Sport 135 kW"
    },
    inspectionPoints: [
      { icon: icons.exterior, label: "Exterior" },
      { icon: icons.interior, label: "Interior" },
      { icon: icons.engine, label: "Engine" },
      { icon: icons.chassis, label: "Chassis" },
      { icon: icons.testdrive, label: "Testdrive" },
    ],
    checkedPoints: 258,
    partners: [
      { src: "/images/pirelli.svg", alt: "Pirelli" },
      { src: "/images/carvago-cooperate.svg", alt: "Carvago" },
      { src: "/images/dekra.svg", alt: "Dekra" }
    ]
  },
  {
    id: 3,
    mechanicReview: [
      "Clean chassis, all electronic aids functional, ready for long journeys.",
      "Some stone chips on the front bumper, no rust detected.",
      "Service history is complete and up-to-date.",
    ],
    mechanic: {
      name: "Martin S.",
      role: "Carvago Mechanic",
      avatar: "/images/GunterK.webp"
    },
    car: {
      image: "/images/volvo_xc60.webp",
      name: "Mercedes-Benz C 200 d Avantgarde 118 kW"
    },
    inspectionPoints: [
      { icon: icons.exterior, label: "Exterior" },
      { icon: icons.interior, label: "Interior" },
      { icon: icons.engine, label: "Engine" },
      { icon: icons.chassis, label: "Chassis" },
      { icon: icons.testdrive, label: "Testdrive" },
    ],
    checkedPoints: 265,
    partners: [
      { src: "/images/pirelli.svg", alt: "Pirelli" },
      { src: "/images/carvago-cooperate.svg", alt: "Carvago" },
      { src: "/images/dekra.svg", alt: "Dekra" }
    ]
  },
];

function ReviewPreview({ sentences }) {
  // Only show the first sentence, shrink if too long, show tooltip with all sentences on hover
  const maxLength = 55;
  const firstSentence = sentences[0] || "";

  function shrinkSentence(s) {
    if (s.length > maxLength) return s.slice(0, maxLength) + "...";
    return s;
  }

  return (
    <span className="relative group cursor-pointer block" tabIndex={0}>
      <span className="text-[#253887] italic text-base leading-snug opacity-80 mb-1">
        {shrinkSentence(firstSentence)}
      </span>
      {/* Tooltip for all sentences */}
      {(
        firstSentence.length > maxLength ||
        sentences.length > 1
      ) && (
        <span
          className="absolute left-0 top-[-2.2rem] z-30 w-max min-w-[250px] max-w-[400px] bg-[#253887] text-white text-sm px-4 py-3 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity whitespace-pre-line"
          style={{
            whiteSpace: "pre-line",
          }}
        >
          {sentences.join("\n")}
        </span>
      )}
    </span>
  );
}

export default function CarAuditSection() {
  const [current, setCurrent] = useState(0);
  const total = carAuditData.length;

  const handlePrev = () => setCurrent((prev) => (prev === 0 ? total - 1 : prev - 1));
  const handleNext = () => setCurrent((prev) => (prev === total - 1 ? 0 : prev + 1));

  const check = carAuditData[current];

  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center px-4">
        {/* Left: Card */}
        <div className="relative flex-1 flex flex-col items-center">
          {/* Card back shadow */}
          <div className="absolute top-8 left-9 w-[520px] h-[420px] bg-white rounded-xl opacity-70 z-0 shadow-xl" style={{transform: 'rotate(-3deg)'}}></div>
          {/* Review Card */}
          <div className="relative z-10 bg-white rounded-xl max-w-lg w-[520px] shadow-xl border border-[#f0f2f7]">
            {/* Mechanic review quote */}
            <div className="flex items-start gap-4 border-b border-[#f0f2f7] px-8 pt-8 pb-4">
              <div>
                <ReviewPreview sentences={check.mechanicReview} />
                <div className="flex items-center gap-2 mt-2">
                  <img src={check.mechanic.avatar} alt={check.mechanic.name} className="w-8 h-8 rounded-full object-cover"/>
                  <div>
                    <div className="font-bold text-[#253887] text-sm leading-tight">{check.mechanic.name}</div>
                    <div className="text-xs text-gray-400 leading-tight">{check.mechanic.role}</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Main Card */}
            <div className="flex">
              {/* Car image */}
              <img
                src={check.car.image}
                alt={check.car.name}
                className="object-cover w-[180px] h-[120px] rounded-bl-xl"
                style={{borderTopLeftRadius: "0"}}
              />
              {/* Title */}
              <div className="flex-1 flex items-center px-6 border-b border-[#f0f2f7] min-h-[120px]">
                <h3 className="text-lg font-extrabold text-[#253887]" style={{fontFamily: "Montserrat, sans-serif"}}>
                  {check.car.name}
                </h3>
              </div>
            </div>
            {/* Inspection points */}
            <div className="px-8 py-5 border-b border-[#f0f2f7]">
              <div className="flex gap-8">
                <div className="flex flex-col gap-6 flex-1">
                  {check.inspectionPoints.map((item, i) => (
                    <div className="flex items-center gap-3" key={i}>
                      {item.icon}
                      <span className="ml-1 text-[#253887] text-base font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-8 justify-between pr-2">
                  {Array(5).fill(0).map((_, i) => (
                    <span key={i}>{dots}</span>
                  ))}
                </div>
              </div>
            </div>
            {/* Footer */}
            <div className="px-8 py-4 flex flex-col items-center justify-center gap-3">
              <span className="flex-shrink-0">{checkGreen}</span>
              <span className="text-[#253887] font-medium text-center">
                Checked all <span className="font-bold">{check.checkedPoints} points</span>
              </span>
            </div>
          </div>
          {/* Arrows */}
          <button
            className="absolute left-[-40px] top-1/2 -translate-y-1/2 bg-white shadow rounded-full w-10 h-10 flex items-center justify-center text-[#3452e1] hover:bg-[#f6f8fd] transition z-20"
            onClick={handlePrev}
            aria-label="Previous check"
          >
            <svg width="24" height="24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#3452e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button
            className="absolute right-[-40px] top-1/2 -translate-y-1/2 bg-white shadow rounded-full w-10 h-10 flex items-center justify-center text-[#3452e1] hover:bg-[#f6f8fd] transition z-20"
            onClick={handleNext}
            aria-label="Next check"
          >
            <svg width="24" height="24" fill="none"><path d="M9 6l6 6-6 6" stroke="#3452e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {carAuditData.map((_, idx) => (
              <span
                key={idx}
                className={`w-2 h-2 rounded-full ${current === idx ? "bg-[#3452e1]" : "bg-[#d5dbed]"}`}
              ></span>
            ))}
          </div>
          {/* Partners */}
          <div className="mt-10 text-center text-xs text-[#b7bfdc] font-bold tracking-wider">IN COOPERATION WITH</div>
          <div className="flex justify-center gap-8 mt-2 opacity-80">
            {check.partners.map((p, i) => (
              <img src={p.src} alt={p.alt} className="h-6" key={i} />
            ))}
          </div>
        </div>
        {/* Right: Text */}
        <div className="flex-1 flex flex-col justify-center px-3">
          <h2 className="text-4xl font-extrabold text-[#253887] mb-6 leading-tight" style={{fontFamily: "Montserrat, sans-serif"}}>
            A thorough car<br/>inspection -<br/>CarAudit™
          </h2>
          <p className="text-[#253887] opacity-80 text-lg mb-8 max-w-md">
            A qualified mechanic will thoroughly inspect your chosen car. You will receive a detailed report about the technical condition of the car, photo documentation, and our advice. You just take your time and decide.
          </p>
          <a
            href="#"
            className="inline-flex items-center justify-center px-7 py-3 bg-[#3452e1] rounded-lg text-white font-bold text-lg shadow-lg hover:bg-[#253887] transition w-fit mb-12"
          >
            More about CarAudit
            <svg width="24" height="24" fill="none" className="ml-3">
              <path d="M13 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 12h14" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </a>
          <hr className="my-8 border-t border-[#e3e7f3] max-w-md"/>
          <blockquote className="mb-2 italic text-[#253887] opacity-80 text-base leading-snug max-w-md">
            "I have never ever known so many details about a car before buying it!"
          </blockquote>
          <div className="flex items-center gap-3 mt-2">
            <img src="/images/jurgen-1x.webp" alt="Jürgen S." className="w-8 h-8 rounded-full object-cover"/>
            <span className="text-[#253887] font-bold text-sm">Jürgen S.</span>
            <span className="text-xs text-[#b7bfdc]">Linz</span>
          </div>
        </div>
      </div>
    </section>
  );
}