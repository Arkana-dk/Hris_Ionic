/**
 * Script untuk test API Login dari hakunamatata.my.id
 * Run: node test-api.js
 */

import https from "https";

// Test Login API
function testLogin(email, password) {
  const data = JSON.stringify({
    email: email,
    password: password,
  });

  const options = {
    hostname: "hakunamatata.my.id",
    port: 443,
    path: "/api/login",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length,
      Accept: "application/json",
    },
  };

  console.log("\n🔍 Testing Login API...");
  console.log("📍 URL:", `https://${options.hostname}${options.path}`);
  console.log("📧 Email:", email);
  console.log("🔐 Password:", password);
  console.log("\n⏳ Sending request...\n");

  const req = https.request(options, (res) => {
    let responseData = "";

    console.log("📊 Status Code:", res.statusCode);
    console.log("📋 Headers:", JSON.stringify(res.headers, null, 2));
    console.log("\n📦 Response Body:");

    res.on("data", (chunk) => {
      responseData += chunk;
    });

    res.on("end", () => {
      try {
        const jsonData = JSON.parse(responseData);
        console.log(JSON.stringify(jsonData, null, 2));

        if (res.statusCode === 200) {
          console.log("\n✅ Login Success!");
          if (jsonData.data && jsonData.data.token) {
            console.log(
              "🎫 Token:",
              jsonData.data.token.substring(0, 50) + "..."
            );
            console.log("👤 User:", jsonData.data.user?.name || "N/A");
          }
        } else {
          console.log("\n❌ Login Failed!");
          console.log("Message:", jsonData.message || "Unknown error");
        }
      } catch (e) {
        console.log(responseData);
        console.log("\n⚠️ Response is not JSON");
      }
    });
  });

  req.on("error", (error) => {
    console.error("\n❌ Error:", error.message);
  });

  req.write(data);
  req.end();
}

// Test dengan berbagai credentials
console.log("╔═══════════════════════════════════════════╗");
console.log("║   Testing API Login - hakunamatata.my.id  ║");
console.log("╚═══════════════════════════════════════════╝");

// Test 1: Credentials umum
console.log("\n📝 Test 1: Standard Admin Credentials");
testLogin("admin@example.com", "password");

// Tambahkan test lain jika diperlukan
setTimeout(() => {
  console.log("\n\n📝 Test 2: HRIS Email");
  testLogin("hris@hakunamatata.com", "password");
}, 2000);

setTimeout(() => {
  console.log("\n\n📝 Test 3: Test Wrong Password");
  testLogin("admin@example.com", "wrongpassword");
}, 4000);
