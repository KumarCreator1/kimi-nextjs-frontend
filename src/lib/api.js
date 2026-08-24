import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

// Create an axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Crucial for sending and receiving HttpOnly cookies (accessToken, refreshToken)
  withCredentials: true,
});

// Add a response interceptor to normalize error handling
api.interceptors.response.use(
  (response) => response.data, // Simplify access to response.data
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject(new Error(message));
  },
);

// API endpoints grouped by feature
export const authApi = {
  login: (credentials) => api.post("/user/login", credentials),

  register: (userData) => api.post("/user/register", userData),

  logout: () => api.post("/user/logout"),

  getCurrentUser: () => api.get("/user/me"),
};
