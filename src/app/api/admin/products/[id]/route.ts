import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { updateProductSchema } from '@/lib/validations/product'
import { calculateStockStatus } from '@/lib/utils/product-helpers'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.userType !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const product = await prisma.products.findFirst({
      where: { id: params.id, deletedAt: null },
      include: {
        category: true,
        images: { orderBy: { position: 'asc' } },
        createdBy: { select: { id: true, name: true, email: true } },
        updatedBy: { select: { id: true, name: true, email: true } },
        stockHistory: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            createdBy: { select: { id: true, name: true, email: true } }
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.userType !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validated = updateProductSchema.parse(body)

    const existing = await prisma.products.findFirst({
      where: { id: params.id, deletedAt: null }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    if (validated.sku) {
      const skuExists = await prisma.products.findFirst({
        where: { sku: validated.sku, NOT: { id: params.id } }
      })
      if (skuExists) {
        return NextResponse.json({ error: 'SKU already exists' }, { status: 400 })
      }
    }

    if (validated.slug) {
      const slugExists = await prisma.products.findFirst({
        where: { slug: validated.slug, NOT: { id: params.id } }
      })
      if (slugExists) {
        return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
      }
    }

    const updateData: any = {
      ...validated,
      updatedById: session.user.id
    }

    if (validated.quantity !== undefined && validated.quantity !== existing.quantity) {
      updateData.stockStatus = calculateStockStatus(
        validated.quantity,
        validated.lowStockThreshold || existing.lowStockThreshold
      )

      await prisma.stockHistory.create({
        data: {
          productId: params.id,
          changeType: 'ADJUSTMENT',
          quantityChange: validated.quantity - existing.quantity,
          previousQuantity: existing.quantity,
          newQuantity: validated.quantity,
          reason: 'Product update',
          createdById: session.user.id
        }
      })
    }

    if (validated.images) {
      await prisma.productImage.deleteMany({
        where: { productId: params.id }
      })
      updateData.images = {
        create: validated.images
      }
    }

    const product = await prisma.products.update({
      where: { id: params.id },
      data: updateData,
      include: {
        category: true,
        images: true
      }
    })

    return NextResponse.json(product)
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.userType !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.products.update({
      where: { id: params.id },
      data: {
        deletedAt: new Date(),
        isActive: false
      }
    })

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
