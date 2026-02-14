import { NextResponse } from 'next/server'
import { ValidationError, AuthenticationError, NotFoundError } from '@/app/types/api.types'
import { logError } from './logger'
import { trackError } from './error-tracking'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export class ApiUtils {
  static success<T>(data: T, message?: string): NextResponse<ApiResponse<T>> {
    return NextResponse.json({
      success: true,
      data,
      message
    })
  }

  static error(error: string | Error, status: number = 400): NextResponse<ApiResponse> {
    const message = error instanceof Error ? error.message : error
    
    return NextResponse.json({
      success: false,
      error: message
    }, { status })
  }

  static handleError(error: unknown): NextResponse<ApiResponse> {
    console.error('API Error:', error)
    
    if (error instanceof ValidationError) {
      return this.error(error.message, 400)
    }
    
    if (error instanceof AuthenticationError) {
      return this.error(error.message, 401)
    }
    
    if (error instanceof NotFoundError) {
      return this.error(error.message, 404)
    }
    
    if (error instanceof Error) {
      logError(error)
      trackError(error)
      return this.error(error.message, 400)
    }
    
    return this.error('Internal server error', 500)
  }

  static async withErrorHandling<T>(
    operation: () => Promise<T>
  ): Promise<NextResponse<ApiResponse<T>>> {
    try {
      const result = await operation()
      return this.success(result)
    } catch (error) {
      return this.handleError(error)
    }
  }

  static validateRequest(data: any, requiredFields: string[]): void {
    for (const field of requiredFields) {
      if (!data[field]) {
        throw new ValidationError(`${field} is required`)
      }
    }
  }

  static validateCartData(items: any[], phoneNumber?: string): void {
    if (!items || items.length === 0) {
      throw new ValidationError('Cart is empty')
    }

    if (!phoneNumber) {
      throw new ValidationError('Phone number required')
    }

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    
    if (total <= 0) {
      throw new ValidationError('Invalid cart total')
    }
  }
}