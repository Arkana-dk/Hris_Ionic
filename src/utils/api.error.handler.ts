/**
 * API Error Handler Utility
 * Centralized error handling untuk API calls
 */

export interface ApiErrorInfo {
  type: "network" | "not_found" | "unauthorized" | "server" | "unknown";
  message: string;
  status?: number;
  shouldRetry: boolean;
  userMessage: string;
}

export class ApiErrorHandler {
  /**
   * Analyze error dan return info yang berguna
   */
  static analyze(error: unknown): ApiErrorInfo {
    const err = error as {
      message?: string;
      response?: {
        status?: number;
        data?: { message?: string };
      };
    };

    // Network Error
    if (
      err.message?.includes("Network Error") ||
      err.message?.includes("ERR_NETWORK") ||
      err.message?.includes("ERR_CONNECTION") ||
      err.message?.includes("timeout")
    ) {
      return {
        type: "network",
        message: err.message || "Network error",
        shouldRetry: true,
        userMessage:
          "Tidak dapat terhubung ke server. Pastikan koneksi internet Anda stabil.",
      };
    }

    // 404 Not Found
    if (err.response?.status === 404) {
      return {
        type: "not_found",
        message: err.response.data?.message || "Resource not found",
        status: 404,
        shouldRetry: false,
        userMessage:
          "Data tidak ditemukan. Endpoint mungkin belum tersedia di backend.",
      };
    }

    // 401 Unauthorized
    if (err.response?.status === 401) {
      return {
        type: "unauthorized",
        message: err.response.data?.message || "Unauthorized",
        status: 401,
        shouldRetry: false,
        userMessage: "Sesi Anda telah berakhir. Silakan login kembali.",
      };
    }

    // 500+ Server Error
    if (err.response?.status && err.response.status >= 500) {
      return {
        type: "server",
        message: err.response.data?.message || "Server error",
        status: err.response.status,
        shouldRetry: true,
        userMessage:
          "Terjadi kesalahan di server. Coba lagi dalam beberapa saat.",
      };
    }

    // Unknown Error
    return {
      type: "unknown",
      message: err.message || "Unknown error",
      status: err.response?.status,
      shouldRetry: false,
      userMessage: "Terjadi kesalahan. Silakan coba lagi.",
    };
  }

  /**
   * Log error dengan format yang rapi
   */
  static log(error: unknown, context: string): void {
    const info = this.analyze(error);

    console.group(`❌ API Error: ${context}`);
    console.error("Type:", info.type);
    console.error("Message:", info.message);
    if (info.status) console.error("Status:", info.status);
    console.error("Should Retry:", info.shouldRetry);
    console.error("User Message:", info.userMessage);
    console.groupEnd();
  }

  /**
   * Check apakah backend tersedia
   */
  static isBackendAvailable(error: unknown): boolean {
    const info = this.analyze(error);
    return info.type !== "network";
  }

  /**
   * Get user-friendly message
   */
  static getUserMessage(error: unknown): string {
    const info = this.analyze(error);
    return info.userMessage;
  }
}

export default ApiErrorHandler;
