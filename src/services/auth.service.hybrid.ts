/**
 * Hybrid Auth Service
 * - Automatically detects if real API is available
 * - Falls back to mock if API fails
 * - Easy switching between modes
 */

import authServiceReal from "./auth.service";
import authServiceMock from "./auth.service.mock";
import { LoginRequest, LoginResponse, User } from "../types/api.types";

// Configuration
const USE_REAL_API = import.meta.env.VITE_USE_REAL_API === "true";

class HybridAuthService {
  private useRealAPI: boolean = USE_REAL_API;

  /**
   * Login with automatic fallback
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    if (this.useRealAPI) {
      try {
        console.log("🔄 Attempting real API login...");
        const result = await authServiceReal.login(credentials);
        console.log("✅ Real API login success!");
        return result;
      } catch (error) {
        console.warn("⚠️ Real API failed, falling back to mock...", error);
        const result = await authServiceMock.login(credentials);
        console.log("✅ Mock login success!");
        return result;
      }
    } else {
      console.log("🔄 Using mock API (configured)...");
      return await authServiceMock.login(credentials);
    }
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    if (this.useRealAPI) {
      try {
        await authServiceReal.logout();
      } catch (error) {
        console.warn("⚠️ Real API logout failed, using local logout", error);
        await authServiceMock.logout();
      }
    } else {
      await authServiceMock.logout();
    }
  }

  /**
   * Get current user info
   */
  async me(): Promise<User> {
    if (this.useRealAPI) {
      try {
        return await authServiceReal.me();
      } catch (error) {
        console.warn("⚠️ Real API /me failed, using mock", error);
        return await authServiceMock.me();
      }
    } else {
      return await authServiceMock.me();
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return authServiceReal.isAuthenticated();
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): User | null {
    return authServiceReal.getCurrentUser();
  }

  /**
   * Get auth token
   */
  getToken(): string | null {
    return authServiceReal.getToken();
  }

  /**
   * Switch between real and mock API
   */
  setMode(useRealAPI: boolean): void {
    this.useRealAPI = useRealAPI;
    console.log(
      `🔄 Auth mode switched to: ${useRealAPI ? "REAL API" : "MOCK"}`
    );
  }

  /**
   * Get current mode
   */
  getMode(): "real" | "mock" {
    return this.useRealAPI ? "real" : "mock";
  }
}

export default new HybridAuthService();
