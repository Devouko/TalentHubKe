import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '30d'

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
      default:
        startDate.setDate(now.getDate() - 30)
    }

    const days = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const spendingData = []
    const ordersData = []

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(now.getDate() - i)
      const nextDate = new Date(date)
      nextDate.setDate(date.getDate() + 1)

      const [spending, orderCount] = await Promise.all([
        prisma.order.aggregate({
          where: {
            buyerId: session.user.id,
            createdAt: { gte: date, lt: nextDate },
            status: 'COMPLETED'
          },
          _sum: { totalAmount: true }
        }),
        prisma.order.count({
          where: {
            buyerId: session.user.id,
            createdAt: { gte: date, lt: nextDate }
          }
        })
      ])

      spendingData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: spending._sum.totalAmount || 0
      })

      ordersData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        orders: orderCount
      })
    }

    const categoryStats = await prisma.order.groupBy({
      by: ['gigId'],
      where: {
        buyerId: session.user.id,
        createdAt: { gte: startDate }
      },
      _count: { gigId: true }
    })

    const gigIds = categoryStats.map(stat => stat.gigId).filter(Boolean)
    const gigs = await prisma.gig.findMany({
      where: { id: { in: gigIds as string[] } },
      select: { id: true, category: true }
    })

    const categoryMap = new Map(gigs.map(g => [g.id, g.category]))
    const categoryCount: Record<string, number> = {}

    categoryStats.forEach(stat => {
      const category = categoryMap.get(stat.gigId!) || 'Other'
      categoryCount[category] = (categoryCount[category] || 0) + stat._count.gigId
    })

    const categoryData = Object.entries(categoryCount).map(([name, value], index) => ({
      name: name || 'Other',
      value,
      color: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'][index % 6]
    }))

    return NextResponse.json({
      spendingData,
      ordersData,
      categoryData
    })
  } catch (error) {
    console.error('Error fetching user analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}