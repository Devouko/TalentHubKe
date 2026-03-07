import { prisma } from './prisma'
import { ProductFilters } from '@/types'

export async function fetchProducts(filters: ProductFilters) {
  const {
    search,
    categoryId,
    stockStatus,
    isActive,
    page = 1,
    limit = 20
  } = filters

  const where: any = { deletedAt: null }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ]
  }

  if (categoryId) where.categoryId = categoryId
  if (stockStatus) where.stockStatus = stockStatus
  if (isActive !== undefined) where.isActive = isActive

  const [products, total] = await Promise.all([
    prisma.products.findMany({
      where,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { position: 'asc' }, take: 5 }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.products.count({ where })
  ])

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
}

export async function fetchProductById(id: string) {
  return prisma.products.findFirst({
    where: { id, deletedAt: null },
    include: {
      category: true,
      images: { orderBy: { position: 'asc' } },
      createdBy: { select: { id: true, name: true, email: true } },
      updatedBy: { select: { id: true, name: true, email: true } },
      stockHistory: {
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: { select: { id: true, name: true } }
        }
      }
    }
  })
}
