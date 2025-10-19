/**
 * Test API Response Format
 * Run: node test-login-response.js
 */

import https from "https";

function testLoginResponse(email, password) {
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

  console.log("\n🧪 Testing Login Response Format");
  console.log("📧 Email:", email);
  console.log("🔐 Password:", password);
  console.log("\n⏳ Sending request...\n");

  const req = https.request(options, (res) => {
    let responseData = "";

    console.log("📊 Status Code:", res.statusCode);

    res.on("data", (chunk) => {
      responseData += chunk;
    });

    res.on("end", () => {
      try {
        const jsonData = JSON.parse(responseData);
        console.log("\n📦 FULL Response:");
        console.log(JSON.stringify(jsonData, null, 2));

        console.log("\n🔍 Structure Analysis:");

        // Check different formats
        if (jsonData.data) {
          console.log('✅ Has "data" property');
          if (jsonData.data.token) {
            console.log("  ✅ Format: { data: { token, user } }");
            console.log(
              "  📝 Token:",
              jsonData.data.token.substring(0, 30) + "..."
            );
            console.log(
              "  👤 User:",
              jsonData.data.user?.name || jsonData.data.user
            );
          } else if (jsonData.data.access_token) {
            console.log("  ✅ Format: { data: { access_token, user } }");
            console.log(
              "  📝 Token:",
              jsonData.data.access_token.substring(0, 30) + "..."
            );
            console.log(
              "  👤 User:",
              jsonData.data.user?.name || jsonData.data.user
            );
          }
        } else if (jsonData.token) {
          console.log("✅ Format: { token, user }");
          console.log("  📝 Token:", jsonData.token.substring(0, 30) + "...");
          console.log("  👤 User:", jsonData.user?.name || jsonData.user);
        } else if (jsonData.access_token) {
          console.log("✅ Format: { access_token, user }");
          console.log(
            "  📝 Token:",
            jsonData.access_token.substring(0, 30) + "..."
          );
          console.log("  👤 User:", jsonData.user?.name || jsonData.user);
        } else if (jsonData.message) {
          console.log("❌ Error Response");
          console.log("  Message:", jsonData.message);
        }
      } catch (e) {
        console.log("\n📦 Raw Response (not JSON):");
        console.log(responseData);
      }
    });
  });

  req.on("error", (error) => {
    console.error("\n❌ Request Error:", error.message);
  });

  req.write(data);
  req.end();
}

console.log("╔═══════════════════════════════════════════════╗");
console.log("║   Test Login Response Format                  ║");
console.log("║   Backend: hakunamatata.my.id                 ║");
console.log("╚═══════════════════════════════════════════════╝");

// Test dengan credentials (ganti dengan yang valid)
testLoginResponse("admin@example.com", "password");

// Uncomment untuk test dengan credentials lain
// setTimeout(() => {
//   testLoginResponse('your-email@example.com', 'your-password');
// }, 2000);
