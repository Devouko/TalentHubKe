// hooks/useMpesa.ts
import { useState } from 'react'

interface MpesaPaymentData {
  phone: string
  amount: number
  orderId: string
  description?: string
}

interface MpesaResponse {
  success: boolean
  message: string
  data?: {
    MerchantRequestID: string
    CheckoutRequestID: string
    ResponseCode: string
    ResponseDescription: string
  }
  error?: string
}

export function useMpesa() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initiatePayment = async (paymentData: MpesaPaymentData): Promise<MpesaResponse | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/mpesa/stkpush', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      })

      const result: MpesaResponse = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Payment failed')
      }

      if (result.success && result.data?.ResponseCode === '0') {
        // STK push sent successfully
        return result
      } else {
        throw new Error(result.data?.ResponseDescription || 'Payment initiation failed')
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    initiatePayment,
    loading,
    error,
    clearError: () => setError(null)
  }
}