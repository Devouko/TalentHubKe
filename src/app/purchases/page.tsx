'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Calendar, Package } from 'lucide-react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import OrderStatus from '@/components/OrderStatus'

interface Purchase {
  id: string
  totalAmount: number
  status: string
  createdAt: string
  items: any
}

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user?.id) {
      fetchPurchases()
    }
  }, [session])

  const fetchPurchases = async () => {
    try {
      const response = await fetch('/api/purchases')
      if (response.ok) {
        const data = await response.json()
        setPurchases(Array.isArray(data) ? data : [])
      } else {
        setPurchases([])
      }
    } catch (error) {
      console.error('Network error fetching purchases:', error)
      setPurchases([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-100 border-t-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">My Purchases</h1>
          <p className="text-slate-500 dark:text-slate-400">View your completed orders and purchases</p>
        </div>
        
        {purchases.length === 0 ? (
          <div className="text-center py-24 bg-slate-50 dark:bg-slate-900/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <div className="bg-white dark:bg-slate-800 w-20 h-20 rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No purchases yet</h2>
            <p className="text-slate-500 dark:text-slate-400">Your completed purchases will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <div key={purchase.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">Purchase</span>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        #{purchase.id.slice(-8).toUpperCase()}
                      </h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(purchase.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}</span>
                      </div>
                    </div>
                  </div>
                  <OrderStatus status={purchase.status as any} />
                </div>
                
                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Package className="w-4 h-4 text-slate-400" />
                    </div>
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                      {Array.isArray(purchase.items) ? purchase.items.length : 1} ITEMS
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Total Paid</span>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">
                      KES {purchase.totalAmount?.toLocaleString() || '0'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}