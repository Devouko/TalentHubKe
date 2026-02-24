import { z } from 'zod'

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200),
  slug: z.string().min(1, 'Slug is required').optional(),
  sku: z.string().min(1, 'SKU is required').optional(),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  shortDescription: z.string().optional().nullable(),
  price: z.coerce.number().positive('Price must be positive'),
  comparePrice: z.coerce.number().positive().optional().nullable(),
  costPrice: z.coerce.number().positive().optional().nullable(),
  quantity: z.coerce.number().int().min(0, 'Quantity cannot be negative'),
  lowStockThreshold: z.coerce.number().int().min(0).optional().nullable(),
  trackInventory: z.boolean().optional().default(true),
  isDigital: z.boolean().optional().default(false),
  categoryId: z.string().min(1, 'Category is required'),
  brand: z.string().max(100).optional().nullable(),
  images: z.array(z.object({
    url: z.string(),
    alt: z.string().optional(),
    position: z.number().optional()
  })).min(1, 'At least one image is required'),
  tags: z.array(z.string()).optional().default([]),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false)
})

export const updateProductSchema = createProductSchema.partial()

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
