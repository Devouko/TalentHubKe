import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { productCategorySchema } from '@/lib/validations/product'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const category = await prisma.productCategory.findUnique({
      where: { id: params.id },
      include: { _count: { select: { products: true } } }
    })
    
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }
    
    return NextResponse.json(category)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.userType !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const data = productCategorySchema.partial().parse(body)
    
    if (data.slug) {
      const existing = await prisma.productCategory.findFirst({
        where: { slug: data.slug, NOT: { id: params.id } }
      })
      if (existing) {
        return NextResponse.json({ error: 'Slug already in use' }, { status: 400 })
      }
    }
    
    const category = await prisma.productCategory.update({
      where: { id: params.id },
      data
    })
    
    return NextResponse.json(category)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update category' }, { status: 400 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.userType !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const productCount = await prisma.product.count({
      where: { categoryId: params.id }
    })
    
    if (productCount > 0) {
      return NextResponse.json({ error: 'Cannot delete category with products' }, { status: 400 })
    }
    
    await prisma.productCategory.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
