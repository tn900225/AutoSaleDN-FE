import React, { useState, useEffect, useRef } from "react";

const steps = [
  { number: "01.", label: "Choose a car", anchor: "chooseYourCar" },
  { number: "02.", label: "We check up the car", anchor: "checkUpCar" },
  { number: "03.", label: "Order and pay", anchor: "orderAndPay" },
  { number: "04.", label: "We will provide a guarantee", anchor: "benefits" },
  { number: "05.", label: "We buy out the car", anchor: "carBuyOut" },
  { number: "06.", label: "We deliver", anchor: "carDeliver" },
];

const benefits = [
  {
    icon: "ri-coins-line",
    title: "Money back guarantee",
    desc: "If you don't fall in love with the vehicle, simply return it to us.",
    moreTitle: "Can I really return the car?",
    more: (
      <>
        <p><strong>Of course, you can. </strong>We trust our service and know that <strong>we only sell inspected vehicles in excellent technical condition.</strong> Together with our customers we are fighting for better vehicles on roads.</p>
        <p><strong>AutoSaleDN, therefore, always assumes all risks connected with the vehicle.</strong> And if you simply don’t like the car, <strong>you can return it to us up to 14 days after receiving it.</strong></p>
      </>
    ),
  },
  {
    icon: "ri-shield-check-line",
    title: "Safe purchase",
    desc: "We guarantee the technical condition of every vehicle sold.",
    moreTitle: "You don’t risk anything buying",
    more: (
      <>
        <p><strong>AutoSaleDN is the safest way of buying a used car.</strong> Before each purchase we first of all carefully examine the chosen car and<strong> you then decide on the basis of its current condition</strong> and our recommendation.</p>
        <p>You always sign the contract with AutoSaleDN, so <strong>all guarantees are provided by us - you only need to buy the car, in your native language.</strong></p>
        <p>Wherever the car is from, you always make the payment to a local account in your local currency.</p>
      </>
    ),
  },
  {
    icon: "ri-file-shield-line",
    title: "12-month warranty",
    desc: "In addition, with every car you receive an extended warranty.",
    moreTitle: "You receive an extended warranty on the car",
    more: (
      <>
        <p>For even greater peace of mind, aside from the warranty for hidden defects, you also have from us <strong>an extended 12-month warranty on the essentials</strong> - the engine, gearbox and differential.</p>
        <p>If you want even more, you can choose a longer period of coverage for other parts of the vehicle in the order.</p>
      </>
    ),
  },
];

export default function HowCarvagoWorks() {
  const [openBenefit, setOpenBenefit] = useState(null);
  const [showStickySteps, setShowStickySteps] = useState(false);


  const chooseYourCarRef = useRef(null);
  const checkUpCarRef = useRef(null);
  const orderAndPayRef = useRef(null);
  const benefitsSectionRef = useRef(null);
  const carBuyOutRef = useRef(null);
  const carDeliverRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById("carvago-hero");
      if (!hero) return;
      const { bottom } = hero.getBoundingClientRect();
      setShowStickySteps(bottom <= 0);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll to step when click sticky nav
  const handleStepNavClick = (idx) => {
    if (idx === 0 && chooseYourCarRef.current) {
      chooseYourCarRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (idx === 1 && checkUpCarRef.current) {
      checkUpCarRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (idx === 2 && orderAndPayRef.current) {
      orderAndPayRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (idx === 3 && benefitsSectionRef.current) {
      benefitsSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (idx === 4 && carBuyOutRef.current) {
      carBuyOutRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (idx === 5 && carDeliverRef.current) {
      carDeliverRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

    const handleKnowMoreClick = () => {
    if (chooseYourCarRef.current) {
      chooseYourCarRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  return (
    <div className="w-full bg-white font-sans relative">
      {/* Sticky steps nav */}
      <div
        className={`fixed top-0 left-0 w-full z-30 bg-white transition-all duration-300 shadow-sm ${showStickySteps ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        style={{ minHeight: "52px" }}
      >
        <div className="flex justify-center items-center gap-2 py-3 select-none">
          {steps.map((step, i) => (
            <React.Fragment key={step.number}>
              <button
                type="button"
                className={`font-bold text-[#3452e1] text-base mx-1 focus:outline-none bg-transparent ${i === 0 ? "hover:underline" : ""
                  }`}
                onClick={() => handleStepNavClick(i)}
                tabIndex={0}
              >
                {step.number}
              </button>
              <span className="text-[#253887] text-base mr-3 font-medium">{step.label}</span>
              {i !== steps.length - 1 && (
                <span className="text-[#bfc8dc] font-bold px-1">|</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Hero section */}
      <div
        id="carvago-hero"
        className="w-full flex flex-col md:flex-row items-stretch min-h-[540px] pb-12 pt-10 md:pt-24 md:pb-14 px-4 md:px-0 relative"
      >
        {/* Left: text */}
        <div className="flex flex-col md:flex-row w-full min-h-[340px]">
          <div className="flex-1 flex flex-col justify-center pl-0 md:pl-[9vw] z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-[#253887] mb-8 leading-tight">
              How does AutoSaleDN work?
            </h1>
            <div className="text-xl text-[#253887] font-semibold leading-relaxed mb-6 max-w-xl">
              Simply. Choose a car. We will arrange a detailed inspection.<br />
              Based on that you can decide whether you want the car. We
              then buy it, arrange an extended warranty, register it and
              deliver it to you.
            </div>
            <button className="flex items-center gap-2 bg-[#3452e1] hover:bg-[#253887] text-white font-bold rounded-xl px-5 py-3 text-base md:text-lg shadow transition focus:outline-none w-full max-w-xl justify-center md:justify-start" onClick={handleKnowMoreClick}>
              <i className="ri-arrow-down-line text-xl"></i>
              <span className="font-bold text-base md:text-lg">I want to know more</span>
            </button>
          </div>
          {/* Right: image with diagonal cut */}
          <div className="flex-1 relative min-h-[340px]">
            <div
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{
                clipPath:
                  "polygon(18% 0, 100% 0, 100% 100%, 0 100%)",
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0.01) 0%, rgba(255,255,255,0.6) 10%, rgba(255,255,255,0) 40%)",
                zIndex: 1,
              }}
            />
            <img
              src="/images/how-carvago-works-hero.webp"
              alt="How AutoSaleDN works"
              className="absolute inset-0 w-full h-full object-cover object-right rounded-tr-2xl rounded-br-2xl"
              style={{ zIndex: 0 }}
            />
          </div>
        </div>
      </div>



      {/* Benefits */}
      <div className="px-4 md:px-0 w-full pb-10">
        <div className="flex flex-col md:flex-row gap-4 max-w-6xl mx-auto">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="bg-[#f5f8ff] flex-1 rounded-2xl px-7 py-7 flex flex-row gap-4 items-start shadow-sm border border-[#e5e7eb] min-w-[220px]"
            >
              <i className={`${b.icon} text-3xl text-[#3452e1] mr-4 mt-1`} />
              <div>
                <div className="font-bold text-[#253887] text-lg mb-1">{b.title}</div>
                <div className="text-[#425187] text-base font-medium">{b.desc}</div>
                <button
                  className="flex items-center gap-1 text-[#3452e1] font-semibold text-sm hover:underline mt-3"
                  onClick={() => setOpenBenefit(openBenefit === i ? null : i)}
                >
                  More
                  <i className={`ri-add-circle-fill text-lg transition-transform ${openBenefit === i ? "rotate-45" : ""}`}></i>
                </button>
                {openBenefit === i && (
                  <div className="mt-4 bg-white rounded-lg p-4 shadow-inner border border-[#e5e7eb]">
                    <div className="flex items-center mb-2">
                      <i className="ri-close-line text-lg text-[#3452e1] mr-2"></i>
                      <h6 className="font-bold text-[#253887]">{b.moreTitle}</h6>
                    </div>
                    <div className="text-[#425187] text-sm">{b.more}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Step 01 - Choose Your Car */}
      <section
        id="chooseYourCar"
        ref={chooseYourCarRef}
        className="w-full py-16 bg-white"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 md:gap-20 px-4">
          {/* Left: Step content */}
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <h3 className="text-[#3452e1] text-3xl font-bold mr-4">01.</h3>
              <h4 className="text-2xl font-bold text-[#253887]">1 000 000 cars per click</h4>
            </div>
            <p className="text-[#425187] text-base mb-6">
              We process over 7 million ads every day, but we recommend only 10% of them for purchase. With the remaining cars, something often "doesn't fit" us.
            </p>
            {/* Accordion Q&A */}
            <div className="space-y-4">
              <Accordion
                title="Why do you not show cars from all of the dealers?"
                content={
                  <>
                    We only work with tried and tested dealers and only select cars which meet strict criteria. From 7 million adverts, we only recommend 1 000 000 cars for purchase, which is however still 10x more than the number of cars on offer in the Czech Republic.
                    In addition to that, each vehicle must pass a thorough technical inspection consisting of more than 270 parameters before it can be sold. You will receive the result of the entire inspection and photo documentation together with our recommendation in advance.
                  </>
                }
              />
              <Accordion
                title="Do you sell only cars that have been inspected?"
                content={
                  <>
                    Each vehicle must pass a thorough technical inspection consisting of more than 270 parameters before it can be sold. In addition to this, AutoSaleDN becomes the owner of the car before it is delivered to the customer and assumes all risks associated with the vehicle. And if there is any problem, you can return the car to us at any time within 14 days of purchase.
                  </>
                }
              />
              <Accordion
                title="Where do the cars in your offer come from?"
                content={
                  <>
                    The size of the offer often determines whether or not you find the car you are looking for. So far, customers in the Czech Republic have been able to choose from 70,000 cars. However, AutoSaleDN offers more than 1 000 000. And each car is just as close as the next - one click away. And since you are buying the car from us, communication is always only in Czech, regardless where the car is located. We will take care of any language and legal issues.
                    If you're looking for a 2017 Volkswagen Golf with a diesel engine and a mileage of at most 50,000 kilometers, you will find about 10 of them for sale in the Czech Republic. You will find at least 153 cars with these parameters at AutoSaleDN. And a lot of them at a better price, with better equipment or better looking.
                  </>
                }
              />
            </div>
            {/* Advisor desktop */}
            <div className="hidden md:block mt-8">
              <div className="flex gap-8 items-center">
                <img
                  src="/images/how-carvago-works-banner-advice.webp"
                  alt="AutoSaleDN offer"
                  className="w-52 h-auto max-h-80 object-contain rounded-xl"
                />
                <div>
                  <h6 className="text-lg font-bold text-[#253887] mb-2">We are your trusted advisor</h6>
                  <span className="text-[#425187] text-base font-medium">
                    <strong>We offer vehicles from trustworthy sellers, we are not their owners. This is why we are always pleased to advise you objectively.</strong> We don’t need to get rid of any unsellable vehicles which have been standing in the car lot for half a year.
                  </span>
                </div>
              </div>
            </div>
            {/* Advisor mobile */}
            <div className="block md:hidden mt-8">
              <div className="flex flex-col items-center">
                <img
                  src="/images/how-carvago-works-banner-advice-mobile.webp"
                  alt="AutoSaleDN offer"
                  className="w-60 h-auto max-h-80 object-contain rounded-xl mb-3"
                />
                <h6 className="text-lg font-bold text-[#253887] mb-2 text-center">We are your trusted advisor</h6>
                <span className="text-[#425187] text-base font-medium text-center">
                  <strong>We offer vehicles from trustworthy sellers, we are not their owners. This is why we are always pleased to advise you objectively.</strong> We don’t need to get rid of any unsellable vehicles which have been standing in the car lot for half a year.
                </span>
              </div>
            </div>
          </div>
          {/* Right: step illustration */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <img
              src="/images/how-carvago-works-offer-en.webp"
              alt="Offer"
              className="w-full max-w-md h-auto object-contain rounded-xl"
            />
          </div>
        </div>
      </section>

      <section
        id="checkUpCar"
        ref={checkUpCarRef}
        className="w-full py-16 bg-white"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 md:gap-20 px-4">
          {/* Left: Step content */}
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <h3 className="text-[#3452e1] text-3xl font-bold mr-4">02.</h3>
              <h4 className="text-2xl font-bold text-[#253887]">We arrange a vehicle inspection</h4>
            </div>
            <p className="text-[#425187] text-base mb-6">
              We do not own cars in our offer, so we must first thoroughly check them. We know specific models and motorizations perfectly and we know what to focus on for each of them.
            </p>
            {/* Accordion Q&A */}
            <div className="space-y-4">
              <Accordion
                title="Which things do we check?"
                content={
                  <>
                    First of all, we physically inspect each car using the CarAudit service which includes 270 inspection points, VIN verification and detailed photos of any damage. Where possible, we request complete service documentation which we compare with the physical condition of the car and the records from the authorised dealers. We also compare the car with other cars on the market of a similar age and with a similar mileage. We only recommend cars in excellent technical condition.
                  </>
                }
              />
              <Accordion
                title="Who inspects the car?"
                content={
                  <>
                    Depending on the car’s country of origin, we either use our network of authorised technicians to perform a thorough inspection, or work with local authorised centres, such as Dekra, TUV, Pirelli and others. Everything is performed in line with a standardised process and the result is compared with similar cars on the market. We only recommend cars in excellent technical condition.
                  </>
                }
              />
              <Accordion
                title="What if the car fails the inspection?"
                content={
                  <>
                    Despite the fact that we analyse more than 7 million adverts every day and only pass 10% of them for inclusion in our offer, the result of the vehicle inspection need not necessarily be satisfactory. We will tell you quite transparently why the car didn’t pass and why we are not recommending that you purchase it. <br />
                    If we find the car to be unsuitable, you will not lose any money and we will refund the inspection fee. You also have the option of choosing another car.
                  </>
                }
              />
              <Accordion
                title="How much does a CarAudit™ cost?"
                content={
                  <>
                    The actual inspection of the car will cost you €119 and we are usually able to arrange this within 2 working days. You will receive a detailed report from the inspection together with our recommendation and you can then decide for yourself whether you want to buy the car. The vehicle inspection fee is a one-off fee and covers our costs for the call out of the technician, physical inspection, test drive, verification of the vehicle’s origin and condition, and the recommendation to purchase. If we find the car to be unsuitable, you will not lose any money and we will refund the CarAudit™ payment. You also have the option of choosing another car.
                  </>
                }
              />
            </div>
          </div>
          {/* Right: Video & info */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                <img
                  src="/images/car-audit-how-it-works_1x.b01ca570.webp"
                  srcSet="/images/car-audit-how-it-works_1x.b01ca570.webp 552w, /images/car-audit-how-it-works_2x.75623728.webp 1104w"
                  alt="A mechanic inspecting a car engine with a diagnostic device, with the hood open."
                  className="rounded-xl w-[320px] md:w-[448px] object-cover"
                  sizes="(min-width: 768px) 55.2rem, 32.8rem"
                />
              </div>
              <h4 className="text-xl font-bold text-[#253887] mb-3 text-center">
                How does CarAudit work?
              </h4>
            </div>
            <div className="flex flex-col items-center bg-white rounded-xl shadow p-6 w-full max-w-lg">
              <div className="flex items-center mb-4">
                <svg viewBox="0 0 64 64" className="w-12 h-12 text-[#3E47DD] mr-3" fill="none">
                  <path d="M10 26.9985C12.6566 18.9002 19.4245 12.5088 28 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 6" />
                  <path d="M49 15.9985L52.5002 12.4987" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M53.4998 8.49902L56.9999 11.9989" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 32.9979C9 45.6993 19.5213 55.9958 32.5 55.9958C45.4787 55.9958 56 45.6993 56 32.9979C56 20.2965 45.4787 10 32.5 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9.69871 30.2153L12.8391 33.937C13.2031 34.3503 12.9076 34.9971 12.3548 34.9971L5.6442 34.9971C5.09139 34.9971 4.79594 34.3503 5.15996 33.937L8.73024 30.2153C8.98659 29.9243 9.44235 29.9243 9.69871 30.2153Z" fill="#3E47DD" />
                  <path d="M51.4999 32.4971H55.9999" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M32.5 9.99902L32.5 14.499" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M32.5001 51.4951L32.5001 55.9951" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M32 21L32 31M18 34L29 34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="32" cy="34" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <h6 className="font-bold text-[#253887] text-lg mb-1">Result of inspection within 2 working days</h6>
                  <p className="text-[#425187] text-base font-medium">
                    We are able to supply the result of the inspection within 2 working days of it being ordered in 93% of cases.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="orderAndPay"
        ref={orderAndPayRef}
        className="w-full py-16 bg-white"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 md:gap-20 px-4">
          {/* Left: Step content */}
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <h3 className="text-[#3452e1] text-3xl font-bold mr-4">03.</h3>
              <h4 className="text-2xl font-bold text-[#253887]">
                Financing online
                <br />
                within 1 hour
              </h4>
            </div>
            <p className="text-[#425187] text-base mb-6">
              You can either pay for the car with your own money or use financing via AutoSaleDN. We have above-standard conditions agreed with many verified banks and financial service providers.
            </p>
            {/* Accordion Q&A */}
            <div className="space-y-4">
              <Accordion
                title="Can I also pay in cash at the branch?"
                content={
                  <>
                    In view of the fact that this is an online sale, payment in cash is not possible. Payment can be made either by bank transfer or by means of a cash deposit to our account in the bank.
                  </>
                }
              />
              <Accordion
                title="I like the car. What comes next?"
                content={
                  <>
                    Once you have chosen your car and decided to have it inspected, you then choose the method of payment, either bank transfer or using financing from one of our partners. In the last step of the order, you can choose from a wide range of additional services.
                  </>
                }
              />
              <Accordion
                title="Can I sell my old car on AutoSaleDN?"
                content={
                  <>
                    Yes, that is possible. Please fill in the form with basic information about your car and we will then contact you to discuss the purchase options.
                  </>
                }
              />
              <Accordion
                title="Can I buy the car on credit?"
                content={
                  <>
                    Yes, you can either pay the whole purchase price of the car or choose the option of financing with a down payment. First of all, you order and pay for the inspection of the car to confirm your interest in the chosen car. We will pass on your request, together with your chosen car details to our financial partners for evaluation. You don’t have to worry about anything. As soon as we receive the result we will let you know.
                  </>
                }
              />
              <Accordion
                title="I have already received the documentation showing the result of the inspection. What happens next?"
                content={
                  <>
                    If you have decided to buy the car, confirm the order. We will issue you a proforma invoice for the remaining price of the car and handle all the formalities, so that you can have your chosen car as soon as possible.
                  </>
                }
              />
            </div>
            {/* AutoSaleDN warranty desktop */}
            <div className="hidden md:block mt-8">
              <div className="flex gap-8 items-center">
                <img
                  src="/images/how-carvago-works-banner-order.webp"
                  alt="Car order"
                  className="w-52 h-auto max-h-80 object-contain rounded-xl"
                />
                <div>
                  <h6 className="text-lg font-bold text-[#253887] mb-2">AutoSaleDN warranty</h6>
                  <span className="text-[#425187] text-base font-medium">
                    Because we are buying the car for you, we assume the warranty ourselves. <strong>Vehicle returns are arranged through us</strong>, in your native language, not with the original seller.
                  </span>
                </div>
              </div>
            </div>
            {/* AutoSaleDN warranty mobile */}
            <div className="block md:hidden mt-8">
              <div className="flex flex-col items-center">
                <img
                  src="/images/how-carvago-works-banner-order-mobile.webp"
                  alt="Car order"
                  className="w-60 h-auto max-h-80 object-contain rounded-xl mb-3"
                />
                <h6 className="text-lg font-bold text-[#253887] mb-2 text-center">AutoSaleDN warranty</h6>
                <span className="text-[#425187] text-base font-medium text-center">
                  Because we are buying the car for you, we assume the warranty ourselves. <strong>Vehicle returns are arranged through us</strong>, in your native language, not with the original seller.
                </span>
              </div>
            </div>
          </div>
          {/* Right: Financing info & image */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center mb-6">
              <img
                src="/images/how-carvago-works-car-order-en.webp"
                alt="Car order"
                className="rounded-xl w-[320px] md:w-[448px] object-cover mb-2"
                sizes="(min-width: 768px) 55.2rem, 32.8rem"
              />
              <div className="flex flex-col items-start bg-white rounded-xl shadow p-6 w-full max-w-lg">
                <div className="flex items-center mb-4">
                  {/* Financing icon */}
                  <svg viewBox="0 0 64 64" className="w-12 h-12 text-[#3E47DD] mr-3" fill="none">
                    <path d="M32 24.0259L23.3398 24.0259C21.8734 24.0259 20.5246 24.8282 19.8247 26.1168L16.2774 32.6483C16.165 32.8552 16.0346 33.0518 15.8876 33.2357L12.8952 36.9817C12.329 37.6906 12.0205 38.5709 12.0205 39.4782L12.0205 47.9979C12.0205 50.2071 13.8114 51.9979 16.0205 51.9979H48C50.2091 51.9979 52 50.2071 52 47.9979V39.2168C52 38.4239 51.7643 37.6488 51.3228 36.99L48.6216 32.9592L47.5 31.0005" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M19 52.0005V54.0002C19 54.5526 18.5521 55.0003 17.9997 55.0002L12.9996 54.9985C12.4475 54.9983 12 54.5506 12 53.9985V47.311" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M45 52.0004V54.0084C45 54.5613 45.4485 55.0092 46.0013 55.0084L51.0013 55.0017C51.5531 55.001 52 54.5535 52 54.0017V46.998" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M37.6697 40.999H26.022C25.0523 40.999 24.3375 41.9052 24.5632 42.8482L25.2811 45.8482C25.4427 46.523 26.046 46.999 26.7399 46.999H36.9412C37.6333 46.999 38.2355 46.5255 38.3988 45.853L39.1273 42.853C39.3566 41.9088 38.6414 40.999 37.6697 40.999Z" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M15.5205 38.999L21.5205 40.499" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M48.5205 38.999L42.5205 40.499" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M48.6202 33.4995C48.6202 33.4995 44.1725 34.9995 38.7639 34.9995C32.7911 34.9995 31.5297 34.9995 25.5569 34.9995C20.1394 34.9995 15.7202 33.4995 15.7202 33.4995" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M45 28.0005H48.7838C54.4277 28.0005 59 22.6339 59 16.0084C59 9.38278 54.4277 4.00049 48.7838 4.00049H45" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M44 28.0005C50.0751 28.0005 55 22.6279 55 16.0005C55 9.37307 50.0751 4.00049 44 4.00049C37.9249 4.00049 33 9.37307 33 16.0005C33 22.6279 37.9249 28.0005 44 28.0005Z" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M47.0145 10.546C46.7714 10.354 46.5147 10.1844 46.2466 10.0395C45.5517 9.66417 44.7797 9.45508 43.9666 9.45508C40.9224 9.45508 38.4546 12.3856 38.4546 16.0005C38.4546 19.6155 40.9224 22.546 43.9666 22.546C45.1665 22.546 46.2769 22.0907 47.1819 21.3176" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M44.6644 13.8188L36.2728 13.8188" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M44.6644 18.1821L36.2728 18.1821" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                  <div>
                    <h6 className="font-bold text-[#253887] text-lg mb-1">
                      Financing for cars from abroad too
                    </h6>
                    <p className="text-[#425187] text-base font-medium">
                      For each car you can see the exact monthly payment.
                    </p>
                  </div>
                </div>
                <a href="/landingFinancing" className="w-full flex justify-end">
                  <button
                    type="button"
                    className="flex items-center gap-2 bg-[#3452e1] hover:bg-[#253887] text-white font-bold rounded-xl px-5 py-2 text-base shadow transition focus:outline-none"
                  >
                    More about financing
                    <i className="ri-arrow-right-s-line text-xl"></i>
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="benefits"
        ref={benefitsSectionRef}
        className="w-full py-16 bg-white"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 md:gap-20 px-4">
          {/* Left: Step content */}
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <h3 className="text-[#3452e1] text-3xl font-bold mr-4">04.</h3>
              <h4 className="text-2xl font-bold text-[#253887]">Risk-free purchase</h4>
            </div>
            <p className="text-[#425187] text-base mb-6">
              There's no risk to you when you buy a car on AutoSaleDN. We pride ourselves on transparency and the perfect condition of the cars, and we provide our customers with maximum guarantees.
            </p>
            {/* Accordion with icons */}
            <div className="space-y-4">
              <Accordion
                icon="/images/icons/oval-check.svg"
                title="Only cars from tried and tested dealers."
                content={
                  <>We select cars from tried and tested dealers and only cars which meet strict criteria. In addition to this, we inspect the cars thoroughly.</>
                }
              />
              <Accordion
                icon="/images/icons/oval-check.svg"
                title="All cars thoroughly inspected."
                content={
                  <>The very highest quality of our cars is crucial to us and this is why we thoroughly inspect each vehicle in 270 points and document everything. We only recommend purchase of cars in excellent technical condition. <br />Sometimes, the vehicle seller may provide incorrect information in the listing, which is why we inspect each vehicle before purchase to ensure you know exactly what you’re buying.</>
                }
              />
              <Accordion
                icon="/images/icons/oval-check.svg"
                title="You always buy the car directly from us."
                content={
                  <>You buy the car directly from a Czech company, with a Czech contract and handle everything in Czech in line with Czech law. If you decide to buy, we will buy the car from the dealer, so you always buy the car from us and you only ever deal with us and in Czech.</>
                }
              />
              <Accordion
                icon="/images/icons/oval-check.svg"
                title="Warranties to ensure the maximum satisfaction."
                content={
                  <>You automatically get a 12-month warranty free of charge with the option of extending it up to 36 months.</>
                }
              />
              <Accordion
                icon="/images/icons/oval-check.svg"
                title="Option of returning the car within 14 days."
                content={
                  <>The most important thing for us is that you have only positive feelings about buying a car from us. That you as the customer are completely satisfied just like the many customers before you.</>
                }
              />
            </div>
          </div>
          {/* Right: Benefits panel */}
          <div className="flex-1 flex items-center justify-center relative min-h-[500px]">
            {/* Nền xiên gradient nhạt */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(110deg, #f7f9fc 65%, #e6ebf7 100%)",
                clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0 100%)"
              }}
            />
            {/* Các benefit cards nổi, lệch trái dần */}
            <div className="relative w-full max-w-[400px] flex flex-col items-start justify-center mt-[40px]">
              <div
                className="shadow-xl rounded-lg bg-white px-6 py-4 flex items-center gap-4 mb-10"
                style={{ marginLeft: "56px", minWidth: "295px", maxWidth: "340px" }}
              >
                <img src="/images/experts-48.svg" alt="" className="w-10 h-10" />
                <span className="text-[#253887] text-base font-bold leading-snug">
                  Only tried and tested<br />dealers
                </span>
              </div>
              <div
                className="shadow-xl rounded-lg bg-white px-6 py-4 flex items-center gap-4 mb-10"
                style={{ marginLeft: "92px", minWidth: "295px", maxWidth: "340px" }}
              >
                <img src="/images/warranty-48.svg" alt="" className="w-10 h-10" />
                <span className="text-[#253887] text-base font-bold leading-snug">
                  Free<br />6-month warranty
                </span>
              </div>
              <div
                className="shadow-xl rounded-lg bg-white px-6 py-4 flex items-center gap-4"
                style={{ marginLeft: "128px", minWidth: "295px", maxWidth: "340px" }}
              >
                <img src="/images/guarantee-48.svg" alt="" className="w-10 h-10" />
                <span className="text-[#253887] text-base font-bold leading-snug">
                  Return the car within<br />14 days
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="carBuyOut"
        ref={carBuyOutRef}
        className="w-full py-16 bg-white overflow-x-hidden"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 md:gap-20 px-4">
          {/* Left: Step content */}
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <h3 className="text-[#3452e1] text-3xl font-bold mr-4">05.</h3>
              <h4 className="text-2xl font-bold text-[#253887]">
                We’ll buy the car <br className="hidden md:block" />
                and make all the necessary arrangements
              </h4>
            </div>
            {/* Accordion with icons, dọc, box, border, shadow như ảnh */}
            <div className="flex flex-col gap-4 mt-6">
              <Accordion
                icon="/images/icons/oval-check.svg"
                title="We purchase the car and deregister it in its country of origin."
                content={<>Each country has its own regulations, for instance in Slovakia a vehicle must be deregistered in the same place it was registered. It’s not every business that works like AutoSaleDN.</>}
              />
              <Accordion
                icon="/images/icons/oval-check.svg"
                title="We receive the car and again thoroughly inspect it."
                content={<>In our technical center we once again verify the state of the car, and if it turns out that something is wrong, we fix it or sort it out with the seller. </>}
              />
              <Accordion
                icon="/images/icons/oval-check.svg"
                title="We arrange the MOT, registration check and licence plates."
                content={<>In order to arrange this we need a power of attorney from you. We will talk about this when we successfully purchase the car.</>}
              />
              <Accordion
                icon="/images/icons/oval-check.svg"
                title="If you want, we also arrange car insurance."
                content={<>We have very good conditions arranged with several partners, so you don’t need to take care of anything.</>}
              />
            </div>

            {/* Photo documentation block (desktop) */}
            <div className="hidden md:flex items-center gap-4 mt-8">
              <img
                src="/images/how-carvago-works-banner-services.webp"
                alt="AutoSaleDN services"
                className="w-32 h-auto object-contain rounded-xl"
              />
              <div>
                <h6 className="text-lg font-bold text-[#253887] mb-1">Photo documentation</h6>
                <span className="text-[#425187] text-base font-medium">
                  We photograph the car during the process and of course share the photos with you.
                </span>
              </div>
            </div>
            {/* Photo documentation block (mobile) */}
            <div className="flex md:hidden flex-col items-center mt-8">
              <img
                src="/images/how-carvago-works-banner-services-mobile.webp"
                alt="AutoSaleDN services"
                className="w-40 h-auto object-contain rounded-xl mb-2"
              />
              <h6 className="text-lg font-bold text-[#253887] mb-1 text-center">Photo documentation</h6>
              <span className="text-[#425187] text-base font-medium text-center">
                We photograph the car during the process and of course share the photos with you.
              </span>
            </div>
          </div>
          {/* Right: Video panel */}
          <div className="flex-1 flex items-center justify-center relative min-h-[420px]">
            <div className="relative w-full max-w-[640px] mx-auto rounded-2xl overflow-hidden shadow-md">
              <img
                src="/images/how-carvago-works-video-thumbnail.webp"
                alt="AutoSaleDN services video"
                className="w-full h-auto object-cover"
              />

            </div>
          </div>
        </div>
      </section>

      <section
        id="carDeliver"
        ref={carDeliverRef}
        className="w-full py-16 bg-white overflow-x-hidden"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 md:gap-20 px-4">
          {/* Left: Step content */}
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <h3 className="text-[#3452e1] text-3xl font-bold mr-4">06.</h3>
              <h4 className="text-2xl font-bold text-[#253887]">
                We’ll deliver it to your house, or a pick-up point
              </h4>
            </div>
            {/* Accordion with icons, dọc, box, border, shadow như ảnh */}
            <div className="flex flex-col gap-4 mt-6">
              <Accordion
                // icon="/images/icons/oval-check.svg"
                title="Where can I pick up my car?"
                content={<>Wherever you wish. Whether we deliver the car directly to your doorstep or you pick it up at one of our pick-up points is entirely up to you. We will hand over the keys and documents, and your only worry will be deciding where to go for your first drive. At the pick-up point, we will also demonstrate the car and answer any questions you may have.</>}
              />
              <Accordion
                title="How long will it take for you to deliver my car?"
                content={<>The process from payment receipt to car handover typically takes around 20 business days. We always strive to deliver as quickly as possible; however, in some cases, delivery times may be extended due to administrative procedures in individual European countries. Rest assured, we are doing everything possible to hand over the car to you in the shortest possible time. Transparency and open communication are key for us, which is why we will keep you informed about the status of your order and any potential changes to the delivery schedule.</>}
              />
            </div>

            {/* Photo documentation block (desktop) */}
            <div className="hidden md:flex items-center gap-4 mt-8">
              <img
                src="/images/how-carvago-works-banner-delivery.webp"
                alt="AutoSaleDN delivery"
                className="w-40 h-auto object-contain rounded-xl"
              />
              <div>
                <h6 className="text-lg font-bold text-[#253887] mb-1">Unique experience guarantee</h6>
                <span className="text-[#425187] text-base font-medium">
                  We can guarantee you that having the car delivered to your home is a unique experience. That’s what our customers say, and we believe them.
                </span>
              </div>
            </div>
            {/* Photo documentation block (mobile) */}
            <div className="flex md:hidden flex-col items-center mt-8">
              <img
                src="/images/how-carvago-works-banner-delivery-mobile.webp"
                alt="AutoSaleDN delivery"
                className="w-40 h-auto object-contain rounded-xl mb-2"
              />
              <h6 className="text-lg font-bold text-[#253887] mb-1 text-center">
                Unique experience guarantee
              </h6>
              <span className="text-[#425187] text-base font-medium text-center">
                We can guarantee you that having the car delivered to your home is a unique experience. That’s what our customers say, and we believe them.
              </span>
            </div>
          </div>
          {/* Right: Video panel */}
          <div className="flex-1 flex items-center justify-center relative min-h-[420px]">
            <div className="relative w-full flex flex-col items-center">
              {/* Desktop image */}
              <img
                src="/images/how-carvago-works-delivery.webp"
                alt="Delivery"
                className="hidden md:block w-full max-w-xl h-auto object-contain rounded-2xl shadow"
              />
              {/* Mobile image */}
              <img
                src="/images/how-carvago-works-delivery-mobile.webp"
                alt="Delivery"
                className="block md:hidden w-full max-w-xs h-auto object-contain rounded-2xl shadow"
              />
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white bg-opacity-90 rounded-xl shadow-md px-6 py-4">
                <svg viewBox="0 0 64 64" className="w-12 h-12 text-[#3452e1]" fill="none">
                  {/* SVG của chiếc xe tải */}
                  <path d="M13.3497 44.9761L8.59969 43.5511V37.8511L42.7998 37.851C43.8491 37.851 44.6998 37.0004 44.6998 35.951V24.551H51.5292C52.5873 24.551 53.5584 25.1373 54.0512 26.0736L57.5625 32.7451C57.8497 33.2909 57.9998 33.8983 57.9998 34.515V43.551C57.9998 44.6004 57.1491 45.451 56.0998 45.451H52.4644M43.2746 45.451H22.8496M58 39.751H55.625M57.525 33.576L49.3018 32.2776C48.84 32.2047 48.5 31.8067 48.5 31.3393V27.401M41.8501 34.051H7.65011M43.2305 43.5004C43.2305 46.0957 45.3344 48.1997 47.9298 48.1997C50.5252 48.1997 52.6291 46.0957 52.6291 43.5004C52.6291 40.905 50.5252 38.801 47.9298 38.801C45.3344 38.801 43.2305 40.905 43.2305 43.5004ZM13.4511 43.551C13.4511 46.1464 15.5551 48.2504 18.1505 48.2504C20.7458 48.2504 22.8498 46.1464 22.8498 43.551C22.8498 40.9557 20.7458 38.8517 18.1505 38.8517C15.5551 38.8517 13.4511 40.9557 13.4511 43.551Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M38.05 29.301L39.7988 28.8929C40.4438 28.7424 40.9 28.1675 40.9 27.5052V24.6095C40.9 23.7376 40.3067 22.9776 39.4608 22.7662L31.75 20.8385C31.5188 20.7807 31.3004 20.6798 31.1065 20.5413L25.2455 16.3549C24.9233 16.1247 24.5371 16.001 24.1411 16.001H15.8489C15.4591 16.001 15.0787 16.1209 14.7594 16.3444L10.7506 19.1505C10.5846 19.2668 10.4011 19.3557 10.207 19.4139L7.20766 20.3137C6.3557 20.5693 5.79508 21.3817 5.85845 22.2689L6.13461 26.1352C6.18934 26.9014 6.70014 27.5593 7.42895 27.8023L10.5 28.826M18.1 29.301H31.4M18.2462 16.001L15.7792 18.5463C15.2076 19.136 15.6031 20.1241 16.4237 20.1567L31.4 20.751M31.4 27.876C31.4 29.7123 32.8887 31.201 34.725 31.201C36.5614 31.201 38.05 29.7123 38.05 27.876C38.05 26.0396 36.5614 24.551 34.725 24.551C32.8887 24.551 31.4 26.0396 31.4 27.876ZM10.5 27.876C10.5 29.7123 11.9887 31.201 13.825 31.201C15.6614 31.201 17.15 29.7123 17.15 27.876C17.15 26.0396 15.6614 24.551 13.825 24.551C11.9887 24.551 10.5 26.0396 10.5 27.876Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
                <div>
                  <h6 className="text-base font-bold text-[#253887] leading-tight mb-1">Delivery to your home</h6>
                  <p className="text-[#425187] text-sm font-medium mb-0">
                    We will bring your dream car from all over Europe to your front door.
                  </p>
                </div>
                {/* <a href="/landingDelivery" className="ml-4">
                  <button
                    type="button"
                    className="flex items-center gap-1 bg-[#3452e1] hover:bg-[#253887] text-white font-bold rounded-xl px-5 py-2 text-base shadow transition focus:outline-none"
                  >
                    More about delivery
                    <svg viewBox="0 0 16 16" className="w-5 h-5" fill="none">
                      <path fillRule="evenodd" clipRule="evenodd" d="M5.29289 3.29289C4.90237 3.68342 4.90237 4.31658 5.29289 4.70711L8.58579 8L5.29289 11.2929C4.90237 11.6834 4.90237 12.3166 5.29289 12.7071C5.68342 13.0976 6.31658 13.0976 6.70711 12.7071L10.7071 8.70711C10.8946 8.51957 11 8.26522 11 8C11 7.73478 10.8946 7.48043 10.7071 7.29289L6.70711 3.29289C6.31658 2.90237 5.68342 2.90237 5.29289 3.29289Z" fill="currentColor"></path>
                    </svg>
                  </button>
                </a> */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Accordion sub-component
function Accordion({ title, content }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#e5e7eb] rounded-lg">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex justify-between items-center w-full px-4 py-3 bg-white text-left"
      >
        <span className="text-[#253887] text-base font-medium">{title}</span>
        <i
          className={`ri-arrow-down-s-line text-xl text-[#3452e1] transition-transform duration-200 ${open ? "rotate-180" : ""
            }`}
        ></i>
      </button>
      <div className={`px-4 pb-4 text-[#425187] text-sm transition-all duration-300 ${open ? "block" : "hidden"}`}>
        {content}
      </div>
    </div>
  );
}