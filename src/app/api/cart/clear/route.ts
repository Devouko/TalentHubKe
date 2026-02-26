import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.cart.deleteMany({
      where: { userId: session.user.id }
    })

    return NextResponse.json({ 
      success: true,
      message: 'Cart cleared successfully'
    })
  } catch (error) {
    console.error('Cart clear error:', error)
    return NextResponse.json({ 
      error: 'Failed to clear cart',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  return DELETE(request)
}
