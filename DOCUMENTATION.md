# TalentHub Kenya - Freelance Marketplace Documentation

## 📋 Project Overview

TalentHub Kenya is a comprehensive freelance marketplace platform specifically designed for the Kenyan market. It combines the best features of platforms like Fiverr and Upwork while incorporating Kenya-specific payment methods, currency, and cultural considerations.

## 🏗️ Architecture & Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Recharts** - Data visualization
- **Shadcn/UI** - Component library
- **Next-themes** - Light/dark mode support

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **NextAuth.js** - Authentication system
- **Prisma ORM** - Database management
- **PostgreSQL** - Primary database

### Key Features
- **Dual Marketplace Model** - Both gig-based and project-based work
- **Kenya-Specific Integration** - M-Pesa payments, KES currency
- **Multi-user Types** - Clients, Freelancers, Agencies, Admins
- **Seller Application System** - Admin-approved seller onboarding
- **POS System** - Point of sale for digital products
- **Review System** - Comprehensive rating and feedback
- **Analytics Dashboard** - Data visualization with charts

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── gigs/              # Gig management
│   │   ├── projects/          # Project management
│   │   ├── reviews/           # Review system
│   │   ├── payments/          # Payment processing
│   │   └── seller-applications/ # Seller applications
│   ├── components/            # Reusable components
│   │   ├── ui/               # Shadcn/UI components
│   │   ├── Navigation.tsx    # Global navigation
│   │   ├── theme-provider.tsx # Theme context
│   │   └── theme-toggle.tsx  # Theme switcher
│   ├── context/              # React contexts
│   │   ├── UserContext.tsx   # User state management
│   │   └── CartContext.tsx   # Shopping cart state
│   ├── types/                # TypeScript definitions
│   ├── apply-seller/         # Seller application page
│   ├── create-gig/           # Gig creation page
│   ├── dashboard/            # User dashboard
│   ├── seller-dashboard/     # Seller-specific dashboard
│   ├── opportunities/        # Browse gigs page
│   ├── pos/                  # Point of sale system
│   ├── reviews/              # Review management
│   ├── messages/             # Messaging system
│   └── layout.tsx            # Root layout
├── lib/
│   ├── prisma.ts            # Database client
│   └── utils.ts             # Utility functions
└── styles/                  # Global styles
```

## 🎨 Theme System

### Light/Dark Mode Implementation

The application supports both light and dark themes using:

1. **next-themes** - Theme management and persistence
2. **CSS Custom Properties** - Theme-aware color system
3. **Tailwind CSS** - Utility classes with theme support

### Color System

```css
/* Light Theme */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 262.1 83.3% 57.8%;
  /* ... more colors */
}

/* Dark Theme */
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 262.1 83.3% 57.8%;
  /* ... more colors */
}
```

### Theme Toggle Component

```tsx
export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  
  return (
    <Button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="dark:scale-0" />
      <Moon className="scale-0 dark:scale-100" />
    </Button>
  )
}
```

## 🔐 Authentication System

### NextAuth.js Configuration

```typescript
// Authentication providers and callbacks
const handler = NextAuth({
  providers: [CredentialsProvider({...})],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.userType = user.userType
      return token
    },
    async session({ session, token }) {
      session.user.userType = token.userType
      return session
    }
  }
})
```

### User Types
- **CLIENT** - Hires freelancers and posts projects
- **FREELANCER** - Provides services and completes work
- **AGENCY** - Manages teams and larger projects
- **ADMIN** - Platform administration and seller approval

## 💳 Payment Integration

### M-Pesa Integration (Mock Implementation)

```typescript
// M-Pesa payment processing
export async function POST(request: NextRequest) {
  const { amount, phoneNumber, accountReference } = await request.json()
  
  // Validate Kenyan phone number format
  const phoneRegex = /^254[0-9]{9}$/
  if (!phoneRegex.test(phoneNumber)) {
    return NextResponse.json({ error: 'Invalid phone number' })
  }
  
  // Process payment (mock implementation)
  const response = {
    merchantRequestId: `MR${Date.now()}`,
    checkoutRequestId: `CR${Date.now()}`,
    responseCode: '0',
    responseDescription: 'Success'
  }
  
  return NextResponse.json({ success: true, data: response })
}
```

### Supported Payment Methods
- **M-Pesa** - Primary mobile money platform
- **Airtel Money** - Alternative mobile money
- **Bank Transfers** - Traditional banking
- **Card Payments** - Visa/Mastercard support

## 📊 Analytics & Charts

### Recharts Implementation

```tsx
// Earnings trend chart
<ResponsiveContainer width="100%" height={200}>
  <AreaChart data={earningsData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Area 
      type="monotone" 
      dataKey="earnings" 
      stroke="#10B981" 
      fill="#10B981" 
      fillOpacity={0.2}
    />
  </AreaChart>
</ResponsiveContainer>
```

### Chart Types Used
- **Area Charts** - Earnings trends over time
- **Pie Charts** - Order status distribution
- **Bar Charts** - Skill performance metrics
- **Line Charts** - Growth and performance tracking

## 🛍️ E-commerce Features

### Shopping Cart System

```tsx
// Cart context implementation
const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  
  const addToCart = (item: CartItem) => {
    setCart(prev => [...prev, item])
  }
  
  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  )
}
```

### POS System Features
- **Product Catalog** - Kenya-focused products
- **Real-time Cart** - Dynamic quantity management
- **Checkout Flow** - M-Pesa integration
- **Order Management** - Status tracking

## 🏪 Seller Management

### Application Process

1. **Application Submission** - Detailed form with skills and experience
2. **Admin Review** - Manual approval process
3. **Status Updates** - PENDING → APPROVED/REJECTED
4. **Dashboard Access** - Full seller capabilities upon approval

### Seller Dashboard Features

```tsx
// Analytics data structure
const earningsData = [
  { month: 'Jan', earnings: 8500, orders: 12 },
  { month: 'Feb', earnings: 9200, orders: 15 },
  // ... more data
]

const orderStatusData = [
  { name: 'Completed', value: 156, color: '#10b981' },
  { name: 'In Progress', value: 8, color: '#3b82f6' },
  // ... more statuses
]
```

## 🌍 Kenya-Specific Features

### Localization
- **Currency** - KES (Kenyan Shillings) as primary
- **Language** - Swahili greetings and terms
- **Phone Numbers** - 254XXXXXXXXX format validation
- **Business Context** - Local company references

### Cultural Integration
- **"Karibu"** - Swahili welcome messages
- **Local Products** - Coffee, crafts, textiles
- **Regional Services** - County-based filtering
- **Business Types** - SMEs, startups, NGOs

## 🔧 Development Guidelines

### Code Documentation Standards

```typescript
/**
 * Component/Function Description
 * 
 * Detailed explanation of what this component/function does,
 * its purpose, and how it fits into the larger system.
 * 
 * Features:
 * - Feature 1 description
 * - Feature 2 description
 * 
 * @param paramName - Parameter description
 * @returns Return value description
 */
```

### Component Structure

```tsx
/**
 * Component documentation header
 */

'use client' // If client component

import statements...

/**
 * Interface definitions with documentation
 */
interface ComponentProps {
  /** Property description */
  property: string
}

/**
 * Main component function
 */
export default function Component({ property }: ComponentProps) {
  // Component logic
  return (
    // JSX structure
  )
}
```

### API Route Structure

```typescript
/**
 * API Route documentation
 */

import { NextRequest, NextResponse } from 'next/server'

/**
 * GET handler description
 */
export async function GET(request: NextRequest) {
  // Implementation
}

/**
 * POST handler description
 */
export async function POST(request: NextRequest) {
  // Implementation
}
```

## 🚀 Deployment & Environment

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Payment Integration
MPESA_CONSUMER_KEY="your-mpesa-key"
MPESA_CONSUMER_SECRET="your-mpesa-secret"
```

### Build Commands

```bash
# Install dependencies
npm install

# Database setup
npm run db:push
npm run db:generate
npm run db:seed

# Development
npm run dev

# Production build
npm run build
npm start
```

## 📱 Mobile Responsiveness

### Responsive Design Principles
- **Mobile-first** - Design starts with mobile layout
- **Progressive Enhancement** - Desktop features added progressively
- **Touch-friendly** - Appropriate button sizes and spacing
- **Performance** - Optimized for slower networks

### Breakpoint Strategy

```css
/* Mobile first approach */
.component {
  /* Mobile styles (default) */
}

@media (min-width: 768px) {
  /* Tablet styles */
}

@media (min-width: 1024px) {
  /* Desktop styles */
}
```

## 🔍 SEO & Performance

### Next.js Optimizations
- **App Router** - Modern routing with layouts
- **Server Components** - Reduced client-side JavaScript
- **Image Optimization** - Automatic image optimization
- **Code Splitting** - Automatic bundle splitting

### Performance Monitoring
- **Core Web Vitals** - LCP, FID, CLS tracking
- **Bundle Analysis** - Regular bundle size monitoring
- **Database Queries** - Optimized Prisma queries
- **Caching Strategy** - API response caching

## 🧪 Testing Strategy

### Testing Approach
- **Unit Tests** - Component and utility testing
- **Integration Tests** - API route testing
- **E2E Tests** - User flow testing
- **Visual Regression** - UI consistency testing

### Test Structure

```typescript
/**
 * Test file documentation
 */

describe('Component/Function Name', () => {
  /**
   * Test case description
   */
  it('should perform expected behavior', () => {
    // Test implementation
  })
})
```

## 📈 Future Enhancements

### Planned Features
- **Real M-Pesa Integration** - Safaricom Daraja API
- **Video Calls** - Integrated communication
- **AI Matching** - Smart freelancer-project matching
- **Mobile App** - React Native implementation
- **Advanced Analytics** - Business intelligence dashboard

### Scalability Considerations
- **Database Optimization** - Query performance tuning
- **CDN Integration** - Global content delivery
- **Microservices** - Service decomposition
- **Load Balancing** - Traffic distribution
- **Caching Layers** - Redis implementation

This documentation provides a comprehensive overview of the TalentHub Kenya platform, covering architecture, implementation details, and development guidelines for maintainers and contributors.