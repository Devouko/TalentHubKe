import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.userType !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const themeSettings = await prisma.themeSettings.findFirst({
      where: { isActive: true }
    })

    return NextResponse.json(themeSettings)
  } catch (error) {
    console.error('Error fetching theme settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.userType !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Deactivate all existing themes
    await prisma.themeSettings.updateMany({
      data: { isActive: false }
    })

    // Create or update the new theme
    const themeSettings = await prisma.themeSettings.create({
      data: {
        ...body,
        isActive: true
      }
    })

    return NextResponse.json(themeSettings)
  } catch (error) {
    console.error('Error saving theme settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}