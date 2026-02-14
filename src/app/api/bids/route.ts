import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { gigId, bidderId, amount, proposal, timeline } = await request.json();

    // Verify the bidder is the authenticated user
    if (bidderId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized to bid for another user' }, { status: 403 });
    }

    // Check if user can bid (not the gig owner)
    const gig = await prisma.gig.findUnique({
      where: { id: gigId },
      select: { sellerId: true, allowBidding: true }
    });

    if (!gig) {
      return NextResponse.json({ error: 'Gig not found' }, { status: 404 });
    }

    if (gig.sellerId === session.user.id) {
      return NextResponse.json({ error: 'Cannot bid on your own gig' }, { status: 403 });
    }

    if (!gig.allowBidding) {
      return NextResponse.json({ error: 'Bidding not allowed on this gig' }, { status: 403 });
    }

    if (!gigId || !bidderId || !amount || !proposal || !timeline) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (amount <= 0) {
      return NextResponse.json({ error: 'Bid amount must be greater than 0' }, { status: 400 });
    }

    if (timeline <= 0) {
      return NextResponse.json({ error: 'Timeline must be greater than 0 days' }, { status: 400 });
    }

    const bid = await prisma.bid.create({
      data: {
        gigId,
        bidderId,
        amount,
        proposal,
        timeline,
      },
      include: {
        bidder: { select: { name: true, image: true } },
        gig: { select: { title: true, sellerId: true } }
      }
    });

    // Create notification for gig owner
    await prisma.notification.create({
      data: {
        title: 'New Bid Received',
        message: `${bid.bidder.name} placed a bid on your gig "${bid.gig.title}"`,
        type: 'BID_RECEIVED',
        userId: bid.gig.sellerId,
        entityId: bid.id,
        entityType: 'bid'
      }
    });

    return NextResponse.json(bid);
  } catch (error) {
    console.error('Bid creation error:', error);
    return NextResponse.json({ error: 'Failed to create bid. Please try again.' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const gigId = searchParams.get('gigId');
    const userId = searchParams.get('userId');

    let bids;
    if (gigId) {
      // Verify user owns the gig to view its bids
      const gig = await prisma.gig.findUnique({
        where: { id: gigId },
        select: { sellerId: true }
      });

      if (!gig || gig.sellerId !== session.user.id) {
        return NextResponse.json({ error: 'Unauthorized to view bids for this gig' }, { status: 403 });
      }

      bids = await prisma.bid.findMany({
        where: { gigId },
        include: {
          bidder: { select: { name: true, image: true } },
          interview: true
        },
        orderBy: { createdAt: 'desc' }
      });
    } else if (userId) {
      // Users can only view their own bids
      if (userId !== session.user.id) {
        return NextResponse.json({ error: 'Unauthorized to view other users bids' }, { status: 403 });
      }

      bids = await prisma.bid.findMany({
        where: { bidderId: userId },
        include: {
          gig: { select: { title: true, seller: { select: { name: true } } } },
          interview: true
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      return NextResponse.json({ error: 'gigId or userId parameter required' }, { status: 400 });
    }

    return NextResponse.json(bids);
  } catch (error) {
    console.error('Bids fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch bids' }, { status: 500 });
  }
}