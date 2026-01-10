import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (userId) {
      const application = await prisma.sellerApplication.findUnique({
        where: { userId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })
      return NextResponse.json(application)
    }
    
    const applications = await prisma.sellerApplication.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(applications)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function POST(request: Request) {
  try {
    const applicationData = await request.json()
    
    if (!applicationData.userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }
    
    const newApplication = await prisma.sellerApplication.create({
      data: {
        userId: applicationData.userId,
        businessName: applicationData.businessName,
        description: applicationData.description,
        skills: applicationData.skills,
        experience: applicationData.experience,
        portfolio: applicationData.portfolio
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
    
    // Send email notification
    try {
      await fetch(`${process.env.NEXTAUTH_URL}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: newApplication.user.email,
          subject: 'Seller Application Received',
          html: `
            <h2>Thank you for your seller application!</h2>
            <p>Hi ${newApplication.user.name},</p>
            <p>We have received your seller application and will review it shortly.</p>
            <p><strong>Business Name:</strong> ${applicationData.businessName}</p>
            <p><strong>Skills:</strong> ${applicationData.skills?.join(', ')}</p>
            <p>We'll notify you once the review is complete.</p>
            <p>Best regards,<br>Talent Marketplace Team</p>
          `
        })
      })
    } catch (emailError) {
      console.error('Failed to send email:', emailError)
    }
    
    return NextResponse.json(newApplication, { status: 201 })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to create application. Database connection issue.' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 })
    }
    
    const applicationData = await request.json()
    const updatedApplication = await prisma.sellerApplication.update({
      where: { id },
      data: applicationData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
    
    return NextResponse.json(updatedApplication)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 })
  }
}