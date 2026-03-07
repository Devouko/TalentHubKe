import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { escrowService } from '@/lib/escrow.service'
import { z } from 'zod'

const disputeSchema = z.object({
  escrowId: z.string(),
  reason: z.string(),
  evidence: z.any().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { escrowId, reason, evidence } = disputeSchema.parse(body)

    const result = await escrowService.raiseDispute(escrowId, session.user.id, reason, evidence)
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to raise dispute' }, { status: 400 })
  }
}
