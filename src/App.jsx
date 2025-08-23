import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import TransactionDetail from "./pages/admin/TransactionDetail";
import AddNewCarPage from "./pages/admin/AddNewCarPage";

function UserLayout({ children }) {
  return (
    <UserProvider>
      <Header />
      {children}
      <Footer />
    </UserProvider>
  );
}

// Layout chung cho Admin & Seller
function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      {children}
    </div>
  );
}

// Component bảo vệ route theo role
function RequireRole({ allow, children }) {
  const role = localStorage.getItem("role"); // hoặc lấy từ context
  if (!allow.includes(role)) return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* User routes */}
        <Route
          path="/*"
          element={
            <UserLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cars" element={<CarPage />} />
                <Route path="/how-auto-works" element={<HowAutoSaleWork />} />
                <Route path="/customer-reviews" element={<CarReview />} />
                <Route path="/cars/:id" element={<CarDetailPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </UserLayout>
          }
        />

        {/* Admin & Seller dùng chung layout, phân quyền bằng RequireRole */}
        <Route
          path="/dashboard/*"
          element={
            <RequireRole allow={["Admin", "Seller"]}>
              <DashboardLayout>
                <Routes>
                  <Route path="" element={<Dashboard />} />
                  <Route path="messages" element={<Messages />} />
                  <Route path="sell-cars" element={<SellCars />} />
                  <Route path="services" element={<Services />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="assets" element={<Assets />} />
                  <Route path="booking" element={<Booking />} />
                  {/* Chỉ Admin mới thấy các route này */}
                  <Route
                    path="customers"
                    element={
                      localStorage.getItem("role") === "Admin" ? (
                        <CustomerAdmin />
                      ) : (
                        <Navigate to="/dashboard" replace />
                      )
                    }
                  />
                  <Route
                    path="cars"
                    element={
                      localStorage.getItem("role") === "Admin" ? (
                        <CarAdmin />
                      ) : (
                        <Navigate to="/dashboard" replace />
                      )
                    }
                  />
                  <Route
                    path="transactions/:id"
                    element={
                      localStorage.getItem("role") === "Admin" ? (
                        <TransactionDetail />
                      ) : (
                        <Navigate to="/dashboard" replace />
                      )
                    }
                  />
                  <Route
                    path="add-new-car"
                    element={
                      localStorage.getItem("role") === "Admin" ? (
                        <AddNewCarPage />
                      ) : (
                        <Navigate to="/dashboard" replace />
                      )
                    }
                  />
                  {/* Seller có thể có route riêng nếu cần */}
                  {/* <Route path="seller-special" element={<SellerSpecialPage />} /> */}
                </Routes>
              </DashboardLayout>
            </RequireRole>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;