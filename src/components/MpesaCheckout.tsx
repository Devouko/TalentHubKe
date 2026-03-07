'use client'

import { useState } from 'react'
import { useMpesa } from '@/hooks/useMpesa'

interface CheckoutProps {
  amount: number
  orderId: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

export default function MpesaCheckout({ amount, orderId, onSuccess, onError }: CheckoutProps) {
  const [phone, setPhone] = useState('254710727775') // Your number pre-filled
  const { initiatePayment, loading, error, clearError } = useMpesa()

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    if (!phone || phone.length < 10) {
      onError?.('Please enter a valid phone number')
      return
    }

    const result = await initiatePayment({
      phone,
      amount,
      orderId,
      description: `Payment for order ${orderId}`
    })

    if (result?.success) {
      alert('Payment request sent! Please check your phone and enter your M-Pesa PIN.')
      onSuccess?.()
    } else {
      onError?.(error || 'Payment failed')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Pay with M-Pesa</h3>
        <div className="text-2xl font-bold text-green-600">
          KES {amount.toLocaleString()}
        </div>
      </div>

      <form onSubmit={handlePayment} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            M-Pesa Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="254710727775"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-md font-semibold transition-colors"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            `Pay KES ${amount.toLocaleString()}`
          )}
        </button>
      </form>

      <div className="mt-4 p-3 bg-gray-50 rounded-md">
        <p className="text-xs text-gray-600">
          <strong>Instructions:</strong>
        </p>
        <ol className="text-xs text-gray-500 mt-1 space-y-1">
          <li>1. Click "Pay" to send payment request</li>
          <li>2. Check your phone for M-Pesa prompt</li>
          <li>3. Enter your M-Pesa PIN to complete</li>
        </ol>
      </div>
    </div>
  )
}