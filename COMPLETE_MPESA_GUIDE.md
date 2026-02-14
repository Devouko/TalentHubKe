# Complete M-Pesa Integration Guide: Sandbox to Production

## Table of Contents
1. [Sandbox Setup & Implementation](#sandbox-setup--implementation)
2. [Testing & Validation](#testing--validation)
3. [Production Migration](#production-migration)
4. [Troubleshooting](#troubleshooting)

---

## Sandbox Setup & Implementation

### Phase 1: Get Sandbox Credentials

#### Step 1.1: Register on Safaricom Developer Portal
1. Visit [https://developer.safaricom.co.ke](https://developer.safaricom.co.ke)
2. Create account with valid email
3. Verify email and complete profile
4. Navigate to "My Apps" → "Create New App"
5. Select "Lipa Na M-Pesa Online" product
6. Get sandbox credentials:
   ```
   Consumer Key: 3m9pJA7CbZ992brIzpdR89lTVaWqE9nd20MLIVwkoqTlZI9F
   Consumer Secret: L8CcwPxm5lwRKRHmCF0TxmG10uI2UIX53gmD1mSubpIGxupbhlNDEG6a8pAncCFd
   Shortcode: 174379
   Passkey: bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
   ```

#### Step 1.2: Environment Configuration
Create `.env.local` file:
```bash
# M-Pesa Sandbox Credentials
MPESA_CONSUMER_KEY=3m9pJA7CbZ992brIzpdR89lTVaWqE9nd20MLIVwkoqTlZI9F
MPESA_CONSUMER_SECRET=L8CcwPxm5lwRKRHmCF0TxmG10uI2UIX53gmD1mSubpIGxupbhlNDEG6a8pAncCFd
MPESA_SHORTCODE=174379
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919

# App Configuration
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development
```

### Phase 2: Core M-Pesa Service Implementation

#### Step 2.1: Create M-Pesa Service Class
File: `src/lib/mpesa.ts`

**Purpose**: Handles token management, phone formatting, and STK push requests

**Key Features**:
- Token caching (55 minutes)
- Phone number validation and formatting
- Environment-based URL switching
- Error handling

```typescript
// Core service with token caching and phone formatting
class MpesaService {
  private accessToken: string | null = null
  private tokenExpiry: number = 0

  // Environment-based URLs for sandbox/production
  private getAuthUrl(): string {
    return process.env.NODE_ENV === 'production'
      ? 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
      : 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
  }

  // Token management with caching
  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken
    }
    // Token fetching logic...
  }

  // Phone number formatting (0710727775 → 254710727775)
  private formatPhoneNumber(phone: string): string {
    const cleanPhone = phone.replace(/\D/g, '')
    if (cleanPhone.startsWith('0')) {
      return '254' + cleanPhone.slice(1)
    }
    return cleanPhone.startsWith('254') ? cleanPhone : '254' + cleanPhone
  }
}
```

#### Step 2.2: Create STK Push API Route
File: `src/app/api/mpesa/stkpush/route.ts`

**Purpose**: Handles payment initiation requests from frontend

**Flow**:
1. Validate request data (phone, amount, orderId)
2. Get M-Pesa access token
3. Generate timestamp and password
4. Send STK push to M-Pesa API
5. Return response to frontend

```typescript
export async function POST(request: Request) {
  try {
    const { phone, amount, orderId, description } = await request.json()

    // Validation
    if (!phone || !amount || !orderId) {
      return NextResponse.json({ 
        success: false,
        error: 'Missing required fields' 
      }, { status: 400 })
    }

    // Environment-based phone handling
    const phoneToUse = process.env.NODE_ENV === 'production' ? phone : '254708374149'

    // Get access token
    const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64')
    
    // Generate timestamp and password
    const timestamp = generateTimestamp()
    const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString('base64')

    // STK Push payload
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
      TransactionDesc: description || 'Payment'
    }

    // Send to M-Pesa
    const stkResponse = await fetch(getStkUrl(), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(stkPayload)
    })

    const stkData = await stkResponse.json()
    
    // Handle response
    if (stkData.ResponseCode === '0') {
      return NextResponse.json({
        success: true,
        message: 'STK push sent successfully',
        data: stkData
      })
    } else {
      return NextResponse.json({
        success: false,
        error: stkData.ResponseDescription
      }, { status: 400 })
    }

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Payment initiation failed'
    }, { status: 500 })
  }
}
```

#### Step 2.3: Create Callback Handler
File: `src/app/api/mpesa/callback/route.ts`

**Purpose**: Receives payment confirmations from M-Pesa

```typescript
export async function POST(request: Request) {
  try {
    const callbackData = await request.json()
    
    console.log('M-Pesa Callback:', JSON.stringify(callbackData, null, 2))
    
    // Extract payment details
    const { Body } = callbackData
    const { stkCallback } = Body
    
    if (stkCallback.ResultCode === 0) {
      // Payment successful - update order status
      console.log('✅ Payment successful')
      // Update database here
    } else {
      // Payment failed
      console.log('❌ Payment failed:', stkCallback.ResultDesc)
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Callback error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
```

### Phase 3: Frontend Integration

#### Step 3.1: Create React Hook
File: `src/hooks/useMpesa.ts`

**Purpose**: Provides easy M-Pesa integration for React components

```typescript
export function useMpesa() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initiatePayment = async (paymentData: {
    phone: string
    amount: number
    orderId: string
    description?: string
  }) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/mpesa/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      })

      const result = await response.json()

      if (result.success) {
        return result
      } else {
        throw new Error(result.error)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { initiatePayment, loading, error }
}
```

#### Step 3.2: Create Checkout Component
File: `src/components/MpesaCheckout.tsx`

**Purpose**: Complete payment UI with phone input and payment button

```typescript
export function MpesaCheckout({ amount, orderId, onSuccess, onError }: Props) {
  const [phone, setPhone] = useState('')
  const { initiatePayment, loading, error } = useMpesa()

  const handlePayment = async () => {
    try {
      const result = await initiatePayment({
        phone,
        amount,
        orderId,
        description: `Payment for order ${orderId}`
      })
      
      onSuccess?.(result)
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Payment failed')
    }
  }

  return (
    <div className="mpesa-checkout">
      <input
        type="tel"
        placeholder="Phone number (0710727775)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      
      <button 
        onClick={handlePayment}
        disabled={loading || !phone}
      >
        {loading ? 'Processing...' : `Pay KES ${amount}`}
      </button>
      
      {error && <p className="error">{error}</p>}
    </div>
  )
}
```

---

## Testing & Validation

### Phase 4: Sandbox Testing

#### Step 4.1: Setup Webhook URL
1. Visit [https://webhook.site](https://webhook.site)
2. Copy your unique URL (e.g., `https://webhook.site/#!/view/abc123`)
3. Update callback URL in STK push route

#### Step 4.2: Test STK Push Flow

**Test Scenario 1: Valid Request**
```bash
# Test data
Phone: 254708374149 (Safaricom test number)
Amount: 1 (KES 1 for testing)
Order ID: TEST-001

# Expected Response
{
  "success": true,
  "message": "STK push sent successfully",
  "data": {
    "MerchantRequestID": "2215-4661-8d6b-a521595ebee6949",
    "CheckoutRequestID": "ws_CO_19012026140109556708374149",
    "ResponseCode": "0",
    "ResponseDescription": "Success. Request accepted for processing"
  }
}
```

**Test Scenario 2: Invalid Phone**
```bash
# Test data
Phone: 123456789 (Invalid format)

# Expected Response
{
  "success": false,
  "error": "Invalid phone number format"
}
```

#### Step 4.3: Validation Checklist

**✅ Success Indicators**:
- [ ] STK push returns `ResponseCode: "0"`
- [ ] Console shows "✅ STK Push SUCCESS"
- [ ] Webhook.site receives callback data
- [ ] No error messages in logs

**❌ Failure Indicators**:
- [ ] `ResponseCode` is not "0"
- [ ] Error: "Invalid CallBackURL"
- [ ] Error: "Invalid consumer key"
- [ ] No callback received

#### Step 4.4: Debug Common Issues

**Issue 1: Invalid CallBackURL**
```bash
# Error
"errorCode": "400.002.02",
"errorMessage": "Bad Request - Invalid CallBackURL"

# Solution
- Use https://webhook.site URL
- Ensure URL is publicly accessible
- No localhost URLs in sandbox
```

**Issue 2: Invalid Credentials**
```bash
# Error
"error": "invalid_client"

# Solution
- Verify consumer key/secret are correct
- Check for extra spaces in .env file
- Ensure credentials are for sandbox
```

**Issue 3: No STK Push on Phone**
```bash
# Reason
- Sandbox only works with 254708374149
- Need actual Safaricom test SIM card
- STK push expires after 30 seconds

# Solution
- Use only the test number in sandbox
- Get access to test SIM card
- Test immediately after sending
```

### Phase 5: Create Test Suite

#### Step 5.1: Unit Tests
File: `__tests__/mpesa.test.ts`

```typescript
describe('M-Pesa Integration', () => {
  test('formats phone numbers correctly', () => {
    expect(formatPhone('0710727775')).toBe('254710727775')
    expect(formatPhone('254710727775')).toBe('254710727775')
    expect(formatPhone('710727775')).toBe('254710727775')
  })

  test('generates valid timestamp', () => {
    const timestamp = generateTimestamp()
    expect(timestamp).toMatch(/^\d{14}$/)
  })

  test('creates valid password', () => {
    const password = generatePassword('20240119120000')
    expect(password).toBeTruthy()
    expect(typeof password).toBe('string')
  })
})
```

#### Step 5.2: Integration Tests
```typescript
describe('STK Push API', () => {
  test('successful STK push', async () => {
    const response = await fetch('/api/mpesa/stkpush', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: '254708374149',
        amount: 1,
        orderId: 'TEST-001'
      })
    })

    const result = await response.json()
    expect(result.success).toBe(true)
    expect(result.data.ResponseCode).toBe('0')
  })
})
```

---

## Production Migration

### Phase 6: Get Production Access

#### Step 6.1: Apply for Production API
1. **Business Requirements**:
   - Valid KRA PIN certificate
   - Business registration certificate
   - Bank statement (3 months)
   - Director's ID copy

2. **Application Process**:
   - Login to Safaricom Developer Portal
   - Navigate to "Go Live" section
   - Upload required documents
   - Fill business details form
   - Submit application

3. **Approval Timeline**:
   - Initial review: 3-5 business days
   - Document verification: 1-2 weeks
   - Final approval: 2-4 weeks total

#### Step 6.2: Receive Production Credentials
```bash
# Production credentials (example format)
Consumer Key: ABC123XYZ789...
Consumer Secret: DEF456UVW012...
Shortcode: 600000 (Your business shortcode)
Passkey: production_passkey_here...
```

### Phase 7: Production Configuration

#### Step 7.1: Update Environment Variables
File: `.env.production`

```bash
# Production Environment
NODE_ENV=production

# M-Pesa Production Credentials
MPESA_CONSUMER_KEY=your_production_consumer_key
MPESA_CONSUMER_SECRET=your_production_consumer_secret
MPESA_SHORTCODE=your_business_shortcode
MPESA_PASSKEY=your_production_passkey

# Production URLs
NEXTAUTH_URL=https://yourdomain.com

# Database
DATABASE_URL=your_production_database_url
```

#### Step 7.2: Update Code for Production

**M-Pesa Service Updates** (already implemented):
- Environment-based URL switching
- Production vs sandbox phone handling
- Dynamic callback URL configuration

**Key Changes**:
```typescript
// Phone number handling
const phoneToUse = process.env.NODE_ENV === 'production' 
  ? phone  // Use customer's actual phone
  : '254708374149'  // Use test phone in sandbox

// API URLs
const authUrl = process.env.NODE_ENV === 'production'
  ? 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
  : 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'

// Callback URL
const callbackUrl = process.env.NODE_ENV === 'production'
  ? `${process.env.NEXTAUTH_URL}/api/mpesa/callback`
  : 'https://webhook.site/unique-id'
```

### Phase 8: Production Deployment

#### Step 8.1: Pre-Deployment Checklist
- [ ] SSL certificate installed (HTTPS required)
- [ ] Domain DNS configured correctly
- [ ] Production database ready
- [ ] Environment variables set
- [ ] Error monitoring setup (Sentry)
- [ ] Backup and rollback plan ready

#### Step 8.2: Staging Environment Testing
```bash
# Deploy to staging first
vercel --env-file=.env.staging

# Test with production credentials but staging domain
MPESA_CONSUMER_KEY=production_key
NEXTAUTH_URL=https://staging.yourdomain.com
```

#### Step 8.3: Production Deployment
```bash
# Deploy to production
vercel --prod --env-file=.env.production

# Verify deployment
curl -X GET https://yourdomain.com/api/health
```

### Phase 9: Production Testing

#### Step 9.1: Smoke Tests
```bash
# Test 1: Health check
curl https://yourdomain.com/api/mpesa/health

# Test 2: Small amount STK push
{
  "phone": "254710000000",
  "amount": 1,
  "orderId": "PROD-TEST-001"
}

# Expected: Real STK push to customer phone
```

#### Step 9.2: Production Validation
- [ ] STK push sent to real customer phones
- [ ] Callback URL receives M-Pesa responses
- [ ] Order status updates correctly
- [ ] Payment confirmations work
- [ ] Error handling works properly

#### Step 9.3: Go-Live Strategy
1. **Soft Launch**: Enable for 10% of users
2. **Monitor**: Watch for 24 hours
3. **Scale Up**: Gradually increase to 100%
4. **Support**: Have customer support ready

---

## Troubleshooting

### Common Sandbox Issues

**1. No STK Push Received**
```bash
# Symptoms
- API returns success
- No prompt on phone
- Callback not triggered

# Causes & Solutions
- Using wrong phone number → Use 254708374149
- Invalid callback URL → Use webhook.site
- Test SIM not available → Get Safaricom test SIM
```

**2. Invalid CallBackURL Error**
```bash
# Error
"errorCode": "400.002.02"
"errorMessage": "Bad Request - Invalid CallBackURL"

# Solutions
- Use HTTPS URL only
- Ensure URL is publicly accessible
- No localhost or private IPs
- Test URL accessibility: curl https://your-callback-url
```

**3. Authentication Failures**
```bash
# Error
"error": "invalid_client"

# Solutions
- Verify consumer key/secret
- Check Base64 encoding
- Ensure no extra spaces in credentials
- Test credentials separately
```

### Common Production Issues

**1. SSL Certificate Problems**
```bash
# Error
"SSL certificate verify failed"

# Solutions
- Install valid SSL certificate
- Use trusted CA (Let's Encrypt, etc.)
- Test SSL: https://www.ssllabs.com/ssltest/
```

**2. Rate Limiting**
```bash
# Error
"Too many requests"

# Solutions
- Implement request throttling
- Cache access tokens properly
- Add retry logic with backoff
```

**3. Customer Phone Issues**
```bash
# Error
"Invalid phone number"

# Solutions
- Validate phone format on frontend
- Handle different number formats
- Show clear error messages
```

### Monitoring & Alerts

#### Step 10.1: Setup Monitoring
```typescript
// Add to your monitoring service
const alerts = {
  'STK Push Failure Rate > 5%': 'High priority',
  'Callback URL Down': 'Critical',
  'Token Refresh Failures': 'Medium priority',
  'Database Connection Issues': 'Critical'
}
```

#### Step 10.2: Key Metrics to Track
- STK push success rate
- Average response time
- Callback delivery rate
- Payment completion rate
- Error frequency by type

#### Step 10.3: Log Analysis
```bash
# Success rate
grep "STK Push SUCCESS" logs/*.log | wc -l

# Error patterns
grep "STK Push FAILED" logs/*.log | head -10

# Response times
grep "STK Push response time" logs/*.log | awk '{print $NF}'
```

---

## Summary

### Sandbox Implementation ✅
1. **Setup**: Credentials, environment, webhook URL
2. **Backend**: M-Pesa service, API routes, callback handler
3. **Frontend**: React hook, checkout component
4. **Testing**: Unit tests, integration tests, manual testing

### Production Migration ✅
1. **Credentials**: Apply for and receive production access
2. **Configuration**: Update environment variables and URLs
3. **Deployment**: Staging → Production with monitoring
4. **Validation**: Real phone testing, callback verification

### Success Indicators
- **Sandbox**: ResponseCode "0", webhook receives callbacks
- **Production**: Real customers receive STK push, payments complete

Your M-Pesa integration is now production-ready with comprehensive error handling, monitoring, and testing!