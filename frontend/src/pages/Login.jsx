import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
} from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../redux/authSlice";

export default function LoginEmailDesign() {
  // --- States (Field name 'userEmail' hi rakha hai jaisa tumne kaha) ---
  const [formData, setFormData] = useState({ userEmail: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state se values nikalna
  const { isLoading, user, error } = useSelector((state) => state.auth);

  // Agar user already logged in hai, toh Dashboard bhejo
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(loginUser(formData));
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-[400px] bg-white rounded-3xl shadow-2xl border border-border-custom overflow-hidden relative transition-all duration-300">
        {/* Top Strip */}
        <div className="absolute top-0 left-0 w-full h-3 bg-primary"></div>

        <div className="p-8 pt-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-primary tracking-tight">
              Blue Dimension
            </h1>
            <p className="text-text-sub text-sm mt-3 font-medium">
              Welcome back! Please login to your account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message Logic (Using generic red colors for error visibility) */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg text-center font-medium">
                {typeof error === "string" ? error : "Login failed"}
              </div>
            )}

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
                  name="userEmail" // Yeh 'userEmail' hi rakha hai
                  value={formData.userEmail}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full bg-background text-text-main font-bold pl-11 pr-4 py-4 rounded-xl border border-border-custom outline-none focus:border-accent focus:ring-4 focus:ring-accent/20 transition-all placeholder:text-text-sub/50"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="block text-xs font-bold text-primary uppercase tracking-wider">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs text-accent font-bold hover:underline"
                >
                  Forgot Password?
                </a>
              </div>

              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub group-focus-within:text-accent transition-colors duration-300">
                  <HiOutlineLockClosed size={22} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-background text-text-main font-bold pl-11 pr-12 py-4 rounded-xl border border-border-custom outline-none focus:border-accent focus:ring-4 focus:ring-accent/20 transition-all placeholder:text-text-sub/50"
                  required
                />

                {/* Eye Icon Button */}
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

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-opacity-90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all duration-200 active:scale-[0.98] tracking-wide flex justify-center items-center mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                "Sign In"
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
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Button */}
          <button
            type="button"
            className="w-full bg-white hover:bg-background border-2 border-border-custom hover:border-primary/30 text-text-main font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
          >
            <FcGoogle size={24} />
            <span>Sign in with Google</span>
          </button>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-text-sub font-medium">
              Don't have an account?{" "}
              <a href="#" className="text-accent font-bold hover:underline">
                Sign up
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
