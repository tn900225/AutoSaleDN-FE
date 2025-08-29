import React, { useState } from "react";
import Register from "./Register";
import Swal from "sweetalert2"; // Ensure Swal is imported
import { useUserContext } from "./context/UserContext";
import { useNavigate } from 'react-router-dom';

import { getApiBaseUrl } from "../../util/apiconfig";

export default function Login({ show, onClose }) {
  const navigate = useNavigate();
  const { setUser } = useUserContext();
  const [showPassword, setShowPassword] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});

  const API_BASE = getApiBaseUrl();

  const validateForm = () => {
    const err = {};
    if (!validateEmail(form.email)) err.email = "Invalid email address.";
    if (!validatePassword(form.password)) err.password = "Password must be at least 8 characters.";
    return err;
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (pw) => {
    return pw.length >= 8;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const err = validateForm();
    setErrors(err);

    if (Object.keys(err).length === 0) {
      try {
        const loginDto = {
          Email: form.email,
          Password: form.password
        };

        const resp = await fetch(`${API_BASE}/api/User/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(loginDto)
        });

        if (resp.ok) {
          const { token, role } = await resp.json();
          localStorage.setItem('token', token);
          localStorage.setItem('role', role);

          if (role === "Admin") {
            navigate('/admin/dashboard');
            Swal.fire({
              icon: "success",
              title: "Login Successful",
              text: "Welcome Admin!"
            });
            onClose();
            return;
          }

          if (role === "Seller") {
            navigate('/seller/dashboard');
            Swal.fire({
              icon: "success",
              title: "Login Successful",
              text: "Welcome Seller!"
            });
            onClose();
            return;
          }
          const userInfoResp = await fetch(`${API_BASE}/api/User/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const userInfo = await userInfoResp.json();
          setUser(userInfo);

          onClose();
          Swal.fire({
            icon: "success",
            title: "Login Successful",
            text: "Welcome back!"
          }).then(() => {
            window.location.reload();
          });
        }
        else if (resp.status === 401) {
          const errorText = await resp.text(); // Get the error message from the response body

          if (errorText === "Your account has been deactivated by the administrator.") {
            Swal.fire({
              icon: "warning", // Changed to warning for deactivation
              title: "Account Deactivated",
              text: "Your account has been deactivated by the administrator. Please contact support for assistance."
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Authentication Failed",
              text: "Invalid Email or password. Please try again."
            });
          }
        } else {
          // For any other non-OK status, throw an error
          const errorDetail = await resp.text(); // Get more specific error if available
          throw new Error(`Login failed with status ${resp.status}: ${errorDetail}`);
        }
      } catch (error) {
        console.error("Login error:", error);
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: `An unexpected error occurred. Please try again. (${error.message})`
        });
      }
    }
  };

  if (!show) return null;

  const handleShowRegister = () => {
    setShowRegister(true);
  };

  const handleCloseRegister = () => {
    setShowRegister(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-md mx-auto p-8 animate-fade-in">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full p-2 hover:bg-gray-100 transition"
            aria-label="Close modal"
          >
            <svg width={20} height={20} fill="none" viewBox="0 0 16 16">
              <path d="M4 4l8 8M12 4l-8 8" stroke="#253887" strokeWidth={2} strokeLinecap="round" />
            </svg>
          </button>
          <h4 className="text-xl font-bold text-[#253887] mb-2">Welcome back</h4>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[#425187] text-sm">Don't have an account yet?</span>
            <button className="text-[#3452e1] text-sm font-semibold hover:underline" onClick={handleShowRegister}>
              Register here
            </button>
          </div>
          {/* Social login */}
          <div className="flex gap-4 mb-6">
            <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 font-semibold shadow hover:bg-gray-50 transition w-1/2 justify-center">
              <span>
                {/* Google SVG */}
                <svg viewBox="0 0 20 20" width={20} height={20} aria-hidden="true">
                  <path fill="#EA4335" fillRule="evenodd" d="M10 3.867c1.877 0 3.144.81 3.866 1.489L16.69 2.6C14.955.989 12.699 0 9.999 0 6.09 0 2.712 2.244 1.067 5.511L4.3 8.022c.81-2.41 3.055-4.155 5.7-4.155z" clipRule="evenodd"></path>
                  <path fill="#4285F4" fillRule="evenodd" d="M19.6 10.222c0-.822-.067-1.422-.211-2.044H10v3.71h5.511c-.111.923-.711 2.312-2.044 3.245l3.155 2.445c1.89-1.745 2.978-4.311 2.978-7.356z" clipRule="evenodd"></path>
                  <path fill="#FBBC05" fillRule="evenodd" d="M4.311 11.978c-.211-.623-.333-1.29-.333-1.978 0-.689.122-1.356.322-1.978l-3.233-2.51C.389 6.866 0 8.388 0 10c0 1.611.389 3.133 1.067 4.489l3.244-2.511z" clipRule="evenodd"></path>
                  <path fill="#34A853" fillRule="evenodd" d="M10 20c2.7 0 4.967-.889 6.623-2.422l-3.156-2.445c-.844.59-1.978 1-3.467 1-2.644 0-4.889-1.744-5.689-4.155l-3.233 2.51C2.723 17.757 6.09 20 10 20z" clipRule="evenodd"></path>
                </svg>
              </span>
              Google
            </button>
            <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 font-semibold shadow hover:bg-gray-50 transition w-1/2 justify-center">
              <span>
                {/* Facebook SVG */}
                <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden="true">
                  <path d="M24 12.0733C24 5.40541 18.6274 0 12 0C5.37258 0 0 5.40541 0 12.0733C0 18.0994 4.3882 23.0943 10.125 24V15.5633H7.07812V12.0733H10.125V9.41343C10.125 6.38755 11.9166 4.71615 14.6576 4.71615C15.9701 4.71615 17.3438 4.95195 17.3438 4.95195V7.92313H15.8306C14.34 7.92313 13.875 8.85386 13.875 9.80958V12.0733H17.2031L16.6711 15.5633H13.875V24C19.6118 23.0943 24 18.0994 24 12.0733Z" fill="#1877F2"></path>
                  <path d="M16.6711 15.4688L17.2031 12H13.875V9.75C13.875 8.80102 14.34 7.875 15.8306 7.875H17.3438V4.92188C17.3438 4.92188 15.9705 4.6875 14.6576 4.6875C11.9166 4.6875 10.125 6.34875 10.125 9.35625V12H7.07812V15.4688H10.125V23.8542C11.3674 24.0486 12.6326 24.0486 13.875 23.8542V15.4688H16.6711Z" fill="white"></path>
                </svg>
              </span>
              Facebook
            </button>
          </div>
          {/* OR divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 border-t border-gray-200" />
            <span className="text-[#425187] text-sm">or via e-mail</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>
          {/* Login form */}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-[#253887] font-medium mb-1">Login</label>
              <input
                id="username"
                name="email"
                type="text"
                maxLength={254}
                placeholder="Email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-[#253887] placeholder:text-gray-400 focus:ring-2 focus:ring-[#3452e1] focus:border-[#3452e1] transition"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div className="mb-2 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                maxLength={254}
                placeholder="Password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-[#253887] placeholder:text-gray-400 focus:ring-2 focus:ring-[#3452e1] focus:border-[#3452e1] transition pr-10"
                value={form.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#253887] hover:text-[#3452e1]"
                tabIndex={-1}
                onClick={() => setShowPassword((s) => !s)}
              >
                {/* Eye icon */}
                <svg width={18} height={18} fill="none" viewBox="0 0 16 16">
                  <path d="M1.333 8s2.667-4 6.667-4 6.667 4 6.667 4-2.667 4-6.667 4-6.667-4-6.667-4z" stroke="#3452e1" strokeWidth="1.5" />
                  <circle cx="8" cy="8" r="2" stroke="#3452e1" strokeWidth="1.5" />
                </svg>
              </button>
            </div>
            <div className="mb-4 flex justify-between items-center">
              <button type="button" className="text-[#3452e1] text-sm font-semibold hover:underline">Forgot your password?</button>
            </div>
            <button
              type="submit"
              className="w-full bg-[#3452e1] hover:bg-[#253887] text-white font-bold rounded-lg px-6 py-2 shadow-sm transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
      <Register
        show={showRegister}
        onClose={handleCloseRegister}
        onShowLogin={onClose}
      />
    </>
  );
}