import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineUser, // Imported user icon for Full Name
} from "react-icons/hi2";

export default function RegisterDesign() {
  // --- States ---
  // Added fullName and confirmPassword to state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Separate states for toggling visibility of password vs confirm password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  // --- Handlers ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    // 1. Basic Validation: Check for empty fields
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill in all fields");
      return;
    }

    // 2. Critical Validation: Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    // MOCK REGISTER API
    console.log("Registering user:", formData);
    // In real app: await axios.post('/api/auth/register', { fullName, email, password })

    setTimeout(() => {
      setIsLoading(false);
      alert("Account Created Successfully! Please Login.");
      // Navigate to login page here
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 my-8">
      <div className="w-full max-w-[500px] bg-white rounded-3xl shadow-2xl border border-border-custom overflow-hidden relative transition-all duration-300">
        {/* Top Strip */}
        <div className="absolute top-0 left-0 w-full h-3 bg-primary"></div>

        <div className="p-8 pt-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-primary tracking-tight">
              Create Account
            </h1>
            <p className="text-text-sub text-sm mt-3 font-medium">
              Join Blue Dimension today.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Full Name Input */}
            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2 ml-1">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub group-focus-within:text-accent transition-colors duration-300">
                  <HiOutlineUser size={22} />
                </div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-background text-text-main font-bold pl-11 pr-4 py-4 rounded-xl border border-border-custom outline-none focus:border-accent focus:ring-4 focus:ring-accent/20 transition-all placeholder:text-text-sub/50"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub group-focus-within:text-accent transition-colors duration-300">
                  <HiOutlineEnvelope size={22} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full bg-background text-text-main font-bold pl-11 pr-4 py-4 rounded-xl border border-border-custom outline-none focus:border-accent focus:ring-4 focus:ring-accent/20 transition-all placeholder:text-text-sub/50"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2 ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub group-focus-within:text-accent transition-colors duration-300">
                  <HiOutlineLockClosed size={22} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create password"
                  className="w-full bg-background text-text-main font-bold pl-11 pr-12 py-4 rounded-xl border border-border-custom outline-none focus:border-accent focus:ring-4 focus:ring-accent/20 transition-all placeholder:text-text-sub/50"
                />
                {/* Eye Icon Button for Password */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-sub hover:text-primary transition-colors p-1"
                >
                  {showPassword ? (
                    <HiOutlineEyeSlash size={20} />
                  ) : (
                    <HiOutlineEye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2 ml-1">
                Confirm Password
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub group-focus-within:text-accent transition-colors duration-300">
                  <HiOutlineLockClosed size={22} />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className="w-full bg-background text-text-main font-bold pl-11 pr-12 py-4 rounded-xl border border-border-custom outline-none focus:border-accent focus:ring-4 focus:ring-accent/20 transition-all placeholder:text-text-sub/50"
                />
                {/* Eye Icon Button for Confirm Password */}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-sub hover:text-primary transition-colors p-1"
                >
                  {showConfirmPassword ? (
                    <HiOutlineEyeSlash size={20} />
                  ) : (
                    <HiOutlineEye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-opacity-90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all duration-200 active:scale-[0.98] tracking-wide flex justify-center items-center mt-4"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-custom"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-text-sub font-medium">
                Or sign up with
              </span>
            </div>
          </div>

          {/* Google Button */}
          <button
            type="button"
            className="w-full bg-white hover:bg-background border-2 border-border-custom hover:border-primary/30 text-text-main font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
          >
            <FcGoogle size={24} />
            <span>Sign up with Google</span>
          </button>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-text-sub font-medium">
              Already have an account?{" "}
              <a href="#" className="text-accent font-bold hover:underline">
                Sign In
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-background py-4 text-center border-t border-border-custom">
          <p className="text-xs text-text-sub">
            By clicking, you agree to our{" "}
            <a href="#" className="text-accent hover:underline font-bold">
              Terms
            </a>{" "}
            &{" "}
            <a href="#" className="text-accent hover:underline font-bold">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
