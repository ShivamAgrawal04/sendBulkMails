// DashboardLayout.jsx
import { Outlet, NavLink, Link } from "react-router-dom";
import { useState } from "react";
import {
  HiOutlineUserCircle,
  HiOutlineSquares2X2,
  HiOutlineEnvelope,
  HiOutlineCog6Tooth,
  HiBars3,
  HiOutlineArrowLeftOnRectangle,
  HiOutlineSun,
  HiOutlineMoon,
} from "react-icons/hi2";
import { BiMailSend } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useTheme } from "../context/ThemeContext";

export default function DashboardLayout() {
  const [open, setOpen] = useState(true);
  const { theme, toggleTheme } = useTheme();

  const { user } = useSelector((state) => state.auth);

  return (
    <div
      className="min-h-screen flex font-sans"
      style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
    >
      {/* --- Sidebar --- */}
      <aside
        className={`${
          open ? "w-64" : "w-20"
        } bg-primary text-white transition-all duration-300 flex flex-col shadow-xl z-20`}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-center border-b border-white/10">
          {open ? (
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Blue Dimension<span className="text-accent">.</span>
            </h1>
          ) : (
            <h1 className="text-2xl font-extrabold text-accent">B.D.</h1>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-2 flex-1 overflow-y-auto mt-4">
          <NavItem
            to="/"
            label="Dashboard"
            icon={<HiOutlineSquares2X2 size={24} />}
            open={open}
          />
          <NavItem
            to="/emails"
            label="Emails"
            icon={<HiOutlineEnvelope size={24} />}
            open={open}
          />
          <NavItem
            to="/sendMail"
            label="Send Mail"
            icon={<BiMailSend size={24} />}
            open={open}
          />
          <NavItem
            to="/settings"
            label="Settings"
            icon={<HiOutlineCog6Tooth size={24} />}
            open={open}
          />
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-white/10">
          <button
            className={`flex items-center w-full p-3 rounded-xl transition-colors hover:bg-white/10 text-red-300 ${
              !open && "justify-center"
            }`}
          >
            <HiOutlineArrowLeftOnRectangle size={24} />
            {open && <span className="ml-3 font-medium text-sm">Logout</span>}
          </button>

          {open && (
            <div className="mt-4 text-center text-xs text-gray-400 pb-2">
              © 2025 Wisdora Inc.
            </div>
          )}
        </div>
      </aside>

      {/* --- Main Content --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header
          className="h-16 border-b flex items-center justify-between px-6 shadow-sm z-10"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          {/* Toggle Sidebar Button */}
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-lg transition-colors"
            style={{ color: "var(--color-text-sub)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--brand-primary)";
              e.currentTarget.style.backgroundColor = "var(--color-surface-alt)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--color-text-sub)";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <HiBars3 size={28} />
          </button>

          {/* Right side: theme toggle + user */}
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

            {/* User Info */}
            <div className="text-right hidden sm:block">
              <span
                className="block text-sm font-bold"
                style={{ color: "var(--color-text)" }}
              >
                {user?.fullName || "User"}
              </span>
              <span
                className="block text-xs"
                style={{ color: "var(--color-text-sub)" }}
              >
                {user?.userEmail}
              </span>
            </div>

            <Link
              to="/profile"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
              style={{
                backgroundColor: "rgba(30,58,138,0.1)",
                color: "var(--brand-primary)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--brand-accent)";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(30,58,138,0.1)";
                e.currentTarget.style.color = "var(--brand-primary)";
              }}
            >
              <HiOutlineUserCircle size={28} />
            </Link>
          </div>
        </header>

        {/* Page Content (Outlet) */}
        <main
          className="flex-1 p-6 overflow-y-auto scroll-smooth"
          style={{ backgroundColor: "var(--color-bg)" }}
        >
          <Outlet /> {/* <--- Pages render here */}
        </main>
      </div>
    </div>
  );
}

// --- Helper Component: NavItem ---
function NavItem({ to, label, icon, open }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        `flex items-center p-3 rounded-xl transition-all duration-300 group whitespace-nowrap ${
          isActive
            ? "bg-accent text-white shadow-accent/20"
            : "text-gray-300 hover:bg-white/10 hover:text-white"
        } ${!open && "justify-center"}`
      }
    >
      <span className="min-w-[24px]">{icon}</span>

      <span
        className={`ml-3 font-medium overflow-hidden transition-all duration-300 ${
          open ? "w-auto opacity-100" : "w-0 opacity-0 hidden"
        }`}
      >
        {label}
      </span>

      {/* Hover Tooltip (Only when sidebar is closed) */}
      {!open && (
        <div className="absolute left-16 z-50 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {label}
        </div>
      )}
    </NavLink>
  );
}
