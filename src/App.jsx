import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Talk from 'talkjs';

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import './index.css'
import CarDetailPage from "./pages/CarDetailPage"; // Giả định trang chi tiết xe có thể cung cấp thông tin admin showroom
import CarPage from "./pages/CarPage";
import HowAutoSaleWork from "./pages/HowAutoSaleWork";
import CarReview from "./pages/CarReview";
import ProfilePage from "./pages/ProfilePage";
import { UserProvider } from "./components/context/UserContext";

// Import admin pages
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
import UpdateCar from "./pages/admin/UpdateCar";
import PurchaseTermsPage from "./pages/PurchaseTermsPage";
import PrePurchasePage from "./pages/PrePurchasePage";
import OrdersPage from "./pages/OrdersPage";
import SellerOrderManagement from "./pages/admin/SellerOrderManagement";

import SellerDashboard from "./pages/seller/SellerDashboard";

const useTalkJS = (customerInfor, isCustomerInfoLoaded, hasCustomerInfoError, targetStaff = null) => {
  const [talkjsPopup, setTalkjsPopup] = useState(null);
  const [isTalkjsLoaded, setIsTalkjsLoaded] = useState(false);

  useEffect(() => {
    Talk.ready.then(() => {
      setIsTalkjsLoaded(true);
    });
  }, []);

  const setupChat = useCallback(() => {
    if (hasCustomerInfoError || !isTalkjsLoaded || !isCustomerInfoLoaded || !customerInfor?.email || !customerInfor?.customerName) {
      console.log("TalkJS setup skipped: Customer info error, TalkJS not ready, or info incomplete/not loaded yet.");
      return;
    }

    try {
      console.log("Setting up TalkJS chat...");

      const user = new Talk.User({
        id: customerInfor.email,
        name: customerInfor.customerName,
        email: customerInfor.email,
        photoUrl: 'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3467.jpg',
        welcomeMessage: 'Hi!',
      });

      // Xác định staff user dựa trên targetStaff hoặc mặc định là admin chung
      const staffUser = targetStaff ? new Talk.User({
        id: targetStaff.id,
        name: targetStaff.name,
        email: targetStaff.email || `${targetStaff.id}@example.com`, // Email có thể là tùy chọn
        photoUrl: targetStaff.photoUrl || 'https://talkjs.com/new-web/avatar-2.jpg', // Ảnh mặc định
        welcomeMessage: `Hello! How can I assist you today, ${targetStaff.name}?`,
      }) : new Talk.User({
        id: 'admin-support-id',
        name: 'Hỗ Trợ Khách Hàng',
        email: 'support@example.com',
        photoUrl: 'https://talkjs.com/new-web/avatar-2.jpg',
        welcomeMessage: 'Chào bạn! Chúng tôi có thể giúp gì cho bạn hôm nay?',
      });


      const session = new Talk.Session({
        appId: 'th2sJikw', // Thay thế bằng TalkJS App ID thực tế của bạn
        me: user,
      });

      // Conversation ID sẽ phụ thuộc vào user hiện tại và staff user
      const conversation = session.getOrCreateConversation(Talk.oneOnOneId(user, staffUser));
      conversation.setParticipant(user);
      conversation.setParticipant(staffUser);

      console.log("TalkJS Conversation created:", conversation.id);

      // --- Logic Auto-reply vẫn giữ nguyên ---
      let autoReplyTimeout;
      let lastAutoReplyTime = 0;
      const AUTO_REPLY_DELAY = 10000; // 10 giây
      const AUTO_REPLY_COOLDOWN = 60000; // 1 phút

      session.on('message', (event) => {
        console.log("TalkJS Message event received:", event);

        if (event.senderId === user.id) {
          console.log("Message is from the user.");

          if (autoReplyTimeout) {
            clearTimeout(autoReplyTimeout);
          }

          const currentTime = Date.now();
          if (currentTime - lastAutoReplyTime > AUTO_REPLY_COOLDOWN) {
            autoReplyTimeout = setTimeout(() => {
              console.log("Timeout triggered, sending auto-reply.");
              const staffSession = new Talk.Session({
                appId: 'th2sJikw',
                me: staffUser, // Staff user gửi tin nhắn
              });
              const staffConversation = staffSession.getOrCreateConversation(conversation.id);
              staffConversation.sendMessage("Hi! Our staff is currently unavailable. We've received your message and will get back to you as soon as possible!\n\nIf your matter is urgent, please call our number +84 38 3691293");
              lastAutoReplyTime = Date.now();
              staffSession.destroy();
            }, AUTO_REPLY_DELAY);
          } else {
            console.log("Auto-reply on cooldown.");
          }
        } else if (event.senderId === staffUser.id) {
          console.log("Message is from the staff.");
          if (autoReplyTimeout) {
            clearTimeout(autoReplyTimeout);
            console.log("Auto-reply timeout cleared due to staff reply.");
          }
        }
      });
      // --- End Logic Auto-reply ---

      const popup = session.createPopup({ keepOpen: true });
      popup.select(conversation);
      setTalkjsPopup(popup);

      return () => {
        console.log("Destroying TalkJS session and popup.");
        if (popup) {
          popup.destroy();
        }
        if (session) {
          session.destroy();
        }
      };

    } catch (error) {
      console.error("Error setting up TalkJS chat:", error);
    }
  }, [isTalkjsLoaded, customerInfor, isCustomerInfoLoaded, hasCustomerInfoError, targetStaff]); // Thêm targetStaff vào dependencies

  useEffect(() => {
    if (talkjsPopup) {
      const container = document.getElementById("talkjs-popup");
      if (container) {
        talkjsPopup.mount(container);
      }
    }
  }, [talkjsPopup]);

  useEffect(() => {
    if (isTalkjsLoaded && isCustomerInfoLoaded && customerInfor && !hasCustomerInfoError) {
      setupChat();
    }
  }, [isTalkjsLoaded, isCustomerInfoLoaded, customerInfor, hasCustomerInfoError, setupChat]);

  return { talkjsPopup, isTalkjsLoaded };
};


function UserLayout({ children }) {
  const [customerInfor, setCustomerInfor] = useState(null);
  const [isCustomerInfoLoaded, setIsCustomerInfoLoaded] = useState(false);
  const [hasCustomerInfoError, setHasCustomerInfoError] = useState(false);

  // Thêm state cho thông tin admin showroom nếu có
  const [showroomAdminInfo, setShowroomAdminInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setHasCustomerInfoError(false);
      setIsCustomerInfoLoaded(false);

      fetch('/api/User/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(resp => {
        if (!resp.ok) {
          if (resp.status === 401) {
            console.warn('Unauthorized: User token invalid or expired. TalkJS will not be loaded.');
          } else {
            console.error(`Error fetching user info: Status ${resp.status}`);
          }
          setHasCustomerInfoError(true);
          setCustomerInfor(null);
          return null;
        }
        return resp.json();
      })
      .then(data => {
        if (data) {
          const customerData = {
            email: data.email,
            customerName: data.fullName || data.name,
            phoneNumber: data.mobile,
            address: data.province,
            point: data.point
          };
          setCustomerInfor(customerData);
          console.log("Customer Info updated in UserLayout:", customerData);
        }
      })
      .catch(error => {
        console.error('Network or parsing error fetching user info:', error);
        setHasCustomerInfoError(true);
        setCustomerInfor(null);
      })
      .finally(() => {
        setIsCustomerInfoLoaded(true);
      });
    } else {
      console.log('No token found. TalkJS will not be loaded.');
      setHasCustomerInfoError(true);
      setCustomerInfor(null);
      setIsCustomerInfoLoaded(true);
    }
  }, []);

  // Sử dụng custom hook useTalkJS
  // Mặc định sẽ truyền null cho targetStaff để chat với admin chung
  const { isTalkjsLoaded } = useTalkJS(customerInfor, isCustomerInfoLoaded, hasCustomerInfoError, showroomAdminInfo);


  const shouldShowTalkJS = isTalkjsLoaded && isCustomerInfoLoaded && !hasCustomerInfoError && customerInfor;

  return (
    <UserProvider>
      <Header />
      <main>{children}</main>
      {shouldShowTalkJS && (
        <div className="talkjs-container">
          <div id="talkjs-popup" style={{ width: '100%', height: '100%' }}></div>
        </div>
      )}
      <Footer />
      <style jsx>{`
        #button-contact-vr {
          position: fixed;
          right: 20px;
          bottom: 120px;
          z-index: 999;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .talkjs-container {
          position: fixed;
          right: 20px;
          bottom: 20px;
          z-index: 998;
          width: 100px;
          height: 100px;
        }

        .button-contact {
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background-color: #0066ff;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .button-contact:hover {
          transform: scale(1.1);
          box-shadow: 0 0 15px rgba(0, 102, 255, 0.5);
        }

        .phone-vr {
          position: relative;
        }

        .phone-vr-circle-fill {
          position: absolute;
          width: 65px;
          height: 65px;
          top: 11.5px;
          left: -2.5px;
          background-color: rgba(0, 123, 255, 0.15);
          border-radius: 50%;
          animation: phone-vr-circle-fill 2.3s infinite ease-in-out;
        }

        .phone-vr-img-circle {
          background-color: #0066ff;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: all 0.3s ease;
          top: 18px;
          left: 5px;
        }

        .phone-vr-img-circle:hover {
          background-color: #0052cc;
        }

        .zalo-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          transition: transform 0.3s ease;
        }

        .zalo-button:hover {
          transform: scale(1.1);
        }

        @keyframes phone-vr-circle-fill {
          0% {
            transform: rotate(0) scale(1) skew(1deg);
          }
          10% {
            transform: rotate(-25deg) scale(1) skew(1deg);
          }
          20% {
            transform: rotate(25deg) scale(1) skew(1deg);
          }
          30% {
            transform: rotate(-25deg) scale(1) skew(1deg);
          }
          40% {
            transform: rotate(25deg) scale(1) skew(1deg);
          }
          50% {
            transform: rotate(0) scale(1) skew(1deg);
          }
          100% {
            transform: rotate(0) scale(1) skew(1deg);
          }
        }
      `}</style>
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
                <Route path="cars/:carId/purchase-terms" element={<PurchaseTermsPage />} />
                <Route path="cars/:carId/confirm-orders" element={<PrePurchasePage />} />
                <Route path="cars/orders" element={<OrdersPage />} />
                <Route path="seller-order-management" element={<SellerOrderManagement />} />
              </Routes>
            </UserLayout>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/*"
          element={
            <RequireRole allow={["Admin"]}>
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
                  <Route path="cars/edit/:listingId" element={<UpdateCar />} />

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
        <Route
          path="/seller/*"
          element={
            <RequireRole allow={["Seller"]}>
              <DashboardLayout>
                <Routes>
                  <Route path="dashboard" element={<SellerDashboard />} />
                  {/* <Route path="showroom" element={<SellerShowroom />} />
                  <Route path="cars" element={<SellerCarManagement />} />
                  <Route path="orders" element={<SellerOrderManagement />} />
                  <Route path="messages" element={<SellerMessages />} />
                  <Route path="" element={<Navigate to="dashboard" replace />} /> */}
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