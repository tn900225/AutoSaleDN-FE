import React from "react";
import Hero from "../components/Hero";
import PopularCar from "../components/PopularCar";
import FeaturedCars from "../components/FeaturedCars";
import HowItWorks from "../components/HowItWorks";
import CarAuditSection from "../components/CarAuditSection";
import ComprehensiveServices from "../components/ComprehensiveServices";
import CustomerTestimonials from "../components/CustomerTestimonials";

export default function Home() {
  return (
    <div>
      <Hero />
      <PopularCar />
      <HowItWorks />
      <CarAuditSection />
      <ComprehensiveServices />
      <CustomerTestimonials />
      {/* <FeaturedCars /> */}
    </div>
  );
}