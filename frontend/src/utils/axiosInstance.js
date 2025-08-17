// src/utils/axiosInstance.js
import axios from "axios";
import { logout } from "../Redux/auth/AuthSlice";
import store from "../Redux/store"; // wherever your store is


const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add interceptor to check for expired/invalid token
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      store.dispatch(logout());
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Optional: Show a toast or redirect user
    
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
