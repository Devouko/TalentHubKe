import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { phone, amount, orderId, description } = await request.json()

    console.log('STK Push request:', { phone, amount, orderId, description })

    // Validate required fields
    if (!phone || !amount || !orderId) {
      return NextResponse.json({ 
        success: false,
        error: 'Missing required fields: phone, amount, orderId' 
      }, { status: 400 })
    }

    // Use test phone only in sandbox
    const phoneToUse = process.env.NODE_ENV === 'production' ? phone : '254708374149'
    console.log(`Using phone: ${phoneToUse} (Environment: ${process.env.NODE_ENV || 'development'})`)

    // Validate environment variables
    if (!process.env.MPESA_CONSUMER_KEY || !process.env.MPESA_CONSUMER_SECRET) {
      console.error('Missing M-Pesa credentials')
      return NextResponse.json({
        success: false,
        error: 'M-Pesa credentials not configured'
      }, { status: 500 })
    }

    // Get access token
    const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64')
    
    console.log('Getting access token...')
    const tokenResponse = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('Token request failed:', errorText)
      return NextResponse.json({
        success: false,
        error: 'Failed to authenticate with M-Pesa'
      }, { status: 500 })
    }
    
    const tokenData = await tokenResponse.json()
    console.log('Token response:', tokenData)
    
    if (!tokenData.access_token) {
      return NextResponse.json({
        success: false,
        error: 'No access token received'
      }, { status: 500 })
    }

    const accessToken = tokenData.access_token

    // Generate timestamp
    const now = new Date()
    const timestamp = now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0') +
      now.getHours().toString().padStart(2, '0') +
      now.getMinutes().toString().padStart(2, '0') +
      now.getSeconds().toString().padStart(2, '0')
    
    const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString('base64')

    const stkPayload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: phoneToUse,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: phoneToUse,
      CallBackURL: process.env.NODE_ENV === 'production' 
        ? `${process.env.NEXTAUTH_URL}/api/mpesa/callback`
        : 'https://webhook.site/unique-id',
      AccountReference: orderId,
      TransactionDesc: description || 'Payment for order'
    }

    console.log('STK Push payload:', JSON.stringify(stkPayload, null, 2))

    const stkResponse = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(stkPayload)
    })

    console.log('STK Response Status:', stkResponse.status)
    console.log('STK Response Headers:', Object.fromEntries(stkResponse.headers.entries()))
    
    const stkData = await stkResponse.json()
    console.log('STK Push response:', JSON.stringify(stkData, null, 2))
    
    // Check if STK push was successful
    if (stkData.ResponseCode === '0') {
      // Create payment record in database
      await prisma.payment.create({
        data: {
          orderId,
          amount: Math.round(amount),
          phoneNumber: phoneToUse,
          status: 'PENDING',
          checkoutRequestId: stkData.CheckoutRequestID,
          merchantRequestId: stkData.MerchantRequestID
        }
      })

      console.log(`✅ STK Push SUCCESS - Should receive on phone: ${phoneToUse}`)
      return NextResponse.json({
        success: true,
        message: process.env.NODE_ENV === 'production' 
          ? `STK push sent to ${phone}. Check your phone for M-Pesa prompt.`
          : `STK push sent to ${phoneToUse}. Check the test phone for M-Pesa prompt.`,
        data: {
          MerchantRequestID: stkData.MerchantRequestID,
          CheckoutRequestID: stkData.CheckoutRequestID,
          ResponseCode: stkData.ResponseCode,
          ResponseDescription: stkData.ResponseDescription,
          TestPhone: process.env.NODE_ENV === 'production' ? undefined : phoneToUse
        }
      })
    } else {
      console.error('❌ STK Push FAILED:', stkData)
      return NextResponse.json({
        success: false,
        error: `STK Push Failed: ${stkData.ResponseDescription || stkData.errorMessage || 'Unknown error'}`,
        details: stkData
      }, { status: 400 })
    }

  } catch (error) {
    console.error('STK Push API Error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Payment initiation failed'
    }, { status: 500 })
  }
}