/**
 * Services Index
 * All services connect to Real API: https://hakunamatata.my.id/api
 * No mock data - Production ready
 */

// Core Services
export { default as httpService } from "./http.service";
export { default as apiClient } from "./api.config";
export { API_BASE_URL } from "./api.config";

// Feature Services
export { default as authService } from "./auth.service";
export { default as profileService } from "./profile.service";
export { default as attendanceService } from "./attendance.service";
export { default as overtimeService } from "./overtime.service";
export { default as leaveService } from "./leave.service";
export { default as payslipService } from "./payslip.service";
export { default as documentService } from "./document.service";
export { dashboardService } from "./dashboard.service";
