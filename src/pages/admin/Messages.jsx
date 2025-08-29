import React, { useEffect, useRef, useState } from "react";
import Talk from "talkjs";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const Messages = () => {
  const inboxEl = useRef(null);
  const [talkReady, setTalkReady] = useState(false);

  useEffect(() => {
    Talk.ready.then(() => setTalkReady(true));
  }, []);

  useEffect(() => {
    if (talkReady) {
      const supportAdmin = new Talk.User({
        id: 'admin_support_001',
        name: 'Customer Support',
        email: 'support@yourwebsite.com',
        photoUrl: 'https://talkjs.com/new-web/avatar-2.jpg',
        role: 'admin'
      });

      const session = new Talk.Session({
        appId: "twWJndcJ",
        me: supportAdmin,
        asGuest: true
      });

      const inbox = session.createInbox();
      inbox.mount(inboxEl.current);

      return () => session.destroy();
    }
  }, [talkReady]);

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <AdminTopbar />
        <main className="flex-1 p-6" style={{ height: 'calc(100vh - 64px)' }}>
          <div ref={inboxEl} style={{ height: "100%", width: "100%" }}></div>
        </main>
      </div>
    </div>
  );
};

export default Messages;