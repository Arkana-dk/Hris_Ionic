/**
 * API Integration Test Script
 * Test koneksi dan functionality API backend
 *
 * Usage:
 * 1. Buka browser console
 * 2. Copy-paste script ini
 * 3. Jalankan: await testApiIntegration()
 */

import { serviceManager } from "../services";

interface TestResult {
  name: string;
  success: boolean;
  message: string;
  duration?: number;
  data?: Record<string, unknown>;
}

class ApiTester {
  private results: TestResult[] = [];

  /**
   * Run all API tests
   */
  async runAll(): Promise<void> {
    console.log("🧪 Starting API Integration Tests...\n");

    await this.testHealthCheck();
    await this.testLogin();
    await this.testMe();
    await this.testDashboard();
    await this.testAttendance();

    this.printResults();
  }

  /**
   * Test API Health Check
   */
  async testHealthCheck(): Promise<void> {
    const startTime = performance.now();
    try {
      const isHealthy = await serviceManager.checkHealth();
      const duration = performance.now() - startTime;

      this.results.push({
        name: "Health Check",
        success: isHealthy,
        message: isHealthy ? "API is healthy" : "API is not responding",
        duration,
      });
    } catch (error) {
      const err = error as Error;
      this.results.push({
        name: "Health Check",
        success: false,
        message: err.message,
      });
    }
  }

  /**
   * Test Login
   */
  async testLogin(): Promise<void> {
    const startTime = performance.now();

    // Prompt for credentials
    const email = prompt("Enter email for testing:") || "admin@example.com";
    const password = prompt("Enter password for testing:") || "password";

    try {
      const result = await serviceManager.auth.login({ email, password });
      const duration = performance.now() - startTime;

      this.results.push({
        name: "Login",
        success: true,
        message: `Logged in as ${result.user.name}`,
        duration,
        data: {
          user: result.user.name,
          email: result.user.email,
          hasToken: !!result.token,
        },
      });
    } catch (error) {
      const err = error as Error;
      this.results.push({
        name: "Login",
        success: false,
        message: err.message,
      });
    }
  }

  /**
   * Test Get Current User
   */
  async testMe(): Promise<void> {
    const startTime = performance.now();

    if (!serviceManager.auth.isAuthenticated()) {
      this.results.push({
        name: "Get Current User",
        success: false,
        message: "Not authenticated - skipped",
      });
      return;
    }

    try {
      const user = await serviceManager.auth.me();
      const duration = performance.now() - startTime;

      this.results.push({
        name: "Get Current User",
        success: true,
        message: `User: ${user.name}`,
        duration,
        data: {
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      const err = error as Error;
      this.results.push({
        name: "Get Current User",
        success: false,
        message: err.message,
      });
    }
  }

  /**
   * Test Dashboard
   */
  async testDashboard(): Promise<void> {
    const startTime = performance.now();

    if (!serviceManager.auth.isAuthenticated()) {
      this.results.push({
        name: "Get Dashboard",
        success: false,
        message: "Not authenticated - skipped",
      });
      return;
    }

    try {
      const dashboard = await serviceManager.dashboard.getDashboard();
      const duration = performance.now() - startTime;

      this.results.push({
        name: "Get Dashboard",
        success: true,
        message: "Dashboard data fetched",
        duration,
        data: {
          hasUser: !!dashboard.user,
          hasAttendance: !!dashboard.attendance,
          hasStatistics: !!dashboard.statistics,
          eventsCount: dashboard.events?.length || 0,
        },
      });
    } catch (error) {
      const err = error as Error;
      this.results.push({
        name: "Get Dashboard",
        success: false,
        message: err.message,
      });
    }
  }

  /**
   * Test Attendance
   */
  async testAttendance(): Promise<void> {
    const startTime = performance.now();

    if (!serviceManager.auth.isAuthenticated()) {
      this.results.push({
        name: "Get Attendance",
        success: false,
        message: "Not authenticated - skipped",
      });
      return;
    }

    try {
      const attendanceList = await serviceManager.attendance.getAttendance({
        page: 1,
        per_page: 1,
      });
      const duration = performance.now() - startTime;

      const firstAttendance = attendanceList.data[0];

      this.results.push({
        name: "Get Attendance",
        success: true,
        message: "Attendance data fetched",
        duration,
        data: {
          totalRecords: attendanceList.total || 0,
          hasData: attendanceList.data.length > 0,
          firstRecord: firstAttendance
            ? {
                date: firstAttendance.date || firstAttendance.tanggal,
                clockIn: firstAttendance.clock_in || firstAttendance.jam_masuk,
                clockOut:
                  firstAttendance.clock_out || firstAttendance.jam_keluar,
              }
            : null,
        },
      });
    } catch (error) {
      const err = error as Error;
      this.results.push({
        name: "Get Attendance",
        success: false,
        message: err.message,
      });
    }
  }

  /**
   * Print test results
   */
  private printResults(): void {
    console.log("\n📊 Test Results:\n");
    console.log("═".repeat(80));

    const successCount = this.results.filter((r) => r.success).length;
    const totalCount = this.results.length;
    const successRate = ((successCount / totalCount) * 100).toFixed(1);

    this.results.forEach((result) => {
      const icon = result.success ? "✅" : "❌";
      const duration = result.duration
        ? ` (${result.duration.toFixed(0)}ms)`
        : "";

      console.log(`${icon} ${result.name}${duration}`);
      console.log(`   ${result.message}`);

      if (result.data) {
        console.log("   Data:", result.data);
      }
      console.log("");
    });

    console.log("═".repeat(80));
    console.log(
      `\n📈 Summary: ${successCount}/${totalCount} tests passed (${successRate}%)\n`
    );

    if (successCount === totalCount) {
      console.log(
        "🎉 All tests passed! API integration is working correctly.\n"
      );
    } else {
      console.log(
        "⚠️ Some tests failed. Please check the backend configuration.\n"
      );
    }
  }
}

/**
 * Main test function
 */
export async function testApiIntegration(): Promise<void> {
  const tester = new ApiTester();
  await tester.runAll();
}

// Make it available in browser console
if (typeof window !== "undefined") {
  interface WindowWithTester extends Window {
    testApiIntegration: typeof testApiIntegration;
    serviceManager: typeof serviceManager;
  }

  (window as unknown as WindowWithTester).testApiIntegration =
    testApiIntegration;
  (window as unknown as WindowWithTester).serviceManager = serviceManager;

  console.log("💡 API Tester loaded!");
  console.log("   Run: await testApiIntegration()");
  console.log("   Or: serviceManager.checkHealth()");
}

export default ApiTester;
