import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createProductSchema } from '@/lib/validations/product'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

const requireAdmin = async () => {
  const session = await getServerSession(authOptions)
  if (!session || session.user.userType !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const userId = session.user.id || (session.user as any).userId || (session.user as any).sub
  if (!userId) {
    return NextResponse.json({ error: 'User ID not found in session' }, { status: 401 })
  }
  return { user: { ...session.user, id: userId } }
}

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin()
    if (auth instanceof NextResponse) return auth

    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const isActive = searchParams.get('isActive')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = {}
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (category) {
      where.category = category
    }
    
    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true'
    }

    const [products, total] = await Promise.all([
      prisma.products.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          users: {
            select: { id: true, name: true, email: true }
          }
        }
      }),
      prisma.products.count({ where })
    ])

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin()
    if (auth instanceof NextResponse) return auth

    const body = await req.json()
    const validatedData = createProductSchema.parse(body)
    
    const now = new Date()
    const productData: Prisma.ProductsCreateInput = {
      id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: validatedData.name,
      description: validatedData.description,
      price: Number(validatedData.price),
      images: validatedData.images.map(img => img.url),
      category: validatedData.categoryId,
      stock: Number(validatedData.quantity),
      isActive: validatedData.isActive ?? true,
      brand: validatedData.brand || null,
      discountPercent: validatedData.comparePrice 
        ? Math.round(((Number(validatedData.comparePrice) - Number(validatedData.price)) / Number(validatedData.comparePrice)) * 100) 
        : null,
      discountPrice: validatedData.comparePrice ? Number(validatedData.comparePrice) : null,
      features: Array.isArray(validatedData.tags) && validatedData.tags.length > 0 ? validatedData.tags : [],
      sellerId: auth.user.id,
      createdAt: now,
      updatedAt: now
    }

    const product = await prisma.products.create({
      data: productData,
      include: {
        users: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: error.errors 
      }, { status: 400 })
    }
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json({ 
          error: 'Product with this name already exists' 
        }, { status: 409 })
      }
      if (error.code === 'P2003') {
        return NextResponse.json({ 
          error: 'Invalid seller ID or foreign key constraint failed' 
        }, { status: 400 })
      }
    }
    
    console.error('Product creation error:', error)
    return NextResponse.json({ 
      error: 'Failed to create product',
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined
    }, { status: 500 })
  }
}
