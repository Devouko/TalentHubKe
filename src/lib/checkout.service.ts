import { prisma } from '@/lib/prisma'
import { CartItem } from './cart.service'
import { BaseService } from './base.service'
import { ValidationError } from '@/app/types/api.types'

export interface CheckoutData {
  items: CartItem[]
  total: number
  phoneNumber: string
  userId?: string
}

export interface OrderData {
  id: string
  items: CartItem[]
  totalAmount: number
  phoneNumber: string
  status: OrderStatus
  createdAt: string
}

export interface PaymentData {
  id: string
  orderId: string
  amount: number
  phoneNumber: string
  status: PaymentStatus
  checkoutRequestId?: string
  merchantRequestId?: string
  mpesaReceiptNumber?: string
  transactionDate?: string
  failureReason?: string
}

export type OrderStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED'
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED'

interface PaymentUpdateData {
  mpesaReceiptNumber?: string
  transactionDate?: string
  failureReason?: string
}

export class CheckoutService extends BaseService {
  private static readonly VALID_PAYMENT_STATUSES: PaymentStatus[] = ['SUCCESS', 'FAILED']
  private static readonly STATUS_MAPPING: Record<PaymentStatus, OrderStatus> = {
    SUCCESS: 'COMPLETED',
    FAILED: 'CANCELLED',
    PENDING: 'PENDING'
  }

  static async createOrderWithPayment(data: CheckoutData): Promise<{
    order: OrderData
    payment: PaymentData
  }> {
    return this.executeWithTracking('createOrderWithPayment', async () => {
      this.validateCheckoutData(data)
      
      const [orderId, paymentId] = [this.ID_GENERATORS.order(), this.ID_GENERATORS.payment()]
      const userId = data.userId || await this.getOrCreateUser(data.phoneNumber)

      return await prisma.$transaction(async (tx) => {
        const order = await tx.orders.create({
          data: {
            id: orderId,
            status: 'PENDING',
            totalAmount: data.total,
            buyerId: userId,
            phoneNumber: data.phoneNumber,
            requirements: JSON.stringify({
              items: data.items,
              phoneNumber: data.phoneNumber
            })
          }
        })

        const payment = await tx.payments.create({
          data: { id: paymentId, orderId, amount: data.total, phoneNumber: data.phoneNumber, status: 'PENDING' }
        })

        return {
          order: this.formatOrderData(order, data.items),
          payment: this.formatPaymentData(payment)
        }
      })
    }, { total: data.total })
  }

  static async updatePaymentStatus(
    checkoutRequestId: string,
    status: PaymentStatus,
    data: PaymentUpdateData
  ): Promise<void> {
    this.validatePaymentUpdate(checkoutRequestId, status)
    
    const payment = await this.getValidPayment(checkoutRequestId)
    await this.updatePaymentAndOrder(payment, status, data)
  }

  static async findPaymentByCheckoutId(checkoutRequestId: string): Promise<PaymentData | null> {
    this.validateRequired({ checkoutRequestId })
    const payment = await this.findPaymentByCheckoutRequestId(checkoutRequestId)
    return payment ? this.formatPaymentData(payment) : null
  }

  private static validateCheckoutData(data: CheckoutData): void {
    this.validateRequired({ 
      items: data.items, 
      phoneNumber: data.phoneNumber, 
      total: data.total 
    })
    
    if (!data.items?.length) {
      throw new ValidationError('Cart is empty')
    }
    
    this.validateNumeric({ total: data.total })
  }

  private static validatePaymentUpdate(checkoutRequestId: string, status: PaymentStatus): void {
    this.validateRequired({ checkoutRequestId, status })
    
    if (!this.VALID_PAYMENT_STATUSES.includes(status)) {
      throw new ValidationError('Invalid payment status')
    }
  }

  private static async getValidPayment(checkoutRequestId: string) {
    const payment = await this.findPaymentByCheckoutRequestId(checkoutRequestId)
    
    if (!payment) {
      throw new ValidationError('Payment not found')
    }

    if (payment.status !== 'PENDING') {
      throw new ValidationError('Payment already processed')
    }

    return payment
  }

  private static formatOrderData(order: any, items: CartItem[]): OrderData {
    return {
      id: order.id,
      items,
      totalAmount: order.totalAmount,
      phoneNumber: order.phoneNumber,
      status: order.status as OrderStatus,
      createdAt: order.createdAt.toISOString()
    }
  }

  private static formatPaymentData(payment: any): PaymentData {
    const optionalFields = ['checkoutRequestId', 'merchantRequestId', 'mpesaReceiptNumber', 'transactionDate', 'failureReason']
    
    return this.formatOptionalFields(payment, {
      id: payment.id,
      orderId: payment.orderId,
      amount: payment.amount,
      phoneNumber: payment.phoneNumber,
      status: payment.status as PaymentStatus
    }, optionalFields)
  }

  private static async findPaymentByCheckoutRequestId(checkoutRequestId: string) {
    return prisma.payments.findFirst({
      where: { checkoutRequestId }
    })
  }

  private static async updatePaymentAndOrder(
    payment: { id: string; orderId: string },
    status: PaymentStatus,
    data: PaymentUpdateData
  ): Promise<void> {
    await prisma.$transaction([
      prisma.payments.update({
        where: { id: payment.id },
        data: { status, ...data }
      }),
      prisma.orders.update({
        where: { id: payment.orderId },
        data: { status: this.STATUS_MAPPING[status] }
      })
    ])
  }
}