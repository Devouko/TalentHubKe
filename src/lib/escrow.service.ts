import { prisma } from './prisma'

export enum EscrowStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
  REFUNDED = 'REFUNDED',
}

interface CreateEscrowParams {
  buyerId: string
  sellerId: string
  productId: string
  amount: number
  items: any[]
}

export class EscrowService {
  async createTransaction(params: CreateEscrowParams) {
    const { buyerId, sellerId, productId, amount, items } = params

    const transaction = await prisma.escrow_transactions.create({
      data: {
        id: `esc_${Date.now()}`,
        buyerId,
        sellerId,
        productId,
        amount,
        status: EscrowStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        users_escrow_transactions_buyerIdTousers: true,
        users_escrow_transactions_sellerIdTousers: true,
        products: true,
      },
    })

    // Create escrow items
    for (const item of items) {
      await prisma.escrow_items.create({
        data: {
          id: `item_${Date.now()}_${Math.random()}`,
          transactionId: transaction.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        },
      })
    }

    return transaction
  }

  async approveTransaction(transactionId: string, adminNotes?: string) {
    return await prisma.escrow_transactions.update({
      where: { id: transactionId },
      data: {
        status: EscrowStatus.APPROVED,
        adminNotes,
        updatedAt: new Date(),
      },
    })
  }

  async rejectTransaction(transactionId: string, reason: string) {
    return await prisma.escrow_transactions.update({
      where: { id: transactionId },
      data: {
        status: EscrowStatus.REJECTED,
        adminNotes: reason,
        updatedAt: new Date(),
      },
    })
  }

  async completeTransaction(transactionId: string) {
    const transaction = await prisma.escrow_transactions.findUnique({
      where: { id: transactionId },
    })

    if (!transaction) throw new Error('Transaction not found')
    if (transaction.status !== EscrowStatus.APPROVED) {
      throw new Error('Transaction must be approved first')
    }

    // Release funds to seller
    if (transaction.sellerId) {
      await prisma.users.update({
        where: { id: transaction.sellerId },
        data: {
          balance: { increment: transaction.amount },
        },
      })
    }

    return await prisma.escrow_transactions.update({
      where: { id: transactionId },
      data: {
        status: EscrowStatus.COMPLETED,
        updatedAt: new Date(),
      },
    })
  }

  async refundTransaction(transactionId: string) {
    const transaction = await prisma.escrow_transactions.findUnique({
      where: { id: transactionId },
    })

    if (!transaction) throw new Error('Transaction not found')

    // Refund to buyer
    await prisma.users.update({
      where: { id: transaction.buyerId },
      data: {
        balance: { increment: transaction.amount },
      },
    })

    return await prisma.escrow_transactions.update({
      where: { id: transactionId },
      data: {
        status: EscrowStatus.REFUNDED,
        updatedAt: new Date(),
      },
    })
  }

  async getTransaction(transactionId: string) {
    return await prisma.escrow_transactions.findUnique({
      where: { id: transactionId },
      include: {
        users_escrow_transactions_buyerIdTousers: true,
        users_escrow_transactions_sellerIdTousers: true,
        products: true,
        escrow_items: true,
      },
    })
  }

  async getUserTransactions(userId: string) {
    return await prisma.escrow_transactions.findMany({
      where: {
        OR: [{ buyerId: userId }, { sellerId: userId }],
      },
      include: {
        products: true,
        escrow_items: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async getAllTransactions() {
    return await prisma.escrow_transactions.findMany({
      include: {
        users_escrow_transactions_buyerIdTousers: true,
        users_escrow_transactions_sellerIdTousers: true,
        products: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }
}

export const escrowService = new EscrowService()
