import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { productCategorySchema } from '@/lib/validations/product'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const isActive = searchParams.get('isActive')
    
    const categories = await prisma.productCategory.findMany({
      where: isActive ? { isActive: isActive === 'true' } : undefined,
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' }
    })
    
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.userType !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const data = productCategorySchema.parse(body)
    
    const existing = await prisma.productCategory.findUnique({
      where: { slug: data.slug }
    })
    
    if (existing) {
      return NextResponse.json({ error: 'Category with this slug already exists' }, { status: 400 })
    }
    
    const category = await prisma.productCategory.create({ data })
    return NextResponse.json(category, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create category' }, { status: 400 })
  }
}
