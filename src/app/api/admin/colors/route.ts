import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.userType !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const colors = await request.json();

    // Update or create theme settings
    const themeSettings = await prisma.themeSettings.upsert({
      where: { id: 'default' },
      update: {
        primaryColor: colors.primary,
        secondaryColor: colors.secondary,
        accentColor: colors.accent
      },
      create: {
        id: 'default',
        primaryColor: colors.primary,
        secondaryColor: colors.secondary,
        accentColor: colors.accent,
        isActive: true
      }
    });

    return NextResponse.json(themeSettings);
  } catch (error) {
    console.error('Error updating colors:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const themeSettings = await prisma.themeSettings.findFirst({
      where: { isActive: true }
    });

    return NextResponse.json(themeSettings || {
      primaryColor: '#000000',
      secondaryColor: '#00ff41',
      accentColor: '#7fff00'
    });
  } catch (error) {
    console.error('Error fetching colors:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}