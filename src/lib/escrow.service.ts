import { prisma } from './prisma'
import { Prisma } from '@prisma/client'

export enum EscrowStatus {
  INITIATED = 'INITIATED',
  FUNDED = 'FUNDED',
  IN_PROGRESS = 'IN_PROGRESS',
  DELIVERED = 'DELIVERED',
  DISPUTED = 'DISPUTED',
  RELEASED = 'RELEASED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

const PLATFORM_FEE = 0.025 // 2.5%
const CONFIRMATION_WINDOW_DAYS = 3
const DELIVERY_WINDOW_DAYS = 7

interface InitiateEscrowParams {
  buyerId: string
  sellerId: string
  orderId: string
  amount: number
  productId?: string
  items?: any[]
  metadata?: Record<string, any>
}

export class EscrowService {
  private addDays(date: Date, days: number): Date {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  }

  private async logEvent(escrowId: string, event: string, actor: string, data?: any) {
    await prisma.escrow_audit_logs.create({
      data: {
        id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        escrowId,
        event,
        actor,
        data: data || {},
        timestamp: new Date(),
      },
    })
  }

  private assertStatus(escrow: any, expected: EscrowStatus) {
    if (escrow.status !== expected) {
      throw new Error(`Expected status ${expected}, got ${escrow.status}`)
    }
  }

  private async getAndAssertOwner(escrowId: string, userId: string, role: 'buyer' | 'seller') {
    const escrow = await prisma.escrow_transactions.findUnique({ where: { id: escrowId } })
    if (!escrow) throw new Error('Escrow not found')
    const field = role === 'buyer' ? 'buyerId' : 'sellerId'
    if (escrow[field] !== userId) throw new Error(`Unauthorized: not the ${role}`)
    return escrow
  }

  // STEP 1: Buyer initiates escrow
  async initiate(params: InitiateEscrowParams) {
    const { buyerId, sellerId, orderId, amount, productId, items = [], metadata = {} } = params

    const escrow = await prisma.escrow_transactions.create({
      data: {
        id: `esc_${Date.now()}`,
        buyerId,
        sellerId,
        orderId,
        productId,
        amount,
        platformFeePercent: PLATFORM_FEE,
        status: EscrowStatus.INITIATED,
        metadata,
        expiresAt: this.addDays(new Date(), DELIVERY_WINDOW_DAYS + 5),
        deliveryDeadline: this.addDays(new Date(), DELIVERY_WINDOW_DAYS),
        confirmationDeadline: this.addDays(new Date(), DELIVERY_WINDOW_DAYS + CONFIRMATION_WINDOW_DAYS),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    // Create escrow items
    for (const item of items) {
      await prisma.escrow_items.create({
        data: {
          id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          transactionId: escrow.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        },
      })
    }

    await this.logEvent(escrow.id, 'INITIATED', buyerId, { amount })
    return escrow
  }

  // STEP 2: Payment gateway confirms funds locked
  async fundEscrow(escrowId: string, paymentRef: string) {
    return await prisma.$transaction(async (tx) => {
      const escrow = await tx.escrow_transactions.findUnique({
        where: { id: escrowId },
      })

      if (!escrow) throw new Error('Escrow not found')
      this.assertStatus(escrow, EscrowStatus.INITIATED)

      const updated = await tx.escrow_transactions.update({
        where: { id: escrowId },
        data: {
          status: EscrowStatus.FUNDED,
          paymentRef,
          fundedAt: new Date(),
          updatedAt: new Date(),
        },
      })

      await this.logEvent(escrowId, 'FUNDED', 'system', { paymentRef })
      return updated
    })
  }

  // STEP 3: Seller marks as delivered
  async markDelivered(escrowId: string, sellerId: string, proofOfDelivery: any) {
    const escrow = await this.getAndAssertOwner(escrowId, sellerId, 'seller')
    this.assertStatus(escrow, EscrowStatus.FUNDED)

    const updated = await prisma.escrow_transactions.update({
      where: { id: escrowId },
      data: {
        status: EscrowStatus.DELIVERED,
        deliveredAt: new Date(),
        proofOfDelivery,
        confirmationDeadline: this.addDays(new Date(), CONFIRMATION_WINDOW_DAYS),
        updatedAt: new Date(),
      },
    })

    await this.logEvent(escrowId, 'DELIVERED', sellerId, { proofOfDelivery })
    return updated
  }

  // STEP 4a: Buyer confirms delivery
  async confirmDelivery(escrowId: string, buyerId: string) {
    const escrow = await this.getAndAssertOwner(escrowId, buyerId, 'buyer')
    this.assertStatus(escrow, EscrowStatus.DELIVERED)
    return await this.releaseFunds(escrowId, buyerId, 'buyer_confirmed')
  }

  // STEP 4b: Auto-release if buyer silent
  async autoRelease(escrowId: string) {
    const escrow = await prisma.escrow_transactions.findUnique({ where: { id: escrowId } })
    if (!escrow || escrow.status !== EscrowStatus.DELIVERED) return
    if (new Date() < escrow.confirmationDeadline) return
    return await this.releaseFunds(escrowId, 'system', 'auto_released')
  }

  // STEP 4c: Buyer raises dispute
  async raiseDispute(escrowId: string, buyerId: string, reason: string, evidence?: any) {
    const escrow = await this.getAndAssertOwner(escrowId, buyerId, 'buyer')

    if (![EscrowStatus.FUNDED, EscrowStatus.DELIVERED].includes(escrow.status as EscrowStatus)) {
      throw new Error(`Cannot dispute escrow in status: ${escrow.status}`)
    }

    const [updatedEscrow, dispute] = await prisma.$transaction([
      prisma.escrow_transactions.update({
        where: { id: escrowId },
        data: { status: EscrowStatus.DISPUTED, updatedAt: new Date() },
      }),
      prisma.escrow_disputes.create({
        data: {
          id: `disp_${Date.now()}`,
          escrowId,
          raisedBy: buyerId,
          reason,
          evidence: evidence || {},
          status: 'OPEN',
          createdAt: new Date(),
        },
      }),
    ])

    await this.logEvent(escrowId, 'DISPUTED', buyerId, { reason })
    return { escrow: updatedEscrow, dispute }
  }

  // STEP 5: Admin resolves dispute
  async resolveDispute(
    escrowId: string,
    adminId: string,
    decision: 'RELEASE' | 'REFUND',
    notes: string
  ) {
    const escrow = await prisma.escrow_transactions.findUnique({ where: { id: escrowId } })
    if (!escrow) throw new Error('Escrow not found')
    this.assertStatus(escrow, EscrowStatus.DISPUTED)

    await prisma.escrow_disputes.update({
      where: { escrowId },
      data: {
        status: 'RESOLVED',
        resolvedBy: adminId,
        resolution: decision,
        notes,
        resolvedAt: new Date(),
      },
    })

    await this.logEvent(escrowId, 'DISPUTE_RESOLVED', adminId, { decision, notes })

    if (decision === 'RELEASE') return await this.releaseFunds(escrowId, adminId, 'admin_resolved_release')
    if (decision === 'REFUND') return await this.processRefund(escrowId, adminId, 'admin_resolved_refund')
  }

  // INTERNAL: Release funds to seller
  private async releaseFunds(escrowId: string, triggeredBy: string, reason: string) {
    return await prisma.$transaction(async (tx) => {
      const escrow = await tx.escrow_transactions.findUnique({ where: { id: escrowId } })
      if (!escrow) throw new Error('Escrow not found')

      const platformFee = escrow.amount * escrow.platformFeePercent
      const sellerPayout = escrow.amount - platformFee

      // Credit seller wallet
      if (escrow.sellerId) {
        await tx.users.update({
          where: { id: escrow.sellerId },
          data: { balance: { increment: sellerPayout } },
        })
      }

      const updated = await tx.escrow_transactions.update({
        where: { id: escrowId },
        data: {
          status: EscrowStatus.RELEASED,
          releasedAt: new Date(),
          platformFee,
          sellerPayout,
          updatedAt: new Date(),
        },
      })

      await this.logEvent(escrowId, 'RELEASED', triggeredBy, { reason, sellerPayout, platformFee })
      return updated
    })
  }

  // INTERNAL: Refund buyer
  private async processRefund(escrowId: string, triggeredBy: string, reason: string) {
    return await prisma.$transaction(async (tx) => {
      const escrow = await tx.escrow_transactions.findUnique({ where: { id: escrowId } })
      if (!escrow) throw new Error('Escrow not found')

      await tx.users.update({
        where: { id: escrow.buyerId },
        data: { balance: { increment: escrow.amount } },
      })

      const updated = await tx.escrow_transactions.update({
        where: { id: escrowId },
        data: {
          status: EscrowStatus.REFUNDED,
          refundedAt: new Date(),
          updatedAt: new Date(),
        },
      })

      await this.logEvent(escrowId, 'REFUNDED', triggeredBy, { reason })
      return updated
    })
  }

  // Cancel escrow before funding
  async cancelEscrow(escrowId: string, userId: string) {
    const escrow = await prisma.escrow_transactions.findUnique({ where: { id: escrowId } })
    if (!escrow) throw new Error('Escrow not found')
    if (escrow.buyerId !== userId && escrow.sellerId !== userId) {
      throw new Error('Unauthorized')
    }
    if (escrow.status !== EscrowStatus.INITIATED) {
      throw new Error('Can only cancel initiated escrows')
    }

    const updated = await prisma.escrow_transactions.update({
      where: { id: escrowId },
      data: { status: EscrowStatus.CANCELLED, updatedAt: new Date() },
    })

    await this.logEvent(escrowId, 'CANCELLED', userId, {})
    return updated
  }

  // Expire stale escrows
  async expireStaleEscrows() {
    const now = new Date()
    const staleEscrows = await prisma.escrow_transactions.findMany({
      where: {
        expiresAt: { lt: now },
        status: { in: [EscrowStatus.INITIATED, EscrowStatus.FUNDED] },
      },
    })

    for (const escrow of staleEscrows) {
      await prisma.escrow_transactions.update({
        where: { id: escrow.id },
        data: { status: EscrowStatus.EXPIRED, updatedAt: new Date() },
      })
      await this.logEvent(escrow.id, 'EXPIRED', 'system', {})
    }

    return staleEscrows.length
  }

  // Get transaction details
  async getTransaction(escrowId: string) {
    return await prisma.escrow_transactions.findUnique({
      where: { id: escrowId },
      include: {
        users_escrow_transactions_buyerIdTousers: true,
        users_escrow_transactions_sellerIdTousers: true,
        products: true,
        escrow_items: true,
        escrow_audit_logs: { orderBy: { timestamp: 'desc' } },
        escrow_disputes: true,
      },
    })
  }

  // Get user transactions
  async getUserTransactions(userId: string) {
    return await prisma.escrow_transactions.findMany({
      where: { OR: [{ buyerId: userId }, { sellerId: userId }] },
      include: {
        products: true,
        escrow_items: true,
        escrow_disputes: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  // Get all transactions (admin)
  async getAllTransactions() {
    return await prisma.escrow_transactions.findMany({
      include: {
        users_escrow_transactions_buyerIdTousers: true,
        users_escrow_transactions_sellerIdTousers: true,
        products: true,
        escrow_disputes: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  // Get audit logs
  async getAuditLogs(escrowId: string) {
    return await prisma.escrow_audit_logs.findMany({
      where: { escrowId },
      orderBy: { timestamp: 'desc' },
    })
  }

  // Approve escrow (seller accepts)
  async approve(escrowId: string) {
    const escrow = await prisma.escrow_transactions.findUnique({ where: { id: escrowId } })
    if (!escrow) throw new Error('Escrow not found')
    
    if (escrow.status !== EscrowStatus.INITIATED) {
      throw new Error(`Cannot approve escrow in status: ${escrow.status}`)
    }

    const updated = await prisma.escrow_transactions.update({
      where: { id: escrowId },
      data: {
        status: EscrowStatus.IN_PROGRESS,
        updatedAt: new Date(),
      },
    })

    await this.logEvent(escrowId, 'APPROVED', escrow.sellerId, {})
    return updated
  }

  // Reject escrow (seller declines)
  async reject(escrowId: string) {
    const escrow = await prisma.escrow_transactions.findUnique({ where: { id: escrowId } })
    if (!escrow) throw new Error('Escrow not found')
    
    if (escrow.status !== EscrowStatus.INITIATED) {
      throw new Error(`Cannot reject escrow in status: ${escrow.status}`)
    }

    const updated = await prisma.escrow_transactions.update({
      where: { id: escrowId },
      data: {
        status: EscrowStatus.CANCELLED,
        updatedAt: new Date(),
      },
    })

    await this.logEvent(escrowId, 'REJECTED', escrow.sellerId, {})
    return updated
  }

  // Complete escrow (buyer confirms delivery)
  async complete(escrowId: string) {
    const escrow = await prisma.escrow_transactions.findUnique({ where: { id: escrowId } })
    if (!escrow) throw new Error('Escrow not found')
    
    if (![EscrowStatus.DELIVERED, EscrowStatus.IN_PROGRESS].includes(escrow.status as EscrowStatus)) {
      throw new Error(`Cannot complete escrow in status: ${escrow.status}`)
    }

    return await this.releaseFunds(escrowId, escrow.buyerId, 'buyer_completed')
  }

  // Refund escrow (admin action)
  async refund(escrowId: string) {
    const escrow = await prisma.escrow_transactions.findUnique({ where: { id: escrowId } })
    if (!escrow) throw new Error('Escrow not found')
    
    if (escrow.status === EscrowStatus.RELEASED || escrow.status === EscrowStatus.REFUNDED) {
      throw new Error(`Cannot refund escrow in status: ${escrow.status}`)
    }

    return await this.processRefund(escrowId, 'admin', 'admin_refund')
  }
}

export const escrowService = new EscrowService()
