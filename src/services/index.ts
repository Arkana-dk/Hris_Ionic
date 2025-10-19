// Export all services
// DEVELOPMENT MODE: Using Mock Service (tanpa backend)
// PRODUCTION MODE: Uncomment baris bawah dan comment baris mock
export { default as authService } from "./auth.service.mock";
// export { default as authService } from "./auth.service";

export { default as profileService } from "./profile.service";
export { default as attendanceService } from "./attendance.service";
export { default as overtimeService } from "./overtime.service";
export { default as leaveService } from "./leave.service";
export { default as payslipService } from "./payslip.service";

// Export API client for custom usage
export { default as apiClient } from "./api.config";
export { API_BASE_URL } from "./api.config";
