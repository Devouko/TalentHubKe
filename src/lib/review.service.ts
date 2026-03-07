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

    const order = await prisma.orders.findFirst({
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

    const existingReview = await prisma.reviews.findUnique({
      where: { orderId: data.orderId }
    })

    if (existingReview) {
      throw new ValidationError('Review already exists for this order')
    }

    const review = await prisma.reviews.create({
      data: {
        rating: data.rating,
        comment: data.comment || '',
        images: data.images || [],
        reviewerId: userId,
        gigId: data.gigId,
        orderId: data.orderId,
        isVerified: true,
        createdAt: new Date()
      }
    })

    const [reviewer, gig] = await Promise.all([
      prisma.users.findUnique({ where: { id: userId }, select: { id: true, name: true, image: true } }),
      prisma.gigs.findUnique({ where: { id: data.gigId }, select: { id: true, title: true } })
    ])

    await this.updateGigRating(data.gigId)
    
    return {
      id: review.id,
      rating: review.rating,
      comment: review.comment || '',
      images: review.images,
      isVerified: review.isVerified,
      createdAt: review.createdAt.toISOString(),
      reviewer: reviewer!,
      gig: gig || undefined
    }
  }

  static async createProductReview(userId: string, data: ReviewData): Promise<ReviewResponse> {
    if (!data.rating || data.rating < 1 || data.rating > 5) {
      throw new ValidationError('Rating must be between 1 and 5')
    }
    
    if (!data.productId) {
      throw new ValidationError('Product ID is required')
    }

    const review = await prisma.product_reviews.create({
      data: {
        rating: data.rating,
        comment: data.comment || '',
        userId,
        productId: data.productId,
        isVerified: false,
        createdAt: new Date()
      }
    })

    const [user, product] = await Promise.all([
      prisma.users.findUnique({ where: { id: userId }, select: { id: true, name: true, image: true } }),
      prisma.products.findUnique({ where: { id: data.productId }, select: { id: true, title: true } })
    ])

    await this.updateProductRating(data.productId)
    
    return {
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      images: [],
      isVerified: review.isVerified,
      createdAt: review.createdAt.toISOString(),
      reviewer: user!,
      product: product || undefined
    }
  }

  static async createSellerReview(userId: string, data: SellerReviewData): Promise<SellerReviewResponse> {
    if (!data.sellerId || !data.rating) {
      throw new ValidationError('Seller ID and rating are required')
    }
    
    if (data.rating < 1 || data.rating > 5) {
      throw new ValidationError('Rating must be between 1 and 5')
    }

    const review = await prisma.seller_reviews.create({
      data: {
        sellerId: data.sellerId,
        reviewerId: userId,
        rating: data.rating,
        comment: data.comment || '',
        orderId: data.orderId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    const [reviewer, order] = await Promise.all([
      prisma.users.findUnique({ where: { id: userId }, select: { id: true, name: true, image: true } }),
      data.orderId ? prisma.orders.findUnique({ where: { id: data.orderId }, select: { id: true, totalAmount: true } }) : Promise.resolve(null)
    ])

    await this.updateSellerRating(data.sellerId)
    
    return {
      id: review.id,
      rating: review.rating,
      comment: review.comment || '',
      createdAt: review.createdAt.toISOString(),
      reviewer: reviewer!,
      order: order || undefined
    }
  }

  static async getGigReviews(gigId: string, page = 1, limit = 10) {
    if (!gigId) throw new ValidationError('Gig ID is required')
    
    const [reviews, total, gig] = await Promise.all([
      prisma.reviews.findMany({
        where: { gigId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.reviews.count({ where: { gigId } }),
      prisma.gigs.findUnique({ where: { id: gigId }, select: { rating: true } })
    ])

    const reviewerIds = reviews.map(r => r.reviewerId)
    const reviewers = await prisma.users.findMany({
      where: { id: { in: reviewerIds } },
      select: { id: true, name: true, image: true }
    })
    const reviewerMap = new Map(reviewers.map(r => [r.id, r]))

    const gigData = await prisma.gigs.findUnique({ where: { id: gigId }, select: { id: true, title: true } })

    return {
      reviews: reviews.map(review => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment || '',
        images: review.images,
        isVerified: review.isVerified,
        createdAt: review.createdAt.toISOString(),
        reviewer: reviewerMap.get(review.reviewerId)!,
        gig: gigData || undefined
      })),
      total,
      averageRating: gig?.rating || 0
    }
  }

  static async getProductReviews(productId: string, page = 1, limit = 10) {
    if (!productId) throw new ValidationError('Product ID is required')
    
    const [reviews, total, product] = await Promise.all([
      prisma.product_reviews.findMany({
        where: { productId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.product_reviews.count({ where: { productId } }),
      prisma.products.findUnique({ where: { id: productId }, select: { rating: true } })
    ])

    const userIds = reviews.map(r => r.userId)
    const users = await prisma.users.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, image: true }
    })
    const userMap = new Map(users.map(u => [u.id, u]))

    const productData = await prisma.products.findUnique({ where: { id: productId }, select: { id: true, title: true } })

    return {
      reviews: reviews.map(review => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        images: [],
        isVerified: review.isVerified,
        createdAt: review.createdAt.toISOString(),
        reviewer: userMap.get(review.userId)!,
        product: productData || undefined
      })),
      total,
      averageRating: product?.rating || 0
    }
  }

  static async getSellerReviews(sellerId: string) {
    if (!sellerId) throw new ValidationError('Seller ID is required')
    
    const [reviews, user] = await Promise.all([
      prisma.seller_reviews.findMany({
        where: { sellerId },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.users.findUnique({
        where: { id: sellerId },
        select: { sellerRating: true, sellerReviewCount: true }
      })
    ])

    const reviewerIds = reviews.map(r => r.reviewerId)
    const orderIds = reviews.filter(r => r.orderId).map(r => r.orderId!)
    
    const [reviewers, orders] = await Promise.all([
      prisma.users.findMany({
        where: { id: { in: reviewerIds } },
        select: { id: true, name: true, image: true }
      }),
      orderIds.length > 0 ? prisma.orders.findMany({
        where: { id: { in: orderIds } },
        select: { id: true, totalAmount: true }
      }) : Promise.resolve([])
    ])

    const reviewerMap = new Map(reviewers.map(r => [r.id, r]))
    const orderMap = new Map(orders.map(o => [o.id, o]))

    return {
      reviews: reviews.map(review => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment || '',
        createdAt: review.createdAt.toISOString(),
        reviewer: reviewerMap.get(review.reviewerId)!,
        order: review.orderId ? orderMap.get(review.orderId) : undefined
      })),
      averageRating: user?.sellerRating || 0,
      totalReviews: user?.sellerReviewCount || 0
    }
  }

  private static async updateGigRating(gigId: string) {
    const stats = await prisma.reviews.aggregate({
      where: { gigId },
      _avg: { rating: true },
      _count: { rating: true }
    })

    await prisma.gigs.update({
      where: { id: gigId },
      data: {
        rating: Math.round((stats._avg.rating || 0) * 10) / 10,
        reviewCount: stats._count.rating
      }
    })
  }

  private static async updateProductRating(productId: string) {
    const stats = await prisma.product_reviews.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true }
    })

    await prisma.products.update({
      where: { id: productId },
      data: {
        rating: Math.round((stats._avg.rating || 0) * 10) / 10,
        reviewCount: stats._count.rating
      }
    })
  }

  private static async updateSellerRating(sellerId: string) {
    const stats = await prisma.seller_reviews.aggregate({
      where: { sellerId },
      _avg: { rating: true },
      _count: { rating: true }
    })

    await prisma.users.update({
      where: { id: sellerId },
      data: {
        sellerRating: Math.round((stats._avg.rating || 0) * 10) / 10,
        sellerReviewCount: stats._count.rating
      }
    })
  }
}
