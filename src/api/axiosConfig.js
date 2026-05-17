import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "https://staycation-server-v1-1.onrender.com";

const axiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Redirect to login on unauthorized responses (cookie expired / invalid)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
