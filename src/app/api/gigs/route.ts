import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiService } from '@/lib/api.service'
import { sanitizeCategory } from '@/utils/categoryValidation'

export async function GET(request: NextRequest) {
  return ApiService.handleRequest(async () => {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (id) {
      const gig = await prisma.gigs.findUnique({
        where: { id },
        include: {
          users: { select: { id: true, name: true, email: true } }
        }
      })
      
      if (!gig) throw new Error('Gig not found')
      return gig
    }
    
    return await prisma.gigs.findMany({
      where: { isActive: true },
      include: {
        users: { select: { id: true, name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
  }, 'Failed to fetch gigs')
}

export async function POST(request: NextRequest) {
  return ApiService.handleRequest(async () => {
    const session = await ApiService.validateAuth(['FREELANCER', 'AGENCY', 'ADMIN'])
    const data = await request.json()
    
    ApiService.validateRequired(data, ['title', 'description', 'category', 'price'])
    
    if (ApiService.parseNumber(data.price) <= 0) {
      throw new Error('Price must be greater than 0')
    }
    
    const gig = await prisma.gigs.create({
      data: {
        title: ApiService.sanitizeString(data.title),
        description: ApiService.sanitizeString(data.description),
        category: sanitizeCategory(data.category),
        subcategory: ApiService.sanitizeString(data.subcategory) || null,
        price: ApiService.parseNumber(data.price),
        deliveryTime: ApiService.parseNumber(data.deliveryTime, 3),
        tags: ApiService.parseArray(data.tags),
        images: ApiService.parseArray(data.images),
        sellerId: session.user.id,
        isActive: true
      },
      include: {
        users: { select: { id: true, name: true, email: true } }
      }
    })
    
    return { success: true, gig }
  }, 'Failed to create gig')
}

export async function PUT(request: NextRequest) {
  return ApiService.handleRequest(async () => {
    const session = await ApiService.validateAuth()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) throw new Error('Gig ID is required')
    
    const existingGig = await prisma.gigs.findUnique({
      where: { id },
      select: { sellerId: true }
    })
    
    if (!existingGig) throw new Error('Gig not found')
    
    if (existingGig.sellerId !== session.user.id && session.user.userType !== 'ADMIN') {
      throw new Error('Insufficient permissions')
    }
    
    const data = await request.json()
    
    return await prisma.gigs.update({
      where: { id },
      data,
      include: {
        users: { select: { id: true, name: true, email: true } }
      }
    })
  }, 'Failed to update gig')
}

export async function DELETE(request: NextRequest) {
  return ApiService.handleRequest(async () => {
    const session = await ApiService.validateAuth()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) throw new Error('Gig ID is required')
    
    const existingGig = await prisma.gigs.findUnique({
      where: { id },
      select: { sellerId: true }
    })
    
    if (!existingGig) throw new Error('Gig not found')
    
    if (existingGig.sellerId !== session.user.id && session.user.userType !== 'ADMIN') {
      throw new Error('Insufficient permissions')
    }

    await prisma.gigs.delete({ where: { id } })

    return { message: 'Gig deleted successfully' }
  }, 'Failed to delete gig')
}