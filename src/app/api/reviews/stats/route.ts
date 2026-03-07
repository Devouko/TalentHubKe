import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const gigId = searchParams.get('gigId');
    const userId = searchParams.get('userId');

    if (!gigId && !userId) {
      return NextResponse.json({ error: 'gigId or userId required' }, { status: 400 });
    }

    const where: any = gigId ? { gigId } : { reviewerId: userId };

    const [stats, ratingDistribution] = await Promise.all([
      prisma.reviews.aggregate({
        where,
        _avg: { rating: true },
        _count: true,
      }),
      prisma.reviews.groupBy({
        by: ['rating'],
        where,
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
