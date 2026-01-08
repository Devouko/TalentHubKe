import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const theme = await prisma.themeSettings.findFirst({
      where: { isActive: true },
    });

    return NextResponse.json(theme || {
      primaryColor: '#3b82f6',
      secondaryColor: '#10b981',
      accentColor: '#8b5cf6',
    });
  } catch (error) {
    return NextResponse.json({
      primaryColor: '#3b82f6',
      secondaryColor: '#10b981',
      accentColor: '#8b5cf6',
    });
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.userType !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  try {
    const { primaryColor, secondaryColor, accentColor } = await request.json();

    await prisma.themeSettings.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    const theme = await prisma.themeSettings.create({
      data: {
        primaryColor,
        secondaryColor,
        accentColor,
        isActive: true,
      },
    });

    return NextResponse.json(theme);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update theme' }, { status: 500 });
  }
}