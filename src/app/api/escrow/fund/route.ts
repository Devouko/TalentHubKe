import { NextRequest, NextResponse } from 'next/server'
import { escrowService } from '@/lib/escrow.service'
import { z } from 'zod'

const fundSchema = z.object({
  escrowId: z.string(),
  paymentRef: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { escrowId, paymentRef } = fundSchema.parse(body)

    const escrow = await escrowService.fundEscrow(escrowId, paymentRef)
    return NextResponse.json(escrow)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fund escrow' }, { status: 400 })
  }
}
