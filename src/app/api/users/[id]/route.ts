import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        gigs: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            deliveryTime: true,
            rating: true,
            reviewCount: true
          }
        },
        reviews: {
          include: {
            reviewer: {
              select: {
                name: true
              }
            }
          },
          take: 5
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

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}