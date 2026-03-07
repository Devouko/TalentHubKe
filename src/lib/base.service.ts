import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { ValidationError, AuthenticationError, NotFoundError } from '@/app/types/api.types'
import { logger, logError, logPerformance } from './logger'
import { trackError, trackEvent } from './error-tracking'

export abstract class BaseService {
  protected static readonly ID_GENERATORS = {
    order: () => `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    payment: () => `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    user: () => `USER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  protected static async executeWithTracking<T>(
    operation: string,
    fn: () => Promise<T>,
    metadata: Record<string, any> = {}
  ): Promise<T> {
    const startTime = Date.now()
    const operationId = metadata.id || this.ID_GENERATORS.order()
    
    try {
      logger.info(`Starting ${operation}`, { operationId, ...metadata })
      trackEvent(`${operation}_started`, { operationId, ...metadata })
      
      const result = await fn()
      
      const duration = Date.now() - startTime
      logPerformance(operation, duration, { operationId })
      trackEvent(`${operation}_success`, { operationId, duration })
      
      return result
    } catch (error) {
      const errorMessage = `Failed ${operation}: ${error instanceof Error ? error.message : 'Unknown error'}`
      logError(error as Error, { operationId, operation })
      trackError(error as Error, { operationId, operation })
      throw new ValidationError(errorMessage)
    }
  }

  protected static validateRequired(fields: Record<string, any>): void {
    for (const [key, value] of Object.entries(fields)) {
      if (value === undefined || value === null || value === '') {
        throw new ValidationError(`${key} is required`)
      }
    }
  }

  protected static validateNumeric(fields: Record<string, any>): void {
    for (const [key, value] of Object.entries(fields)) {
      if (typeof value !== 'number' || value <= 0) {
        throw new ValidationError(`${key} must be a positive number`)
      }
    }
  }

  protected static async getOrCreateUser(phoneNumber?: string): Promise<string> {
    const session = await getServerSession(authOptions)
    let userId = session?.user?.id
    
    if (!userId && phoneNumber) {
      const guestEmail = `guest_${phoneNumber}@marketplace.com`
      
      let guestUser = await prisma.users.findUnique({ where: { email: guestEmail } })
      
      if (!guestUser) {
        try {
          guestUser = await prisma.users.create({
            data: {
              email: guestEmail,
              name: 'Guest User',
              userType: 'CLIENT',
              phoneNumber
            }
          })
        } catch (error) {
          guestUser = await prisma.users.findUnique({ where: { email: guestEmail } })
          if (!guestUser) throw error
        }
      }
      userId = guestUser.id
    }
    
    if (!userId) {
      throw new AuthenticationError('User authentication required')
    }
    
    return userId
  }

  protected static async validateProduct(productId: string): Promise<any> {
    const product = await prisma.products.findUnique({
      where: { id: productId, isActive: true }
    })
    
    if (!product) {
      throw new NotFoundError('Product not found')
    }
    
    return product
  }

  protected static validateStock(product: any, requestedQuantity: number): void {
    if (product.stock < requestedQuantity) {
      throw new ValidationError('Insufficient stock available')
    }
  }

  protected static formatOptionalFields<T extends Record<string, any>>(
    source: any,
    required: Partial<T>,
    optionalFields: string[]
  ): T {
    const formatted = { ...required } as T
    
    optionalFields.forEach(field => {
      if (source[field]) {
        formatted[field as keyof T] = source[field]
      }
    })
    
    return formatted
  }
}