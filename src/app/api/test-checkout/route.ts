import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const testOrder = {
      id: 'test-order-123',
      items: [
        { id: '1', title: 'Test Product', price: 1000, quantity: 1 }
      ],
      total: 1000,
      phoneNumber: '254712345678',
      status: 'PENDING'
    }

    return NextResponse.json({
      success: true,
      message: 'Checkout system is ready',
      testOrder,
      endpoints: {
        checkout: '/api/checkout',
        whatsappOrder: '/api/whatsapp-order',
        checkoutPage: '/checkout'
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Test failed'
    }, { status: 500 })
  }
}