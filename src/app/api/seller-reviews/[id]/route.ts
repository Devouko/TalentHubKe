import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateSellerReviewSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const review = await prisma.seller_reviews.findUnique({
      where: { id: params.id },
      include: {
        users_seller_reviews_reviewerIdTousers: { select: { id: true, name: true, image: true } },
        users_seller_reviews_sellerIdTousers: { select: { id: true, name: true, image: true } },
        orders: { select: { id: true, status: true } },
      },
    });

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json(review);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch review' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const review = await prisma.seller_reviews.findUnique({
      where: { id: params.id },
    });

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    if (review.reviewerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const data = updateSellerReviewSchema.parse(body);

    const updated = await prisma.seller_reviews.update({
      where: { id: params.id },
      data: { ...data, updatedAt: new Date() },
      include: {
        users_seller_reviews_reviewerIdTousers: { select: { id: true, name: true, image: true } },
        users_seller_reviews_sellerIdTousers: { select: { id: true, name: true, image: true } },
      },
    });

    if (data.rating) {
      const stats = await prisma.seller_reviews.aggregate({
        where: { sellerId: review.sellerId },
        _avg: { rating: true },
        _count: true,
      });

      await prisma.users.update({
        where: { id: review.sellerId },
        data: {
          sellerRating: stats._avg.rating || 0,
          sellerReviewCount: stats._count,
        },
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const review = await prisma.seller_reviews.findUnique({
      where: { id: params.id },
    });

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    const user = await prisma.users.findUnique({
      where: { id: session.user.id },
    });

    if (review.reviewerId !== session.user.id && user?.userType !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.seller_reviews.delete({
      where: { id: params.id },
    });

    const stats = await prisma.seller_reviews.aggregate({
      where: { sellerId: review.sellerId },
      _avg: { rating: true },
      _count: true,
    });

    await prisma.users.update({
      where: { id: review.sellerId },
      data: {
        sellerRating: stats._avg.rating || 0,
        sellerReviewCount: stats._count,
      },
    });

    return NextResponse.json({ message: 'Review deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
