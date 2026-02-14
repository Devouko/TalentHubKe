'use client'

import { useState, useEffect } from 'react'
import { Store, Search, Eye, UserCheck, UserX, TrendingUp, DollarSign } from 'lucide-react'
import AdminSidebarLayout from '../AdminSidebarLayout'

export default function AdminSellerDashboardPage() {
  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchSellers()
  }, [])

  const fetchSellers = async () => {
    try {
      const response = await fetch('/api/sellers')
      if (response.ok) {
        const data = await response.json()
        setSellers(data)
      } else {
        console.error('Failed to fetch sellers')
      }
    } catch (error) {
      console.error('Error fetching sellers:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateSellerStatus = async (sellerId, newStatus) => {
    try {
      const response = await fetch(`/api/sellers/${sellerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (response.ok) {
        setSellers(prev => prev.map(seller => 
          seller.id === sellerId ? { ...seller, status: newStatus } : seller
        ))
      }
    } catch (error) {
      console.error('Error updating seller status:', error)
    }
  }

  const filteredSellers = sellers.filter(seller => {
    const matchesSearch = seller.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         seller.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || seller.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const totalStats = {
    totalSellers: sellers.length,
    activeSellers: sellers.filter(s => s.status === 'active').length,
    pendingSellers: sellers.filter(s => s.status === 'pending').length,
    totalEarnings: sellers.reduce((sum, s) => sum + s.totalEarnings, 0)
  }

  return (
    <AdminSidebarLayout>
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Store className="w-8 h-8 text-purple-400" />
              <h1 className="text-3xl font-bold">Seller Management</h1>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Total Sellers</p>
                  <p className="text-2xl font-bold text-white">{totalStats.totalSellers}</p>
                </div>
                <Store className="w-8 h-8 text-purple-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Active Sellers</p>
                  <p className="text-2xl font-bold text-white">{totalStats.activeSellers}</p>
                </div>
                <UserCheck className="w-8 h-8 text-green-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100">Pending Approval</p>
                  <p className="text-2xl font-bold text-white">{totalStats.pendingSellers}</p>
                </div>
                <UserX className="w-8 h-8 text-yellow-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Earnings</p>
                  <p className="text-2xl font-bold text-white">KES {totalStats.totalEarnings.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-200" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search sellers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading sellers...</p>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Seller</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Earnings</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Gigs</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rating</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredSellers.map(seller => (
                      <tr key={seller.id} className="hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">{seller.name?.[0] || 'S'}</span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">{seller.name}</div>
                              <div className="text-sm text-gray-400">{seller.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            seller.status === 'active' ? 'bg-green-600 text-white' :
                            seller.status === 'pending' ? 'bg-yellow-600 text-white' :
                            'bg-red-600 text-white'
                          }`}>
                            {seller.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-400">
                          KES {seller.totalEarnings.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {seller.activeGigs} active
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {seller.rating > 0 ? `${seller.rating}/5.0` : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button className="text-blue-400 hover:text-blue-300">
                              <Eye className="w-4 h-4" />
                            </button>
                            {seller.status === 'pending' && (
                              <button 
                                onClick={() => updateSellerStatus(seller.id, 'active')}
                                className="text-green-400 hover:text-green-300"
                              >
                                <UserCheck className="w-4 h-4" />
                              </button>
                            )}
                            <button className="text-red-400 hover:text-red-300">
                              <UserX className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminSidebarLayout>
  )
}