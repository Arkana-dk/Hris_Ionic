# 🚀 Implementation Guide - Complete API Integration

## ✅ **YANG SUDAH SELESAI:**

### **1. Auth Context Enhanced** ✅

- **File:** `src/contexts/AuthContext.tsx`
- **Features:**
  - ✅ Full user data management
  - ✅ User state (User object)
  - ✅ Loading state
  - ✅ Update user function
  - ✅ Refresh user from API
  - ✅ Auto logout on token expire

**Usage:**

```typescript
import { useAuth } from "../contexts";

const { user, isAuthenticated, loading, refreshUser, updateUser } = useAuth();

// Access user data
console.log(user?.name);
console.log(user?.email);
console.log(user?.position);
```

---

## 🎯 **IMPLEMENTASI STEP BY STEP:**

### **PHASE 1: Dashboard Integration** ⏳

**File:** `src/features/dashboard/DashboardPage.tsx`

**API yang digunakan:**

```typescript
GET / api / employee / dashboard; // Dashboard data
GET / api / employee / profile; // User profile (fallback)
```

**Implementation:**

1. ✅ Use `useAuth()` to get current user
2. [ ] Fetch dashboard data from API
3. [ ] Display real user info (name, position, avatar)
4. [ ] Display today's attendance status
5. [ ] Display monthly statistics
6. [ ] Display upcoming events
7. [ ] Display announcements

**Code Example:**

```typescript
import { useAuth } from "../../contexts";

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboard();
    }
  }, [isAuthenticated]);

  const loadDashboard = async () => {
    try {
      // Option 1: Dedicated dashboard endpoint
      const data = await apiClient.get("/employee/dashboard");
      setDashboardData(data.data);

      // Option 2: Use profile service (current)
      // Already implemented in existing code
    } catch (error) {
      console.error("Error loading dashboard:", error);
    }
  };

  return (
    <div>
      {/* Display user from context */}
      <h1>Welcome, {user?.name}!</h1>
      <p>{user?.position}</p>

      {/* Display dashboard data */}
      {dashboardData && <div>{/* Stats, attendance, etc */}</div>}
    </div>
  );
};
```

---

### **PHASE 2: Profile Page Integration** ⏳

**File:** `src/features/profile/ProfilePage.tsx`

**API yang digunakan:**

```typescript
GET / api / employee / profile; // Get profile
PUT / api / employee / profile; // Update profile
POST / api / employee / profile / avatar; // Upload avatar
```

**Implementation:**

1. [ ] Load profile from API (atau pakai dari context)
2. [ ] Display all profile fields
3. [ ] Edit profile functionality
4. [ ] Upload avatar functionality
5. [ ] Logout button integration

**Code Example:**

```typescript
const ProfilePage: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (error) {
      // Use user from context as fallback
      setProfile(user);
    }
  };

  const handleUpdateProfile = async (data) => {
    try {
      const updated = await profileService.updateProfile(data);
      updateUser(updated); // Update context
      setProfile(updated);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleUploadAvatar = async (file) => {
    try {
      const updated = await profileService.uploadAvatar(file);
      updateUser(updated);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleLogout = () => {
    logout();
    history.replace("/login");
  };
};
```

---

### **PHASE 3: Attendance Page Integration** ⏳

**File:** `src/features/attendance/AttendancePage.tsx`

**API yang digunakan:**

```typescript
GET / api / employee / attendance; // Today's attendance
POST / api / employee / attendance; // Clock in/out
GET / api / employee / attendance / history; // History
GET / api / employee / attendance / statistics; // Stats
```

**Implementation:**

1. [ ] Load today's attendance status
2. [ ] Clock in/out with GPS
3. [ ] Display working duration
4. [ ] Load attendance history
5. [ ] Display monthly statistics

**Code Example:**

```typescript
const AttendancePage: React.FC = () => {
  const { user } = useAuth();
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [history, setHistory] = useState([]);
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    loadAttendanceData();
  }, []);

  const loadAttendanceData = async () => {
    try {
      // Load today's attendance
      const today = await attendanceService.getAttendance();
      setTodayAttendance(today);

      // Load history
      const historyData = await attendanceService.getHistory();
      setHistory(historyData);

      // Load statistics
      const stats = await apiClient.get("/employee/attendance/statistics");
      setStatistics(stats.data);
    } catch (error) {
      console.error("Error loading attendance:", error);
    }
  };

  const handleClockIn = async () => {
    try {
      // Get GPS location
      const location = await attendanceService.getCurrentLocation();

      // Clock in
      const result = await attendanceService.clockIn({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        notes: "Clock in from mobile app",
      });

      // Reload data
      loadAttendanceData();
    } catch (error) {
      console.error("Clock in failed:", error);
    }
  };
};
```

---

### **PHASE 4: Pengajuan Page Integration** ⏳

**File:** `src/features/pengajuan/PengajuanPage.tsx`

**API yang digunakan:**

```typescript
GET / api / employee / leave - balance; // Leave balance
POST / api / employee / cuti; // Submit leave
POST / api / employee / overtime - request; // Submit overtime
```

**Implementation:**

1. [ ] Load leave balance
2. [ ] Submit leave request form
3. [ ] Submit overtime request form
4. [ ] Show success/error messages

**Code Example:**

```typescript
const PengajuanPage: React.FC = () => {
  const { user } = useAuth();
  const [leaveBalance, setLeaveBalance] = useState(null);

  useEffect(() => {
    loadLeaveBalance();
  }, []);

  const loadLeaveBalance = async () => {
    try {
      const balance = await leaveService.getLeaveBalance();
      setLeaveBalance(balance);
    } catch (error) {
      console.error("Error loading balance:", error);
    }
  };

  const handleSubmitLeave = async (data) => {
    try {
      const result = await leaveService.submitLeave({
        type: data.type,
        start_date: data.startDate,
        end_date: data.endDate,
        reason: data.reason,
      });

      // Show success
      alert("Leave request submitted!");

      // Reload balance
      loadLeaveBalance();
    } catch (error) {
      console.error("Submit failed:", error);
    }
  };

  const handleSubmitOvertime = async (data) => {
    try {
      const result = await overtimeService.submitOvertime({
        date: data.date,
        start_time: data.startTime,
        end_time: data.endTime,
        reason: data.reason,
      });

      alert("Overtime request submitted!");
    } catch (error) {
      console.error("Submit failed:", error);
    }
  };
};
```

---

### **PHASE 5: History Page Integration** ⏳

**File:** `src/features/history/HistoryPage.tsx`

**API yang digunakan:**

```typescript
GET / api / employee / cuti / history; // Leave history
GET / api / employee / overtime - request / history; // Overtime history
GET / api / employee / attendance / requests; // Request status
```

**Implementation:**

1. [ ] Load leave history
2. [ ] Load overtime history
3. [ ] Load attendance requests
4. [ ] Display with status badges
5. [ ] Filter by date/status

---

### **PHASE 6: Payslip Page Integration** ⏳

**File:** `src/features/payslip/PayslipPage.tsx`

**API yang digunakan:**

```typescript
GET / api / employee / payslip; // List payslips
GET / api / employee / payslip / { id }; // Detail
GET / api / employee / payslip / { id } / pdf; // Download PDF
```

**Implementation:**

1. [ ] Load payslip list
2. [ ] Display payslip detail
3. [ ] Download PDF functionality
4. [ ] Filter by month/year

**Code Example:**

```typescript
const PayslipPage: React.FC = () => {
  const { user } = useAuth();
  const [payslips, setPayslips] = useState([]);
  const [selectedPayslip, setSelectedPayslip] = useState(null);

  useEffect(() => {
    loadPayslips();
  }, []);

  const loadPayslips = async () => {
    try {
      const data = await payslipService.getPayslips();
      setPayslips(data);
    } catch (error) {
      console.error("Error loading payslips:", error);
    }
  };

  const loadPayslipDetail = async (id) => {
    try {
      const detail = await payslipService.getPayslipDetail(id);
      setSelectedPayslip(detail);
    } catch (error) {
      console.error("Error loading detail:", error);
    }
  };

  const handleDownloadPDF = async (id) => {
    try {
      await payslipService.downloadPDF(id);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };
};
```

---

## 🔑 **KEY POINTS:**

### **1. User Data Flow:**

```
Login
  ↓
Save Token + User to localStorage
  ↓
AuthContext loads user from localStorage
  ↓
All pages access user via useAuth()
  ↓
API calls include token automatically
  ↓
Backend returns data for logged-in user only
```

### **2. Token Management:**

```typescript
// Axios automatically adds token to all requests
// (Already configured in api.config.ts)

headers: {
  'Authorization': `Bearer ${token}`
}

// Backend validates token and knows which user
// All /api/employee/* endpoints return data for that user
```

### **3. Best Practices:**

- ✅ Always use `useAuth()` to get current user
- ✅ Show loading state while fetching
- ✅ Handle errors gracefully
- ✅ Refresh data after mutations (POST/PUT/DELETE)
- ✅ Show success/error messages to user
- ✅ Use TypeScript types for type safety

---

## 📝 **IMPLEMENTATION CHECKLIST:**

### **Setup (DONE):**

- [x] Auth context with user data
- [x] useAuth hook
- [x] Token management
- [x] API interceptors

### **Dashboard:**

- [ ] Fetch dashboard data
- [ ] Display user info from context
- [ ] Show today's attendance
- [ ] Show statistics
- [ ] Show events & announcements

### **Profile:**

- [ ] Load profile data
- [ ] Edit profile
- [ ] Upload avatar
- [ ] Logout functionality

### **Attendance:**

- [ ] Today's status
- [ ] Clock in/out with GPS
- [ ] History list
- [ ] Monthly statistics

### **Pengajuan:**

- [ ] Leave balance
- [ ] Submit leave
- [ ] Submit overtime
- [ ] Form validation

### **History:**

- [ ] Leave history
- [ ] Overtime history
- [ ] Request status

### **Payslip:**

- [ ] List payslips
- [ ] View detail
- [ ] Download PDF

---

## 🚀 **NEXT STEPS:**

Saya siap implement phase by phase. Mulai dari mana?

1. **Dashboard** - Tampilkan data user yang login
2. **Profile** - Edit profile & upload foto
3. **Attendance** - Clock in/out real
4. **Pengajuan** - Submit leave/overtime
5. **History** - Riwayat pengajuan
6. **Payslip** - Lihat slip gaji

**Pilih mana yang mau saya kerjakan dulu?** 🎯
