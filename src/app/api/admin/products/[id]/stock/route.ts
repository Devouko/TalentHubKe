import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { stockAdjustmentSchema } from '@/lib/validations/product'
import { calculateStockStatus, validateStockAdjustment } from '@/lib/utils/product-helpers'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.userType !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const product = await prisma.product.findUnique({ where: { id: params.id } })
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const body = await req.json()
    const data = stockAdjustmentSchema.parse(body)

    const newQuantity = product.quantity + data.quantityChange
    if (newQuantity < 0) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 })
    }

    const stockStatus = calculateStockStatus(newQuantity, product.lowStockThreshold)

    const [updatedProduct] = await prisma.$transaction([
      prisma.product.update({
        where: { id: params.id },
        data: {
          quantity: newQuantity,
          stockStatus,
          updatedById: session.user.id
        },
        include: { category: true, images: true }
      }),
      prisma.stockHistory.create({
        data: {
          productId: params.id,
          changeType: data.changeType,
          quantityChange: data.quantityChange,
          previousQuantity: product.quantity,
          newQuantity,
          reason: data.reason,
          notes: data.notes,
          createdById: session.user.id
        }
      })
    ])

    return NextResponse.json(updatedProduct)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to adjust stock' }, { status: 400 })
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 20

    const [history, total] = await Promise.all([
      prisma.stockHistory.findMany({
        where: { productId: params.id },
        include: { createdBy: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.stockHistory.count({ where: { productId: params.id } })
    ])

    return NextResponse.json({
      history,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stock history' }, { status: 500 })
  }
}
