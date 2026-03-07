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
      const conversation = await prisma.conversations.findFirst({
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

      messages = await prisma.messages.findMany({
        where: { conversationId },
        include: {
          users: {
            select: { id: true, name: true, profileImage: true }
          }
        },
        orderBy: { createdAt: 'asc' }
      })

      // Format messages to match expected structure
      const formattedMessages = messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        senderId: msg.senderId,
        createdAt: msg.createdAt.toISOString(),
        sender: {
          id: msg.users.id,
          name: msg.users.name || 'Unknown',
          image: msg.users.profileImage || null
        }
      }))

      return NextResponse.json(formattedMessages)
    } else if (orderId) {
      // Order-based messages
      const order = await prisma.orders.findFirst({
        where: {
          id: orderId,
          OR: [
            { buyerId: session.user.id },
            { gigs: { sellerId: session.user.id } }
          ]
        }
      })

      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }

      messages = await prisma.messages.findMany({
        where: { orderId },
        include: {
          users: {
            select: { id: true, name: true, profileImage: true }
          }
        },
        orderBy: { createdAt: 'asc' }
      })

      // Format messages
      const formattedMessages = messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        senderId: msg.senderId,
        createdAt: msg.createdAt.toISOString(),
        sender: {
          id: msg.users.id,
          name: msg.users.name || 'Unknown',
          image: msg.users.profileImage || null
        }
      }))

      return NextResponse.json(formattedMessages)
    }
    
    return NextResponse.json([])
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

    const { conversationId, orderId, content } = await request.json()
    
    if (!content?.trim()) {
      return NextResponse.json({ error: 'Content required' }, { status: 400 })
    }

    if (!conversationId && !orderId) {
      return NextResponse.json({ error: 'Conversation ID or Order ID required' }, { status: 400 })
    }

    let message

    if (conversationId) {
      // Verify user is part of the conversation
      const conversation = await prisma.conversations.findFirst({
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

      message = await prisma.messages.create({
        data: {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          conversationId,
          senderId: session.user.id,
          content: content.trim(),
          createdAt: new Date()
        },
        include: {
          users: {
            select: { id: true, name: true, profileImage: true }
          }
        }
      })

      // Update conversation timestamp
      await prisma.conversations.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() }
      })

      // Create notification for other user
      const otherUserId = conversation.user1Id === session.user.id ? conversation.user2Id : conversation.user1Id
      await prisma.notifications.create({
        data: {
          id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: otherUserId,
          title: 'New Message',
          message: `${session.user.name} sent you a message`,
          type: 'MESSAGE',
          createdAt: new Date()
        }
      }).catch(err => console.error('Notification creation failed:', err))

      // Format response
      return NextResponse.json({
        id: message.id,
        content: message.content,
        senderId: message.senderId,
        createdAt: message.createdAt.toISOString(),
        sender: {
          id: message.users.id,
          name: message.users.name || 'Unknown',
          image: message.users.profileImage || null
        }
      }, { status: 201 })
    } else if (orderId) {
      // Order-based message
      const order = await prisma.orders.findFirst({
        where: {
          id: orderId,
          OR: [
            { buyerId: session.user.id },
            { gigs: { sellerId: session.user.id } }
          ]
        },
        include: { gigs: true }
      })

      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }

      message = await prisma.messages.create({
        data: {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          orderId,
          senderId: session.user.id,
          content: content.trim(),
          createdAt: new Date()
        },
        include: {
          users: {
            select: { id: true, name: true, profileImage: true }
          }
        }
      })

      // Create notification for other party
      const otherUserId = order.buyerId === session.user.id ? order.gigs?.sellerId : order.buyerId
      if (otherUserId) {
        await prisma.notifications.create({
          data: {
            id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId: otherUserId,
            title: 'Order Message',
            message: `New message for order #${orderId.slice(-8)}`,
            type: 'MESSAGE',
            createdAt: new Date()
          }
        }).catch(err => console.error('Notification creation failed:', err))
      }

      // Format response
      return NextResponse.json({
        id: message.id,
        content: message.content,
        senderId: message.senderId,
        createdAt: message.createdAt.toISOString(),
        sender: {
          id: message.users.id,
          name: message.users.name || 'Unknown',
          image: message.users.profileImage || null
        }
      }, { status: 201 })
    }
    
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  } catch (error) {
    console.error('Message creation error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}