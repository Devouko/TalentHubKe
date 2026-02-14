import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || session.user.id
    
    // Fetch user's orders/purchases
    const purchases = await prisma.order.findMany({
      where: { 
        buyerId: userId,
        status: { in: ['COMPLETED', 'DELIVERED'] }
      },
      include: {
        gig: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            category: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(purchases)
  } catch (error) {
    console.error('Purchases fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch purchases' }, { status: 500 })
  }
}