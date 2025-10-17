# 📂 Folder Structure Visualization

## Complete Project Structure

```
HRIS_IONIC/
│
├── 📄 PROJECT_SUMMARY.md              ← Overview lengkap project
├── 📄 PROJECT_README.md               ← Setup & installation guide
├── 📄 FEATURES_DOCUMENTATION.md       ← Detail fitur & design system
├── 📄 DEVELOPMENT_GUIDE.md            ← Panduan development
│
├── public/
│   └── manifest.json
│
├── src/
│   ├── 📱 features/                   ← MAIN FEATURES (Feature-based)
│   │   │
│   │   ├── 🏠 dashboard/              ← Homepage / Dashboard
│   │   │   ├── DashboardPage.tsx      → Main dashboard dengan stats
│   │   │   └── index.ts               → Export file
│   │   │
│   │   ├── ⏰ attendance/             ← Attendance Management
│   │   │   ├── AttendancePage.tsx     → Clock in/out, history
│   │   │   └── index.ts               → Export file
│   │   │
│   │   ├── 🏖️ leave/                  ← Leave Management
│   │   │   ├── LeavePage.tsx          → Leave request, balance, history
│   │   │   └── index.ts               → Export file
│   │   │
│   │   ├── 💰 payroll/                ← Payroll & Salary
│   │   │   ├── PayrollPage.tsx        → Payslip, payment history
│   │   │   └── index.ts               → Export file
│   │   │
│   │   └── 👤 profile/                ← Profile & Settings
│   │       ├── ProfilePage.tsx        → User profile, settings menu
│   │       └── index.ts               → Export file
│   │
│   ├── 🔧 shared/                     ← SHARED COMPONENTS
│   │   └── components/
│   │       ├── StatCard.tsx           → Statistics card component
│   │       ├── QuickActionCard.tsx    → Quick action button
│   │       ├── EventCard.tsx          → Event display card
│   │       ├── PageHeader.tsx         → Page header with gradient
│   │       └── index.ts               → Export all components
│   │
│   ├── 📝 types/                      ← TYPESCRIPT TYPES
│   │   └── index.ts                   → All interfaces & types
│   │                                    (Employee, Attendance, Leave,
│   │                                     Payslip, Event, etc)
│   │
│   ├── 🛠️ utils/                      ← UTILITIES
│   │   ├── helpers.ts                 → Helper functions
│   │   │                                (formatCurrency, formatDate,
│   │   │                                 calculateDays, etc)
│   │   └── index.ts                   → Constants & exports
│   │
│   ├── 🔌 services/                   ← API SERVICES (Future)
│   │   └── (to be implemented)        → API integration layer
│   │
│   ├── 🪝 hooks/                      ← CUSTOM HOOKS (Future)
│   │   └── (to be implemented)        → Custom React hooks
│   │
│   ├── 🎨 theme/                      ← STYLING
│   │   └── variables.css              → Custom animations & CSS
│   │                                    - Fade animations
│   │                                    - Slide animations
│   │                                    - Scale animations
│   │                                    - Hover effects
│   │                                    - Custom scrollbar
│   │                                    - Tab bar styling
│   │
│   ├── 📄 pages/                      ← OLD PAGES (Legacy)
│   │   ├── Tab1.tsx                   → Can be removed
│   │   ├── Tab2.tsx                   → Can be removed
│   │   └── Tab3.tsx                   → Can be removed
│   │
│   ├── 🧩 components/                 ← LEGACY (Empty)
│   │
│   ├── App.tsx                        ← MAIN APP (Routing)
│   ├── main.tsx                       ← Entry point
│   └── setupTests.ts                  ← Test setup
│
├── 📦 Configuration Files
│   ├── package.json                   → Dependencies
│   ├── tsconfig.json                  → TypeScript config
│   ├── vite.config.ts                 → Vite config
│   ├── tailwind.config.js             → Tailwind config
│   ├── ionic.config.json              → Ionic config
│   └── capacitor.config.ts            → Capacitor config
│
└── 🧪 cypress/                        ← E2E TESTS
    ├── e2e/
    ├── fixtures/
    └── support/
```

---

## 📱 Features Breakdown

### 🏠 Dashboard

```
DashboardPage.tsx (290 lines)
├── Welcome Header
│   ├── User avatar with status indicator
│   ├── Greeting (Good Morning/Afternoon/Evening)
│   └── Notification button with badge
│
├── Quick Actions (4 buttons)
│   ├── Clock In (green gradient)
│   ├── Clock Out (red gradient)
│   ├── Request Leave (blue gradient)
│   └── Payslip (purple gradient)
│
├── Today's Summary Card
│   ├── Clocked In status
│   ├── Work hours
│   └── Tasks completed
│
├── Monthly Statistics (4 cards)
│   ├── Attendance
│   ├── Leave Balance
│   ├── Work Hours
│   └── Performance Rating
│
├── Upcoming Events (3 events)
│   ├── Event type icon
│   ├── Title & description
│   └── Date & time
│
└── Company News Card
    ├── Icon
    ├── Title & content
    └── Learn more button
```

### ⏰ Attendance

```
AttendancePage.tsx (240 lines)
├── Page Header
│   └── Blue-Cyan gradient
│
├── Clock In/Out Card
│   ├── Current time display (large)
│   ├── Working status indicator
│   ├── Location info
│   ├── Clock in/out times
│   └── Action button (Clock In/Out)
│
├── Monthly Statistics (4 cards)
│   ├── Present days
│   ├── Late days
│   ├── Absent days
│   └── Total hours
│
└── Recent History
    ├── Date & day
    ├── Clock in/out times
    ├── Work hours
    └── Status badge
```

### 🏖️ Leave

```
LeavePage.tsx (280 lines)
├── Page Header
│   └── Purple-Pink gradient
│
├── Request Leave Button
│   └── Opens modal form
│
├── Leave Balance (4 cards)
│   ├── Annual Leave
│   ├── Sick Leave
│   ├── Emergency Leave
│   └── Total Used
│
├── Leave History
│   ├── Leave type with icon
│   ├── Duration (days)
│   ├── Date range
│   ├── Reason
│   ├── Status badge
│   └── Applied date
│
└── Request Modal
    ├── Leave type selector
    ├── Start date picker
    ├── End date picker
    ├── Reason textarea
    └── Submit button
```

### 💰 Payroll

```
PayrollPage.tsx (260 lines)
├── Page Header
│   └── Green-Emerald gradient
│
├── Current Payslip Card
│   ├── Month & year
│   ├── Payment status
│   ├── Net salary (large display)
│   ├── Basic salary
│   ├── Allowances section
│   │   ├── Transport
│   │   ├── Meal
│   │   └── Health insurance
│   ├── Deductions section
│   │   ├── Tax
│   │   └── Pension fund
│   ├── Salary calculation
│   └── Download PDF button
│
├── Payment History (4 months)
│   ├── Month & year
│   ├── Net salary
│   ├── Payment date
│   └── Status
│
└── Tax Information Card
    └── Annual tax statement info
```

### 👤 Profile

```
ProfilePage.tsx (220 lines)
├── Header with Gradient
│   └── Settings button
│
├── Profile Card
│   ├── Avatar with edit button
│   ├── Name & position
│   ├── Employee ID
│   ├── Quick Stats (3 items)
│   │   ├── Attendance
│   │   ├── Leave Balance
│   │   └── Rating
│   └── Contact Information
│       ├── Email
│       ├── Phone
│       ├── Department
│       └── Join date
│
├── Settings Menu (6 items)
│   ├── Personal Information
│   ├── My Documents
│   ├── Security & Privacy
│   ├── Notifications
│   ├── Language & Region
│   └── Help & Support
│
├── Logout Button
└── App Version
```

---

## 🔧 Shared Components

### StatCard Component

```tsx
Props:
├── title: string
├── value: string | number
├── subtitle?: string
├── icon?: string
├── trend?: { value: number, isPositive: boolean }
├── color?: 'blue' | 'green' | 'purple' | 'orange' | 'red'
└── className?: string

Usage in:
├── Dashboard (4 cards)
└── Leave page (4 cards)
```

### QuickActionCard Component

```tsx
Props:
├── title: string
├── icon: string
├── color: string (gradient)
├── badge?: number
├── onClick?: () => void
└── className?: string

Usage in:
└── Dashboard (4 quick actions)
```

### EventCard Component

```tsx
Props:
├── event: Event
└── onClick?: () => void

Usage in:
└── Dashboard (upcoming events)
```

### PageHeader Component

```tsx
Props:
├── title: string
├── subtitle?: string
├── action?: ReactNode
├── gradient?: string
└── className?: string

Usage in:
├── Attendance page
├── Leave page
└── Payroll page
```

---

## 📊 File Statistics

### Code Distribution

```
TypeScript/TSX Files:
├── Features:        ~1,500 lines (5 files)
├── Components:      ~600 lines (4 files)
├── Types:           ~200 lines (1 file)
├── Utils:           ~200 lines (2 files)
└── Total:           ~2,500 lines

CSS Files:
└── variables.css:   ~400 lines

Documentation:
├── PROJECT_SUMMARY.md:         ~350 lines
├── PROJECT_README.md:          ~400 lines
├── FEATURES_DOCUMENTATION.md:  ~450 lines
├── DEVELOPMENT_GUIDE.md:       ~500 lines
└── Total:                      ~1,700 lines
```

### Component Complexity

```
Simple:     StatCard, QuickActionCard
Medium:     EventCard, PageHeader
Complex:    DashboardPage, AttendancePage
Very Complex: LeavePage (with modal), PayrollPage
```

---

## 🎯 Navigation Flow

```
App Start → /dashboard (Homepage)
    │
    ├─→ Quick Actions
    │   ├─→ Clock In/Out → /attendance
    │   ├─→ Request Leave → /leave
    │   └─→ Payslip → /payroll
    │
    ├─→ Tab Bar
    │   ├─→ Home → /dashboard
    │   ├─→ Attendance → /attendance
    │   └─→ Profile → /profile
    │
    └─→ See Details Links
        ├─→ Events → (future implementation)
        └─→ News → (future implementation)
```

---

## 🎨 Design System

### Color Palette

```
Primary Colors:
├── Blue:    #3B82F6
├── Indigo:  #6366F1
└── Purple:  #8B5CF6

Success Colors:
├── Green:   #10B981
└── Emerald: #059669

Warning Colors:
├── Orange:  #F59E0B
└── Yellow:  #EAB308

Danger Colors:
├── Red:     #EF4444
└── Pink:    #EC4899

Neutral Colors:
├── Gray-50:  #F9FAFB (background)
├── Gray-100: #F3F4F6
├── Gray-500: #6B7280
└── Gray-900: #111827 (text)
```

### Typography Scale

```
Headings:
├── H1: 24px (text-2xl) - Bold
├── H2: 20px (text-xl) - Bold
├── H3: 18px (text-lg) - Bold
└── H4: 16px (text-base) - Semibold

Body:
├── Normal: 14px (text-sm) - Medium
└── Small:  12px (text-xs) - Medium
```

### Spacing System

```
Padding/Margin:
├── p-3: 12px
├── p-4: 16px
├── p-5: 20px
└── p-6: 24px

Gap:
├── gap-2: 8px
├── gap-3: 12px
└── gap-4: 16px
```

### Border Radius

```
├── rounded-lg:   12px
├── rounded-xl:   16px
├── rounded-2xl:  24px
└── rounded-3xl:  32px
```

---

**Last Updated:** May 2025
**Version:** 1.0.0
