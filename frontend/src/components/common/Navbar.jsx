import { Link, useLocation } from "react-router-dom";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi2";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav
      className="h-16 w-full border-b flex items-center justify-between px-6 shadow-sm shrink-0 z-50"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <Link to="/" className="flex items-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-primary">
          Blue Dimension<span className="text-accent">.</span>
        </h1>
      </Link>

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="theme-toggle"
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <HiOutlineSun size={18} />
          ) : (
            <HiOutlineMoon size={18} />
          )}
        </button>

        {location.pathname !== "/login" && (
          <Link
            to="/login"
            className="text-sm font-bold transition-colors"
            style={{ color: "var(--color-text-sub)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--brand-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-sub)")}
          >
            Sign In
          </Link>
        )}
        {location.pathname !== "/register" && (
          <Link
            to="/register"
            className="text-sm font-bold bg-primary hover:bg-opacity-90 text-white px-5 py-2 rounded-xl shadow-md shadow-primary/20 transition-all active:scale-[0.98]"
          >
            Sign Up
          </Link>
        )}
      </div>
    </nav>
  );
}
