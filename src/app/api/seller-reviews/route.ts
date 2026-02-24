import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createSellerReviewSchema = z.object({
  sellerId: z.string(),
  orderId: z.string().optional(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get('sellerId');
    const reviewerId = searchParams.get('reviewerId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const where: any = {};
    if (sellerId) where.sellerId = sellerId;
    if (reviewerId) where.reviewerId = reviewerId;

    const [reviews, total] = await Promise.all([
      prisma.seller_reviews.findMany({
        where,
        include: {
          users_seller_reviews_reviewerIdTousers: { select: { id: true, name: true, image: true } },
          users_seller_reviews_sellerIdTousers: { select: { id: true, name: true, image: true } },
          orders: { select: { id: true, status: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.seller_reviews.count({ where }),
    ]);

    return NextResponse.json({
      reviews,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch seller reviews' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const data = createSellerReviewSchema.parse(body);

    if (data.orderId) {
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
    }

    const review = await prisma.seller_reviews.create({
      data: {
        id: `srev_${Date.now()}`,
        sellerId: data.sellerId,
        reviewerId: session.user.id,
        orderId: data.orderId,
        rating: data.rating,
        comment: data.comment,
      },
      include: {
        users_seller_reviews_reviewerIdTousers: { select: { id: true, name: true, image: true } },
        users_seller_reviews_sellerIdTousers: { select: { id: true, name: true, image: true } },
      },
    });

    const stats = await prisma.seller_reviews.aggregate({
      where: { sellerId: data.sellerId },
      _avg: { rating: true },
      _count: true,
    });

    await prisma.users.update({
      where: { id: data.sellerId },
      data: {
        sellerRating: stats._avg.rating || 0,
        sellerReviewCount: stats._count,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create seller review' }, { status: 500 });
  }
}
