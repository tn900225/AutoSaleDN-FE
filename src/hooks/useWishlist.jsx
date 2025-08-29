import { useState, useEffect } from 'react';

// Tên cookie để lưu wishlist
const WISHLIST_COOKIE_NAME = 'carWishlist';

// Hàm đọc cookie
const getCookie = (name) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
};

// Hàm ghi cookie
const setCookie = (name, value, days = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
};

// Hàm xóa cookie
const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
};

// Hàm lấy wishlist từ cookie
const getStoredWishlist = () => {
  try {
    const cookieValue = getCookie(WISHLIST_COOKIE_NAME);
    return cookieValue ? JSON.parse(cookieValue) : [];
  } catch (error) {
    console.error("Failed to parse wishlist from cookie:", error);
    return [];
  }
};

// Hàm lưu wishlist vào cookie
const saveWishlist = (wishlist) => {
  try {
    setCookie(WISHLIST_COOKIE_NAME, JSON.stringify(wishlist));
  } catch (error) {
    console.error("Failed to save wishlist to cookie:", error);
  }
};

export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState(getStoredWishlist);

  useEffect(() => {
    saveWishlist(wishlistItems);
  }, [wishlistItems]);

  const addCarToWishlist = (carId) => {
    if (!wishlistItems.includes(carId)) {
      setWishlistItems(prevItems => [...prevItems, carId]);
    }
  };

  const removeCarFromWishlist = (carId) => {
    setWishlistItems(prevItems => prevItems.filter(id => id !== carId));
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    deleteCookie(WISHLIST_COOKIE_NAME);
  };

  return {
    wishlistItems,
    addCarToWishlist,
    removeCarFromWishlist,
    clearWishlist,
  };
};
