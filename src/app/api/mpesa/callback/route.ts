import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const callbackData = await request.json()
    
    console.log('M-Pesa Callback received:', JSON.stringify(callbackData, null, 2))
    
    // Extract payment details from callback
    const { Body } = callbackData
    const { stkCallback } = Body
    
    if (!stkCallback || !stkCallback.CheckoutRequestID) {
      console.error('Invalid callback data structure')
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' })
    }

    const checkoutRequestId = stkCallback.CheckoutRequestID
    const resultCode = stkCallback.ResultCode
    const resultDesc = stkCallback.ResultDesc

    // Find payment record
    const payment = await prisma.payment.findUnique({
      where: { checkoutRequestId },
      include: { order: true }
    })

    if (!payment) {
      console.error('Payment not found for CheckoutRequestID:', checkoutRequestId)
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' })
    }

    // Check if already processed (idempotency)
    if (payment.status !== 'PENDING') {
      console.log('Payment already processed:', payment.status)
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' })
    }

    // Process payment result in transaction
    await prisma.$transaction(async (tx) => {
      if (resultCode === 0) {
        // Payment successful
        let mpesaReceiptNumber = null
        let transactionDate = null

        // Extract receipt details from callback items
        if (stkCallback.CallbackMetadata && stkCallback.CallbackMetadata.Item) {
          const items = stkCallback.CallbackMetadata.Item
          const receiptItem = items.find((item: any) => item.Name === 'MpesaReceiptNumber')
          const dateItem = items.find((item: any) => item.Name === 'TransactionDate')
          
          mpesaReceiptNumber = receiptItem?.Value || null
          transactionDate = dateItem?.Value?.toString() || null
        }

        // Update payment status
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: 'SUCCESS',
            mpesaReceiptNumber,
            transactionDate
          }
        })

        // Update order status
        await tx.order.update({
          where: { id: payment.orderId },
          data: { status: 'PAID' }
        })

        // Clear cart after successful payment
        await tx.cart.deleteMany({
          where: { userId: payment.order.buyerId }
        })

        console.log('✅ Payment successful - Order updated to PAID, Cart cleared')
        console.log('Receipt Number:', mpesaReceiptNumber)
        
        // Grant access to digital products
        // TODO: Implement digital product access logic here
        
      } else {
        // Payment failed
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: 'FAILED',
            failureReason: resultDesc
          }
        })

        // Update order status
        await tx.order.update({
          where: { id: payment.orderId },
          data: { status: 'FAILED' }
        })

        console.log('❌ Payment failed:', resultDesc)
      }
    })
    
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' })
    
  } catch (error) {
    console.error('M-Pesa callback error:', error)
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' })
  }
}