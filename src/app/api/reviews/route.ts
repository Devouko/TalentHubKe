import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

/**
 * GET /api/reviews - Fetch reviews for a seller
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sellerId = searchParams.get('sellerId')

    if (!sellerId) {
      return NextResponse.json({ error: 'Seller ID is required' }, { status: 400 })
    }

    const reviews = await prisma.review.findMany({
      where: {
        gig: {
          sellerId: sellerId
        }
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        gig: {
          select: {
            title: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const formattedReviews = reviews.map(review => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      images: review.images,
      isVerified: review.isVerified,
      reviewerName: review.reviewer.name || review.reviewer.email,
      gigTitle: review.gig.title,
      createdAt: review.createdAt.toISOString()
    }))

    return NextResponse.json(formattedReviews)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

/**
 * POST /api/reviews - Create a new review
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { orderId, rating, comment, images } = await request.json()

    if (!orderId || !rating) {
      return NextResponse.json({ error: 'Order ID and rating are required' }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    // Get order details
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { gig: true }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Verify the user is the buyer of this order
    if (order.buyerId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized to review this order' }, { status: 403 })
    }

    if (order.status !== 'COMPLETED' && order.status !== 'DELIVERED') {
      return NextResponse.json({ error: 'Can only review completed orders' }, { status: 400 })
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: { orderId }
    })

    if (existingReview) {
      return NextResponse.json({ error: 'Review already exists for this order' }, { status: 400 })
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        orderId,
        reviewerId: order.buyerId,
        gigId: order.gigId!,
        rating,
        comment: comment || '',
        images: images || [],
        isVerified: true
      },
      include: {
        reviewer: { select: { name: true, email: true } },
        gig: { select: { title: true } }
      }
    })

    // Update gig rating
    const gigReviews = await prisma.review.findMany({
      where: { gigId: order.gigId! }
    })
    
    const avgRating = gigReviews.reduce((sum, r) => sum + r.rating, 0) / gigReviews.length
    
    await prisma.gig.update({
      where: { id: order.gigId! },
      data: {
        rating: avgRating,
        reviewCount: gigReviews.length
      }
    })

    return NextResponse.json(review)
  } catch (error) {
    console.error('Review creation error:', error)
    return NextResponse.json({ error: 'Failed to create review. Please try again.' }, { status: 500 })
  }
}