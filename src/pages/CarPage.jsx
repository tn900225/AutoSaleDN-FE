// src/CarPage.jsx
import React from "react";
import CarFilterSidebar from "../components/CarFilterSidebar";
import CarPageMain from "../components/CarPageMain";

export default function CarPage() {
  return (
    <div className="min-h-screen bg-[#f6f8fd] py-8 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <CarFilterSidebar />

        {/* Main Content */}
        <CarPageMain />
      </div>
    </div>
  );
}