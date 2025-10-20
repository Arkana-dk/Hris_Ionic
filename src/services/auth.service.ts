import httpService from "./http.service";
import {
  LoginRequest,
  LoginResponse,
  User,
  ApiResponse,
} from "../types/api.types";

class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await httpService.post<any>("/login", credentials);

      console.log("🔍 Raw Response:", response);

      // Handle different response formats
      let token: string;
      let user: User;

      // Format 1: { data: { token, user } }
      if (response.data) {
        token = response.data.token || response.data.access_token;
        user = response.data.user;
      }
      // Format 2: { token, user }
      else if (response.token && response.user) {
        token = response.token || response.access_token;
        user = response.user;
      }
      // Format 3: { access_token, user }
      else if (response.access_token) {
        token = response.access_token;
        user = response.user;
      } else {
        throw new Error("Invalid response format from server");
      }

      console.log("✅ Token:", token.substring(0, 20) + "...");
      console.log("✅ User:", user);

      // Store token and user in localStorage
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return { token, user };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await httpService.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage regardless of API response
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
    }
  }

  /**
   * Get current user info
   */
  async me(): Promise<User> {
    try {
      const response = await httpService.get<ApiResponse<User>>("/me");
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
