import apiClient from "./api.client";
import hakunamataAPI from "./hakunamata.service";
import {
  LoginRequest,
  LoginResponse,
  User,
  ApiResponse,
} from "../types/api.types";

class AuthService {
  /**
   * Login user dengan Laravel Sanctum (hris-fix backend)
   * Response format: { access_token: string, token_type: "Bearer", user: User }
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      console.log("🔐 Login Request to hakunamatata.my.id:", credentials.email);

      // Use hakunamataAPI service for login
      const response = await hakunamataAPI.login(
        credentials.email,
        credentials.password
      );

      console.log("🔍 Raw Response from hakunamatata.my.id:", response);

      type AuthPayload = { access_token?: string; token?: string; user?: User };
      // Support both axios-style ({ data: {...} }) and fetch-style ({...}) payloads
      const payload: AuthPayload | undefined =
        (response as { data?: AuthPayload }).data ?? (response as AuthPayload);

      if (!payload) {
        throw new Error("Invalid response format from backend");
      }

      // Backend response format:
      // { access_token: "1|xyz...", token_type: "Bearer", user: {...} }
      const accessToken = payload.access_token || payload.token;
      const user = payload.user;

      if (!accessToken) {
        throw new Error("Missing token from backend");
      }

      if (!user) {
        throw new Error("Missing user data from backend");
      }

      console.log("✅ Login Success!");
      console.log("  Token:", accessToken.substring(0, 30) + "...");
      console.log("  User:", user.name, `(${user.email})`);

      // Store token and user in localStorage
      localStorage.setItem("auth_token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      return { token: accessToken, user };
    } catch (error) {
      console.error("❌ Login Failed:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Logout user (hakunamatata.my.id backend)
   * Requires _token in payload
   */
  async logout(): Promise<void> {
    try {
      console.log("🚪 Logout request to hakunamatata.my.id...");

      // Use hakunamataAPI service for logout
      await hakunamataAPI.logout();
      console.log("✅ Logout success from backend");
    } catch (error) {
      console.error("⚠️ Logout error (continuing anyway):", error);
    } finally {
      // Clear local storage regardless of API response
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      // Reset CSRF and _token
      apiClient.resetCsrf();
      console.log("🧹 Local auth data cleared");
    }
  }

  /**
   * Get current user info
   */
  async me(): Promise<User> {
    try {
      const response = await apiClient.get<ApiResponse<User>>("/me");
      const user = response.data;

      // Update user in localStorage
      localStorage.setItem("user", JSON.stringify(user));

      return user;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem("auth_token");
    return !!token;
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  }

  /**
   * Get auth token
   */
  getToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  /**
   * Handle API errors
   */
  private handleError(error: unknown): Error {
    console.error("🔴 AuthService Error:", error);

    const err = error as {
      response?: {
        data?: { message?: string; errors?: Record<string, string[]> };
        status?: number;
      };
      message?: string;
    };

    if (err.response) {
      const status = err.response.status;
      const message = err.response.data?.message || "An error occurred";
      const errors = err.response.data?.errors;

      console.error("Error Status:", status);
      console.error("Error Message:", message);
      if (errors) console.error("Validation Errors:", errors);

      return new Error(message);
    }

    const message =
      err.message || "Network error. Please check your connection.";
    console.error("Network Error:", message);

    return new Error(message);
  }
}

export default new AuthService();
