import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { jobId, applicantId, coverLetter, skills, experience } = await request.json()

    if (!jobId || !applicantId) {
      return NextResponse.json({ error: 'Job ID and applicant ID are required' }, { status: 400 })
    }

    // Check if user already applied by looking in orders table
    const existingApplication = await prisma.order.findFirst({
      where: {
        buyerId: applicantId,
        gigId: jobId,
        requirements: {
          contains: 'APPLICATION'
        }
      }
    })

    if (existingApplication) {
      return NextResponse.json({ error: 'You have already applied for this job' }, { status: 400 })
    }

    // Create application as an order with special requirements
    const application = await prisma.order.create({
      data: {
        status: 'PENDING',
        totalAmount: 0,
        buyerId: applicantId,
        gigId: jobId,
        requirements: JSON.stringify({
          type: 'APPLICATION',
          coverLetter,
          skills,
          experience,
          appliedAt: new Date().toISOString()
        })
      }
    })

    return NextResponse.json({ 
      success: true, 
      applicationId: application.id,
      message: 'Application submitted successfully' 
    })

  } catch (error) {
    console.error('Application error:', error)
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('jobId')
    const applicantId = searchParams.get('applicantId')
    const posterId = searchParams.get('posterId')

    if (jobId && applicantId) {
      const application = await prisma.order.findFirst({
        where: {
          buyerId: applicantId,
          gigId: jobId,
          requirements: {
            contains: 'APPLICATION'
          }
        }
      })
      return NextResponse.json({ hasApplied: !!application })
    }

    if (posterId) {
      const applications = await prisma.order.findMany({
        where: {
          gig: {
            sellerId: posterId
          },
          requirements: {
            contains: 'APPLICATION'
          }
        },
        include: {
          gig: { select: { title: true } },
          buyer: { select: { name: true, email: true } }
        },
        orderBy: { createdAt: 'desc' }
      })
      
      const transformedApplications = applications.map(order => {
        const req = JSON.parse(order.requirements || '{}')
        return {
          id: order.id,
          jobId: order.gigId,
          applicantId: order.buyerId,
          coverLetter: req.coverLetter || '',
          skills: req.skills || '',
          experience: req.experience || '',
          status: 'PENDING',
          createdAt: order.createdAt,
          job: { title: order.gig?.title || 'Unknown Job' },
          applicant: { name: order.buyer?.name || 'Unknown', email: order.buyer?.email || '' }
        }
      })
      
      return NextResponse.json(transformedApplications)
    }

    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })

  } catch (error) {
    console.error('Get applications error:', error)
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
  }
}