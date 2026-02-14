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

    const { gigId, questions, requirements, skills, experience, budget, timeline } = await request.json();

    // Verify user owns the gig
    const gig = await prisma.gig.findUnique({
      where: { id: gigId },
      select: { sellerId: true }
    });

    if (!gig) {
      return NextResponse.json({ error: 'Gig not found' }, { status: 404 });
    }

    if (gig.sellerId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized to modify this gig' }, { status: 403 });
    }

    const criteria = await prisma.interviewCriteria.upsert({
      where: { gigId },
      update: {
        questions,
        requirements,
        skills,
        experience,
        budget,
        timeline,
      },
      create: {
        gigId,
        questions,
        requirements,
        skills,
        experience,
        budget,
        timeline,
      }
    });

    return NextResponse.json(criteria);
  } catch (error) {
    console.error('Interview criteria error:', error);
    return NextResponse.json({ error: 'Failed to save criteria' }, { status: 500 });
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

    if (!gigId) {
      return NextResponse.json({ error: 'Gig ID required' }, { status: 400 });
    }

    // Verify user owns the gig or has bid on it
    const gig = await prisma.gig.findUnique({
      where: { id: gigId },
      select: { sellerId: true }
    });

    if (!gig) {
      return NextResponse.json({ error: 'Gig not found' }, { status: 404 });
    }

    const userBid = await prisma.bid.findFirst({
      where: { gigId, bidderId: session.user.id }
    });

    if (gig.sellerId !== session.user.id && !userBid) {
      return NextResponse.json({ error: 'Unauthorized to view criteria' }, { status: 403 });
    }

    const criteria = await prisma.interviewCriteria.findUnique({
      where: { gigId },
      include: {
        interviews: {
          include: {
            bid: {
              include: {
                bidder: { select: { name: true, image: true } }
              }
            }
          }
        }
      }
    });

    return NextResponse.json(criteria);
  } catch (error) {
    console.error('Fetch criteria error:', error);
    return NextResponse.json({ error: 'Failed to fetch criteria' }, { status: 500 });
  }
}