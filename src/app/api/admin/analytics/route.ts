import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const user = await prisma.users.findUnique({
      where: { id: session.user.id },
      select: { userType: true }
    })

    if (user?.userType !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '30d'

    // Calculate date range
    const now = new Date()
    let startDate = new Date()
    
    switch (range) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    // Fetch analytics data
    const [
      totalUsers,
      totalOrders,
      totalGigs,
      totalProducts,
      totalMessages,
      recentUsers,
      previousPeriodUsers,
      previousPeriodOrders
    ] = await Promise.all([
      // Total users
      prisma.users.count(),
      
      // Total orders
      prisma.orders.count(),
      
      // Total gigs
      prisma.gigs.count(),
      
      // Total products
      prisma.products.count(),
      
      // Total messages
      prisma.messages.count(),
      
      // Recent users (for growth calculation)
      prisma.users.count({
        where: {
          createdAt: {
            gte: startDate
          }
        }
      }),
      
      // Previous period users
      prisma.users.count({
        where: {
          createdAt: {
            lt: startDate,
            gte: new Date(startDate.getTime() - (now.getTime() - startDate.getTime()))
          }
        }
      }),
      
      // Previous period orders
      prisma.orders.count({
        where: {
          createdAt: {
            lt: startDate,
            gte: new Date(startDate.getTime() - (now.getTime() - startDate.getTime()))
          }
        }
      })
    ])

    // Calculate revenue
    const orders = await prisma.orders.findMany({
      select: {
        totalAmount: true
      }
    })
    
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)

    // Calculate average rating
    const reviews = await prisma.reviews.findMany({
      select: {
        rating: true
      }
    })
    
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0

    // Calculate active users (users with activity in last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(now.getDate() - 7)
    
    // Get users who have sent messages recently
    const activeUserIds = await prisma.messages.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      },
      select: {
        senderId: true
      },
      distinct: ['senderId']
    })

    const activeUsers = activeUserIds.length

    // Calculate growth percentages
    const userGrowth = previousPeriodUsers > 0
      ? Math.round(((recentUsers - previousPeriodUsers) / previousPeriodUsers) * 100)
      : 0

    const recentOrders = await prisma.orders.count({
      where: {
        createdAt: {
          gte: startDate
        }
      }
    })

    const orderGrowth = previousPeriodOrders > 0
      ? Math.round(((recentOrders - previousPeriodOrders) / previousPeriodOrders) * 100)
      : 0

    const revenueGrowth = 15 // Placeholder - would need historical revenue data

    const analytics = {
      totalUsers,
      totalRevenue,
      totalOrders,
      totalGigs,
      totalProducts,
      totalMessages,
      averageRating,
      activeUsers,
      revenueGrowth,
      userGrowth,
      orderGrowth
    }

    return NextResponse.json(analytics)

  } catch (error) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
