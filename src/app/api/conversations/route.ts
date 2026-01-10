import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all orders where user is either buyer or seller
    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { buyerId: session.user.id },
          { gig: { sellerId: session.user.id } }
        ]
      },
      include: {
        buyer: { select: { id: true, name: true, email: true } },
        gig: { 
          include: { 
            seller: { select: { id: true, name: true, email: true } } 
          } 
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    // Transform orders into conversations
    const conversations = orders.map(order => {
      const otherUser = order.buyerId === session.user.id 
        ? order.gig.seller 
        : order.buyer;
      
      const lastMessage = order.messages[0];
      
      return {
        id: order.id,
        orderId: order.id,
        otherUser,
        lastMessage: lastMessage?.content || null,
        lastMessageTime: lastMessage?.createdAt || order.createdAt,
        gigTitle: order.gig.title
      };
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}