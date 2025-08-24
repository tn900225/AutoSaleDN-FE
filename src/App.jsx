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
import ShowroomManagement from "./pages/admin/ShowroomManagement";
import EmployeeAdmin from "./pages/admin/EmployeeAdmin";
import CustomerAdmin from "./pages/admin/CustomerAdmin";
import CarAdmin from "./pages/admin/CarAdmin";
import TransactionDetail from "./pages/admin/TransactionDetail";
import AddNewCarPage from "./pages/admin/AddNewCarPage";
import CarFeatures from "./pages/admin/CarFeatures";
import CarColor from "./pages/admin/CarColor";
import CarManufacturers from "./pages/admin/CarManufacturers";
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

        {/* Admin routes */}
        <Route
          path="/admin/*"
          element={
            <RequireRole allow={["Admin", "Seller"]}>
              <DashboardLayout>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="messages" element={<Messages />} />
                  <Route path="sell-cars" element={<SellCars />} />
                  <Route path="services" element={<Services />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="showroom" element={<ShowroomManagement />} />
                  <Route path="employee" element={<EmployeeAdmin />} />
                  <Route path="car-features" element={<CarFeatures />} />
                  <Route path="car-colors" element={<CarColor />} />
                  <Route path="car-manufacturers-models" element={<CarManufacturers />} />
                  
                  
                  {/* Admin-only routes */}
                  <Route
                    path="customers"
                    element={
                      <RequireRole allow={["Admin"]}>
                        <CustomerAdmin />
                      </RequireRole>
                    }
                  />
                  <Route
                    path="cars"
                    element={
                      <RequireRole allow={["Admin"]}>
                        <CarAdmin />
                      </RequireRole>
                    }
                  />
                  <Route
                    path="transactions/:id"
                    element={
                      <RequireRole allow={["Admin"]}>
                        <TransactionDetail />
                      </RequireRole>
                    }
                  />
                  <Route
                    path="add-new-car"
                    element={
                      <RequireRole allow={["Admin"]}>
                        <AddNewCarPage />
                      </RequireRole>
                    }
                  />
                  
                  {/* Default route for admin */}
                  <Route path="" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </DashboardLayout>
            </RequireRole>
          }
        />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;