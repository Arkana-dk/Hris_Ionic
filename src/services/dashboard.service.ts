import apiClient from "./api.config";

export interface DashboardData {
  user?: {
    name: string;
    full_name: string;
    position: string;
    job_title: string;
    avatar: string | null;
    email: string;
  };
  attendance?: {
    status: "not_started" | "clocked_in" | "clocked_out";
    clock_in_time: string | null;
    clock_out_time: string | null;
    working_duration: string | null;
  };
  statistics?: {
    attendance_count: number;
    leave_used: number;
    leave_remaining: number;
    total_working_hours: string;
  };
  events?: EventData[];
  announcements?: AnnouncementData[];
}

export interface EventData {
  id: number;
  title: string;
  date: string;
  time: string;
  description: string;
}

export interface AnnouncementData {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

export interface MonthlyStatistics {
  attendance_count: number;
  leave_used: number;
  leave_remaining: number;
  total_working_hours: string;
}

/**
 * Dashboard Service
 * Mengelola data dashboard untuk employee
 */
class DashboardService {
  /**
   * Get comprehensive dashboard data
   * Endpoint: GET /api/employee/dashboard
   */
  async getDashboard(): Promise<DashboardData> {
    try {
      const response = await apiClient.get("/employee/dashboard");

      // Handle different response formats
      if (response.data.data) {
        return response.data.data;
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard:", error);

      // Return empty data if API not available yet
      const axiosError = error as { response?: { status: number } };
      if (axiosError.response?.status === 404) {
        console.warn("Dashboard endpoint not available, returning empty data");
        return {};
      }

      throw error;
    }
  }

  /**
   * Get today's events
   * Endpoint: GET /api/employee/events/today
   */
  async getTodayEvents(): Promise<EventData[]> {
    try {
      const response = await apiClient.get("/employee/events/today");
      return response.data.data || response.data || [];
    } catch (error) {
      console.error("Error fetching today's events:", error);
      return [];
    }
  }

  /**
   * Get latest announcements
   * Endpoint: GET /api/employee/announcements
   */
  async getAnnouncements(limit: number = 5): Promise<AnnouncementData[]> {
    try {
      const response = await apiClient.get("/employee/announcements", {
        params: { limit },
      });
      return response.data.data || response.data || [];
    } catch (error) {
      console.error("Error fetching announcements:", error);
      return [];
    }
  }

  /**
   * Get monthly statistics
   * Endpoint: GET /api/employee/statistics/monthly
   */
  async getMonthlyStatistics(): Promise<MonthlyStatistics> {
    try {
      const response = await apiClient.get("/employee/statistics/monthly");
      return response.data.data || response.data || {};
    } catch (error) {
      console.error("Error fetching monthly statistics:", error);
      return {
        attendance_count: 0,
        leave_used: 0,
        leave_remaining: 0,
        total_working_hours: "0h 0m",
      };
    }
  }
}

// Export singleton instance
export const dashboardService = new DashboardService();
