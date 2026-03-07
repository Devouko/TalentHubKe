import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { escrowService } from '@/lib/escrow.service'
import { z } from 'zod'

const cancelSchema = z.object({
  escrowId: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { escrowId } = cancelSchema.parse(body)

    const escrow = await escrowService.cancelEscrow(escrowId, session.user.id)
    return NextResponse.json(escrow)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to cancel escrow' }, { status: 400 })
  }
}
