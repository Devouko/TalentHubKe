import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { userId } = await request.json()
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    if (userId === session.user.id) {
      return NextResponse.json({ error: 'Cannot create conversation with yourself' }, { status: 400 })
    }

    // Check if conversation already exists
    const existing = await prisma.conversations.findFirst({
      where: {
        OR: [
          { user1Id: session.user.id, user2Id: userId },
          { user1Id: userId, user2Id: session.user.id }
        ]
      }
    })

    if (existing) {
      return NextResponse.json({ conversationId: existing.id })
    }

    // Create new conversation
    const conversation = await prisma.conversations.create({
      data: {
        id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user1Id: session.user.id,
        user2Id: userId,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ conversationId: conversation.id })

  } catch (error) {
    console.error('Conversation creation error:', error)
    return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const conversations = await prisma.conversations.findMany({
      where: {
        OR: [
          { user1Id: session.user.id },
          { user2Id: session.user.id }
        ]
      },
      include: {
        users_conversations_user1IdTousers: { select: { id: true, name: true, profileImage: true } },
        users_conversations_user2IdTousers: { select: { id: true, name: true, profileImage: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    // Format the response to match the expected structure
    const formattedConversations = conversations.map(conv => {
      const otherUser = conv.user1Id === session.user.id 
        ? conv.users_conversations_user2IdTousers 
        : conv.users_conversations_user1IdTousers

      return {
        id: conv.id,
        otherUser: {
          id: otherUser?.id || '',
          name: otherUser?.name || 'Unknown User',
          image: otherUser?.profileImage || null
        },
        lastMessage: conv.messages[0] ? {
          content: conv.messages[0].content,
          createdAt: conv.messages[0].createdAt.toISOString(),
          senderId: conv.messages[0].senderId
        } : null,
        updatedAt: conv.updatedAt.toISOString()
      }
    })

    return NextResponse.json(formattedConversations)

  } catch (error) {
    console.error('Conversations fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 })
  }
}
