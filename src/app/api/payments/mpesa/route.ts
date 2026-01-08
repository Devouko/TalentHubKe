import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { amount, phoneNumber, accountReference, transactionDesc } = body

    const phoneRegex = /^254[0-9]{9}$/
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json({ 
        error: 'Invalid phone number. Use format: 254XXXXXXXXX' 
      }, { status: 400 })
    }

    const mockResponse = {
      merchantRequestId: `MR${Date.now()}`,
      checkoutRequestId: `CR${Date.now()}`,
      responseCode: '0',
      responseDescription: 'Success. Request accepted for processing',
      customerMessage: 'Success. Request accepted for processing'
    }

    return NextResponse.json({
      success: true,
      message: 'M-Pesa payment initiated successfully',
      data: mockResponse
    })

  } catch (error) {
    return NextResponse.json({ 
      error: 'Payment processing failed' 
    }, { status: 500 })
  }
}