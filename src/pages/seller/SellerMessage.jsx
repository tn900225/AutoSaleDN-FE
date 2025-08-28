import React, { useEffect, useRef, useState } from "react";
import Talk from "talkjs";
import SellerSidebar from "../../components/seller/SellerSidebar";
import SellerTopbar from "../../components/seller/SellerTopbar";

const SellerMessage = () => {
  const inboxEl = useRef(null);

  useEffect(() => {
    Talk.ready.then(() => {
      const staff = new Talk.User({
        id: "admin-support-id",
        name: "Support Staff",
        email: "staff@example.com",
        role: "user",
        photoUrl: "https://talkjs.com/images/avatar-5.jpg",
      });

      const session = new Talk.Session({
        appId: "twWJndcJ",
        me: staff,
      });

      // Tạo và mount inbox
      const inbox = session.createInbox({
        showFeedHeader: true, 
      });
      inbox.mount(inboxEl.current);
    });
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <SellerSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <SellerTopbar />
        <main className="flex-1 p-6 overflow-y-auto">
    {/* <div style={{ height: "700px", paddingTop:'100px' }}> */}
      <div ref={inboxEl} style={{ height: "100%" }}></div>
    </main>
    </div>
    </div>
  );
};

export default SellerMessage;