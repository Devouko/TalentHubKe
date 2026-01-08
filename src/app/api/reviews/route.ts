import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sellerId = searchParams.get('sellerId')
    const gigId = searchParams.get('gigId')
    const rating = searchParams.get('rating')
    
    const reviews = await prisma.review.findMany({
      where: {
        ...(sellerId && { 
          gig: { sellerId }
        }),
        ...(gigId && { gigId }),
        ...(rating && { rating: parseInt(rating) })
      },
      include: {
        reviewer: {
          select: { id: true, name: true, email: true }
        },
        gig: {
          select: { 
            id: true, 
            title: true, 
            images: true,
            seller: {
              select: { id: true, name: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(reviews)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { rating, comment, gigId, orderId } = body

    const review = await prisma.review.create({
      data: {
        rating: parseInt(rating),
        comment,
        reviewerId: session.user.id,
        gigId,
        orderId
      },
      include: {
        reviewer: {
          select: { id: true, name: true, email: true }
        },
        gig: {
          select: { 
            id: true, 
            title: true,
            seller: {
              select: { id: true, name: true }
            }
          }
        }
      }
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
  }
}