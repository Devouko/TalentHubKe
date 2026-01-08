'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Clock, DollarSign, User, Package } from 'lucide-react'

export default function AdminEscrowPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user?.userType !== 'ADMIN') {
      router.push('/dashboard')
      return
    }
    fetchTransactions()
  }, [session, status, router])

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/escrow')
      const data = await response.json()
      setTransactions(data)
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateTransactionStatus = async (id, status, adminNotes = '') => {
    try {
      const response = await fetch('/api/escrow', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, adminNotes })
      })
      
      if (response.ok) {
        fetchTransactions()
      }
    } catch (error) {
      console.error('Error updating transaction:', error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-400 bg-yellow-400/20'
      case 'APPROVED': return 'text-green-400 bg-green-400/20'
      case 'REJECTED': return 'text-red-400 bg-red-400/20'
      case 'COMPLETED': return 'text-blue-400 bg-blue-400/20'
      case 'REFUNDED': return 'text-gray-400 bg-gray-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white ml-64 transition-all">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Escrow Management</h1>
          <p className="text-gray-400">Review and manage escrow transactions</p>
        </div>

        <div className="grid gap-6">
          {transactions.map(transaction => (
            <div key={transaction.id} className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                    <span className="text-2xl font-bold text-green-400">
                      KES {transaction.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {transaction.buyer.name}
                    </div>
                    <div>
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                {transaction.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateTransactionStatus(transaction.id, 'APPROVED')}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => updateTransactionStatus(transaction.id, 'REJECTED', 'Transaction rejected by admin')}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-white">Items:</h4>
                {transaction.items.map(item => (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-700 rounded-lg">
                    <Package className="w-8 h-8 text-gray-400" />
                    <div className="flex-1">
                      <div className="font-medium text-white">{item.product.title}</div>
                      <div className="text-sm text-gray-400">
                        Quantity: {item.quantity} × KES {item.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-green-400 font-semibold">
                      KES {(item.quantity * item.price).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {transaction.adminNotes && (
                <div className="mt-4 p-3 bg-blue-600/20 border border-blue-600/30 rounded-lg">
                  <div className="text-sm text-blue-400 font-medium mb-1">Admin Notes:</div>
                  <div className="text-white text-sm">{transaction.adminNotes}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {transactions.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No escrow transactions</h3>
            <p className="text-gray-400">Transactions will appear here when customers make purchases</p>
          </div>
        )}
      </div>
    </div>
  )
}