import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createNotification } from '@/lib/notifications'

export async function POST(request: NextRequest) {
  try {
    const { applicationId, scheduledAt, questions, duration, type } = await request.json()

    if (!applicationId || !scheduledAt) {
      return NextResponse.json({ error: 'Application ID and scheduled time are required' }, { status: 400 })
    }

    // Get application details
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: { select: { title: true, sellerId: true } },
        applicant: { select: { name: true, email: true } }
      }
    })

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    // Create interview
    const interview = await prisma.jobInterview.create({
      data: {
        applicationId,
        scheduledAt: new Date(scheduledAt),
        questions: questions || [],
        duration: duration || 30,
        type: type || 'VIDEO',
        status: 'SCHEDULED'
      }
    })

    // Notify applicant about interview
    await createNotification({
      userId: application.applicantId,
      type: 'INTERVIEW',
      title: 'Interview Scheduled',
      message: `You have an interview scheduled for ${application.job.title}`,
      metadata: {
        interviewId: interview.id,
        applicationId,
        scheduledAt
      }
    })

    return NextResponse.json({ 
      success: true, 
      interviewId: interview.id,
      message: 'Interview scheduled successfully' 
    })

  } catch (error) {
    console.error('Interview scheduling error:', error)
    return NextResponse.json({ error: 'Failed to schedule interview' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const applicationId = searchParams.get('applicationId')
    const userId = searchParams.get('userId')

    if (applicationId) {
      const interview = await prisma.jobInterview.findFirst({
        where: { applicationId },
        include: {
          application: {
            include: {
              job: { select: { title: true } },
              applicant: { select: { name: true, email: true } }
            }
          }
        }
      })
      return NextResponse.json(interview)
    }

    if (userId) {
      const interviews = await prisma.jobInterview.findMany({
        where: {
          OR: [
            { application: { applicantId: userId } },
            { application: { job: { sellerId: userId } } }
          ]
        },
        include: {
          application: {
            include: {
              job: { select: { title: true } },
              applicant: { select: { name: true, email: true } }
            }
          }
        },
        orderBy: { scheduledAt: 'asc' }
      })
      return NextResponse.json(interviews)
    }

    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })

  } catch (error) {
    console.error('Get interviews error:', error)
    return NextResponse.json({ error: 'Failed to fetch interviews' }, { status: 500 })
  }
}