import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals'

// Mock fetch globally
global.fetch = jest.fn()

// Mock Request and Response for Node.js environment
class MockRequest {
  constructor(public url: string, public init?: any) {}
  async json() { return JSON.parse(this.init?.body || '{}') }
}

class MockResponse {
  constructor(public body: any, public init?: any) {}
  get ok() { return this.init?.status < 400 }
  get status() { return this.init?.status || 200 }
  async json() { return this.body }
}

global.Request = MockRequest as any
global.Response = MockResponse as any

// Mock environment variables
process.env.MPESA_CONSUMER_KEY = 'test_consumer_key'
process.env.MPESA_CONSUMER_SECRET = 'test_consumer_secret'
process.env.MPESA_SHORTCODE = '174379'
process.env.MPESA_PASSKEY = 'test_passkey'
process.env.NEXTAUTH_URL = 'http://localhost:3000'

// Mock Prisma
jest.mock('../../../../lib/prisma', () => ({
  prisma: {
    order: {
      update: jest.fn()
    }
  }
}))

describe('M-Pesa STK Push API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('POST /api/mpesa/stkpush', () => {
    it('should successfully initiate STK push', async () => {
      // Mock successful token response
      ;(fetch as jest.MockedFunction<typeof fetch>)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ access_token: 'mock_token' })
        } as Response)
        // Mock successful STK push response
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            ResponseCode: '0',
            ResponseDescription: 'Success',
            CheckoutRequestID: 'ws_CO_123456789'
          })
        } as Response)

      const { POST } = await import('../src/app/api/mpesa/stkpush/route')
      
      const request = new NextRequest('http://localhost:3000/api/mpesa/stkpush', {
        method: 'POST',
        body: JSON.stringify({
          phone: '0712345678',
          amount: 1000,
          orderId: 'test-order-123'
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.ResponseCode).toBe('0')
      expect(data.CheckoutRequestID).toBe('ws_CO_123456789')
    })

    it('should handle invalid phone number', async () => {
      const { POST } = await import('../src/app/api/mpesa/stkpush/route')
      
      const request = new NextRequest('http://localhost:3000/api/mpesa/stkpush', {
        method: 'POST',
        body: JSON.stringify({
          phone: '123',
          amount: 1000,
          orderId: 'test-order-123'
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.ResponseCode).toBe('1')
      expect(data.errorMessage).toBe('Invalid phone number format')
    })

    it('should handle missing required fields', async () => {
      const { POST } = await import('../src/app/api/mpesa/stkpush/route')
      
      const request = new NextRequest('http://localhost:3000/api/mpesa/stkpush', {
        method: 'POST',
        body: JSON.stringify({
          phone: '0712345678'
          // Missing amount and orderId
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.ResponseCode).toBe('1')
      expect(data.errorMessage).toBe('Missing required fields')
    })

    it('should format phone numbers correctly', async () => {
      ;(fetch as jest.MockedFunction<typeof fetch>)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ access_token: 'mock_token' })
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ ResponseCode: '0' })
        } as Response)

      const { POST } = await import('../src/app/api/mpesa/stkpush/route')
      
      const testCases = [
        { input: '0712345678', expected: '254712345678' },
        { input: '254712345678', expected: '254712345678' },
        { input: '712345678', expected: '254712345678' }
      ]

      for (const testCase of testCases) {
        const request = new NextRequest('http://localhost:3000/api/mpesa/stkpush', {
          method: 'POST',
          body: JSON.stringify({
            phone: testCase.input,
            amount: 1000,
            orderId: 'test-order-123'
          })
        })

        await POST(request)

        // Check that the formatted phone number was used in the STK push request
        const stkPushCall = (fetch as jest.MockedFunction<typeof fetch>).mock.calls[1]
        const stkPushBody = JSON.parse(stkPushCall[1]?.body as string)
        
        expect(stkPushBody.PhoneNumber).toBe(testCase.expected)
        expect(stkPushBody.PartyA).toBe(testCase.expected)
      }
    })

    it('should handle token request failure', async () => {
      ;(fetch as jest.MockedFunction<typeof fetch>)
        .mockResolvedValueOnce({
          ok: false,
          status: 401
        } as Response)

      const { POST } = await import('../src/app/api/mpesa/stkpush/route')
      
      const request = new NextRequest('http://localhost:3000/api/mpesa/stkpush', {
        method: 'POST',
        body: JSON.stringify({
          phone: '0712345678',
          amount: 1000,
          orderId: 'test-order-123'
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.ResponseCode).toBe('1')
      expect(data.errorMessage).toBe('Payment initiation failed')
    })
  })
})

describe('M-Pesa Callback API', () => {
  const { prisma } = require('../../../../lib/prisma')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /api/mpesa/callback', () => {
    it('should handle successful payment callback', async () => {
      prisma.order.update.mockResolvedValue({ id: 'test-order-123' })

      const { POST } = await import('../src/app/api/mpesa/callback/route')
      
      const callbackData = {
        Body: {
          stkCallback: {
            ResultCode: 0,
            ResultDesc: 'The service request is processed successfully.',
            CallbackMetadata: {
              Item: [
                { Name: 'Amount', Value: 1000 },
                { Name: 'MpesaReceiptNumber', Value: 'NLJ7RT61SV' },
                { Name: 'PhoneNumber', Value: 254712345678 },
                { Name: 'AccountReference', Value: 'ORDER-test-order-123' }
              ]
            }
          }
        }
      }

      const request = new NextRequest('http://localhost:3000/api/mpesa/callback', {
        method: 'POST',
        body: JSON.stringify(callbackData)
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.ResultCode).toBe(0)
      expect(data.ResultDesc).toBe('Success')
      
      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { id: 'test-order-123' },
        data: {
          status: 'COMPLETED',
          requirements: expect.stringContaining('Payment successful')
        }
      })
    })

    it('should handle failed payment callback', async () => {
      prisma.order.update.mockResolvedValue({ id: 'test-order-123' })

      const { POST } = await import('../src/app/api/mpesa/callback/route')
      
      const callbackData = {
        Body: {
          stkCallback: {
            ResultCode: 1032,
            ResultDesc: 'Request cancelled by user',
            CallbackMetadata: {
              Item: [
                { Name: 'AccountReference', Value: 'ORDER-test-order-123' }
              ]
            }
          }
        }
      }

      const request = new NextRequest('http://localhost:3000/api/mpesa/callback', {
        method: 'POST',
        body: JSON.stringify(callbackData)
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.ResultCode).toBe(0)
      
      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { id: 'test-order-123' },
        data: {
          status: 'FAILED',
          requirements: expect.stringContaining('Payment failed')
        }
      })
    })

    it('should handle invalid callback data', async () => {
      const { POST } = await import('../src/app/api/mpesa/callback/route')
      
      const request = new NextRequest('http://localhost:3000/api/mpesa/callback', {
        method: 'POST',
        body: JSON.stringify({ invalid: 'data' })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.ResultCode).toBe(1)
      expect(data.ResultDesc).toBe('Invalid callback data')
    })

    it('should handle database errors gracefully', async () => {
      prisma.order.update.mockRejectedValue(new Error('Database error'))

      const { POST } = await import('../src/app/api/mpesa/callback/route')
      
      const callbackData = {
        Body: {
          stkCallback: {
            ResultCode: 0,
            ResultDesc: 'Success',
            CallbackMetadata: {
              Item: [
                { Name: 'AccountReference', Value: 'ORDER-test-order-123' }
              ]
            }
          }
        }
      }

      const request = new NextRequest('http://localhost:3000/api/mpesa/callback', {
        method: 'POST',
        body: JSON.stringify(callbackData)
      })

      const response = await POST(request)
      const data = await response.json()

      // Should still return success to M-Pesa even if DB update fails
      expect(response.status).toBe(200)
      expect(data.ResultCode).toBe(0)
    })
  })
})