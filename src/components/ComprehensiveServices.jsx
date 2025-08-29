import React from "react";

// Icon SVG inline (chuẩn style nguyên bản)
const icons = [
  // Financing
  (
    <span className="service-icon-bg">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="0" y="0" width="36" height="36" rx="10" fill="#F0F3FF" />
        <path d="M14.5 16.8V14.5C14.5 12.0147 16.5147 10 19 10C21.4853 10 23.5 12.0147 23.5 14.5C23.5 16.9853 21.4853 19 19 19H18.5" stroke="#4650dd" strokeWidth="2" strokeLinecap="round" />
        <circle cx="18" cy="23" r="3" stroke="#4650dd" strokeWidth="2" />
        <path d="M22.5 26.5C21.5 27.5 19 27.5 18 26.5C17 25.5 17 23.5 18 22.5C19 21.5 21.5 21.5 22.5 22.5" stroke="#4650dd" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </span>
  ),
  // CarAudit
  (
    <span className="service-icon-bg">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="0" y="0" width="36" height="36" rx="10" fill="#F0F3FF" />
        <rect x="10" y="17" width="16" height="6" rx="2" stroke="#4650dd" strokeWidth="2" />
        <path d="M11 23.5V25C11 25.8284 11.6716 26.5 12.5 26.5H23.5C24.3284 26.5 25 25.8284 25 25V23.5" stroke="#4650dd" strokeWidth="2" />
        <circle cx="14" cy="27" r="1" fill="#4650dd" />
        <circle cx="22" cy="27" r="1" fill="#4650dd" />
      </svg>
    </span>
  ),
  // Delivery
  (
    <span className="service-icon-bg">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="0" y="0" width="36" height="36" rx="10" fill="#F0F3FF" />
        <rect x="10" y="17" width="10" height="6" rx="2" stroke="#4650dd" strokeWidth="2" />
        <rect x="21" y="19" width="5" height="4" rx="1" stroke="#4650dd" strokeWidth="2" />
        <circle cx="12" cy="25" r="1" fill="#4650dd" />
        <circle cx="24" cy="25" r="1" fill="#4650dd" />
        <path d="M26 23V21M26 21H24M26 21H27" stroke="#4650dd" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </span>
  ),
  // Warranty
  (
    <span className="service-icon-bg">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="0" y="0" width="36" height="36" rx="10" fill="#F0F3FF" />
        <circle cx="18" cy="19" r="6" stroke="#4650dd" strokeWidth="2" />
        <path d="M16.5 19.5L18 21L21 18" stroke="#4650dd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  ),
  // Insurance
  (
    <span className="service-icon-bg">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="0" y="0" width="36" height="36" rx="10" fill="#F0F3FF" />
        <rect x="12" y="13" width="12" height="10" rx="3" stroke="#4650dd" strokeWidth="2" />
        <path d="M18 19.5L20 21L24 17" stroke="#4650dd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  ),
  // Vehicle registration
  (
    <span className="service-icon-bg">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="0" y="0" width="36" height="36" rx="10" fill="#F0F3FF" />
        <rect x="13" y="11" width="10" height="14" rx="2" stroke="#4650dd" strokeWidth="2" />
        <path d="M15 15H21" stroke="#4650dd" strokeWidth="2" strokeLinecap="round" />
        <path d="M15 19H21" stroke="#4650dd" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </span>
  ),
];

// Check icon xanh lá
const checkIcon = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ display: "inline", verticalAlign: "middle" }}>
    <circle cx="9" cy="9" r="9" fill="#44C776" />
    <path d="M5 9l2.5 2.5L13 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const services = [
  {
    title: "Financing",
    points: [
      "Completely online within 1 hour",
      "Transparent, no fine print"
    ]
  },
  {
    title: "CarAudit™",
    points: [
      "Thorough vehicle check",
      "Qualified mechanics and technicians"
    ]
  },
  {
    title: "Installment Support",
    points: [
      "Flexible plans up to 72 months",
      "Quick and easy approval"
    ]
  },
  {
    title: "Warranty",
    points: [
      "Up to 36 months",
      "For all vehicles"
    ]
  },
  {
    title: "Insurance",
    points: [
      "Both third-party and comprehensive insurance",
      "Great rates for everyone"
    ]
  },
  {
    title: "Vehicle registration",
    points: [
      "Everything from emission-test to MOT",
      "Car registered in your name"
    ]
  }
];

export default function ComprehensiveServices() {
  return (
    <section className="cs-section">
      <div className="cs-container">
        <h2 className="cs-title">
          Comprehensive services just a few clicks away
        </h2>
        <p className="cs-desc">
          One-stop solution for all your needs, from the comfort of your home.
        </p>
        <div className="cs-grid">
          {services.map((service, idx) => (
            <a
              key={service.title}
              href={service.href || "#"}
              className={`cs-card${!service.href ? " cs-disabled" : ""}`}
              tabIndex={0}
            >
              <div className="cs-card-inner">
                {icons[idx]}
                <h4 className="cs-card-title">{service.title}</h4>
                <ul className="cs-list">
                  {service.points.map((point, i) => (
                    <li key={i} className="cs-list-item">
                      <span className="cs-check">{checkIcon}</span>
                      <span className="cs-list-text">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </a>
          ))}
        </div>
      </div>
      <style jsx>{`
        .cs-section {
          background: #f7f9fc;
          padding: 64px 0 64px 0;
        }
        .cs-container {
          max-width: 1600px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .cs-title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 800;
          color: #20225b;
          margin-bottom: 10px;
          font-family: 'Montserrat', 'Arial', sans-serif;
        }
        .cs-desc {
          text-align: center;
          color: #20225b;
          opacity: 0.8;
          font-size: 1.06rem;
          margin-bottom: 44px;
        }
        .cs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px 32px;
          max-width: 1480px;
          margin: 0 auto;
        }
        .cs-card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 8px 40px 0 rgba(32, 34, 91, 0.07);
          border: 1px solid #f3f5fa;
          padding: 0;
          text-decoration: none;
          display: flex;
          align-items: stretch;
          min-height: 324px;
          transition: box-shadow 0.18s;
        }
        .cs-card:hover,
        .cs-card:focus {
          box-shadow: 0 12px 32px 0 rgba(32, 34, 91, 0.11);
          outline: none;
        }
        .cs-disabled {
          pointer-events: none;
          opacity: 0.7;
        }
        .cs-card-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          padding: 38px 38px 28px 38px;
        }
        .service-icon-bg {
          background: #f0f3ff;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 68px;
          height: 68px;
          margin-bottom: 24px;
        }
        .service-icon {
          color: #4650dd;
          width: 36px;
          height: 36px;
          display: block;
        }
        .cs-card-title {
          font-size: 2rem;
          font-weight: 700;
          color: #20225b;
          margin: 0 0 28px 0;
          text-align: center;
          letter-spacing: -1px;
          font-family: 'Montserrat', 'Arial', sans-serif;
        }
        .cs-list {
          list-style: none;
          padding: 0;
          margin: 0;
          width: 100%;
        }
        .cs-list-item {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }
        .cs-list-item:last-child {
          margin-bottom: 0;
        }
        .cs-check {
          margin-right: 12px;
          display: flex;
          align-items: center;
        }
        .cs-list-text {
          color: #20225b;
          font-size: 1.08rem;
          opacity: 0.95;
          font-family: inherit;
        }
        @media (max-width: 1200px) {
          .cs-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 900px) {
          .cs-grid {
            grid-template-columns: 1fr;
            gap: 28px 0;
          }
          .cs-card-inner {
            padding: 32px 16px 24px 16px;
          }
        }
        @media (max-width: 600px) {
          .cs-title {
            font-size: 1.7rem;
          }
          .cs-card-title {
            font-size: 1.2rem;
            margin-bottom: 16px;
          }
          .cs-card-inner {
            padding: 22px 6px 16px 6px;
          }
        }
      `}</style>
    </section>
  );
}