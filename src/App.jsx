import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import './index.css'
import CarDetailPage from "./pages/CarDetailPage";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars/:carId" element={<CarDetailPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;