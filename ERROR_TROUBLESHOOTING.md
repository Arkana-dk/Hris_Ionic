# 🚨 ERROR TROUBLESHOOTING GUIDE

## Error yang Terlihat di Console

### 1. **404 Not Found Errors** ❌

```
GET https://hakunamatata.my.id/api/employee/announcements?limit=3 404 (Not Found)
GET https://hakunamatata.my.id/api/employee/dashboard 404 (Not Found)
```

**Penyebab:**

- Endpoint belum dibuat di backend Laravel
- Route belum didefinisikan di `routes/api.php`
- Controller/method belum ada

**Solusi Backend (Laravel):**

1. **Buat Route** di `routes/api.php`:

```php
Route::middleware('auth:sanctum')->prefix('employee')->group(function () {
    // Dashboard
    Route::get('/dashboard', [EmployeeController::class, 'dashboard']);

    // Announcements
    Route::get('/announcements', [EmployeeController::class, 'announcements']);

    // Events
    Route::get('/events/today', [EmployeeController::class, 'todayEvents']);

    // Statistics
    Route::get('/statistics/monthly', [EmployeeController::class, 'monthlyStatistics']);
});
```

2. **Buat Controller Method**:

```php
// app/Http/Controllers/EmployeeController.php

public function dashboard(Request $request)
{
    $user = $request->user();

    return response()->json([
        'data' => [
            'user' => [
                'name' => $user->name,
                'full_name' => $user->full_name ?? $user->name,
                'position' => $user->position ?? 'Employee',
                'job_title' => $user->job_title ?? $user->position,
                'avatar' => $user->avatar,
                'email' => $user->email,
            ],
            'attendance' => [
                'status' => 'not_started',
                'clock_in_time' => null,
                'clock_out_time' => null,
                'working_duration' => null,
            ],
            'statistics' => [
                'attendance_count' => 0,
                'leave_used' => 0,
                'leave_remaining' => 12,
                'total_working_hours' => '0h 0m',
            ],
            'events' => [],
            'announcements' => [],
        ]
    ]);
}

public function announcements(Request $request)
{
    $limit = $request->input('limit', 5);

    $announcements = Announcement::latest()
        ->take($limit)
        ->get();

    return response()->json(['data' => $announcements]);
}
```

---

### 2. **Network Errors** ❌

```
API Error: Network Error URL: /employee/dashboard
net::ERR_CONNECTION_CLOSED
net::ERR_NETWORK
```

**Penyebab:**

- Backend server tidak running
- Backend crashed
- Port tidak sesuai
- Firewall blocking connection
- SSL/HTTPS issues

**Solusi:**

#### A. Check Backend Status

```bash
# Di terminal backend Laravel
php artisan serve

# Atau jika menggunakan Laravel Valet
valet links

# Check apakah backend bisa diakses
curl https://hakunamatata.my.id/api/health
```

#### B. Check Port & URL

Pastikan `.env` di frontend sesuai:

```properties
VITE_API_URL=https://hakunamatata.my.id/api
VITE_API_BASE_URL=https://hakunamatata.my.id
```

#### C. Check CORS di Backend

File `config/cors.php`:

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

#### D. Check SSL Certificate (jika HTTPS)

```bash
# Test SSL
curl -v https://hakunamatata.my.id

# Jika self-signed certificate, tambahkan di vite.config.ts:
server: {
  proxy: {
    '/api': {
      target: 'https://hakunamatata.my.id',
      changeOrigin: true,
      secure: false,  // <-- Set false untuk self-signed
    }
  }
}
```

---

### 3. **Request Timeout** ⏱️

```
Request timeout: 30000ms
```

**Penyebab:**

- Backend terlalu lambat
- Query database lambat
- Network latency tinggi

**Solusi:**

1. **Increase Timeout** di `.env`:

```properties
VITE_API_TIMEOUT=60000  # 60 seconds
```

2. **Optimize Backend Queries**:

```php
// Gunakan eager loading
$data = Model::with('relation')->get();

// Add indexes
Schema::table('attendances', function (Blueprint $table) {
    $table->index('employee_id');
    $table->index('date');
});
```

---

## 🔧 Quick Fixes untuk Development

### Frontend Fallback (Temporary)

App sudah dilengkapi dengan fallback mechanism:

1. **Mock Data** - Jika API gagal, akan return mock data
2. **Error Handling** - Error tidak akan crash app
3. **User Feedback** - Clear error messages

### Testing Backend Connection

Buka browser console dan jalankan:

```javascript
// Test koneksi
await serviceManager.checkHealth();

// Test login
await serviceManager.auth.login({
  email: "your@email.com",
  password: "password",
});

// Test dashboard
await serviceManager.dashboard.getDashboard();
```

---

## 📋 Checklist Backend Setup

- [ ] Backend server running (`php artisan serve`)
- [ ] Database configured dan migrate done
- [ ] Routes defined di `routes/api.php`
- [ ] Controllers created dengan methods
- [ ] CORS configured di `config/cors.php`
- [ ] Sanctum configured di `config/sanctum.php`
- [ ] Test endpoints dengan Postman/curl
- [ ] SSL certificate valid (jika HTTPS)

---

## 🎯 Prioritas Fix

### HIGH PRIORITY (Must Fix)

1. ✅ Backend server must be running
2. ✅ Basic routes harus tersedia (`/login`, `/me`)
3. ✅ CORS must be configured
4. ✅ Database connection working

### MEDIUM PRIORITY (Nice to Have)

1. 🔄 Dashboard endpoint
2. 🔄 Announcements endpoint
3. 🔄 Statistics endpoint
4. 🔄 Events endpoint

### LOW PRIORITY (Optional)

1. ⏳ Performance optimization
2. ⏳ Caching
3. ⏳ Rate limiting
4. ⏳ Advanced features

---

## 💡 Development Mode Tips

### 1. Use Mock Data Sementara

Frontend sudah support mock data. Jika backend belum ready:

- App tetap bisa dijalankan
- Mock data akan ditampilkan
- Develop UI dulu, backend menyusul

### 2. Test dengan Postman

Test semua endpoint di Postman sebelum integrate:

```
POST https://hakunamatata.my.id/api/login
Headers:
  Content-Type: application/json
  Accept: application/json

Body:
{
  "email": "user@example.com",
  "password": "password"
}
```

### 3. Enable Debug Mode

Di `.env`:

```properties
VITE_DEBUG_MODE=true
```

Akan menampilkan detail log di console.

---

## 📞 Need Help?

Jika masih error:

1. **Check Laravel logs**: `storage/logs/laravel.log`
2. **Check browser Network tab**: Lihat request/response
3. **Check browser Console**: Error messages
4. **Test dengan curl**: `curl -v https://hakunamatata.my.id/api/health`

---

**Last Updated:** November 4, 2025  
**Status:** Ready for Backend Integration
