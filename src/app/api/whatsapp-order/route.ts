import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const { items, phoneNumber, message } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Cart is empty' }, { status: 400 })
    }

    if (!phoneNumber) {
      return NextResponse.json({ success: false, error: 'Phone number required' }, { status: 400 })
    }

    const total = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)

    // Use authenticated user or create guest user
    let userId = session?.user?.id
    
    if (!userId) {
      let guestUser = await prisma.user.findFirst({ 
        where: { email: `whatsapp_${phoneNumber}@marketplace.com` } 
      })
      
      if (!guestUser) {
        guestUser = await prisma.user.create({
          data: {
            email: `whatsapp_${phoneNumber}@marketplace.com`,
            name: 'WhatsApp Customer',
            userType: 'CLIENT',
            phoneNumber
          }
        })
      }
      userId = guestUser.id
    }

    // Create order for WhatsApp
    const order = await prisma.order.create({
      data: {
        buyerId: userId,
        totalAmount: total,
        status: 'PENDING',
        phoneNumber,
        items: items,
        requirements: `WhatsApp Order: ${message || 'Order placed via WhatsApp'}`
      }
    })

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        items,
        totalAmount: order.totalAmount,
        phoneNumber: order.phoneNumber,
        status: order.status,
        createdAt: order.createdAt.toISOString()
      },
      message: 'WhatsApp order created successfully'
    })

  } catch (error) {
    console.error('WhatsApp order error:', error)
    return NextResponse.json({ success: false, error: 'Failed to create WhatsApp order' }, { status: 500 })
  }
}
