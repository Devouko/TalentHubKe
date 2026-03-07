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

    const { name, issuer, date, credentialId } = await request.json()

    const certification = await prisma.certifications.create({
      data: {
        userId: session.user.id,
        name,
        issuer,
        date: new Date(date),
        credentialId
      }
    })

    return NextResponse.json(certification)
  } catch (error) {
    console.error('Certification creation error:', error)
    return NextResponse.json({ error: 'Failed to add certification' }, { status: 500 })
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

    await prisma.certifications.delete({
      where: { id, userId: session.user.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Certification deletion error:', error)
    return NextResponse.json({ error: 'Failed to delete certification' }, { status: 500 })
  }
}
