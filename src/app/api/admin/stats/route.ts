import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

/**
 * GET /api/admin/stats - Fetch admin dashboard statistics
 */
export async function GET(request: NextRequest) {
  try {
    const [
      totalUsers,
      activeGigs,
      totalOrders,
      completedOrders,
      pendingOrders,
      activeSellers,
      totalRevenue,
      recentUsers,
      recentOrders,
      recentGigs
    ] = await Promise.all([
      prisma.user.count(),
      prisma.gig.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: 'COMPLETED' } }),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.user.count({ where: { sellerStatus: 'APPROVED' } }),
      prisma.order.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { totalAmount: true }
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, createdAt: true }
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { 
          id: true, 
          totalAmount: true, 
          status: true, 
          createdAt: true,
          buyer: { select: { name: true } }
        }
      }),
      prisma.gig.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { 
          id: true, 
          title: true, 
          createdAt: true,
          seller: { select: { name: true } }
        }
      })
    ])

    const stats = {
      totalUsers,
      activeGigs,
      totalOrders,
      completedOrders,
      pendingOrders,
      activeSellers,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      recentActivity: [
        ...recentUsers.map(user => ({
          type: 'user',
          title: 'New user registered',
          description: `${user.name || user.email} joined the platform`,
          time: user.createdAt
        })),
        ...recentOrders.map(order => ({
          type: 'order',
          title: 'New order received',
          description: `KES ${order.totalAmount.toLocaleString()} from ${order.buyer.name}`,
          time: order.createdAt
        })),
        ...recentGigs.map(gig => ({
          type: 'gig',
          title: 'New gig created',
          description: `${gig.title} by ${gig.seller.name}`,
          time: gig.createdAt
        }))
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10)
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 })
  }
}