/**
 * Test API Attendance
 * Endpoint: https://hakunamatata.my.id/employee/attendance
 *
 * Test yang akan dilakukan:
 * 1. GET /employee/attendance - List attendance dengan pagination
 * 2. GET /employee/attendance/history - Attendance history
 * 3. GET /employee/attendance/statistics - Statistik attendance
 */

const axios = require("axios");

const API_BASE_URL = "https://hakunamatata.my.id/api";

// Ganti dengan token yang valid dari login
// Ambil dari localStorage setelah login di aplikasi
const AUTH_TOKEN = "YOUR_TOKEN_HERE"; // <-- GANTI DENGAN TOKEN YANG VALID

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${AUTH_TOKEN}`,
  },
});

async function testAttendanceAPI() {
  console.log("=".repeat(60));
  console.log("🧪 Testing Attendance API");
  console.log("=".repeat(60));
  console.log("");

  // Test 1: Get Attendance List
  try {
    console.log("📋 Test 1: GET /employee/attendance (List)");
    console.log("-".repeat(60));

    const response = await apiClient.get("/employee/attendance", {
      params: {
        page: 1,
        per_page: 10,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      },
    });

    console.log("✅ Status:", response.status);
    console.log("📦 Response Structure:");
    console.log(JSON.stringify(response.data, null, 2));
    console.log("");

    if (response.data.data) {
      console.log("📊 Data Summary:");
      if (Array.isArray(response.data.data)) {
        console.log("  - Total Records:", response.data.data.length);
        if (response.data.data[0]) {
          console.log("  - First Record Sample:");
          console.log("    ", JSON.stringify(response.data.data[0], null, 2));
        }
      } else if (response.data.data.data) {
        console.log("  - Total Records:", response.data.data.data.length);
        console.log(
          "  - Current Page:",
          response.data.data.current_page || "N/A"
        );
        console.log("  - Total Pages:", response.data.data.last_page || "N/A");
        console.log("  - Total Items:", response.data.data.total || "N/A");
        if (response.data.data.data[0]) {
          console.log("  - First Record Sample:");
          console.log(
            "    ",
            JSON.stringify(response.data.data.data[0], null, 2)
          );
        }
      }
    }
    console.log("");
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.response) {
      console.error("   Status:", error.response.status);
      console.error("   Data:", JSON.stringify(error.response.data, null, 2));
    }
    console.log("");
  }

  // Test 2: Get Attendance History
  try {
    console.log("📜 Test 2: GET /employee/attendance/history");
    console.log("-".repeat(60));

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // 30 hari yang lalu

    const response = await apiClient.get("/employee/attendance/history", {
      params: {
        start_date: startDate.toISOString().split("T")[0],
        end_date: new Date().toISOString().split("T")[0],
      },
    });

    console.log("✅ Status:", response.status);
    console.log("📦 Response Structure:");
    console.log(JSON.stringify(response.data, null, 2));
    console.log("");
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.response) {
      console.error("   Status:", error.response.status);
      console.error("   Data:", JSON.stringify(error.response.data, null, 2));
    }
    console.log("");
  }

  // Test 3: Get Attendance Statistics
  try {
    console.log("📊 Test 3: GET /employee/attendance/statistics");
    console.log("-".repeat(60));

    const response = await apiClient.get("/employee/attendance/statistics", {
      params: {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      },
    });

    console.log("✅ Status:", response.status);
    console.log("📦 Response Structure:");
    console.log(JSON.stringify(response.data, null, 2));
    console.log("");
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.response) {
      console.error("   Status:", error.response.status);
      console.error("   Data:", JSON.stringify(error.response.data, null, 2));
    }
    console.log("");
  }

  console.log("=".repeat(60));
  console.log("✨ Testing Complete");
  console.log("=".repeat(60));
}

// Run the test
if (AUTH_TOKEN === "YOUR_TOKEN_HERE") {
  console.log("⚠️  WARNING: Please update AUTH_TOKEN in the script first!");
  console.log("");
  console.log("Steps to get token:");
  console.log("1. Login to your app");
  console.log("2. Open browser DevTools (F12)");
  console.log("3. Go to Console tab");
  console.log('4. Run: localStorage.getItem("auth_token")');
  console.log("5. Copy the token and paste it in this script");
  console.log("");
} else {
  testAttendanceAPI().catch(console.error);
}
