import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.userType !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const { status } = await request.json()

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status required' }, { status: 400 })
    }

    // Update application and user status
    const application = await prisma.sellerApplication.update({
      where: { id },
      data: { status },
      include: { user: true }
    })

    // If approved, update user type to SELLER
    if (status === 'APPROVED') {
      await prisma.user.update({
        where: { id: application.userId },
        data: { userType: 'SELLER' }
      })
    }

    return NextResponse.json({ success: true, application })
  } catch (error) {
    console.error('Application update error:', error)
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 })
  }
}