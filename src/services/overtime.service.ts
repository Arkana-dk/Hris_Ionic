import apiClient from "./api.config";
import {
  OvertimeRequest,
  CreateOvertimeRequest,
  ApiResponse,
} from "../types/api.types";

class OvertimeService {
  private basePath = "/employee/overtime-request";

  /**
   * Get overtime requests list
   */
  async getOvertimeRequests(): Promise<OvertimeRequest[]> {
    try {
      const response = await apiClient.get<ApiResponse<OvertimeRequest[]>>(
        this.basePath
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Submit overtime request
   */
  async submitOvertime(data: CreateOvertimeRequest): Promise<OvertimeRequest> {
    try {
      const response = await apiClient.post<ApiResponse<OvertimeRequest>>(
        this.basePath,
        data
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get overtime history
   */
  async getHistory(params?: {
    start_date?: string;
    end_date?: string;
  }): Promise<OvertimeRequest[]> {
    try {
      const response = await apiClient.get<ApiResponse<OvertimeRequest[]>>(
        `${this.basePath}/history`,
        { params }
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Calculate overtime duration in hours
   */
  calculateDuration(startTime: string, endTime: string): number {
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    const diff = end.getTime() - start.getTime();
    return diff / (1000 * 60 * 60); // Convert to hours
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

export default new OvertimeService();
