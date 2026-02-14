import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

/**
 * GET /api/user/stats - Fetch user dashboard statistics
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const [
      userGigs,
      userOrders,
      userReviews,
      profileViews
    ] = await Promise.all([
      prisma.gig.findMany({
        where: { sellerId: userId },
        select: {
          id: true,
          isActive: true,
          orderCount: true,
          rating: true
        }
      }),
      prisma.order.findMany({
        where: {
          gig: {
            sellerId: userId
          }
        },
        select: {
          totalAmount: true,
          status: true
        }
      }),
      prisma.review.findMany({
        where: {
          gig: {
            sellerId: userId
          }
        },
        select: {
          rating: true
        }
      }),
      // Mock profile views for now
      Promise.resolve(Math.floor(Math.random() * 2000) + 500)
    ])

    const totalEarnings = userOrders
      .filter(order => order.status === 'COMPLETED')
      .reduce((sum, order) => sum + order.totalAmount, 0)

    const activeGigs = userGigs.filter(gig => gig.isActive).length
    const completedOrders = userOrders.filter(order => order.status === 'COMPLETED').length
    const avgRating = userReviews.length > 0 
      ? userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length
      : 0

    const stats = {
      totalEarnings,
      activeGigs,
      completedOrders,
      profileViews,
      avgRating: Number(avgRating.toFixed(1))
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json({ error: 'Failed to fetch user stats' }, { status: 500 })
  }
}