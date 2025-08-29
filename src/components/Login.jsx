import React, { useState } from "react";
import Register from "./Register";
import Swal from "sweetalert2";
import { useUserContext } from "./context/UserContext";
import { useNavigate } from "react-router-dom";
import { getApiBaseUrl } from "../../util/apiconfig";

const AppSwal = Swal.mixin({
  buttonsStyling: false,
  customClass: {
    confirmButton:
      "bg-[#3452e1] hover:bg-[#253887] text-white font-semibold px-6 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#253887] mr-2",
    cancelButton:
      "bg-gray-400 hover:bg-gray-500 text-white font-semibold px-6 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500"
  }
});

export default function Login({ show, onClose }) {
  const navigate = useNavigate();
  const { setUser } = useUserContext();
  const [showPassword, setShowPassword] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const API_BASE = getApiBaseUrl();

  // ---------- Validation ----------
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (pw) => pw.length >= 8;

  const validateForm = () => {
    const err = {};
    if (!validateEmail(form.email)) err.email = "Invalid email address.";
    if (!validatePassword(form.password))
      err.password = "Password must be at least 8 characters.";
    return err;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ---------- Login ----------
  const handleLogin = async (e) => {
    e.preventDefault();
    const err = validateForm();
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    try {
      const loginDto = { Email: form.email, Password: form.password };
      const resp = await fetch(`${API_BASE}/api/User/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginDto),
      });

      if (resp.ok) {
        const { token, role } = await resp.json();
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        if (role === "Admin") {
          navigate("/admin/dashboard");
          AppSwal.fire("Login Successful", "Welcome Admin!", "success");
          onClose();
          return;
        }
        if (role === "Seller") {
          navigate("/seller/dashboard");
          AppSwal.fire("Login Successful", "Welcome Seller!", "success");
          onClose();
          return;
        }

        // Normal User
        const userInfoResp = await fetch(`${API_BASE}/api/User/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userInfo = await userInfoResp.json();
        setUser(userInfo);

        onClose();
        AppSwal.fire("Login Successful", "Welcome back!", "success").then(() => {
          window.location.reload();
        });
      } else if (resp.status === 401) {
        const errorText = await resp.text();
        if (
          errorText ===
          "Your account has been deactivated by the administrator."
        ) {
          AppSwal.fire("Account Deactivated", "Please contact support.", "warning");
        } else {
          AppSwal.fire(
            "Authentication Failed",
            "Invalid email or password.",
            "error"
          );
        }
      } else {
        const errorDetail = await resp.text();
        throw new Error(
          `Login failed with status ${resp.status}: ${errorDetail}`
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      AppSwal.fire(
        "Login Failed",
        `An unexpected error occurred. (${error.message})`,
        "error"
      );
    }
  };

  // ---------- OTP Prompt ----------
  const promptOtp = async (email) => {
    const { value: otp } = await AppSwal.fire({
      title: "Verify OTP",
      html: `
        <div class="flex justify-center gap-2">
          ${Array.from({ length: 6 })
            .map(
              (_, i) => `
              <input type="text" maxlength="1" id="otp-${i}" 
                class="w-12 h-12 border-2 border-[#3452e1] rounded-lg text-center text-xl font-semibold 
                focus:outline-none focus:ring-2 focus:ring-[#253887]" />
            `
            )
            .join("")}
        </div>
      `,
      focusConfirm: false,
      confirmButtonText: "Verify",
      showCancelButton: true,
      customClass: {
        confirmButton:
          "bg-[#3452e1] hover:bg-[#253887] text-white font-semibold px-6 py-2 rounded-lg shadow-md",
        cancelButton:
          "bg-gray-400 hover:bg-gray-500 text-white font-semibold px-6 py-2 rounded-lg shadow-md",
      },
      buttonsStyling: false,
      preConfirm: () => {
        const otpCode = Array.from({ length: 6 })
          .map((_, i) => document.getElementById(`otp-${i}`).value)
          .join("");
        if (otpCode.length !== 6) {
          Swal.showValidationMessage("Please enter a valid 6-digit OTP.");
        }
        return otpCode;
      },
      didOpen: () => {
        const inputs = Array.from(document.querySelectorAll("input[id^=otp-]"));
        inputs.forEach((input, idx) => {
          input.addEventListener("input", (e) => {
            if (e.target.value && idx < inputs.length - 1) {
              inputs[idx + 1].focus();
            }
          });
          input.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && !input.value && idx > 0) {
              inputs[idx - 1].focus();
            }
          });
        });
        inputs[0].focus();
      },
    });

    if (!otp) return null;

    // Call verify API
    AppSwal.fire({
      title: "Verifying...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const verifyResp = await fetch(`${API_BASE}/api/User/verify-reset-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    Swal.close();

    if (!verifyResp.ok) {
      await AppSwal.fire({
        icon: "error",
        title: "Invalid OTP",
        text: "The OTP you entered is incorrect or expired. Please try again.",
        confirmButtonText: "Retry",
        customClass: {
          confirmButton:
            "bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md",
        },
        buttonsStyling: false,
      });
      return await promptOtp(email); // retry
    }

    return otp;
  };

  // ---------- Forgot Password ----------
  const handleForgotPassword = async () => {
    // Step 1: Ask for email
    const { value: email } = await AppSwal.fire({
      title: "Forgot Password",
      input: "email",
      inputLabel: "Enter your registered email",
      inputPlaceholder: "your@email.com",
      confirmButtonText: "Send OTP",
      showCancelButton: true,
      confirmButtonColor: "#3452e1",
      cancelButtonColor: "#6b7280",
    });

    if (!email) return;

    try {
      AppSwal.fire({
        title: "Sending OTP...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const resp = await fetch(`${API_BASE}/api/User/forgotpassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      Swal.close();

      const data = await resp.json();
      if (!resp.ok) {
        AppSwal.fire("Error", data || "Email not found.", "error");
        return;
      }

      await AppSwal.fire({
        icon: "info",
        title: "OTP Sent",
        text: "Check your email inbox. We sent you a 6-digit OTP code (valid for 10 minutes).",
        confirmButtonColor: "#3452e1",
      });

      // Step 2: OTP
      const otp = await promptOtp(email);
      if (!otp) return;

      await AppSwal.fire({
        icon: "success",
        title: "OTP Verified",
        text: "Now you can set your new password.",
        confirmButtonColor: "#3452e1",
      });

      // Step 3: New password
      const { value: newPassForm } = await AppSwal.fire({
        title: "Reset Password",
        html: `
          <input id="swal-newpass" type="password" class="swal2-input" placeholder="New Password">
          <input id="swal-confirmpass" type="password" class="swal2-input" placeholder="Confirm Password">
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Reset Password",
        confirmButtonColor: "#3452e1",
        cancelButtonColor: "#6b7280",
        preConfirm: () => {
          const newPass = document.getElementById("swal-newpass").value;
          const confirmPass = document.getElementById("swal-confirmpass").value;

          if (!newPass || !confirmPass) {
            Swal.showValidationMessage("Both password fields are required.");
          } else if (newPass.length < 8) {
            Swal.showValidationMessage("Password must be at least 8 characters.");
          } else if (newPass !== confirmPass) {
            Swal.showValidationMessage("Passwords do not match.");
          }
          return { newPass };
        },
      });

      if (!newPassForm) return;

      const resetResp = await fetch(`${API_BASE}/api/User/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          newPassword: newPassForm.newPass,
        }),
      });

      const resetData = await resetResp.json();
      if (resetResp.ok) {
        AppSwal.fire(
          "Success",
          "Password reset successful. You can now log in.",
          "success"
        );
      } else {
        AppSwal.fire("Error", resetData || "Failed to reset password.", "error");
      }
    } catch (err) {
      console.error(err);
      AppSwal.fire("Error", "Something went wrong. Please try again later.", "error");
    }
  };

  if (!show) return null;

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
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="#253887"
                strokeWidth={2}
                strokeLinecap="round"
              />
            </svg>
          </button>

          <h4 className="text-xl font-bold text-[#253887] mb-2">Welcome back</h4>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[#425187] text-sm">
              Don't have an account yet?
            </span>
            <button
              className="text-[#3452e1] text-sm font-semibold hover:underline"
              onClick={() => setShowRegister(true)}
            >
              Register here
            </button>
          </div>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 border-t border-gray-200" />
            <span className="text-[#425187] text-sm">Via e-mail</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-[#253887] font-medium mb-1"
              >
                Login
              </label>
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
                <svg width={18} height={18} fill="none" viewBox="0 0 16 16">
                  <path
                    d="M1.333 8s2.667-4 6.667-4 6.667 4 6.667 4-2.667 4-6.667 4-6.667-4-6.667-4z"
                    stroke="#3452e1"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="8"
                    cy="8"
                    r="2"
                    stroke="#3452e1"
                    strokeWidth="1.5"
                  />
                </svg>
              </button>
            </div>
            <div className="mb-4 flex justify-between items-center">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[#3452e1] text-sm font-semibold hover:underline"
              >
                Forgot your password?
              </button>
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
        onClose={() => setShowRegister(false)}
        onShowLogin={onClose}
      />
    </>
  );
}
