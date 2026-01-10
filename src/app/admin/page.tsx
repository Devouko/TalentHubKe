'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { BarChart3, Users, ShoppingCart, DollarSign, TrendingUp, MessageCircle } from 'lucide-react'
import AdminSidebarLayout from './AdminSidebarLayout'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

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
  }, [session, status, router])

  if (status === 'loading') {
    return <div>Loading...</div>
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
                  <p className="text-2xl font-bold text-white">1,247</p>
                </div>
                <Users className="w-8 h-8 text-purple-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Active Gigs</p>
                  <p className="text-2xl font-bold text-white">89</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-blue-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Total Revenue</p>
                  <p className="text-2xl font-bold text-white">KES 450K</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Orders</p>
                  <p className="text-2xl font-bold text-white">156</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-200" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-gray-700 rounded-lg">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">New user registered</p>
                    <p className="text-gray-400 text-sm">John Doe joined the platform</p>
                  </div>
                  <span className="text-gray-400 text-sm">2 min ago</span>
                </div>
                <div className="flex items-center gap-4 p-3 bg-gray-700 rounded-lg">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">Payment received</p>
                    <p className="text-gray-400 text-sm">KES 15,000 from order #1234</p>
                  </div>
                  <span className="text-gray-400 text-sm">5 min ago</span>
                </div>
                <div className="flex items-center gap-4 p-3 bg-gray-700 rounded-lg">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">New gig created</p>
                    <p className="text-gray-400 text-sm">Logo design service added</p>
                  </div>
                  <span className="text-gray-400 text-sm">10 min ago</span>
                </div>
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
                  <span className="text-yellow-400 font-semibold">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Completed Orders</span>
                  <span className="text-green-400 font-semibold">156</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Active Sellers</span>
                  <span className="text-blue-400 font-semibold">45</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Total Products</span>
                  <span className="text-purple-400 font-semibold">89</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Support Tickets</span>
                  <span className="text-red-400 font-semibold">12</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminSidebarLayout>
  )
}