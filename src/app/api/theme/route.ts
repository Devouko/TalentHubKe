import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ theme: 'default' })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { theme: true }
    })

    return NextResponse.json({ theme: user?.theme || 'default' })
  } catch (error) {
    console.error('Theme GET error:', error)
    return NextResponse.json({ theme: 'default' })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { theme } = await request.json()

    await prisma.user.update({
      where: { id: session.user.id },
      data: { theme }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Theme POST error:', error)
    return NextResponse.json({ error: 'Failed to save theme' }, { status: 500 })
  }
}