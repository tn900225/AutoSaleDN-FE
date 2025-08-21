import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import './index.css'
import CarDetailPage from "./pages/CarDetailPage";
import CarPage from "./pages/CarPage";
import HowAutoSaleWork from "./pages/HowAutoSaleWork";
import CarReview from "./pages/CarReview";
import ProfilePage from "./pages/ProfilePage";
import { UserProvider } from "./components/context/UserContext";
import Dashboard from "./pages/admin/Dashboard";
import Messages from "./pages/admin/Messages";
import SellCars from "./pages/admin/SellCars";
import Services from "./pages/admin/Services";
import Settings from "./pages/admin/Settings";
import Assets from "./pages/admin/Assets";
import Booking from "./pages/admin/Booking";
import CustomerAdmin from "./pages/admin/CustomerAdmin";
import CarAdmin from "./pages/admin/CarAdmin";

function UserLayout({ children }) {
  return (
    <UserProvider>
      <Header />
      {children}
      <Footer />
    </UserProvider>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Các route của user bọc trong UserLayout */}
        <Route
          path="/*"
          element={
            <UserLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cars" element={<CarPage />} />
                <Route path="/how-auto-works" element={<HowAutoSaleWork />} />
                <Route path="/customer-reviews" element={<CarReview />} />
                <Route path="/cars/:carId" element={<CarDetailPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </UserLayout>
          }
        />
        {/* Route admin dùng layout riêng, không có Header/Footer/UserProvider ở ngoài */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/messages" element={<Messages />} />
        <Route path="/admin/sell-cars" element={<SellCars />} />
        <Route path="/admin/services" element={<Services />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/assets" element={<Assets />} />
        <Route path="/admin/booking" element={<Booking />} />
        <Route path="/admin/customers" element={<CustomerAdmin />} />
        <Route path="/admin/cars" element={<CarAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;