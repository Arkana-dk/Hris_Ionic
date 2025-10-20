/* eslint-disable @typescript-eslint/no-explicit-any */
import { Capacitor } from "@capacitor/core";

/**
 * HTTP Service that works on both web and native platforms
 * Uses Fetch API (works everywhere)
 */

export const API_BASE_URL = "https://hakunamatata.my.id/api";

interface RequestOptions {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  data?: any;
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

class HttpService {
  private isNative = Capacitor.isNativePlatform();

  /**
   * Make HTTP request (works on web and native)
   */
  async request<T = any>(options: RequestOptions): Promise<T> {
    const fullUrl = options.url.startsWith("http")
      ? options.url
      : API_BASE_URL + options.url;

    // Get auth token
    const token = localStorage.getItem("auth_token");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    console.log(`🔄 ${options.method} Request:`, fullUrl);
    console.log("📱 Platform:", this.isNative ? "Native (Android/iOS)" : "Web");
    if (token) console.log("🔑 Token:", token.substring(0, 20) + "...");

    try {
      // For native platforms, use XMLHttpRequest (more reliable)
      if (this.isNative) {
        console.log("📱 Using XMLHttpRequest (Native - More Reliable)");
        return await this.xhrRequest<T>(options, fullUrl, headers);
      } else {
        // For web, use Fetch API
        console.log("🌐 Using Fetch API (Web)");
        return await this.fetchRequest<T>(options, fullUrl, headers);
      }
    } catch (error: any) {
      console.error("❌ HTTP Error:", error);
      throw this.handleError(error);
    }
  }

  /**
   * XMLHttpRequest for native platforms (more reliable than fetch)
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
        const searchParams = new URLSearchParams(options.params);
        finalUrl = `${url}?${searchParams.toString()}`;
      }

      xhr.open(options.method, finalUrl, true);

      // Set headers
      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key]);
      });

      xhr.onload = () => {
        console.log("✅ XHR Response:", xhr.status, xhr.statusText);

        try {
          const data = JSON.parse(xhr.responseText);
          console.log("📦 Data:", JSON.stringify(data).substring(0, 200));

          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(data as T);
          } else {
            reject({
              response: {
                status: xhr.status,
                data: data,
              },
              message: `HTTP ${xhr.status}: ${data?.message || xhr.statusText}`,
            });
          }
        } catch {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(xhr.responseText as any);
          } else {
            reject({
              response: {
                status: xhr.status,
                data: xhr.responseText,
              },
              message: `HTTP ${xhr.status}: ${xhr.statusText}`,
            });
          }
        }
      };

      xhr.onerror = () => {
        console.error("❌ XHR Error:", xhr.statusText);
        reject({
          message: "Network request failed. Please check your internet connection.",
        });
      };

      xhr.ontimeout = () => {
        console.error("❌ XHR Timeout");
        reject({
          message: "Request timeout. Please try again.",
        });
      };

      // Set timeout (30 seconds)
      xhr.timeout = 30000;

      // Send request
      if (options.data && ["POST", "PUT", "PATCH"].includes(options.method)) {
        xhr.send(JSON.stringify(options.data));
      } else {
        xhr.send();
      }
    });
  }

  /**
   * Universal HTTP request using Fetch API
   * Works on both web and native platforms
   */
  private async fetchRequest<T>(
    options: RequestOptions,
    url: string,
    headers: Record<string, string>
  ): Promise<T> {
    // Build URL with query params
    let finalUrl = url;
    if (options.params) {
      const searchParams = new URLSearchParams(options.params);
      finalUrl = `${url}?${searchParams.toString()}`;
    }

    console.log(`🌐 Using Fetch API (${this.isNative ? "Native" : "Web"})`);

    const fetchOptions: RequestInit = {
      method: options.method,
      headers,
    };

    // Add body for POST, PUT, PATCH
    if (options.data && ["POST", "PUT", "PATCH"].includes(options.method)) {
      fetchOptions.body = JSON.stringify(options.data);
    }

    const response = await fetch(finalUrl, fetchOptions);

    console.log("✅ Fetch Response:", response.status, response.statusText);

    // Parse response
    const responseText = await response.text();
    let data: any;

    try {
      data = JSON.parse(responseText);
    } catch {
      data = responseText;
    }

    console.log("📦 Data:", JSON.stringify(data).substring(0, 200));

    if (response.ok) {
      return data as T;
    } else {
      throw {
        response: {
          status: response.status,
          data: data,
        },
        message: `HTTP ${response.status}: ${
          data?.message || response.statusText
        }`,
      };
    }
  }

  /**
   * GET request
   */
  async get<T = any>(url: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>({
      method: "GET",
      url,
      params,
    });
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any): Promise<T> {
    return this.request<T>({
      method: "POST",
      url,
      data,
    });
  }

  /**
   * PUT request
   */
  async put<T = any>(url: string, data?: any): Promise<T> {
    return this.request<T>({
      method: "PUT",
      url,
      data,
    });
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string): Promise<T> {
    return this.request<T>({
      method: "DELETE",
      url,
    });
  }

  /**
   * PATCH request
   */
  async patch<T = any>(url: string, data?: any): Promise<T> {
    return this.request<T>({
      method: "PATCH",
      url,
      data,
    });
  }

  /**
   * Handle errors
   */
  private handleError(error: any): Error {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || "An error occurred";

      console.error("Error Status:", status);
      console.error("Error Message:", message);

      if (status === 401) {
        // Unauthorized - clear auth
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }

      return new Error(message);
    }

    const message =
      error.message || "Network error. Please check your connection.";
    console.error("Network Error:", message);

    return new Error(message);
  }
}

export default new HttpService();
