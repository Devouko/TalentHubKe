import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createReviewSchema = z.object({
  gigId: z.string(),
  orderId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  images: z.array(z.string()).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const gigId = searchParams.get('gigId');
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const where: any = {};
    if (gigId) where.gigId = gigId;
    if (userId) where.reviewerId = userId;

    const [reviews, total] = await Promise.all([
      prisma.reviews.findMany({
        where,
        include: {
          users: { select: { id: true, name: true, image: true } },
          gigs: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.reviews.count({ where }),
    ]);

    return NextResponse.json({
      reviews,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const data = createReviewSchema.parse(body);

    const order = await prisma.orders.findUnique({
      where: { id: data.orderId },
      include: { gigs: true },
    });

    if (!order || order.buyerId !== session.user.id) {
      return NextResponse.json({ error: 'Invalid order' }, { status: 400 });
    }

    if (order.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'Order must be completed' }, { status: 400 });
    }

    const existingReview = await prisma.reviews.findUnique({
      where: { orderId: data.orderId },
    });

    if (existingReview) {
      return NextResponse.json({ error: 'Review already exists' }, { status: 400 });
    }

    const review = await prisma.reviews.create({
      data: {
        id: `rev_${Date.now()}`,
        reviewerId: session.user.id,
        gigId: data.gigId,
        orderId: data.orderId,
        rating: data.rating,
        comment: data.comment || '',
        images: data.images || [],
        isVerified: true,
      },
      include: {
        users: { select: { id: true, name: true, image: true } },
        gigs: { select: { id: true, title: true } },
      },
    });

    const stats = await prisma.reviews.aggregate({
      where: { gigId: data.gigId },
      _avg: { rating: true },
      _count: true,
    });

    await prisma.gigs.update({
      where: { id: data.gigId },
      data: {
        rating: stats._avg.rating || 0,
        reviewCount: stats._count,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
