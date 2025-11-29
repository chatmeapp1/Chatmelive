import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getEnvVars from "./env";

// ================================
// 🔗 BASE URL BACKEND REPLIT  
// ================================
const { API_URL } = getEnvVars();
const API_BASE_URL = `${API_URL}/api`;

// ================================
// 🔧 AXIOS INSTANCE  
// ================================
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ================================
// 🔐 INTERCEPTOR TO ADD TOKEN  
// ================================
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("userToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ================================
// 🔥 FULL AUTH API  
// ================================
export const authAPI = {
  // =============================
  // REGISTER (DAFTAR)
  // =============================
  register: async (phone, password, name) => {
    try {
      const res = await api.post("/register", {
        phone,
        password,
        name,
      });

      return res.data;
    } catch (err) {
      throw err.response?.data || { success: false, message: "Network error" };
    }
  },

  // =============================
  // LOGIN  
  // =============================
  login: async (phone, password) => {
    try {
      const res = await api.post("/login", {
        phone,
        password,
      });

      if (res.data.success && res.data.token) {
        await AsyncStorage.setItem("userToken", res.data.token);
        await AsyncStorage.setItem("userData", JSON.stringify(res.data.user));
      }

      return res.data;
    } catch (err) {
      throw err.response?.data || { success: false, message: "Network error" };
    }
  },

  // =============================
  // FIX ERROR: THIS IS REQUIRED  
  // banyak file di project memanggil authAPI.get()
  // =============================
  get: async () => {
    try {
      const res = await api.get("/auth/profile");
      return res.data;
    } catch (err) {
      throw err.response?.data || { success: false, message: "Network error" };
    }
  },

  // =============================
  // GET PROFILE  
  // (biasanya dipakai di Profile & HomeScreen)
  // =============================
  getProfile: async () => {
    try {
      const response = await api.get("/auth/profile");
      return response.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },

  async updateProfile(data) {
    try {
      const response = await api.put("/auth/profile/update", data);
      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  // =============================
  // LOGOUT  
  // =============================
  logout: async () => {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userData");
  },
};

// DEFAULT EXPORT
export default api;