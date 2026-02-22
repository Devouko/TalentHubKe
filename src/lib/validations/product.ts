import { z } from 'zod'

export const productCategorySchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  isActive: z.boolean().default(true)
})

export const productSchema = z.object({
  name: z.string().min(2).max(200),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/),
  sku: z.string().min(2).max(50).regex(/^[A-Z0-9-]+$/),
  description: z.string().min(10),
  shortDescription: z.string().max(500).optional(),
  price: z.number().positive(),
  comparePrice: z.number().positive().optional(),
  costPrice: z.number().positive().optional(),
  quantity: z.number().int().min(0).default(0),
  lowStockThreshold: z.number().int().min(0).default(10),
  trackInventory: z.boolean().default(true),
  isDigital: z.boolean().default(false),
  categoryId: z.string().optional(),
  brand: z.string().max(100).optional(),
  tags: z.array(z.string().max(30)).max(10).default([]),
  metaTitle: z.string().max(200).optional(),
  metaDescription: z.string().max(500).optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  images: z.array(z.object({
    url: z.string().url(),
    alt: z.string().optional(),
    position: z.number().int().min(0).default(0)
  })).max(10).default([])
})

export const updateProductSchema = productSchema.partial()

export const stockAdjustmentSchema = z.object({
  changeType: z.enum(['INITIAL', 'PURCHASE', 'SALE', 'RETURN', 'ADJUSTMENT', 'DAMAGE', 'TRANSFER']),
  quantityChange: z.number().int(),
  reason: z.string().optional(),
  notes: z.string().optional()
})

export const bulkStockUpdateSchema = z.object({
  updates: z.array(z.object({
    productId: z.string(),
    quantityChange: z.number().int(),
    changeType: z.enum(['ADJUSTMENT', 'PURCHASE', 'DAMAGE']),
    reason: z.string().optional()
  })).max(100)
})

export const productFilterSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  stockStatus: z.enum(['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK', 'DISCONTINUED']).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  sortBy: z.string().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20)
})

export type ProductCategory = z.infer<typeof productCategorySchema>
export type Product = z.infer<typeof productSchema>
export type StockAdjustment = z.infer<typeof stockAdjustmentSchema>
