import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.userType !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '7d'

    const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Generate date range
    const dates = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      dates.push(date.toISOString().split('T')[0])
    }

    // Get orders data
    const orders = await prisma.orders.findMany({
      where: {
        createdAt: { gte: startDate }
      },
      select: {
        createdAt: true,
        totalAmount: true,
        status: true
      }
    })

    // Get users data
    const users = await prisma.users.findMany({
      where: {
        createdAt: { gte: startDate }
      },
      select: {
        createdAt: true
      }
    })

    // Get gigs data
    const gigs = await prisma.gigs.findMany({
      where: {
        createdAt: { gte: startDate }
      },
      select: {
        createdAt: true,
        category: true
      }
    })

    // Process trade data
    const tradeData = dates.map(date => {
      const dayOrders = orders.filter(o => o.createdAt.toISOString().split('T')[0] === date)
      const dayUsers = users.filter(u => u.createdAt.toISOString().split('T')[0] === date)
      const dayGigs = gigs.filter(g => g.createdAt.toISOString().split('T')[0] === date)

      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: dayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
        orders: dayOrders.length,
        users: dayUsers.length,
        gigs: dayGigs.length
      }
    })

    // Process category data
    const categoryStats = {}
    gigs.forEach(gig => {
      const category = gig.category || 'Other'
      categoryStats[category] = (categoryStats[category] || 0) + 1
    })

    const categoryData = Object.entries(categoryStats).map(([name, value]) => ({
      name,
      value,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`
    }))

    return NextResponse.json({
      tradeData,
      categoryData
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}