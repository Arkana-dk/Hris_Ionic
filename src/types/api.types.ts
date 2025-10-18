// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// ============================================
// Auth Types
// ============================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  id: number;
  employee_id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  position?: string;
  department?: string;
  company?: string;
  join_date?: string;
  location?: string;
}

// ============================================
// Profile Types
// ============================================

export interface EmployeeProfile extends User {
  full_name: string;
  job_title: string;
  nik?: string;
  date_of_birth?: string;
  address?: string;
  emergency_contact?: string;
  bank_account?: string;
  shift_group?: ShiftGroup;
}

export interface ShiftGroup {
  id: number;
  name: string;
  description?: string;
}

// ============================================
// Attendance Types
// ============================================

export interface Attendance {
  id: number;
  employee_id: number;
  date: string;
  clock_in: string | null;
  clock_out: string | null;
  clock_in_location?: string;
  clock_out_location?: string;
  status: 'present' | 'late' | 'absent' | 'leave' | 'overtime';
  notes?: string;
  shift?: Shift;
  created_at: string;
  updated_at: string;
}

export interface Shift {
  id: number;
  name: string;
  code: string;
  start_time: string;
  end_time: string;
  break_duration?: number;
}

export interface AttendanceRequest {
  id: number;
  employee_id: number;
  date: string;
  type: 'izin' | 'sakit' | 'cuti' | 'telat' | 'lupa_absen';
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  attachment?: string;
  approved_by?: number;
  approved_at?: string;
  notes?: string;
  created_at: string;
}

export interface ClockInRequest {
  latitude?: number;
  longitude?: number;
  notes?: string;
}

export interface PresensiRequest {
  type: 'izin' | 'sakit' | 'cuti' | 'telat' | 'lupa_absen';
  date: string;
  reason: string;
  attachment?: File | string;
}

// ============================================
// Overtime Types
// ============================================

export interface OvertimeRequest {
  id: number;
  employee_id: number;
  date: string;
  start_time: string;
  end_time: string;
  duration: number; // in hours
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: number;
  approved_at?: string;
  notes?: string;
  created_at: string;
}

export interface CreateOvertimeRequest {
  date: string;
  start_time: string;
  end_time: string;
  reason: string;
}

// ============================================
// Leave Types
// ============================================

export interface LeaveRequest {
  id: number;
  employee_id: number;
  leave_type: 'annual' | 'sick' | 'maternity' | 'paternity' | 'unpaid' | 'other';
  start_date: string;
  end_date: string;
  duration: number; // in days
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  attachment?: string;
  approved_by?: number;
  approved_at?: string;
  notes?: string;
  created_at: string;
}

export interface CreateLeaveRequest {
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  attachment?: File | string;
}

export interface LeaveBalance {
  annual_leave: number;
  sick_leave: number;
  used_leave: number;
  remaining_leave: number;
}

// ============================================
// Payslip Types
// ============================================

export interface Payslip {
  id: number;
  employee_id: number;
  period: string;
  month: number;
  year: number;
  basic_salary: number;
  allowances: PayrollComponent[];
  deductions: PayrollComponent[];
  gross_salary: number;
  net_salary: number;
  payment_date?: string;
  payment_method?: string;
  bank_account?: string;
  status: 'draft' | 'approved' | 'paid';
  created_at: string;
}

export interface PayrollComponent {
  id: number;
  name: string;
  amount: number;
  type: 'fixed' | 'variable' | 'percentage';
}

// ============================================
// Dashboard/Statistics Types
// ============================================

export interface AttendanceStats {
  total_days: number;
  present_days: number;
  late_days: number;
  absent_days: number;
  leave_days: number;
  attendance_rate: number;
}

export interface EmployeeStats {
  attendance_rate: string;
  performance_score: string;
  completed_tasks: number;
  leave_balance: number;
}

// ============================================
// Calendar/Schedule Types
// ============================================

export interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  type: 'shift' | 'leave' | 'overtime' | 'meeting' | 'holiday';
  start_time?: string;
  end_time?: string;
  description?: string;
  location?: string;
}

// ============================================
// Error Types
// ============================================

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}
