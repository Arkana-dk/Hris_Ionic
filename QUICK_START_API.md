# 🚀 QUICK START - Hakunamatata.my.id API

## ✅ SUDAH SIAP DIGUNAKAN!

Semua API dari hakunamatata.my.id sudah terintegrasi ke project Anda!

---

## 📝 **LANGKAH CEPAT:**

### 1. Import Service

```typescript
import { hakunamataAPI } from "../services";
```

### 2. Contoh Penggunaan di Component

```typescript
import React, { useEffect, useState } from "react";
import { hakunamataAPI } from "../services";

const MyComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // GET Example
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await hakunamataAPI.getDashboard();
      setData(response.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // POST Example (Create)
  const handleSubmit = async () => {
    try {
      await hakunamataAPI.createLeaveRequest({
        leave_type: "annual",
        start_date: "2025-12-01",
        end_date: "2025-12-05",
        reason: "Family vacation",
      });
      alert("Leave request created!");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // UPDATE Example
  const handleUpdate = async (id: number) => {
    try {
      await hakunamataAPI.updateEmployeeProfile({
        phone: "08123456789",
        address: "New Address",
      });
      alert("Profile updated!");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // DELETE Example
  const handleDelete = async (id: number) => {
    try {
      await hakunamataAPI.deleteLeaveRequest(id);
      alert("Leave request deleted!");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return <div>{loading ? <p>Loading...</p> : <p>Data loaded!</p>}</div>;
};
```

---

## 🎯 **API YANG PALING SERING DIGUNAKAN:**

### Authentication

```typescript
// Login
await hakunamataAPI.login("email@example.com", "password");

// Logout
await hakunamataAPI.logout();

// Get current user
await hakunamataAPI.getCurrentUser();
```

### Dashboard

```typescript
// Get dashboard
await hakunamataAPI.getDashboard();

// Get statistics
await hakunamataAPI.getDashboardStatistics();
```

### Attendance (Absensi)

```typescript
// Clock in
await hakunamataAPI.clockIn({
  latitude: -6.2088,
  longitude: 106.8456,
  location: "Office",
});

// Clock out
await hakunamataAPI.clockOut({
  latitude: -6.2088,
  longitude: 106.8456,
  location: "Office",
});

// Get history
await hakunamataAPI.getAttendanceHistory({ page: 1 });

// Get today
await hakunamataAPI.getAttendanceToday();
```

### Leave (Cuti)

```typescript
// List leaves
await hakunamataAPI.getLeaveRequests({ page: 1 });

// Create leave
await hakunamataAPI.createLeaveRequest({
  leave_type: "annual",
  start_date: "2025-12-01",
  end_date: "2025-12-05",
  reason: "Vacation",
});

// Get balance
await hakunamataAPI.getLeaveBalance();

// Delete leave
await hakunamataAPI.deleteLeaveRequest(123);
```

### Profile

```typescript
// Get profile
await hakunamataAPI.getEmployeeProfile();

// Update profile
await hakunamataAPI.updateEmployeeProfile({
  phone: "08123456789",
  address: "New address",
});

// Upload avatar
await hakunamataAPI.uploadProfileAvatar(imageFile);
```

### Payslip

```typescript
// List payslips
await hakunamataAPI.getPayslips({ page: 1 });

// Get detail
await hakunamataAPI.getPayslipDetail(123);

// Download PDF
await hakunamataAPI.downloadPayslipPDF(123);
```

---

## 📋 **COMPLETE API LIST:**

### ✅ Authentication (3)

- `login(email, password)` - Login
- `logout()` - Logout
- `getCurrentUser()` - Get user info

### ✅ Dashboard (2)

- `getDashboard()` - Dashboard data
- `getDashboardStatistics()` - Statistics

### ✅ Profile (3)

- `getEmployeeProfile()` - Get profile
- `updateEmployeeProfile(data)` - Update profile
- `uploadProfileAvatar(file)` - Upload avatar

### ✅ Attendance (6)

- `clockIn(data)` - Clock in
- `clockOut(data)` - Clock out
- `getAttendanceHistory(params)` - History
- `getAttendanceToday()` - Today
- `getAttendanceStatistics(params)` - Statistics
- `getAttendanceDetail(id)` - Detail

### ✅ Leave (6)

- `getLeaveRequests(params)` - List
- `createLeaveRequest(data)` - Create
- `getLeaveRequestDetail(id)` - Detail
- `updateLeaveRequest(id, data)` - Update
- `deleteLeaveRequest(id)` - Delete
- `getLeaveBalance()` - Balance

### ✅ Overtime (5)

- `getOvertimeRequests(params)` - List
- `createOvertimeRequest(data)` - Create
- `getOvertimeRequestDetail(id)` - Detail
- `updateOvertimeRequest(id, data)` - Update
- `deleteOvertimeRequest(id)` - Delete

### ✅ Permission (4)

- `getPermissionRequests(params)` - List
- `createPermissionRequest(data)` - Create
- `getPermissionRequestDetail(id)` - Detail
- `deletePermissionRequest(id)` - Delete

### ✅ Payslip (3)

- `getPayslips(params)` - List
- `getPayslipDetail(id)` - Detail
- `downloadPayslipPDF(id)` - Download PDF

### ✅ Documents (5)

- `getDocuments(params)` - List
- `getDocumentDetail(id)` - Detail
- `uploadDocument(data)` - Upload
- `downloadDocument(id)` - Download
- `deleteDocument(id)` - Delete

### ✅ Announcements (2)

- `getAnnouncements(params)` - List
- `getAnnouncementDetail(id)` - Detail

### ✅ Calendar (2)

- `getCalendarEvents(params)` - List events
- `getEventDetail(id)` - Detail

### ✅ Notifications (4)

- `getNotifications(params)` - List
- `markNotificationAsRead(id)` - Mark as read
- `markAllNotificationsAsRead()` - Mark all as read
- `deleteNotification(id)` - Delete

### ✅ Settings (3)

- `getSettings()` - Get settings
- `updateSettings(data)` - Update settings
- `changePassword(data)` - Change password

---

## 🎉 **TOTAL: 50+ ENDPOINTS TERSEDIA!**

---

## ⚡ **Tips & Best Practices:**

### 1. Error Handling

```typescript
try {
  const response = await hakunamataAPI.getAttendanceHistory();
  console.log("Success:", response.data);
} catch (error) {
  console.error("Error:", error);
  // Show error message to user
  alert(error.message);
}
```

### 2. Loading State

```typescript
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    const data = await hakunamataAPI.getDashboard();
    // Process data
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
```

### 3. Pagination

```typescript
const [page, setPage] = useState(1);

const loadMore = async () => {
  const data = await hakunamataAPI.getAttendanceHistory({
    page: page,
    per_page: 20,
  });
  setPage(page + 1);
};
```

### 4. File Upload

```typescript
const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    await hakunamataAPI.uploadProfileAvatar(file);
    alert("Avatar uploaded!");
  }
};
```

---

## 📚 **Dokumentasi Lengkap:**

Lihat file:

- `HAKUNAMATATA_COMPLETE_API.md` - Dokumentasi lengkap semua endpoint
- `src/services/hakunamata.service.ts` - Source code implementation

---

## ✅ **Checklist Testing:**

- [ ] Login berhasil
- [ ] Get dashboard data
- [ ] Get user profile
- [ ] Clock in/out
- [ ] Get attendance history
- [ ] Create leave request
- [ ] Get leave balance
- [ ] Create overtime request
- [ ] Get payslips
- [ ] Upload document
- [ ] Get notifications
- [ ] Update settings
- [ ] Logout

---

## 🎯 **READY TO CODE!**

Semua API sudah siap digunakan di project Anda!

**Import dan mulai coding:**

```typescript
import { hakunamataAPI } from "@/services";
```

**Happy Coding! 🚀**
