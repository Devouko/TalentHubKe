import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ReviewService } from '@/lib/review.service'
import { handleApiError } from '@/lib/api-utils'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const review = await ReviewService.createGigReview(session.user.id, data)
    
    return NextResponse.json({ success: true, review })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const gigId = searchParams.get('gigId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!gigId) {
      return NextResponse.json({ error: 'Gig ID is required' }, { status: 400 })
    }

    const result = await ReviewService.getGigReviews(gigId, page, limit)
    return NextResponse.json(result)
  } catch (error) {
    return handleApiError(error)
  }
}