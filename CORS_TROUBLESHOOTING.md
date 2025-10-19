# 🚨 CORS Error - Troubleshooting Guide

## ❌ **Error yang Terjadi**

```
Access to XMLHttpRequest at 'https://hakunamatata.my.id/api/login'
from origin 'http://localhost:5173' has been blocked by CORS policy:
Response to preflight request doesn't pass access control check:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

---

## 🔍 **Apa itu CORS?**

**CORS (Cross-Origin Resource Sharing)** adalah security feature di browser untuk:

- Melindungi user dari malicious request
- Memblokir request dari domain yang berbeda
- Memastikan hanya origin yang diizinkan bisa akses API

### **Dalam Kasus Ini:**

```
Frontend Origin:  http://localhost:5173
Backend Origin:   https://hakunamatata.my.id
Status:           ❌ DIFFERENT ORIGINS (CORS akan aktif)
```

Browser akan **MEMBLOKIR** karena:

1. Protocol berbeda: `http://` vs `https://`
2. Domain berbeda: `localhost` vs `hakunamatata.my.id`
3. Backend tidak mengirim header `Access-Control-Allow-Origin`

---

## 🛠️ **Solusi yang Tersedia**

### **Solusi 1: Backend Configure CORS** ⭐ (BEST - PERMANENT)

**Untuk:** Production & Development
**Setup by:** Backend Developer
**Difficulty:** Easy (5 menit)

#### **Laravel Backend:**

Edit file `config/cors.php`:

```php
<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:5173',      // Vite dev server
        'http://localhost:5174',      // Alternative port
        'http://localhost:8100',      // Ionic serve
        'capacitor://localhost',      // Mobile app
        'ionic://localhost',          // iOS/Android
        'https://your-production-domain.com',  // Production
    ],

    'allowed_origins_patterns' => [
        '/^http:\/\/localhost:\d+$/',  // Any localhost port
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];
```

#### **Non-Laravel (PHP):**

Tambahkan di awal file PHP atau middleware:

```php
// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: http://localhost:5173');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Max-Age: 86400');
    exit(0);
}

// Add CORS headers to all responses
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
```

#### **Node.js/Express Backend:**

```javascript
const cors = require("cors");

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:8100",
      "capacitor://localhost",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
```

**✅ Keuntungan:**

- Permanent solution
- Works in all environments
- Secure & proper
- No workaround needed

**⏱️ Timeline:** Minta backend team, biasanya 5-30 menit

---

### **Solusi 2: Vite Proxy** ✅ (SUDAH DIIMPLEMENTASIKAN)

**Untuk:** Development only
**Setup by:** Frontend Developer (You)
**Difficulty:** Easy
**Status:** ✅ DONE

#### **Cara Kerja:**

```
Browser                Vite Dev Server           Backend
  │                          │                      │
  │──── /api/login ─────────>│                      │
  │    (same origin)         │                      │
  │                          │──── /api/login ─────>│
  │                          │  (proxy forward)     │
  │                          │<────── 200 ──────────│
  │<───── 200 ───────────────│                      │
  │   (no CORS issue)        │                      │
```

**Sudah dikonfigurasi di `vite.config.ts`:**

```typescript
server: {
  proxy: {
    '/api': {
      target: 'https://hakunamatata.my.id',
      changeOrigin: true,
      secure: false,
    }
  }
}
```

**Dan `.env` diupdate:**

```env
VITE_API_URL=/api
```

**✅ Keuntungan:**

- Quick fix untuk development
- No backend changes needed
- Works immediately

**⚠️ Kekurangan:**

- Development only (production perlu backend CORS)
- Not working untuk mobile app testing

---

### **Solusi 3: Mock Mode** ✅ (SEMENTARA - SUDAH AKTIF)

**Untuk:** Development tanpa backend dependency
**Setup by:** Frontend Developer
**Difficulty:** None (already done)
**Status:** ✅ ACTIVE NOW

**Current setting di `.env`:**

```env
VITE_USE_REAL_API=false
```

**✅ Keuntungan:**

- No CORS issue
- No backend dependency
- Fast development
- Works offline

**⚠️ Kekurangan:**

- Not real data
- Can't test real API integration

---

### **Solusi 4: Browser Extension** (NOT RECOMMENDED)

Install extension seperti "CORS Unblock" atau "Allow CORS"

**❌ JANGAN GUNAKAN karena:**

- Security risk
- Not for production
- Hide real problems
- Bad practice

---

## 🎯 **Rekomendasi Solusi**

### **Untuk Development (Sekarang):**

**Option A: Gunakan Vite Proxy** (Sudah setup)

```env
VITE_API_URL=/api
VITE_USE_REAL_API=true
```

✅ Bisa test real API
✅ No CORS issue
✅ Real integration testing

**Option B: Gunakan Mock** (Current setting)

```env
VITE_API_URL=/api
VITE_USE_REAL_API=false
```

✅ Fastest development
✅ No backend dependency
✅ Works offline

### **Untuk Production (Nanti):**

**Minta Backend Team configure CORS**

```env
VITE_API_URL=https://hakunamatata.my.id/api
VITE_USE_REAL_API=true
```

---

## 🔄 **Cara Switch Mode**

### **Test dengan Vite Proxy:**

1. **Edit `.env`:**

```env
VITE_API_URL=/api
VITE_USE_REAL_API=true
```

2. **Restart server:**

```bash
# Ctrl+C untuk stop
npm run dev
```

3. **Test login** dengan credentials apapun
4. **Lihat console** - akan hit real API via proxy

---

### **Back to Mock Mode:**

1. **Edit `.env`:**

```env
VITE_USE_REAL_API=false
```

2. **Restart server**

3. **Login dengan:**
   - Email: `admin@example.com`
   - Password: `password`

---

## 🐛 **Troubleshooting Proxy**

### **Proxy tidak bekerja?**

**Cek 1: Restart server**

```bash
# Stop (Ctrl+C)
npm run dev
```

**Cek 2: Lihat console network tab**

```
Request URL: http://localhost:5173/api/login  ✅ (via proxy)
NOT: https://hakunamatata.my.id/api/login     ❌ (direct)
```

**Cek 3: Cek vite.config.ts**

```typescript
server: {
  proxy: {
    '/api': {
      target: 'https://hakunamatata.my.id',
      changeOrigin: true,  // Important!
      secure: false,
    }
  }
}
```

---

## 📞 **Hubungi Backend Team**

**Subject:** Request CORS Configuration for HRIS Mobile App

**Message Template:**

```
Hi Backend Team,

Saya develop mobile app yang consume API dari hakunamatata.my.id.
Request untuk enable CORS dengan config berikut:

Allowed Origins:
- http://localhost:5173 (development)
- http://localhost:8100 (Ionic serve)
- capacitor://localhost (mobile app)
- [production domain jika sudah ada]

Allowed Methods: GET, POST, PUT, DELETE, OPTIONS
Allowed Headers: Content-Type, Authorization
Credentials: true

File config (Laravel): config/cors.php

Terima kasih!
```

---

## ✅ **Current Status**

### **Setup Saat Ini:**

| Component       | Status        | Config                    |
| --------------- | ------------- | ------------------------- |
| Vite Proxy      | ✅ Configured | `vite.config.ts`          |
| API URL         | ✅ Updated    | `/api` (via proxy)        |
| Mock Mode       | ✅ Active     | `VITE_USE_REAL_API=false` |
| CORS Workaround | ✅ Ready      | Proxy akan handle         |

### **Next Steps:**

1. ✅ **Sekarang:** Gunakan mock mode untuk development UI
2. ⏳ **Nanti:** Minta backend team configure CORS
3. 🎯 **Production:** Switch ke real API dengan CORS configured

---

## 📊 **Comparison Table**

| Solution     | Setup Time | Works in Dev | Works in Prod | Best For         |
| ------------ | ---------- | ------------ | ------------- | ---------------- |
| Backend CORS | 5-30 min   | ✅           | ✅            | Production ready |
| Vite Proxy   | 2 min      | ✅           | ❌            | Development      |
| Mock Mode    | 0 min      | ✅           | ❌            | UI Development   |
| Browser Ext  | 1 min      | ⚠️           | ❌            | Never use        |

---

**Last Updated:** October 19, 2025
**Status:** CORS Issue - Using Mock Mode + Proxy Ready
**Recommendation:** Contact backend team untuk permanent fix
