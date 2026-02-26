import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.userType !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const applications = await prisma.seller_applications.findMany({
      include: {
        users: { select: { id: true, name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(applications)
  } catch (error) {
    console.error('Applications fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.userType !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { applicationId, action, adminNotes } = await request.json()
    
    if (!applicationId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const application = await prisma.seller_applications.findUnique({
      where: { id: applicationId }
    })

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    const status = action === 'approve' ? 'APPROVED' : 'REJECTED'
    const sellerStatus = action === 'approve' ? 'APPROVED' : 'REJECTED'

    const [updatedApplication, updatedUser] = await prisma.$transaction([
      prisma.seller_applications.update({
        where: { id: applicationId },
        data: { status, adminNotes: adminNotes || null, updatedAt: new Date() }
      }),
      prisma.users.update({
        where: { id: application.userId },
        data: { sellerStatus, userType: action === 'approve' ? 'FREELANCER' : undefined }
      })
    ])

    return NextResponse.json({ application: updatedApplication, user: updatedUser })
  } catch (error) {
    console.error('Application update error:', error)
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 })
  }
}
