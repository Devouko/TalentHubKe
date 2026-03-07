import { jest } from '@jest/globals'

// Test utilities for M-Pesa testing

export const mockMpesaResponses = {
  successfulToken: {
    access_token: 'mock_access_token_123',
    expires_in: '3599'
  },
  
  successfulStkPush: {
    MerchantRequestID: '29115-34620561-1',
    CheckoutRequestID: 'ws_CO_191220191020363925',
    ResponseCode: '0',
    ResponseDescription: 'Success. Request accepted for processing',
    CustomerMessage: 'Success. Request accepted for processing'
  },
  
  failedStkPush: {
    ResponseCode: '1',
    ResponseDescription: 'Invalid Access Token',
    errorMessage: 'Invalid Access Token'
  },
  
  successfulCallback: {
    Body: {
      stkCallback: {
        MerchantRequestID: '29115-34620561-1',
        CheckoutRequestID: 'ws_CO_191220191020363925',
        ResultCode: 0,
        ResultDesc: 'The service request is processed successfully.',
        CallbackMetadata: {
          Item: [
            { Name: 'Amount', Value: 1000 },
            { Name: 'MpesaReceiptNumber', Value: 'NLJ7RT61SV' },
            { Name: 'Balance' },
            { Name: 'TransactionDate', Value: 20191219102115 },
            { Name: 'PhoneNumber', Value: 254708374149 },
            { Name: 'AccountReference', Value: 'ORDER-test-123' }
          ]
        }
      }
    }
  },
  
  failedCallback: {
    Body: {
      stkCallback: {
        MerchantRequestID: '29115-34620561-1',
        CheckoutRequestID: 'ws_CO_191220191020363925',
        ResultCode: 1032,
        ResultDesc: 'Request cancelled by user',
        CallbackMetadata: {
          Item: [
            { Name: 'AccountReference', Value: 'ORDER-test-123' }
          ]
        }
      }
    }
  }
}

export const mockFetchSuccess = (responseData: any) => {
  return jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => responseData
  })
}

export const mockFetchError = (status: number = 500, message: string = 'Server Error') => {
  return jest.fn().mockResolvedValue({
    ok: false,
    status,
    statusText: message,
    json: async () => ({ error: message })
  })
}

export const mockFetchNetworkError = () => {
  return jest.fn().mockRejectedValue(new Error('Network Error'))
}

// Test data generators
export const generateOrderId = () => `test-order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

export const generatePhoneNumber = (valid: boolean = true) => {
  if (valid) {
    return '254708374149' // Sandbox test number
  }
  return '123' // Invalid number
}

export const generateAmount = (valid: boolean = true) => {
  if (valid) {
    return Math.floor(Math.random() * 10000) + 1 // 1 to 10000
  }
  return 0 // Invalid amount
}

// Mock Prisma client
export const mockPrismaClient = {
  order: {
    create: jest.fn(),
    update: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn()
  },
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  }
}

// Environment setup for tests
export const setupTestEnvironment = () => {
  process.env.MPESA_CONSUMER_KEY = 'test_consumer_key'
  process.env.MPESA_CONSUMER_SECRET = 'test_consumer_secret'
  process.env.MPESA_SHORTCODE = '174379'
  process.env.MPESA_PASSKEY = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'
  process.env.NEXTAUTH_URL = 'http://localhost:3000'
}

// Cleanup after tests
export const cleanupTestEnvironment = () => {
  delete process.env.MPESA_CONSUMER_KEY
  delete process.env.MPESA_CONSUMER_SECRET
  delete process.env.MPESA_SHORTCODE
  delete process.env.MPESA_PASSKEY
  delete process.env.NEXTAUTH_URL
}

// Assertion helpers
export const expectValidStkPushRequest = (fetchCall: any) => {
  const [url, options] = fetchCall
  expect(url).toBe('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest')
  expect(options.method).toBe('POST')
  expect(options.headers['Content-Type']).toBe('application/json')
  
  const body = JSON.parse(options.body)
  expect(body.BusinessShortCode).toBeDefined()
  expect(body.Password).toBeDefined()
  expect(body.Timestamp).toBeDefined()
  expect(body.TransactionType).toBe('CustomerPayBillOnline')
  expect(body.Amount).toBeGreaterThan(0)
  expect(body.PhoneNumber).toMatch(/^254\d{9}$/)
  expect(body.CallBackURL).toBeDefined()
  expect(body.AccountReference).toBeDefined()
}

export const expectValidTokenRequest = (fetchCall: any) => {
  const [url, options] = fetchCall
  expect(url).toBe('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials')
  expect(options.method).toBe('GET')
  expect(options.headers['Authorization']).toMatch(/^Basic /)
  expect(options.headers['Content-Type']).toBe('application/json')
}

// Test timeout helper
export const withTimeout = (promise: Promise<any>, timeoutMs: number = 5000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Test timeout')), timeoutMs)
    )
  ])
}