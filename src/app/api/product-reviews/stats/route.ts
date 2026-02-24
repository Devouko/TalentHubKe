import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'productId required' }, { status: 400 });
    }

    const [stats, ratingDistribution] = await Promise.all([
      prisma.product_reviews.aggregate({
        where: { productId },
        _avg: { rating: true },
        _count: true,
      }),
      prisma.product_reviews.groupBy({
        by: ['rating'],
        where: { productId },
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
