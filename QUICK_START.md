# 🚀 Quick Start Guide - Localhost Development

## ⚡ 5-Minute Setup

### Step 1: Backend Laravel (Terminal 1)

```bash
# Navigate to backend folder
cd /path/to/hris-fix

# Install dependencies (first time only)
composer install

# Copy environment file (first time only)
cp .env.example .env

# Generate app key (first time only)
php artisan key:generate

# Setup database (first time only)
php artisan migrate --seed

# Start Laravel server
php artisan serve
```

✅ **Expected Output:**

```
INFO  Server running on [http://127.0.0.1:8000]
```

---

### Step 2: Frontend Ionic (Terminal 2)

```bash
# Navigate to Ionic project
cd c:/Users/ACER/Documents/Hris_Ionic

# Install dependencies (first time only)
npm install

# Start dev server
npm run dev
```

✅ **Expected Output:**

```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

---

### Step 3: Test Login

1. **Open Browser:** `http://localhost:5173`
2. **Login with:**
   - Email: `alice@example.com`
   - Password: `password`
3. **Check Console:** DevTools → Console → Lihat API calls

✅ **Success Indicators:**

- ✅ Login berhasil
- ✅ Token tersimpan di localStorage
- ✅ Redirect ke dashboard
- ✅ API calls ke `http://localhost:8000/api`

---

## 🔄 Quick Switch Environment

### Switch to Localhost (Development)

```bash
# Windows
switch-env.bat local

# Linux/Mac
bash switch-env.sh local

# Manual
cp .env.local .env
```

### Switch to Remote (Production)

```bash
# Windows
switch-env.bat remote

# Linux/Mac
bash switch-env.sh remote

# Manual
cp .env.remote .env
```

**⚠️ Important:** Restart dev server setelah switch!

```bash
npm run dev
```

---

## 🐛 Quick Troubleshooting

### ❌ CORS Error?

**Backend:** Edit `config/cors.php`

```php
'allowed_origins' => [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
],
```

### ❌ Connection Refused?

**Check:** Laravel server running?

```bash
php artisan serve
```

### ❌ 401 Unauthorized?

**Solution:** Login ulang untuk generate token baru

---

## 📝 Default Test Credentials

```javascript
// Employee User
{
  email: 'alice@example.com',
  password: 'password'
}

// Alternative User
{
  email: 'bob@example.com',
  password: 'password'
}
```

---

## 📊 Current Configuration

✅ **API Mode:** LOCALHOST DEVELOPMENT  
✅ **Backend:** `http://localhost:8000/api`  
✅ **Frontend:** `http://localhost:5173`  
❌ **Remote API:** DISABLED (hakunamatata.my.id)

---

## 🎯 Quick Commands Cheat Sheet

### Backend (Laravel)

```bash
php artisan serve           # Start server
php artisan migrate:fresh   # Reset database
php artisan db:seed         # Seed data
php artisan route:list      # List all API routes
tail -f storage/logs/laravel.log  # Watch logs
```

### Frontend (Ionic)

```bash
npm run dev                 # Start dev server
npm run build               # Build production
npm run lint                # Run linter
npm run test                # Run tests
```

### Environment

```bash
switch-env.bat local        # Use localhost
switch-env.bat remote       # Use remote API
```

---

## 🔗 Important URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000/api
- **Backend Web:** http://localhost:8000
- **Backend Docs:** http://localhost:8000/\_\_whoami (debug endpoint)
- **GitHub Repo:** https://github.com/Arkana-dk/hris-fix

---

## ✅ Development Checklist

- [ ] Laravel backend running (port 8000)
- [ ] Database configured & migrated
- [ ] Ionic frontend running (port 5173)
- [ ] `.env` set to localhost
- [ ] Test login berhasil
- [ ] Console shows API calls
- [ ] Token saved in localStorage

---

**🎉 Ready to Code!**

Untuk panduan lengkap, baca: [`LOCALHOST_DEVELOPMENT_GUIDE.md`](./LOCALHOST_DEVELOPMENT_GUIDE.md)
