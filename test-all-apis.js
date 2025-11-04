/**
 * Complete API Test Suite
 * Test semua endpoint yang sudah dikonfigurasi
 *
 * Endpoints yang akan ditest:
 * 1. Attendance Requests (Create & History)
 * 2. Overtime Requests (Create & List)
 * 3. Leave Requests (Create & List)
 * 4. Shift Change Requests (Create & History)
 * 5. Payslip (List)
 */

const axios = require("axios");

const API_BASE_URL = "https://hakunamatata.my.id/api";

// Ganti dengan token yang valid dari login
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

// Color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

async function testAPI() {
  console.log("\n");
  log(colors.bright + colors.cyan, "═".repeat(70));
  log(colors.bright + colors.cyan, "🧪 COMPREHENSIVE API TEST SUITE");
  log(colors.bright + colors.cyan, "═".repeat(70));
  console.log("\n");

  // Test 1: Attendance Requests - History
  try {
    log(
      colors.bright + colors.blue,
      "📋 Test 1: GET /employee/attendance/requests/history"
    );
    log(colors.yellow, "─".repeat(70));

    const response = await apiClient.get(
      "/employee/attendance/requests/history"
    );

    log(colors.green, `✅ Status: ${response.status}`);
    console.log("📦 Response:", JSON.stringify(response.data, null, 2));
    console.log("");
  } catch (error) {
    log(colors.red, `❌ Error: ${error.message}`);
    if (error.response) {
      log(colors.red, `   Status: ${error.response.status}`);
      console.log("   Data:", JSON.stringify(error.response.data, null, 2));
    }
    console.log("");
  }

  // Test 2: Overtime Requests - List
  try {
    log(
      colors.bright + colors.blue,
      "⏰ Test 2: GET /employee/overtime-requests"
    );
    log(colors.yellow, "─".repeat(70));

    const response = await apiClient.get("/employee/overtime-requests");

    log(colors.green, `✅ Status: ${response.status}`);
    console.log("📦 Response:", JSON.stringify(response.data, null, 2));
    console.log("");
  } catch (error) {
    log(colors.red, `❌ Error: ${error.message}`);
    if (error.response) {
      log(colors.red, `   Status: ${error.response.status}`);
      console.log("   Data:", JSON.stringify(error.response.data, null, 2));
    }
    console.log("");
  }

  // Test 3: Leave Requests - List
  try {
    log(colors.bright + colors.blue, "🌴 Test 3: GET /employee/leave");
    log(colors.yellow, "─".repeat(70));

    const response = await apiClient.get("/employee/leave");

    log(colors.green, `✅ Status: ${response.status}`);
    console.log("📦 Response:", JSON.stringify(response.data, null, 2));
    console.log("");
  } catch (error) {
    log(colors.red, `❌ Error: ${error.message}`);
    if (error.response) {
      log(colors.red, `   Status: ${error.response.status}`);
      console.log("   Data:", JSON.stringify(error.response.data, null, 2));
    }
    console.log("");
  }

  // Test 4: Shift Change Requests - History
  try {
    log(
      colors.bright + colors.blue,
      "🔄 Test 4: GET /employee/shift-change-requests/history"
    );
    log(colors.yellow, "─".repeat(70));

    const response = await apiClient.get(
      "/employee/shift-change-requests/history"
    );

    log(colors.green, `✅ Status: ${response.status}`);
    console.log("📦 Response:", JSON.stringify(response.data, null, 2));
    console.log("");
  } catch (error) {
    log(colors.red, `❌ Error: ${error.message}`);
    if (error.response) {
      log(colors.red, `   Status: ${error.response.status}`);
      console.log("   Data:", JSON.stringify(error.response.data, null, 2));
    }
    console.log("");
  }

  // Test 5: Payslip - List
  try {
    log(colors.bright + colors.blue, "💰 Test 5: GET /employee/payslip");
    log(colors.yellow, "─".repeat(70));

    const response = await apiClient.get("/employee/payslip", {
      params: {
        page: 1,
        per_page: 10,
        year: new Date().getFullYear(),
      },
    });

    log(colors.green, `✅ Status: ${response.status}`);
    console.log("📦 Response:", JSON.stringify(response.data, null, 2));
    console.log("");
  } catch (error) {
    log(colors.red, `❌ Error: ${error.message}`);
    if (error.response) {
      log(colors.red, `   Status: ${error.response.status}`);
      console.log("   Data:", JSON.stringify(error.response.data, null, 2));
    }
    console.log("");
  }

  // Summary
  console.log("\n");
  log(colors.bright + colors.cyan, "═".repeat(70));
  log(colors.bright + colors.green, "✨ API TESTS COMPLETED");
  log(colors.bright + colors.cyan, "═".repeat(70));
  console.log("\n");

  // API Endpoints Summary
  log(colors.bright + colors.magenta, "📚 CONFIGURED API ENDPOINTS:");
  console.log("");
  log(colors.cyan, "📋 Attendance Requests:");
  console.log("   POST /employee/attendance/requests/create");
  console.log("   GET  /employee/attendance/requests/history");
  console.log("");
  log(colors.cyan, "⏰ Overtime Requests:");
  console.log("   POST /employee/overtime-requests/create");
  console.log("   GET  /employee/overtime-requests");
  console.log("");
  log(colors.cyan, "🌴 Leave Requests:");
  console.log("   POST /employee/leave/request");
  console.log("   GET  /employee/leave");
  console.log("");
  log(colors.cyan, "🔄 Shift Change Requests:");
  console.log("   POST /employee/shift-change-requests/create");
  console.log("   GET  /employee/shift-change-requests/history");
  console.log("");
  log(colors.cyan, "💰 Payslip:");
  console.log("   GET  /employee/payslip");
  console.log("");
}

// Instructions if token not set
if (AUTH_TOKEN === "YOUR_TOKEN_HERE") {
  console.log("\n");
  log(
    colors.bright + colors.yellow,
    "⚠️  WARNING: Please update AUTH_TOKEN in the script first!"
  );
  console.log("");
  log(colors.bright, "Steps to get token:");
  console.log("1. Login to your app");
  console.log("2. Open browser DevTools (F12)");
  console.log("3. Go to Console tab");
  console.log('4. Run: localStorage.getItem("auth_token")');
  console.log("5. Copy the token and paste it in this script");
  console.log("");
} else {
  testAPI().catch(console.error);
}
