# 📚 HR Features Documentation

## Fitur-Fitur Utama HRIS

### 1. 📊 Dashboard (Homepage)

**Route:** `/dashboard`

**Fitur:**

- ✅ **Welcome Header** dengan greeting otomatis (Good Morning/Afternoon/Evening)
- ✅ **Profile Information** - Avatar, nama, posisi, department
- ✅ **Quick Actions** - 4 tombol akses cepat:
  - Clock In (hijau)
  - Clock Out (merah)
  - Request Leave (biru) - dengan badge notifikasi
  - Payslip (ungu)
- ✅ **Today's Summary** - Ringkasan hari ini:
  - Waktu clock in
  - Total jam kerja
  - Task completion
- ✅ **Monthly Statistics** - 4 kartu statistik:
  - Attendance (kehadiran bulan ini)
  - Leave Balance (sisa cuti)
  - Work Hours (total jam kerja)
  - Performance Rating
- ✅ **Upcoming Events** - 3 event terdekat dengan detail
- ✅ **Company News** - Pengumuman perusahaan

**Animasi:**

- Gradient animation pada header
- Fade in down untuk header
- Fade in up untuk quick actions
- Stagger animation untuk event cards
- Scale in untuk statistics cards

---

### 2. ⏰ Attendance Management

**Route:** `/attendance`

**Fitur:**

- ✅ **Clock In/Out Interface**
  - Display waktu real-time
  - Status kerja (Working/Not Working)
  - Durasi kerja otomatis
  - Lokasi kantor dengan GPS indicator
- ✅ **Monthly Statistics**
  - Total hari hadir
  - Hari terlambat
  - Hari tidak hadir
  - Total jam kerja
- ✅ **Attendance History**
  - Tanggal lengkap
  - Waktu clock in/out
  - Total jam kerja per hari
  - Status (On Time/Late)

**Data yang Ditampilkan:**

- Clock in time & clock out time
- Break time
- Work duration
- Location verification
- Status badge (Present/Late/Absent)

---

### 3. 🏖️ Leave Management

**Route:** `/leave`

**Fitur:**

- ✅ **Request New Leave Button** - Form modal untuk ajukan cuti
- ✅ **Leave Balance Cards** - 4 jenis cuti:
  - Annual Leave (cuti tahunan)
  - Sick Leave (cuti sakit)
  - Emergency Leave (cuti darurat)
  - Total Used (total terpakai)
- ✅ **Leave Request Form** dengan:
  - Leave type selection
  - Start date picker
  - End date picker
  - Reason textarea
  - Submit button
- ✅ **Leave History** menampilkan:
  - Jenis cuti dengan icon
  - Durasi (berapa hari)
  - Tanggal mulai & selesai
  - Alasan pengajuan
  - Status (Approved/Pending/Rejected)
  - Tanggal pengajuan

**Status Colors:**

- ✅ Approved - Hijau
- ⏳ Pending - Kuning
- ✗ Rejected - Merah

---

### 4. 💰 Payroll & Salary

**Route:** `/payroll`

**Fitur:**

- ✅ **Current Month Payslip**
  - Bulan & tahun
  - Status pembayaran (Paid/Pending)
  - Net salary (take home)
  - Tanggal pembayaran
- ✅ **Salary Breakdown:**
  - Basic Salary
  - Allowances (Tunjangan):
    - Transport allowance
    - Meal allowance
    - Health insurance
  - Deductions (Potongan):
    - Tax
    - Pension fund
  - Gross Salary
  - Net Salary
- ✅ **Download Payslip PDF** button
- ✅ **Payment History** - Riwayat 4 bulan terakhir
- ✅ **Tax Information Card** - Info perpajakan tahunan

**Format Currency:** Rupiah (IDR) dengan pemisah ribuan

---

### 5. 👤 Profile & Settings

**Route:** `/profile`

**Fitur:**

- ✅ **Profile Header** dengan gradient background
- ✅ **Profile Card:**
  - Avatar dengan tombol edit foto
  - Nama lengkap
  - Posisi & Employee ID
  - Quick stats (Attendance, Leave, Rating)
- ✅ **Contact Information:**
  - Email
  - Phone number
  - Department
  - Join date
- ✅ **Settings Menu:**
  - Personal Information
  - My Documents
  - Security & Privacy
  - Notifications
  - Language & Region
  - Help & Support
- ✅ **Logout Button**
- ✅ **App Version** di footer

---

## 🎨 Design System

### Color Palette

```css
Primary: Blue-Indigo-Purple (#3B82F6 → #6366F1 → #8B5CF6)
Success: Green-Emerald (#10B981 → #059669)
Warning: Orange-Yellow (#F59E0B → #EAB308)
Danger: Red-Pink (#EF4444 → #EC4899)
Gray: #F9FAFB (background) → #111827 (text)
```

### Typography

- **Headings:**
  - H1: 2xl (24px) - Bold
  - H2: xl (20px) - Bold
  - H3: lg (18px) - Bold
  - H4: base (16px) - Semibold
- **Body:**
  - Normal: sm (14px) - Medium
  - Small: xs (12px) - Medium

### Spacing

- Card padding: 1.25rem (20px)
- Section gap: 1.5rem (24px)
- Element gap: 0.75rem (12px)

### Border Radius

- Small: 0.75rem (12px)
- Medium: 1rem (16px)
- Large: 1.5rem (24px)
- XLarge: 2rem (32px)

### Shadows

- Small: shadow-sm
- Medium: shadow-md
- Large: shadow-lg
- XLarge: shadow-xl

---

## 🎭 Animations

### Entrance Animations

```css
.animate-fadeIn
  -
  Fade
  in
  (0.4s)
  .animate-fadeInUp
  -
  Fade
  in
  from
  bottom
  (0.5s)
  .animate-fadeInDown
  -
  Fade
  in
  from
  top
  (0.5s)
  .animate-slideInRight
  -
  Slide
  in
  from
  right
  (0.5s)
  .animate-slideInLeft
  -
  Slide
  in
  from
  left
  (0.5s)
  .animate-scaleIn
  -
  Scale
  in
  (0.4s);
```

### List Animations

```css
.animate-stagger        - Staggered entrance
  - Child 1: delay 0.05s
  - Child 2: delay 0.1s
  - Child 3: delay 0.15s
  - etc...
```

### Hover Effects

```css
.hover-lift
  -
  Lift
  up
  on
  hover
  with
  shadow
  .hover-scale
  -
  Scale
  1.05
  on
  hover
  .transition-smooth
  -
  Smooth
  transition
  (0.3s);
```

### Special Effects

```css
.animate-pulseSubtle
  -
  Subtle
  pulse
  for
  notifications
  .animate-shimmer
  -
  Shimmer
  loading
  effect
  .animate-gradient
  -
  Animated
  gradient
  background;
```

---

## 📱 Responsive Design

### Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Grid System

- 2 columns untuk statistics cards
- 4 columns untuk quick actions
- 3 columns untuk quick stats
- Full width untuk forms

---

## 🔗 Navigation Structure

```
Bottom Tab Bar
├── Home (Dashboard)
├── Attendance
└── Profile

Dashboard Quick Actions
├── Clock In → /attendance
├── Clock Out → /attendance
├── Request Leave → /leave
└── Payslip → /payroll
```

---

## 📊 Data Models

### Employee

```typescript
{
  id,
    employeeId,
    firstName,
    lastName,
    email,
    phone,
    avatar,
    position,
    department,
    joinDate,
    status,
    salary;
}
```

### Attendance

```typescript
{
  id, employeeId, date, clockIn, clockOut, status, workHours, location;
}
```

### Leave

```typescript
{
  id, employeeId, type, startDate, endDate, days, reason, status, appliedDate;
}
```

### Payslip

```typescript
{
  id,
    employeeId,
    month,
    year,
    basicSalary,
    allowances,
    deductions,
    grossSalary,
    netSalary,
    status;
}
```

---

## 🚀 Best Practices

### Code Organization

✅ Feature-based folder structure
✅ Reusable components di shared/
✅ Type definitions di types/
✅ Utilities di utils/
✅ Clean imports dengan index.ts

### Performance

✅ Lazy loading untuk routes
✅ Optimized animations (< 0.5s)
✅ Minimal re-renders
✅ Efficient state management

### Accessibility

✅ Semantic HTML
✅ Proper ARIA labels
✅ Keyboard navigation support
✅ Screen reader friendly

### Mobile First

✅ Touch-friendly buttons (min 44px)
✅ Swipe gestures support
✅ Native feel dengan Ionic
✅ Fast transitions

---

## 📝 Next Features to Implement

### Short Term

- [ ] API Integration
- [ ] Authentication (Login/Logout)
- [ ] Real-time notifications
- [ ] Form validation
- [ ] Error handling

### Medium Term

- [ ] Performance Reviews
- [ ] Task Management
- [ ] Team Directory
- [ ] Document Upload
- [ ] Calendar Integration

### Long Term

- [ ] Analytics Dashboard
- [ ] Multi-language (i18n)
- [ ] Dark mode
- [ ] Offline support (PWA)
- [ ] Biometric authentication

---

**Last Updated:** May 2025
