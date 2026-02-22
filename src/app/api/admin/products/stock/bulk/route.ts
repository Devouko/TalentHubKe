import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { bulkStockUpdateSchema } from '@/lib/validations/product'
import { calculateStockStatus } from '@/lib/utils/product-helpers'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.userType !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { updates } = bulkStockUpdateSchema.parse(body)

    const results = { success: [], failed: [] }

    for (const update of updates) {
      try {
        const product = await prisma.product.findUnique({ where: { id: update.productId } })
        if (!product) {
          results.failed.push({ productId: update.productId, error: 'Product not found' })
          continue
        }

        const newQuantity = product.quantity + update.quantityChange
        if (newQuantity < 0) {
          results.failed.push({ productId: update.productId, error: 'Insufficient stock' })
          continue
        }

        const stockStatus = calculateStockStatus(newQuantity, product.lowStockThreshold)

        await prisma.$transaction([
          prisma.product.update({
            where: { id: update.productId },
            data: { quantity: newQuantity, stockStatus, updatedById: session.user.id }
          }),
          prisma.stockHistory.create({
            data: {
              productId: update.productId,
              changeType: update.changeType,
              quantityChange: update.quantityChange,
              previousQuantity: product.quantity,
              newQuantity,
              reason: update.reason,
              createdById: session.user.id
            }
          })
        ])

        results.success.push({ productId: update.productId })
      } catch (error: any) {
        results.failed.push({ productId: update.productId, error: error.message })
      }
    }

    return NextResponse.json(results)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to process bulk update' }, { status: 400 })
  }
}
