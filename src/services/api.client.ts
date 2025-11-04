/**
 * API Client dengan Support untuk Laravel Sanctum
 * Menangani CSRF Cookie, Token Management, dan Error Handling
 */

import { Capacitor } from "@capacitor/core";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://hakunamatata.my.id";
const API_URL =
  import.meta.env.VITE_API_URL || "https://hakunamatata.my.id/api";
const CSRF_COOKIE_URL =
  import.meta.env.VITE_SANCTUM_CSRF_COOKIE_URL ||
  `${API_BASE_URL}/sanctum/csrf-cookie`;
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || "30000");
const DEBUG_MODE = import.meta.env.VITE_DEBUG_MODE === "true";

interface RequestOptions {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  data?: unknown;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  requireAuth?: boolean;
  skipCsrf?: boolean;
}

interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

class ApiClient {
  private isNative = Capacitor.isNativePlatform();
  private csrfToken: string | null = null;
  private csrfFetched = false;

  constructor() {
    if (DEBUG_MODE) {
      console.log("🚀 API Client Initialized");
      console.log("📱 Platform:", this.isNative ? "Native (Mobile)" : "Web");
      console.log("🌐 API Base URL:", API_BASE_URL);
      console.log("🔗 API URL:", API_URL);
    }
  }

  /**
   * Get CSRF Token from Laravel Sanctum
   * Required for SPA authentication
   */
  private async getCsrfToken(): Promise<void> {
    if (this.csrfFetched || this.isNative) {
      return; // Skip untuk native app (tidak perlu CSRF)
    }

    try {
      if (DEBUG_MODE) {
        console.log("🔐 Fetching CSRF Token...");
      }

      const response = await fetch(CSRF_COOKIE_URL, {
        method: "GET",
        credentials: "include", // Important for cookies
      });

      if (response.ok) {
        // Extract CSRF token from cookie (Laravel sets it in XSRF-TOKEN)
        const cookies = document.cookie.split(";");
        for (const cookie of cookies) {
          const [name, value] = cookie.trim().split("=");
          if (name === "XSRF-TOKEN") {
            this.csrfToken = decodeURIComponent(value);
            break;
          }
        }

        this.csrfFetched = true;

        if (DEBUG_MODE) {
          console.log("✅ CSRF Token fetched:", this.csrfToken ? "Yes" : "No");
        }
      }
    } catch (error) {
      console.warn("⚠️ Failed to fetch CSRF token:", error);
      // Continue anyway - token-based auth might work without CSRF
    }
  }

  /**
   * Make HTTP Request
   */
  async request<T = unknown>(options: RequestOptions): Promise<T> {
    // Get CSRF token if needed (only for web SPA)
    if (!options.skipCsrf && !this.isNative) {
      await this.getCsrfToken();
    }

    const fullUrl = options.url.startsWith("http")
      ? options.url
      : API_URL + options.url;

    // Prepare headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    };

    // Add CSRF token for web SPA
    if (!this.isNative && this.csrfToken) {
      headers["X-XSRF-TOKEN"] = this.csrfToken;
    }

    // Add auth token
    const token = localStorage.getItem("auth_token");
    if (token && options.requireAuth !== false) {
      headers.Authorization = `Bearer ${token}`;
    }

    if (DEBUG_MODE) {
      console.log(`🔄 ${options.method} Request:`, fullUrl);
      console.log("📱 Platform:", this.isNative ? "Native" : "Web");
      if (token) console.log("🔑 Token:", token.substring(0, 20) + "...");
      if (this.csrfToken && !this.isNative) {
        console.log("🔐 CSRF Token:", this.csrfToken.substring(0, 20) + "...");
      }
    }

    try {
      return await this.executeRequest<T>(options, fullUrl, headers);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Execute HTTP Request (with retry mechanism)
   */
  private async executeRequest<T>(
    options: RequestOptions,
    url: string,
    headers: Record<string, string>,
    attempt: number = 1
  ): Promise<T> {
    const maxAttempts = parseInt(
      import.meta.env.VITE_API_RETRY_ATTEMPTS || "3"
    );

    try {
      // Use XMLHttpRequest for native (more reliable)
      if (this.isNative) {
        return await this.xhrRequest<T>(options, url, headers);
      }
      // Use Fetch for web
      return await this.fetchRequest<T>(options, url, headers);
    } catch (error) {
      // Retry on network errors (not on 4xx/5xx)
      if (attempt < maxAttempts && this.isRetryableError(error)) {
        if (DEBUG_MODE) {
          console.log(`🔄 Retrying request (${attempt}/${maxAttempts})...`);
        }
        await this.delay(1000 * attempt); // Exponential backoff
        return this.executeRequest<T>(options, url, headers, attempt + 1);
      }

      throw error;
    }
  }

  /**
   * XMLHttpRequest implementation (for native apps)
   */
  private async xhrRequest<T>(
    options: RequestOptions,
    url: string,
    headers: Record<string, string>
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Build URL with query params
      let finalUrl = url;
      if (options.params) {
        const searchParams = new URLSearchParams();
        Object.entries(options.params).forEach(([key, value]) => {
          searchParams.append(key, String(value));
        });
        finalUrl = `${url}?${searchParams.toString()}`;
      }

      xhr.open(options.method, finalUrl, true);

      // Set headers
      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key]);
      });

      xhr.onload = () => {
        if (DEBUG_MODE) {
          console.log("✅ XHR Response:", xhr.status, xhr.statusText);
        }

        try {
          const data = JSON.parse(xhr.responseText);

          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(data as T);
          } else {
            reject({
              response: {
                status: xhr.status,
                data: data,
              },
              message: data?.message || xhr.statusText,
            });
          }
        } catch {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(xhr.responseText as unknown as T);
          } else {
            reject({
              response: {
                status: xhr.status,
                data: xhr.responseText,
              },
              message: xhr.statusText,
            });
          }
        }
      };

      xhr.onerror = () => {
        reject({
          message: "Network error. Please check your internet connection.",
          isNetworkError: true,
        });
      };

      xhr.ontimeout = () => {
        reject({
          message: "Request timeout. Please try again.",
          isTimeout: true,
        });
      };

      xhr.timeout = API_TIMEOUT;

      // Send request
      if (options.data && ["POST", "PUT", "PATCH"].includes(options.method)) {
        xhr.send(JSON.stringify(options.data));
      } else {
        xhr.send();
      }
    });
  }

  /**
   * Fetch API implementation (for web)
   */
  private async fetchRequest<T>(
    options: RequestOptions,
    url: string,
    headers: Record<string, string>
  ): Promise<T> {
    // Build URL with query params
    let finalUrl = url;
    if (options.params) {
      const searchParams = new URLSearchParams();
      Object.entries(options.params).forEach(([key, value]) => {
        searchParams.append(key, String(value));
      });
      finalUrl = `${url}?${searchParams.toString()}`;
    }

    const fetchOptions: RequestInit = {
      method: options.method,
      headers,
      credentials: "include", // Important for cookies (Sanctum)
    };

    // Add body for POST, PUT, PATCH
    if (options.data && ["POST", "PUT", "PATCH"].includes(options.method)) {
      fetchOptions.body = JSON.stringify(options.data);
    }

    // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    fetchOptions.signal = controller.signal;

    try {
      const response = await fetch(finalUrl, fetchOptions);
      clearTimeout(timeoutId);

      if (DEBUG_MODE) {
        console.log("✅ Fetch Response:", response.status, response.statusText);
      }

      // Parse response
      const responseText = await response.text();
      let data: unknown;

      try {
        data = JSON.parse(responseText);
      } catch {
        data = responseText;
      }

      if (DEBUG_MODE) {
        console.log("📦 Data:", JSON.stringify(data).substring(0, 200));
      }

      if (response.ok) {
        return data as T;
      } else {
        const errorData = data as { message?: string };
        throw {
          response: {
            status: response.status,
            data: data,
          },
          message: errorData?.message || response.statusText,
        };
      }
    } catch (error) {
      clearTimeout(timeoutId);

      const err = error as { name?: string };
      if (err.name === "AbortError") {
        throw {
          message: "Request timeout. Please try again.",
          isTimeout: true,
        };
      }

      throw error;
    }
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(error: unknown): boolean {
    const err = error as {
      isNetworkError?: boolean;
      isTimeout?: boolean;
      response?: unknown;
    };
    // Retry on network errors or timeouts (not on 4xx/5xx)
    return err.isNetworkError || err.isTimeout || !err.response;
  }

  /**
   * Delay helper for retry
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Handle API errors
   */
  private handleError(error: unknown): ApiError {
    if (DEBUG_MODE) {
      console.error("❌ API Error:", error);
    }

    const err = error as {
      response?: {
        status?: number;
        data?: { message?: string; errors?: Record<string, string[]> };
      };
      message?: string;
    };

    if (err.response) {
      const status = err.response.status;
      const data = err.response.data;
      const message = data?.message || "An error occurred";
      const errors = data?.errors;

      if (DEBUG_MODE) {
        console.error("Error Status:", status);
        console.error("Error Message:", message);
        if (errors) console.error("Validation Errors:", errors);
      }

      // Handle 401 - Unauthorized
      if (status === 401) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");

        // Redirect to login (with delay to avoid race conditions)
        setTimeout(() => {
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }, 100);
      }

      return {
        message,
        status,
        errors,
      };
    }

    const message =
      err.message || "Network error. Please check your connection.";
    return { message };
  }

  /**
   * Shorthand methods
   */
  async get<T = unknown>(
    url: string,
    params?: Record<string, string | number | boolean>
  ): Promise<T> {
    return this.request<T>({ method: "GET", url, params });
  }

  async post<T = unknown>(url: string, data?: unknown): Promise<T> {
    return this.request<T>({ method: "POST", url, data });
  }

  async put<T = unknown>(url: string, data?: unknown): Promise<T> {
    return this.request<T>({ method: "PUT", url, data });
  }

  async delete<T = unknown>(url: string): Promise<T> {
    return this.request<T>({ method: "DELETE", url });
  }

  async patch<T = unknown>(url: string, data?: unknown): Promise<T> {
    return this.request<T>({ method: "PATCH", url, data });
  }

  /**
   * Reset CSRF token (useful after logout)
   */
  resetCsrf(): void {
    this.csrfToken = null;
    this.csrfFetched = false;
  }
}

export default new ApiClient();
