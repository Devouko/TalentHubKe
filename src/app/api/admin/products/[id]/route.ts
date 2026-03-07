import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

const requireAdmin = async () => {
  const session = await getServerSession(authOptions)
  if (!session || session.user.userType !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const userId = session.user.id || (session.user as any).userId || (session.user as any).sub
  if (!userId) {
    return NextResponse.json({ error: 'User ID not found' }, { status: 401 })
  }
  return { user: { ...session.user, id: userId } }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAdmin()
    if (auth instanceof NextResponse) return auth

    const product = await prisma.products.findUnique({
      where: { id: params.id },
      include: {
        users: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product, { status: 200 })
  } catch (error) {
    console.error('Get product error:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAdmin()
    if (auth instanceof NextResponse) return auth

    await prisma.products.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAdmin()
    if (auth instanceof NextResponse) return auth

    const body = await req.json()
    
    const updateData: Prisma.ProductsUpdateInput = {
      title: body.name,
      description: body.description,
      price: Number(body.price),
      images: body.images?.map((img: any) => img.url),
      category: body.categoryId,
      stock: Number(body.quantity),
      isActive: body.isActive ?? true,
      brand: body.brand || null,
      discountPercent: body.comparePrice 
        ? Math.round(((Number(body.comparePrice) - Number(body.price)) / Number(body.comparePrice)) * 100) 
        : null,
      discountPrice: body.comparePrice ? Number(body.comparePrice) : null,
      features: Array.isArray(body.tags) && body.tags.length > 0 ? body.tags : [],
      updatedAt: new Date()
    }

    const product = await prisma.products.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json(product, { status: 200 })
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}
