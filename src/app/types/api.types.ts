// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Order Types
export type OrderStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'PROCESSING'
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED'
export type UserType = 'CLIENT' | 'FREELANCER' | 'AGENCY' | 'ADMIN'

export interface CreateOrderRequest {
  items: CartItem[]
  total: number
  shippingAddress?: string
  phoneNumber: string
}

export interface CreateOrderResponse {
  success: boolean
  order?: {
    id: string
    items: CartItem[]
    totalAmount: number
    shippingAddress?: string
    phoneNumber: string
    status: OrderStatus
    createdAt: string
  }
  error?: string
}

// Product Types
export interface ProductActionRequest {
  action: 'addToCart' | 'wishlist' | 'review'
  productId: string
  quantity?: number
  rating?: number
  title?: string
  comment?: string
}

export interface CartItem {
  id: string
  productId: string
  title: string
  price: number
  quantity: number
  images?: string[]
  category?: string
}

// Payment Types
export interface PaymentUpdateRequest {
  checkoutRequestId: string
  status: PaymentStatus
  mpesaReceiptNumber?: string
  transactionDate?: string
  failureReason?: string
}

// Error Types
export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication required') {
    super(message)
    this.name = 'AuthenticationError'
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NotFoundError'
  }
}