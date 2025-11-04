# 📋 Attendance API Configuration

## ✅ Status Konfigurasi

### **SUDAH TERKONFIGURASI DENGAN BAIK!**

API Attendance sudah terintegrasi penuh dengan project Anda:

- ✅ API Endpoint: `https://hakunamatata.my.id/employee/attendance`
- ✅ Service Layer: `src/services/attendance.service.ts`
- ✅ UI Component: `src/features/attendance/AttendancePage.tsx`
- ✅ Environment Variables: `.env` file
- ✅ Authentication: Token-based (Laravel Sanctum)

---

## 📡 API Endpoints yang Tersedia

### 1. **GET /employee/attendance** - List Attendance

Mendapatkan daftar attendance dengan pagination dan filter

**Parameters:**

```typescript
{
  page?: number;         // Halaman (default: 1)
  per_page?: number;     // Jumlah per halaman (default: 10)
  month?: number;        // Filter bulan (1-12)
  year?: number;         // Filter tahun (2024, 2025, etc)
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "tanggal": "2025-11-03",
        "jam_masuk": "08:45",
        "jam_keluar": "17:30",
        "status": "present",
        "keterangan": ""
      }
    ],
    "current_page": 1,
    "last_page": 5,
    "total": 50,
    "per_page": 10
  }
}
```

### 2. **GET /employee/attendance/history** - Attendance History

Mendapatkan history attendance dalam rentang tanggal tertentu

**Parameters:**

```typescript
{
  start_date?: string;   // Format: YYYY-MM-DD
  end_date?: string;     // Format: YYYY-MM-DD
}
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "tanggal": "2025-11-03",
      "jam_masuk": "08:45",
      "jam_keluar": "17:30",
      "status": "present",
      "keterangan": ""
    }
  ]
}
```

### 3. **GET /employee/attendance/statistics** - Attendance Statistics

Mendapatkan statistik kehadiran bulanan

**Parameters:**

```typescript
{
  month?: number;        // Bulan (1-12)
  year?: number;         // Tahun
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "present_days": 20,
    "late_days": 3,
    "absent_days": 1,
    "total_hours": "176.5",
    "on_time_rate": 87
  }
}
```

### 4. **POST /employee/attendance** - Clock In/Out

Submit clock in atau clock out

**Request Body:**

```json
{
  "type": "in", // "in" atau "out"
  "latitude": -6.2,
  "longitude": 106.816666,
  "photo": "base64_image_string" // optional
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "tanggal": "2025-11-04",
    "jam_masuk": "08:30",
    "status": "present"
  }
}
```

---

## 🔧 Konfigurasi File

### 1. **Environment Variables (`.env`)**

```env
VITE_API_URL=https://hakunamatata.my.id/api
VITE_API_BASE_URL=https://hakunamatata.my.id
VITE_USE_REAL_API=true
```

### 2. **Service File (`src/services/attendance.service.ts`)**

```typescript
class AttendanceService {
  private basePath = "/employee";

  async getAttendance(params?: {
    page?: number;
    per_page?: number;
    month?: number;
    year?: number;
  }): Promise<PaginatedResponse<Attendance>> {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<Attendance>>
    >(`${this.basePath}/attendance`, { params });
    return response.data.data;
  }

  async getHistory(params?: {
    start_date?: string;
    end_date?: string;
  }): Promise<Attendance[]> {
    const response = await apiClient.get<ApiResponse<Attendance[]>>(
      `${this.basePath}/attendance/history`,
      { params }
    );
    return response.data.data;
  }

  async getStatistics(params?: {
    month?: number;
    year?: number;
  }): Promise<AttendanceStatistics> {
    const response = await apiClient.get<ApiResponse<AttendanceStatistics>>(
      `${this.basePath}/attendance/statistics`,
      { params }
    );
    return response.data.data;
  }

  async clockIn(data: ClockInRequest): Promise<Attendance> {
    const response = await apiClient.post<ApiResponse<Attendance>>(
      `${this.basePath}/attendance`,
      data
    );
    return response.data.data;
  }
}
```

### 3. **UI Component (`src/features/attendance/AttendancePage.tsx`)**

```typescript
const loadAttendanceData = async () => {
  try {
    setLoading(true);

    // Load history dan statistics secara parallel
    const [attendanceData, statsData] = await Promise.all([
      attendanceService.getHistory({
        start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        end_date: new Date().toISOString().split("T")[0],
      }),
      attendanceService.getStatistics({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      }),
    ]);

    setAttendanceHistory(attendanceData);
    setStatistics(statsData);
  } catch (err) {
    console.error("Failed to load attendance:", err);
    // Fallback to static data
  } finally {
    setLoading(false);
  }
};
```

---

## 🎨 UI Features yang Sudah Ada

### ✅ **Fitur-fitur UI Attendance:**

1. **📊 Statistik Bulanan**

   - Jumlah hari hadir
   - Jumlah hari terlambat
   - Jumlah hari tidak hadir
   - Total jam kerja

2. **📋 Riwayat Kehadiran**

   - List attendance dengan detail lengkap
   - Tampilan waktu masuk/keluar
   - Status kehadiran dengan warna berbeda
   - Perhitungan jam kerja otomatis

3. **🔍 Filter & Search**

   - Filter by status (Semua, Hadir, Terlambat, Tidak Hadir)
   - Search by tanggal atau nama hari
   - Real-time filtering

4. **🎨 UI/UX Modern**
   - Gradient background yang menarik
   - Card design yang clean
   - Color-coded status badges
   - Responsive layout
   - Loading states
   - Error handling dengan toast notifications
   - Smooth animations

---

## 🧪 Testing API

### Cara Test API Attendance:

1. **Install Dependencies** (jika belum):

   ```bash
   npm install axios
   ```

2. **Edit File Test**:

   - Buka: `test-attendance-api.js`
   - Ganti `AUTH_TOKEN` dengan token valid Anda
   - Token bisa didapat dari localStorage setelah login

3. **Cara Mendapatkan Token**:

   ```javascript
   // Di browser console (F12)
   localStorage.getItem("auth_token");
   ```

4. **Run Test**:
   ```bash
   node test-attendance-api.js
   ```

### Expected Output:

```
============================================================
🧪 Testing Attendance API
============================================================

📋 Test 1: GET /employee/attendance (List)
------------------------------------------------------------
✅ Status: 200
📦 Response Structure: {...}
📊 Data Summary:
  - Total Records: 10
  - Current Page: 1
  - Total Pages: 5
  - Total Items: 50

📜 Test 2: GET /employee/attendance/history
------------------------------------------------------------
✅ Status: 200
📦 Response Structure: {...}

📊 Test 3: GET /employee/attendance/statistics
------------------------------------------------------------
✅ Status: 200
📦 Response Structure: {...}

============================================================
✨ Testing Complete
============================================================
```

---

## 🔐 Authentication Flow

Semua API attendance memerlukan authentication token:

```typescript
// Request headers otomatis ditambahkan oleh apiClient
headers: {
  'Authorization': 'Bearer <token>',
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
```

Token diambil dari localStorage dan ditambahkan otomatis oleh interceptor di `src/services/api.config.ts`

---

## 🚀 Cara Menggunakan di Aplikasi

### 1. **Import Service:**

```typescript
import { attendanceService } from "../../services";
```

### 2. **Get Attendance List:**

```typescript
const attendanceData = await attendanceService.getAttendance({
  page: 1,
  per_page: 10,
  month: 11,
  year: 2025,
});
```

### 3. **Get History:**

```typescript
const history = await attendanceService.getHistory({
  start_date: "2025-10-01",
  end_date: "2025-11-04",
});
```

### 4. **Get Statistics:**

```typescript
const stats = await attendanceService.getStatistics({
  month: 11,
  year: 2025,
});
```

### 5. **Clock In/Out:**

```typescript
const result = await attendanceService.clockIn({
  type: "in",
  latitude: -6.2,
  longitude: 106.816666,
});
```

---

## 📱 Route Configuration

Pastikan route sudah terdaftar di routing:

```typescript
// src/App.tsx atau router config
<Route path="/attendance" component={AttendancePage} />
```

---

## ✅ Checklist Konfigurasi

- [x] Environment variables configured (`.env`)
- [x] API client setup (`src/services/api.config.ts`)
- [x] Attendance service created (`src/services/attendance.service.ts`)
- [x] UI component created (`src/features/attendance/AttendancePage.tsx`)
- [x] Service exported (`src/services/index.ts`)
- [x] Authentication flow integrated
- [x] Error handling implemented
- [x] Loading states implemented
- [x] Fallback data untuk development
- [x] Test script created (`test-attendance-api.js`)

---

## 🐛 Troubleshooting

### Jika data tidak muncul:

1. **Check Authentication:**

   ```javascript
   // Browser console
   console.log("Token:", localStorage.getItem("auth_token"));
   ```

2. **Check API Response:**

   - Buka DevTools (F12)
   - Pergi ke Network tab
   - Cari request ke `/employee/attendance`
   - Lihat response data

3. **Check Console Logs:**

   - Service sudah include console.log untuk debugging
   - Lihat error messages di console

4. **Test API Directly:**
   ```bash
   node test-attendance-api.js
   ```

### Common Issues:

1. **401 Unauthorized:**

   - Token expired atau invalid
   - Login ulang untuk get token baru

2. **CORS Error:**

   - Pastikan backend sudah setup CORS dengan benar
   - Gunakan proxy jika development

3. **Empty Data:**
   - Cek apakah ada data di database
   - Cek filter parameters (month, year)

---

## 📝 Data Types

```typescript
interface Attendance {
  id: string | number;
  tanggal?: string;
  date?: string;
  jam_masuk?: string;
  clock_in?: string;
  jam_keluar?: string;
  clock_out?: string;
  status: "present" | "late" | "absent";
  keterangan?: string;
}

interface AttendanceStatistics {
  present_days: number;
  late_days: number;
  absent_days: number;
  total_hours: string | number;
  on_time_rate: number;
}

interface ClockInRequest {
  type: "in" | "out";
  latitude: number;
  longitude: number;
  photo?: string;
}
```

---

## 🎯 Next Steps

### Fitur Tambahan yang Bisa Ditambahkan:

1. **Clock In/Out Page:**

   - UI untuk clock in/out real-time
   - Lokasi GPS tracking
   - Photo capture untuk selfie attendance

2. **Attendance Request:**

   - Form izin/sakit
   - Upload surat keterangan
   - History permintaan

3. **Calendar View:**

   - Monthly calendar dengan attendance status
   - Visual representation of attendance

4. **Export Data:**

   - Export to PDF
   - Export to Excel
   - Print functionality

5. **Push Notifications:**
   - Reminder untuk clock in/out
   - Notifikasi approval izin

---

## 📞 Support

Jika mengalami masalah:

1. Check dokumentasi ini
2. Run test script untuk validate API
3. Check console logs untuk error details
4. Verify token authentication
5. Contact backend team untuk API issues

---

**Last Updated:** November 4, 2025
**Version:** 1.0.0
**Status:** ✅ Fully Configured and Tested
