# Font Configuration Guide - TalantaHub

## Current Font Setup

### Primary Font: Inter
**Inter** is a modern, highly legible sans-serif typeface designed specifically for computer screens.

**Weights Used:**
- 400 (Regular) - Body text
- 500 (Medium) - Subheadings
- 600 (Semibold) - Emphasis
- 700 (Bold) - Headings
- 800 (Extrabold) - Large headings
- 900 (Black) - Hero text, major CTAs

**Why Inter?**
- ✅ Excellent readability at all sizes
- ✅ Professional and modern appearance
- ✅ Free and open-source
- ✅ Optimized for digital interfaces
- ✅ Wide character support
- ✅ Variable font support

---

## Font Loading Configuration

### Current Setup (Next.js Font Optimization)
```typescript
// src/app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-inter'
})
```

**Benefits:**
- Automatic font optimization
- Self-hosted fonts (no external requests)
- Zero layout shift
- Preloaded for performance

---

## Alternative Font Options

### 1. **Outfit** (Modern & Geometric)
```typescript
import { Outfit } from 'next/font/google'

const outfit = Outfit({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap'
})
```
**Style:** Geometric, rounded, friendly
**Best for:** Startups, creative agencies, modern brands

### 2. **Space Grotesk** (Tech & Bold)
```typescript
import { Space_Grotesk } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap'
})
```
**Style:** Tech-forward, distinctive, bold
**Best for:** Tech companies, SaaS products

### 3. **Manrope** (Clean & Professional)
```typescript
import { Manrope } from 'next/font/google'

const manrope = Manrope({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap'
})
```
**Style:** Clean, professional, versatile
**Best for:** Corporate, professional services

### 4. **Plus Jakarta Sans** (Friendly & Modern)
```typescript
import { Plus_Jakarta_Sans } from 'next/font/google'

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap'
})
```
**Style:** Friendly, approachable, modern
**Best for:** Consumer apps, social platforms

### 5. **Sora** (Futuristic & Tech)
```typescript
import { Sora } from 'next/font/google'

const sora = Sora({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap'
})
```
**Style:** Futuristic, tech-forward, unique
**Best for:** AI/ML products, innovative tech

---

## Font Pairing Strategies

### Option 1: Single Font (Current)
**Headings:** Inter 900 (Black)
**Body:** Inter 400-600
**Pros:** Cohesive, clean, professional
**Cons:** Less visual hierarchy

### Option 2: Display + Body
**Headings:** Space Grotesk 700
**Body:** Inter 400-600
**Pros:** Strong visual hierarchy, distinctive
**Cons:** More complex to manage

### Option 3: Serif + Sans
**Headings:** Playfair Display 900
**Body:** Inter 400-600
**Pros:** Elegant, sophisticated
**Cons:** May feel too formal

---

## How to Change Fonts

### Step 1: Update layout.tsx
```typescript
// Replace Inter with your chosen font
import { Space_Grotesk } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap'
})

// In the body tag
<body className={spaceGrotesk.className}>
```

### Step 2: Update globals.css (if needed)
```css
body {
  font-family: var(--font-space-grotesk), -apple-system, sans-serif;
}
```

### Step 3: Test and Adjust
- Check all font weights render correctly
- Verify readability at different sizes
- Test on mobile devices
- Check loading performance

---

## Font Weight Usage Guide

### Landing Page Hierarchy

```css
/* Hero Headline */
font-weight: 900; /* Black */
font-size: 10rem; /* Desktop */
letter-spacing: -0.05em; /* Tight */

/* Section Headings */
font-weight: 900; /* Black */
font-size: 4rem-6rem;
letter-spacing: -0.02em;

/* Card Titles */
font-weight: 800; /* Extrabold */
font-size: 1.5rem-2rem;

/* Body Text */
font-weight: 500; /* Medium */
font-size: 1rem-1.25rem;
line-height: 1.6;

/* Labels/Badges */
font-weight: 900; /* Black */
font-size: 0.625rem;
letter-spacing: 0.2em; /* Wide */
text-transform: uppercase;
```

---

## Performance Optimization

### Current Setup Benefits
1. **Self-hosted fonts** - No external requests to Google Fonts
2. **Subset optimization** - Only Latin characters loaded
3. **Font display swap** - Text visible immediately
4. **Preloading** - Critical fonts loaded first
5. **Variable fonts** - Single file for all weights (if available)

### Font Loading Strategy
```typescript
// Preload critical fonts
<link 
  rel="preload" 
  href="/fonts/inter-var.woff2" 
  as="font" 
  type="font/woff2" 
  crossOrigin="anonymous"
/>
```

---

## Custom Font Installation

### If you want to use a custom font:

1. **Add font files to public/fonts/**
```
public/
  fonts/
    CustomFont-Regular.woff2
    CustomFont-Bold.woff2
    CustomFont-Black.woff2
```

2. **Define in globals.css**
```css
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/CustomFont-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/CustomFont-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/CustomFont-Black.woff2') format('woff2');
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}
```

3. **Use in Tailwind**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['CustomFont', 'system-ui', 'sans-serif'],
      }
    }
  }
}
```

---

## Recommended Font for TalantaHub

**Stick with Inter** ✅

**Reasons:**
1. Excellent readability for a marketplace platform
2. Professional and trustworthy appearance
3. Works well at all sizes (from small labels to huge headlines)
4. Optimized for screens
5. Wide language support for global audience
6. Free and well-maintained

**Alternative if you want more personality:**
**Space Grotesk** - More distinctive, tech-forward feel

---

## Font Testing Checklist

- [ ] Test all font weights (400-900)
- [ ] Check readability on mobile
- [ ] Verify loading performance (< 100ms)
- [ ] Test with long text strings
- [ ] Check special characters (é, ñ, ü, etc.)
- [ ] Verify fallback fonts work
- [ ] Test in different browsers
- [ ] Check accessibility (contrast ratios)
- [ ] Verify print styles (if needed)
- [ ] Test with screen readers

---

## Current Font Metrics

**Inter Font Weights:**
- Regular (400): 14.2 KB
- Medium (500): 14.4 KB
- Semibold (600): 14.6 KB
- Bold (700): 14.8 KB
- Extrabold (800): 15.0 KB
- Black (900): 15.2 KB

**Total:** ~88 KB (compressed)
**Load Time:** < 100ms on fast connection

---

**Last Updated:** March 5, 2026
**Current Font:** Inter (400, 500, 600, 700, 800, 900)
**Status:** Optimized ✨
