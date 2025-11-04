import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { serviceManager } from "./services";

// Initialize Service Manager
console.log("🚀 Initializing HRIS App...");
console.log("📍 Environment:", import.meta.env.MODE);
console.log("🌐 API URL:", import.meta.env.VITE_API_URL);

serviceManager
  .initialize()
  .then(() => {
    console.log("✅ Service Manager initialized");

    // Log current status
    const status = serviceManager.getStatus();
    console.log("📊 App Status:", status);

    // Show warning if backend is not available
    if (!status.backendAvailable) {
      console.warn(
        "⚠️ ═══════════════════════════════════════════════════════"
      );
      console.warn("⚠️ BACKEND NOT AVAILABLE");
      console.warn("⚠️ App will use fallback/mock data");
      console.warn("⚠️ Please check:");
      console.warn("⚠️   1. Backend server is running");
      console.warn("⚠️   2. CORS is configured correctly");
      console.warn(
        "⚠️   3. API URL is correct:",
        import.meta.env.VITE_API_BASE_URL
      );
      console.warn(
        "⚠️ ═══════════════════════════════════════════════════════"
      );
    }
  })
  .catch((error) => {
    console.error("❌ Failed to initialize Service Manager:", error);
    console.warn("⚠️ App will continue with limited functionality");
  });

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
