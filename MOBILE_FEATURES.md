# 📱 HRIS Mobile App - User Features Documentation

## 🎯 Overview

Mobile HRIS Application untuk **Employee/User** dengan fitur yang relevan untuk akses dari smartphone. Backend menggunakan Laravel HRIS system.

---

## ✨ FITUR YANG SUDAH DIIMPLEMENTASI

### 1. 🏠 **Dashboard**

**Path:** `/dashboard`
**File:** `src/features/dashboard/DashboardPage.tsx`

**Fitur:**

- ✅ User Profile Header (nama, posisi, tenure)
- ✅ Animated gradient background dengan blur orbs
- ✅ What's Up Today Card (event hari ini)
- ✅ Today's Activity Stats (4 cards):
  - Clock In Time (08:45 AM)
  - Working Hours (7h 30m)
  - Leave Balance (12 days)
  - Overtime (8h this month)
- ✅ Office Services Grid (8 layanan):
  - 💵 Reimburse → `/pengajuan`
  - ✈️ Paid Leave → `/pengajuan`
  - 🕐 Overtime → `/history`
  - 💼 Assignment → `/kalender`
  - 📅 Calendar → `/kalender`
  - 📄 Document → `/history`
  - 📆 Events → `/kalender`
  - ➕ Add Proposal → `/pengajuan`
- ✅ Office News Banner (dengan link ke Payslip)
- ✅ Announcements Section

**Design:**

- Gradient colors: Violet → Indigo
- Modern card-based UI
- Smooth animations (fadeIn, stagger, pulse)
- Responsive grid layout

---

### 2. ⏰ **Attendance (Absensi)**

**Path:** `/attendance`
**File:** `src/features/attendance/AttendancePage.tsx`

**Fitur:**

- ✅ Real-time clock display
- ✅ Clock In/Out button dengan status
- ✅ Working hours counter
- ✅ GPS location verification (Jakarta Office)
- ✅ Monthly statistics:
  - Present Days (18)
  - Late Days (2)
  - Absent Days (0)
  - Total Hours (168.5h)
- ✅ Recent attendance history dengan detail:
  - Date & day
  - Clock in/out time
  - Work hours
  - Status (On Time/Late)

**Design:**

- Blue-cyan gradient theme
- Interactive clock in/out cards
- Status indicators dengan badges

---

### 3. ✈️ **Leave Request (Pengajuan)**

**Path:** `/pengajuan`
**File:** `src/features/pengajuan/PengajuanPage.tsx`

**Fitur:**

- ✅ Leave request form:
  - Jenis pengajuan (Cuti Tahunan/Sakit/Izin)
  - Start date & end date
  - Alasan/keterangan
- ✅ Leave balance display:
  - Annual leave (12 days)
  - Sick leave (8 days)
- ✅ Submit button
- ✅ Form validation

**Design:**

- Purple-pink gradient header
- Clean form layout
- Balance cards dengan icons

---

### 4. 📜 **History**

**Path:** `/history`
**File:** `src/features/history/HistoryPage.tsx`

**Fitur:**

- ✅ Tab switcher:
  - Absensi tab
  - Pengajuan tab
- ✅ Attendance history:
  - Date & status
  - Clock in/out times
  - Total work hours
- ✅ Leave request history:
  - Request type
  - Date range
  - Days count
  - Status (Approved/Pending/Rejected)
  - Reason
- ✅ Status badges dengan icons

**Design:**

- Purple-pink gradient theme
- Segmented tab navigation
- Card-based history items

---

### 5. 📅 **Calendar (Kalender)**

**Path:** `/kalender`
**File:** `src/features/kalender/KalenderPage.tsx`

**Fitur:**

- ✅ Interactive calendar view
- ✅ Month navigation (prev/next)
- ✅ Current date highlight
- ✅ Event indicators pada tanggal
- ✅ Today's events list:
  - Event icon & color coding
  - Event title & time
- ✅ Upcoming events section
- ✅ Event categories:
  - Meeting (purple)
  - Leave (blue)
  - Holiday (red)
  - Assignment (green)

**Design:**

- Blue-cyan gradient theme
- Calendar grid dengan hari libur
- Event cards dengan icons

---

### 6. 💰 **Payslip (NEW!)**

**Path:** `/payslip`
**File:** `src/features/payslip/PayslipPage.tsx`

**Fitur:**

- ✅ Latest payslip highlight card:
  - Month & year
  - Net salary display
  - View details button
  - Download PDF button
- ✅ Payslip history list:
  - Period & date range
  - Net salary amount
  - Status (Paid/Pending/Processing)
  - Click to view details
- ✅ Detailed payslip modal:
  - **Earnings breakdown:**
    - Basic Salary (Rp 10,000,000)
    - Transport Allowance (Rp 1,000,000)
    - Meal Allowance (Rp 500,000)
    - Position Allowance (Rp 1,500,000)
    - Overtime (Rp 1,500,000)
    - Bonus (Rp 500,000)
    - **Gross Salary** (Rp 15,000,000)
  - **Deductions breakdown:**
    - Income Tax (Rp 1,500,000)
    - Health Insurance (Rp 500,000)
    - Loan Repayment (Rp 250,000)
  - **Net Salary (Take Home):** Rp 12,750,000
  - Download PDF functionality
- ✅ Status tracking (Paid date)
- ✅ Currency formatting (IDR)

**Design:**

- Emerald-teal gradient theme
- Premium card design untuk latest payslip
- Detailed modal dengan organized sections
- Color-coded earnings (green) vs deductions (red)

---

### 7. 👤 **Profile**

**Path:** `/profile`
**File:** `src/features/profile/ProfilePage.tsx`

**Fitur:**

- ✅ User avatar
- ✅ Contact information
- ✅ Settings menu
- ✅ Logout button

---

## 🎨 Design System

### Color Palette:

- **Primary:** Violet → Indigo (#8B5CF6 → #6366F1)
- **Attendance:** Blue → Cyan (#3B82F6 → #06B6D4)
- **Leave:** Purple → Pink (#A855F7 → #EC4899)
- **Payslip:** Emerald → Teal (#10B981 → #14B8A6)
- **Calendar:** Blue → Indigo (#3B82F6 → #6366F1)

### Animations:

- `fadeIn` - Smooth appearance
- `fadeInDown` - Header entrance
- `fadeInUp` - Card entrance from bottom
- `stagger` - Sequential item animation
- `scaleIn` - Scale up effect
- `hover-lift` - Elevation on hover
- `pulse` - Breathing effect
- `transition-smooth` - 300ms ease transition

### Components:

- Gradient headers dengan decorative blur orbs
- Rounded cards (rounded-xl, rounded-2xl)
- Shadow system (shadow-md, shadow-lg, shadow-xl)
- Icon-based navigation
- Status badges dengan colors
- Modern form inputs

---

## 📊 Data Structure

### Employee:

```typescript
{
  name: string;
  position: string;
  tenure: string;
  avatar: string;
  employeeId: string;
}
```

### Attendance:

```typescript
{
  date: string;
  clockIn: string;
  clockOut: string;
  workHours: number;
  status: "present" | "late" | "absent";
}
```

### Leave Request:

```typescript
{
  type: "Cuti Tahunan" | "Cuti Sakit" | "Izin";
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "approved" | "pending" | "rejected";
}
```

### Payslip:

```typescript
{
  id: string;
  month: string;
  year: number;
  period: string;
  grossSalary: number;
  netSalary: number;
  status: "paid" | "pending" | "processing";
  components: {
    basicSalary: number;
    allowances: {
      transport: number;
      meal: number;
      position: number;
    }
    deductions: {
      tax: number;
      insurance: number;
      loan: number;
    }
    overtime: number;
    bonus: number;
  }
}
```

---

## 🚀 Next Steps (Belum Diimplementasi)

### 8. 📄 **Documents**

- Kontrak kerja
- Sertifikat training
- Company policies
- Download functionality

### 9. 🔔 **Notifications**

- Push notifications
- In-app notification center
- Badge counter
- Read/unread status

### 10. ⚙️ **Settings**

- Theme toggle (light/dark)
- Language selection
- Notification preferences
- Biometric authentication

### 11. 🌐 **Backend Integration**

- API endpoints dari Laravel HRIS
- JWT Authentication
- Real-time data sync
- Offline mode dengan local storage

---

## 📱 Navigation Structure

```
App.tsx
├── /dashboard (Home) - Dashboard with stats
├── /attendance - Clock in/out
├── /profile - User profile
└── Additional Routes:
    ├── /pengajuan - Leave request
    ├── /history - History tracking
    ├── /kalender - Calendar events
    └── /payslip - Salary slips
```

### Tab Bar (Bottom Navigation):

1. **Home** - Dashboard (homeOutline/home)
2. **Attendance** - Clock in/out (timeOutline/time)
3. **Profile** - User info (personOutline/person)

---

## 🎯 Target Users

**Karyawan/Employee** yang ingin:

- ✅ Absen dari smartphone
- ✅ Cek saldo cuti & ajukan cuti
- ✅ Lihat slip gaji
- ✅ Track jam kerja & lembur
- ✅ Lihat jadwal & event
- ✅ Akses dokumen penting

---

## 💻 Tech Stack

- **Framework:** Ionic React 8.x
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS 3.x
- **Icons:** Ionicons 7.x
- **Routing:** React Router 5.x
- **Build Tool:** Vite 5.x
- **Backend (Planned):** Laravel API with JWT

---

## 📝 Notes

- Semua data saat ini adalah **dummy/mock data**
- Perlu integrasi dengan **Laravel HRIS Backend**
- GPS location untuk absensi perlu implementasi native
- Push notification perlu Capacitor plugin
- PDF download untuk payslip perlu library tambahan

---

**Created by:** Copilot AI Assistant
**Date:** October 18, 2025
**Version:** 2.0 (Mobile Employee App)
