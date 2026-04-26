import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineUser,
} from "react-icons/hi2";
import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";

export default function RegisterDesign() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.password) {
      alert("Please fill in all fields");
      return;
    }

    if (!agreeTerms) {
      alert("Please agree to the Terms and Privacy Policy.");
      return;
    }

    setIsLoading(true);

    console.log("Registering user:", formData);

    setTimeout(() => {
      setIsLoading(false);
      alert("Account Created Successfully! Please Login.");
    }, 1500);
  };

  const inputStyle = {
    backgroundColor: "var(--color-surface-alt)",
    color: "var(--color-text)",
    borderColor: "var(--color-border)",
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <Navbar />
      <div className="flex-1 w-full flex items-center justify-center p-4 py-10">
        <div
          className="w-full max-w-[400px] rounded-3xl shadow-2xl overflow-hidden relative transition-all duration-300"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          {/* Top Strip */}
          <div className="absolute top-0 left-0 w-full h-3 bg-primary"></div>

          <div className="p-8 pt-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold text-primary tracking-tight">
                Create Account
              </h1>
              <p className="text-sm mt-3 font-medium" style={{ color: "var(--color-text-sub)" }}>
                Join Blue Dimension today.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Full Name Input */}
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2 ml-1">
                  Full Name
                </label>
                <div className="relative group">
                  <div
                    className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300"
                    style={{ color: "var(--color-text-sub)" }}
                  >
                    <HiOutlineUser size={22} />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your Name"
                    style={inputStyle}
                    className="w-full font-bold pl-11 pr-4 py-4 rounded-xl border outline-none focus:border-accent focus:ring-4 focus:ring-accent/20 transition-all"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div
                    className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300"
                    style={{ color: "var(--color-text-sub)" }}
                  >
                    <HiOutlineEnvelope size={22} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    style={inputStyle}
                    className="w-full font-bold pl-11 pr-4 py-4 rounded-xl border outline-none focus:border-accent focus:ring-4 focus:ring-accent/20 transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2 ml-1">
                  Password
                </label>
                <div className="relative group">
                  <div
                    className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300"
                    style={{ color: "var(--color-text-sub)" }}
                  >
                    <HiOutlineLockClosed size={22} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create password"
                    style={inputStyle}
                    className="w-full font-bold pl-11 pr-12 py-4 rounded-xl border outline-none focus:border-accent focus:ring-4 focus:ring-accent/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors p-1"
                    style={{ color: "var(--color-text-sub)" }}
                  >
                    {showPassword ? (
                      <HiOutlineEyeSlash size={20} />
                    ) : (
                      <HiOutlineEye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Checkbox for Terms */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 text-primary rounded focus:ring-accent focus:ring-2 cursor-pointer transition-all"
                  style={{
                    backgroundColor: "var(--color-surface-alt)",
                    borderColor: "var(--color-border)",
                  }}
                />
                <label
                  htmlFor="agreeTerms"
                  className="text-xs font-medium cursor-pointer"
                  style={{ color: "var(--color-text-sub)" }}
                >
                  I agree to the{" "}
                  <Link to="/terms" className="text-accent hover:underline font-bold">
                    Terms
                  </Link>{" "}
                  &{" "}
                  <Link to="/privacy-policy" className="text-accent hover:underline font-bold">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={isLoading || !agreeTerms}
                className="w-full bg-primary hover:bg-opacity-90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all duration-200 active:scale-[0.98] tracking-wide flex justify-center items-center mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: "var(--color-border)" }}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span
                  className="px-4 font-medium"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    color: "var(--color-text-sub)",
                  }}
                >
                  Or sign up with
                </span>
              </div>
            </div>

            {/* Google Button */}
            <button
              type="button"
              className="w-full font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] border-2"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
                color: "var(--color-text)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(30,58,138,0.3)";
                e.currentTarget.style.backgroundColor = "var(--color-surface-alt)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border)";
                e.currentTarget.style.backgroundColor = "var(--color-surface)";
              }}
            >
              <FcGoogle size={24} />
              <span>Sign up with Google</span>
            </button>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm font-medium" style={{ color: "var(--color-text-sub)" }}>
                Already have an account?{" "}
                <Link to="/login" className="text-accent font-bold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
