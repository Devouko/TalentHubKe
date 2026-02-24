import { z } from 'zod'

export const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(100, 'Quantity cannot exceed 100')
})

export const removeFromCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required')
})

export type AddToCartInput = z.infer<typeof addToCartSchema>
export type RemoveFromCartInput = z.infer<typeof removeFromCartSchema>