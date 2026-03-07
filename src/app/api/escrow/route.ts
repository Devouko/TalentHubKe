import { NextRequest } from 'next/server'
import { escrowService } from '@/lib/escrow.service'
import { z } from 'zod'
import { handleApiError, requireAuth, apiResponse } from '@/lib/api-utils'

const initiateSchema = z.object({
  sellerId: z.string(),
  orderId: z.string(),
  amount: z.number().positive(),
  currency: z.string().optional(),
  productId: z.string().optional(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().positive(),
    price: z.number().positive(),
  })).optional(),
  metadata: z.record(z.any()).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await req.json()
    const data = initiateSchema.parse(body)

    const escrow = await escrowService.initiate({
      buyerId: session.user.id,
      ...data,
    })

    return apiResponse(escrow, 201)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function GET() {
  try {
    const session = await requireAuth()
    const transactions = await escrowService.getUserTransactions(session.user.id)
    return apiResponse(transactions)
  } catch (error) {
    return handleApiError(error)
  }
}
