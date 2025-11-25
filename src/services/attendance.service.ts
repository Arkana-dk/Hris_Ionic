import apiClient from "./api.config";
import {
  Attendance,
  AttendanceStatistics,
  ClockInRequest,
  AttendanceRequest,
  PresensiRequest,
  ApiResponse,
  PaginatedResponse,
} from "../types/api.types";

/**
 * Attendance Service untuk backend hris-fix
 * API Endpoints:
 * - GET  /api/employee/attendance - Get today's attendance
 * - POST /api/employee/attendance - Clock in/out
 * - GET  /api/employee/attendance/history - Get history
 * - GET  /api/employee/attendance/statistics?month=11&year=2025 - Monthly stats
 */
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
   * Clock in/out (hris-fix backend)
   * POST /api/employee/attendance
   * Request: { check_in_location, check_in_latitude, check_in_longitude, photo? }
   */
  async clockIn(data: ClockInRequest): Promise<Attendance> {
    try {
      console.log("⏰ Clock In/Out request to hris-fix:", data);

      // Backend hris-fix expects:
      // {
      //   check_in_location: string,
      //   check_in_latitude: number,
      //   check_in_longitude: number,
      //   photo?: string (base64)
      // }
      const requestData = {
        check_in_location:
          data.check_in_location || data.location || "Unknown Location",
        check_in_latitude: data.check_in_latitude || data.latitude || 0,
        check_in_longitude: data.check_in_longitude || data.longitude || 0,
        photo: data.photo,
      };

      const response = await apiClient.post<ApiResponse<Attendance>>(
        `${this.basePath}/attendance`,
        requestData
      );

      console.log("✅ Clock In/Out success:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("❌ Clock In/Out failed:", error);
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
   * Get attendance requests list (history)
   * GET /employee/attendance/requests/history
   */
  async getRequests(): Promise<AttendanceRequest[]> {
    try {
      const response = await apiClient.get<ApiResponse<AttendanceRequest[]>>(
        `${this.basePath}/attendance/requests/history`
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Submit attendance request (izin/sakit/etc)
   * POST /employee/attendance/requests/create
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
        `${this.basePath}/attendance/requests/create`,
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
   * Get attendance statistics (hris-fix backend)
   * GET /api/employee/attendance/statistics?month=11&year=2025
   */
  async getStatistics(params?: {
    month?: number;
    year?: number;
  }): Promise<AttendanceStatistics> {
    try {
      console.log("📊 Get statistics from hris-fix:", params);

      const response = await apiClient.get<ApiResponse<AttendanceStatistics>>(
        `${this.basePath}/attendance/statistics`,
        { params }
      );

      console.log("✅ Statistics received:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("❌ Get statistics failed:", error);
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
