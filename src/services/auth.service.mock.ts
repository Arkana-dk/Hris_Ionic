import { LoginRequest, LoginResponse, User } from "../types/api.types";

/**
 * Mock Auth Service - untuk development tanpa backend
 * Ganti dengan auth.service.ts yang real ketika backend sudah siap
 */
class AuthServiceMock {
  // Simulate API delay
  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // In-memory mock users database
  private USERS: Array<{ email: string; password: string; user: User }> = [
    {
      email: "admin@example.com",
      password: "password",
      user: {
        id: 1,
        employee_id: "EMP-2024-BS-001",
        name: "ILHAM HIDAYATULLAH",
        email: "admin@example.com",
        phone: "+62 812-3456-7890",
        position: "QQ FINFEEL CLEANING SERVICE OFFICER",
        department: "Facility Management",
        company: "Bridgestone Karawang",
        join_date: "2024-01-15",
        avatar: undefined,
      },
    },
    {
      email: "dika@gmail.com",
      password: "dika123",
      user: {
        id: 2,
        employee_id: "EMP-2025-BS-007",
        name: "Dika Pratama",
        email: "dika@gmail.com",
        phone: "+62 813-5555-7777",
        position: "HR Staff",
        department: "Human Resources",
        company: "Bridgestone Karawang",
        join_date: "2025-01-10",
        avatar: undefined,
      },
    },
  ];

  /**
   * Mock Login - simulasi login berhasil
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Simulate API delay
    await this.delay(1000);

    // Find user by email/password
    const found = this.USERS.find(
      (u) =>
        u.email === credentials.email && u.password === credentials.password
    );

    if (found) {
      const mockResponse: LoginResponse = {
        token:
          "mock_token_" +
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15),
        user: found.user,
      };

      // Store token and user in localStorage
      localStorage.setItem("auth_token", mockResponse.token);
      localStorage.setItem("user", JSON.stringify(mockResponse.user));

      console.log("✅ Mock login successful:", mockResponse);
      return mockResponse;
    }

    // Mock failed response
    await this.delay(500);
    throw new Error("Email atau password salah");
  }

  /**
   * Mock Logout
   */
  async logout(): Promise<void> {
    await this.delay(300);

    // Clear local storage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");

    console.log("✅ Mock logout successful");
  }

  /**
   * Mock Get Current User
   */
  async me(): Promise<User> {
    await this.delay(500);

    const userStr = localStorage.getItem("user");
    if (!userStr) {
      throw new Error("Unauthorized");
    }

    return JSON.parse(userStr) as User;
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
}

export default new AuthServiceMock();
