import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.userType !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '7d'

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
        startDate.setDate(now.getDate() - 7)
    }

    // Get daily data for the range
    const days = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const tradeData = []

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(now.getDate() - i)
      const nextDate = new Date(date)
      nextDate.setDate(date.getDate() + 1)

      const [orders, revenue, users, gigs] = await Promise.all([
        prisma.order.count({
          where: {
            createdAt: {
              gte: date,
              lt: nextDate
            }
          }
        }),
        prisma.order.aggregate({
          where: {
            createdAt: {
              gte: date,
              lt: nextDate
            },
            status: 'COMPLETED'
          },
          _sum: { totalAmount: true }
        }),
        prisma.user.count({
          where: {
            createdAt: {
              gte: date,
              lt: nextDate
            }
          }
        }),
        prisma.gig.count({
          where: {
            createdAt: {
              gte: date,
              lt: nextDate
            }
          }
        })
      ])

      tradeData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: revenue._sum.totalAmount || 0,
        orders,
        users,
        gigs
      })
    }

    // Get category distribution
    const categoryStats = await prisma.gig.groupBy({
      by: ['category'],
      _count: { category: true },
      where: {
        createdAt: {
          gte: startDate
        }
      }
    })

    const categoryData = categoryStats.map((stat, index) => ({
      name: stat.category || 'Other',
      value: stat._count.category,
      color: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'][index % 6]
    }))

    return NextResponse.json({
      tradeData,
      categoryData
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}