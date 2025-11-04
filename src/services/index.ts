// Export all services
// PRODUCTION MODE: Using Real API with Laravel Sanctum Support
// Data diambil langsung dari database hakunamatata.my.id
// Mendukung CSRF protection untuk web dan token-based untuk mobile

// Service Manager - Centralized API Management
export { default as serviceManager } from "./service.manager";

// New API Client with Sanctum Support
export { default as apiClient } from "./api.client";

// HTTP Service - Legacy (untuk backward compatibility)
export { default as httpService } from "./http.service";

// Auth Service - dengan Sanctum CSRF support
export { default as authService } from "./auth.service";

// Feature Services
export { default as profileService } from "./profile.service";
export { default as attendanceService } from "./attendance.service";
export { default as overtimeService } from "./overtime.service";
export { default as leaveService } from "./leave.service";
export { default as payslipService } from "./payslip.service";
export { default as documentService } from "./document.service";
export { default as shiftChangeService } from "./shift-change.service";
export { dashboardService } from "./dashboard.service";

// Legacy API Config (deprecated - gunakan apiClient)
export { default as legacyApiClient } from "./api.config";
export { API_BASE_URL } from "./api.config";
