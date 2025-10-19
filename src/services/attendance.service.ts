import apiClient from "./api.config";
import {
  Attendance,
  ClockInRequest,
  AttendanceRequest,
  PresensiRequest,
  ApiResponse,
  PaginatedResponse,
} from "../types/api.types";

class AttendanceService {
  private basePath = "/employee";

  /**
   * Get attendance list
   */
  async getAttendance(params?: {
    page?: number;
    per_page?: number;
    month?: number;
    year?: number;
  }): Promise<PaginatedResponse<Attendance>> {
    try {
      const response = await apiClient.get<
        ApiResponse<PaginatedResponse<Attendance>>
      >(`${this.basePath}/attendance`, { params });
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Clock in/out
   */
  async clockIn(data: ClockInRequest): Promise<Attendance> {
    try {
      const response = await apiClient.post<ApiResponse<Attendance>>(
        `${this.basePath}/attendance`,
        data
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get attendance history
   */
  async getHistory(params?: {
    start_date?: string;
    end_date?: string;
  }): Promise<Attendance[]> {
    try {
      const response = await apiClient.get<ApiResponse<Attendance[]>>(
        `${this.basePath}/attendance/history`,
        { params }
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Submit presensi (alternative endpoint)
   */
  async submitPresensi(data: ClockInRequest): Promise<Attendance> {
    try {
      const response = await apiClient.post<ApiResponse<Attendance>>(
        `${this.basePath}/presensi`,
        data
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get attendance requests list
   */
  async getRequests(): Promise<AttendanceRequest[]> {
    try {
      const response = await apiClient.get<ApiResponse<AttendanceRequest[]>>(
        `${this.basePath}/presensi/requests`
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Submit attendance request (izin/sakit/etc)
   */
  async submitRequest(data: PresensiRequest): Promise<AttendanceRequest> {
    try {
      const formData = new FormData();
      formData.append("type", data.type);
      formData.append("date", data.date);
      formData.append("reason", data.reason);

      if (data.attachment && data.attachment instanceof File) {
        formData.append("attachment", data.attachment);
      }

      const response = await apiClient.post<ApiResponse<AttendanceRequest>>(
        `${this.basePath}/presensi/requests`,
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
   * Get attendance request detail
   */
  async getRequestDetail(id: number): Promise<AttendanceRequest> {
    try {
      const response = await apiClient.get<ApiResponse<AttendanceRequest>>(
        `${this.basePath}/presensi/requests/${id}`
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get current location
   */
  async getCurrentLocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
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

export default new AttendanceService();
