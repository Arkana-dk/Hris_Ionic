# 🔧 Backend Configuration untuk CORS & API Access

## ⚠️ **MASALAH YANG TERDETEKSI:**

Dari error di screenshot:

```
Login error: Error: Network error. Please check your connection.
```

Dan dari test terminal:

- ✅ Backend AKTIF: `https://hakunamatata.my.id/api/login` → Response 401
- ✅ Dev Server RUNNING: `http://localhost:5173`
- ❌ Request dari browser **GAGAL** → Network error

**Kesimpulan:** Ada **blocking** antara frontend → backend, kemungkinan:

1. **CORS policy** di backend masih block localhost
2. **Firewall** di cPanel/server block request
3. **SSL/HTTPS issue**

---

## 🎯 **SOLUSI LENGKAP:**

### **Opsi 1: MINTA BACKEND TEAM KONFIGURASI CORS** (RECOMMENDED)

Backend perlu **whitelist** origin dari localhost untuk development.

#### **A. Untuk Laravel Backend:**

**File: `config/cors.php`**

```php
<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:5173',      // ← TAMBAHKAN INI (Vite dev server)
        'http://localhost:5174',      // Backup port
        'http://localhost:8100',      // Ionic serve
        'http://127.0.0.1:5173',      // Alternative localhost
        'capacitor://localhost',      // Mobile app
        'ionic://localhost',          // Mobile app
        // Tambahkan production URL nanti:
        // 'https://yourdomain.com',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];
```

**File: `.env` (Laravel)**

Pastikan APP_URL sudah benar:

```env
APP_URL=https://hakunamatata.my.id
```

#### **B. Untuk Non-Laravel (PHP Vanilla):**

Tambahkan di awal file API (misal: `api/login.php`):

```php
<?php

// CORS Headers
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Rest of your code...
```

#### **C. Via .htaccess (Apache):**

**File: `public/.htaccess` atau `api/.htaccess`**

```apache
# Enable CORS for localhost
<IfModule mod_headers.c>
    # Allow from localhost (development)
    SetEnvIf Origin "http://localhost:5173" AccessControlAllowOrigin=$0
    Header set Access-Control-Allow-Origin %{AccessControlAllowOrigin}e env=AccessControlAllowOrigin

    # Alternative: Allow all (NOT RECOMMENDED for production)
    # Header set Access-Control-Allow-Origin "*"

    Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
    Header set Access-Control-Allow-Credentials "true"

    # Handle preflight
    RewriteEngine On
    RewriteCond %{REQUEST_METHOD} OPTIONS
    RewriteRule ^(.*)$ $1 [R=200,L]
</IfModule>
```

---

### **Opsi 2: KONFIGURASI DI cPANEL** (Jika Ada Akses)

#### **A. Via cPanel File Manager:**

1. **Login ke cPanel** hakunamatata.my.id
2. **Buka File Manager**
3. **Navigate ke folder API** (biasanya `public_html/api/` atau `public/api/`)
4. **Edit file `.htaccess`** atau buat baru
5. **Tambahkan CORS headers** (lihat code di atas)
6. **Save**

#### **B. Via cPanel ModSecurity:**

Jika ada ModSecurity yang block:

1. **cPanel → ModSecurity**
2. **Disable ModSecurity** untuk folder `/api/` (temporary untuk test)
3. **Atau whitelist** IP address Anda

#### **C. Via cPanel Security:**

1. **cPanel → IP Blocker**
2. **Pastikan IP Anda tidak di-block**
3. **Whitelist jika perlu**

#### **D. Via Cloudflare (Jika Pakai):**

Jika domain pakai Cloudflare:

1. **Login Cloudflare Dashboard**
2. **Select domain hakunamatata.my.id**
3. **Firewall → Configuration → CORS**
4. **Add rule:**
   - **If:** Custom filter
   - **Path:** `/api/*`
   - **Then:** Set CORS headers
   - **Allow Origin:** `http://localhost:5173`

---

### **Opsi 3: SOLUSI SEMENTARA - BYPASS CORS DI BROWSER** (DEVELOPMENT ONLY)

**⚠️ WARNING: Hanya untuk development! JANGAN di production!**

#### **Chrome/Edge (Windows):**

1. **Tutup semua Chrome/Edge**
2. **Buka Command Prompt**
3. **Run:**

```bash
# Chrome
"C:\Program Files\Google\Chrome\Application\chrome.exe" --disable-web-security --user-data-dir="C:\temp\chrome_dev"

# Edge
"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --disable-web-security --user-data-dir="C:\temp\edge_dev"
```

4. **Buka app:** http://localhost:5173
5. **Login** (CORS akan di-bypass)

**Keuntungan:**

- ✅ Langsung bisa test tanpa menunggu backend
- ✅ Tidak perlu config backend

**Kekurangan:**

- ❌ Security risk (jangan browse website lain)
- ❌ Hanya untuk testing
- ❌ Harus reopen browser dengan flag setiap kali

---

### **Opsi 4: GUNAKAN REAL PROXY SERVER** (Alternative)

Jika proxy Vite tidak work, gunakan CORS proxy external:

#### **A. Install cors-anywhere (Local):**

```bash
# Di folder terpisah
npx cors-anywhere

# Akan running di http://localhost:8080
```

#### **B. Update API URL:**

**File: `.env`**

```env
# Via CORS proxy
VITE_API_URL=http://localhost:8080/https://hakunamatata.my.id/api
```

#### **C. Atau gunakan public CORS proxy:**

**⚠️ WARNING: Jangan untuk production! Hanya testing!**

```env
# Public CORS proxy (rate limited)
VITE_API_URL=https://cors-anywhere.herokuapp.com/https://hakunamatata.my.id/api
```

---

## 🧪 **TEST CHECKLIST:**

### **Test 1: Cek Backend CORS Configuration**

```bash
# Test preflight (OPTIONS request)
curl -X OPTIONS https://hakunamatata.my.id/api/login \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

**Expected Response Headers:**

```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

**Jika TIDAK ada headers ini → Backend belum configure CORS!**

---

### **Test 2: Cek Firewall/Security**

```bash
# Test direct POST
curl -X POST https://hakunamatata.my.id/api/login \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{"email":"test@test.com","password":"test"}' \
  -v
```

**Jika response 403 → Firewall block**
**Jika response 401 → Backend OK, CORS yang masalah**
**Jika timeout → Server/Network issue**

---

### **Test 3: Cek dari Browser Console**

Buka DevTools Console dan run:

```javascript
// Test fetch langsung
fetch("https://hakunamatata.my.id/api/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "test@test.com",
    password: "test",
  }),
})
  .then((res) => res.json())
  .then((data) => console.log("✅ Success:", data))
  .catch((err) => console.error("❌ Error:", err));
```

**Expected Error (jika CORS belum fix):**

```
Access to fetch at 'https://hakunamatata.my.id/api/login'
from origin 'http://localhost:5173' has been blocked by CORS policy
```

---

## 📋 **YANG PERLU DIKOMUNIKASIKAN KE BACKEND TEAM:**

### **Email Template:**

```
Subject: Request CORS Configuration untuk Development Mobile App

Halo Tim Backend,

Saya sedang develop HRIS Mobile App (Ionic) yang akan consume API dari hakunamatata.my.id.

Untuk development di local (localhost), saya perlu backend enable CORS untuk origin berikut:

Origins yang perlu di-whitelist:
- http://localhost:5173 (Vite dev server)
- http://localhost:5174 (Backup port)
- http://localhost:8100 (Ionic serve)
- capacitor://localhost (Mobile app)

Mohon dapat dikonfigurasi di:
1. Laravel: config/cors.php → allowed_origins
2. Atau via .htaccess → Access-Control-Allow-Origin header

Test endpoint yang saya gunakan:
- POST /api/login
- GET /api/employee/profile
- GET /api/employee/attendance
- dll.

Untuk production nanti, saya akan inform domain production yang perlu di-whitelist.

Terima kasih!
```

---

## 🎯 **RECOMMENDATION:**

### **Short Term (Sekarang):**

1. **Gunakan Opsi 3** (Browser dengan --disable-web-security)

   - Paling cepat untuk test
   - Bisa langsung develop
   - Tunggu backend fix CORS

2. **Atau gunakan Mock** sementara
   ```env
   VITE_USE_REAL_API=false
   ```
   ```typescript
   // services/index.ts
   export { default as authService } from "./auth.service.mock";
   ```

### **Medium Term (1-2 hari):**

1. **Koordinasi dengan Backend Team**

   - Minta fix CORS configuration
   - Provide origins yang perlu di-whitelist
   - Test setelah mereka deploy

2. **Verify CORS sudah OK**
   - Test dengan curl
   - Test dengan browser normal (tanpa flag)
   - Verify semua endpoint

### **Long Term (Production):**

1. **Update CORS untuk Production Domain**

   ```php
   'allowed_origins' => [
       'https://yourmobileapp.com',
       'capacitor://localhost',
       'ionic://localhost',
   ],
   ```

2. **Remove development origins**

   - localhost tidak perlu di production
   - Hanya allow production domain

3. **Enable proper security**
   - HTTPS only
   - Token expiry
   - Rate limiting

---

## ✅ **SUMMARY:**

### **Masalah Saat Ini:**

| Issue                | Status     | Solution            |
| -------------------- | ---------- | ------------------- |
| Backend Online       | ✅ OK      | `curl` berhasil     |
| Dev Server Running   | ✅ OK      | localhost:5173      |
| CORS Headers         | ❌ Missing | Need backend config |
| Request dari Browser | ❌ Blocked | CORS policy         |

### **Action Items:**

**Untuk Anda:**

1. ✅ Dev server sudah running
2. ⏳ Koordinasi dengan backend team
3. ⏳ Test dengan opsi 3 (browser flag) sementara

**Untuk Backend Team:**

1. ⏳ Configure CORS headers
2. ⏳ Whitelist localhost origins
3. ⏳ Deploy & inform

### **Estimasi Timeline:**

- **Sekarang:** Use browser flag atau mock (langsung bisa)
- **1-2 hari:** Backend fix CORS (setelah koordinasi)
- **3-5 hari:** Full integration test
- **1 minggu:** Production ready

---

**Last Updated:** October 19, 2025  
**Status:** ⏳ Waiting Backend CORS Configuration  
**Workaround:** Available (browser flag atau mock)
