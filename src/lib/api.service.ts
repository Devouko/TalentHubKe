import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export class ApiService {
  static async validateAuth(requiredTypes?: string[]) {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      throw new Error('Authentication required')
    }

    if (requiredTypes && !requiredTypes.includes(session.user.userType)) {
      throw new Error('Insufficient permissions')
    }

    return session
  }

  static async handleRequest<T>(
    handler: () => Promise<T>,
    errorMessage = 'Operation failed'
  ): Promise<NextResponse> {
    try {
      const result = await handler()
      return NextResponse.json(result)
    } catch (error) {
      console.error(`API Error: ${errorMessage}`, error)
      
      if (error instanceof Error) {
        const status = error.message.includes('Authentication') ? 401 :
                      error.message.includes('permissions') ? 403 :
                      error.message.includes('not found') ? 404 : 500
        
        return NextResponse.json({ error: error.message }, { status })
      }
      
      return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
  }

  static validateRequired(data: Record<string, any>, fields: string[]) {
    const missing = fields.filter(field => !data[field]?.toString().trim())
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`)
    }
  }

  static sanitizeString(value: any): string {
    return value?.toString().trim() || ''
  }

  static parseArray(value: any): string[] {
    if (Array.isArray(value)) return value
    if (typeof value === 'string') {
      return value.split(',').map(item => item.trim()).filter(Boolean)
    }
    return []
  }

  static parseNumber(value: any, defaultValue = 0): number {
    const parsed = parseFloat(value)
    return isNaN(parsed) ? defaultValue : parsed
  }
}