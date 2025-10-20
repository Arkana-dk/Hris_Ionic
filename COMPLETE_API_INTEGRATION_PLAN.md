# 📱 Complete API Integration - HRIS Mobile App

## 🎯 **TUJUAN:**

Integrasikan **SEMUA fitur mobile app** dengan API backend hakunamatata.my.id untuk mengambil **data user yang login** secara dynamic.

---

## 📊 **API ENDPOINTS YANG DIBUTUHKAN:**

### **1. 🔐 Authentication APIs**

```typescript
POST / api / login; // Login user
POST / api / logout; // Logout user
GET / api / me; // Get current logged in user
POST / api / refresh - token; // Refresh token (optional)
POST / api / forgot - password; // Forgot password
POST / api / reset - password; // Reset password
```

**Response Example (Login Success):**

```json
{
  "data": {
    "token": "1|abc123def456...",
    "user": {
      "id": 1,
      "employee_id": "EMP-2024-001",
      "name": "John Doe",
      "email": "john@company.com",
      "phone": "+62812345678",
      "position": "Officer",
      "department": "IT",
      "company": "PT. Hakuna Matata",
      "join_date": "2024-01-15",
      "avatar": "https://hakunamatata.my.id/storage/avatars/user1.jpg"
    }
  }
}
```

---

### **2. 👤 Profile / Employee APIs**

```typescript
GET / api / employee / profile; // Get logged-in user profile
PUT / api / employee / profile; // Update profile
POST / api / employee / profile / avatar; // Upload profile photo
GET / api / employee / documents; // Get user documents
POST / api / employee / documents; // Upload document
```

**Response Example (Profile):**

```json
{
  "data": {
    "id": 1,
    "employee_id": "EMP-2024-001",
    "name": "John Doe",
    "email": "john@company.com",
    "phone": "+62812345678",
    "position": "Officer",
    "department": "IT",
    "company": "PT. Hakuna Matata",
    "join_date": "2024-01-15",
    "birth_date": "1990-05-15",
    "address": "Jl. Raya No. 123",
    "city": "Jakarta",
    "avatar": "https://...",
    "salary": 5000000,
    "status": "active"
  }
}
```

---

### **3. ⏰ Attendance APIs**

```typescript
GET / api / employee / attendance; // Today's attendance status
POST / api / employee / attendance; // Clock in/out
GET / api / employee / attendance / history; // Attendance history
GET / api / employee / attendance / statistics; // Monthly statistics
POST / api / employee / attendance / request; // Request attendance correction
GET / api / employee / attendance / requests; // List of requests
```

**Response Example (Today's Attendance):**

```json
{
  "data": {
    "date": "2025-10-19",
    "clock_in": "08:00:00",
    "clock_out": null,
    "status": "working",
    "duration": "02:30:00",
    "location": "Office",
    "latitude": -6.2,
    "longitude": 106.816666,
    "notes": null,
    "is_late": false
  }
}
```

**Response Example (History):**

```json
{
  "data": [
    {
      "id": 1,
      "date": "2025-10-19",
      "clock_in": "08:00:00",
      "clock_out": "17:00:00",
      "status": "present",
      "duration": "09:00:00",
      "is_late": false
    },
    {
      "id": 2,
      "date": "2025-10-18",
      "clock_in": "08:15:00",
      "clock_out": "17:00:00",
      "status": "present",
      "duration": "08:45:00",
      "is_late": true
    }
  ],
  "meta": {
    "total": 20,
    "current_page": 1,
    "per_page": 10
  }
}
```

**Response Example (Statistics):**

```json
{
  "data": {
    "month": "October 2025",
    "total_days": 31,
    "working_days": 22,
    "present_days": 20,
    "late_days": 3,
    "absent_days": 2,
    "total_hours": "180:00:00",
    "average_hours": "09:00:00"
  }
}
```

---

### **4. 🏖️ Leave Management APIs**

```typescript
GET / api / employee / cuti; // Get leave requests
POST / api / employee / cuti; // Submit leave request
GET / api / employee / cuti / { id }; // Get leave detail
PUT / api / employee / cuti / { id }; // Update leave request
DELETE / api / employee / cuti / { id }; // Cancel leave request
GET / api / employee / cuti / history; // Leave history
GET / api / employee / leave - balance; // Leave balance/quota
GET / api / employee / leave - types; // Available leave types
```

**Response Example (Leave Balance):**

```json
{
  "data": {
    "annual_leave": {
      "total": 12,
      "used": 5,
      "remaining": 7
    },
    "sick_leave": {
      "total": 12,
      "used": 2,
      "remaining": 10
    },
    "emergency_leave": {
      "total": 3,
      "used": 1,
      "remaining": 2
    }
  }
}
```

**Response Example (Leave Requests):**

```json
{
  "data": [
    {
      "id": 1,
      "employee_id": 1,
      "type": "annual",
      "start_date": "2025-10-25",
      "end_date": "2025-10-27",
      "days": 3,
      "reason": "Family vacation",
      "status": "pending",
      "applied_date": "2025-10-19",
      "approved_by": null,
      "approved_date": null
    }
  ]
}
```

---

### **5. ⏱️ Overtime APIs**

```typescript
GET / api / employee / overtime - request; // Get overtime requests
POST / api / employee / overtime - request; // Submit overtime request
GET / api / employee / overtime - request / { id }; // Get overtime detail
GET / api / employee / overtime - request / history; // Overtime history
```

**Response Example:**

```json
{
  "data": [
    {
      "id": 1,
      "employee_id": 1,
      "date": "2025-10-19",
      "start_time": "17:00:00",
      "end_time": "20:00:00",
      "duration": "03:00:00",
      "reason": "Project deadline",
      "status": "approved",
      "approved_by": "Manager Name",
      "approved_date": "2025-10-19"
    }
  ]
}
```

---

### **6. 💰 Payroll / Payslip APIs**

```typescript
GET / api / employee / payslip; // Get payslips
GET / api / employee / payslip / { id }; // Get payslip detail
GET / api / employee / payslip / { id } / pdf; // Download payslip PDF
GET / api / employee / payslip / history; // Payslip history
GET / api / employee / salary - info; // Salary information
```

**Response Example (Payslip):**

```json
{
  "data": {
    "id": 1,
    "employee_id": 1,
    "month": 10,
    "year": 2025,
    "period": "October 2025",
    "basic_salary": 5000000,
    "allowances": {
      "transport": 500000,
      "meal": 300000,
      "health_insurance": 200000
    },
    "deductions": {
      "tax": 500000,
      "pension": 250000,
      "insurance": 100000
    },
    "gross_salary": 6000000,
    "total_deductions": 850000,
    "net_salary": 5150000,
    "status": "paid",
    "payment_date": "2025-10-25"
  }
}
```

---

### **7. 📊 Dashboard / Statistics APIs**

```typescript
GET / api / employee / dashboard; // Dashboard data
GET / api / employee / statistics; // Employee statistics
GET / api / employee / announcements; // Company announcements
GET / api / employee / upcoming - events; // Upcoming events
```

**Response Example (Dashboard):**

```json
{
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "position": "Officer",
      "avatar": "https://..."
    },
    "today_attendance": {
      "status": "working",
      "clock_in": "08:00:00",
      "duration": "02:30:00"
    },
    "statistics": {
      "attendance_rate": 95,
      "leave_balance": 7,
      "total_hours_month": 180,
      "performance_rating": 4.5
    },
    "upcoming_events": [
      {
        "id": 1,
        "title": "Company Meeting",
        "date": "2025-10-20",
        "time": "10:00:00",
        "location": "Meeting Room A"
      }
    ],
    "announcements": [
      {
        "id": 1,
        "title": "Holiday Notice",
        "message": "Office will be closed on...",
        "date": "2025-10-15"
      }
    ]
  }
}
```

---

### **8. 📅 Calendar / Schedule APIs**

```typescript
GET / api / employee / calendar; // Work calendar
GET / api / employee / shifts; // Shift schedule
GET / api / employee / holidays; // Public holidays
```

---

### **9. 📄 Documents APIs**

```typescript
GET / api / employee / documents; // Get documents
POST / api / employee / documents; // Upload document
GET / api / employee / documents / { id }; // Get document detail
DELETE / api / employee / documents / { id }; // Delete document
GET / api / employee / documents / { id } / download; // Download document
```

---

### **10. 🔔 Notifications APIs**

```typescript
GET / api / employee / notifications; // Get notifications
POST / api / employee / notifications / { id } / read; // Mark as read
DELETE / api / employee / notifications / { id }; // Delete notification
GET / api / employee / notifications / unread - count; // Unread count
```

---

## 🎯 **FLOW DATA DI MOBILE APP:**

### **1. Login Flow:**

```
User Login (email + password)
    ↓
POST /api/login
    ↓
Receive Token + User Data
    ↓
Save to localStorage:
  - auth_token
  - user (full user object)
    ↓
Redirect to Dashboard
```

### **2. Dashboard Flow:**

```
Dashboard Load
    ↓
GET /api/employee/dashboard
    ↓
Display:
  - User info (name, position, avatar)
  - Today's attendance status
  - Statistics (attendance, leave, hours)
  - Upcoming events
  - Announcements
```

### **3. Profile Flow:**

```
Profile Page Load
    ↓
GET /api/employee/profile
    ↓
Display:
  - Personal info
  - Contact info
  - Employment info
  - Documents
    ↓
User can update:
  PUT /api/employee/profile
  POST /api/employee/profile/avatar
```

### **4. Attendance Flow:**

```
Attendance Page Load
    ↓
GET /api/employee/attendance (today)
GET /api/employee/attendance/statistics
    ↓
Display:
  - Current status (working/not working)
  - Clock in/out time
  - Duration
  - Monthly statistics
    ↓
User Clock In/Out:
  POST /api/employee/attendance
  (with GPS coordinates)
```

### **5. Leave Request Flow:**

```
Pengajuan Page Load
    ↓
GET /api/employee/leave-balance
    ↓
Display leave quota
    ↓
User Submit Leave:
  POST /api/employee/cuti
  {
    type: "annual",
    start_date: "2025-10-25",
    end_date: "2025-10-27",
    reason: "..."
  }
    ↓
Show success/error
```

### **6. Payslip Flow:**

```
Payslip Page Load
    ↓
GET /api/employee/payslip
    ↓
Display list of payslips
    ↓
User Click Detail:
  GET /api/employee/payslip/{id}
    ↓
Display full breakdown
    ↓
User Download PDF:
  GET /api/employee/payslip/{id}/pdf
```

---

## 🔒 **AUTHENTICATION FLOW:**

### **How Token Works:**

```typescript
// 1. Login
const response = await api.post('/login', { email, password });
const { token, user } = response.data.data;

// 2. Save token
localStorage.setItem('auth_token', token);
localStorage.setItem('user', JSON.stringify(user));

// 3. Every API request includes token
headers: {
  'Authorization': `Bearer ${token}`
}

// 4. Backend validates token and returns user-specific data
// Backend automatically knows which user from token
```

### **User-Specific Data:**

Semua endpoint yang ada `/api/employee/*` akan **otomatis** return data untuk user yang login berdasarkan token.

**Backend logic:**

```php
// Laravel example
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/employee/profile', function (Request $request) {
        // $request->user() = user yang login
        return $request->user();
    });

    Route::get('/employee/attendance', function (Request $request) {
        // Ambil attendance hanya untuk user yang login
        return Attendance::where('employee_id', $request->user()->id)->get();
    });
});
```

---

## 📱 **PAGES & API MAPPING:**

| Page           | API Endpoints                              | Data Displayed                  |
| -------------- | ------------------------------------------ | ------------------------------- |
| **Login**      | POST /api/login                            | Token, User basic info          |
| **Dashboard**  | GET /api/employee/dashboard                | Stats, attendance today, events |
| **Profile**    | GET /api/employee/profile                  | Full user profile               |
|                | POST /api/employee/profile/avatar          | Update avatar                   |
| **Attendance** | GET /api/employee/attendance               | Today's status                  |
|                | POST /api/employee/attendance              | Clock in/out                    |
|                | GET /api/employee/attendance/history       | History list                    |
|                | GET /api/employee/attendance/statistics    | Monthly stats                   |
| **Pengajuan**  | GET /api/employee/leave-balance            | Leave quota                     |
|                | POST /api/employee/cuti                    | Submit leave                    |
|                | POST /api/employee/overtime-request        | Submit overtime                 |
| **History**    | GET /api/employee/cuti/history             | Leave history                   |
|                | GET /api/employee/overtime-request/history | Overtime history                |
|                | GET /api/employee/attendance/requests      | Request status                  |
| **Payslip**    | GET /api/employee/payslip                  | Payslip list                    |
|                | GET /api/employee/payslip/{id}             | Detail                          |
|                | GET /api/employee/payslip/{id}/pdf         | Download                        |
| **Kalender**   | GET /api/employee/calendar                 | Schedule                        |
|                | GET /api/employee/shifts                   | Shifts                          |
|                | GET /api/employee/holidays                 | Holidays                        |
| **Documents**  | GET /api/employee/documents                | Document list                   |

---

## 🚀 **IMPLEMENTATION PLAN:**

### **Phase 1: Core Authentication** ✅

- [x] Login API integration
- [x] Token management
- [x] User data storage
- [x] Protected routes

### **Phase 2: Dashboard** (Next)

- [ ] Fetch dashboard data
- [ ] Display user info dynamically
- [ ] Show today's attendance
- [ ] Display statistics
- [ ] Show events & announcements

### **Phase 3: Profile**

- [ ] Fetch profile data
- [ ] Display profile info
- [ ] Upload avatar
- [ ] Update profile

### **Phase 4: Attendance**

- [ ] Fetch today's attendance
- [ ] Clock in/out functionality
- [ ] GPS location capture
- [ ] Attendance history
- [ ] Monthly statistics

### **Phase 5: Leave & Overtime**

- [ ] Fetch leave balance
- [ ] Submit leave request
- [ ] Submit overtime request
- [ ] Request history

### **Phase 6: Payslip**

- [ ] Fetch payslip list
- [ ] Display payslip detail
- [ ] Download PDF

### **Phase 7: Additional Features**

- [ ] Calendar/schedule
- [ ] Documents
- [ ] Notifications

---

## 📝 **NEXT STEPS:**

1. **Verify API Endpoints** dengan backend team
2. **Test each endpoint** dengan curl/Postman
3. **Implement phase by phase**
4. **Test dengan user real**

Apakah Anda siap untuk saya mulai implementasi?  
Atau ada endpoint tambahan yang perlu saya tambahkan?
