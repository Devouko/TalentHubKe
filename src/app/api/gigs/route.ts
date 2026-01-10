import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (id) {
      const gig = await prisma.gig.findUnique({
        where: { id },
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })
      if (!gig) {
        return NextResponse.json({ error: 'Gig not found' }, { status: 404 })
      }
      return NextResponse.json(gig)
    }
    
    const gigs = await prisma.gig.findMany({
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(gigs)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to fetch gigs' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const gigData = await request.json()
    
    if (!gigData.title || !gigData.description || !gigData.category || !gigData.price || !gigData.sellerId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    const newGig = await prisma.gig.create({
      data: {
        title: gigData.title,
        description: gigData.description,
        category: gigData.category,
        price: parseFloat(gigData.price),
        deliveryTime: parseInt(gigData.deliveryTime) || 3,
        tags: gigData.tags ? gigData.tags.split(',').map((tag: string) => tag.trim()) : [],
        sellerId: gigData.sellerId
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
    return NextResponse.json(newGig, { status: 201 })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to create gig. Database connection issue.' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Gig ID is required' }, { status: 400 })
    }
    
    const gigData = await request.json()
    const updatedGig = await prisma.gig.update({
      where: { id },
      data: gigData,
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
    
    return NextResponse.json(updatedGig)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update gig' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Gig ID is required' }, { status: 400 })
    }
    
    await prisma.gig.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'Gig deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete gig' }, { status: 500 })
  }
}