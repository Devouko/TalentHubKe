import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiService } from '@/lib/api.service'

export async function POST(request: NextRequest) {
  return ApiService.handleRequest(async () => {
    const session = await ApiService.validateAuth()
    const data = await request.json()
    
    // Check if user already has an application
    const existing = await prisma.sellerApplication.findUnique({
      where: { userId: session.user.id }
    })

    if (existing) {
      throw new Error('You have already submitted an application')
    }

    // Create application with proper field mapping
    const application = await prisma.sellerApplication.create({
      data: {
        userId: session.user.id,
        businessName: ApiService.sanitizeString(data.businessName) || 'Individual Freelancer',
        skills: ApiService.parseArray(data.skills),
        experience: ApiService.sanitizeString(data.experience),
        portfolio: ApiService.parseArray(data.portfolio),
        description: ApiService.sanitizeString(data.description),
        status: 'PENDING'
      }
    })

    // Update user seller status
    await prisma.user.update({
      where: { id: session.user.id },
      data: { sellerStatus: 'PENDING' }
    })

    return { success: true, application }
  }, 'Failed to submit seller application')
}

export async function GET(request: NextRequest) {
  return ApiService.handleRequest(async () => {
    await ApiService.validateAuth(['ADMIN'])

    return await prisma.sellerApplication.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }, 'Failed to fetch seller applications')
}