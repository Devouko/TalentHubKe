import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const methods = await prisma.paymentMethods.findMany({
      where: { userId: session.user.id }
    })

    return NextResponse.json(methods)
  } catch (error) {
    console.error('Payment methods fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch payment methods' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type, details, isDefault } = await request.json()

    if (isDefault) {
      await prisma.paymentMethods.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false }
      })
    }

    const method = await prisma.paymentMethods.create({
      data: {
        userId: session.user.id,
        type,
        details,
        isDefault: isDefault || false
      }
    })

    return NextResponse.json(method)
  } catch (error) {
    console.error('Payment method creation error:', error)
    return NextResponse.json({ error: 'Failed to add payment method' }, { status: 500 })
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

    await prisma.paymentMethods.delete({
      where: { id, userId: session.user.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Payment method deletion error:', error)
    return NextResponse.json({ error: 'Failed to delete payment method' }, { status: 500 })
  }
}
