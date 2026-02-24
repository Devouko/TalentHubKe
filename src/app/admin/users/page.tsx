'use client'

import { useState, useEffect } from 'react'
import { Users, Search, Filter, Eye, Edit, Trash2, UserCheck, UserX } from 'lucide-react'
import AdminSidebarLayout from '../AdminSidebarLayout'
import { useRouter } from 'next/navigation'

export default function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleUserStatus = async (userId, isActive) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      })
      if (response.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || user.userType === filterType
    return matchesSearch && matchesFilter
  })

  return (
    <AdminSidebarLayout>
      <div className="min-h-screen bg-[#0a192f] text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-[#10B981]" />
              <h1 className="text-3xl font-bold">User Management</h1>
            </div>
          </div>

          <div className="bg-[#1e293b] rounded-lg p-4 mb-6 flex gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white"
            >
              <option value="all">All Users</option>
              <option value="CLIENT">Clients</option>
              <option value="FREELANCER">Freelancers</option>
              <option value="AGENCY">Agencies</option>
              <option value="ADMIN">Admins</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981] mx-auto"></div>
            </div>
          ) : (
            <div className="bg-[#1e293b] rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#0f172a]">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#cbd5e1]">User</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#cbd5e1]">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#cbd5e1]">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#cbd5e1]">Joined</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-[#cbd5e1]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#334155]">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-[#0f172a] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#10B981] rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {user.name?.[0]?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-white">{user.name || 'No Name'}</p>
                            <p className="text-sm text-[#94a3b8]">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          user.userType === 'ADMIN' ? 'bg-red-500/20 text-red-400' :
                          user.userType === 'FREELANCER' ? 'bg-blue-500/20 text-blue-400' :
                          user.userType === 'AGENCY' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {user.userType}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          user.isVerified ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {user.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#94a3b8]">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => router.push(`/admin/users/${user.id}`)}
                            className="p-2 hover:bg-[#334155] rounded transition-colors"
                          >
                            <Eye className="w-4 h-4 text-[#3B82F6]" />
                          </button>
                          <button 
                            onClick={() => toggleUserStatus(user.id, user.isVerified)}
                            className="p-2 hover:bg-[#334155] rounded transition-colors"
                          >
                            {user.isVerified ? 
                              <UserX className="w-4 h-4 text-[#EF4444]" /> :
                              <UserCheck className="w-4 h-4 text-[#10B981]" />
                            }
                          </button>
                          <button 
                            onClick={() => {
                              if (confirm('Delete this user?')) {
                                fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' })
                                  .then(() => fetchUsers())
                              }
                            }}
                            className="p-2 hover:bg-[#334155] rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-[#EF4444]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminSidebarLayout>
  )
}