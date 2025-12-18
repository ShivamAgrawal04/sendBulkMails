import React from "react";
import Dashboard from "./pages/DashboardPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./pages/DashboardLayout";
import { Routes, Route } from "react-router-dom";
import EmailsPage from "./pages/EmailsPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import SendMailPage from "./pages/SendMailPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useDispatch, useSelector } from "react-redux";
import { refreshAccessToken } from "./redux/authSlice";
import { useEffect } from "react";

const App = () => {
  const dispatch = useDispatch();

  // State se 'isCheckingAuth' nikalo
  const { isCheckingAuth } = useSelector((state) => state.auth);

  useEffect(() => {
    // App load hote hi check karo
    dispatch(refreshAccessToken());
  }, [dispatch]);

  // --- 🔥 MAIN FIX: GLOBAL LOADER ---
  // Jab tak backend check kar raha hai, Routes render hi mat karo.
  // Isse AuthLayout galti se redirect nahi karega.
  if (isCheckingAuth) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        {/* Yahan apna Spinner/Logo lagao */}
        <h1 className="text-xl font-bold animate-pulse">
          Loading Blue Dimension...
        </h1>
      </div>
    );
  }

  return (
    <Routes>
      {/* Layout wraps all pages */}

      <Route element={<ProtectedRoute authentication={false} />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute authentication={true} />}>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="emails" element={<EmailsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/sendMail" element={<SendMailPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
