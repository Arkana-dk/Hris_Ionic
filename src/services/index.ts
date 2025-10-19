// Export all services
// PRODUCTION MODE: Using Real API Service ONLY
// Data diambil langsung dari database hakunamatata.my.id
// Proxy di vite.config.ts akan handle CORS issue
export { default as authService } from "./auth.service";

// HYBRID MODE: Automatically switches between Real API and Mock
// export { default as authService } from "./auth.service.hybrid";

// DEVELOPMENT MODE: Using Mock Service only
// export { default as authService } from "./auth.service.mock";

export { default as profileService } from "./profile.service";
export { default as attendanceService } from "./attendance.service";
export { default as overtimeService } from "./overtime.service";
export { default as leaveService } from "./leave.service";
export { default as payslipService } from "./payslip.service";

// Export API client for custom usage
export { default as apiClient } from "./api.config";
export { API_BASE_URL } from "./api.config";
