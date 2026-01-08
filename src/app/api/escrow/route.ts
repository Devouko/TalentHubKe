import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { buyerId, items, totalAmount } = body

    const transaction = await prisma.escrowTransaction.create({
      data: {
        buyerId,
        amount: totalAmount,
        status: 'PENDING',
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        buyer: true
      }
    })

    return NextResponse.json(transaction)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const transactions = await prisma.escrowTransaction.findMany({
      include: {
        buyer: true,
        seller: true,
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(transactions)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, status, adminNotes } = body

    const transaction = await prisma.escrowTransaction.update({
      where: { id },
      data: {
        status,
        adminNotes,
        updatedAt: new Date()
      },
      include: {
        buyer: true,
        items: {
          include: {
            product: true
          }
        }
      }
    })

    return NextResponse.json(transaction)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 })
  }
}