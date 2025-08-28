import React, { createContext, useContext, useState, useEffect } from 'react';
import { getApiBaseUrl } from "../../../util/apiconfig";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const API_BASE = getApiBaseUrl();

  useEffect(() => {
    // Check for token on component mount
    const token = localStorage.getItem('token');
    if (token) {
      // Fetch user info from API
      fetch(`${API_BASE}/api/User/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(resp => resp.json())
      .then(data => setUser(data))
      .catch(error => {
        console.error('Error fetching user info:', error);
        // If there's an error, clear the token
        localStorage.removeItem('token');
        setUser(null);
      });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}
