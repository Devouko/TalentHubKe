import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { trackError } from '@/lib/error-tracking'

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { projectId, title, description, budget, timeline } = await request.json()

    if (!projectId || !title || !description || !budget || !timeline) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const proposal = await prisma.proposal.create({
      data: {
        freelancerId: session.user.id,
        projectId,
        title,
        description,
        budget: parseFloat(budget),
        timeline: parseInt(timeline),
        status: 'PENDING'
      },
      include: {
        freelancer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(proposal)
  } catch (error) {
    trackError(error as Error, { section: 'proposals', action: 'create' })
    return NextResponse.json({ error: 'Failed to create proposal' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const freelancerId = searchParams.get('freelancerId')

    let where = {}
    if (projectId) where = { projectId }
    if (freelancerId) where = { freelancerId }

    const proposals = await prisma.proposal.findMany({
      where,
      include: {
        freelancer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        project: {
          select: {
            id: true,
            title: true,
            budget: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(proposals)
  } catch (error) {
    trackError(error as Error, { section: 'proposals', action: 'fetch' })
    return NextResponse.json({ error: 'Failed to fetch proposals' }, { status: 500 })
  }
}