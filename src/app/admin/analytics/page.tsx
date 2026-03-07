'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Users, DollarSign, ShoppingCart, Eye, MessageCircle, Star, Package } from 'lucide-react'
import AdminSidebarLayout from '../AdminSidebarLayout'
import PageLayout from '@/components/layouts/PageLayout'

interface AnalyticsData {
  totalUsers: number
  totalRevenue: number
  totalOrders: number
  totalGigs: number
  totalProducts: number
  totalMessages: number
  averageRating: number
  activeUsers: number
  revenueGrowth: number
  userGrowth: number
  orderGrowth: number
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    totalRevenue: 0,
    totalOrders: 0,
    totalGigs: 0,
    totalProducts: 0,
    totalMessages: 0,
    averageRating: 0,
    activeUsers: 0,
    revenueGrowth: 0,
    userGrowth: 0,
    orderGrowth: 0
  })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/analytics?range=${timeRange}`)
      if (res.ok) {
        const data = await res.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    {
      title: 'Total Users',
      value: analytics.totalUsers.toLocaleString(),
      icon: Users,
      change: analytics.userGrowth,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Total Revenue',
      value: `KSh ${analytics.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      change: analytics.revenueGrowth,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Total Orders',
      value: analytics.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      change: analytics.orderGrowth,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Active Users',
      value: analytics.activeUsers.toLocaleString(),
      icon: Eye,
      change: 0,
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Total Gigs',
      value: analytics.totalGigs.toLocaleString(),
      icon: Package,
      change: 0,
      color: 'from-pink-500 to-pink-600'
    },
    {
      title: 'Total Products',
      value: analytics.totalProducts.toLocaleString(),
      icon: Package,
      change: 0,
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      title: 'Messages Sent',
      value: analytics.totalMessages.toLocaleString(),
      icon: MessageCircle,
      change: 0,
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      title: 'Average Rating',
      value: analytics.averageRating.toFixed(1),
      icon: Star,
      change: 0,
      color: 'from-yellow-500 to-yellow-600'
    }
  ]

  return (
    <AdminSidebarLayout>
      <PageLayout variant="dark">
        <div className="container-custom py-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-black text-white mb-2">Analytics Dashboard</h1>
              <p className="text-slate-400">Monitor your platform performance and metrics</p>
            </div>
            <div className="flex gap-2">
              {['7d', '30d', '90d', '1y'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`btn ${
                    timeRange === range ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card card-dark p-6 animate-pulse">
                  <div className="h-4 bg-slate-700 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-slate-700 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="card card-dark card-hover p-6 relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -mr-16 -mt-16`}></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        {stat.change !== 0 && (
                          <div className={`flex items-center gap-1 text-sm font-bold ${
                            stat.change > 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            <TrendingUp className={`w-4 h-4 ${stat.change < 0 ? 'rotate-180' : ''}`} />
                            {Math.abs(stat.change)}%
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-slate-400 text-sm font-medium mb-1">{stat.title}</h3>
                      <p className="text-3xl font-black text-white">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card card-dark p-6">
                  <h3 className="text-xl font-black text-white mb-4">Revenue Overview</h3>
                  <div className="h-64 flex items-center justify-center text-slate-500">
                    <p>Chart visualization coming soon</p>
                  </div>
                </div>

                <div className="card card-dark p-6">
                  <h3 className="text-xl font-black text-white mb-4">User Growth</h3>
                  <div className="h-64 flex items-center justify-center text-slate-500">
                    <p>Chart visualization coming soon</p>
                  </div>
                </div>

                <div className="card card-dark p-6">
                  <h3 className="text-xl font-black text-white mb-4">Top Performing Gigs</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
                      <span className="text-slate-300">No data available</span>
                    </div>
                  </div>
                </div>

                <div className="card card-dark p-6">
                  <h3 className="text-xl font-black text-white mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
                      <span className="text-slate-300">No recent activity</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </PageLayout>
    </AdminSidebarLayout>
  )
}
