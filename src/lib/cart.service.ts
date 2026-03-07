import { prisma } from '@/lib/prisma'
import { BaseService } from './base.service'
import { ValidationError } from '@/app/types/api.types'

export interface CartItem {
  id: string
  title: string
  price: number
  quantity: number
  images: string[]
  category: string
}

export class CartService extends BaseService {
  static async addToCart(userId: string, productId: string, quantity: number = 1) {
    const product = await this.validateProduct(productId)
    this.validateStock(product, quantity)

    return {
      id: product.id,
      title: product.title,
      price: product.price,
      quantity,
      images: product.images,
      category: product.category
    }
  }

  static async updateQuantity(userId: string, productId: string, quantity: number) {
    if (quantity <= 0) {
      return this.removeFromCart(userId, productId)
    }

    const product = await prisma.products.findUnique({
      where: { id: productId },
      select: { stock: true }
    })

    if (!product) {
      throw new ValidationError('Product not found')
    }

    this.validateStock(product, quantity)
    return { success: true, quantity }
  }

  static async removeFromCart(userId: string, productId: string) {
    return { success: true, removed: productId }
  }

  static calculateTotal(items: CartItem[]) {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    return {
      subtotal,
      fees: 0,
      total: subtotal
    }
  }

  static validateCart(items: CartItem[]) {
    if (!items?.length) {
      throw new ValidationError('Cart is empty')
    }

    const total = this.calculateTotal(items).total
    this.validateNumeric({ total })
    return true
  }
}