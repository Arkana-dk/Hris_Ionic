# 🛠️ Development Guide

## Setup Development Environment

### Prerequisites

```bash
Node.js >= 18.0.0
npm >= 9.0.0
```

### Installation Steps

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open browser
http://localhost:5173
```

---

## 📁 Folder Structure Explained

### `/src/features/`

Berisi semua fitur aplikasi dengan struktur:

```
features/
├── dashboard/
│   ├── DashboardPage.tsx    # Main dashboard component
│   ├── components/          # Dashboard-specific components
│   ├── hooks/               # Dashboard-specific hooks
│   └── index.ts            # Export barrel file
```

**Kapan membuat feature baru:**

- Ketika ada modul/fitur besar yang independent
- Contoh: attendance, leave, payroll, performance

### `/src/shared/`

Komponen yang dipakai di banyak tempat:

```
shared/
└── components/
    ├── StatCard.tsx         # Reusable stat card
    ├── QuickActionCard.tsx  # Quick action button
    ├── EventCard.tsx        # Event display card
    └── PageHeader.tsx       # Page header component
```

**Kapan membuat shared component:**

- Ketika komponen dipakai di 2+ fitur berbeda
- Ketika komponen generic dan reusable

### `/src/types/`

Type definitions untuk TypeScript:

```typescript
// Example: Employee type
export interface Employee {
  id: string;
  name: string;
  // ... other fields
}
```

### `/src/utils/`

Helper functions dan constants:

```typescript
// Example: Format currency
export const formatCurrency = (amount: number) => {
  // implementation
};
```

### `/src/services/`

API service layer (untuk future implementation):

```typescript
// Example: Attendance service
export const attendanceService = {
  clockIn: async () => {},
  clockOut: async () => {},
  getHistory: async () => {},
};
```

---

## 🎨 Adding New Features

### Step 1: Create Feature Folder

```bash
src/features/new-feature/
├── NewFeaturePage.tsx
├── components/
├── hooks/
└── index.ts
```

### Step 2: Create Page Component

```tsx
// src/features/new-feature/NewFeaturePage.tsx
import React from "react";
import { IonContent, IonPage } from "@ionic/react";
import { PageHeader } from "@/shared/components";

const NewFeaturePage: React.FC = () => {
  return (
    <IonPage>
      <IonContent>
        <PageHeader title="New Feature" subtitle="Feature description" />
        {/* Your content here */}
      </IonContent>
    </IonPage>
  );
};

export default NewFeaturePage;
```

### Step 3: Add Route

```tsx
// src/App.tsx
import NewFeaturePage from "./features/new-feature/NewFeaturePage";

// Add route
<Route exact path="/new-feature">
  <NewFeaturePage />
</Route>;
```

### Step 4: Add Navigation (if needed)

```tsx
// Add to quick actions or menu
<QuickActionCard
  title="New Feature"
  icon={newIcon}
  color="bg-gradient-to-br from-blue-500 to-cyan-600"
  onClick={() => navigate("/new-feature")}
/>
```

---

## 🎭 Using Animations

### Basic Animations

```tsx
// Fade in
<div className="animate-fadeIn">Content</div>

// Fade in from bottom
<div className="animate-fadeInUp">Content</div>

// Scale in
<div className="animate-scaleIn">Content</div>
```

### Stagger Animation for Lists

```tsx
{
  items.map((item, index) => (
    <div
      key={item.id}
      className="animate-stagger"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {item.content}
    </div>
  ));
}
```

### Hover Effects

```tsx
// Lift on hover
<div className="hover-lift">Card</div>

// Scale on hover
<button className="hover-scale">Button</button>
```

---

## 🎨 Styling Guidelines

### Use Tailwind Classes

```tsx
// Good ✅
<div className="bg-white rounded-2xl p-5 shadow-lg">

// Avoid ❌
<div style={{
  background: 'white',
  borderRadius: '16px',
  padding: '20px'
}}>
```

### Color System

```tsx
// Primary colors
bg - blue - 600, bg - indigo - 600, bg - purple - 600;

// Success
bg - green - 600, bg - emerald - 600;

// Warning
bg - orange - 600, bg - yellow - 600;

// Danger
bg - red - 600, bg - pink - 600;

// Neutral
bg - gray - 50, bg - gray - 100, bg - gray - 900;
```

### Spacing

```tsx
// Padding
p-3  (12px)
p-4  (16px)
p-5  (20px)
p-6  (24px)

// Margin
mb-3 (margin-bottom: 12px)
mt-4 (margin-top: 16px)

// Gap
gap-3 (12px between flex items)
space-y-4 (16px vertical space)
```

### Border Radius

```tsx
rounded-lg   (12px)
rounded-xl   (16px)
rounded-2xl  (24px)
rounded-3xl  (32px)
```

---

## 📊 Working with Data

### Mock Data (Current)

```tsx
// Example in component
const mockData = {
  attendance: [
    { id: '1', date: '2025-05-20', ... },
    { id: '2', date: '2025-05-19', ... },
  ],
};
```

### Future: API Integration

```tsx
// 1. Create service
// src/services/attendanceService.ts
export const getAttendanceHistory = async () => {
  const response = await fetch("/api/attendance/history");
  return response.json();
};

// 2. Use in component with React Query or SWR
const { data, loading } = useQuery("attendance", getAttendanceHistory);
```

---

## 🧪 Testing (To be implemented)

### Unit Tests

```tsx
// Example: StatCard.test.tsx
import { render, screen } from "@testing-library/react";
import { StatCard } from "./StatCard";

test("renders stat card with correct value", () => {
  render(<StatCard title="Test" value={10} />);
  expect(screen.getByText("10")).toBeInTheDocument();
});
```

### E2E Tests (Cypress)

```typescript
// cypress/e2e/dashboard.cy.ts
describe("Dashboard", () => {
  it("should display user name", () => {
    cy.visit("/dashboard");
    cy.contains("Bumi Regen Anugerah").should("be.visible");
  });
});
```

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Build Mobile App

```bash
# iOS
npm run build
npx cap sync
npx cap open ios

# Android
npm run build
npx cap sync
npx cap open android
```

---

## 🐛 Common Issues & Solutions

### Issue: Animations not working

**Solution:** Check if CSS is imported in App.tsx

```tsx
import "./theme/variables.css";
```

### Issue: Icons not showing

**Solution:** Make sure ionicons is installed

```bash
npm install ionicons
```

### Issue: Tailwind classes not working

**Solution:** Check tailwind.config.js content paths

```js
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
],
```

### Issue: Type errors

**Solution:** Check if types are properly exported from types/index.ts

---

## 📝 Code Standards

### Naming Conventions

```tsx
// Components: PascalCase
const DashboardPage = () => {};

// Functions: camelCase
const formatCurrency = () => {};

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = "https://api.example.com";

// Types/Interfaces: PascalCase
interface Employee {}
type LeaveStatus = "pending" | "approved";
```

### File Naming

```
Components:     PascalCase.tsx  (DashboardPage.tsx)
Utilities:      camelCase.ts    (helpers.ts)
Types:          camelCase.ts    (index.ts)
Styles:         kebab-case.css  (variables.css)
```

### Import Order

```tsx
// 1. React & External libraries
import React from "react";
import { IonContent, IonPage } from "@ionic/react";

// 2. Internal components
import { StatCard } from "@/shared/components";

// 3. Types
import type { Employee } from "@/types";

// 4. Utilities
import { formatCurrency } from "@/utils";

// 5. Styles
import "./styles.css";
```

---

## 💡 Tips & Best Practices

### Performance

✅ Use React.memo for heavy components
✅ Implement virtualization for long lists
✅ Lazy load routes
✅ Optimize images (use WebP)

### Accessibility

✅ Use semantic HTML
✅ Add aria-labels
✅ Support keyboard navigation
✅ Test with screen readers

### Mobile UX

✅ Touch targets min 44x44px
✅ Use native scrolling
✅ Implement pull-to-refresh
✅ Add haptic feedback

### Security

✅ Never commit secrets
✅ Sanitize user inputs
✅ Use HTTPS only
✅ Implement CSRF protection

---

## 📞 Getting Help

### Resources

- **Ionic Docs:** https://ionicframework.com/docs
- **React Docs:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com
- **TypeScript:** https://www.typescriptlang.org

### Community

- Ionic Forum
- Stack Overflow
- GitHub Issues

---

**Happy Coding! 🚀**
