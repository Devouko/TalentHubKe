import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { items, total, shippingAddress, phoneNumber } = await request.json()

    if (!items || !total || !phoneNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create order
    const order = await prisma.orders.create({
      data: {
        id: randomUUID(),
        buyerId: session?.user?.id || 'guest',
        totalAmount: total,
        status: 'PENDING',
        phoneNumber,
        items: items,
        requirements: shippingAddress || 'Digital delivery',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt
      }
    })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create order' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('id')
    
    if (orderId) {
      const order = await prisma.orders.findUnique({
        where: { id: orderId, buyerId: session.user.id },
        include: { payments: true }
      })

      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }

      return NextResponse.json(order)
    } else {
      const orders = await prisma.orders.findMany({
        where: { buyerId: session.user.id },
        orderBy: { createdAt: 'desc' },
        take: 20
      })

      return NextResponse.json(orders)
    }
  } catch (error) {
    console.error('Orders fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
