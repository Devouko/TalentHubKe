import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { businessName, description, skills, experience, portfolio } = body

    // Check if user already has an application
    const existingApplication = await prisma.sellerApplication.findUnique({
      where: { userId: session.user.id }
    })

    if (existingApplication) {
      return NextResponse.json({ error: 'Application already exists' }, { status: 400 })
    }

    const application = await prisma.sellerApplication.create({
      data: {
        businessName,
        description,
        skills: skills || [],
        experience,
        portfolio: portfolio || [],
        userId: session.user.id
      }
    })

    // Update user seller status
    await prisma.user.update({
      where: { id: session.user.id },
      data: { sellerStatus: 'PENDING' }
    })

    return NextResponse.json(application, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (user?.userType !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const applications = await prisma.sellerApplication.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(applications)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
  }
}