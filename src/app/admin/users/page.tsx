'use client'

import { useEffect, useState } from 'react'
import { Users, Search, Filter, Edit, Trash2, Shield, Ban, CheckCircle, AlertTriangle } from 'lucide-react'
import AdminSidebarLayout from '../AdminSidebarLayout'

interface User {
  id: string
  email: string
  name: string
  userType: 'CLIENT' | 'FREELANCER' | 'AGENCY' | 'ADMIN'
  isVerified: boolean
  sellerStatus: 'NOT_APPLIED' | 'PENDING' | 'APPROVED' | 'REJECTED'
  balance: number
  createdAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('ALL')

  useEffect(() => {
    fetchUsers()
  }, [])

  /**
   * Fetches users from the API with proper error handling
   * Includes loading states and error management
   */
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setUsers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching users:', error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'ALL' || user.userType === filterType
    return matchesSearch && matchesFilter
  })

  return (
    <AdminSidebarLayout>
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-purple-400" />
              <h1 className="text-3xl font-bold">User Management</h1>
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="ALL">All Users</option>
                <option value="CLIENT">Clients</option>
                <option value="FREELANCER">Freelancers</option>
                <option value="AGENCY">Agencies</option>
                <option value="ADMIN">Admins</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading users...</p>
            </div>
          ) : (
            <>
              <div className="bg-gray-800 rounded-xl overflow-hidden mb-8">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {filteredUsers.map(user => (
                        <tr key={user.id} className="hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">{user.name?.[0] || 'U'}</span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-white">{user.name || 'Unknown'}</div>
                                <div className="text-sm text-gray-400">ID: {user.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              user.userType === 'ADMIN' ? 'bg-red-600 text-white' :
                              user.userType === 'SELLER' ? 'bg-blue-600 text-white' :
                              'bg-gray-600 text-white'
                            }`}>
                              {user.userType || 'USER'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="flex items-center gap-1 text-sm">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <span className="text-green-400">Active</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <button className="text-blue-400 hover:text-blue-300">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="text-green-400 hover:text-green-300">
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button className="text-red-400 hover:text-red-300">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gray-800 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Users</p>
                      <p className="text-2xl font-bold text-white">{users.length}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
                <div className="bg-gray-800 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Active Users</p>
                      <p className="text-2xl font-bold text-white">{users.filter(u => u.userType !== 'ADMIN').length}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                </div>
                <div className="bg-gray-800 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Sellers</p>
                      <p className="text-2xl font-bold text-white">{users.filter(u => u.userType === 'SELLER').length}</p>
                    </div>
                    <Shield className="w-8 h-8 text-purple-400" />
                  </div>
                </div>
                <div className="bg-gray-800 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Admins</p>
                      <p className="text-2xl font-bold text-white">{users.filter(u => u.userType === 'ADMIN').length}</p>
                    </div>
                    <Ban className="w-8 h-8 text-red-400" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminSidebarLayout>
  )
}