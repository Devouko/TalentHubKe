import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { escrowService } from '@/lib/escrow.service'
import { z } from 'zod'

const actionSchema = z.object({
  action: z.enum(['approve', 'reject', 'complete', 'refund'])
})

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
    const isAdmin = session.user.userType === 'ADMIN'
    if (
      !isAdmin &&
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
    const { action } = actionSchema.parse(body)

    const transaction = await escrowService.getTransaction(params.id)
    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    // Check authorization based on action
    const isAdmin = session.user.userType === 'ADMIN'
    const isBuyer = transaction.buyerId === session.user.id
    const isSeller = transaction.sellerId === session.user.id

    let result
    let message = ''

    switch (action) {
      case 'approve':
        if (!isAdmin && !isSeller) {
          return NextResponse.json({ error: 'Only seller or admin can approve' }, { status: 403 })
        }
        result = await escrowService.approve(params.id)
        message = 'Escrow approved successfully'
        break

      case 'reject':
        if (!isAdmin && !isSeller) {
          return NextResponse.json({ error: 'Only seller or admin can reject' }, { status: 403 })
        }
        result = await escrowService.reject(params.id)
        message = 'Escrow rejected successfully'
        break

      case 'complete':
        if (!isAdmin && !isBuyer) {
          return NextResponse.json({ error: 'Only buyer or admin can complete' }, { status: 403 })
        }
        result = await escrowService.complete(params.id)
        message = 'Escrow completed successfully'
        break

      case 'refund':
        if (!isAdmin) {
          return NextResponse.json({ error: 'Only admin can refund' }, { status: 403 })
        }
        result = await escrowService.refund(params.id)
        message = 'Escrow refunded successfully'
        break

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json({
      ...result,
      message
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Escrow action error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to process escrow action' 
    }, { status: 500 })
  }
}
