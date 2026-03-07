import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.userType !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const transactions = await prisma.escrow_transactions.findMany({
      include: {
        users_escrow_transactions_buyerIdTousers: {
          select: { id: true, name: true, email: true }
        },
        users_escrow_transactions_sellerIdTousers: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const formatted = transactions.map(tx => ({
      id: tx.id,
      amount: tx.amount,
      status: tx.status.toLowerCase(),
      buyer: tx.users_escrow_transactions_buyerIdTousers,
      seller: tx.users_escrow_transactions_sellerIdTousers,
      orderId: tx.orderId,
      createdAt: tx.createdAt
    }))

    return NextResponse.json(formatted)
  } catch (error) {
    console.error('Error fetching escrow transactions:', error)
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
  }
}
