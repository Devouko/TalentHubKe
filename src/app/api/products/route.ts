import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { ApiUtils } from '@/lib/api.utils'
import { PerformanceService } from '@/lib/performance.service'

export async function GET(request: NextRequest) {
  return ApiUtils.withErrorHandling(async () => {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    
    const cacheKey = `products_${page}_${limit}_${category || 'all'}_${search || ''}`
    
    return PerformanceService.withCache(cacheKey, async () => {
      const where: any = { isActive: true }
      
      if (category && category !== 'all') {
        where.category = category
      }
      
      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      }
      
      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            images: true,
            category: true,
            rating: true,
            reviewCount: true,
            stock: true,
            isActive: true
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit
        }),
        prisma.product.count({ where })
      ])
      
      return {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    }, 3)
  })
}