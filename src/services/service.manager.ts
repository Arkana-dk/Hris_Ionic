/**
 * Service Manager
 * Centralized API service management dengan auto-import semua service
 */

import apiClient from "./api.client";
import authService from "./auth.service";
import attendanceService from "./attendance.service";
import { dashboardService } from "./dashboard.service";
import profileService from "./profile.service";
import payslipService from "./payslip.service";
import overtimeService from "./overtime.service";
import leaveService from "./leave.service";
import documentService from "./document.service";
import ApiErrorHandler from "../utils/api.error.handler";

/**
 * Service Manager Class
 * Provides centralized access to all API services
 */
class ServiceManager {
  // API Client
  readonly api = apiClient;

  // Feature Services
  readonly auth = authService;
  readonly attendance = attendanceService;
  readonly dashboard = dashboardService;
  readonly profile = profileService;
  readonly payslip = payslipService;
  readonly overtime = overtimeService;
  readonly leave = leaveService;
  readonly document = documentService;

  // Backend status
  private backendAvailable = true;

  /**
   * Initialize all services
   * Called on app startup
   */
  async initialize(): Promise<void> {
    console.log("🚀 Initializing Service Manager...");

    try {
      // Check backend health first
      const isHealthy = await this.checkHealth();
      this.backendAvailable = isHealthy;

      if (!isHealthy) {
        console.warn(
          "⚠️ Backend is not available. App will use fallback/mock data."
        );
        return;
      }

      // Check if user is authenticated
      const isAuth = this.auth.isAuthenticated();

      if (isAuth) {
        console.log("✅ User is authenticated");

        // Try to refresh user data
        try {
          await this.auth.me();
          console.log("✅ User data refreshed");
        } catch (error) {
          ApiErrorHandler.log(error, "User data refresh");
          const errorInfo = ApiErrorHandler.analyze(error);

          if (errorInfo.type === "unauthorized") {
            console.warn("⚠️ Token invalid, logging out...");
            this.auth.logout();
          }
        }
      } else {
        console.log("ℹ️ User is not authenticated");
      }

      console.log("✅ Service Manager initialized successfully");
    } catch (error) {
      ApiErrorHandler.log(error, "Service Manager initialization");
      console.error("❌ Failed to initialize Service Manager");
      // Don't throw - let app continue with limited functionality
    }
  }

  /**
   * Clear all cached data
   * Useful on logout or when user wants to refresh everything
   */
  clearCache(): void {
    console.log("🧹 Clearing all cached data...");

    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    this.api.resetCsrf();

    console.log("✅ Cache cleared");
  }

  /**
   * Check API health
   * Useful for debugging connection issues
   */
  async checkHealth(): Promise<boolean> {
    try {
      console.log("🏥 Checking API health...");

      // Try to make a simple request to check if backend is up
      // Using /api/health or any lightweight endpoint
      await this.api.get("/health").catch(() => {
        // If /health doesn't exist, try another endpoint
        return this.api.get("/");
      });

      console.log("✅ API is healthy");
      this.backendAvailable = true;
      return true;
    } catch (error) {
      const errorInfo = ApiErrorHandler.analyze(error);

      if (errorInfo.type === "network") {
        console.error("❌ Cannot connect to backend");
        console.error(
          "   Make sure backend server is running at:",
          import.meta.env.VITE_API_BASE_URL
        );
      } else {
        console.warn("⚠️ Backend health check failed, but might be available");
      }

      this.backendAvailable = false;
      return false;
    }
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      isAuthenticated: this.auth.isAuthenticated(),
      user: this.auth.getCurrentUser(),
      token: this.auth.getToken() ? "Present" : "None",
      platform: apiClient["isNative"] ? "Native" : "Web",
      backendAvailable: this.backendAvailable,
    };
  }

  /**
   * Check if backend is available
   */
  isBackendAvailable(): boolean {
    return this.backendAvailable;
  }
} // Export singleton instance
export default new ServiceManager();
