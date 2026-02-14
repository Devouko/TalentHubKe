import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')
    const orderId = searchParams.get('orderId')
    
    if (!conversationId && !orderId) {
      return NextResponse.json({ error: 'Conversation ID or Order ID required' }, { status: 400 })
    }

    let messages

    if (conversationId) {
      // Verify user is part of the conversation
      const conversation = await prisma.conversation.findFirst({
        where: {
          id: conversationId,
          OR: [
            { user1Id: session.user.id },
            { user2Id: session.user.id }
          ]
        }
      })

      if (!conversation) {
        return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
      }

      messages = await prisma.message.findMany({
        where: { conversationId },
        include: {
          sender: {
            select: { id: true, name: true, image: true }
          }
        },
        orderBy: { createdAt: 'asc' }
      })
    } else {
      // Order-based messages
      const order = await prisma.order.findFirst({
        where: {
          id: orderId,
          OR: [
            { buyerId: session.user.id },
            { gig: { sellerId: session.user.id } }
          ]
        }
      })

      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }

      messages = await prisma.message.findMany({
        where: { orderId },
        include: {
          sender: {
            select: { id: true, name: true, image: true }
          }
        },
        orderBy: { createdAt: 'asc' }
      })
    }

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Messages fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { conversationId, orderId, content, attachments } = await request.json()
    
    if (!content?.trim()) {
      return NextResponse.json({ error: 'Content required' }, { status: 400 })
    }

    if (!conversationId && !orderId) {
      return NextResponse.json({ error: 'Conversation ID or Order ID required' }, { status: 400 })
    }

    let message

    if (conversationId) {
      // Verify user is part of the conversation
      const conversation = await prisma.conversation.findFirst({
        where: {
          id: conversationId,
          OR: [
            { user1Id: session.user.id },
            { user2Id: session.user.id }
          ]
        }
      })

      if (!conversation) {
        return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
      }

      message = await prisma.message.create({
        data: {
          conversationId,
          senderId: session.user.id,
          content: content.trim(),
          attachments: attachments || []
        },
        include: {
          sender: {
            select: { id: true, name: true, image: true }
          }
        }
      })

      // Update conversation timestamp
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { lastMessageAt: new Date() }
      })

      // Create notification for other user
      const otherUserId = conversation.user1Id === session.user.id ? conversation.user2Id : conversation.user1Id
      await prisma.notification.create({
        data: {
          userId: otherUserId,
          title: 'New Message',
          message: `${session.user.name} sent you a message`,
          type: 'MESSAGE',
          entityId: conversationId,
          entityType: 'conversation'
        }
      })
    } else {
      // Order-based message
      const order = await prisma.order.findFirst({
        where: {
          id: orderId,
          OR: [
            { buyerId: session.user.id },
            { gig: { sellerId: session.user.id } }
          ]
        },
        include: { gig: true }
      })

      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }

      message = await prisma.message.create({
        data: {
          orderId,
          senderId: session.user.id,
          content: content.trim(),
          attachments: attachments || []
        },
        include: {
          sender: {
            select: { id: true, name: true, image: true }
          }
        }
      })

      // Create notification for other party
      const otherUserId = order.buyerId === session.user.id ? order.gig?.sellerId : order.buyerId
      if (otherUserId) {
        await prisma.notification.create({
          data: {
            userId: otherUserId,
            title: 'Order Message',
            message: `New message for order #${orderId.slice(-8)}`,
            type: 'MESSAGE',
            entityId: orderId,
            entityType: 'order'
          }
        })
      }
    }

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('Message creation error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}