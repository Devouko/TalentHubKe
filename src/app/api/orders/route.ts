import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { ApiUtils } from '@/lib/api.utils'
import { BaseService } from '@/lib/base.service'
import { PerformanceService } from '@/lib/performance.service'

export async function POST(request: NextRequest) {
  return ApiUtils.withErrorHandling(async () => {
    const { items, total, shippingAddress, phoneNumber } = await request.json()

    ApiUtils.validateRequest({ items, total, phoneNumber }, ['items', 'total', 'phoneNumber'])
    ApiUtils.validateCartData(items, phoneNumber)

    const userId = await BaseService.getOrCreateUser(phoneNumber)
    
    const order = await prisma.order.create({
      data: {
        id: BaseService.ID_GENERATORS.order(),
        buyerId: userId,
        totalAmount: total,
        status: 'PENDING',
        phoneNumber,
        items: items,
        requirements: shippingAddress || 'Digital delivery'
      }
    })

    PerformanceService.clearCache('orders')

    return {
      id: order.id,
      items,
      totalAmount: order.totalAmount,
      shippingAddress: order.requirements,
      phoneNumber: order.phoneNumber,
      status: order.status,
      createdAt: order.createdAt.toISOString()
    }
  })
}

export async function GET(request: NextRequest) {
  return ApiUtils.withErrorHandling(async () => {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('id')
    
    if (orderId) {
      return PerformanceService.withCache(`order_${orderId}`, async () => {
        const order = await prisma.order.findUnique({
          where: { id: orderId, buyerId: session.user.id },
          include: { payments: true }
        })

        if (!order) {
          return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        return order
      }, 2)
    } else {
      return PerformanceService.withCache(`orders_${session.user.id}`, async () => {
        return prisma.order.findMany({
          where: { buyerId: session.user.id },
          orderBy: { createdAt: 'desc' },
          take: 20,
          select: {
            id: true,
            totalAmount: true,
            status: true,
            createdAt: true,
            phoneNumber: true,
            items: true,
            gig: { select: { title: true } },
            review: { select: { id: true, rating: true, comment: true } }
          }
        })
      }, 1)
    }
  })
}