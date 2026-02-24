import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get('sellerId');

    if (!sellerId) {
      return NextResponse.json({ error: 'sellerId required' }, { status: 400 });
    }

    const [stats, ratingDistribution] = await Promise.all([
      prisma.seller_reviews.aggregate({
        where: { sellerId },
        _avg: { rating: true },
        _count: true,
      }),
      prisma.seller_reviews.groupBy({
        by: ['rating'],
        where: { sellerId },
        _count: true,
      }),
    ]);

    const distribution = [1, 2, 3, 4, 5].map((rating) => ({
      rating,
      count: ratingDistribution.find((r) => r.rating === rating)?._count || 0,
    }));

    return NextResponse.json({
      averageRating: stats._avg.rating || 0,
      totalReviews: stats._count,
      distribution,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
