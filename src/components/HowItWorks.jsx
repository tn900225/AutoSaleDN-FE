import React from "react";

export default function HowItWorks() {
  return (
    <section className="bg-[#f7f9fc] py-24">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-[#253887] mb-20" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          How does it work?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
            {/* Desktop image */}
            <img
              src="/images/how-it-works-1-2x.webp"
              alt="Choose anywhere in Da Nang"
              className="mb-8 w-[270px] h-[180px] object-contain hidden md:block"
            />
            {/* Mobile image */}
            <img
              src="/images/how-it-works-mobile-1-2x.webp"
              alt="Choose anywhere in Da Nang"
              className="mb-8 w-[200px] h-[120px] object-contain block md:hidden"
            />
            <p className="text-[#3452e1] text-lg font-bold mb-2 tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>01.</p>
            <h3 className="text-2xl font-extrabold text-[#253887] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Choose anywhere in Da Nang
            </h3>
            <p className="text-[#253887] text-base opacity-80 max-w-xs">
              No more compromises! With us, you have an unrivaled selection of cars in one place.
            </p>
          </div>
          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
            <img
              src="/images/how-it-works-2-2x.webp"
              alt="We'll inspect the car closely"
              className="mb-8 w-[270px] h-[180px] object-contain hidden md:block"
            />
            <img
              src="/images/how-it-works-mobile-2-2x.webp"
              alt="We'll inspect the car closely"
              className="mb-8 w-[200px] h-[120px] object-contain block md:hidden"
            />
            <p className="text-[#3452e1] text-lg font-bold mb-2 tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>02.</p>
            <h3 className="text-2xl font-extrabold text-[#253887] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              We'll inspect the car closely
            </h3>
            <p className="text-[#253887] text-base opacity-80 max-w-xs">
              A certified mechanic will thoroughly inspect your car. You will decide according to the result after.
            </p>
          </div>
          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <img
              src="/images/how-it-works-3-2x.webp"
              alt="We'll deliver it to your home"
              className="mb-8 w-[270px] h-[180px] object-contain hidden md:block"
            />
            <img
              src="/images/how-it-works-mobile-3-2x.webp"
              alt="We'll deliver it to your home"
              className="mb-8 w-[200px] h-[120px] object-contain block md:hidden"
            />
            <p className="text-[#3452e1] text-lg font-bold mb-2 tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>03.</p>
            <h3 className="text-2xl font-extrabold text-[#253887] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              You'll pick up the car at our showroom
            </h3>
            <p className="text-[#253887] text-base opacity-80 max-w-xs">
              We arrange all the paperwork and registration. All you need to do is come and pick up your new car.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}