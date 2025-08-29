import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import Talk from 'talkjs';
import { getApiBaseUrl } from "../../../util/apiconfig";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [session, setSession] = useState(null);
  const inboxRef = useRef(null);
  const isInboxMounted = useRef(false);
  const API_BASE = getApiBaseUrl();

  // Step 1: Initialize TalkJS session as soon as user info is available
  useEffect(() => {
    if (user && !session) {
      console.log("[TalkJS] User data is available. Initializing session...");
      Talk.ready.then(() => {
        const me = new Talk.User({
          id: user.email,
          name: user.customerName,
          email: user.email,
          photoUrl: 'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3467.jpg',
          role: 'customer'
        });

        const talkSession = new Talk.Session({
          appId: 'twWJndcJ',
          me: me,
          asGuest: true,
        });
        console.log("[TalkJS] Session initialized successfully.", talkSession);
        setSession(talkSession);
      });
    }
  }, [user, session]);

  // Step 2: Mount the Inbox only when the user opens the chat for the FIRST time
  useEffect(() => {
    if (isChatOpen && session && !isInboxMounted.current) {
      console.log("[TalkJS] Chat opened for the first time. Mounting Inbox...");
      inboxRef.current = session.createInbox();
      const container = document.getElementById("talkjs-inbox-container");
      if (container) {
        inboxRef.current.mount(container);
        isInboxMounted.current = true;
        console.log("[TalkJS] Inbox mounted successfully.");
      } else {
        console.error("[TalkJS] Error: Could not find container div '#talkjs-inbox-container' to mount Inbox.");
      }
    }
  }, [isChatOpen, session]);

  const selectConversation = useCallback((conversation) => {
    if (inboxRef.current) {
      console.log("[TalkJS] Selecting conversation:", conversation.id);
      inboxRef.current.select(conversation);
    } else {
      console.warn("[TalkJS] Attempted to select a conversation, but Inbox is not ready yet.");
    }
  }, []);

  const chatWithSeller = useCallback((sellerInfo) => {
    if (!session || !user) {
      console.warn("[TalkJS] chatWithSeller called but session or user is not ready.");
      return;
    }
    console.log("[TalkJS] Creating conversation with seller:", sellerInfo);
    const sellerUser = new Talk.User({
      id: `seller_${sellerInfo.id}`, name: sellerInfo.name,
      email: sellerInfo.email || `seller_${sellerInfo.id}@example.com`,
      role: 'seller'
    });
    const conversationId = `customer_${user.email}_seller_${sellerInfo.id}`;
    const conversation = session.getOrCreateConversation(conversationId);
    conversation.setParticipant(session.me);
    conversation.setParticipant(sellerUser);
    conversation.setAttributes({ subject: `Regarding car with ${sellerInfo.name}` });
    selectConversation(conversation);
    setIsChatOpen(true);
  }, [session, user, selectConversation]);

  const chatWithAdmin = useCallback(() => {
    if (!session || !user) {
      console.warn("[TalkJS] chatWithAdmin called but session or user is not ready.");
      return;
    }
    console.log("[TalkJS] Creating conversation with admin support.");
    const adminUser = new Talk.User({
      id: 'admin_support_001', name: 'Customer Support',
      email: 'support@yourwebsite.com', role: 'admin'
    });
    const conversationId = `customer_${user.email}_admin_support`;
    const conversation = session.getOrCreateConversation(conversationId);
    conversation.setParticipant(session.me);
    conversation.setParticipant(adminUser);
    conversation.setAttributes({ subject: 'Customer Support' });
    selectConversation(conversation);
    setIsChatOpen(true);
  }, [session, user, selectConversation]);

  const toggleChat = useCallback(() => {
    console.log(`[UI] Toggling chat visibility.`);
    setIsChatOpen(prev => !prev);
  }, []);

  // Fetch user data from your backend
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log("[Auth] Token found. Fetching user data...");
      fetch(`${API_BASE}/api/User/me`, { headers: { 'Authorization': `Bearer ${token}` } })
        .then(resp => {
          if (resp.ok) {
            return resp.json();
          }
          throw new Error('Failed to fetch user');
        })
        .then(data => {
          console.log("[Auth] User data received from API:", data);
          const customerData = {
            email: data.email,
            customerName: data.fullName || data.name || 'New User',
            ...data
          };
          setUser(customerData);
          console.log("[Auth] User state updated:", customerData);
        })
        .catch(error => {
          console.error('[Auth] Error fetching user info:', error);
          localStorage.removeItem('token');
          setUser(null);
        });
    } else {
      console.log("[Auth] No token found. User is not logged in.");
    }
  }, [API_BASE]);

  const value = { user, setUser, isChatOpen, toggleChat, chatWithSeller, chatWithAdmin };

  return (<UserContext.Provider value={value}>{children}</UserContext.Provider>);
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}