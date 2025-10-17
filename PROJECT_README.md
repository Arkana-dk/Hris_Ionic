# 🚀 Modern HRIS (Human Resource Information System)

Aplikasi HR modern yang dibangun dengan **Ionic React**, **TypeScript**, dan **Tailwind CSS**.

## ✨ Features

### 📊 Dashboard

- **Quick Stats** - Ringkasan kehadiran, cuti, dan performa
- **Quick Actions** - Clock in/out, request leave, view payslip
- **Upcoming Events** - Meeting, training, dan acara perusahaan
- **Company News** - Pengumuman dan berita terbaru

### ⏰ Attendance Management

- **Clock In/Out** - Absensi dengan lokasi GPS
- **Work Hours Tracking** - Perhitungan jam kerja otomatis
- **Monthly Statistics** - Statistik kehadiran bulanan
- **Attendance History** - Riwayat kehadiran lengkap

### 🏖️ Leave Management

- **Leave Balance** - Saldo cuti (annual, sick, emergency)
- **Request Leave** - Form pengajuan cuti yang mudah
- **Leave History** - Riwayat pengajuan cuti
- **Status Tracking** - Status approved/pending/rejected

### 💰 Payroll

- **Monthly Payslip** - Slip gaji detail
- **Payment History** - Riwayat pembayaran
- **Allowances & Deductions** - Tunjangan dan potongan
- **Tax Information** - Informasi perpajakan
- **Download PDF** - Unduh slip gaji

### 👤 Profile & Settings

- **Personal Information** - Data diri karyawan
- **Contact Details** - Email, phone, department
- **Security Settings** - Keamanan dan privasi
- **Notifications** - Pengaturan notifikasi
- **Language & Region** - Pengaturan bahasa

## 🏗️ Project Structure

```
src/
├── features/              # Feature-based organization
│   ├── dashboard/        # Dashboard feature
│   │   ├── DashboardPage.tsx
│   │   └── index.ts
│   ├── attendance/       # Attendance management
│   │   ├── AttendancePage.tsx
│   │   └── index.ts
│   ├── leave/           # Leave management
│   │   ├── LeavePage.tsx
│   │   └── index.ts
│   ├── payroll/         # Payroll & salary
│   │   ├── PayrollPage.tsx
│   │   └── index.ts
│   └── profile/         # Profile & settings
│       ├── ProfilePage.tsx
│       └── index.ts
│
├── shared/              # Shared components
│   └── components/
│       ├── StatCard.tsx
│       ├── QuickActionCard.tsx
│       ├── EventCard.tsx
│       ├── PageHeader.tsx
│       └── index.ts
│
├── types/               # TypeScript types
│   └── index.ts         # Employee, Attendance, Leave, etc.
│
├── services/            # API services (to be implemented)
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
│
├── theme/               # Styling
│   └── variables.css    # CSS variables & animations
│
└── App.tsx              # Main app with routing

```

## 🎨 Design Features

### Modern UI/UX

- ✅ **Gradient Backgrounds** - Beautiful gradient colors
- ✅ **Smooth Animations** - Subtle and professional animations
- ✅ **Card-based Layout** - Clean card design
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Custom Tab Bar** - Modern bottom navigation

### Animations

- **Fade In/Out** - Smooth fade effects
- **Slide Animations** - Slide up/down/left/right
- **Scale Animations** - Scale in/out effects
- **Stagger Animations** - Sequential animations for lists
- **Hover Effects** - Lift and scale on hover
- **Gradient Animations** - Animated gradients

### Color Scheme

- **Primary**: Blue-Indigo-Purple gradient
- **Success**: Green-Emerald gradient
- **Warning**: Orange-Yellow gradient
- **Danger**: Red-Pink gradient
- **Neutral**: Gray scale

## 🛠️ Tech Stack

- **Framework**: Ionic React 8.x
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.x
- **Icons**: Ionicons 7.x
- **Routing**: React Router 5.x
- **Build Tool**: Vite 5.x

## 📱 Screens

1. **Dashboard** - `/dashboard`
2. **Attendance** - `/attendance`
3. **Leave** - `/leave`
4. **Payroll** - `/payroll`
5. **Profile** - `/profile`

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Running on Mobile

```bash
# Add iOS platform
npx cap add ios

# Add Android platform
npx cap add android

# Sync web assets
npx cap sync

# Open in Xcode (iOS)
npx cap open ios

# Open in Android Studio
npx cap open android
```

## 📝 Component Usage

### StatCard

```tsx
import { StatCard } from "@/shared/components";

<StatCard
  title="Attendance"
  value={22}
  subtitle="Days this month"
  icon="📅"
  color="blue"
  trend={{ value: 5, isPositive: true }}
/>;
```

### QuickActionCard

```tsx
import { QuickActionCard } from "@/shared/components";

<QuickActionCard
  title="Clock In"
  icon={enterOutline}
  color="bg-gradient-to-br from-green-500 to-emerald-600"
  badge={2}
  onClick={() => navigate("/attendance")}
/>;
```

### PageHeader

```tsx
import { PageHeader } from "@/shared/components";

<PageHeader
  title="Attendance"
  subtitle="Track your work hours"
  gradient="from-blue-600 to-cyan-600"
  action={<BackButton />}
/>;
```

## 🎯 Next Steps / Roadmap

- [ ] **API Integration** - Connect to backend services
- [ ] **State Management** - Add Redux or Zustand
- [ ] **Authentication** - Login/logout functionality
- [ ] **Push Notifications** - Real-time notifications
- [ ] **Offline Support** - PWA capabilities
- [ ] **Performance Reviews** - Employee evaluation module
- [ ] **Task Management** - Project & task tracking
- [ ] **Team Directory** - Employee directory
- [ ] **Documents** - Document management
- [ ] **Reports** - Analytics and reports
- [ ] **Multi-language** - Internationalization (i18n)

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please contact the development team.

---

**Built with ❤️ using Ionic React & TypeScript**
