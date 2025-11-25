# 🔗 Integrasi Ionic App dengan Backend hris-fix

**Status:** ✅ READY TO TEST  
**Date:** 4 November 2025  
**Backend Repository:** https://github.com/Arkana-dk/hris-fix

---

## 📋 YANG SUDAH DIKONFIGURASI

### ✅ 1. API Configuration (`src/services/api.config.ts`)

- ✅ Base URL configured untuk backend hris-fix
- ✅ API endpoints mapping (34 routes)
- ✅ Axios interceptors untuk token authentication
- ✅ Error handling untuk 401 Unauthorized

### ✅ 2. Auth Service (`src/services/auth.service.ts`)

- ✅ Login dengan format response Laravel Sanctum
- ✅ Response format: `{ access_token, token_type: "Bearer", user }`
- ✅ Token storage di localStorage
- ✅ Logout dengan cleanup

### ✅ 3. Attendance Service (`src/services/attendance.service.ts`)

- ✅ Clock In/Out dengan GPS location
- ✅ Request format sesuai backend: `check_in_location`, `check_in_latitude`, `check_in_longitude`
- ✅ Attendance history
- ✅ Monthly statistics

### ✅ 4. Dashboard Service (`src/services/dashboard.service.ts`)

- ✅ Get dashboard data dari backend hris-fix
- ✅ Handle response format dari backend
- ✅ Mock data fallback untuk development

### ✅ 5. Types Updated (`src/types/api.types.ts`)

- ✅ ClockInRequest interface sesuai backend
- ✅ Backward compatibility fields

---

## 🚀 CARA SETUP & TEST

### **STEP 1: Clone & Setup Backend hris-fix**

```bash
# Clone backend repository
git clone https://github.com/Arkana-dk/hris-fix.git
cd hris-fix

# Install dependencies
composer install

# Copy .env file
cp .env.example .env

# Generate app key
php artisan key:generate

# Setup database (MySQL)
# Edit .env dengan database credentials Anda
DB_DATABASE=hris_db
DB_USERNAME=root
DB_PASSWORD=your_password

# Run migrations
php artisan migrate

# Seed database dengan dummy data
php artisan db:seed

# Start Laravel server
php artisan serve --host=0.0.0.0 --port=8000
```

✅ **Backend running di:** `http://localhost:8000`

---

### **STEP 2: Pastikan .env Ionic Sudah Benar**

File: `c:\Users\ACER\Documents\Hris_Ionic\.env`

```properties
# API Configuration - LOCALHOST
VITE_API_URL=http://localhost:8000/api
VITE_API_BASE_URL=http://localhost:8000

# API Mode
VITE_USE_REAL_API=true
VITE_USE_LOCAL_API=true
```

---

### **STEP 3: Install Dependencies Ionic (jika belum)**

```bash
cd c:\Users\ACER\Documents\Hris_Ionic
npm install
```

---

### **STEP 4: Test Backend API dulu (Opsional)**

Test dengan curl atau Postman:

```bash
# Test login endpoint
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"employee@example.com\",\"password\":\"password\"}"

# Response expected:
# {
#   "access_token": "1|xyz...",
#   "token_type": "Bearer",
#   "user": {...}
# }
```

---

### **STEP 5: Run Ionic App**

```bash
npm run dev
```

✅ **App running di:** `http://localhost:8100`

---

### **STEP 6: Test Login di Ionic App**

1. Buka browser: `http://localhost:8100`
2. Login dengan credentials:
   - **Email:** `employee@example.com`
   - **Password:** `password`
3. Cek console browser (F12) untuk log:
   - `🔐 Login Request to hris-fix backend:`
   - `✅ Login Success!`
   - `Token: 1|xyz...`

---

### **STEP 7: Test Presensi (Clock In)**

1. Setelah login, masuk ke halaman **Attendance**
2. Klik tombol **Clock In**
3. Allow location permission
4. Cek console log:

   - `⏰ Clock In/Out request to hris-fix:`
   - `✅ Clock In/Out success:`

5. **Verifikasi di Backend Database:**
   ```sql
   SELECT * FROM attendances ORDER BY created_at DESC LIMIT 1;
   ```

✅ **Data presensi berhasil masuk ke database backend!**

---

## 📊 FLOW INTEGRASI

```
┌─────────────────────────────────────────────────────────────┐
│                    IONIC APP (Frontend)                      │
│                  http://localhost:8100                       │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTP Request (JSON + Bearer Token)
                        ↓
┌─────────────────────────────────────────────────────────────┐
│              LARAVEL API (Backend hris-fix)                 │
│                  http://localhost:8000/api                  │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Routes (api.php)                                     │ │
│  │  - POST /login → AuthController                       │ │
│  │  - GET  /employee/dashboard → DashboardController     │ │
│  │  - POST /employee/attendance → AttendanceController   │ │
│  └──────────────────┬────────────────────────────────────┘ │
│                     │                                        │
│  ┌──────────────────▼──────────────────────────────────┐   │
│  │  Controllers (app/Http/Controllers/Api/Employee/)   │   │
│  │  - AttendanceController::store()                    │   │
│  │  - Validasi request                                 │   │
│  │  - Business logic                                   │   │
│  └──────────────────┬──────────────────────────────────┘   │
│                     │                                        │
│  ┌──────────────────▼──────────────────────────────────┐   │
│  │  Eloquent Models (app/Models/)                      │   │
│  │  - Attendance::create([...])                        │   │
│  └──────────────────┬──────────────────────────────────┘   │
└────────────────────┼────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                 MySQL DATABASE (hris_db)                    │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Table: attendances                                   │ │
│  │  - id, employee_id, date, check_in_time              │ │
│  │  - check_in_location, check_in_latitude,             │ │
│  │    check_in_longitude, status                        │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                     │
                     │ Response JSON
                     ↓
┌─────────────────────────────────────────────────────────────┐
│              JSON Response ke Ionic App                     │
│  {                                                          │
│    "status": "success",                                     │
│    "message": "Check-in berhasil",                         │
│    "data": { id, employee_id, date, ... }                  │
│  }                                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔑 API ENDPOINTS YANG SUDAH SIAP

| Fitur                  | Method | Endpoint                              | Status   |
| ---------------------- | ------ | ------------------------------------- | -------- |
| **Login**              | POST   | `/api/login`                          | ✅ Ready |
| **Logout**             | POST   | `/api/logout`                         | ✅ Ready |
| **Get User**           | GET    | `/api/me`                             | ✅ Ready |
| **Dashboard**          | GET    | `/api/employee/dashboard`             | ✅ Ready |
| **Profile**            | GET    | `/api/employee/profile`               | ✅ Ready |
| **Update Profile**     | PUT    | `/api/employee/profile`               | ✅ Ready |
| **Upload Avatar**      | POST   | `/api/employee/profile/avatar`        | ✅ Ready |
| **Get Attendance**     | GET    | `/api/employee/attendance`            | ✅ Ready |
| **Clock In/Out**       | POST   | `/api/employee/attendance`            | ✅ Ready |
| **Attendance History** | GET    | `/api/employee/attendance/history`    | ✅ Ready |
| **Attendance Stats**   | GET    | `/api/employee/attendance/statistics` | ✅ Ready |
| **Leave Requests**     | POST   | `/api/employee/leave-requests`        | ✅ Ready |
| **Overtime Requests**  | POST   | `/api/employee/overtime-requests`     | ✅ Ready |
| **Payslips**           | GET    | `/api/employee/payslip`               | ✅ Ready |
| **Calendar Events**    | GET    | `/api/employee/calendar/events`       | ✅ Ready |
| **Documents**          | GET    | `/api/employee/documents`             | ✅ Ready |

---

## 🧪 TESTING CHECKLIST

### Backend Testing

- [ ] Backend hris-fix running di `http://localhost:8000`
- [ ] Database migrations completed
- [ ] Database seeds completed (user credentials available)
- [ ] Test login endpoint dengan curl/Postman

### Frontend Testing

- [ ] Ionic app running di `http://localhost:8100`
- [ ] .env configured dengan `VITE_API_URL=http://localhost:8000/api`
- [ ] Login berhasil dari Ionic app
- [ ] Token tersimpan di localStorage
- [ ] Dashboard data muncul

### Integration Testing

- [ ] Clock In berhasil dari mobile app
- [ ] Data masuk ke database backend (cek table `attendances`)
- [ ] Clock Out berhasil
- [ ] Attendance history tampil di app
- [ ] Monthly statistics muncul

---

## 🐛 TROUBLESHOOTING

### Problem 1: CORS Error

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**

```bash
# Di backend hris-fix, cek config/cors.php
# Pastikan localhost:8100 sudah ada di allowed_origins:

'allowed_origins' => [
    'http://localhost:8100',
    'capacitor://localhost',
],
```

---

### Problem 2: 401 Unauthorized

**Error:** `401 Unauthorized` saat hit API

**Solution:**

- Cek token sudah tersimpan di localStorage
- Cek token format: `Bearer {token}`
- Cek console log: "🔑 Token attached"

---

### Problem 3: Network Error

**Error:** `Network Error` atau `ERR_NETWORK`

**Solution:**

1. Pastikan backend running: `php artisan serve`
2. Test backend langsung: `curl http://localhost:8000/api/me`
3. Cek firewall tidak block port 8000

---

### Problem 4: Login Failed - Invalid Credentials

**Error:** `Invalid credentials`

**Solution:**

```bash
# Di backend, cek database users table:
SELECT email, password FROM users LIMIT 1;

# Atau seed ulang database:
php artisan migrate:fresh --seed
```

Default credentials biasanya:

- Email: `admin@example.com` atau `employee@example.com`
- Password: `password`

---

## 📱 TESTING DI ANDROID EMULATOR

Jika ingin test di Android emulator:

1. Update `.env`:

```properties
VITE_API_URL=http://10.0.2.2:8000/api
```

2. Build Android:

```bash
npm run build
npx cap sync android
npx cap open android
```

3. Run di emulator Android Studio

---

## 🎯 NEXT STEPS

Setelah integrasi berhasil:

1. ✅ **Test semua fitur:**

   - Login/Logout
   - Clock In/Out
   - Leave Request
   - Overtime Request
   - View Payslips
   - View Documents

2. ✅ **Update UI untuk match backend data:**

   - Dashboard cards
   - Profile fields
   - Attendance display

3. ✅ **Add error handling:**

   - Network errors
   - Validation errors
   - Token expiration

4. ✅ **Deploy:**
   - Backend ke production server
   - Update VITE_API_URL ke production URL
   - Build APK untuk Android

---

## 📞 SUPPORT

- **Backend Docs:** https://github.com/Arkana-dk/hris-fix/blob/main/API_MOBILE_INTEGRATION.md
- **Backend Repo:** https://github.com/Arkana-dk/hris-fix
- **Ionic Repo:** https://github.com/Arkana-dk/Hris_Ionic

---

**Status:** ✅ SIAP TEST  
**Created:** 4 November 2025  
**Integration:** Ionic React ↔️ Laravel hris-fix
