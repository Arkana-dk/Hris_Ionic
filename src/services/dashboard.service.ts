import apiClient from "./api.config";

/**
 * Dashboard Service untuk backend hris-fix
 * API Endpoint: GET /api/employee/dashboard
 *
 * Backend hris-fix response format:
 * {
 *   status: "success",
 *   data: {
 *     employee: { id, nik, name, photo_url, position },
 *     today_summary: { is_clocked_in, clock_in_time, work_hours },
 *     monthly_statistics: { present_days, late_days, total_work_hours, leave_balance },
 *     upcoming_events: [],
 *     announcements: []
 *   }
 * }
 */

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
   * Endpoint: GET /api/employee/dashboard (hris-fix backend)
   */
  async getDashboard(): Promise<DashboardData> {
    try {
      console.log("📊 Fetching dashboard from hris-fix backend...");

      const response = await apiClient.get<{ data: DashboardData }>(
        "/employee/dashboard"
      );

      console.log("✅ Dashboard data received:", response.data);

      // Backend hris-fix returns: { status: "success", data: {...} }
      if (response.data && response.data.data) {
        return response.data.data;
      }

      return response.data as DashboardData;
    } catch (error) {
      console.error("❌ Error fetching dashboard:", error);

      // Return empty data if API not available yet
      const err = error as { response?: { status?: number }; message?: string };

      if (err.response?.status === 404) {
        console.warn(
          "⚠️ Dashboard endpoint not found (404). Backend route mungkin belum tersedia."
        );
      } else if (
        err.message?.includes("Network Error") ||
        err.message?.includes("ERR_NETWORK")
      ) {
        console.warn(
          "⚠️ Cannot connect to backend. Check if hris-fix backend server is running."
        );
      }

      // Return mock data untuk development
      return this.getMockDashboard();
    }
  }

  /**
   * Get today's events
   * Endpoint: GET /api/employee/events/today
   */
  async getTodayEvents(): Promise<EventData[]> {
    try {
      const response = await apiClient.get<{ data: EventData[] }>(
        "/employee/events/today"
      );
      return response.data.data || [];
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
      const response = await apiClient.get<{ data: AnnouncementData[] }>(
        `/employee/announcements?limit=${limit}`
      );
      return response.data.data || [];
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
      const response = await apiClient.get<{ data: MonthlyStatistics }>(
        "/employee/statistics/monthly"
      );
      return (
        response.data.data || {
          attendance_count: 0,
          leave_used: 0,
          leave_remaining: 0,
          total_working_hours: "0h 0m",
        }
      );
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

  /**
   * Get mock dashboard data (fallback when API not available)
   */
  private getMockDashboard(): DashboardData {
    const user = localStorage.getItem("user");
    const userData = user ? JSON.parse(user) : null;

    return {
      user: userData
        ? {
            name: userData.name || "User",
            full_name: userData.full_name || userData.name || "User Name",
            position: userData.position || "Employee",
            job_title: userData.job_title || userData.position || "Staff",
            avatar: userData.avatar || null,
            email: userData.email || "user@example.com",
          }
        : undefined,
      attendance: {
        status: "not_started",
        clock_in_time: null,
        clock_out_time: null,
        working_duration: null,
      },
      statistics: {
        attendance_count: 0,
        leave_used: 0,
        leave_remaining: 12,
        total_working_hours: "0h 0m",
      },
      events: [],
      announcements: [],
    };
  }
}

// Export singleton instance
export const dashboardService = new DashboardService();
