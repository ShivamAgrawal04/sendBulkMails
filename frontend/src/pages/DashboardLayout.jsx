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
} from "react-icons/hi2";
import { BiMailSend } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";

export default function DashboardLayout() {
  const [open, setOpen] = useState(true);

  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen flex bg-background font-sans text-text-main">
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
        <header className="h-16 bg-white border-b border-border-custom flex items-center justify-between px-6 shadow-sm z-10">
          {/* Toggle Button */}
          <button
            onClick={() => setOpen(!open)}
            className="text-text-sub hover:text-primary transition-colors p-2 rounded-lg hover:bg-gray-100"
          >
            <HiBars3 size={28} />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <span className="block text-sm font-bold text-text-main">
                {user?.fullName || "User"}
              </span>
              <span className="block text-xs text-text-sub">
                {user?.userEmail}
              </span>
            </div>

            <Link
              to="/profile"
              className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-accent hover:text-white transition-all duration-300"
            >
              <HiOutlineUserCircle size={28} />
            </Link>
          </div>
        </header>

        {/* Page Content (Outlet) */}
        <main className="flex-1 p-6 overflow-y-auto bg-background/50 scroll-smooth">
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
      // "end" ensures the Dashboard link isn't active when on /settings
      end={to === "/"}
      className={({ isActive }) =>
        `flex items-center p-3 rounded-xl transition-all duration-300 group whitespace-nowrap ${
          isActive
            ? "bg-accent text-white shadow-accent/20" // Active State
            : "text-gray-300 hover:bg-white/10 hover:text-white" // Inactive State
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
