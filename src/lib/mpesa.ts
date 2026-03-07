// lib/mpesa.ts
interface MpesaTokenResponse {
  access_token: string
  expires_in: string
}

interface StkPushResponse {
  MerchantRequestID: string
  CheckoutRequestID: string
  ResponseCode: string
  ResponseDescription: string
  CustomerMessage: string
}

interface StkPushRequest {
  phone: string
  amount: number
  orderId: string
  description?: string
}

class MpesaService {
  private accessToken: string | null = null
  private tokenExpiry: number = 0

  // Environment-based URLs
  private getAuthUrl(): string {
    return process.env.NODE_ENV === 'production'
      ? 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
      : 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
  }

  private getStkUrl(): string {
    return process.env.NODE_ENV === 'production'
      ? 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
      : 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
  }

  private async getAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken
    }

    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString('base64')

    const response = await fetch(this.getAuthUrl(), {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.statusText}`)
    }

    const data: MpesaTokenResponse = await response.json()
    
    // Cache token (expires in 1 hour, cache for 55 minutes)
    this.accessToken = data.access_token
    this.tokenExpiry = Date.now() + (55 * 60 * 1000)
    
    return this.accessToken
  }

  private formatPhoneNumber(phone: string): string {
    // Remove all non-digits
    const cleanPhone = phone.replace(/\D/g, '')
    
    // Convert to 254 format
    if (cleanPhone.startsWith('0')) {
      return '254' + cleanPhone.slice(1)
    } else if (cleanPhone.startsWith('254')) {
      return cleanPhone
    } else if (cleanPhone.startsWith('7') || cleanPhone.startsWith('1')) {
      return '254' + cleanPhone
    }
    
    return cleanPhone
  }

  private generateTimestamp(): string {
    const now = new Date()
    return now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0') +
      now.getHours().toString().padStart(2, '0') +
      now.getMinutes().toString().padStart(2, '0') +
      now.getSeconds().toString().padStart(2, '0')
  }

  private generatePassword(timestamp: string): string {
    const data = `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    return Buffer.from(data).toString('base64')
  }

  async initiateSTKPush({
    phone,
    amount,
    orderId,
    description = 'Payment'
  }: StkPushRequest): Promise<StkPushResponse> {
    try {
      // Get access token
      const accessToken = await this.getAccessToken()
      
      // Format phone number
      const formattedPhone = this.formatPhoneNumber(phone)
      
      // Validate phone number
      if (formattedPhone.length !== 12 || !formattedPhone.startsWith('254')) {
        throw new Error('Invalid phone number format')
      }

      // Generate timestamp and password
      const timestamp = this.generateTimestamp()
      const password = this.generatePassword(timestamp)

      // Prepare STK push payload
      const payload = {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(amount),
        PartyA: formattedPhone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: formattedPhone,
        CallBackURL: `${process.env.NEXTAUTH_URL}/api/mpesa/callback`,
        AccountReference: orderId,
        TransactionDesc: description
      }

      // Send STK push request
      const response = await fetch(this.getStkUrl(), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`STK push failed: ${response.statusText}`)
      }

      const result: StkPushResponse = await response.json()
      
      // Log for debugging (remove in production)
      console.log('STK Push Response:', result)
      
      return result
    } catch (error) {
      console.error('M-Pesa STK Push Error:', error)
      throw error
    }
  }
}

export const mpesaService = new MpesaService()