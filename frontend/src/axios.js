import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, // for HttpOnly cookie
});

export const useAuthHandler = () => {
  const [accessToken, setAccessToken] = useState(null);
  const navigate = useNavigate();

  // Page load / refresh
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await api.post("/auth/refresh"); // try to get new access token
        setAccessToken(res.data.accessToken);
      } catch (err) {
        // Refresh token missing or invalid → logout
        setAccessToken(null);
        navigate("/login");
      }
    };
    restoreSession();
  }, []);

  // Axios interceptor for API calls
  api.interceptors.request.use(
    (config) => {
      if (accessToken)
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        try {
          const res = await api.post("/auth/refresh"); // try refresh
          setAccessToken(res.data.accessToken);
          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${res.data.accessToken}`;
          return api(originalRequest); // retry original request
        } catch {
          setAccessToken(null);
          navigate("/login"); // redirect to login if refresh fails
        }
      }
      return Promise.reject(error);
    }
  );

  const logout = async () => {
    try {
      await api.post("/auth/logout"); // clear cookie on backend
    } catch (err) {
      console.log("Logout error:", err);
    } finally {
      setAccessToken(null);
      navigate("/login");
    }
  };

  return { accessToken, logout, api };
};
