import apiClient from "./api.config";
import { Payslip, ApiResponse, PaginatedResponse } from "../types/api.types";

class PayslipService {
  private basePath = "/employee/payslip";

  /**
   * Get payslip list
   */
  async getPayslips(params?: {
    page?: number;
    per_page?: number;
    year?: number;
  }): Promise<PaginatedResponse<Payslip>> {
    try {
      const response = await apiClient.get<
        ApiResponse<PaginatedResponse<Payslip>>
      >(this.basePath, { params });
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get payslip detail
   */
  async getPayslipDetail(id: number): Promise<Payslip> {
    try {
      const response = await apiClient.get<ApiResponse<Payslip>>(
        `${this.basePath}/${id}`
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get payslip history
   */
  async getHistory(params?: {
    year?: number;
    month?: number;
  }): Promise<Payslip[]> {
    try {
      const response = await apiClient.get<ApiResponse<Payslip[]>>(
        `${this.basePath}/history`,
        { params }
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Download payslip PDF
   */
  async downloadPDF(id: number): Promise<Blob> {
    try {
      const response = await apiClient.get(`${this.basePath}/${id}/pdf`, {
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Open PDF in new tab or download
   */
  async viewPDF(id: number, filename?: string): Promise<void> {
    try {
      const blob = await this.downloadPDF(id);
      const url = window.URL.createObjectURL(blob);

      // Open in new tab
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.download = filename || `payslip-${id}.pdf`;
      link.click();

      // Clean up
      window.URL.revokeObjectURL(url);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Format currency
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  }

  /**
   * Format month name
   */
  formatMonthName(month: number): string {
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    return months[month - 1] || "";
  }

  /**
   * Handle API errors
   */
  private handleError(error: unknown): Error {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      const message = axiosError.response?.data?.message || "An error occurred";
      return new Error(message);
    }
    return new Error("Network error. Please check your connection.");
  }
}

export default new PayslipService();
