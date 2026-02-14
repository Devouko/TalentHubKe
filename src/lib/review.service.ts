import { prisma } from '@/lib/prisma'
import { ValidationError } from '@/app/types/api.types'

export interface ReviewData {
  rating: number
  comment?: string
  images?: string[]
  orderId?: string
  gigId?: string
  productId?: string
  sellerId?: string
}

export interface ReviewResponse {
  id: string
  rating: number
  comment?: string
  images: string[]
  isVerified: boolean
  createdAt: string
  reviewer: {
    id: string
    name: string
    image?: string
  }
  gig?: {
    id: string
    title: string
  }
  product?: {
    id: string
    title: string
  }
}

export interface SellerReviewData {
  sellerId: string
  rating: number
  comment?: string
  orderId?: string
}

export interface SellerReviewResponse {
  id: string
  rating: number
  comment?: string
  createdAt: string
  reviewer: {
    id: string
    name: string
    image?: string
  }
  order?: {
    id: string
    totalAmount: number
  }
}

export class ReviewService {
  static async createGigReview(userId: string, data: ReviewData): Promise<ReviewResponse> {
    if (!data.rating || data.rating < 1 || data.rating > 5) {
      throw new ValidationError('Rating must be between 1 and 5')
    }
    
    if (!data.gigId || !data.orderId) {
      throw new ValidationError('Gig ID and Order ID are required')
    }

    // Validate order exists and belongs to user
    const order = await prisma.order.findFirst({
      where: {
        id: data.orderId,
        buyerId: userId,
        gigId: data.gigId,
        status: 'COMPLETED'
      }
    })

    if (!order) {
      throw new ValidationError('Order not found or not eligible for review')
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: { orderId: data.orderId }
    })

    if (existingReview) {
      throw new ValidationError('Review already exists for this order')
    }

    const review = await prisma.review.create({
      data: {
        rating: data.rating,
        comment: data.comment,
        images: data.images || [],
        reviewerId: userId,
        gigId: data.gigId,
        orderId: data.orderId,
        isVerified: true
      },
      include: {
        reviewer: { select: { id: true, name: true, image: true } },
        gig: { select: { id: true, title: true } }
      }
    })

    // Update gig rating
    await this.updateGigRating(data.gigId)
    
    return {
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      images: review.images,
      isVerified: review.isVerified,
      createdAt: review.createdAt.toISOString(),
      reviewer: review.reviewer,
      gig: review.gig
    }
  }

  static async createProductReview(userId: string, data: ReviewData): Promise<ReviewResponse> {
    if (!data.rating || data.rating < 1 || data.rating > 5) {
      throw new ValidationError('Rating must be between 1 and 5')
    }
    
    if (!data.productId) {
      throw new ValidationError('Product ID is required')
    }

    const review = await prisma.productReview.create({
      data: {
        rating: data.rating,
        comment: data.comment || '',
        userId,
        productId: data.productId,
        isVerified: false
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
        product: { select: { id: true, title: true } }
      }
    })

    await this.updateProductRating(data.productId)
    
    return {
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      images: [],
      isVerified: review.isVerified,
      createdAt: review.createdAt.toISOString(),
      reviewer: review.user,
      product: review.product
    }
  }

  static async createSellerReview(userId: string, data: SellerReviewData): Promise<SellerReviewResponse> {
    if (!data.sellerId || !data.rating) {
      throw new ValidationError('Seller ID and rating are required')
    }
    
    if (data.rating < 1 || data.rating > 5) {
      throw new ValidationError('Rating must be between 1 and 5')
    }

    const review = await prisma.sellerReview.create({
      data: {
        sellerId: data.sellerId,
        reviewerId: userId,
        rating: data.rating,
        comment: data.comment,
        orderId: data.orderId
      },
      include: {
        reviewer: { select: { id: true, name: true, image: true } },
        order: { select: { id: true, totalAmount: true } }
      }
    })

    await this.updateSellerRating(data.sellerId)
    
    return {
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt.toISOString(),
      reviewer: review.reviewer,
      order: review.order
    }
  }

  static async getGigReviews(gigId: string, page = 1, limit = 10) {
    if (!gigId) throw new ValidationError('Gig ID is required')
    
    const [reviews, total, gig] = await Promise.all([
      prisma.review.findMany({
        where: { gigId },
        include: {
          reviewer: { select: { id: true, name: true, image: true } },
          gig: { select: { id: true, title: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.review.count({ where: { gigId } }),
      prisma.gig.findUnique({ where: { id: gigId }, select: { rating: true } })
    ])

    return {
      reviews: reviews.map(review => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        images: review.images,
        isVerified: review.isVerified,
        createdAt: review.createdAt.toISOString(),
        reviewer: review.reviewer,
        gig: review.gig
      })),
      total,
      averageRating: gig?.rating || 0
    }
  }

  static async getProductReviews(productId: string, page = 1, limit = 10) {
    if (!productId) throw new ValidationError('Product ID is required')
    
    const [reviews, total, product] = await Promise.all([
      prisma.productReview.findMany({
        where: { productId },
        include: {
          user: { select: { id: true, name: true, image: true } },
          product: { select: { id: true, title: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.productReview.count({ where: { productId } }),
      prisma.product.findUnique({ where: { id: productId }, select: { rating: true } })
    ])

    return {
      reviews: reviews.map(review => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        images: [],
        isVerified: review.isVerified,
        createdAt: review.createdAt.toISOString(),
        reviewer: review.user,
        product: review.product
      })),
      total,
      averageRating: product?.rating || 0
    }
  }

  static async getSellerReviews(sellerId: string) {
    if (!sellerId) throw new ValidationError('Seller ID is required')
    
    const [reviews, user] = await Promise.all([
      prisma.sellerReview.findMany({
        where: { sellerId },
        include: {
          reviewer: { select: { id: true, name: true, image: true } },
          order: { select: { id: true, totalAmount: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.findUnique({
        where: { id: sellerId },
        select: { sellerRating: true, sellerReviewCount: true }
      })
    ])

    return {
      reviews: reviews.map(review => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt.toISOString(),
        reviewer: review.reviewer,
        order: review.order
      })),
      averageRating: user?.sellerRating || 0,
      totalReviews: user?.sellerReviewCount || 0
    }
  }

  private static async updateGigRating(gigId: string) {
    const stats = await prisma.review.aggregate({
      where: { gigId },
      _avg: { rating: true },
      _count: { rating: true }
    })

    await prisma.gig.update({
      where: { id: gigId },
      data: {
        rating: Math.round((stats._avg.rating || 0) * 10) / 10,
        reviewCount: stats._count.rating
      }
    })
  }

  private static async updateProductRating(productId: string) {
    const stats = await prisma.productReview.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true }
    })

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: Math.round((stats._avg.rating || 0) * 10) / 10,
        reviewCount: stats._count.rating
      }
    })
  }

