/**
 * Complete API Service untuk hakunamatata.my.id
 * Semua endpoint CRUD operations
 */

import apiClient from "./api.client";
import { WEB_BASE_URL } from "./api.config";
import type { User } from "../types/api.types";

export interface HakunamataResponse<T = unknown> {
  success?: boolean;
  message?: string;
  data?: T;
  [key: string]: unknown;
}

class HakunamataAPIService {
  private webBaseUrl = WEB_BASE_URL;

  /**
   * Get CSRF Token from Laravel
   */
  async getToken(): Promise<string | null> {
    return await apiClient.getToken();
  }

  // ==========================================
  // AUTHENTICATION
  // ==========================================

  /**
   * Login - POST /login
   * @param email string
   * @param password string
   */
  async login(email: string, password: string) {
    const token = await this.getToken();
    const formData = new FormData();
    if (token) formData.append("_token", token);
    formData.append("email", email);
    formData.append("password", password);

    return await apiClient.post<{
      access_token?: string;
      token?: string;
      user?: User;
    }>("/login", formData);
  }

  /**
   * Logout - POST /logout
   */
  async logout() {
    const token = await this.getToken();
    const formData = new FormData();
    if (token) formData.append("_token", token);

    return await apiClient.post("/logout", formData);
  }

  /**
   * Get Current User - GET /api/user
   */
  async getCurrentUser() {
    return await apiClient.get("/user");
  }

  // ==========================================
  // DASHBOARD
  // ==========================================

  /**
   * Get Dashboard Data - GET /api/dashboard
   */
  async getDashboard() {
    return await apiClient.get("/dashboard");
  }

  /**
   * Get Dashboard Statistics - GET /api/dashboard/statistics
   */
  async getDashboardStatistics() {
    return await apiClient.get("/dashboard/statistics");
  }

  // ==========================================
  // EMPLOYEE / PROFILE
  // ==========================================

  /**
   * Get Employee Profile - GET /api/employee/profile
   */
  async getEmployeeProfile() {
    return await apiClient.get("/employee/profile");
  }

  /**
   * Update Employee Profile - PUT/POST /api/employee/profile
   */
  async updateEmployeeProfile(data: Record<string, unknown>) {
    return await apiClient.post("/employee/profile", data);
  }

  /**
   * Upload Profile Avatar - POST /api/employee/profile/avatar
   */
  async uploadProfileAvatar(file: File) {
    const formData = new FormData();
    formData.append("avatar", file);
    return await apiClient.post("/employee/profile/avatar", formData);
  }

  // ==========================================
  // ATTENDANCE (ABSENSI)
  // ==========================================

  /**
   * Clock In - POST /api/attendance/clock-in
   */
  async clockIn(data: {
    latitude?: number;
    longitude?: number;
    location?: string;
    photo?: File | string;
  }) {
    const formData = new FormData();
    if (data.latitude) formData.append("latitude", data.latitude.toString());
    if (data.longitude) formData.append("longitude", data.longitude.toString());
    if (data.location) formData.append("location", data.location);
    if (data.photo) formData.append("photo", data.photo);

    return await apiClient.post("/attendance/clock-in", formData);
  }

  /**
   * Clock Out - POST /api/attendance/clock-out
   */
  async clockOut(data: {
    latitude?: number;
    longitude?: number;
    location?: string;
  }) {
    const formData = new FormData();
    if (data.latitude) formData.append("latitude", data.latitude.toString());
    if (data.longitude) formData.append("longitude", data.longitude.toString());
    if (data.location) formData.append("location", data.location);

    return await apiClient.post("/attendance/clock-out", formData);
  }

  /**
   * Get Attendance History - GET /api/attendance/history
   */
  async getAttendanceHistory(params?: {
    page?: number;
    per_page?: number;
    month?: string;
    year?: string;
  }) {
    return await apiClient.get("/attendance/history", params);
  }

  /**
   * Get Attendance Today - GET /api/attendance/today
   */
  async getAttendanceToday() {
    return await apiClient.get("/attendance/today");
  }

  /**
   * Get Attendance Statistics - GET /api/attendance/statistics
   */
  async getAttendanceStatistics(params?: { month?: string; year?: string }) {
    return await apiClient.get("/attendance/statistics", params);
  }

  /**
   * Get Attendance Detail - GET /api/attendance/{id}
   */
  async getAttendanceDetail(id: number) {
    return await apiClient.get(`/attendance/${id}`);
  }

  // ==========================================
  // LEAVE / CUTI
  // ==========================================

  /**
   * Get Leave Requests - GET /api/leave-requests
   */
  async getLeaveRequests(params?: {
    page?: number;
    per_page?: number;
    status?: string;
  }) {
    return await apiClient.get("/leave-requests", params);
  }

  /**
   * Create Leave Request - POST /api/leave-requests
   */
  async createLeaveRequest(data: {
    leave_type: string;
    start_date: string;
    end_date: string;
    reason: string;
    attachment?: File;
  }) {
    const formData = new FormData();
    formData.append("leave_type", data.leave_type);
    formData.append("start_date", data.start_date);
    formData.append("end_date", data.end_date);
    formData.append("reason", data.reason);
    if (data.attachment) formData.append("attachment", data.attachment);

    return await apiClient.post("/leave-requests", formData);
  }

  /**
   * Get Leave Request Detail - GET /api/leave-requests/{id}
   */
  async getLeaveRequestDetail(id: number) {
    return await apiClient.get(`/leave-requests/${id}`);
  }

  /**
   * Update Leave Request - PUT/POST /api/leave-requests/{id}
   */
  async updateLeaveRequest(id: number, data: Record<string, unknown>) {
    return await apiClient.post(`/leave-requests/${id}`, data);
  }

  /**
   * Delete Leave Request - DELETE /api/leave-requests/{id}
   */
  async deleteLeaveRequest(id: number) {
    return await apiClient.delete(`/leave-requests/${id}`);
  }

  /**
   * Get Leave Balance - GET /api/leave-balance
   */
  async getLeaveBalance() {
    return await apiClient.get("/leave-balance");
  }

  // ==========================================
  // OVERTIME / LEMBUR
  // ==========================================

  /**
   * Get Overtime Requests - GET /api/overtime-requests
   */
  async getOvertimeRequests(params?: {
    page?: number;
    per_page?: number;
    status?: string;
  }) {
    return await apiClient.get("/overtime-requests", params);
  }

  /**
   * Create Overtime Request - POST /api/overtime-requests
   */
  async createOvertimeRequest(data: {
    date: string;
    start_time: string;
    end_time: string;
    reason: string;
  }) {
    const formData = new FormData();
    formData.append("date", data.date);
    formData.append("start_time", data.start_time);
    formData.append("end_time", data.end_time);
    formData.append("reason", data.reason);

    return await apiClient.post("/overtime-requests", formData);
  }

  /**
   * Get Overtime Request Detail - GET /api/overtime-requests/{id}
   */
  async getOvertimeRequestDetail(id: number) {
    return await apiClient.get(`/overtime-requests/${id}`);
  }

  /**
   * Update Overtime Request - PUT/POST /api/overtime-requests/{id}
   */
  async updateOvertimeRequest(id: number, data: Record<string, unknown>) {
    return await apiClient.post(`/overtime-requests/${id}`, data);
  }

  /**
   * Delete Overtime Request - DELETE /api/overtime-requests/{id}
   */
  async deleteOvertimeRequest(id: number) {
    return await apiClient.delete(`/overtime-requests/${id}`);
  }

  // ==========================================
  // PERMISSION / IZIN
  // ==========================================

  /**
   * Get Permission Requests - GET /api/permission-requests
   */
  async getPermissionRequests(params?: {
    page?: number;
    per_page?: number;
    status?: string;
  }) {
    return await apiClient.get("/permission-requests", params);
  }

  /**
   * Create Permission Request - POST /api/permission-requests
   */
  async createPermissionRequest(data: {
    type: string;
    date: string;
    reason: string;
    attachment?: File;
  }) {
    const formData = new FormData();
    formData.append("type", data.type);
    formData.append("date", data.date);
    formData.append("reason", data.reason);
    if (data.attachment) formData.append("attachment", data.attachment);

    return await apiClient.post("/permission-requests", formData);
  }

  /**
   * Get Permission Request Detail - GET /api/permission-requests/{id}
   */
  async getPermissionRequestDetail(id: number) {
    return await apiClient.get(`/permission-requests/${id}`);
  }

  /**
   * Delete Permission Request - DELETE /api/permission-requests/{id}
   */
  async deletePermissionRequest(id: number) {
    return await apiClient.delete(`/permission-requests/${id}`);
  }

  // ==========================================
  // PAYSLIP / SLIP GAJI
  // ==========================================

  /**
   * Get Payslips - GET /api/payslips
   */
  async getPayslips(params?: { page?: number; per_page?: number }) {
    return await apiClient.get("/payslips", params);
  }

  /**
   * Get Payslip Detail - GET /api/payslips/{id}
   */
  async getPayslipDetail(id: number) {
    return await apiClient.get(`/payslips/${id}`);
  }

  /**
   * Download Payslip PDF - GET /api/payslips/{id}/pdf
   */
  async downloadPayslipPDF(id: number) {
    return await apiClient.get(`/payslips/${id}/pdf`);
  }

  // ==========================================
  // DOCUMENTS / DOKUMEN
  // ==========================================

  /**
   * Get Documents - GET /api/documents
   */
  async getDocuments(params?: {
    page?: number;
    per_page?: number;
    category?: string;
  }) {
    return await apiClient.get("/documents", params);
  }

  /**
   * Get Document Detail - GET /api/documents/{id}
   */
  async getDocumentDetail(id: number) {
    return await apiClient.get(`/documents/${id}`);
  }

  /**
   * Upload Document - POST /api/documents
   */
  async uploadDocument(data: {
    title: string;
    description?: string;
    category: string;
    file: File;
  }) {
    const formData = new FormData();
    formData.append("title", data.title);
    if (data.description) formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("file", data.file);

    return await apiClient.post("/documents", formData);
  }

  /**
   * Download Document - GET /api/documents/{id}/download
   */
  async downloadDocument(id: number) {
    return await apiClient.get(`/documents/${id}/download`);
  }

  /**
   * Delete Document - DELETE /api/documents/{id}
   */
  async deleteDocument(id: number) {
    return await apiClient.delete(`/documents/${id}`);
  }

  // ==========================================
  // ANNOUNCEMENTS / PENGUMUMAN
  // ==========================================

  /**
   * Get Announcements - GET /api/announcements
   */
  async getAnnouncements(params?: { page?: number; per_page?: number }) {
    return await apiClient.get("/announcements", params);
  }

  /**
   * Get Announcement Detail - GET /api/announcements/{id}
   */
  async getAnnouncementDetail(id: number) {
    return await apiClient.get(`/announcements/${id}`);
  }

  // ==========================================
  // CALENDAR / EVENTS
  // ==========================================

  /**
   * Get Calendar Events - GET /api/calendar/events
   */
  async getCalendarEvents(params?: { month?: string; year?: string }) {
    return await apiClient.get("/calendar/events", params);
  }

  /**
   * Get Event Detail - GET /api/calendar/events/{id}
   */
  async getEventDetail(id: number) {
    return await apiClient.get(`/calendar/events/${id}`);
  }

  // ==========================================
  // NOTIFICATIONS
  // ==========================================

  /**
   * Get Notifications - GET /api/notifications
   */
  async getNotifications(params?: { page?: number; per_page?: number }) {
    return await apiClient.get("/notifications", params);
  }

  /**
   * Mark Notification as Read - POST /api/notifications/{id}/read
   */
  async markNotificationAsRead(id: number) {
    return await apiClient.post(`/notifications/${id}/read`);
  }

  /**
   * Mark All Notifications as Read - POST /api/notifications/mark-all-read
   */
  async markAllNotificationsAsRead() {
    return await apiClient.post("/notifications/mark-all-read");
  }

  /**
   * Delete Notification - DELETE /api/notifications/{id}
   */
  async deleteNotification(id: number) {
    return await apiClient.delete(`/notifications/${id}`);
  }

  // ==========================================
  // SETTINGS
  // ==========================================

  /**
   * Get Settings - GET /api/settings
   */
  async getSettings() {
    return await apiClient.get("/settings");
  }

  /**
   * Update Settings - POST /api/settings
   */
  async updateSettings(data: Record<string, unknown>) {
    return await apiClient.post("/settings", data);
  }

  /**
   * Change Password - POST /api/change-password
   */
  async changePassword(data: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }) {
    return await apiClient.post("/change-password", data);
  }
}

export default new HakunamataAPIService();
