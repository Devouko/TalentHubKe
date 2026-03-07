import { NextRequest } from 'next/server'
import { escrowService } from '@/lib/escrow.service'
import { z } from 'zod'
import { handleApiError, requireAuth, apiResponse } from '@/lib/api-utils'

const deliverSchema = z.object({
  escrowId: z.string(),
  proofOfDelivery: z.any(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await req.json()
    const { escrowId, proofOfDelivery } = deliverSchema.parse(body)

    const escrow = await escrowService.markDelivered(escrowId, session.user.id, proofOfDelivery)
    return apiResponse(escrow)
  } catch (error: any) {
    return handleApiError(error)
  }
}
