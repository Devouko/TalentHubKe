import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const gigs = await prisma.gig.findMany({
      include: {
        seller: {
          select: {
            name: true,
            profileImage: true
          }
        }
      },
      where: {
        isActive: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(gigs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch gigs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    const gig = await prisma.gig.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        deliveryTime: data.deliveryTime,
        category: data.category,
        tags: data.tags || [],
        images: data.images || [],
        sellerId: session.user.id
      }
    });

    return NextResponse.json(gig, { status: 201 });
  } catch (error) {
    console.error('Error creating gig:', error);
    return NextResponse.json({ error: 'Failed to create gig' }, { status: 500 });
  }
}