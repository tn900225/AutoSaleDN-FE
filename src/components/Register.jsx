import React, { useState } from "react";

export default function Register({ show, onClose, onShowLogin }) {
    const [showPassword, setShowPassword] = useState(false);
    const [agree, setAgree] = useState(false);

    if (!show) return null;

    // Xử lý submit đăng ký (bạn có thể thêm logic xử lý đăng ký ở đây)
    const handleRegister = (e) => {
        e.preventDefault();
        // Thực hiện đăng ký ở đây nếu cần
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 font-sans">
            <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-4xl mx-auto p-0 flex animate-fade-in overflow-hidden" style={{ minHeight: 650 }}>
                <div className="w-full max-w-xl px-12 py-10 bg-white" style={{ borderTopLeftRadius: 22, borderBottomLeftRadius: 22 }}>
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-7 rounded-full p-1 hover:bg-gray-100 transition"
                        aria-label="Close modal"
                        style={{ zIndex: 2 }}
                    >
                        <svg width={24} height={24} fill="none" viewBox="0 0 16 16">
                            <path d="M4 4l8 8M12 4l-8 8" stroke="#253887" strokeWidth={2} strokeLinecap="round" />
                        </svg>
                    </button>
                    <h4 className="text-[2rem] font-bold text-[#253887] mb-2 mt-2 leading-tight" style={{ textAlign: "center" }}>Registration</h4>
                    <div className="flex items-center justify-center gap-2 mb-7"  >
                        <span className="text-[#425187] text-base">Have an account?</span>
                        <button className="text-[#3452e1] text-base font-semibold hover:underline focus:outline-none" onClick={onShowLogin}>
                            Login
                        </button>
                    </div>
                    {/* Social login */}
                    <div className="flex gap-5 mb-7">
                        <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-8 py-3 font-semibold shadow-md hover:bg-gray-50 transition w-1/2 justify-center bg-white text-[#253887] text-lg"
                            style={{ boxShadow: "0 2px 8px 0 rgba(60,80,180,0.04)" }}>
                            <span>
                                {/* Google SVG */}
                                <svg viewBox="0 0 20 20" width={24} height={24} aria-hidden="true">
                                    <path fill="#EA4335" fillRule="evenodd" d="M10 3.867c1.877 0 3.144.81 3.866 1.489L16.69 2.6C14.955.989 12.699 0 9.999 0 6.09 0 2.712 2.244 1.067 5.511L4.3 8.022c.81-2.41 3.055-4.155 5.7-4.155z" clipRule="evenodd"></path>
                                    <path fill="#4285F4" fillRule="evenodd" d="M19.6 10.222c0-.822-.067-1.422-.211-2.044H10v3.71h5.511c-.111.923-.711 2.312-2.044 3.245l3.155 2.445c1.89-1.745 2.978-4.311 2.978-7.356z" clipRule="evenodd"></path>
                                    <path fill="#FBBC05" fillRule="evenodd" d="M4.311 11.978c-.211-.623-.333-1.29-.333-1.978 0-.689.122-1.356.322-1.978l-3.233-2.51C.389 6.866 0 8.388 0 10c0 1.611.389 3.133 1.067 4.489l3.244-2.511z" clipRule="evenodd"></path>
                                    <path fill="#34A853" fillRule="evenodd" d="M10 20c2.7 0 4.967-.889 6.623-2.422l-3.156-2.445c-.844.59-1.978 1-3.467 1-2.644 0-4.889-1.744-5.689-4.155l-3.233 2.51C2.723 17.757 6.09 20 10 20z" clipRule="evenodd"></path>
                                </svg>
                            </span>
                            Google
                        </button>
                        <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-8 py-3 font-semibold shadow-md hover:bg-gray-50 transition w-1/2 justify-center bg-white text-[#253887] text-lg"
                            style={{ boxShadow: "0 2px 8px 0 rgba(60,80,180,0.04)" }}>
                            <span>
                                {/* Facebook SVG */}
                                <svg viewBox="0 0 24 24" width={24} height={24} aria-hidden="true">
                                    <circle cx="12" cy="12" r="12" fill="#1877F2" />
                                    <path d="M16.6711 15.4688L17.2031 12H13.875V9.75C13.875 8.80102 14.34 7.875 15.8306 7.875H17.3438V4.92188C17.3438 4.92188 15.9705 4.6875 14.6576 4.6875C11.9166 4.6875 10.125 6.34875 10.125 9.35625V12H7.07812V15.4688H10.125V23.8542C11.3674 24.0486 12.6326 24.0486 13.875 23.8542V15.4688H16.6711Z" fill="white"></path>
                                </svg>
                            </span>
                            Facebook
                        </button>
                    </div>
                    {/* OR divider */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex-1 border-t border-gray-200" />
                        <span className="text-[#bfc8dc] text-base font-semibold">Or via e-mail</span>
                        <div className="flex-1 border-t border-gray-200" />
                    </div>
                    {/* Registration form */}
                    <form onSubmit={handleRegister} autoComplete="off">
                        <div className="mb-2">
                            <label className="block text-[#253887] font-bold mb-1 text-sm tracking-wide">LOGIN</label>
                            <input
                                id="reg-email"
                                name="email"
                                type="email"
                                maxLength={254}
                                placeholder="Email"
                                className="w-full border border-[#bfc8dc] rounded-md px-4 py-2 text-[#253887] placeholder:text-[#bfc8dc] focus:ring-2 focus:ring-[#3452e1] focus:border-[#3452e1] transition text-base font-medium bg-[#f9fbfe] mb-3"
                                style={{ outline: "none" }}
                            />
                            <div className="relative">
                                <input
                                    id="reg-password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    minLength={8}
                                    maxLength={254}
                                    placeholder="Password (min. 8 characters)"
                                    className="w-full border border-[#bfc8dc] rounded-md px-4 py-2 text-[#253887] placeholder:text-[#bfc8dc] focus:ring-2 focus:ring-[#3452e1] focus:border-[#3452e1] transition text-base font-medium bg-[#f9fbfe] pr-10"
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
                                        <path d="M1.333 8s2.667-4 6.667-4 6.667 4 6.667 4-2.667 4-6.667 4-6.667-4-6.667-4z" stroke="#3452e1" strokeWidth="1.5" />
                                        <circle cx="8" cy="8" r="2" stroke="#3452e1" strokeWidth="1.5" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="mb-2 mt-6">
                            <label className="block text-[#253887] font-bold mb-1 text-sm tracking-wide">PERSONAL DATA</label>
                            <div className="flex gap-3 mb-3">
                                <input
                                    id="reg-name"
                                    name="name"
                                    type="text"
                                    maxLength={128}
                                    placeholder="Name"
                                    className="w-1/2 border border-[#bfc8dc] rounded-md px-4 py-2 text-[#253887] placeholder:text-[#bfc8dc] focus:ring-2 focus:ring-[#3452e1] focus:border-[#3452e1] transition text-base font-medium bg-[#f9fbfe]"
                                    style={{ outline: "none" }}
                                />
                                <input
                                    id="reg-surname"
                                    name="surname"
                                    type="text"
                                    maxLength={128}
                                    placeholder="Surname"
                                    className="w-1/2 border border-[#bfc8dc] rounded-md px-4 py-2 text-[#253887] placeholder:text-[#bfc8dc] focus:ring-2 focus:ring-[#3452e1] focus:border-[#3452e1] transition text-base font-medium bg-[#f9fbfe]"
                                    style={{ outline: "none" }}
                                />
                            </div>
                            <div className="flex gap-3 mb-3">
                                <select
                                    className="w-1/4 border border-[#bfc8dc] rounded-md px-2 py-2 text-[#253887] focus:ring-2 focus:ring-[#3452e1] focus:border-[#3452e1] transition text-base bg-[#f9fbfe]"
                                    defaultValue="+84"
                                    id="reg-phone-code"
                                    name="countryCode"
                                    style={{ outline: "none" }}
                                >
                                    <option value="+84">+84</option>
                                    <option value="+1">+1</option>
                                    <option value="+61">+61</option>
                                </select>
                                <input
                                    id="reg-phone"
                                    name="phone"
                                    type="tel"
                                    maxLength={20}
                                    placeholder="Telephone number"
                                    className="w-3/4 border border-[#bfc8dc] rounded-md px-4 py-2 text-[#253887] placeholder:text-[#bfc8dc] focus:ring-2 focus:ring-[#3452e1] focus:border-[#3452e1] transition text-base font-medium bg-[#f9fbfe]"
                                    style={{ outline: "none" }}
                                />
                            </div>
                            <div className="flex gap-3">
                                <select
                                    className="w-1/2 border border-[#bfc8dc] rounded-md px-2 py-2 text-[#253887] focus:ring-2 focus:ring-[#3452e1] focus:border-[#3452e1] transition text-base bg-[#f9fbfe]"
                                    id="reg-country"
                                    name="country"
                                    style={{ outline: "none" }}
                                >
                                    <option value="">Select country</option>
                                    <option value="vn">Vietnam</option>
                                    <option value="us">United States</option>
                                </select>
                                <input
                                    id="reg-postal"
                                    name="postal"
                                    type="text"
                                    maxLength={16}
                                    placeholder="Postal code"
                                    className="w-1/2 border border-[#bfc8dc] rounded-md px-4 py-2 text-[#253887] placeholder:text-[#bfc8dc] focus:ring-2 focus:ring-[#3452e1] focus:border-[#3452e1] transition text-base font-medium bg-[#f9fbfe]"
                                    style={{ outline: "none" }}
                                />
                            </div>
                        </div>
                        <div className="mb-5 mt-5 flex items-center">
                            <input
                                id="agree"
                                name="agree"
                                type="checkbox"
                                checked={agree}
                                onChange={() => setAgree(a => !a)}
                                className="mr-2 accent-[#3452e1] w-4 h-4"
                            />
                            <label htmlFor="agree" className="text-[#425187] text-sm select-none">
                                I agree to the processing of <a href="#" className="text-[#3452e1] underline">personal data</a>.
                            </label>
                        </div>
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
                <div className="hidden md:flex flex-col items-start justify-start bg-[#f5f8ff] w-[340px] px-10 py-10" style={{ borderTopRightRadius: 22, borderBottomRightRadius: 22 }}>
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-7 rounded-full p-1 hover:bg-gray-100 transition md:hidden block"
                        aria-label="Close modal"
                        style={{ zIndex: 2 }}
                    >
                        <svg width={24} height={24} fill="none" viewBox="0 0 16 16">
                            <path d="M4 4l8 8M12 4l-8 8" stroke="#253887" strokeWidth={2} strokeLinecap="round" />
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
                                Be the first to learn about our new<br />products and discounts
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Bookmark icon with check */}
                            <span className="relative flex items-center">
                                <i className="ri-bookmark-line text-[32px] text-[#3452e1]"></i>
                                <i className="ri-checkbox-circle-fill text-[18px] text-[#34A853] absolute -bottom-1 -right-2 bg-white rounded-full"></i>
                            </span>
                            <span className="text-[#253887] font-medium text-base leading-snug">
                                Access your saved searches<br />across your devices
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Fuel icon with check */}
                            <span className="relative flex items-center">
                                <i className="ri-gas-station-line text-[32px] text-[#3452e1]"></i>
                                <i className="ri-checkbox-circle-fill text-[18px] text-[#34A853] absolute -bottom-1 -right-2 bg-white rounded-full"></i>
                            </span>
                            <span className="text-[#253887] font-medium text-base leading-snug">
                                You will get complimentary 10<br />litres of fuel in your new car
                            </span>
                        </div>
                    </div>
                    {/* Illustration */}
                    <img src="/images/Carvago-CarAudit.webp" alt="Car illustration" className="w-full h-auto max-h-52 object-contain mt-auto" />
                </div>
            </div>
        </div>
    );
}