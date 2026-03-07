# Unified Design System Implementation Guide

## Overview
This guide shows how to apply the unified color scheme and design system across all pages in TalantaHub.

---

## Color Palette

### Primary Colors (Blue)
- **Blue-50 to Blue-900**: Main brand color
- Used for: Primary buttons, links, highlights, CTAs

### Accent Colors (Orange)
- **Orange-50 to Orange-900**: Secondary brand color
- Used for: Accents, hover states, special features

### Neutral Colors (Slate)
- **Slate-50 to Slate-900**: Base colors
- Used for: Backgrounds, text, borders

---

## Page Background Pattern

All pages now use a consistent gradient background:

```tsx
// Light pages (default)
className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30"

// Dark pages (admin, dashboard)
className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"

// Accent pages (special sections)
className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-orange-500"
```

---

## Using the PageLayout Component

### Basic Usage

```tsx
import PageLayout from '@/components/layouts/PageLayout'

export default function MyPage() {
  return (
    <PageLayout variant="light">
      <div className="container-custom py-24">
        <h1>My Page</h1>
        {/* Your content */}
      </div>
    </PageLayout>
  )
}
```

### Variants

```tsx
// Light background (default)
<PageLayout variant="light">

// Dark background
<PageLayout variant="dark">

// Gradient background
<PageLayout variant="gradient">
```

---

## Component Styles

### Cards

```tsx
// Light card
<div className="card card-hover p-6">
  <h3>Card Title</h3>
  <p>Card content</p>
</div>

// Dark card
<div className="card card-dark card-hover p-6">
  <h3>Card Title</h3>
  <p>Card content</p>
</div>
```

### Buttons

```tsx
// Primary button
<button className="btn btn-primary">
  Primary Action
</button>

// Secondary button
<button className="btn btn-secondary">
  Secondary Action
</button>

// Accent button
<button className="btn btn-accent">
  Special Action
</button>

// Dark button
<button className="btn btn-dark">
  Dark Action
</button>
```

### Inputs

```tsx
// Light input
<input 
  type="text" 
  className="input" 
  placeholder="Enter text..."
/>

// Dark input
<input 
  type="text" 
  className="input input-dark" 
  placeholder="Enter text..."
/>
```

### Badges

```tsx
<span className="badge badge-success">Active</span>
<span className="badge badge-warning">Pending</span>
<span className="badge badge-info">New</span>
<span className="badge badge-error">Failed</span>
```

---

## Page-Specific Implementations

### 1. Landing Page (Already Updated)
```tsx
// src/app/page.tsx
<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
  {/* Content */}
</div>
```

### 2. Dashboard Pages
```tsx
// src/app/dashboard/page.tsx
import PageLayout from '@/components/layouts/PageLayout'

export default function Dashboard() {
  return (
    <PageLayout variant="light">
      <div className="container-custom py-12">
        {/* Dashboard content */}
      </div>
    </PageLayout>
  )
}
```

### 3. Admin Pages
```tsx
// src/app/admin/page.tsx
import PageLayout from '@/components/layouts/PageLayout'

export default function AdminPage() {
  return (
    <PageLayout variant="dark">
      <div className="container-custom py-12">
        {/* Admin content */}
      </div>
    </PageLayout>
  )
}
```

### 4. Auth Pages
```tsx
// src/app/auth/page.tsx
import PageLayout from '@/components/layouts/PageLayout'

export default function AuthPage() {
  return (
    <PageLayout variant="light">
      <div className="min-h-screen flex items-center justify-center">
        <div className="card p-8 max-w-md w-full">
          {/* Auth form */}
        </div>
      </div>
    </PageLayout>
  )
}
```

### 5. Product/Gig Pages
```tsx
// src/app/products/page.tsx
import PageLayout from '@/components/layouts/PageLayout'

export default function ProductsPage() {
  return (
    <PageLayout variant="light">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="card card-hover p-6">
              {/* Product card */}
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
```

---

## Navigation Fix (Client-Side Routing)

### ✅ Correct (Next.js Link)
```tsx
import Link from 'next/link'

<Link href="/dashboard" className="btn btn-primary">
  Go to Dashboard
</Link>
```

### ❌ Incorrect (External redirect)
```tsx
// Don't use <a> tags for internal navigation
<a href="/dashboard">Go to Dashboard</a>
```

### Navigation with Smooth Transitions
```tsx
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Using Link component
<Link 
  href="/products" 
  className="btn btn-primary"
  prefetch={true}
>
  View Products
</Link>

// Using router programmatically
const router = useRouter()

const handleClick = () => {
  router.push('/products')
}
```

---

## Gradient Text

```tsx
<h1 className="text-6xl font-black">
  Welcome to{' '}
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500">
    TalantaHub
  </span>
</h1>
```

---

## Section Layouts

### Light Section
```tsx
<section className="section section-light">
  <div className="container-custom">
    <h2>Section Title</h2>
    {/* Content */}
  </div>
</section>
```

### Dark Section
```tsx
<section className="section section-dark text-white">
  <div className="container-custom">
    <h2>Section Title</h2>
    {/* Content */}
  </div>
</section>
```

---

## Animation Patterns

### Page Transitions
```tsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  {/* Content */}
</motion.div>
```

### Scroll Animations
```tsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: 0.2 }}
>
  {/* Content */}
</motion.div>
```

---

## Responsive Design

### Container Widths
```tsx
// Full width with padding
<div className="w-full px-6">

// Centered container
<div className="container-custom">

// Max width variants
<div className="max-w-7xl mx-auto px-6">  // Large
<div className="max-w-4xl mx-auto px-6">  // Medium
<div className="max-w-2xl mx-auto px-6">  // Small
```

### Grid Layouts
```tsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Items */}
</div>

// Auto-fit grid
<div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
  {/* Items */}
</div>
```

---

## Quick Migration Checklist

For each page, update:

- [ ] Replace `<a href>` with `<Link href>`
- [ ] Add `PageLayout` wrapper
- [ ] Update background to unified gradient
- [ ] Replace old button classes with new `btn-*` classes
- [ ] Replace old card classes with new `card` classes
- [ ] Update input styles to use `input` class
- [ ] Add smooth transitions with framer-motion
- [ ] Ensure consistent spacing with `container-custom`
- [ ] Update text colors to use slate scale
- [ ] Add hover effects to interactive elements

---

## Example: Complete Page Migration

### Before
```tsx
export default function OldPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6">
        <a href="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded">
          Go to Dashboard
        </a>
        <div className="bg-white border rounded-lg p-4 mt-4">
          <h2>Card Title</h2>
        </div>
      </div>
    </div>
  )
}
```

### After
```tsx
import Link from 'next/link'
import PageLayout from '@/components/layouts/PageLayout'
import { motion } from 'framer-motion'

export default function NewPage() {
  return (
    <PageLayout variant="light">
      <div className="container-custom py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </Link>
          
          <div className="card card-hover p-6 mt-6">
            <h2 className="text-2xl font-black mb-4">Card Title</h2>
            <p className="text-slate-600">Card content</p>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  )
}
```

---

## CSS Variables Usage

You can also use CSS variables directly:

```tsx
<div style={{
  backgroundColor: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  borderColor: 'var(--border-light)'
}}>
  Content
</div>
```

---

## Testing Checklist

After applying the unified design:

- [ ] All internal links use Next.js `<Link>` component
- [ ] No page reloads on navigation
- [ ] Consistent background gradients across pages
- [ ] Smooth transitions between pages
- [ ] Buttons have consistent styling
- [ ] Cards have glass-morphism effect
- [ ] Hover states work correctly
- [ ] Mobile responsive
- [ ] Dark mode works (if applicable)
- [ ] Animations are smooth

---

**Status:** Design System Ready ✨  
**Last Updated:** March 5, 2026  
**Version:** 1.0
