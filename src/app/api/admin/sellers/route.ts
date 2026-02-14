import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET() {
  try {
    const applications = await prisma.sellerApplication.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            sellerStatus: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(applications)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { applicationId, action, adminNotes } = await request.json()
    
    if (!applicationId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const application = await prisma.sellerApplication.findUnique({
      where: { id: applicationId },
      include: { user: true }
    })

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    const status = action === 'approve' ? 'APPROVED' : 'REJECTED'
    const sellerStatus = action === 'approve' ? 'APPROVED' : 'REJECTED'

    const [updatedApplication, updatedUser] = await prisma.$transaction([
      prisma.sellerApplication.update({
        where: { id: applicationId },
        data: {
          status,
          adminNotes: adminNotes || null
        }
      }),
      prisma.user.update({
        where: { id: application.userId },
        data: { sellerStatus }
      })
    ])

    return NextResponse.json({ application: updatedApplication, user: updatedUser })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 })
  }
}