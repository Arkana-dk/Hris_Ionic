# 📱 Android Setup Guide - HRIS Mobile App

## ✅ Setup Berhasil!

Project Ionic Anda sudah berhasil dikoneksikan dengan Android Studio!

---

## 📁 Struktur Folder

```
HRIS_IONIC/
├── android/              ← Folder Android (auto-generated)
│   ├── app/
│   │   └── src/
│   │       └── main/
│   │           └── assets/
│   │               └── public/   ← Web assets
│   ├── build.gradle
│   └── gradle/
├── dist/                 ← Build hasil (dari npm run build)
├── src/                  ← Source code React/Ionic
└── capacitor.config.ts   ← Config Capacitor
```

---

## 🚀 Quick Commands

### **1. Build & Open Android Studio**

```bash
npm run android
```

**Fungsi:** Build project → Sync ke Android → Buka Android Studio

### **2. Sync Perubahan ke Android (Tanpa Build)**

```bash
npm run android:sync
```

**Fungsi:** Build → Sync web assets ke Android

### **3. Buka Android Studio (Tanpa Build)**

```bash
npm run android:open
```

**Fungsi:** Hanya buka Android Studio

### **4. Run di Android Device/Emulator**

```bash
npm run android:run
```

**Fungsi:** Build → Sync → Run di device yang terhubung

---

## 🔧 Workflow Development

### **Skenario 1: Edit Code React/Ionic**

1. **Edit file** di `src/` folder
2. **Build & Sync:**
   ```bash
   npm run android:sync
   ```
3. **Di Android Studio:** Klik "Run" (▶️) atau refresh

### **Skenario 2: Test di Browser Dulu**

1. **Jalankan dev server:**
   ```bash
   npm run dev
   ```
2. **Buka browser:** http://localhost:5173
3. **Test semua fitur**
4. **Jika sudah OK, build untuk Android:**
   ```bash
   npm run android
   ```

### **Skenario 3: Edit Native Android Code**

1. **Buka Android Studio:**
   ```bash
   npm run android:open
   ```
2. **Edit di:** `android/app/src/main/java/...`
3. **Run dari Android Studio**

---

## 📱 Run di Android

### **Opsi 1: Android Emulator**

1. **Buka Android Studio**
2. **Tools → Device Manager**
3. **Create Virtual Device** (jika belum ada)
4. **Pilih device** (misal: Pixel 5, API 34)
5. **Klik Run** (▶️)

### **Opsi 2: Physical Device**

1. **Enable Developer Options** di HP Android:
   - Settings → About Phone
   - Tap "Build Number" 7x
2. **Enable USB Debugging:**

   - Settings → Developer Options
   - Toggle "USB Debugging" ON

3. **Hubungkan HP ke PC** via USB

4. **Di Android Studio:**

   - Pilih device di dropdown
   - Klik Run (▶️)

5. **Atau via terminal:**
   ```bash
   npm run android:run
   ```

---

## 🔍 Check Connection

### **Cek Devices yang Terhubung:**

```bash
adb devices
```

**Output yang diharapkan:**

```
List of devices attached
emulator-5554    device
# atau
ABC123XYZ        device  ← Physical device
```

---

## ⚙️ Konfigurasi App

### **File: `capacitor.config.ts`**

```typescript
{
  appId: 'com.bridgestone.hris',      // Package name Android
  appName: 'HRIS Mobile',              // Nama app di home screen
  webDir: 'dist',                      // Folder build output
  server: {
    androidScheme: 'https'             // Use HTTPS scheme
  }
}
```

### **Edit Package Name:**

1. Edit `capacitor.config.ts`
2. Edit `android/app/build.gradle`:
   ```gradle
   applicationId "com.bridgestone.hris"
   ```
3. Sync:
   ```bash
   npx cap sync android
   ```

---

## 🔌 API Configuration untuk Android

### **File: `.env`**

**Untuk Development (Android Emulator):**

```env
# Android Emulator menggunakan 10.0.2.2 untuk localhost
VITE_API_URL=http://10.0.2.2:8000/api
```

**Untuk Physical Device (HP Android):**

```env
# Gunakan IP komputer di network yang sama
VITE_API_URL=http://192.168.1.100:8000/api
```

### **Cek IP Komputer:**

**Windows:**

```bash
ipconfig
```

Lihat di "IPv4 Address"

**Linux/Mac:**

```bash
ifconfig
```

---

## 🐛 Troubleshooting

### **1. Android Studio tidak terbuka**

**Solusi:**

- Buka manual: File → Open → pilih folder `android/`
- Atau double-click: `android/build.gradle`

### **2. Gradle Sync Failed**

**Solusi:**

```bash
cd android
./gradlew clean
./gradlew build
```

### **3. Perubahan tidak muncul di App**

**Solusi:**

```bash
# Clear & rebuild
npm run build
npx cap sync android
# Di Android Studio: Build → Clean Project → Rebuild
```

### **4. API Error: Network Error**

**Penyebab:** API URL salah untuk Android

**Solusi:**

- Emulator: gunakan `http://10.0.2.2:8000/api`
- Physical: gunakan IP komputer `http://192.168.X.X:8000/api`

### **5. App Crash saat dibuka**

**Cek Logcat di Android Studio:**

- View → Tool Windows → Logcat
- Filter: "Capacitor" atau "Error"

---

## 📦 Build APK untuk Testing

### **Debug APK (Unsigned):**

1. **Di Android Studio:**
   - Build → Build Bundle(s) / APK(s) → Build APK(s)
2. **Location:**

   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

3. **Install ke device:**
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

### **Release APK (Signed):**

**Coming Soon** - Perlu signing key untuk production

---

## 🎯 Next Steps

### **1. Install Plugin Tambahan**

**Camera:**

```bash
npm install @capacitor/camera
npx cap sync android
```

**Geolocation:**

```bash
npm install @capacitor/geolocation
npx cap sync android
```

**File System:**

```bash
npm install @capacitor/filesystem
npx cap sync android
```

### **2. Request Permissions**

Edit `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

### **3. Update setiap ada perubahan:**

```bash
npm run android:sync
```

---

## 📝 Important Notes

### **⚠️ Setiap kali edit code di `src/`:**

1. **Build project:**

   ```bash
   npm run build
   ```

2. **Sync ke Android:**

   ```bash
   npx cap sync android
   ```

3. **Atau langsung:**
   ```bash
   npm run android:sync
   ```

### **✅ File yang di-commit ke Git:**

- ✅ `capacitor.config.ts`
- ✅ `android/` (opsional, tapi recommended)
- ❌ `dist/` (jangan commit)
- ❌ `node_modules/` (jangan commit)

---

## 🆘 Need Help?

### **Capacitor Documentation:**

- https://capacitorjs.com/docs/android

### **Ionic Documentation:**

- https://ionicframework.com/docs/react

### **Common Issues:**

- https://capacitorjs.com/docs/android/troubleshooting

---

## ✨ Summary

**Setup COMPLETED! ✅**

Sekarang Anda bisa:

- ✅ Edit code di VS Code
- ✅ Build & sync ke Android
- ✅ Run di Android Emulator
- ✅ Run di Physical Device
- ✅ Debug di Android Studio
- ✅ Build APK untuk testing

**Happy Coding! 🚀**
