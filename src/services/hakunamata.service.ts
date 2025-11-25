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
   * Clock In - POST /api/employee/attendance
   */
  async clockIn(data: {
    latitude?: number;
    longitude?: number;
    location?: string;
    photo?: File | string;
  }) {
    const formData = new FormData();
    if (data.latitude)
      formData.append("check_in_latitude", data.latitude.toString());
    if (data.longitude)
      formData.append("check_in_longitude", data.longitude.toString());
    if (data.location) formData.append("check_in_location", data.location);
    if (data.photo) formData.append("photo", data.photo);

    return await apiClient.post("/employee/attendance", formData);
  }

  /**
   * Clock Out - POST /api/employee/attendance
   */
  async clockOut(data: {
    latitude?: number;
    longitude?: number;
    location?: string;
  }) {
    const formData = new FormData();
    if (data.latitude)
      formData.append("check_out_latitude", data.latitude.toString());
    if (data.longitude)
      formData.append("check_out_longitude", data.longitude.toString());
    if (data.location) formData.append("check_out_location", data.location);

    return await apiClient.post("/employee/attendance", formData);
  }

  /**
   * Get Attendance History - GET /api/employee/attendance/history
   */
  async getAttendanceHistory(params?: {
    page?: number;
    per_page?: number;
    month?: string;
    year?: string;
  }) {
    return await apiClient.get("/employee/attendance/history", params);
  }

  /**
   * Get Attendance Today - GET /api/employee/attendance
   */
  async getAttendanceToday() {
    return await apiClient.get("/employee/attendance");
  }

  /**
   * Get Attendance Statistics - GET /api/employee/attendance/statistics
   */
  async getAttendanceStatistics(params?: { month?: string; year?: string }) {
    return await apiClient.get("/employee/attendance/statistics", params);
  }

  /**
   * Get Attendance Detail - GET /api/employee/attendance/{id}
   */
  async getAttendanceDetail(id: number) {
    return await apiClient.get(`/employee/attendance/${id}`);
  }

  // ==========================================
  // LEAVE / CUTI
  // ==========================================

  /**
   * Get Leave Requests - GET /api/employee/leave-requests
   */
  async getLeaveRequests(params?: {
    page?: number;
    per_page?: number;
    status?: string;
  }) {
    return await apiClient.get("/employee/leave-requests", params);
  }

  /**
   * Create Leave Request - POST /api/employee/leave-requests
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

    return await apiClient.post("/employee/leave-requests", formData);
  }

  /**
   * Get Leave Request Detail - GET /api/employee/leave-requests/{id}
   */
  async getLeaveRequestDetail(id: number) {
    return await apiClient.get(`/employee/leave-requests/${id}`);
  }

  /**
   * Update Leave Request - PUT/POST /api/employee/leave-requests/{id}
   */
  async updateLeaveRequest(id: number, data: Record<string, unknown>) {
    return await apiClient.post(`/employee/leave-requests/${id}`, data);
  }

  /**
   * Delete Leave Request - DELETE /api/employee/leave-requests/{id}
   */
  async deleteLeaveRequest(id: number) {
    return await apiClient.delete(`/employee/leave-requests/${id}`);
  }

  /**
   * Get Leave Balance - GET /api/employee/leave-balance
   */
  async getLeaveBalance() {
    return await apiClient.get("/employee/leave-balance");
  }

  // ==========================================
  // OVERTIME / LEMBUR
  // ==========================================

  /**
   * Get Overtime Requests - GET /api/employee/overtime-requests
   */
  async getOvertimeRequests(params?: {
    page?: number;
    per_page?: number;
    status?: string;
  }) {
    return await apiClient.get("/employee/overtime-requests", params);
  }

  /**
   * Create Overtime Request - POST /api/employee/overtime-requests
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

    return await apiClient.post("/employee/overtime-requests", formData);
  }

  /**
   * Get Overtime Request Detail - GET /api/employee/overtime-requests/{id}
   */
  async getOvertimeRequestDetail(id: number) {
    return await apiClient.get(`/employee/overtime-requests/${id}`);
  }

  /**
   * Update Overtime Request - PUT/POST /api/employee/overtime-requests/{id}
   */
  async updateOvertimeRequest(id: number, data: Record<string, unknown>) {
    return await apiClient.post(`/employee/overtime-requests/${id}`, data);
  }

  /**
   * Delete Overtime Request - DELETE /api/employee/overtime-requests/{id}
   */
  async deleteOvertimeRequest(id: number) {
    return await apiClient.delete(`/employee/overtime-requests/${id}`);
  }

  // ==========================================
  // PAYSLIP / SLIP GAJI
  // ==========================================

  /**
   * Get Payslips - GET /api/employee/payslip
   */
  async getPayslips(params?: { page?: number; per_page?: number }) {
    return await apiClient.get("/employee/payslip", params);
  }

  /**
   * Get Payslip Detail - GET /api/employee/payslip/{id}
   */
  async getPayslipDetail(id: number) {
    return await apiClient.get(`/employee/payslip/${id}`);
  }

  /**
   * Download Payslip PDF - GET /api/employee/payslip/{id}/pdf
   */
  async downloadPayslipPDF(id: number) {
    return await apiClient.get(`/employee/payslip/${id}/pdf`);
  }

  // ==========================================
  // DOCUMENTS / DOKUMEN
  // ==========================================

  /**
   * Get Documents - GET /api/employee/documents
   */
  async getDocuments(params?: {
    page?: number;
    per_page?: number;
    category?: string;
  }) {
    return await apiClient.get("/employee/documents", params);
  }

  /**
   * Get Document Detail - GET /api/employee/documents/{id}
   */
  async getDocumentDetail(id: number) {
    return await apiClient.get(`/employee/documents/${id}`);
  }

  /**
   * Upload Document - POST /api/employee/documents
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

    return await apiClient.post("/employee/documents", formData);
  }

  /**
   * Download Document - GET /api/employee/documents/{id}/download
   */
  async downloadDocument(id: number) {
    return await apiClient.get(`/employee/documents/${id}/download`);
  }

  /**
   * Delete Document - DELETE /api/employee/documents/{id}
   */
  async deleteDocument(id: number) {
    return await apiClient.delete(`/employee/documents/${id}`);
  }

  // ==========================================
  // ANNOUNCEMENTS / PENGUMUMAN
  // ==========================================

  /**
   * Get Announcements - GET /api/employee/announcements
   */
  async getAnnouncements(params?: { page?: number; per_page?: number }) {
    return await apiClient.get("/employee/announcements", params);
  }

  /**
   * Get Announcement Detail - GET /api/employee/announcements/{id}
   */
  async getAnnouncementDetail(id: number) {
    return await apiClient.get(`/employee/announcements/${id}`);
  }

  // ==========================================
  // CALENDAR / EVENTS
  // ==========================================

  /**
   * Get Calendar Events - GET /api/employee/calendar/events
   */
  async getCalendarEvents(params?: { month?: string; year?: string }) {
    return await apiClient.get("/employee/calendar/events", params);
  }

  /**
   * Get Event Detail - GET /api/employee/calendar/events/{id}
   */
  async getEventDetail(id: number) {
    return await apiClient.get(`/employee/calendar/events/${id}`);
  }

  // ==========================================
  // NOTIFICATIONS
  // ==========================================

  /**
   * Get Notifications - GET /api/employee/notifications
   */
  async getNotifications(params?: { page?: number; per_page?: number }) {
    return await apiClient.get("/employee/notifications", params);
  }

  /**
   * Mark Notification as Read - POST /api/employee/notifications/{id}/read
   */
  async markNotificationAsRead(id: number) {
    return await apiClient.post(`/employee/notifications/${id}/read`);
  }

  /**
   * Mark All Notifications as Read - POST /api/employee/notifications/mark-all-read
   */
  async markAllNotificationsAsRead() {
    return await apiClient.post("/employee/notifications/mark-all-read");
  }

  /**
   * Delete Notification - DELETE /api/employee/notifications/{id}
   */
  async deleteNotification(id: number) {
    return await apiClient.delete(`/employee/notifications/${id}`);
  }

  // ==========================================
  // SETTINGS
  // ==========================================

  /**
   * Get Settings - GET /api/employee/settings
   */
  async getSettings() {
    return await apiClient.get("/employee/settings");
  }

  /**
   * Update Settings - POST /api/employee/settings
   */
  async updateSettings(data: Record<string, unknown>) {
    return await apiClient.post("/employee/settings", data);
  }

  /**
   * Change Password - POST /api/employee/change-password
   */
  async changePassword(data: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }) {
    return await apiClient.post("/employee/change-password", data);
  }
}

export default new HakunamataAPIService();
