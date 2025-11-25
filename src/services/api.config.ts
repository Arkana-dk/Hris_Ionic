import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

// ========================================
// � HRIS-FIX BACKEND INTEGRATION
// ========================================
// Backend Repository: https://github.com/Arkana-dk/hris-fix
// API Endpoints: 34 routes tersedia
// Authentication: Laravel Sanctum (Bearer Token)

// API Base URL - hakunamatata.my.id
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://hakunamatata.my.id/api";

export const WEB_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://hakunamatata.my.id";

// API Endpoints sesuai dengan hris-fix backend
export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/login",
  LOGOUT: "/logout",
  ME: "/me",

  // Employee Dashboard
  DASHBOARD: "/employee/dashboard",

  // Profile
  PROFILE: "/employee/profile",
  PROFILE_UPDATE: "/employee/profile",
  PROFILE_AVATAR: "/employee/profile/avatar",

  // Attendance (Clock In/Out)
  ATTENDANCE: "/employee/attendance",
  ATTENDANCE_HISTORY: "/employee/attendance/history",
  ATTENDANCE_STATISTICS: "/employee/attendance/statistics",

  // Leave Requests
  LEAVE_REQUESTS: "/employee/leave-requests",
  LEAVE_HISTORY: "/employee/history/leaves",

  // Overtime Requests
  OVERTIME_REQUESTS: "/employee/overtime-requests",
  OVERTIME_HISTORY: "/employee/history/overtimes",

  // Payslip
  PAYSLIP: "/employee/payslip",
  PAYSLIP_DETAIL: (id: number) => `/employee/payslip/${id}`,
  PAYSLIP_PDF: (id: number) => `/employee/payslip/${id}/pdf`,

  // Calendar
  CALENDAR_EVENTS: "/employee/calendar/events",
  CALENDAR_EVENT_DETAIL: (id: number) => `/employee/calendar/events/${id}`,

  // Documents
  DOCUMENTS: "/employee/documents",
  DOCUMENT_DETAIL: (id: number) => `/employee/documents/${id}`,
  DOCUMENT_DOWNLOAD: (id: number) => `/employee/documents/${id}/download`,
  DOCUMENT_UPLOAD: "/employee/documents/upload",
} as const;

console.log("🔗 HRIS-Fix Backend Integration:");
console.log("  Repository: https://github.com/Arkana-dk/hris-fix");
console.log("  Base URL:", API_BASE_URL);
console.log("  Total Endpoints: 34 routes available");

// Create axios instance untuk hakunamatata.my.id
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true, // Important for CSRF cookies
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
