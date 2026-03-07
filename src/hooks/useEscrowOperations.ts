import { useState } from 'react'

interface InitiateEscrowParams {
  sellerId: string
  orderId: string
  amount: number
  currency?: string
  productId?: string
  items?: any[]
}

export function useEscrowOperations() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initiate = async (params: InitiateEscrowParams) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/escrow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      })
      if (!res.ok) throw new Error(await res.text())
      return await res.json()
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deliver = async (escrowId: string, proofOfDelivery: any) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/escrow/deliver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ escrowId, proofOfDelivery })
      })
      if (!res.ok) throw new Error(await res.text())
      return await res.json()
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const confirm = async (escrowId: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/escrow/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ escrowId })
      })
      if (!res.ok) throw new Error(await res.text())
      return await res.json()
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const dispute = async (escrowId: string, reason: string, evidence?: any) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/escrow/dispute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ escrowId, reason, evidence })
      })
      if (!res.ok) throw new Error(await res.text())
      return await res.json()
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const resolve = async (escrowId: string, decision: 'RELEASE' | 'REFUND', notes: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/escrow/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ escrowId, decision, notes })
      })
      if (!res.ok) throw new Error(await res.text())
      return await res.json()
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const cancel = async (escrowId: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/escrow/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ escrowId })
      })
      if (!res.ok) throw new Error(await res.text())
      return await res.json()
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { initiate, deliver, confirm, dispute, resolve, cancel, loading, error }
}
