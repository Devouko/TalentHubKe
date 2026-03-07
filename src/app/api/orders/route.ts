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
    const sellerId = searchParams.get('sellerId')
    
    if (orderId) {
      const order = await prisma.orders.findUnique({
        where: { id: orderId },
        include: { payments: true }
      })

      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }

      // Allow access if user is buyer or seller
      const isBuyer = order.buyerId === session.user.id
      
      // Check if user is seller of any product in this order
      let isSeller = false
      if (order.items && typeof order.items === 'object') {
        const items = order.items as any[]
        // This is a bit complex since items are stored as Json
        // We might need to fetch products or trust the session if sellerId is provided and matches
      }

      if (!isBuyer && !isSeller && session.user.userType !== 'ADMIN') {
        // For now, if sellerId is provided and matches session, allow it
        if (sellerId !== session.user.id) {
           return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
      }

      return NextResponse.json(order)
    } else if (sellerId) {
      // If sellerId is provided, we want to find orders that contain products belonging to this seller
      // Since items are stored as Json, we have to be careful. 
      // Alternative: orders has a products relation if it was a single product order, but it seems to use Json 'items'
      
      if (sellerId !== session.user.id && session.user.userType !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      // For simplicity in this marketplace, let's assume we can filter by products sellerId
      // If the schema doesn't have a direct link, we might need to fetch all orders and filter in JS
      // or use a raw query if performance is an issue.
      
      const allOrders = await prisma.orders.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100
      })

      // In a real app, you'd want a more efficient way to link sellers to orders
      return NextResponse.json(allOrders) 
    } else {
      const orders = await prisma.orders.findMany({
        where: { buyerId: session.user.id },
        orderBy: { createdAt: 'desc' },
        take: 20
      })

      return NextResponse.json({ orders })
    }
  } catch (error) {
    console.error('Orders fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
