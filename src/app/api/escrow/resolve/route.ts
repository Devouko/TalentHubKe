import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { escrowService } from '@/lib/escrow.service'
import { z } from 'zod'

const resolveSchema = z.object({
  escrowId: z.string(),
  decision: z.enum(['RELEASE', 'REFUND']),
  notes: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.userType !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 403 })
    }

    const body = await req.json()
    const { escrowId, decision, notes } = resolveSchema.parse(body)

    const escrow = await escrowService.resolveDispute(escrowId, session.user.id, decision, notes)
    return NextResponse.json(escrow)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to resolve dispute' }, { status: 400 })
  }
}
