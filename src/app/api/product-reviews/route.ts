import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createProductReviewSchema = z.object({
  productId: z.string(),
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  comment: z.string(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const where: any = {};
    if (productId) where.productId = productId;
    if (userId) where.userId = userId;

    const [reviews, total] = await Promise.all([
      prisma.product_reviews.findMany({
        where,
        include: {
          users: { select: { id: true, name: true, image: true } },
          products: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.product_reviews.count({ where }),
    ]);

    return NextResponse.json({
      reviews,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product reviews' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const data = createProductReviewSchema.parse(body);

    const product = await prisma.products.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const review = await prisma.product_reviews.create({
      data: {
        id: `prev_${Date.now()}`,
        productId: data.productId,
        userId: session.user.id,
        rating: data.rating,
        title: data.title,
        comment: data.comment,
        isVerified: false,
      },
      include: {
        users: { select: { id: true, name: true, image: true } },
        products: { select: { id: true, title: true } },
      },
    });

    const stats = await prisma.product_reviews.aggregate({
      where: { productId: data.productId },
      _avg: { rating: true },
      _count: true,
    });

    await prisma.products.update({
      where: { id: data.productId },
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
    return NextResponse.json({ error: 'Failed to create product review' }, { status: 500 });
  }
}
