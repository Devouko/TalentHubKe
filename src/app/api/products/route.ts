import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sanitizeCategory } from '@/utils/categoryValidation'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const sellerId = searchParams.get('sellerId')
    
    let whereClause: any = { isActive: true }
    
    if (category && category !== 'All') {
      whereClause.category = sanitizeCategory(category)
    }

    if (sellerId) {
      whereClause.sellerId = sellerId
      // When filtering by sellerId, we might want to see inactive products too (for the seller dashboard)
      delete whereClause.isActive
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
        isActive: true,
        sellerId: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    }).catch(err => {
      console.error('Prisma error:', err)
      return []
    })
    
    return NextResponse.json({ products })
  } catch (error: any) {
    console.error('[PRODUCTS_GET] Error:', error)
    return NextResponse.json(
      { products: [] },
      { status: 200 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, price, comparePrice, category, stock, shippingTime, tags, features } = body

    const product = await prisma.products.create({
      data: {
        sellerId: session.user.id,
        title,
        description,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        category,
        stock: parseInt(stock) || 0,
        shippingTime: parseInt(shippingTime) || 3,
        tags: tags || [],
        features: features || [],
        images: [],
        isActive: true
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error('[PRODUCTS_POST] Error:', error?.message)
    return NextResponse.json(
      { error: error?.message || 'Failed to create product' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    const product = await prisma.products.findUnique({
      where: { id },
      select: { sellerId: true }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    if (product.sellerId !== session.user.id && session.user.userType !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await prisma.products.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[PRODUCTS_DELETE] Error:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
