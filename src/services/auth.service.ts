import apiClient from "./api.config";
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
      const response = await apiClient.post<ApiResponse<LoginResponse>>(
        "/login",
        credentials
      );

      const { token, user } = response.data.data;

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
      await apiClient.post("/logout");
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
      const response = await apiClient.get<ApiResponse<User>>("/me");
      const user = response.data.data;

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
    const err = error as { response?: { data?: { message?: string } } };
    if (err.response) {
      const message = err.response.data?.message || "An error occurred";
      return new Error(message);
    }
    return new Error("Network error. Please check your connection.");
  }
}

export default new AuthService();
