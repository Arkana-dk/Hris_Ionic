/**
 * Format helpers
 */
export * from "./helpers";

/**
 * Constants
 */
export const APP_NAME = "HRIS App";
export const APP_VERSION = "1.0.0";

export const LEAVE_TYPES = {
  ANNUAL: "annual",
  SICK: "sick",
  EMERGENCY: "emergency",
  UNPAID: "unpaid",
  MATERNITY: "maternity",
  PATERNITY: "paternity",
} as const;

export const ATTENDANCE_STATUS = {
  PRESENT: "present",
  LATE: "late",
  ABSENT: "absent",
  HALF_DAY: "half-day",
} as const;

export const LEAVE_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export const PAYSLIP_STATUS = {
  DRAFT: "draft",
  PROCESSED: "processed",
  PAID: "paid",
} as const;
