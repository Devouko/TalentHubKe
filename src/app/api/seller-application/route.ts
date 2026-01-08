import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    const application = await prisma.sellerApplication.create({
      data: {
        businessName: data.businessName,
        description: data.description,
        skills: data.skills,
        experience: data.experience,
        portfolio: data.portfolio,
        userId: session.user.id
      }
    });

    // Update user seller status to PENDING
    await prisma.user.update({
      where: { id: session.user.id },
      data: { sellerStatus: 'PENDING' }
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error('Error creating seller application:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}