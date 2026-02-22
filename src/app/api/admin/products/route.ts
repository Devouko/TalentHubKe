import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

const requireAdmin = async () => {
  const session = await getServerSession(authOptions)
  if (!session || session.user.userType !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return { user: session.user }
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
    
    // Map the form data to match the actual schema
    const productData = {
      title: body.name,
      description: body.description,
      price: Number(body.price),
      images: body.images?.map((img: any) => img.url) || [],
      category: body.categoryId || 'General',
      stock: Number(body.quantity) || 0,
      isActive: body.isActive ?? true,
      brand: body.brand || null,
      discountPercent: body.comparePrice ? Math.round(((Number(body.comparePrice) - Number(body.price)) / Number(body.comparePrice)) * 100) : null,
      discountPrice: body.comparePrice ? Number(body.comparePrice) : null,
      features: body.tags ? body.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
      sellerId: auth.user.id
    }

    const product = await prisma.products.create({
      data: productData
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
