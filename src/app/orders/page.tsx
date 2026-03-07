'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Package } from 'lucide-react'
import OrderStatus from '@/components/OrderStatus'

interface Order {
  id: string
  totalAmount: number
  status: string
  createdAt: string
  items: any[]
}

export default function OrdersPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      fetchOrders()
    }
  }, [session])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        // Handle both array and object responses
        const ordersArray = Array.isArray(data) ? data : (data.orders || [])
        setOrders(ordersArray)
      } else {
        setOrders([])
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">My Orders</h1>
            <p className="text-slate-500 dark:text-slate-400">Track and manage your service and product orders</p>
          </div>
        </div>
        
        {Array.isArray(orders) && orders.length === 0 ? (
          <div className="text-center py-24 bg-slate-50 dark:bg-slate-900/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <div className="bg-white dark:bg-slate-800 w-20 h-20 rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No orders yet</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs mx-auto">Start exploring our marketplace to find the services or products you need.</p>
            <button
              onClick={() => router.push('/browse-gigs')}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
            >
              Browse Services
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {Array.isArray(orders) && orders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">Order</span>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        #{order.id.slice(-8).toUpperCase()}
                      </h3>
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <OrderStatus status={order.status as any} />
                </div>
                
                <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                       <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <Package className="w-4 h-4 text-slate-400" />
                       </div>
                       <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                        {Array.isArray(order.items) ? order.items.length : 0} ITEMS
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Total Amount</span>
                      <span className="text-xl font-bold text-slate-900 dark:text-white">
                        KES {order.totalAmount?.toLocaleString() || '0'}
                      </span>
                    </div>
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