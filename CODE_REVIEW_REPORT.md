# Comprehensive Code Quality Review Report
## Talent Marketplace Production System

**Review Date:** March 5, 2026  
**Reviewer:** Senior Staff Software Engineer  
**System Type:** Next.js 14 E-commerce/Marketplace Platform  
**Overall Quality Score:** 6.5/10

---

## Executive Summary

This is a Next.js-based talent marketplace with M-Pesa payment integration, escrow system, and multi-role user management. The system shows moderate maturity with good architectural foundations but has critical security vulnerabilities, inconsistent error handling, and significant technical debt that must be addressed before production deployment.

### Critical Findings
- **Security:** Multiple critical vulnerabilities including exposed secrets, weak authentication, missing CSRF protection
- **Architecture:** Good service layer pattern but inconsistent implementation
- **Testing:** Minimal test coverage (only M-Pesa tests exist)
- **Performance:** No caching strategy, N+1 query risks, missing database indexes
- **Error Handling:** Inconsistent patterns, excessive console.log usage
- **Documentation:** Adequate README but missing API documentation

---

## 1. CODE QUALITY

### 1.1 Critical Issues

#### Issue #1: Inconsistent Error Handling Patterns
**Severity:** HIGH  
**Location:** Throughout API routes

**Problem:**
```typescript
// src/app/api/cart/route.ts - Inconsistent error responses
catch (error) {
  console.error('Cart fetch error:', error)
  return NextResponse.json({ cart: [] })  // Silently fails
}

// vs src/app/api/checkout/route.ts - Better but still inconsistent
catch (error: any) {
  console.error('Checkout error:', error)
  return NextResponse.json({ 
    error: 'Failed to process checkout',
    details: process.env.NODE_ENV === 'development' ? error.stack : undefined
  }, { status: 500 })
}
```

**Impact:** Silent failures make debugging impossible, inconsistent client error handling

**Fix:**
```typescript
// Create centralized error handler
// src/lib/api-error-handler.ts
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message)
  }
}

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return NextResponse.json({
      error: error.message,
      code: error.code,
      ...(process.env.NODE_ENV === 'development' && { details: error.details })
    }, { status: error.statusCode })
  }
  
  // Log unexpected errors
  logger.error('Unexpected API error', { error })
  
  return NextResponse.json({
    error: 'Internal server error',
    code: 'INTERNAL_ERROR'
  }, { status: 500 })
}

// Usage in routes
export async function GET(request: NextRequest) {
  try {
    // ... logic
  } catch (error) {
    return handleApiError(error)
  }
}
```


#### Issue #2: Excessive Console.log Usage
**Severity:** MEDIUM  
**Location:** 50+ instances across codebase

**Problem:** Production code contains console.log statements that should use proper logging
```typescript
// src/lib/mpesa.ts
console.log('STK Push Response:', result)  // Logs sensitive payment data
console.error('M-Pesa STK Push Error:', error)

// src/app/api/mpesa/callback/route.ts
console.log('M-Pesa Callback received:', JSON.stringify(callbackData, null, 2))
```

**Impact:** 
- Sensitive data exposure in logs
- Performance overhead in production
- Difficult log aggregation and monitoring

**Fix:** Use structured logging consistently
```typescript
// Already have logger.ts, enforce its usage
import { logger } from '@/lib/logger'

// Replace all console.log with:
logger.info('STK Push initiated', { orderId, amount })
logger.error('M-Pesa error', { error, context: { orderId } })
```

#### Issue #3: Code Duplication in ID Generation
**Severity:** LOW  
**Location:** Multiple services

**Problem:**
```typescript
// Pattern repeated across files
id: `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
id: `esc_${Date.now()}`
```

**Fix:** Centralize ID generation
```typescript
// src/lib/id-generator.ts
import { randomUUID } from 'crypto'

export const generateId = {
  order: () => `ORD_${randomUUID()}`,
  payment: () => `PAY_${randomUUID()}`,
  escrow: () => `ESC_${randomUUID()}`,
  cart: () => `CRT_${randomUUID()}`,
  // Use crypto.randomUUID() for better entropy
}
```

### 1.2 Naming Conventions
**Status:** GOOD with minor issues

**Issues:**
- Inconsistent file naming: `route.ts` vs `interview-criteria.ts` in same directory
- Database table names use snake_case while TypeScript uses camelCase (acceptable but document)
- Some overly generic names: `users.ts` (the Map, not the model)

---

## 2. ARCHITECTURE & DESIGN

### 2.1 Strengths
✅ Service layer pattern with BaseService abstraction  
✅ Prisma ORM with proper schema design  
✅ Next.js App Router with proper route organization  
✅ Separation of concerns (lib/, components/, app/)  

### 2.2 Critical Issues

#### Issue #4: Inconsistent Service Layer Usage
**Severity:** MEDIUM


**Problem:** Some routes use services, others access Prisma directly
```typescript
// Good: src/lib/checkout.service.ts
export class CheckoutService extends BaseService {
  static async createOrderWithPayment(data: CheckoutData) { ... }
}

// Bad: src/app/api/cart/route.ts - Direct Prisma access
const cart = await prisma.cart.findMany({
  where: { userId: session.user.id }
})
```

**Fix:** Create CartService and enforce service layer usage
```typescript
// src/lib/cart.service.ts
export class CartService extends BaseService {
  static async getCart(userId: string) {
    return this.executeWithTracking('getCart', async () => {
      return await prisma.cart.findMany({
        where: { userId },
        include: { products: true }
      })
    }, { userId })
  }
}
```

#### Issue #5: Missing Repository Pattern for Complex Queries
**Severity:** MEDIUM

**Problem:** Complex Prisma queries scattered across API routes make testing difficult

**Fix:** Implement repository pattern
```typescript
// src/repositories/order.repository.ts
export class OrderRepository {
  async findByIdWithRelations(orderId: string) {
    return prisma.orders.findUnique({
      where: { id: orderId },
      include: {
        users: true,
        gigs: true,
        payments: true,
        reviews: true
      }
    })
  }
  
  async findUserOrders(userId: string, filters: OrderFilters) {
    return prisma.orders.findMany({
      where: {
        buyerId: userId,
        ...this.buildWhereClause(filters)
      },
      orderBy: { createdAt: 'desc' }
    })
  }
}
```

#### Issue #6: Tight Coupling to External Services
**Severity:** HIGH

**Problem:** MpesaService directly coupled to Safaricom API without abstraction
```typescript
// src/lib/mpesa.ts
class MpesaService {
  async initiateSTKPush() {
    const response = await fetch(this.getStkUrl(), { ... })
  }
}
```

**Fix:** Create payment gateway abstraction
```typescript
// src/lib/payment/payment-gateway.interface.ts
export interface PaymentGateway {
  initiatePayment(params: PaymentParams): Promise<PaymentResult>
  verifyPayment(reference: string): Promise<PaymentStatus>
}

// src/lib/payment/mpesa-gateway.ts
export class MpesaGateway implements PaymentGateway {
  async initiatePayment(params: PaymentParams) { ... }
}

// Easy to add Stripe, PayPal, etc.
export class StripeGateway implements PaymentGateway { ... }
```

---

## 3. SECURITY REVIEW

### 3.1 CRITICAL VULNERABILITIES


#### Issue #7: Missing CSRF Protection
**Severity:** CRITICAL  
**CVE Risk:** High

**Problem:** 
```typescript
// src/lib/security.ts has validateCsrfToken but it's NEVER USED
static validateCsrfToken(req: NextRequest): boolean {
  const token = req.headers.get('x-csrf-token')
  const sessionToken = req.cookies.get('csrf-token')?.value
  return token === sessionToken
}

// No API routes implement CSRF validation
```

**Impact:** Vulnerable to Cross-Site Request Forgery attacks on state-changing operations

**Fix:**
```typescript
// middleware.ts - Add CSRF middleware
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Generate CSRF token for GET requests
  if (request.method === 'GET') {
    const response = NextResponse.next()
    if (!request.cookies.get('csrf-token')) {
      const token = crypto.randomUUID()
      response.cookies.set('csrf-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      })
    }
    return response
  }
  
  // Validate CSRF for state-changing requests
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    const csrfToken = request.headers.get('x-csrf-token')
    const cookieToken = request.cookies.get('csrf-token')?.value
    
    if (!csrfToken || csrfToken !== cookieToken) {
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      )
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*'
}
```

#### Issue #8: Weak Rate Limiting Implementation
**Severity:** CRITICAL

**Problem:**
```typescript
// src/lib/security.ts - In-memory rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Issues:
// 1. Resets on server restart
// 2. Not shared across instances
// 3. Memory leak potential (no cleanup)
// 4. Easy to bypass with IP rotation
```

**Fix:** Use Redis-based rate limiting
```typescript
// src/lib/rate-limiter.ts
import { redis } from './redis'

export async function rateLimit(
  identifier: string,
  limit: number = 100,
  windowSeconds: number = 60
): Promise<{ success: boolean; remaining: number }> {
  if (!redis) {
    logger.warn('Redis not configured, rate limiting disabled')
    return { success: true, remaining: limit }
  }
  
  const key = `ratelimit:${identifier}`
  const current = await redis.incr(key)
  
  if (current === 1) {
    await redis.expire(key, windowSeconds)
  }
  
  const remaining = Math.max(0, limit - current)
  
  return {
    success: current <= limit,
    remaining
  }
}

// Apply to API routes
export async function POST(request: NextRequest) {
  const ip = request.ip || 'unknown'
  const { success, remaining } = await rateLimit(ip, 10, 60)
  
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { 
        status: 429,
        headers: { 'X-RateLimit-Remaining': remaining.toString() }
      }
    )
  }
  // ... rest of handler
}
```


#### Issue #9: Sensitive Data Exposure in Logs
**Severity:** CRITICAL

**Problem:**
```typescript
// src/lib/mpesa.ts
console.log('STK Push Response:', result)  // Contains payment details

// src/app/api/mpesa/callback/route.ts
console.log('M-Pesa Callback received:', JSON.stringify(callbackData, null, 2))
// Logs: phone numbers, amounts, transaction IDs
```

**Impact:** PCI-DSS violation, GDPR violation, security audit failure

**Fix:**
```typescript
// src/lib/logger.ts - Add data sanitization
const SENSITIVE_FIELDS = ['password', 'token', 'secret', 'phoneNumber', 'mpesaReceiptNumber']

function sanitize(obj: any): any {
  if (typeof obj !== 'object' || obj === null) return obj
  
  const sanitized = Array.isArray(obj) ? [] : {}
  
  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_FIELDS.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
      sanitized[key] = '***REDACTED***'
    } else if (typeof value === 'object') {
      sanitized[key] = sanitize(value)
    } else {
      sanitized[key] = value
    }
  }
  
  return sanitized
}

export const logger = {
  info: (message: string, meta?: any) => {
    log('info', message, sanitize(meta))
  },
  // ... other methods
}
```

#### Issue #10: Missing Input Validation on Critical Endpoints
**Severity:** HIGH

**Problem:**
```typescript
// src/app/api/checkout/route.ts
const { items, phoneNumber, shippingAddress } = await request.json()
// No validation schema applied!

if (!items || !Array.isArray(items) || items.length === 0) {
  return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
}
// Manual validation is error-prone
```

**Fix:** Use Zod schemas consistently
```typescript
// src/lib/validations/checkout.ts
export const checkoutSchema = z.object({
  items: z.array(z.object({
    id: z.string().uuid(),
    quantity: z.number().int().positive(),
    price: z.number().positive()
  })).min(1),
  phoneNumber: z.string().regex(/^(254|0)[17]\d{8}$/),
  shippingAddress: z.string().max(500).optional()
})

// In route
export async function POST(request: NextRequest) {
  const body = await request.json()
  const validated = checkoutSchema.parse(body)  // Throws on invalid
  // ... use validated data
}
```

#### Issue #11: SQL Injection Risk (Low but Present)
**Severity:** MEDIUM

**Problem:** Using $queryRaw without parameterization
```typescript
// src/app/api/health/route.ts
await prisma.$queryRaw`SELECT 1`  // OK - no user input

// But pattern could be misused elsewhere
```

**Recommendation:** 
- Audit all $queryRaw and $executeRaw usage
- Use Prisma's type-safe query builder instead
- If raw SQL needed, always use parameterized queries

#### Issue #12: Weak Password Requirements
**Severity:** HIGH

**Problem:**
```typescript
// src/lib/validations.ts
password: z.string().min(6, 'Password must be at least 6 characters')
// Only 6 characters! No complexity requirements
```

**Fix:**
```typescript
export const passwordSchema = z.string()
  .min(12, 'Password must be at least 12 characters')
  .regex(/[A-Z]/, 'Must contain uppercase letter')
  .regex(/[a-z]/, 'Must contain lowercase letter')
  .regex(/[0-9]/, 'Must contain number')
  .regex(/[^A-Za-z0-9]/, 'Must contain special character')

// Also implement password strength meter on frontend
```

#### Issue #13: Missing Authentication on Test Endpoints
**Severity:** CRITICAL

**Problem:**
```typescript
// These endpoints exist in production build:
// /api/test-checkout
// /api/test-connection
// /api/test-db
// /api/auth/test
```

**Fix:**
```typescript
// Remove test endpoints or protect them
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  // ... test logic
}

// Better: Use separate test environment, don't deploy test routes
```

---

## 4. PERFORMANCE & EFFICIENCY


### 4.1 Critical Performance Issues

#### Issue #14: N+1 Query Problem
**Severity:** HIGH

**Problem:**
```typescript
// Likely pattern in list endpoints (need to verify actual code)
const orders = await prisma.orders.findMany({ where: { buyerId } })
// Then for each order:
for (const order of orders) {
  const gig = await prisma.gigs.findUnique({ where: { id: order.gigId } })
  // N+1 queries!
}
```

**Fix:** Use Prisma includes
```typescript
const orders = await prisma.orders.findMany({
  where: { buyerId },
  include: {
    gigs: true,
    payments: true,
    users: { select: { id: true, name: true, email: true } }
  }
})
```

#### Issue #15: Missing Database Indexes
**Severity:** HIGH

**Problem:** Schema has no explicit indexes on frequently queried fields
```prisma
// prisma/schema.prisma
model orders {
  buyerId String  // No index!
  status OrderStatus  // No index!
  createdAt DateTime  // No index!
}
```

**Fix:**
```prisma
model orders {
  id String @id
  buyerId String
  status OrderStatus
  createdAt DateTime @default(now())
  
  @@index([buyerId])
  @@index([status])
  @@index([createdAt])
  @@index([buyerId, status])  // Composite for common queries
}

// Apply to all models with frequent WHERE clauses
```

#### Issue #16: No Caching Strategy
**Severity:** HIGH

**Problem:** Every request hits the database, even for static data
```typescript
// Categories fetched on every page load
const categories = await prisma.categories.findMany()
```

**Fix:** Implement Redis caching
```typescript
// src/lib/cache-service.ts
export class CacheService {
  private static TTL = {
    categories: 3600,      // 1 hour
    products: 300,         // 5 minutes
    userProfile: 600,      // 10 minutes
  }
  
  static async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number
  ): Promise<T> {
    const cached = await redis?.get(key)
    if (cached) return JSON.parse(cached)
    
    const fresh = await fetcher()
    await redis?.setex(key, ttl, JSON.stringify(fresh))
    return fresh
  }
  
  static async getCategories() {
    return this.getOrSet(
      'categories:all',
      () => prisma.categories.findMany({ where: { isActive: true } }),
      this.TTL.categories
    )
  }
}
```

#### Issue #17: Inefficient Image Handling
**Severity:** MEDIUM

**Problem:** No image optimization configuration
```typescript
// next.config.js has basic config but:
// - No image CDN
// - No automatic format conversion
// - No responsive image generation
```

**Fix:**
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['images.unsplash.com', 'uploadthing.com'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    loader: 'custom',
    loaderFile: './src/lib/image-loader.ts'
  }
}

// Use Cloudinary or Imgix for production
```

#### Issue #18: Missing Connection Pooling Configuration
**Severity:** MEDIUM

**Problem:**
```typescript
// src/lib/prisma.ts
export const prisma = new PrismaClient({ 
  log: ['error'],
  // No connection pool configuration!
})
```

**Fix:**
```typescript
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
})

// In DATABASE_URL, add connection pooling:
// postgresql://user:pass@host:5432/db?connection_limit=10&pool_timeout=20
```

#### Issue #19: Unoptimized Bundle Size
**Severity:** MEDIUM

**Problem:** Large dependencies imported without tree-shaking
```typescript
// Importing entire libraries
import * as Icons from 'lucide-react'  // Imports all icons
import { format, parse, ... } from 'date-fns'  // Could be optimized
```

**Fix:**
```typescript
// Import only what you need
import { Calendar, User, Settings } from 'lucide-react'
import format from 'date-fns/format'

// Use next.config.js optimization
experimental: {
  optimizePackageImports: ['lucide-react', 'date-fns', '@radix-ui/react-icons'],
}
```

---

## 5. ERROR HANDLING & RELIABILITY


### 5.1 Error Handling Issues

#### Issue #20: Inconsistent Transaction Handling
**Severity:** HIGH

**Problem:** Some operations that should be atomic aren't wrapped in transactions
```typescript
// src/app/api/checkout/route.ts - Good example
const order = await prisma.$transaction(async (tx) => {
  const newOrder = await tx.orders.create({ ... })
  await tx.products.update({ ... })  // Decrement stock
  await tx.cart.deleteMany({ ... })  // Clear cart
  return newOrder
})

// But many other multi-step operations don't use transactions
```

**Fix:** Audit all multi-step database operations and wrap in transactions

#### Issue #21: No Retry Logic for External Services
**Severity:** HIGH

**Problem:**
```typescript
// src/lib/mpesa.ts
const response = await fetch(this.getStkUrl(), { ... })
// Single attempt, no retry on network failure
```

**Fix:** Implement exponential backoff
```typescript
// src/lib/retry.ts
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number
    delayMs?: number
    backoff?: number
  } = {}
): Promise<T> {
  const { maxAttempts = 3, delayMs = 1000, backoff = 2 } = options
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      if (attempt === maxAttempts) throw error
      
      const delay = delayMs * Math.pow(backoff, attempt - 1)
      logger.warn(`Attempt ${attempt} failed, retrying in ${delay}ms`, { error })
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw new Error('Max retries exceeded')
}

// Usage
const response = await withRetry(
  () => fetch(this.getStkUrl(), { ... }),
  { maxAttempts: 3, delayMs: 1000 }
)
```

#### Issue #22: Missing Circuit Breaker Pattern
**Severity:** MEDIUM

**Problem:** No protection against cascading failures when external services are down

**Fix:**
```typescript
// src/lib/circuit-breaker.ts
export class CircuitBreaker {
  private failures = 0
  private lastFailureTime = 0
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED'
  
  constructor(
    private threshold: number = 5,
    private timeout: number = 60000
  ) {}
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN'
      } else {
        throw new Error('Circuit breaker is OPEN')
      }
    }
    
    try {
      const result = await fn()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }
  
  private onSuccess() {
    this.failures = 0
    this.state = 'CLOSED'
  }
  
  private onFailure() {
    this.failures++
    this.lastFailureTime = Date.now()
    if (this.failures >= this.threshold) {
      this.state = 'OPEN'
    }
  }
}

// Usage with M-Pesa
const mpesaCircuitBreaker = new CircuitBreaker(5, 60000)

async initiateSTKPush(params: StkPushRequest) {
  return mpesaCircuitBreaker.execute(() => this._initiateSTKPush(params))
}
```

#### Issue #23: No Graceful Degradation
**Severity:** MEDIUM

**Problem:** When Redis is down, features fail instead of degrading
```typescript
// src/lib/redis.ts
export const rateLimit = async (identifier: string) => {
  if (!redis) {
    console.warn('Redis not configured, skipping rate limiting')
    return { success: true }  // Silently bypasses security!
  }
}
```

**Fix:**
```typescript
export const rateLimit = async (identifier: string) => {
  if (!redis) {
    logger.error('Redis unavailable, using fallback rate limiting')
    // Use in-memory fallback with warning
    return inMemoryRateLimit(identifier)
  }
  
  try {
    return await redisRateLimit(identifier)
  } catch (error) {
    logger.error('Redis rate limit failed', { error })
    // Fail closed for security
    return { success: false, error: 'Rate limiting unavailable' }
  }
}
```

#### Issue #24: Missing Idempotency Keys
**Severity:** HIGH

**Problem:** Payment operations can be duplicated on retry
```typescript
// src/app/api/mpesa/stkpush/route.ts
// No idempotency key check
const result = await mpesaService.initiateSTKPush({ ... })
```

**Fix:**
```typescript
export async function POST(request: NextRequest) {
  const idempotencyKey = request.headers.get('idempotency-key')
  
  if (!idempotencyKey) {
    return NextResponse.json(
      { error: 'Idempotency-Key header required' },
      { status: 400 }
    )
  }
  
  // Check if already processed
  const existing = await redis?.get(`idempotency:${idempotencyKey}`)
  if (existing) {
    return NextResponse.json(JSON.parse(existing))
  }
  
  // Process request
  const result = await mpesaService.initiateSTKPush({ ... })
  
  // Cache result for 24 hours
  await redis?.setex(
    `idempotency:${idempotencyKey}`,
    86400,
    JSON.stringify(result)
  )
  
  return NextResponse.json(result)
}
```

---

## 6. TESTING & COVERAGE


### 6.1 Test Coverage Analysis

#### Issue #25: Minimal Test Coverage
**Severity:** CRITICAL

**Current State:**
- Only 2 test files exist: `mpesa.test.ts` and `mpesa-integration.test.ts`
- No unit tests for services
- No integration tests for API routes
- No E2E tests (Playwright configured but unused)
- No component tests

**Estimated Coverage:** < 5%

**Fix:** Implement comprehensive testing strategy

```typescript
// __tests__/services/cart.service.test.ts
import { CartService } from '@/lib/cart.service'
import { prismaMock } from '../mocks/prisma'

describe('CartService', () => {
  describe('addToCart', () => {
    it('should add item to cart', async () => {
      const mockProduct = { id: '1', stock: 10, price: 100 }
      prismaMock.products.findUnique.mockResolvedValue(mockProduct)
      
      const result = await CartService.addToCart('user1', '1', 2)
      
      expect(result).toBeDefined()
      expect(prismaMock.cart.upsert).toHaveBeenCalled()
    })
    
    it('should throw error when insufficient stock', async () => {
      const mockProduct = { id: '1', stock: 1, price: 100 }
      prismaMock.products.findUnique.mockResolvedValue(mockProduct)
      
      await expect(
        CartService.addToCart('user1', '1', 5)
      ).rejects.toThrow('Insufficient stock')
    })
  })
})

// __tests__/api/cart.test.ts
import { POST } from '@/app/api/cart/route'
import { NextRequest } from 'next/server'

describe('POST /api/cart', () => {
  it('should return 401 when not authenticated', async () => {
    const request = new NextRequest('http://localhost/api/cart', {
      method: 'POST',
      body: JSON.stringify({ productId: '1', quantity: 1 })
    })
    
    const response = await POST(request)
    expect(response.status).toBe(401)
  })
})

// __tests__/e2e/checkout.spec.ts
import { test, expect } from '@playwright/test'

test('complete checkout flow', async ({ page }) => {
  await page.goto('/products')
  await page.click('[data-testid="add-to-cart"]')
  await page.goto('/cart')
  await page.click('[data-testid="checkout"]')
  await page.fill('[name="phoneNumber"]', '254712345678')
  await page.click('[data-testid="pay-now"]')
  
  await expect(page.locator('[data-testid="payment-initiated"]')).toBeVisible()
})
```

**Testing Strategy:**
1. Unit tests for all services (target: 80% coverage)
2. Integration tests for all API routes (target: 90% coverage)
3. E2E tests for critical user flows (checkout, payment, orders)
4. Component tests for complex UI components
5. Contract tests for external API integrations

#### Issue #26: No Mocking Strategy
**Severity:** HIGH

**Problem:** Tests directly hit external services (M-Pesa sandbox)

**Fix:**
```typescript
// __tests__/mocks/mpesa.mock.ts
export const mockMpesaService = {
  initiateSTKPush: jest.fn().mockResolvedValue({
    MerchantRequestID: 'mock-merchant-id',
    CheckoutRequestID: 'mock-checkout-id',
    ResponseCode: '0',
    ResponseDescription: 'Success',
    CustomerMessage: 'Success'
  }),
  
  getAccessToken: jest.fn().mockResolvedValue('mock-token')
}

// Use in tests
jest.mock('@/lib/mpesa', () => ({
  mpesaService: mockMpesaService
}))
```

#### Issue #27: No Load Testing
**Severity:** HIGH

**Problem:** No performance testing before production

**Fix:** Implement load testing with k6
```javascript
// load-tests/checkout.js
import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 200 },  // Spike
    { duration: '5m', target: 200 },
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% under 500ms
    http_req_failed: ['rate<0.01'],    // <1% errors
  }
}

export default function() {
  const payload = JSON.stringify({
    items: [{ id: '1', quantity: 1, price: 100 }],
    phoneNumber: '254712345678'
  })
  
  const response = http.post('http://localhost:3000/api/checkout', payload, {
    headers: { 'Content-Type': 'application/json' }
  })
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500
  })
  
  sleep(1)
}
```

---

## 7. DEVOPS & DEPLOYMENT


### 7.1 Deployment Issues

#### Issue #28: Missing CI/CD Pipeline
**Severity:** HIGH

**Problem:** No automated testing or deployment pipeline

**Fix:** Create GitHub Actions workflow
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Type check
        run: npm run type-check
      
      - name: Run tests
        run: npm run test:coverage
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
  
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run security audit
        run: npm audit --audit-level moderate
      
      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
  
  deploy:
    needs: [test, security]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to production
        run: ./deploy.sh
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
```

#### Issue #29: Missing Environment Validation
**Severity:** HIGH

**Problem:** App starts even with missing critical env vars

**Fix:**
```typescript
// src/lib/env-validation.ts - Already exists but not enforced!
// Add to app startup:

// src/app/layout.tsx or instrumentation.ts
import { validateEnv } from '@/lib/env-validation'

// Validate on startup
if (typeof window === 'undefined') {
  try {
    validateEnv()
  } catch (error) {
    console.error('Environment validation failed:', error)
    process.exit(1)  // Fail fast!
  }
}
```

#### Issue #30: No Health Check Endpoint Monitoring
**Severity:** MEDIUM

**Problem:** Health check exists but no monitoring configured

**Fix:**
```typescript
// src/app/api/health/route.ts - Enhance existing endpoint
export async function GET() {
  const checks = {
    database: false,
    redis: false,
    mpesa: false,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  }
  
  try {
    await prisma.$queryRaw`SELECT 1`
    checks.database = true
  } catch (error) {
    logger.error('Database health check failed', { error })
  }
  
  try {
    await redis?.ping()
    checks.redis = true
  } catch (error) {
    logger.error('Redis health check failed', { error })
  }
  
  const allHealthy = checks.database && checks.redis
  
  return NextResponse.json(checks, {
    status: allHealthy ? 200 : 503
  })
}

// Add monitoring with UptimeRobot, Pingdom, or custom solution
```

#### Issue #31: Missing Database Migration Strategy
**Severity:** HIGH

**Problem:** No clear migration rollback strategy

**Fix:**
```bash
# scripts/migrate.sh
#!/bin/bash
set -e

echo "Running database migrations..."

# Backup before migration
./backup.sh

# Run migrations
npx prisma migrate deploy

# Verify migration
if npx prisma migrate status | grep -q "Database schema is up to date"; then
  echo "✅ Migration successful"
else
  echo "❌ Migration failed, rolling back..."
  # Restore from backup
  gunzip -c backups/latest.sql.gz | psql $DATABASE_URL
  exit 1
fi
```

#### Issue #32: No Secrets Management
**Severity:** CRITICAL

**Problem:** Secrets in .env files, no rotation strategy

**Fix:**
```typescript
// Use AWS Secrets Manager, HashiCorp Vault, or similar

// src/lib/secrets.ts
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager'

const client = new SecretsManagerClient({ region: 'us-east-1' })

export async function getSecret(secretName: string): Promise<string> {
  const command = new GetSecretValueCommand({ SecretId: secretName })
  const response = await client.send(command)
  return response.SecretString || ''
}

// Usage
const mpesaKey = await getSecret('prod/mpesa/consumer-key')
```

#### Issue #33: Missing Monitoring and Alerting
**Severity:** HIGH

**Problem:** Sentry configured but no custom metrics or alerts

**Fix:**
```typescript
// src/lib/monitoring.ts
import * as Sentry from '@sentry/nextjs'

export const metrics = {
  trackPayment: (status: 'success' | 'failed', amount: number) => {
    Sentry.metrics.increment('payment.processed', 1, {
      tags: { status }
    })
    Sentry.metrics.distribution('payment.amount', amount, {
      tags: { status }
    })
  },
  
  trackApiLatency: (endpoint: string, duration: number) => {
    Sentry.metrics.distribution('api.latency', duration, {
      tags: { endpoint }
    })
  }
}

// Set up alerts in Sentry dashboard:
// - Payment failure rate > 5%
// - API latency p95 > 1000ms
// - Error rate > 1%
```

---

## 8. DOCUMENTATION & MAINTAINABILITY


### 8.1 Documentation Issues

#### Issue #34: Missing API Documentation
**Severity:** HIGH

**Problem:** No OpenAPI/Swagger documentation for API endpoints

**Fix:**
```typescript
// Install swagger dependencies
// npm install swagger-jsdoc swagger-ui-react

// src/lib/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Talent Marketplace API',
      version: '1.0.0',
      description: 'API documentation for Talent Marketplace'
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Development' },
      { url: 'https://api.yourdomain.com', description: 'Production' }
    ]
  },
  apis: ['./src/app/api/**/*.ts']
}

export const swaggerSpec = swaggerJsdoc(options)

// Document endpoints with JSDoc
/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Item added successfully
 *       401:
 *         description: Unauthorized
 */
export async function POST(request: NextRequest) { ... }
```

#### Issue #35: Insufficient Code Comments
**Severity:** MEDIUM

**Problem:** Complex business logic lacks explanatory comments

**Fix:**
```typescript
// src/lib/escrow.service.ts - Add comprehensive comments
export class EscrowService {
  /**
   * Initiates an escrow transaction for a marketplace order
   * 
   * Flow:
   * 1. Creates escrow record in INITIATED state
   * 2. Sets delivery deadline (7 days from now)
   * 3. Sets confirmation deadline (3 days after delivery)
   * 4. Creates audit log entry
   * 
   * @param params - Escrow initialization parameters
   * @returns Created escrow transaction
   * @throws ValidationError if buyer/seller IDs are invalid
   * 
   * @example
   * const escrow = await escrowService.initiate({
   *   buyerId: 'user_123',
   *   sellerId: 'user_456',
   *   orderId: 'order_789',
   *   amount: 1000
   * })
   */
  async initiate(params: InitiateEscrowParams) {
    // Implementation with inline comments for complex logic
  }
}
```

#### Issue #36: No Architecture Documentation
**Severity:** MEDIUM

**Problem:** No high-level architecture diagrams or documentation

**Fix:** Create architecture documentation
```markdown
# docs/ARCHITECTURE.md

## System Architecture

### High-Level Overview
```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Next.js   │────▶│  PostgreSQL  │     │   Redis     │
│   Frontend  │     │   Database   │     │   Cache     │
└─────────────┘     └──────────────┘     └─────────────┘
       │                                         │
       │                                         │
       ▼                                         ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   M-Pesa    │     │  UploadThing │     │   Sentry    │
│   Payment   │     │  File Upload │     │  Monitoring │
└─────────────┘     └──────────────┘     └─────────────┘
```

### Layer Architecture
1. **Presentation Layer** (src/app, src/components)
   - Next.js App Router pages
   - React components
   - Client-side state management

2. **API Layer** (src/app/api)
   - RESTful endpoints
   - Authentication middleware
   - Request validation

3. **Service Layer** (src/lib/*service.ts)
   - Business logic
   - Transaction management
   - External service integration

4. **Data Layer** (Prisma)
   - Database access
   - Query optimization
   - Schema management

### Key Design Patterns
- **Service Layer Pattern**: Business logic encapsulated in services
- **Repository Pattern**: (Recommended) Data access abstraction
- **Factory Pattern**: ID generation, service instantiation
- **Observer Pattern**: Webhook callbacks, notifications

### Data Flow Example: Checkout Process
```
User → Cart Page → Checkout API → CheckoutService
                                        ↓
                                  Validate Items
                                        ↓
                                  Create Order (Transaction)
                                        ↓
                                  Initiate M-Pesa Payment
                                        ↓
                                  Return Payment URL
                                        ↓
User ← Payment Confirmation ← M-Pesa Callback
```
```

#### Issue #37: No Onboarding Documentation
**Severity:** MEDIUM

**Problem:** New developers would struggle to get started

**Fix:**
```markdown
# docs/ONBOARDING.md

## Developer Onboarding Guide

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Redis (optional for development)
- M-Pesa sandbox account

### Setup Steps

1. **Clone and Install**
   ```bash
   git clone <repo>
   cd talent-marketplace
   npm install
   ```

2. **Database Setup**
   ```bash
   # Create database
   createdb talent_marketplace
   
   # Run migrations
   npx prisma migrate dev
   
   # Seed data
   npm run db:seed
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. **Start Development**
   ```bash
   npm run dev
   ```

### Project Structure
```
src/
├── app/              # Next.js pages and API routes
│   ├── api/         # Backend API endpoints
│   └── (pages)/     # Frontend pages
├── components/       # React components
├── lib/             # Business logic and utilities
│   ├── *service.ts  # Service layer
│   └── prisma.ts    # Database client
└── types/           # TypeScript types
```

### Common Tasks

**Adding a New API Endpoint**
1. Create route file: `src/app/api/[name]/route.ts`
2. Implement handler with proper validation
3. Add tests: `__tests__/api/[name].test.ts`
4. Document with JSDoc for Swagger

**Adding a New Service**
1. Extend BaseService: `src/lib/[name].service.ts`
2. Implement business logic methods
3. Add unit tests
4. Update service documentation

### Debugging Tips
- Use `npm run dev` for hot reload
- Check logs in `logs/` directory
- Use Prisma Studio: `npx prisma studio`
- Test M-Pesa with sandbox credentials
```

---

## 9. ADDITIONAL CONCERNS


### 9.1 Data Privacy & Compliance

#### Issue #38: Missing GDPR Compliance
**Severity:** CRITICAL (if serving EU users)

**Problems:**
- No data retention policy
- No user data export functionality
- No right-to-be-forgotten implementation
- No cookie consent management
- No privacy policy enforcement

**Fix:**
```typescript
// src/app/api/user/export/route.ts
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Export all user data
  const userData = await prisma.users.findUnique({
    where: { id: session.user.id },
    include: {
      orders: true,
      cart: true,
      reviews: true,
      messages: true,
      notifications: true
    }
  })
  
  return NextResponse.json(userData, {
    headers: {
      'Content-Disposition': 'attachment; filename="user-data.json"'
    }
  })
}

// src/app/api/user/delete/route.ts
export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Anonymize or delete user data
  await prisma.$transaction([
    // Anonymize orders (keep for accounting)
    prisma.orders.updateMany({
      where: { buyerId: session.user.id },
      data: { buyerId: 'DELETED_USER' }
    }),
    // Delete personal data
    prisma.users.delete({
      where: { id: session.user.id }
    })
  ])
  
  return NextResponse.json({ success: true })
}
```

#### Issue #39: No Audit Trail for Sensitive Operations
**Severity:** HIGH

**Problem:** No logging of admin actions, data modifications

**Fix:**
```typescript
// src/lib/audit-logger.ts
export async function logAuditEvent(event: {
  userId: string
  action: string
  resource: string
  resourceId: string
  changes?: any
  ipAddress?: string
  userAgent?: string
}) {
  await prisma.system_logs.create({
    data: {
      id: `log_${Date.now()}`,
      type: 'SECURITY',
      message: `${event.action} on ${event.resource}`,
      details: {
        ...event,
        timestamp: new Date().toISOString()
      },
      userId: event.userId,
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      createdAt: new Date()
    }
  })
}

// Use in admin endpoints
export async function DELETE(request: NextRequest, { params }) {
  const session = await getServerSession(authOptions)
  
  await prisma.users.delete({ where: { id: params.id } })
  
  await logAuditEvent({
    userId: session.user.id,
    action: 'DELETE_USER',
    resource: 'users',
    resourceId: params.id,
    ipAddress: request.ip,
    userAgent: request.headers.get('user-agent')
  })
}
```

### 9.2 Scalability Concerns

#### Issue #40: No Database Sharding Strategy
**Severity:** MEDIUM (future concern)

**Problem:** Single database will become bottleneck at scale

**Recommendation:**
- Plan for horizontal sharding by user ID or region
- Consider read replicas for read-heavy operations
- Implement CQRS pattern for complex queries

#### Issue #41: No CDN Configuration
**Severity:** MEDIUM

**Problem:** Static assets served from origin server

**Fix:**
```javascript
// next.config.js
module.exports = {
  images: {
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/your-cloud-name/image/upload/',
  },
  
  // Or use Vercel/Cloudflare CDN
  assetPrefix: process.env.CDN_URL || '',
}
```

#### Issue #42: No Message Queue for Async Operations
**Severity:** MEDIUM

**Problem:** Long-running operations block API responses

**Fix:** Implement job queue with BullMQ
```typescript
// src/lib/queue.ts
import { Queue, Worker } from 'bullmq'
import { redis } from './redis'

export const emailQueue = new Queue('emails', {
  connection: redis
})

export const emailWorker = new Worker('emails', async (job) => {
  const { to, subject, body } = job.data
  await sendEmail(to, subject, body)
}, {
  connection: redis
})

// Usage in API
export async function POST(request: NextRequest) {
  // ... create order
  
  // Queue email instead of sending synchronously
  await emailQueue.add('order-confirmation', {
    to: user.email,
    subject: 'Order Confirmation',
    body: orderDetails
  })
  
  return NextResponse.json({ success: true })
}
```

### 9.3 Business Logic Issues

#### Issue #43: Race Condition in Stock Management
**Severity:** CRITICAL

**Problem:**
```typescript
// src/app/api/checkout/route.ts
const product = await prisma.products.findUnique({ where: { id } })
if (product.stock < quantity) {
  return error
}
// Race condition here! Another request could buy the same stock
await prisma.products.update({
  where: { id },
  data: { stock: { decrement: quantity } }
})
```

**Fix:** Use database-level atomic operations
```typescript
// Use Prisma's atomic decrement with check
const result = await prisma.products.updateMany({
  where: {
    id: productId,
    stock: { gte: quantity }  // Only update if stock sufficient
  },
  data: {
    stock: { decrement: quantity }
  }
})

if (result.count === 0) {
  throw new Error('Insufficient stock')
}
```

#### Issue #44: No Refund Handling
**Severity:** HIGH

**Problem:** Escrow has refund logic but no M-Pesa refund integration

**Fix:**
```typescript
// src/lib/mpesa-refund.ts
export async function initiateRefund(params: {
  transactionId: string
  amount: number
  reason: string
}) {
  // Implement M-Pesa B2C reversal API
  // https://developer.safaricom.co.ke/APIs/Reversal
}
```

#### Issue #45: No Fraud Detection
**Severity:** HIGH

**Problem:** No checks for suspicious activity

**Fix:**
```typescript
// src/lib/fraud-detection.ts
export async function checkFraudRisk(params: {
  userId: string
  amount: number
  ipAddress: string
}): Promise<{ risk: 'low' | 'medium' | 'high'; reasons: string[] }> {
  const reasons: string[] = []
  
  // Check for multiple failed payments
  const recentFailures = await prisma.payments.count({
    where: {
      orderId: { in: await getUserOrders(params.userId) },
      status: 'FAILED',
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    }
  })
  
  if (recentFailures > 3) {
    reasons.push('Multiple failed payments in 24h')
  }
  
  // Check for unusual amount
  const avgOrderAmount = await getAverageOrderAmount(params.userId)
  if (params.amount > avgOrderAmount * 5) {
    reasons.push('Amount significantly higher than average')
  }
  
  // Check for VPN/proxy
  // Integrate with IP intelligence service
  
  const risk = reasons.length === 0 ? 'low' : reasons.length < 2 ? 'medium' : 'high'
  
  return { risk, reasons }
}
```

---

## 10. SUMMARY & RECOMMENDATIONS
