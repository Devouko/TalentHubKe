import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Return default settings since platformSettings table doesn't exist
    return NextResponse.json({
      id: 'default',
      platformName: 'TalentHub',
      platformTagline: 'Talent Marketplace that developers love',
      primaryColor: '#10b981',
      secondaryColor: '#14b8a6'
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.userType !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    const settings = await prisma.platformSettings.upsert({
      where: { id: 'default' },
      update: data,
      create: { id: 'default', ...data }
    })
    
    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
