'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { BarChart3, Users, ShoppingCart, DollarSign, TrendingUp, MessageCircle, Package } from 'lucide-react'
import AdminSidebarLayout from './AdminSidebarLayout'
import dynamic from 'next/dynamic'

// Dynamically import components with error handling
const TradeCharts = dynamic(() => import('@/components/admin/TradeCharts'), {
  loading: () => <div className="bg-gray-800 rounded-xl p-6 h-64 animate-pulse" />,
  ssr: false
})

const RealtimeMessaging = dynamic(() => import('@/components/admin/RealtimeMessaging'), {
  loading: () => <div className="bg-gray-800 rounded-xl p-6 h-96 animate-pulse" />,
  ssr: false
})

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth')
      return
    }
    if (session.user?.userType !== 'ADMIN') {
      router.push('/dashboard')
      return
    }
    fetchStats()
  }, [session, status, router])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = (now - date) / (1000 * 60)
    
    if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)} min ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hr ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)} day ago`
    }
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user': return <Users className="w-5 h-5 text-white" />
      case 'order': return <DollarSign className="w-5 h-5 text-white" />
      case 'gig': return <ShoppingCart className="w-5 h-5 text-white" />
      default: return <BarChart3 className="w-5 h-5 text-white" />
    }
  }

  const getActivityColor = (type) => {
    switch (type) {
      case 'user': return 'bg-purple-600'
      case 'order': return 'bg-blue-600'
      case 'gig': return 'bg-orange-600'
      default: return 'bg-gray-600'
    }
  }

  if (status === 'loading' || loading) {
    return (
      <AdminSidebarLayout>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-800 border-t-blue-600"></div>
        </div>
      </AdminSidebarLayout>
    )
  }

  if (!session || session.user?.userType !== 'ADMIN') {
    return null
  }

  return (
    <AdminSidebarLayout>
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-gray-400">Marketplace Performance Overview</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-lg shadow-blue-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Users</p>
                  <p className="text-2xl font-black text-white mt-1">{stats?.totalUsers || 0}</p>
                </div>
                <Users className="w-8 h-8 text-blue-200/50" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-2xl shadow-lg shadow-blue-400/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Active Gigs</p>
                  <p className="text-2xl font-black text-white mt-1">{stats?.activeGigs || 0}</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-blue-200/50" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-6 rounded-2xl shadow-lg shadow-orange-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Total Revenue</p>
                  <p className="text-2xl font-black text-white mt-1">KES {(stats?.totalRevenue || 0).toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-orange-200/50" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-700 to-slate-900 p-6 rounded-2xl shadow-lg shadow-slate-900/20 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-sm font-medium">Total Orders</p>
                  <p className="text-2xl font-black text-white mt-1">{stats?.totalOrders || 0}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-slate-500/50" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl shadow-lg shadow-indigo-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm font-medium">Products</p>
                  <p className="text-2xl font-black text-white mt-1">{stats?.totalProducts || 0}</p>
                </div>
                <Package className="w-8 h-8 text-indigo-200/50" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-600 to-rose-700 p-6 rounded-2xl shadow-lg shadow-red-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">Pending Apps</p>
                  <p className="text-2xl font-black text-white mt-1">{stats?.pendingApplications || 0}</p>
                </div>
                <Users className="w-8 h-8 text-red-200" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-6 rounded-2xl shadow-lg shadow-indigo-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm font-medium">Escrow Pending</p>
                  <p className="text-2xl font-black text-white mt-1">{stats?.escrowPending || 0}</p>
                </div>
                <DollarSign className="w-8 h-8 text-indigo-200/50" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-red-700 p-6 rounded-2xl shadow-lg shadow-red-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">Disputes</p>
                  <p className="text-2xl font-black text-white mt-1">{stats?.disputedOrders || 0}</p>
                </div>
                <MessageCircle className="w-8 h-8 text-red-200/50" />
              </div>
            </div>
          </div>

          <TradeCharts />

          <RealtimeMessaging />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {stats?.recentActivity?.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-gray-700 rounded-lg">
                    <div className={`w-10 h-10 ${getActivityColor(activity.type)} rounded-full flex items-center justify-center`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{activity.title}</p>
                      <p className="text-gray-400 text-sm">{activity.description}</p>
                    </div>
                    <span className="text-gray-400 text-sm">{formatTime(activity.time)}</span>
                  </div>
                )) || (
                  <div className="text-center text-gray-400 py-8">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Pending Orders</span>
                  <span className="text-yellow-400 font-semibold">{stats?.pendingOrders || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Completed Orders</span>
                  <span className="text-green-400 font-semibold">{stats?.completedOrders || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Active Sellers</span>
                  <span className="text-blue-400 font-semibold">{stats?.activeSellers || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Total Gigs</span>
                  <span className="text-purple-400 font-semibold">{stats?.activeGigs || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Platform Users</span>
                  <span className="text-cyan-400 font-semibold">{stats?.totalUsers || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminSidebarLayout>
  )
}