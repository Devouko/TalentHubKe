import { NextResponse } from 'next/server'
import { CheckoutService } from '@/lib/checkout.service'
import { ApiUtils } from '@/lib/api.utils'

export async function POST(request: Request) {
  return ApiUtils.withErrorHandling(async () => {
    const { items, phoneNumber } = await request.json()
    
    ApiUtils.validateCartData(items, phoneNumber)
    
    const total = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
    
    const result = await CheckoutService.createOrderWithPayment({
      items,
      total,
      phoneNumber
    })

    return {
      order: result.order,
      payment: result.payment
    }
  })
}