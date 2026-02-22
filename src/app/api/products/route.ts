import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sanitizeCategory } from '@/utils/categoryValidation'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    let whereClause: any = { isActive: true }
    
    if (category && category !== 'All') {
      whereClause.category = sanitizeCategory(category)
    }

    const products = await prisma.products.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        stock: true,
        images: true,
        category: true,
        rating: true,
        reviewCount: true,
        isActive: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json({ products })
  } catch (error: any) {
    console.error('[PRODUCTS_GET] Error:', error?.message)
    return NextResponse.json(
      { products: [], error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
