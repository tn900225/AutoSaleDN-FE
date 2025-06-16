import React from "react";

// DATA ARRAYS
const popularCategories = [
  { label: "SUV", href: "/cars?car-style[]=CARSTYLE_SUV_OFFROAD" },
  { label: "Estate", href: "/cars?car-style[]=CARSTYLE_ESTATE_CAR" },
  { label: "Luxury", href: "/cars?premium-cars=1" },
  { label: "Sport", href: "/cars?sports-cars=1" },
  { label: "Family car", href: "/cars?family-cars=1" },
  { label: "City", href: "/cars?city-cars=1" },
  { label: "Nearly new", href: "/cars?mileage-to=15000&registration-date-from=2023" },
];
const selectedMakes = [
  { label: "Volkswagen", href: "/cars/volkswagen" },
  { label: "BMW", href: "/cars/bmw" },
  { label: "Ford", href: "/cars/ford" },
  { label: "Skoda", href: "/cars/skoda" },
  { label: "Seat", href: "/cars/seat" },
  { label: "Mercedes-Benz", href: "/cars/mercedes-benz" },
  { label: "Audi", href: "/cars/audi" },
  { label: "Opel", href: "/cars/opel" },
  { label: "Renault", href: "/cars/renault" },
  { label: "Hyundai", href: "/cars/hyundai" },
];
const selectedModels = [
  { label: "Volkswagen Golf", href: "/cars/volkswagen/golf" },
  { label: "Volkswagen Polo", href: "/cars/volkswagen/polo" },
  { label: "Audi A3", href: "/cars/audi/a3" },
  { label: "Ford Focus", href: "/cars/ford/focus" },
  { label: "Audi A6", href: "/cars/audi/a6" },
  { label: "Audi A4", href: "/cars/audi/a4" },
  { label: "Opel Astra", href: "/cars/opel/astra" },
  { label: "Volkswagen Passat", href: "/cars/volkswagen/passat" },
  { label: "Opel Corsa", href: "/cars/opel/corsa" },
  { label: "Skoda Octavia", href: "/cars/skoda/octavia" },
];

// COLUMN LINKS
const mainLinks = [
  {
    title: "Carvago",
    links: [
      { label: "Buy", href: "/cars" },
      { label: "How it works", href: "/how-auto-works" },
      { label: "Reviews", href: "/customer-reviews" },
      { label: "Electric & Hybrid", href: "/electric-hybrid-vehicles" },
      { label: "Site map", href: "/sitemap" }
    ]
  },
  {
    title: "Services",
    links: [
      { label: "CarAudit™", href: "/caraudit" },
      { label: "Delivery", href: "/car-delivery" },
      { label: "Financing", href: "/car-financing" },
      { label: "Warranty", href: "/warranty" }
    ]
  },
  {
    title: "For dealers",
    links: [
      { label: "Online auction", href: "/auction" },
      { label: "Dealer Cooperation", href: "/dealer" }
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about-us" },
      { label: "Contact", href: "/#homepage-contact" },
      { label: "Blog", href: "https://blog.carvago.com/de", external: true },
      { label: "Terms of Use", href: "/terms-and-conditions#footer-content" },
      { label: "Imprint", href: "/imprint" },
      { label: "Whistleblowing", href: "/whistleblowing" },
      { label: "Data Settings", href: "#", isButton: true }
    ]
  }
];

const paymentIcons = [
  { alt: "visa", src: "/images/visa.svg" },
  { alt: "visa-electron", src: "/images/visa-electron.svg" },
  { alt: "mastercard", src: "/images/mastercard.svg" },
  { alt: "maestro", src: "/images/maestro.svg" },
  { alt: "diners-club", src: "/images/diners-club.svg" },
  { alt: "discover", src: "/images/discover.svg" }
];

const socialLinks = [
  {
    href: "https://www.youtube.com/channel/UCYD3-RUVt3v6uO1KWyOfAGw",
    label: "YouTube",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" clipRule="evenodd" d="M5 0C2.23858 0 0 2.23858 0 5V19C0 21.7614 2.23858 24 5 24H19C21.7614 24 24 21.7614 24 19V5C24 2.23858 21.7614 0 19 0H5ZM10.2329 15.9005L16.5956 12.6192C16.7185 12.5569 16.8206 12.4668 16.8916 12.3581C16.9626 12.2494 17 12.1259 17 12.0002C17 11.8745 16.9626 11.751 16.8916 11.6423C16.8206 11.5336 16.7185 11.4435 16.5956 11.3812L10.2329 8.09985C9.69197 7.82078 9 8.15851 9 8.71843V15.2811C9 15.8419 9.69297 16.1787 10.2329 15.9005Z"/>
      </svg>
    )
  },
  {
    href: "https://cz.linkedin.com/company/carvago",
    label: "LinkedIn",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" clipRule="evenodd" d="M5 0C2.23858 0 0 2.23858 0 5V19C0 21.7614 2.23858 24 5 24H19C21.7614 24 24 21.7614 24 19V5C24 2.23858 21.7614 0 19 0H5ZM3.95676 20.3028H7.40389V9.22005H3.95676V20.3028ZM4.28934 7.10721C4.68471 7.50258 5.15422 7.70026 5.69785 7.70026C6.24148 7.70026 6.71098 7.50258 7.10635 7.10721C7.50172 6.71184 7.69941 6.24234 7.69941 5.6987C7.69941 5.15507 7.50172 4.68557 7.10635 4.2902C6.71098 3.89483 6.24148 3.69714 5.69785 3.69714C5.15422 3.69714 4.68471 3.89483 4.28934 4.2902C3.89397 4.68557 3.69629 5.15507 3.69629 5.6987C3.69629 6.24234 3.89397 6.71184 4.28934 7.10721ZM16.8562 20.3027H20.3033V14.2239C20.3033 12.5189 20.0562 11.2587 19.562 10.4432C18.9195 9.43007 17.7952 8.92351 16.189 8.92351C15.3983 8.92351 14.7064 9.12119 14.1133 9.51656C13.5697 9.8378 13.1743 10.2455 12.9272 10.7397H12.8901V9.22003H9.59126V20.3027H13.0013V14.817C13.0013 13.9521 13.1249 13.2973 13.372 12.8525C13.6932 12.2594 14.2492 11.9629 15.0399 11.9629C15.8307 11.9629 16.362 12.2965 16.6338 12.9637C16.782 13.3591 16.8562 14.0015 16.8562 14.8911V20.3027Z"/>
      </svg>
    )
  },
  {
    href: "https://www.facebook.com/carvagocom",
    label: "Facebook",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" clipRule="evenodd" d="M5 0C2.23858 0 0 2.23858 0 5V19C0 21.7614 2.23858 24 5 24H19C21.7614 24 24 21.7614 24 19V5C24 2.23858 21.7614 0 19 0H5ZM16.212 23.9999L12.6398 23.9999V14.6174H10.1588V11.2394H12.6398V8.35341C12.6398 6.08601 14.1057 4.00415 17.4826 4.00415C18.8498 4.00415 19.8608 4.13541 19.8608 4.13541L19.7813 7.28992C19.7813 7.28992 18.7502 7.28017 17.625 7.28017C16.4073 7.28017 16.212 7.84125 16.212 8.77269V11.2394H19.878L19.7183 14.6174H16.212V23.9999Z"/>
      </svg>
    )
  },
  {
    href: "https://www.instagram.com/carvago_de/",
    label: "Instagram",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" clipRule="evenodd" d="M5 0C2.23858 0 0 2.23858 0 5V19C0 21.7614 2.23858 24 5 24H19C21.7614 24 24 21.7614 24 19V5C24 2.23858 21.7614 0 19 0H5ZM9.64299 6.30853C10.3905 5.99907 11.1916 5.83995 12.0006 5.84024C12.8096 5.83995 13.6107 5.99907 14.3582 6.30853C15.1056 6.61798 15.7848 7.07169 16.3568 7.64373C16.9289 8.21578 17.3826 8.89494 17.692 9.64241C18.0015 10.3899 18.1606 11.191 18.1603 12C18.1606 12.809 18.0015 13.6101 17.692 14.3576C17.3826 15.105 16.9289 15.7842 16.3568 16.3563C15.7848 16.9283 15.1056 17.382 14.3582 17.6915C13.6107 18.0009 12.8096 18.16 12.0006 18.1597C11.1916 18.16 10.3905 18.0009 9.64299 17.6915C8.89552 17.382 8.21636 16.9283 7.64431 16.3563C7.07227 15.7842 6.61855 15.105 6.3091 14.3576C5.99965 13.6101 5.84053 12.809 5.84082 12C5.84053 11.191 5.99965 10.3899 6.3091 9.64241C6.61855 8.89494 7.07227 8.21578 7.64431 7.64373C8.21636 7.07169 8.89552 6.61798 9.64299 6.30853ZM8.00082 12C8.00082 14.211 9.78957 15.9997 12.0006 15.9997C14.2116 15.9997 16.0003 14.211 16.0003 12C16.0003 9.78899 14.2116 8.00024 12.0006 8.00024C9.78957 8.00024 8.00082 9.78899 8.00082 12ZM19.4256 6.6131C19.696 6.34295 19.8482 5.97649 19.8486 5.59424C19.8486 4.80149 19.1991 4.15649 18.4063 4.15649C18.2173 4.15649 18.0302 4.19372 17.8555 4.26605C17.6809 4.33838 17.5223 4.44439 17.3886 4.57804C17.255 4.71169 17.149 4.87035 17.0766 5.04497C17.0043 5.21958 16.9671 5.40674 16.9671 5.59574C16.9671 5.78475 17.0043 5.9719 17.0766 6.14652C17.149 6.32114 17.255 6.4798 17.3886 6.61345C17.5223 6.74709 17.6809 6.85311 17.8555 6.92544C18.0302 6.99777 18.2173 7.03499 18.4063 7.03499C18.7886 7.03499 19.1552 6.88325 19.4256 6.6131Z"/>
      </svg>
    )
  }
];

// FOOTER COMPONENT
export default function CarvagoFooter() {
  return (
    <footer className="bg-[#f4f7fc] pt-12 pb-2 font-['Montserrat',_Arial,_sans-serif] text-[#253887] text-[15px]">
      <div className="max-w-[1200px] mx-auto w-full px-5">
        {/* Top categories/models/makes */}
        <div className="flex flex-col lg:flex-row justify-center gap-10 mb-10">
          {/* Popular categories */}
          <div className="flex-1">
            <p className="font-bold text-[15px] mb-2">Popular categories</p>
            <div className="grid grid-cols-2 gap-x-10">
              <div className="flex flex-col space-y-1">
                {popularCategories.slice(0, 4).map(c => (
                  <a key={c.label} href={c.href} className="hover:underline font-normal"><p className="font-[EuclidCircularB,sans-serif] not-italic text-gray-600 text-[1.2rem] leading-[2rem] font-normal whitespace-nowrap md:text-[0.8rem] md:leading-[1.6rem]">
  {c.label}
</p></a>
                ))}
              </div>
              <div className="flex flex-col space-y-1">
                {popularCategories.slice(4).map(c => (
                  <a key={c.label} href={c.href} className="hover:underline font-normal"><p className="font-[EuclidCircularB,sans-serif] not-italic text-gray-600 text-[1.2rem] leading-[2rem] font-normal whitespace-nowrap md:text-[0.8rem] md:leading-[1.6rem]">
  {c.label}
</p></a>
                ))}
              </div>
            </div>
          </div>
          {/* Selected makes */}
          <div className="flex-1">
            <p className="font-bold text-[15px] mb-2">Selected makes</p>
            <div className="grid grid-cols-2 gap-x-10">
              <div className="flex flex-col space-y-1">
                {selectedMakes.slice(0, 5).map(c => (
                  <a key={c.label} href={c.href} className="hover:underline font-normal"><p className="font-[EuclidCircularB,sans-serif] not-italic text-gray-600 text-[1.2rem] leading-[2rem] font-normal whitespace-nowrap md:text-[0.8rem] md:leading-[1.6rem]">
  {c.label}
</p></a>
                ))}
              </div>
              <div className="flex flex-col space-y-1">
                {selectedMakes.slice(5).map(c => (
                  <a key={c.label} href={c.href} className="hover:underline font-normal"><p className="font-[EuclidCircularB,sans-serif] not-italic text-gray-600 text-[1.2rem] leading-[2rem] font-normal whitespace-nowrap md:text-[0.8rem] md:leading-[1.6rem]">
  {c.label}
</p></a>
                ))}
              </div>
            </div>
          </div>
          {/* Selected models */}
          <div className="flex-1">
            <p className="font-bold text-[15px] mb-2">Selected models</p>
            <div className="grid grid-cols-2 gap-x-10">
              <div className="flex flex-col space-y-1">
                {selectedModels.slice(0, 5).map(c => (
                  <a key={c.label} href={c.href} className="hover:underline font-normal">
                    <p className="font-[EuclidCircularB,sans-serif] not-italic text-gray-600 text-[1.2rem] leading-[2rem] font-normal whitespace-nowrap md:text-[0.8rem] md:leading-[1.6rem]">
  {c.label}
</p>
</a>
                ))}
              </div>
              <div className="flex flex-col space-y-1">
                {selectedModels.slice(5).map(c => (
                  <a key={c.label} href={c.href} className="hover:underline font-normal"><p className="font-[EuclidCircularB,sans-serif] not-italic text-gray-600 text-[1.2rem] leading-[2rem] font-normal whitespace-nowrap md:text-[0.8rem] md:leading-[1.6rem]">
  {c.label}
</p></a>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Divider */}
        <div className="border-t border-[#e8eaf3] my-6"></div>
        {/* Main links & logo */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-10 mb-3">
          {/* Logo + copyright + socials */}
          <div className="flex flex-col items-start md:items-start gap-3 min-w-[230px] md:min-w-[230px]">
            <img src="/images/logo.png" alt="AutoSaleDN logo" className="w-[130px] h-auto mb-2" />
            <span className="text-[13px] font-normal text-[#253887]">AutoSaleDN 2025 • All rights reserved</span>
            <div className="flex gap-4 mt-2">
              {socialLinks.map(item => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  className="text-[#253887] hover:text-[#3452e1] transition font-normal"
                >
                  {item.svg}
                </a>
              ))}
            </div>
          </div>
          {/* Main footer links */}
          <div className="flex flex-wrap gap-12 w-full justify-between">
            {mainLinks.map(group => (
              <div key={group.title} className="min-w-[150px]">
                <h6 className="font-bold text-[15px] mb-2">{group.title}</h6>
                <ul className="space-y-1">
                  {group.links.map(link =>
                    link.isButton ? (
                      <li key={link.label}>
                        <button className="text-[#3452e1] hover:underline text-left text-[15px] font-normal">
                          <p className="font-[EuclidCircularB,sans-serif] not-italic text-gray-600 text-[1.2rem] leading-[2rem] font-normal whitespace-nowrap md:text-[0.8rem] md:leading-[1.6rem]">
  {link.label}
</p>
                          </button>
                      </li>
                    ) : (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="text-[#3452e1] hover:underline text-[15px] font-normal"
                          target={link.external ? "_blank" : undefined}
                          rel={link.external ? "noopener noreferrer" : undefined}
                        >
                          <p className="chakra-text css-wjmqcc"><p className="font-[EuclidCircularB,sans-serif] not-italic text-gray-600 text-[1.2rem] leading-[2rem] font-normal whitespace-nowrap md:text-[0.8rem] md:leading-[1.6rem]">
  {link.label}
</p></p>
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
        {/* Divider */}
        <div className="border-t border-[#e8eaf3] my-7"></div>
        {/* Payments and legal */}
        <div className="flex flex-col items-start md:items-end md:flex-row md:justify-between mb-2">
          <div className="text-[13px] font-normal text-[#253887] mb-6 md:mb-0 ml-0 md:ml-0">
            We accept online card payments as well as wire transfers.
          </div>
          <div className="flex items-center gap-2 mb-6 md:mb-0">
            {paymentIcons.map(icon => (
              <img key={icon.alt} src={icon.src} alt={icon.alt} className="h-[30px] w-auto" />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}