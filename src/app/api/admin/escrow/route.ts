import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.userType !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const escrowTransactions = await prisma.order.findMany({
      where: {
        status: { in: ['PENDING', 'IN_PROGRESS', 'DELIVERED'] }
      },
      include: {
        buyer: { select: { name: true, email: true } },
        gig: { 
          select: { 
            title: true, 
            seller: { select: { name: true, email: true } }
          } 
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    const escrowSummary = await prisma.order.groupBy({
      by: ['status'],
      _sum: { totalAmount: true },
      _count: true,
      where: {
        status: { in: ['PENDING', 'IN_PROGRESS', 'DELIVERED', 'DISPUTED'] }
      }
    });

    return NextResponse.json({
      transactions: escrowTransactions,
      summary: escrowSummary
    });
  } catch (error) {
    console.error('Error fetching escrow data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.userType !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId, action } = await request.json();

    let updateData = {};
    if (action === 'release') {
      updateData = { status: 'COMPLETED' };
    } else if (action === 'dispute') {
      updateData = { status: 'DISPUTED' };
    } else if (action === 'cancel') {
      updateData = { status: 'CANCELLED' };
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating escrow:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}