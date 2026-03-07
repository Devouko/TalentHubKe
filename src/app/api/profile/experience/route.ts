import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, company, startDate, endDate, description, current } = await request.json()

    const experience = await prisma.experiences.create({
      data: {
        userId: session.user.id,
        title,
        company,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        description,
        current: current || false
      }
    })

    return NextResponse.json(experience)
  } catch (error) {
    console.error('Experience creation error:', error)
    return NextResponse.json({ error: 'Failed to add experience' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    await prisma.experiences.delete({
      where: { id, userId: session.user.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Experience deletion error:', error)
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 })
  }
}
