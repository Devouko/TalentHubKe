import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.userType !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [
      totalUsers,
      activeGigs,
      totalOrders,
      pendingOrders,
      completedOrders,
      activeSellers,
      totalRevenue,
      totalProducts,
      pendingApplications,
      escrowPending,
      disputedOrders,
      totalMessages,
      unreadNotifications
    ] = await Promise.all([
      prisma.users.count(),
      prisma.gigs.count({ where: { isActive: true } }),
      prisma.orders.count(),
      prisma.orders.count({ where: { status: 'PENDING' } }),
      prisma.orders.count({ where: { status: 'COMPLETED' } }),
      prisma.users.count({ where: { userType: { in: ['FREELANCER', 'AGENCY'] } } }),
      prisma.orders.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { totalAmount: true }
      }),
      prisma.products.count({ where: { isActive: true } }),
      prisma.seller_applications.count({ where: { status: 'PENDING' } }),
      prisma.escrow_transactions.count({ where: { status: 'PENDING' } }),
      prisma.orders.count({ where: { status: 'DISPUTED' } }),
      prisma.messages.count(),
      prisma.notifications.count({ where: { isRead: false } })
    ])

    const recentActivity = await prisma.orders.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        users: { select: { name: true } },
        gigs: { select: { title: true } }
      }
    })

    const formattedActivity = recentActivity.map(order => ({
      type: 'order',
      title: `New Order: ${order.gigs?.title || 'Product'}`,
      description: `Order by ${order.users.name}`,
      time: order.createdAt
    }))

    return NextResponse.json({
      totalUsers,
      activeGigs,
      totalOrders,
      pendingOrders,
      completedOrders,
      activeSellers,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      totalProducts,
      pendingApplications,
      escrowPending,
      disputedOrders,
      totalMessages,
      unreadNotifications,
      recentActivity: formattedActivity
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
