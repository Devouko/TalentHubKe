import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.users.findUnique({
      where: { id: session.user.id },
    });

    if (user?.userType !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [gigReviews, productReviews, sellerReviews] = await Promise.all([
      prisma.reviews.findMany({
        include: {
          users: { select: { id: true, name: true, image: true } },
          gigs: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
      prisma.product_reviews.findMany({
        include: {
          users: { select: { id: true, name: true, image: true } },
          products: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
      prisma.seller_reviews.findMany({
        include: {
          users_seller_reviews_reviewerIdTousers: { select: { id: true, name: true, image: true } },
          users_seller_reviews_sellerIdTousers: { select: { id: true, name: true, image: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
    ]);

    const allReviews = [
      ...gigReviews.map(r => ({ ...r, type: 'gig', reviewer: r.users })),
      ...productReviews.map(r => ({ ...r, type: 'product', reviewer: r.users })),
      ...sellerReviews.map(r => ({ ...r, type: 'seller', reviewer: r.users_seller_reviews_reviewerIdTousers })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const stats = {
      total: allReviews.length,
      gig: gigReviews.length,
      product: productReviews.length,
      seller: sellerReviews.length,
      avgRating: allReviews.length ? (totalRating / allReviews.length).toFixed(1) : 0,
    };

    return NextResponse.json({ reviews: allReviews, stats });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
