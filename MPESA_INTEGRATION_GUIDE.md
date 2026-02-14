# M-Pesa Integration Guide
**Transform to Talent Marketplace**

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [File Structure](#file-structure)
4. [Implementation Steps](#implementation-steps)
5. [Testing](#testing)
6. [Production Deployment](#production-deployment)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Next.js 14+ application
- Safaricom Developer Account
- M-Pesa API credentials
- Database setup (Prisma recommended)

---

## Environment Setup

### 1. Get M-Pesa Credentials

1. Visit [Safaricom Developer Portal](https://developer.safaricom.co.ke/)
2. Create an account and login
3. Create a new app (select "Lipa Na M-Pesa Online")
4. Note down your credentials:
   - Consumer Key
   - Consumer Secret
   - Passkey (for sandbox)

### 2. Environment Variables

Add to your `.env.local` file:

```env
# M-Pesa Sandbox Configuration
MPESA_CONSUMER_KEY=your_consumer_key_here
MPESA_CONSUMER_SECRET=your_consumer_secret_here
MPESA_SHORTCODE=174379
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919

# Application URL (required for callbacks)
NEXTAUTH_URL=http://localhost:3000

# Database (if using Prisma)
DATABASE_URL="your_database_url_here"
```

---

## File Structure

```
src/
├── app/
│   └── api/
│       └── mpesa/
│           ├── stkpush/
│           │   └── route.ts
│           └── callback/
│               └── route.ts
├── components/
│   └── MpesaCheckout.tsx
└── lib/
    └── prisma.ts
```

---

## Implementation Steps

### Step 1: STK Push API Route

**File:** `src/app/api/mpesa/stkpush/route.ts`

```typescript
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { phone, amount, orderId } = await request.json()
    
    // Validate inputs
    if (!phone || !amount || !orderId) {
      return NextResponse.json({ 
        ResponseCode: '1', 
        errorMessage: 'Missing required fields' 
      }, { status: 400 })
    }

    // Format phone number to 254XXXXXXXXX
    const cleanPhone = phone.replace(/\D/g, '')
    let formattedPhone = cleanPhone
    
    if (cleanPhone.startsWith('0')) {
      formattedPhone = '254' + cleanPhone.slice(1)
    } else if (!cleanPhone.startsWith('254')) {
      formattedPhone = '254' + cleanPhone
    }

    if (formattedPhone.length !== 12) {
      return NextResponse.json({ 
        ResponseCode: '1', 
        errorMessage: 'Invalid phone number format' 
      }, { status: 400 })
    }

    // Get OAuth access token
    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString('base64')
    
    const tokenResponse = await fetch(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    if (!tokenResponse.ok) {
      throw new Error('Failed to get access token')
    }
    
    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Generate timestamp (YYYYMMDDHHMMSS)
    const now = new Date()
    const timestamp = now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0') +
      now.getHours().toString().padStart(2, '0') +
      now.getMinutes().toString().padStart(2, '0') +
      now.getSeconds().toString().padStart(2, '0')
    
    // Generate password
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64')

    // STK Push request payload
    const stkPayload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: formattedPhone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: `${process.env.NEXTAUTH_URL}/api/mpesa/callback`,
      AccountReference: `ORDER-${orderId}`,
      TransactionDesc: `Payment for order ${orderId}`
    }

    // Send STK Push request
    const stkResponse = await fetch(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(stkPayload)
      }
    )

    const stkData = await stkResponse.json()
    console.log('STK Push Response:', stkData)
    
    return NextResponse.json(stkData)
  } catch (error) {
    console.error('M-Pesa STK Push Error:', error)
    return NextResponse.json({ 
      ResponseCode: '1',
      errorMessage: 'Payment initiation failed'
    }, { status: 500 })
  }
}
```

### Step 2: Callback Handler

**File:** `src/app/api/mpesa/callback/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('M-Pesa Callback:', JSON.stringify(body, null, 2))
    
    const { Body } = body
    const { stkCallback } = Body

    if (!stkCallback) {
      return NextResponse.json({ 
        ResultCode: 1, 
        ResultDesc: 'Invalid callback data' 
      })
    }

    const { ResultCode, ResultDesc, CallbackMetadata } = stkCallback

    // Extract payment details
    const amount = CallbackMetadata?.Item?.find(
      (item: any) => item.Name === 'Amount'
    )?.Value
    
    const mpesaReceiptNumber = CallbackMetadata?.Item?.find(
      (item: any) => item.Name === 'MpesaReceiptNumber'
    )?.Value
    
    const phoneNumber = CallbackMetadata?.Item?.find(
      (item: any) => item.Name === 'PhoneNumber'
    )?.Value

    // Extract order ID from account reference
    const accountRef = CallbackMetadata?.Item?.find(
      (item: any) => item.Name === 'AccountReference'
    )?.Value
    
    const orderId = accountRef?.replace('ORDER-', '')

    if (orderId) {
      try {
        // Update order status in database
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: ResultCode === 0 ? 'COMPLETED' : 'FAILED',
            requirements: ResultCode === 0 ? 
              `Payment successful. Receipt: ${mpesaReceiptNumber}. Phone: ${phoneNumber}` : 
              `Payment failed: ${ResultDesc}`
          }
        })

        console.log(`Order ${orderId} updated:`, ResultCode === 0 ? 'SUCCESS' : 'FAILED')
      } catch (dbError) {
        console.error('Database update error:', dbError)
      }
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' })
  } catch (error) {
    console.error('M-Pesa Callback Error:', error)
    return NextResponse.json({ 
      ResultCode: 1, 
      ResultDesc: 'Internal server error' 
    })
  }
}
```

### Step 3: M-Pesa Checkout Component

**File:** `src/components/MpesaCheckout.tsx`

```typescript
'use client'

import { useState } from 'react'
import { Smartphone, CreditCard } from 'lucide-react'

interface MpesaCheckoutProps {
  amount: number
  orderId: string
  onSuccess: () => void
  onError: (error: string) => void
}

export default function MpesaCheckout({ 
  amount, 
  orderId, 
  onSuccess, 
  onError 
}: MpesaCheckoutProps) {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!phone || phone.length < 10) {
      onError('Please enter a valid phone number')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/mpesa/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone.startsWith('254') ? phone : `254${phone.slice(-9)}`,
          amount,
          orderId
        })
      })

      const result = await response.json()

      if (result.ResponseCode === '0') {
        alert('Payment request sent! Check your phone and enter M-Pesa PIN.')
        onSuccess()
      } else {
        onError(result.errorMessage || result.ResponseDescription || 'Payment failed')
      }
    } catch (error) {
      onError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Smartphone className="w-6 h-6 text-green-500" />
        <h3 className="text-xl font-semibold">Pay with M-Pesa</h3>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-300">Amount to Pay:</span>
          <span className="text-xl font-bold text-green-400">
            KES {amount.toLocaleString()}
          </span>
        </div>
      </div>

      <form onSubmit={handlePayment} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            M-Pesa Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0712345678 or 254712345678"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <p className="text-xs text-gray-400 mt-1">
            Enter your M-Pesa registered phone number
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              Pay KES {amount.toLocaleString()}
            </>
          )}
        </button>
      </form>

      <div className="mt-4 p-3 bg-gray-700 rounded-lg">
        <p className="text-xs text-gray-300">
          <strong>How it works:</strong>
        </p>
        <ol className="text-xs text-gray-400 mt-1 space-y-1">
          <li>1. Enter your M-Pesa phone number</li>
          <li>2. Click "Pay" to initiate payment</li>
          <li>3. Check your phone for M-Pesa prompt</li>
          <li>4. Enter your M-Pesa PIN to complete payment</li>
        </ol>
      </div>
    </div>
  )
}
```

### Step 4: Usage Example

```typescript
// In your checkout page
import MpesaCheckout from '@/components/MpesaCheckout'

function CheckoutPage() {
  const [orderId] = useState('order-' + Date.now())
  const [amount] = useState(1000) // KES 1000

  const handleSuccess = () => {
    // Redirect to success page or show success message
    console.log('Payment initiated successfully!')
  }

  const handleError = (error: string) => {
    // Show error message to user
    console.error('Payment failed:', error)
  }

  return (
    <div className="max-w-md mx-auto">
      <MpesaCheckout
        amount={amount}
        orderId={orderId}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  )
}
```

---

## Testing

### Sandbox Test Numbers
Use these phone numbers for testing:
- `254708374149`
- `254708374150`
- `254708374151`

### Test Process
1. Use small amounts (KES 1-1000)
2. Enter test phone number
3. Check browser console for logs
4. Verify callback receives payment status
5. Check database for order status updates

### Local Testing with Callbacks
For local development, use [ngrok](https://ngrok.com/) to expose your localhost:

```bash
# Install ngrok
npm install -g ngrok

# Expose port 3000
ngrok http 3000

# Update NEXTAUTH_URL in .env.local with ngrok URL
NEXTAUTH_URL=https://your-ngrok-url.ngrok.io
```

---

## Production Deployment

### 1. Update Environment Variables
```env
# Production M-Pesa Configuration
MPESA_CONSUMER_KEY=your_production_consumer_key
MPESA_CONSUMER_SECRET=your_production_consumer_secret
MPESA_SHORTCODE=your_production_shortcode
MPESA_PASSKEY=your_production_passkey

# Production URL
NEXTAUTH_URL=https://yourdomain.com
```

### 2. Update API URLs
Change all sandbox URLs to production:
- `https://sandbox.safaricom.co.ke` → `https://api.safaricom.co.ke`

### 3. SSL Certificate
Ensure your production domain has a valid SSL certificate for callbacks.

---

## Troubleshooting

### Common Issues

**1. "Invalid Access Token"**
- Check consumer key and secret
- Ensure credentials are for correct environment (sandbox/production)

**2. "Invalid Phone Number"**
- Ensure phone number is in format 254XXXXXXXXX
- Use only Kenyan phone numbers

**3. "Callback Not Received"**
- Verify callback URL is publicly accessible
- Check server logs for callback requests
- Ensure HTTPS for production

**4. "STK Push Not Appearing"**
- Use sandbox test numbers for testing
- Check if phone has sufficient balance
- Verify phone number is M-Pesa registered

### Debug Tips
1. Enable console logging in all API routes
2. Test with Postman/curl first
3. Check M-Pesa developer portal for transaction logs
4. Monitor database for order status changes

---

## Security Best Practices

1. **Never expose credentials** in frontend code
2. **Validate all inputs** on server side
3. **Use HTTPS** in production
4. **Implement rate limiting** for API routes
5. **Log all transactions** for audit trail
6. **Verify callback authenticity** if needed

---

## Support

For M-Pesa API issues:
- [Safaricom Developer Portal](https://developer.safaricom.co.ke/)
- [M-Pesa API Documentation](https://developer.safaricom.co.ke/docs)

---

**Last Updated:** January 2026
**Version:** 1.0