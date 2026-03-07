import { useState } from 'react'
import { toast } from 'sonner'

interface EscrowTransaction {
  id: string
  amount: number
  status: string
  buyerId: string
  sellerId: string
  productId: string
}

export function useEscrow() {
  const [loading, setLoading] = useState(false)
  const [transaction, setTransaction] = useState<EscrowTransaction | null>(null)

  const createEscrow = async (data: {
    sellerId: string
    productId: string
    amount: number
    items: any[]
  }) => {
    setLoading(true)
    try {
      const res = await fetch('/api/escrow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error('Failed to create escrow')

      const result = await res.json()
      setTransaction(result)
      toast.success('Escrow transaction created')
      return result
    } catch (error) {
      toast.error('Failed to create escrow')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const approveEscrow = async (id: string, adminNotes?: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/escrow/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve', adminNotes }),
      })

      if (!res.ok) throw new Error('Failed to approve')

      const result = await res.json()
      setTransaction(result)
      toast.success('Escrow approved')
      return result
    } catch (error) {
      toast.error('Failed to approve escrow')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const completeEscrow = async (id: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/escrow/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'complete' }),
      })

      if (!res.ok) throw new Error('Failed to complete')

      const result = await res.json()
      setTransaction(result)
      toast.success('Escrow completed')
      return result
    } catch (error) {
      toast.error('Failed to complete escrow')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const refundEscrow = async (id: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/escrow/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'refund' }),
      })

      if (!res.ok) throw new Error('Failed to refund')

      const result = await res.json()
      setTransaction(result)
      toast.success('Escrow refunded')
      return result
    } catch (error) {
      toast.error('Failed to refund escrow')
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    transaction,
    createEscrow,
    approveEscrow,
    completeEscrow,
    refundEscrow,
  }
}
