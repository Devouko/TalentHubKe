import { UserType, SellerStatus, StockStatus, StockChangeType } from '@prisma/client'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface User {
  id: string
  email: string
  name: string | null
  userType: UserType
  image: string | null
  profileImage: string | null
  isVerified: boolean
  sellerStatus: SellerStatus
}

export interface Product {
  id: string
  name: string
  slug: string
  sku: string
  description: string
  price: number
  quantity: number
  stockStatus: StockStatus
  isActive: boolean
  categoryId?: string | null
  images?: ProductImage[]
  category?: ProductCategory | null
}

export interface ProductImage {
  id: string
  url: string
  alt?: string | null
  position: number
}

export interface ProductCategory {
  id: string
  name: string
  slug: string
  isActive: boolean
}

export interface StockHistory {
  id: string
  changeType: StockChangeType
  quantityChange: number
  previousQuantity: number
  newQuantity: number
  reason?: string | null
  createdAt: Date
}

export interface ProductFilters {
  search?: string
  categoryId?: string
  stockStatus?: StockStatus
  isActive?: boolean
  page?: number
  limit?: number
}
