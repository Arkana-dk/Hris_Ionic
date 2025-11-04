# 🏠 Localhost Development Guide

## ✅ Konfigurasi Selesai!

Project Ionic HRIS Anda sekarang **100% menggunakan localhost API** dari Laravel backend.

---

## 📋 Ringkasan Perubahan

### 1. **Remote API DISABLED** ❌

- ~~`https://hakunamatata.my.id`~~ → **TIDAK DIGUNAKAN**
- Semua endpoint remote sudah di-comment

### 2. **Local API ENABLED** ✅

- `http://localhost:8000/api` → **AKTIF**
- Backend Laravel dari GitHub repo: [`Arkana-dk/hris-fix`](https://github.com/Arkana-dk/hris-fix)

---

## 🚀 Cara Menjalankan

### A. Backend Laravel (Server Lokal)

1. **Clone/Pull Repository**

   ```bash
   cd /path/to/hris-fix
   git pull origin main
   ```

2. **Install Dependencies**

   ```bash
   composer install
   npm install
   ```

3. **Setup Environment**

   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Configure Database** (Edit `.env`)

   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=hris_db
   DB_USERNAME=root
   DB_PASSWORD=
   ```

5. **Run Migrations**

   ```bash
   php artisan migrate --seed
   ```

6. **Start Laravel Server**

   ```bash
   php artisan serve
   ```

   Output:

   ```
   INFO  Server running on [http://127.0.0.1:8000]
   ```

### B. Frontend Ionic (Mobile App)

1. **Navigate to Ionic Project**

   ```bash
   cd c:/Users/ACER/Documents/Hris_Ionic
   ```

2. **Install Dependencies** (jika belum)

   ```bash
   npm install
   ```

3. **Run Development Server**

   ```bash
   npm run dev
   ```

   Output:

   ```
   VITE v5.x.x  ready in xxx ms
   ➜  Local:   http://localhost:5173/
   ```

4. **Open Browser**
   - URL: `http://localhost:5173`
   - Login dengan credentials dari seeder backend

---

## 🔑 API Endpoints yang Tersedia

Berdasarkan `routes/api.php` dari backend Laravel:

### **Authentication**

```typescript
POST / api / login; // Login user
POST / api / logout; // Logout user
GET / api / me; // Get current user info
```

### **Employee (Self-Service)**

```typescript
// Profile
GET    /api/employee/profile

// Attendance
GET    /api/employee/attendance          // List attendance
POST   /api/employee/attendance          // Clock in/out
GET    /api/employee/attendance/history  // History

// Attendance Requests
GET    /api/employee/presensi/requests   // List requests
POST   /api/employee/presensi/requests   // Submit request
GET    /api/employee/presensi/requests/:id

// Overtime Requests
GET    /api/employee/overtime-request         // List
POST   /api/employee/overtime-request         // Submit
GET    /api/employee/overtime-request/history

// Leave Requests
GET    /api/employee/cuti              // List
POST   /api/employee/cuti              // Submit
GET    /api/employee/cuti/:id
GET    /api/employee/cuti/history

// Payslip
GET    /api/employee/payslip           // List payslips
GET    /api/employee/payslip/:id       // Detail
GET    /api/employee/payslip/:id/pdf   // Download PDF
GET    /api/employee/payslip/history   // History
```

### **Admin API** (Requires Permissions)

```typescript
// Employees
GET    /api/admin/employees
POST   /api/admin/employees
GET    /api/admin/employees/:id
PUT    /api/admin/employees/:id
DELETE /api/admin/employees/:id

// Attendance Management
GET    /api/admin/attendance
GET    /api/admin/attendance/:id
GET    /api/admin/attendance-summary

// Approval Endpoints
GET    /api/admin/attendance-requests
PATCH  /api/admin/attendance-requests/:id/approve
PATCH  /api/admin/attendance-requests/:id/reject

GET    /api/admin/overtime-requests
PATCH  /api/admin/overtime-requests/:id/approve
PATCH  /api/admin/overtime-requests/:id/reject

GET    /api/admin/leave-requests
PATCH  /api/admin/leave-requests/:id/approve
PATCH  /api/admin/leave-requests/:id/reject

// Master Data
GET    /api/admin/departments
GET    /api/admin/positions
GET    /api/admin/shifts
GET    /api/admin/calendars
```

---

## 🛠️ Services yang Sudah Dikonfigurasi

Semua service di project Ionic sudah siap pakai:

### ✅ Configured Services

- `authService` → `/api/login`, `/api/logout`, `/api/me`
- `attendanceService` → `/api/employee/attendance/*`
- `overtimeService` → `/api/employee/overtime-request/*`
- `leaveService` → `/api/employee/cuti/*`
- `payslipService` → `/api/employee/payslip/*`
- `shiftChangeService` → `/api/employee/shift-change/*` (jika ada endpoint)

---

## 🔄 Cara Testing API

### 1. **Test Authentication**

```bash
# Login Request
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"password"}'

# Response:
{
  "access_token": "1|abc123...",
  "token_type": "Bearer",
  "user": {...}
}
```

### 2. **Test Protected Endpoint**

```bash
# Get Profile (gunakan token dari login)
curl -X GET http://localhost:8000/api/employee/profile \
  -H "Authorization: Bearer 1|abc123..."
```

### 3. **Test via Browser Console**

Buka `http://localhost:5173` → Developer Tools → Console:

```javascript
// Test API connection
fetch("http://localhost:8000/api/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "alice@example.com",
    password: "password",
  }),
})
  .then((r) => r.json())
  .then(console.log);
```

---

## 🐛 Troubleshooting

### ❌ **CORS Error**

**Masalah:**

```
Access to XMLHttpRequest at 'http://localhost:8000/api/login'
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solusi Backend Laravel:**

Edit `config/cors.php`:

```php
'allowed_origins' => [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'capacitor://localhost',
],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

### ❌ **401 Unauthorized**

**Penyebab:** Token expired atau tidak valid

**Solusi:**

1. Check token di localStorage browser
2. Login ulang untuk generate token baru
3. Verify user exists di database backend

### ❌ **Connection Refused**

**Penyebab:** Laravel server tidak berjalan

**Solusi:**

```bash
cd /path/to/hris-fix
php artisan serve
```

Pastikan output: `Server running on [http://127.0.0.1:8000]`

### ❌ **500 Internal Server Error**

**Debug:**

1. Check Laravel logs:

   ```bash
   tail -f storage/logs/laravel.log
   ```

2. Enable debug mode di backend `.env`:

   ```env
   APP_DEBUG=true
   ```

3. Check database connection:
   ```bash
   php artisan migrate:status
   ```

---

## 📝 Default Test Users

Dari backend seeder (`database/seeders/UsersAndEmployeesSeeder.php`):

```javascript
// User 1
{
  email: 'alice@example.com',
  password: 'password',
  role: 'user'
}

// User 2
{
  email: 'bob@example.com',
  password: 'password',
  role: 'user'
}

// Super Admin (jika ada)
{
  email: 'admin@example.com',
  password: 'password',
  role: 'super-admin'
}
```

---

## 🔄 Switching Back ke Remote API

Jika ingin kembali ke `hakunamatata.my.id`:

### 1. Edit `.env`

```env
# UNCOMMENT remote API
VITE_API_URL=https://hakunamatata.my.id/api
VITE_API_BASE_URL=https://hakunamatata.my.id
VITE_SANCTUM_CSRF_COOKIE_URL=https://hakunamatata.my.id/sanctum/csrf-cookie

# COMMENT localhost
# VITE_API_URL=http://localhost:8000/api
```

### 2. Restart Dev Server

```bash
npm run dev
```

---

## 📊 Project Structure

```
Ionic App (Frontend)          Laravel Backend (Local)
─────────────────────        ─────────────────────────
localhost:5173              localhost:8000
      │                           │
      │    HTTP Requests          │
      ├──────────────────────────►│
      │       /api/login          │ routes/api.php
      │       /api/employee/*     │ app/Http/Controllers/
      │       /api/admin/*        │    Api/Employee/
      │                           │    Api/Admin/
      │    JSON Response          │
      │◄──────────────────────────┤
      │                           │
   Services/                  Controllers/
   - authService              - AuthController
   - attendanceService        - AttendanceController
   - leaveService             - LeaveRequestController
   - payslipService           - PayslipController
```

---

## ✅ Checklist Sebelum Development

- [ ] Laravel backend running di `http://localhost:8000`
- [ ] Database configured dan migrated
- [ ] Ionic dev server running di `http://localhost:5173`
- [ ] `.env` file configured untuk localhost
- [ ] CORS enabled di Laravel backend
- [ ] Test login berhasil via browser console
- [ ] Token saved di localStorage

---

## 📚 Resources

- **Backend Repository:** https://github.com/Arkana-dk/hris-fix
- **Laravel Sanctum Docs:** https://laravel.com/docs/sanctum
- **Ionic Framework:** https://ionicframework.com/docs
- **API Testing:** https://www.postman.com atau Thunder Client VSCode

---

## 🎯 Next Steps

1. ✅ **Run Backend:** `php artisan serve`
2. ✅ **Run Frontend:** `npm run dev`
3. ✅ **Test Login:** Login dengan `alice@example.com`
4. ✅ **Test Features:** Navigate halaman attendance, leave, overtime, payslip
5. ✅ **Check Console:** Lihat API calls di browser DevTools
6. 🚀 **Start Development:** Mulai fix bugs atau add features!

---

**Happy Coding! 🚀**

_Sekarang Anda bisa develop kedua project (backend & frontend) secara lokal dengan mudah!_
