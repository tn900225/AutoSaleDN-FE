import React, { useEffect, useRef, useState } from "react";
import Talk from "talkjs";
import SellerSidebar from "../../components/seller/SellerSidebar";
import SellerTopbar from "../../components/seller/SellerTopbar";
import { getApiBaseUrl } from "../../../util/apiconfig";

const SellerMessage = () => {
  const inboxEl = useRef(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE = getApiBaseUrl();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${API_BASE}/api/User/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .then(data => {
      setSeller({
        id: data.userId, 
        name: data.fullName,
        email: data.email,
        photoUrl: data.avatarUrl || 'https://talkjs.com/new-web/avatar-2.jpg',
        role: 'Seller'
      });
    })
    .catch(error => console.error("Could not fetch seller info:", error))
    .finally(() => setLoading(false));
  }, [API_BASE]);

  useEffect(() => {
    if (seller && inboxEl.current) {
      Talk.ready.then(() => {
        const me = new Talk.User({
          id: `seller_${seller.id}`,
          name: seller.name,
          email: seller.email,
          photoUrl: seller.photoUrl,
          role: seller.role
        });

        const session = new Talk.Session({
          appId: "twWJndcJ",
          me: me,
        });

        const inbox = session.createInbox();
        inbox.mount(inboxEl.current);

        return () => session.destroy();
      });
    }
  }, [seller]);

  if (loading) {
    return <div>Đang tải tin nhắn...</div>;
  }

  if (!seller) {
    return <div>Không thể tải thông tin người bán. Vui lòng đăng nhập lại.</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <SellerSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <SellerTopbar />
        <main className="flex-1 p-6" style={{ height: 'calc(100vh - 64px)' }}>
          <div ref={inboxEl} style={{ height: "100%", width: "100%" }}></div>
        </main>
      </div>
    </div>
  );
};

export default SellerMessage;