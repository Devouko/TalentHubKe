import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

/**
 * GET /api/sellers - Fetch all sellers with their stats
 */
export async function GET(request: NextRequest) {
  try {
    const sellers = await prisma.user.findMany({
      where: {
        OR: [
          { sellerStatus: 'APPROVED' },
          { sellerStatus: 'PENDING' }
        ]
      },
      include: {
        gigs: {
          select: {
            id: true,
            isActive: true,
            orderCount: true,
            rating: true
          }
        },
        orders: {
          select: {
            totalAmount: true,
            status: true
          }
        },
        sellerApplication: {
          select: {
            businessName: true,
            status: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const sellersWithStats = sellers.map(seller => {
      const totalEarnings = seller.orders
        .filter(order => order.status === 'COMPLETED')
        .reduce((sum, order) => sum + order.totalAmount, 0)
      
      const activeGigs = seller.gigs.filter(gig => gig.isActive).length
      const completedOrders = seller.orders.filter(order => order.status === 'COMPLETED').length
      
      const avgRating = seller.gigs.length > 0 
        ? seller.gigs.reduce((sum, gig) => sum + gig.rating, 0) / seller.gigs.length
        : 0

      return {
        id: seller.id,
        name: seller.name,
        email: seller.email,
        status: seller.sellerStatus.toLowerCase(),
        totalEarnings,
        activeGigs,
        completedOrders,
        rating: Number(avgRating.toFixed(1)),
        joinedDate: seller.createdAt.toISOString(),
        verified: seller.isVerified,
        businessName: seller.sellerApplication?.businessName
      }
    })

    return NextResponse.json(sellersWithStats)
  } catch (error) {
    console.error('Error fetching sellers:', error)
    return NextResponse.json({ error: 'Failed to fetch sellers' }, { status: 500 })
  }
}