# 🔧 API Configuration & Backend Setup Guide

## 🚨 **Current Issue: Backend Not Running**

Dari error yang muncul di console:

```
Network error. Please check your connection.
Request URL: http://localhost:8000/api/login
Status: Failed (Connection Refused)
```

**Penyebab:** Backend Laravel belum running di `localhost:8000`

---

## ✅ **Solusi 1: Gunakan Mock API (SUDAH DIIMPLEMENTASIKAN)**

Untuk development **tanpa backend**, saya sudah membuat Mock API Service yang akan mensimulasikan response dari server.

### **Mock Service Aktif:**

✅ File: `src/services/auth.service.mock.ts`
✅ Sudah di-export di `src/services/index.ts`

### **Cara Kerja Mock:**

- Login dengan credentials demo akan langsung berhasil
- Tidak perlu backend Laravel running
- Response di-simulate dengan delay 1 detik
- Token & user data tersimpan di localStorage

### **Demo Credentials:**

```
Email: admin@example.com
Password: password
```

### **Test Sekarang:**

1. Refresh browser (Ctrl + R)
2. Input email & password demo
3. Click "Login"
4. ✅ Harus berhasil masuk dashboard!

---

## 🔄 **Solusi 2: Setup Backend Laravel (Untuk Production)**

Jika Anda ingin menggunakan **Real API** dari backend Laravel:

### **Step 1: Start Laravel Backend**

```bash
# Di terminal Laravel project
cd path/to/laravel/project
php artisan serve
```

Backend akan running di: `http://localhost:8000`

### **Step 2: Pastikan CORS Setup di Laravel**

Edit `config/cors.php`:

```php
<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:5173', 'http://localhost:5174'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
```

### **Step 3: Buat API Endpoint di Laravel**

**File:** `routes/api.php`

```php
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// Auth Routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');
```

**File:** `app/Http/Controllers/AuthController.php`

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Email atau password salah'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'data' => [
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'employee_id' => $user->employee_id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'position' => $user->position,
                    'department' => $user->department,
                    'company' => $user->company,
                    'join_date' => $user->join_date,
                    'avatar' => $user->avatar,
                ]
            ]
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'data' => $request->user()
        ]);
    }
}
```

### **Step 4: Switch ke Real API**

Edit `src/services/index.ts`:

```typescript
// PRODUCTION MODE: Uncomment this
export { default as authService } from "./auth.service";

// DEVELOPMENT MODE: Comment this
// export { default as authService } from "./auth.service.mock";
```

### **Step 5: Restart Dev Server**

```bash
# Stop server (Ctrl + C)
npm run dev
```

---

## 🔀 **Mode Switching**

### **Development Mode (Mock API) - Current**

```typescript
// src/services/index.ts
export { default as authService } from "./auth.service.mock";
```

**Keuntungan:**

- ✅ Tidak perlu backend running
- ✅ Cepat untuk development UI
- ✅ Tidak perlu setup database
- ✅ Bisa test offline

**Kekurangan:**

- ❌ Data tidak real
- ❌ Tidak bisa test integrasi backend
- ❌ Fitur terbatas (hanya login/logout)

### **Production Mode (Real API)**

```typescript
// src/services/index.ts
export { default as authService } from "./auth.service";
```

**Keuntungan:**

- ✅ Data real dari database
- ✅ Full fitur backend
- ✅ Test integrasi lengkap
- ✅ Production-ready

**Kekurangan:**

- ❌ Butuh backend running
- ❌ Butuh database setup
- ❌ CORS configuration diperlukan

---

## 🐛 **Troubleshooting**

### **Error: Network Error / Connection Refused**

**Penyebab:**

- Backend tidak running
- Port salah
- CORS tidak disetup

**Solusi:**

1. **Gunakan Mock API** (sudah aktif sekarang)
2. **Atau start backend:**
   ```bash
   cd laravel-project
   php artisan serve
   ```

### **Error: CORS Policy**

**Penyebab:**
Frontend (localhost:5173) tidak diizinkan akses backend (localhost:8000)

**Solusi:**
Setup CORS di Laravel (lihat Step 2 di atas)

### **Error: 401 Unauthorized**

**Penyebab:**

- Credentials salah
- Token expired

**Solusi:**

- Gunakan credentials yang benar
- Logout & login ulang

### **Error: 500 Internal Server Error**

**Penyebab:**
Backend Laravel error

**Solusi:**

- Check Laravel log: `storage/logs/laravel.log`
- Check database connection
- Check .env configuration

---

## 📊 **API Response Format**

Backend Laravel harus return format ini:

### **Login Response:**

```json
{
  "data": {
    "token": "1|abc123def456...",
    "user": {
      "id": 1,
      "employee_id": "EMP-2024-BS-001",
      "name": "ILHAM HIDAYATULLAH",
      "email": "admin@example.com",
      "phone": "+62 812-3456-7890",
      "position": "Officer",
      "department": "IT",
      "company": "Bridgestone",
      "join_date": "2024-01-15",
      "avatar": "https://..."
    }
  }
}
```

### **Error Response:**

```json
{
  "message": "Email atau password salah"
}
```

---

## ✅ **Quick Start**

### **Option A: Development dengan Mock (Recommended untuk sekarang)**

1. ✅ **Sudah aktif** - Mock service sudah di-export
2. **Refresh browser**
3. **Login dengan:**
   - Email: `admin@example.com`
   - Password: `password`
4. **✅ Berhasil!**

### **Option B: Development dengan Real Backend**

1. **Start Laravel backend:**

   ```bash
   cd laravel-project
   php artisan serve
   ```

2. **Edit** `src/services/index.ts`:

   ```typescript
   export { default as authService } from "./auth.service";
   ```

3. **Restart dev server:**

   ```bash
   npm run dev
   ```

4. **Test login**

---

## 🎯 **Recommendation**

**Untuk Development UI (Sekarang):**

- ✅ Gunakan **Mock API**
- Focus ke UI/UX development
- Tidak perlu setup backend dulu

**Untuk Integration Testing:**

- Setup **Real Backend** Laravel
- Test dengan database real
- Test semua API endpoints

**Untuk Production:**

- Switch ke **Real API**
- Setup environment variables
- Deploy backend & frontend

---

## 📝 **Next Steps**

1. **Test dengan Mock API** (sudah aktif)
2. **Develop UI features** dengan mock data
3. **Setup Laravel backend** (optional, untuk later)
4. **Switch ke Real API** ketika backend siap
5. **Integration testing**
6. **Production deployment**

---

## 🚀 **Status Sekarang**

✅ **Mock API Service** - AKTIF
✅ **Login/Logout** - WORKING dengan mock
✅ **Token Management** - WORKING
✅ **Auth Context** - WORKING
✅ **Protected Routes** - WORKING

**Anda bisa langsung test login sekarang!** 🎉
