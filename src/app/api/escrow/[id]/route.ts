import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { escrowService } from '@/lib/escrow.service'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const transaction = await escrowService.getTransaction(params.id)
    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    // Check authorization
    if (
      transaction.buyerId !== session.user.id &&
      transaction.sellerId !== session.user.id
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(transaction)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch transaction' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { action, adminNotes, reason } = body

    let result
    switch (action) {
      case 'approve':
        result = await escrowService.approveTransaction(params.id, adminNotes)
        break
      case 'reject':
        result = await escrowService.rejectTransaction(params.id, reason)
        break
      case 'complete':
        result = await escrowService.completeTransaction(params.id)
        break
      case 'refund':
        result = await escrowService.refundTransaction(params.id)
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
