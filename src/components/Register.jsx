import React, { useState } from "react";
import Swal from "sweetalert2";
import { getApiBaseUrl } from "../../util/apiconfig";
// Mock data: 63 provinces/cities and postal codes
const provincePostalList = [
    { name: "An Giang", postal: "88000" },
    { name: "Bà Rịa - Vũng Tàu", postal: "79000" },
    { name: "Bắc Giang", postal: "26000" },
    { name: "Bắc Kạn", postal: "23000" },
    { name: "Bạc Liêu", postal: "97000" },
    { name: "Bắc Ninh", postal: "16000" },
    { name: "Bến Tre", postal: "86000" },
    { name: "Bình Định", postal: "55000" },
    { name: "Bình Dương", postal: "82000" },
    { name: "Bình Phước", postal: "83000" },
    { name: "Bình Thuận", postal: "77000" },
    { name: "Cà Mau", postal: "98000" },
    { name: "Cần Thơ", postal: "90000" },
    { name: "Cao Bằng", postal: "21000" },
    { name: "Đà Nẵng", postal: "50000" },
    { name: "Đắk Lắk", postal: "63000" },
    { name: "Đắk Nông", postal: "65000" },
    { name: "Điện Biên", postal: "32000" },
    { name: "Đồng Nai", postal: "81000" },
    { name: "Đồng Tháp", postal: "87000" },
    { name: "Gia Lai", postal: "61000" },
    { name: "Hà Giang", postal: "20000" },
    { name: "Hà Nam", postal: "18000" },
    { name: "Hà Nội", postal: "10000" },
    { name: "Hà Tĩnh", postal: "45000" },
    { name: "Hải Dương", postal: "03000" },
    { name: "Hải Phòng", postal: "04000" },
    { name: "Hậu Giang", postal: "95000" },
    { name: "Hòa Bình", postal: "36000" },
    { name: "Hưng Yên", postal: "17000" },
    { name: "Khánh Hòa", postal: "65000" },
    { name: "Kiên Giang", postal: "91000" },
    { name: "Kon Tum", postal: "60000" },
    { name: "Lai Châu", postal: "30000" },
    { name: "Lâm Đồng", postal: "67000" },
    { name: "Lạng Sơn", postal: "25000" },
    { name: "Lào Cai", postal: "31000" },
    { name: "Long An", postal: "85000" },
    { name: "Nam Định", postal: "07000" },
    { name: "Nghệ An", postal: "43000" },
    { name: "Ninh Bình", postal: "08000" },
    { name: "Ninh Thuận", postal: "66000" },
    { name: "Phú Thọ", postal: "35000" },
    { name: "Phú Yên", postal: "56000" },
    { name: "Quảng Bình", postal: "47000" },
    { name: "Quảng Nam", postal: "51000" },
    { name: "Quảng Ngãi", postal: "53000" },
    { name: "Quảng Ninh", postal: "01000" },
    { name: "Quảng Trị", postal: "48000" },
    { name: "Sóc Trăng", postal: "96000" },
    { name: "Sơn La", postal: "34000" },
    { name: "Tây Ninh", postal: "80000" },
    { name: "Thái Bình", postal: "06000" },
    { name: "Thái Nguyên", postal: "24000" },
    { name: "Thanh Hóa", postal: "40000" },
    { name: "Thừa Thiên Huế", postal: "49000" },
    { name: "Tiền Giang", postal: "84000" },
    { name: "TP. Hồ Chí Minh", postal: "70000" },
    { name: "Trà Vinh", postal: "94000" },
    { name: "Tuyên Quang", postal: "22000" },
    { name: "Vĩnh Long", postal: "89000" },
    { name: "Vĩnh Phúc", postal: "15000" },
    { name: "Yên Bái", postal: "33000" }
];

// Validation helpers
const validateEmail = (email) =>
    /^([a-zA-Z0-9_\-.+])+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(email);
const validatePassword = (pw) => pw.length >= 8;
const validateName = (name) => name.trim().length > 0;
const validatePhone = (phone) =>
    /^[0-9\-+\s()]{6,20}$/.test(phone) && phone.trim().length > 0;

export default function Register({ show, onClose, onShowLogin }) {
    const [showPassword, setShowPassword] = useState(false);
    const [agree, setAgree] = useState(false);
    const [form, setForm] = useState({
        email: "",
        password: "",
        name: "",
        surname: "",
        countryCode: "+84",
        phone: "",
        province: "",
        postal: "",
    });
    const [errors, setErrors] = useState({});
    if (!show) return null;

    const API_BASE = getApiBaseUrl();

    // Validate postal code: must match province & be 5 digits
    const validatePostal = (province, postal) => {
        if (!postal) return false;
        if (!province) return false;
        const found = provincePostalList.find((p) => p.name === province);
        if (!found) return false;
        return postal === found.postal;
    };

    // Form validation
    const validateForm = () => {
        const err = {};
        if (!validateEmail(form.email)) err.email = "Invalid email address.";
        if (!validatePassword(form.password)) err.password = "Password must be at least 8 characters.";
        if (!validateName(form.name)) err.name = "Please enter your first name.";
        if (!validateName(form.surname)) err.surname = "Please enter your last name.";
        if (!validatePhone(form.phone)) err.phone = "Invalid phone number.";
        if (!form.province) err.province = "Please select a province/city.";
        if (!form.postal) err.postal = "Please enter the postal code.";
        else if (!validatePostal(form.province, form.postal))
            err.postal = "Postal code does not match the selected province.";
        if (!agree) err.agree = "You must agree to the terms.";
        return err;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    // Auto-fill postal code when province changes
    const handleProvinceChange = (e) => {
        const province = e.target.value;
        const found = provincePostalList.find((p) => p.name === province);
        setForm((prev) => ({
            ...prev,
            province,
            postal: found ? found.postal : ""
        }));
        setErrors((prev) => ({ ...prev, province: undefined, postal: undefined }));
    };

    const handleCheckbox = () => {
        setAgree((prev) => !prev);
        setErrors((prev) => ({ ...prev, agree: undefined }));
    };

    const handleRegister = async (e) => {
    e.preventDefault();
    const err = validateForm();
    setErrors(err);

    if (Object.keys(err).length == 0) {
      try {
        // Chuẩn bị DTO đúng như backend yêu cầu (RegisterDto)
        const registerDto = {
          Name: form.name,
          Email: form.email,
          FullName: `${form.name} ${form.surname}`,
          Mobile: form.phone,
          Password: form.password,
          Province: form.province
        };
        console.log("Register DTO:", registerDto);
        const resp = await fetch(`${API_BASE}/api/User/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(registerDto)
        });
        console.log("Response status:", resp.status);
        if (resp.ok) {
          Swal.fire({
            icon: "success",
            title: "Registration successful!",
            text: "Your account has been created.",
          });
          // Có thể reset form hoặc tự động đóng modal tại đây nếu muốn
        } else {
          const data = await resp.json();
          console.error("Registration error:", data);
          Swal.fire({
            icon: "error",
            title: "Registration failed",
            text: data?.message || "An error occurred. Please try again.",
          });
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Registration failed",
          text: "An error occurred. Please try again.",
        });
      }
    }
  };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 font-sans">
            <div
                className="relative bg-white rounded-2xl shadow-lg w-full max-w-4xl mx-auto p-0 flex animate-fade-in overflow-hidden"
                style={{ minHeight: 650 }}
            >
                <div
                    className="w-full max-w-xl px-12 py-10 bg-white"
                    style={{ borderTopLeftRadius: 22, borderBottomLeftRadius: 22 }}
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-7 rounded-full p-1 hover:bg-gray-100 transition"
                        aria-label="Close modal"
                        style={{ zIndex: 2 }}
                    >
                        <svg width={24} height={24} fill="none" viewBox="0 0 16 16">
                            <path
                                d="M4 4l8 8M12 4l-8 8"
                                stroke="#253887"
                                strokeWidth={2}
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                    <h4
                        className="text-[2rem] font-bold text-[#253887] mb-2 mt-2 leading-tight"
                        style={{ textAlign: "center" }}
                    >
                        Registration
                    </h4>
                    <div className="flex items-center justify-center gap-2 mb-7">
                        <span className="text-[#425187] text-base">Already have an account?</span>
                        <button
                            className="text-[#3452e1] text-base font-semibold hover:underline focus:outline-none"
                            onClick={onShowLogin}
                        >
                            Login
                        </button>
                    </div>
                    {/* Social login */}
                    {/* OR divider */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex-1 border-t border-gray-200" />
                        <span className="text-[#bfc8dc] text-base font-semibold">
                            via e-mail
                        </span>
                        <div className="flex-1 border-t border-gray-200" />
                    </div>
                    {/* Registration form */}
                    <form onSubmit={handleRegister} autoComplete="off" noValidate>
                        <div className="mb-2">
                            <label className="block text-[#253887] font-bold mb-1 text-sm tracking-wide">
                                LOGIN
                            </label>
                            <input
                                id="reg-email"
                                name="email"
                                type="email"
                                maxLength={254}
                                placeholder="Email"
                                value={form.email}
                                onChange={handleChange}
                                className={`w-full border ${errors.email ? "border-red-400" : "border-[#bfc8dc]"
                                    } rounded-md px-4 py-2 text-[#253887] placeholder:text-[#bfc8dc] focus:ring-2 focus:ring-[#3452e1] focus:border-[#3452e1] transition text-base font-medium bg-[#f9fbfe] mb-1`}
                                style={{ outline: "none" }}
                            />
                            {errors.email && (
                                <div className="text-red-500 text-xs mb-2">{errors.email}</div>
                            )}
                            <div className="relative">
                                <input
                                    id="reg-password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    minLength={8}
                                    maxLength={254}
                                    placeholder="Password (min. 8 characters)"
                                    value={form.password}
                                    onChange={handleChange}
                                    className={`w-full border ${errors.password ? "border-red-400" : "border-[#bfc8dc]"
                                        } rounded-md px-4 py-2 text-[#253887] placeholder:text-[#bfc8dc] focus:ring-2 focus:ring-[#3452e1] focus:border-[#3452e1] transition text-base font-medium bg-[#f9fbfe] pr-10`}
                                    style={{ outline: "none" }}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#bfc8dc] hover:text-[#3452e1] focus:outline-none"
                                    tabIndex={-1}
                                    onClick={() => setShowPassword((s) => !s)}
                                    style={{ background: "none" }}
                                >
                                    {/* Eye icon */}
                                    <svg width={20} height={20} fill="none" viewBox="0 0 16 16">
                                        <path
                                            d="M1.333 8s2.667-4 6.667-4 6.667 4 6.667 4-2.667 4-6.667 4-6.667-4-6.667-4z"
                                            stroke="#3452e1"
                                            strokeWidth="1.5"
                                        />
                                        <circle cx="8" cy="8" r="2" stroke="#3452e1" strokeWidth="1.5" />
                                    </svg>
                                </button>
                            </div>
                            {errors.password && (
                                <div className="text-red-500 text-xs mt-1">{errors.password}</div>
                            )}
                        </div>
                        <div className="mb-2 mt-6">
                            <label className="block text-[#253887] font-bold mb-1 text-sm tracking-wide">
                                PERSONAL DATA
                            </label>
                            <div className="flex gap-3 mb-1">
                                <div className="w-1/2">
                                    <input
                                        id="reg-name"
                                        name="name"
                                        type="text"
                                        maxLength={128}
                                        placeholder="First name"
                                        value={form.name}
                                        onChange={handleChange}
                                        className={`w-full border ${errors.name ? "border-red-400" : "border-[#bfc8dc]"} rounded-md px-4 py-2 text-[#253887] placeholder:text-[#bfc8dc] focus:ring-2 focus:ring-[#3452e1] focus:border-[#3452e1] transition text-base font-medium bg-[#f9fbfe]`}
                                        style={{ outline: "none" }}
                                    />
                                    {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                                </div>
                                <div className="w-1/2">
                                    <input
                                        id="reg-surname"
                                        name="surname"
                                        type="text"
                                        maxLength={128}
                                        placeholder="Last name"
                                        value={form.surname}
                                        onChange={handleChange}
                                        className={`w-full border ${errors.surname ? "border-red-400" : "border-[#bfc8dc]"} rounded-md px-4 py-2 text-[#253887] placeholder:text-[#bfc8dc] focus:ring-2 focus:ring-[#3452e1] focus:border-[#3452e1] transition text-base font-medium bg-[#f9fbfe]`}
                                        style={{ outline: "none" }}
                                    />
                                    {errors.surname && <div className="text-red-500 text-xs mt-1">{errors.surname}</div>}
                                </div>
                            </div>
                            <div className="flex gap-3 mb-1">
                                <div className="w-1/4">
                                    <select
                                        className="w-full border border-[#bfc8dc] rounded-md px-2 py-2 text-[#253887] focus:ring-2 focus:ring-[#3452e1] focus:border-[#3452e1] transition text-base bg-[#f9fbfe]"
                                        defaultValue={form.countryCode}
                                        id="reg-phone-code"
                                        name="countryCode"
                                        value={form.countryCode}
                                        onChange={handleChange}
                                        style={{ outline: "none" }}
                                    >
                                        <option value="+84">+84</option>
                                    </select>
                                </div>
                                <div className="w-3/4">
                                    <input
                                        id="reg-phone"
                                        name="phone"
                                        type="tel"
                                        maxLength={20}
                                        placeholder="Phone number"
                                        value={form.phone}
                                        onChange={handleChange}
                                        className={`w-full border ${errors.phone ? "border-red-400" : "border-[#bfc8dc]"} rounded-md px-4 py-2 text-[#253887] placeholder:text-[#bfc8dc] focus:ring-2 focus:ring-[#3452e1] focus:border-[#3452e1] transition text-base font-medium bg-[#f9fbfe]`}
                                        style={{ outline: "none" }}
                                    />
                                    {errors.phone && <div className="text-red-500 text-xs mt-1">{errors.phone}</div>}
                                </div>
                            </div>
                            <div className="flex gap-3 mb-1">
                                <div className="w-1/2">
                                    <select
                                        className={`w-full border ${errors.province ? "border-red-400" : "border-[#bfc8dc]"} rounded-md px-2 py-2 text-[#253887] focus:ring-2 focus:ring-[#3452e1] focus:border-[#3452e1] transition text-base bg-[#f9fbfe]`}
                                        id="reg-province"
                                        name="province"
                                        value={form.province}
                                        onChange={handleProvinceChange}
                                        style={{ outline: "none" }}
                                    >
                                        <option value="">Select province/city</option>
                                        {provincePostalList.map((p) => (
                                            <option key={p.name} value={p.name}>
                                                {p.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.province && <div className="text-red-500 text-xs mt-1">{errors.province}</div>}
                                </div>
                                <div className="w-1/2">
                                    <input
                                        id="reg-postal"
                                        name="postal"
                                        type="text"
                                        maxLength={5}
                                        placeholder="Postal code"
                                        value={form.postal}
                                        onChange={handleChange}
                                        className={`w-full border ${errors.postal ? "border-red-400" : "border-[#bfc8dc]"} rounded-md px-4 py-2 text-[#253887] placeholder:text-[#bfc8dc] focus:ring-2 focus:ring-[#3452e1] focus:border-[#3452e1] transition text-base font-medium bg-[#f9fbfe]`}
                                        style={{ outline: "none" }}
                                        pattern="[0-9]{5}"
                                        required
                                    />
                                    {errors.postal && <div className="text-red-500 text-xs mt-1">{errors.postal}</div>}
                                </div>
                            </div>
                        </div>
                        <div className="mb-5 mt-5 flex items-center">
                            <input
                                id="agree"
                                name="agree"
                                type="checkbox"
                                checked={agree}
                                onChange={handleCheckbox}
                                className="mr-2 accent-[#3452e1] w-4 h-4"
                            />
                            <label htmlFor="agree" className="text-[#425187] text-sm select-none">
                                I agree to the processing of{" "}
                                    personal data.
                            </label>
                        </div>
                        {errors.agree && (
                            <div className="text-red-500 text-xs mb-3">{errors.agree}</div>
                        )}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-[#3452e1] to-[#253887] hover:from-[#253887] hover:to-[#3452e1] text-white font-bold rounded-md px-6 py-3 shadow transition text-lg"
                            style={{ boxShadow: "0 6px 18px 0 rgba(52,82,225,0.15)" }}
                            disabled={!agree}
                        >
                            Register
                        </button>
                    </form>
                </div>
                {/* Right side: Benefits */}
                <div
                    className="hidden md:flex flex-col items-start justify-start bg-[#f5f8ff] w-[340px] px-10 py-10"
                    style={{ borderTopRightRadius: 22, borderBottomRightRadius: 22 }}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-7 rounded-full p-1 hover:bg-gray-100 transition md:hidden block"
                        aria-label="Close modal"
                        style={{ zIndex: 2 }}
                    >
                        <svg width={24} height={24} fill="none" viewBox="0 0 16 16">
                            <path
                                d="M4 4l8 8M12 4l-8 8"
                                stroke="#253887"
                                strokeWidth={2}
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                    <div className="w-full flex flex-col gap-8 mt-6 mb-4">
                        <div className="flex items-center gap-3">
                            {/* Heart icon with check */}
                            <span className="relative flex items-center">
                                <i className="ri-heart-3-line text-[32px] text-[#3452e1]"></i>
                                <i className="ri-checkbox-circle-fill text-[18px] text-[#34A853] absolute -bottom-1 -right-2 bg-white rounded-full"></i>
                            </span>
                            <span className="text-[#253887] font-medium text-base leading-snug">
                                Be the first to learn about our new
                                <br />
                                products and discounts
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Bookmark icon with check */}
                            <span className="relative flex items-center">
                                <i className="ri-bookmark-line text-[32px] text-[#3452e1]"></i>
                                <i className="ri-checkbox-circle-fill text-[18px] text-[#34A853] absolute -bottom-1 -right-2 bg-white rounded-full"></i>
                            </span>
                            <span className="text-[#253887] font-medium text-base leading-snug">
                                Access your saved searches
                                <br />
                                across your devices
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Fuel icon with check */}
                            <span className="relative flex items-center">
                                <i className="ri-gas-station-line text-[32px] text-[#3452e1]"></i>
                                <i className="ri-checkbox-circle-fill text-[18px] text-[#34A853] absolute -bottom-1 -right-2 bg-white rounded-full"></i>
                            </span>
                            <span className="text-[#253887] font-medium text-base leading-snug">
                                Get complimentary 10
                                <br />
                                litres of fuel with your new car
                            </span>
                        </div>
                    </div>
                    {/* Illustration */}
                    <img
                        src="/images/Carvago-CarAudit.webp"
                        alt="Car illustration"
                        className="w-full h-auto max-h-52 object-contain mt-auto"
                    />
                </div>
            </div>
        </div>
    );
}