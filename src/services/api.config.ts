import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

// ========================================
// 🔧 LOCALHOST DEVELOPMENT MODE
// ========================================
// Backend Laravel Local: http://localhost:8000
// Repository: https://github.com/Arkana-dk/hris-fix
// REMOTE API (hakunamatata.my.id) DISABLED

// API Base URL - LOCAL DEVELOPMENT
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

console.log("🏠 API Configuration:");
console.log("  Mode: LOCAL DEVELOPMENT");
console.log("  Base URL:", API_BASE_URL);
console.log("  Remote API: DISABLED");

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // CORS settings for localhost
  withCredentials: false, // Set to true if using Sanctum cookies
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const fullUrl = (config.baseURL || "") + (config.url || "");
    console.log("🔄 API Request:", config.method?.toUpperCase(), fullUrl);

    const token = localStorage.getItem("auth_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔑 Token attached:", token.substring(0, 20) + "...");
    }
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => {
    console.log(
      "✅ API Response:",
      response.status,
      response.config.url,
      "\nData:",
      JSON.stringify(response.data).substring(0, 200)
    );
    return response;
  },
  async (error) => {
    const url = error.config?.url || "unknown";
    console.error("❌ API Error:", error.message, "URL:", url);

    if (error.response) {
      console.error("Response Status:", error.response.status);
      console.error(
        "Response Data:",
        JSON.stringify(error.response.data).substring(0, 300)
      );

      if (error.response.status === 401) {
        // Token expired or invalid - redirect to login
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    } else if (error.request) {
      console.error("No Response Received - Network Error");
      console.error("Request:", error.request);
    } else {
      console.error("Request Setup Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
