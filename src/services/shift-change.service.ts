import apiClient from "./api.config";
import { ApiResponse } from "../types/api.types";

// Shift Change Request Types
export interface ShiftChangeRequest {
  id: number;
  employee_id: number;
  current_shift_id: number;
  requested_shift_id: number;
  request_date: string;
  effective_date: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  approved_by?: number;
  approved_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  current_shift?: {
    id: number;
    name: string;
    start_time: string;
    end_time: string;
  };
  requested_shift?: {
    id: number;
    name: string;
    start_time: string;
    end_time: string;
  };
}

export interface CreateShiftChangeRequest {
  requested_shift_id: number;
  effective_date: string;
  reason: string;
}

class ShiftChangeService {
  private basePath = "/employee/shift-change-requests";

  /**
   * Get shift change requests history
   * GET /employee/shift-change-requests/history
   */
  async getHistory(): Promise<ShiftChangeRequest[]> {
    try {
      const response = await apiClient.get<ApiResponse<ShiftChangeRequest[]>>(
        `${this.basePath}/history`
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Submit shift change request
   * POST /employee/shift-change-requests/create
   */
  async submitRequest(
    data: CreateShiftChangeRequest
  ): Promise<ShiftChangeRequest> {
    try {
      const response = await apiClient.post<ApiResponse<ShiftChangeRequest>>(
        `${this.basePath}/create`,
        data
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get shift change request detail
   */
  async getRequestDetail(id: number): Promise<ShiftChangeRequest> {
    try {
      const response = await apiClient.get<ApiResponse<ShiftChangeRequest>>(
        `${this.basePath}/${id}`
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Cancel shift change request (if allowed)
   */
  async cancelRequest(id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.basePath}/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get available shifts
   */
  async getAvailableShifts(): Promise<
    Array<{
      id: number;
      name: string;
      start_time: string;
      end_time: string;
      description?: string;
    }>
  > {
    try {
      const response = await apiClient.get<
        ApiResponse<
          Array<{
            id: number;
            name: string;
            start_time: string;
            end_time: string;
            description?: string;
          }>
        >
      >("/employee/shifts");
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Format shift time
   */
  formatShiftTime(startTime: string, endTime: string): string {
    return `${startTime} - ${endTime}`;
  }

  /**
   * Get status badge color
   */
  getStatusColor(status: string): string {
    switch (status) {
      case "pending":
        return "warning";
      case "approved":
        return "success";
      case "rejected":
        return "danger";
      default:
        return "medium";
    }
  }

  /**
   * Get status label in Indonesian
   */
  getStatusLabel(status: string): string {
    switch (status) {
      case "pending":
        return "Menunggu";
      case "approved":
        return "Disetujui";
      case "rejected":
        return "Ditolak";
      default:
        return status;
    }
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

export default new ShiftChangeService();
