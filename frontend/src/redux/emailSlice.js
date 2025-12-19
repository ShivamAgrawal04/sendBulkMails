import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import Subemails from "../../../backend/models/subEmails";

const API_URL = "http://localhost:4000/api/email";

export const sendEmail = createAsyncThunk(
  "email/sendEmail",
  async (formData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;

      if (!token) {
        return rejectWithValue("No token found");
      }

      // 3. Axios Request with Headers
      const response = await axios.post(`${API_URL}/sendEmail`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      console.log(response.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching emails:", error);
      const message = error.response?.data?.message || "Failed to fetch emails";
      return rejectWithValue(message);
    }
  }
);

// --- THUNK: Get Sub Emails (Manual Token Method) ---
export const getSubEmails = createAsyncThunk(
  "email/getSubEmails",
  // 1. 'getState' ko destructure kiya taaki Redux store se value le sakein
  async (_, { rejectWithValue, getState }) => {
    try {
      // 2. Redux State se Token nikalo
      const token = getState().auth.token;

      // Agar token nahi hai toh request mat bhejo
      if (!token) {
        return rejectWithValue("No token found");
      }

      // 3. Axios Request with Headers
      const response = await axios.get(`${API_URL}/showsubEmails`, {
        headers: {
          Authorization: `Bearer ${token}`, // 🔥 Token manually yahan lagaya
        },
        withCredentials: true,
      });

      console.log(response.data.groups);
      return response.data.data.groups;
    } catch (error) {
      console.error("Error fetching emails:", error);
      const message = error.response?.data?.message || "Failed to fetch emails";
      return rejectWithValue(message);
    }
  }
);

export const addSubEmails = createAsyncThunk(
  "/email/addsubEmail",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;

      if (!token) {
        return rejectWithValue("No token found");
      }

      const response = await axios.post(
        `${API_URL}/addsubEmail`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // 🔥 Token manually yahan lagaya
          },
          withCredentials: true,
        }
      );
      console.log(response.data.groups);
      return response.data.data.groups;
    } catch (error) {
      console.error("Error fetching emails:", error);
      const message = error.response?.data?.message || "Failed to fetch emails";
      return rejectWithValue(message);
    }
  }
);

// --- INITIAL STATE ---
const initialState = {
  subEmails: [],
  isLoading: false,
  error: null,
};

// --- SLICE ---
const emailSlice = createSlice({
  name: "email",
  initialState,
  reducers: {
    // Optional: Agar emails clear karni ho logout par
    clearEmails: (state) => {
      state.subEmails = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSubEmails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSubEmails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subEmails = action.payload;
        console.log(action.payload);
      })
      .addCase(getSubEmails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // Optional: Error toast dikhana hai toh
        // toast.error(action.payload);
      });
  },
});

export const { clearEmails } = emailSlice.actions;
export default emailSlice.reducer;
