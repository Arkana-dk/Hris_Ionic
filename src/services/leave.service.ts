import apiClient from "./api.config";
import {
  LeaveRequest,
  CreateLeaveRequest,
  LeaveBalance,
  ApiResponse,
} from "../types/api.types";

class LeaveService {
  private basePath = "/employee/cuti";

  /**
   * Get leave requests list
   */
  async getLeaveRequests(): Promise<LeaveRequest[]> {
    try {
      const response = await apiClient.get<ApiResponse<LeaveRequest[]>>(
        this.basePath
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Submit leave request
   */
  async submitLeave(data: CreateLeaveRequest): Promise<LeaveRequest> {
    try {
      const formData = new FormData();
      formData.append("leave_type", data.leave_type);
      formData.append("start_date", data.start_date);
      formData.append("end_date", data.end_date);
      formData.append("reason", data.reason);

      if (data.attachment && data.attachment instanceof File) {
        formData.append("attachment", data.attachment);
      }

      const response = await apiClient.post<ApiResponse<LeaveRequest>>(
        this.basePath,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get leave request detail
   */
  async getLeaveDetail(id: number): Promise<LeaveRequest> {
    try {
      const response = await apiClient.get<ApiResponse<LeaveRequest>>(
        `${this.basePath}/${id}`
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get leave history
   */
  async getHistory(params?: {
    year?: number;
    status?: string;
  }): Promise<LeaveRequest[]> {
    try {
      const response = await apiClient.get<ApiResponse<LeaveRequest[]>>(
        `${this.basePath}/history`,
        { params }
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get leave balance (if API exists)
   */
  async getLeaveBalance(): Promise<LeaveBalance> {
    try {
      const response = await apiClient.get<ApiResponse<LeaveBalance>>(
        "/employee/leave-balance"
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Calculate leave duration in days
   */
  calculateDuration(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end date
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

export default new LeaveService();
