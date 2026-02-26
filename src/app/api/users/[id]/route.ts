import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.users.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        userType: true,
        bio: true,
        profileImage: true,
        county: true,
        phoneNumber: true,
        sellerStatus: true,
        sellerRating: true,
        sellerReviewCount: true,
        createdAt: true,
        gigs: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            deliveryTime: true,
            rating: true,
            reviewCount: true,
            category: true,
            tags: true,
            isActive: true
          },
          where: { isActive: true },
          orderBy: { createdAt: 'desc' }
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            users: {
              select: {
                id: true,
                name: true,
                profileImage: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: {
            gigs: true,
            orders: true,
            reviews: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate average rating from gigs
    const avgRating = user.gigs.length > 0
      ? user.gigs.reduce((sum, gig) => sum + (gig.rating || 0), 0) / user.gigs.length
      : user.sellerRating || 0

    return NextResponse.json({
      ...user,
      avgRating: Math.round(avgRating * 10) / 10,
      reviews: user.reviews.map(review => ({
        ...review,
        reviewer: review.users
      }))
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}