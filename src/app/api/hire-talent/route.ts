import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiService } from '@/lib/api.service'

export async function POST(request: NextRequest) {
  return ApiService.handleRequest(async () => {
    const session = await ApiService.validateAuth()
    const { talentId, message, projectDetails } = await request.json()
    
    ApiService.validateRequired({ talentId }, ['talentId'])
    
    // Get talent details
    const talent = await prisma.user.findUnique({
      where: { id: talentId },
      select: { id: true, name: true, email: true }
    })
    
    if (!talent) {
      throw new Error('Talent not found')
    }
    
    // Create notification for talent
    await prisma.notification.create({
      data: {
        userId: talentId,
        title: 'New Hiring Request',
        message: `${session.user.name} wants to hire you for a project`,
        type: 'APPLICATION',
        entityId: session.user.id,
        entityType: 'HIRE_REQUEST'
      }
    })
    
    // Create notification for client
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        title: 'Hiring Request Sent',
        message: `Your hiring request has been sent to ${talent.name}`,
        type: 'APPLICATION',
        entityId: talentId,
        entityType: 'HIRE_REQUEST_SENT'
      }
    })
    
    // Send email to talent
    try {
      await fetch(`${process.env.NEXTAUTH_URL}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: talent.email,
          subject: 'New Hiring Request - TalentHub',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #059669;">New Hiring Request</h2>
              <p>Hello ${talent.name},</p>
              <p><strong>${session.user.name}</strong> is interested in hiring you for a project.</p>
              ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
              ${projectDetails ? `<p><strong>Project Details:</strong> ${projectDetails}</p>` : ''}
              <p>Please log in to your TalentHub account to respond to this request.</p>
              <a href="${process.env.NEXTAUTH_URL}/dashboard" 
                 style="background: linear-gradient(to right, #059669, #0d9488); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 16px 0;">
                View Request
              </a>
              <p>Best regards,<br>TalentHub Team</p>
            </div>
          `
        })
      })
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
    }
    
    return {
      success: true,
      message: `Hiring request sent to ${talent.name}`,
      talent: { id: talent.id, name: talent.name }
    }
  }, 'Failed to send hiring request')
}