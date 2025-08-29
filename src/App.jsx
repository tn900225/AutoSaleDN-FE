import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { UserProvider, useUserContext } from "./components/context/UserContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import CarDetailPage from "./pages/CarDetailPage";
import CarPage from "./pages/CarPage";
import HowAutoSaleWork from "./pages/HowAutoSaleWork";
import CarReview from "./pages/CarReview";
import ProfilePage from "./pages/ProfilePage";
import Dashboard from "./pages/admin/Dashboard";
import Messages from "./pages/admin/Messages";
import SellCars from "./pages/admin/SellCars";
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
import UpdateCar from "./pages/admin/UpdateCar";
import PurchaseTermsPage from "./pages/PurchaseTermsPage";
import PrePurchasePage from "./pages/PrePurchasePage";
import OrdersPage from "./pages/OrdersPage";
import SellerOrderManagement from "./pages/admin/SellerOrderManagement";
import SellerDashboard from "./pages/seller/SellerDashboard";
import ManagePosts from "./pages/seller/ManagePosts";
import BlogIndex from "./pages/BlogIndex";
import BlogPostDetail from "./pages/BlogPostDetail";
import SellerMessage from "./pages/seller/SellerMessage";
import CarPredict from "./pages/admin/CarPredict";
import WishlistPage from "./pages/WishlistPage";
import './index.css';

function UserLayout({ children }) {
  const { user, isChatOpen, toggleChat } = useUserContext();

  return (
    <>
      <Header />
      <main>{children}</main>

      {user && (
        <div className="chat-widget-container">
          <div
            className={`chat-backdrop ${isChatOpen ? 'backdrop-visible' : ''}`}
            onClick={toggleChat}
          />

          <div id="talkjs-inbox-wrapper" className={isChatOpen ? 'chat-open' : 'chat-closed'}>
            <div id="talkjs-inbox-container"></div>
          </div>

          <button id="custom-chat-button" className={isChatOpen ? 'chat-open' : ''} onClick={toggleChat} title="Mở Hộp thư">
            <svg className="chat-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" className="icon-chat" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" className="icon-close" />
            </svg>
          </button>
        </div>
      )}

      <Footer />
      <style jsx>{`
        #custom-chat-button {
          position: fixed;
          right: 25px; bottom: 25px; z-index: 1000;
          width: 56px; height: 56px; border-radius: 50%;
          background-color: #000; color: white;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; border: none;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        #custom-chat-button:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
        }
        .chat-icon {
          width: 28px; height: 28px; position: absolute;
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
        .chat-icon .icon-close { opacity: 0; transform: rotate(-45deg) scale(0.5); }
        .chat-icon .icon-chat { opacity: 1; transform: rotate(0deg) scale(1); }
        #custom-chat-button.chat-open .icon-chat { opacity: 0; transform: rotate(45deg) scale(0.5); }
        #custom-chat-button.chat-open .icon-close { opacity: 1; transform: rotate(0deg) scale(1); }
        #talkjs-inbox-wrapper {
          position: fixed;
          bottom: 95px; right: 25px;
          width: 375px; height: 70vh; max-height: 700px;
          border-radius: 16px; z-index: 999;
          transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        #talkjs-inbox-container {
            width: 100%; height: 100%;
            border-radius: 16px; overflow: hidden;
            box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.2);
            border: 1px solid #E5E7EB;
        }
        .chat-closed {
          opacity: 0;
          visibility: hidden;
        }
        .chat-open {
          opacity: 1;
          visibility: visible;
        }
        .chat-backdrop {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          z-index: 998;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        .backdrop-visible {
          opacity: 1;
        }
        @media (max-width: 480px) {
          #talkjs-inbox-wrapper {
            width: calc(100% - 20px); height: calc(100% - 95px);
            max-height: 100%; right: 10px; bottom: 85px;
          }
          #custom-chat-button {
            right: 15px; bottom: 15px;
          }
        }
      `}</style>
    </>
  );
}


function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      {children}
    </div>
  );
}

function RequireRole({ allow, children }) {
  const role = localStorage.getItem("role");
  if (!allow.includes(role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
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
                  <Route path="cars/:carId/purchase-terms" element={<PurchaseTermsPage />} />
                  <Route path="cars/:carId/confirm-orders" element={<PrePurchasePage />} />
                  <Route path="cars/orders" element={<OrdersPage />} />
                  <Route path="/blog" element={<BlogIndex />} />
                  <Route path="/blog/:slug" element={<BlogPostDetail />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                </Routes>
              </UserLayout>
            }
          />
          <Route
            path="/admin/*"
            element={
              <RequireRole allow={["Admin"]}>
                <DashboardLayout>
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="messages" element={<Messages />} />
                    <Route path="sell-cars" element={<SellCars />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="showroom" element={<ShowroomManagement />} />
                    <Route path="employee" element={<EmployeeAdmin />} />
                    <Route path="car-features" element={<CarFeatures />} />
                    <Route path="car-colors" element={<CarColor />} />
                    <Route path="car-manufacturers-models" element={<CarManufacturers />} />
                    <Route path="cars/edit/:listingId" element={<UpdateCar />} />
                    <Route path="car-prediction" element={<CarPredict />} />
                    <Route path="customers" element={<CustomerAdmin />} />
                    <Route path="cars" element={<CarAdmin />} />
                    <Route path="transactions/:id" element={<TransactionDetail />} />
                    <Route path="add-new-car" element={<AddNewCarPage />} />
                    <Route path="" element={<Navigate to="dashboard" replace />} />
                  </Routes>
                </DashboardLayout>
              </RequireRole>
            }
          />
          <Route
            path="/seller/*"
            element={
              <RequireRole allow={["Seller"]}>
                <DashboardLayout>
                  <Routes>
                    <Route path="dashboard" element={<SellerDashboard />} />
                    <Route path="order-management" element={<SellerOrderManagement />} />
                    <Route path="manage-posts" element={<ManagePosts />} />
                    <Route path="manage-message" element={<SellerMessage />} />
                  </Routes>
                </DashboardLayout>
              </RequireRole>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;