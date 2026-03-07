import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { orderId, phoneNumber, amount } = await request.json()

    // Simulate M-Pesa payment processing
    const paymentData = {
      orderId,
      phoneNumber,
      amount,
      status: 'SUCCESS',
      transactionId: `MP${Date.now()}`,
      timestamp: new Date().toISOString()
    }

    // Update order status in database
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'COMPLETED' }
    })

    return NextResponse.json({
      success: true,
      message: 'Payment processed successfully',
      transaction: paymentData
    })
  } catch (error) {
    console.error('Payment error:', error)
    return NextResponse.json({ error: 'Payment failed' }, { status: 500 })
  }
}