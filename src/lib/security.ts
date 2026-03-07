import { NextRequest, NextResponse } from 'next/server'
import { logger } from './logger'

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export class SecurityMiddleware {
  // Rate limiting
  static rateLimit(windowMs: number = 60000, maxRequests: number = 100) {
    return (req: NextRequest) => {
      const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
      const key = `${ip}:${req.nextUrl.pathname}`
      const now = Date.now()
      
      const record = rateLimitStore.get(key)
      
      if (!record || now > record.resetTime) {
        rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
        return true
      }
      
      if (record.count >= maxRequests) {
        logger.warn('Rate limit exceeded', { ip, path: req.nextUrl.pathname })
        return false
      }
      
      record.count++
      return true
    }
  }

  // Input sanitization
  static sanitizeInput(input: any): any {
    if (typeof input === 'string') {
      return input
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/<[^>]*>/g, '')
        .trim()
    }
    
    if (Array.isArray(input)) {
      return input.map(item => this.sanitizeInput(item))
    }
    
    if (typeof input === 'object' && input !== null) {
      const sanitized: any = {}
      for (const [key, value] of Object.entries(input)) {
        sanitized[key] = this.sanitizeInput(value)
      }
      return sanitized
    }
    
    return input
  }

  // SQL injection prevention
  static validateSqlInput(input: string): boolean {
    const sqlPatterns = [
      /('|(--)|(\;)|(\||\|)|(\*|\*))/i,
      /(union|select|insert|delete|update|drop|create|alter|exec|execute)/i
    ]
    
    return !sqlPatterns.some(pattern => pattern.test(input))
  }

  // CSRF token validation
  static validateCsrfToken(req: NextRequest): boolean {
    const token = req.headers.get('x-csrf-token')
    const sessionToken = req.cookies.get('csrf-token')?.value
    
    if (!token || !sessionToken) {
      return false
    }
    
    return token === sessionToken
  }

  // Request validation middleware
  static validateRequest(req: NextRequest): NextResponse | null {
    // Check rate limiting
    const rateLimiter = this.rateLimit(60000, 100)
    if (!rateLimiter(req)) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    // Validate content type for POST requests
    if (req.method === 'POST') {
      const contentType = req.headers.get('content-type')
      if (!contentType?.includes('application/json')) {
        return NextResponse.json(
          { error: 'Invalid content type' },
          { status: 400 }
        )
      }
    }

    // Log suspicious activity
    const userAgent = req.headers.get('user-agent')
    if (!userAgent || userAgent.length < 10) {
      logger.warn('Suspicious request - missing or short user agent', {
        ip: req.ip,
        path: req.nextUrl.pathname,
        userAgent
      })
    }

    return null
  }

  // Clean up rate limit store periodically
  static cleanupRateLimit() {
    const now = Date.now()
    const entries = Array.from(rateLimitStore.entries())
    for (const [key, record] of entries) {
      if (now > record.resetTime) {
        rateLimitStore.delete(key)
      }
    }
  }
}

// Cleanup interval (run every 5 minutes)
if (typeof window === 'undefined') {
  setInterval(() => {
    SecurityMiddleware.cleanupRateLimit()
  }, 5 * 60 * 1000)
}
