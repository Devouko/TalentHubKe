import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { items, phoneNumber, shippingAddress } = await request.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    if (!phoneNumber) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })
    }

    const phoneRegex = /^(254|0)[17]\d{8}$/
    const cleanPhone = phoneNumber.replace(/\s/g, '')
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json({ error: 'Invalid Kenyan phone number' }, { status: 400 })
    }

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    if (total <= 0) {
      return NextResponse.json({ error: 'Invalid order total' }, { status: 400 })
    }

    const productIds = items.map(item => item.id || item.productId)
    const products = await prisma.products.findMany({
      where: { id: { in: productIds } },
      select: { id: true, stock: true, price: true, title: true }
    })

    // Validate stock for real products only (skip mock products)
    for (const item of items) {
      const productId = item.id || item.productId
      const product = products.find(p => p.id === productId)
      
      // Skip validation for mock products (IDs starting with 'mock-')
      if (productId.startsWith('mock-')) {
        console.log(`Skipping stock validation for mock product: ${productId}`)
        continue
      }
      
      if (!product) {
        return NextResponse.json({ 
          error: `Product ${item.title} not found` 
        }, { status: 404 })
      }
      if (product.stock < item.quantity) {
        return NextResponse.json({ 
          error: `Insufficient stock for ${product.title}` 
        }, { status: 400 })
      }
    }

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.orders.create({
        data: {
          id: randomUUID(),
          buyerId: session.user.id,
          totalAmount: total,
          status: 'PENDING',
          phoneNumber: cleanPhone,
          items: JSON.stringify(items),
          requirements: shippingAddress || 'Digital delivery',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })

      for (const item of items) {
        const productId = item.id || item.productId
        // Skip stock updates for mock products
        if (!productId.startsWith('mock-')) {
          await tx.products.update({
            where: { id: productId },
            data: { stock: { decrement: item.quantity } }
          })
        }
      }

      await tx.cart.deleteMany({
        where: { userId: session.user.id }
      })

      return newOrder
    })

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt
      },
      message: 'Order created successfully'
    })
  } catch (error: any) {
    console.error('Checkout error:', error)
    console.error('Error stack:', error.stack)
    return NextResponse.json({ 
      error: 'Failed to process checkout',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}