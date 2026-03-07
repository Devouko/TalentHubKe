import { NextRequest } from 'next/server'
import { escrowService } from '@/lib/escrow.service'
import { z } from 'zod'
import { handleApiError, requireAuth, apiResponse } from '@/lib/api-utils'

const confirmSchema = z.object({
  escrowId: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await req.json()
    const { escrowId } = confirmSchema.parse(body)

    const escrow = await escrowService.confirmDelivery(escrowId, session.user.id)
    return apiResponse(escrow)
  } catch (error: any) {
    return handleApiError(error)
  }
}
