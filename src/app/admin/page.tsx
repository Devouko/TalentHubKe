'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { BarChart3, Users, ShoppingCart, DollarSign, TrendingUp, MessageCircle } from 'lucide-react'
import AdminSidebarLayout from './AdminSidebarLayout'
import TradeCharts from '@/components/admin/TradeCharts'
import RealtimeMessaging from '@/components/admin/RealtimeMessaging'

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
      case 'order': return 'bg-green-600'
      case 'gig': return 'bg-blue-600'
      default: return 'bg-gray-600'
    }
  }

  if (status === 'loading' || loading) {
    return (
      <AdminSidebarLayout>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
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
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Total Users</p>
                  <p className="text-2xl font-bold text-white">{stats?.totalUsers || 0}</p>
                </div>
                <Users className="w-8 h-8 text-purple-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Active Gigs</p>
                  <p className="text-2xl font-bold text-white">{stats?.activeGigs || 0}</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-blue-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Total Revenue</p>
                  <p className="text-2xl font-bold text-white">KES {(stats?.totalRevenue || 0).toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Total Orders</p>
                  <p className="text-2xl font-bold text-white">{stats?.totalOrders || 0}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-200" />
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