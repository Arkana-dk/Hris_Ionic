// Employee Types
export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  position: string;
  department: string;
  joinDate: string;
  status: "active" | "inactive" | "on-leave";
  salary?: number;
  manager?: string;
}

// Attendance Types
export interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  status: "present" | "late" | "absent" | "half-day";
  workHours?: number;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

export interface AttendanceSummary {
  present: number;
  absent: number;
  late: number;
  halfDay: number;
  totalWorkHours: number;
}

// Leave Types
export interface Leave {
  id: string;
  employeeId: string;
  type: "annual" | "sick" | "emergency" | "unpaid" | "maternity" | "paternity";
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  appliedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  documents?: string[];
}

export interface LeaveBalance {
  annual: number;
  sick: number;
  emergency: number;
  total: number;
}

// Payroll Types
export interface Payslip {
  id: string;
  employeeId: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: {
    name: string;
    amount: number;
  }[];
  deductions: {
    name: string;
    amount: number;
  }[];
  grossSalary: number;
  netSalary: number;
  status: "draft" | "processed" | "paid";
  paymentDate?: string;
}

// Performance Types
export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewerId: string;
  period: string;
  overallRating: number;
  categories: {
    name: string;
    rating: number;
    comments: string;
  }[];
  strengths: string[];
  improvements: string[];
  goals: string[];
  status: "draft" | "submitted" | "completed";
  createdDate: string;
}

// Announcement Types
export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: "general" | "hr" | "it" | "event" | "policy";
  priority: "low" | "medium" | "high";
  publishDate: string;
  expiryDate?: string;
  author: string;
  attachments?: string[];
  readBy?: string[];
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description: string;
  type: "meeting" | "training" | "holiday" | "birthday" | "team-building";
  startTime: string;
  endTime: string;
  location?: string;
  attendees?: string[];
  organizer: string;
  isAllDay?: boolean;
}

// Quick Action Types
export interface QuickAction {
  id: string;
  name: string;
  icon: string;
  color: string;
  route: string;
  badge?: number;
}

// Statistics Types
export interface DashboardStats {
  attendance: {
    today: "present" | "absent" | "not-clocked";
    thisMonth: AttendanceSummary;
  };
  leave: {
    available: number;
    used: number;
    pending: number;
  };
  upcomingEvents: Event[];
  recentAnnouncements: Announcement[];
}
