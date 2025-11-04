# 🔗 API Integration Guide - Laravel Backend Integration

## 📌 Overview

Project ini sudah terintegrasi penuh dengan backend Laravel di `https://hakunamatata.my.id/` menggunakan:

- **Laravel Sanctum** untuk autentikasi
- **CSRF Protection** untuk web SPA
- **Token-based Auth** untuk mobile apps
- **Auto-retry mechanism** untuk koneksi yang tidak stabil
- **Centralized service management** untuk maintainability

---

## 🏗️ Architecture

```
Frontend (Ionic/React)
    ↓
Service Manager (service.manager.ts)
    ↓
API Client (api.client.ts)
    ↓
Laravel Backend (hakunamatata.my.id)
    ↓
Database (MySQL/MariaDB)
```

---

## 🔧 Configuration Files

### 1. Environment Variables (`.env`)

```properties
# API URLs
VITE_API_URL=https://hakunamatata.my.id/api
VITE_API_BASE_URL=https://hakunamatata.my.id
VITE_SANCTUM_CSRF_COOKIE_URL=https://hakunamatata.my.id/sanctum/csrf-cookie

# Mode
VITE_USE_REAL_API=true

# Timeout & Retry
VITE_API_TIMEOUT=30000
VITE_API_RETRY_ATTEMPTS=3

# Debug
VITE_DEBUG_MODE=true
```

### 2. Backend Configuration

Pastikan backend Laravel sudah dikonfigurasi dengan file-file berikut:

#### `config/cors.php`

```php
'paths' => ['api/*', 'login', 'sanctum/csrf-cookie'],
'allowed_origins' => [
    'http://localhost:5173',
    'http://localhost:8100',
    'capacitor://localhost',
    'ionic://localhost',
    'https://hakunamatata.my.id',
],
'supports_credentials' => true,
```

#### `config/sanctum.php`

```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS',
    'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1'
)),
```

#### `config/auth.php`

```php
'guards' => [
    'web' => [
        'driver' => 'session',
        'provider' => 'users',
    ],
    'api' => [
        'driver' => 'sanctum',
        'provider' => 'users',
    ],
],
```

---

## 🚀 Usage Guide

### Basic Usage

```typescript
import { serviceManager } from "@/services";

// Initialize on app startup
await serviceManager.initialize();

// Use specific services
const user = await serviceManager.auth.login({ email, password });
const dashboard = await serviceManager.dashboard.getDashboard();
const attendance = await serviceManager.attendance.getTodayAttendance();
```

### Advanced Usage - Direct API Client

```typescript
import { apiClient } from "@/services";

// GET request
const data = await apiClient.get("/endpoint");

// POST request
const result = await apiClient.post("/endpoint", { data });

// With params
const list = await apiClient.get("/endpoint", { page: 1, limit: 10 });
```

---

## 🔐 Authentication Flow

### Web (SPA) Flow

1. App requests CSRF cookie dari `/sanctum/csrf-cookie`
2. Laravel sets `XSRF-TOKEN` cookie
3. User login dengan email/password
4. Backend returns `access_token` dan `user` data
5. Frontend stores token di localStorage
6. Semua request selanjutnya include:
   - `Authorization: Bearer {token}`
   - `X-XSRF-TOKEN` header (dari cookie)

### Mobile (Native) Flow

1. User login dengan email/password
2. Backend returns `access_token` dan `user` data
3. Frontend stores token di localStorage
4. Semua request selanjutnya include:
   - `Authorization: Bearer {token}`
5. CSRF protection di-skip untuk native apps

---

## 📡 API Endpoints

### Authentication

- `POST /api/login` - Login user
- `POST /api/logout` - Logout user
- `GET /api/me` - Get current user info

### Dashboard

- `GET /api/employee/dashboard` - Get comprehensive dashboard data
- `GET /api/employee/events/today` - Get today's events
- `GET /api/employee/announcements` - Get announcements
- `GET /api/employee/statistics/monthly` - Get monthly statistics

### Attendance

- `GET /api/employee/attendance/today` - Get today's attendance
- `POST /api/employee/attendance/clock-in` - Clock in
- `POST /api/employee/attendance/clock-out` - Clock out
- `GET /api/employee/attendance/history` - Get attendance history

### Profile

- `GET /api/employee/profile` - Get user profile
- `PUT /api/employee/profile` - Update profile
- `POST /api/employee/profile/avatar` - Upload avatar

### Leave Management

- `GET /api/employee/leaves` - Get leave requests
- `POST /api/employee/leaves` - Create leave request
- `GET /api/employee/leaves/{id}` - Get leave detail
- `DELETE /api/employee/leaves/{id}` - Cancel leave

### Overtime

- `GET /api/employee/overtime` - Get overtime requests
- `POST /api/employee/overtime` - Create overtime request
- `GET /api/employee/overtime/{id}` - Get overtime detail

### Payslip

- `GET /api/employee/payslips` - Get payslips
- `GET /api/employee/payslips/{id}` - Get payslip detail
- `GET /api/employee/payslips/{id}/download` - Download payslip PDF

### Documents

- `GET /api/employee/documents` - Get documents
- `POST /api/employee/documents/request` - Request new document
- `GET /api/employee/documents/{id}/download` - Download document

---

## 🛠️ Service Manager Features

### 1. Automatic Initialization

```typescript
// main.tsx atau App.tsx
import { serviceManager } from "./services";

const initApp = async () => {
  await serviceManager.initialize();
  // Initialize check auth dan refresh user data
};
```

### 2. Health Check

```typescript
const isHealthy = await serviceManager.checkHealth();
if (!isHealthy) {
  console.error("API is not responding");
}
```

### 3. Clear Cache

```typescript
// On logout atau refresh
serviceManager.clearCache();
```

### 4. Get Status

```typescript
const status = serviceManager.getStatus();
console.log(status);
// Output:
// {
//   isAuthenticated: true,
//   user: { name: 'John', email: '...' },
//   token: 'Present',
//   platform: 'Web'
// }
```

---

## 🔥 Error Handling

API Client automatically handles:

### 1. Network Errors

- Auto-retry dengan exponential backoff
- Configurable retry attempts (default: 3)

### 2. Authentication Errors

- Auto-redirect ke login pada 401 Unauthorized
- Auto-clear token dan user data

### 3. Validation Errors

- Returns structured error dengan field-level messages
- Format: `{ message, status, errors: { field: ['error1', 'error2'] } }`

### 4. Timeout

- Configurable timeout (default: 30s)
- Auto-retry on timeout

### Example Error Handling

```typescript
try {
  const result = await serviceManager.auth.login({ email, password });
} catch (error) {
  if (error.status === 401) {
    console.error("Invalid credentials");
  } else if (error.errors) {
    // Validation errors
    console.error("Validation errors:", error.errors);
  } else {
    console.error("Network error:", error.message);
  }
}
```

---

## 🧪 Testing

### Test API Connection

```typescript
// Check if API is reachable
const isHealthy = await serviceManager.checkHealth();

// Test login
const loginResult = await serviceManager.auth.login({
  email: "test@example.com",
  password: "password123",
});
```

### Debug Mode

Enable debug mode di `.env`:

```
VITE_DEBUG_MODE=true
```

Akan menampilkan log detail di console:

- Request URL, method, headers
- Response status, data
- Error details
- Token information
- CSRF token status

---

## 📱 Platform-Specific Notes

### Web (Browser)

- Uses Fetch API
- CSRF protection enabled
- Cookies untuk session management
- Proxy configuration di `vite.config.ts`

### Mobile (Android/iOS via Capacitor)

- Uses XMLHttpRequest (more reliable)
- CSRF protection disabled
- Token-based authentication only
- Direct connection ke API (no proxy)

---

## 🚨 Troubleshooting

### 1. CORS Error

**Problem:** `Access-Control-Allow-Origin` error

**Solution:**

- Check `config/cors.php` di backend
- Pastikan origin app ada di `allowed_origins`
- Pastikan `supports_credentials => true`

### 2. 401 Unauthorized

**Problem:** Token invalid atau expired

**Solution:**

- Clear localStorage dan login ulang
- Check token expiration di backend
- Pastikan token di-attach di request header

### 3. Network Timeout

**Problem:** Request timeout

**Solution:**

- Increase `VITE_API_TIMEOUT` di `.env`
- Check network connection
- Verify backend is running

### 4. CSRF Token Mismatch

**Problem:** CSRF token tidak valid

**Solution:**

- Clear cookies dan refresh page
- Check `config/sanctum.php` di backend
- Pastikan domain ada di `stateful` list

---

## 📝 Migration dari API Config Lama

Jika sebelumnya menggunakan `api.config.ts`, migrasi ke `api.client.ts`:

### Before

```typescript
import apiClient from "./services/api.config";
const data = await apiClient.get("/endpoint");
```

### After

```typescript
import { apiClient } from "./services";
const data = await apiClient.get("/endpoint");
```

Atau lebih baik, gunakan Service Manager:

```typescript
import { serviceManager } from "./services";
const data = await serviceManager.api.get("/endpoint");
```

---

## ✅ Checklist Setup

- [ ] Backend Laravel running di `https://hakunamatata.my.id`
- [ ] Database configured dan migrations done
- [ ] CORS configured di backend
- [ ] Sanctum configured di backend
- [ ] `.env` file configured di frontend
- [ ] Service Manager initialized on app startup
- [ ] Test login working
- [ ] Test API endpoints working
- [ ] Error handling working
- [ ] Mobile build tested (if applicable)

---

## 📚 Additional Resources

- [Laravel Sanctum Documentation](https://laravel.com/docs/sanctum)
- [Ionic Framework Documentation](https://ionicframework.com/docs)
- [Capacitor Documentation](https://capacitorjs.com/docs)

---

## 💡 Best Practices

1. **Always use Service Manager** untuk akses API
2. **Enable debug mode** saat development
3. **Handle errors gracefully** di UI
4. **Test on real devices** untuk mobile
5. **Monitor network requests** di browser DevTools
6. **Keep tokens secure** - never log full tokens
7. **Implement proper loading states** di UI
8. **Use proper TypeScript types** untuk type safety

---

## 🎯 Next Steps

1. Test semua endpoint API
2. Implement proper error messages di UI
3. Add loading states untuk semua API calls
4. Test on production server
5. Test on real devices (Android/iOS)
6. Implement refresh token mechanism (if needed)
7. Add request/response interceptors (if needed)
8. Monitor API performance

---

**Last Updated:** November 4, 2025
**Version:** 1.0.0
**Author:** Development Team
