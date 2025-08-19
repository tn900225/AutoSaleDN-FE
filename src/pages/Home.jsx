import React from "react";
import Hero from "../components/Hero";
import PopularCar from "../components/PopularCar";
import FeaturedCars from "../components/FeaturedCars";

export default function Home() {
  return (
    <div>
      <Hero />
      <PopularCar />
      <FeaturedCars />
    </div>
  );
}