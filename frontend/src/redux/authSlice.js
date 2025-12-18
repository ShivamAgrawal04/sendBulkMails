import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:4000/api/auth";

// --- 1. HELPER: Load User Safely from LocalStorage ---
const loadUserFromStorage = () => {
  try {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    // Agar token ya user data corrupted/missing hai, toh null return karo
    if (!token || !userStr || userStr === "undefined") {
      return null;
    }
    return JSON.parse(userStr);
  } catch (e) {
    return null;
  }
};

// --- 2. THUNK: Login User ---
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, userData, {
        withCredentials: true,
      });
      // Backend return kar raha hai: { userExist, accessToken }
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      return rejectWithValue(message);
    }
  }
);

// --- 3. THUNK: Refresh Access Token ---
export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (_, { rejectWithValue }) => {
    try {
      // Backend check karega Cookie. Agar valid hai toh naya Token + User dega.
      const response = await axios.post(
        `${API_URL}/refresh`,
        {},
        { withCredentials: true }
      );

      // Debugging ke liye: Check karo user aa raha hai ya nahi
      // console.log("Refresh Success:", response.data.data);

      // Return structure: { accessToken, user }
      return response.data.data;
    } catch (error) {
      // Agar cookie expire hai ya invalid hai
      return rejectWithValue("Session expired");
    }
  }
);

export const updateUser = createAsyncThunk(
  "auth/updateUser",
  // 1. Yahan 'getState' destructure karna zaroori hai
  async (userData, { rejectWithValue, getState }) => {
    try {
      // 2. Redux State se Token nikalo (Varna 'token is undefined' ka error aayega)
      const token = getState().auth.token;

      // Agar token nahi hai to request mat bhejo
      if (!token) return rejectWithValue("No token found");

      const response = await axios.post(
        `${API_URL}/update`, // Route /update-account bhi ho sakta hai, check karlena
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Ab yeh variable defined hai
          },
          withCredentials: true,
        }
      );

      console.log("Update Response:", response.data.data);
      return response.data.data;
    } catch (error) {
      // 3. YEH HAI MAIN FIX DEBUGGING KE LIYE
      // Asli error console mein dekhne ke liye yeh line zaroori hai:
      console.error("Error in updateUser Thunk:", error);

      // Backend ka specific error msg nikaalo
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      return rejectWithValue(errorMessage);
    }
  }
);

// --- 4. INITIAL STATE ---
const initialState = {
  user: loadUserFromStorage(),
  token: localStorage.getItem("token") || null,
  isLoading: false,

  // 🔥 IMPORTANT: Yeh TRUE hona chahiye taaki App load hote waqt
  // Global Loader dikhe aur Router redirect na kare.
  isCheckingAuth: true,
  error: null,
};

// --- 5. SLICE ---
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Manual Logout
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isCheckingAuth = false;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      toast.success("Logged out successfully");
    },
  },
  extraReducers: (builder) => {
    builder
      // ================= LOGIN HANDLERS =================
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.userExist;
        state.token = action.payload.accessToken;
        state.isCheckingAuth = false;

        localStorage.setItem("user", JSON.stringify(action.payload.userExist));
        localStorage.setItem("token", action.payload.accessToken);
        toast.success("Login Successful!");
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // ================= REFRESH TOKEN HANDLERS (The Fix) =================
      .addCase(refreshAccessToken.pending, (state) => {
        // App reload hone par yeh true hi rahega
        state.isCheckingAuth = true;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.isCheckingAuth = false; // Loader Stop
        state.token = action.payload.accessToken;

        // 🔥 MAIN FIX: User Recovery Logic
        // Agar LocalStorage khali tha, toh Backend se jo user aaya hai usse set karo.
        if (action.payload.user) {
          state.user = action.payload.user;
          localStorage.setItem("user", JSON.stringify(action.payload.user));
        }

        localStorage.setItem("token", action.payload.accessToken);
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.isCheckingAuth = false; // Loader Stop

        // Agar refresh fail hua (invalid cookie), toh user ko logout karo
        state.user = null;
        state.token = null;
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.emailAccounts;
        toast.success("Updation Successful!");
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
