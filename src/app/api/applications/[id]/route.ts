import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createNotification } from '@/lib/notifications'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json()
    const applicationId = params.id

    if (!status || !['ACCEPTED', 'REJECTED', 'INTERVIEWED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Get application details
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: { select: { title: true } },
        applicant: { select: { name: true } }
      }
    })

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    // Update application status
    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: { status }
    })

    // Send notification to applicant
    const notificationMessage = status === 'ACCEPTED' 
      ? `Your application for "${application.job.title}" has been accepted!`
      : `Your application for "${application.job.title}" has been rejected.`

    await createNotification({
      userId: application.applicantId,
      type: 'APPLICATION',
      title: `Application ${status.toLowerCase()}`,
      message: notificationMessage,
      metadata: {
        applicationId,
        jobId: application.jobId,
        status
      }
    })

    return NextResponse.json({ 
      success: true, 
      application: updatedApplication,
      message: `Application ${status.toLowerCase()} successfully` 
    })

  } catch (error) {
    console.error('Update application error:', error)
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 })
  }
}