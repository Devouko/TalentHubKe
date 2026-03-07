'use client'

import { useState, useEffect } from 'react'
import { Package, Search, Eye, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react'
import AdminSidebarLayout from '../AdminSidebarLayout'

export default function GigsPage() {
  const [gigs, setGigs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchGigs()
  }, [])

  const fetchGigs = async () => {
    try {
      const response = await fetch('/api/admin/gigs')
      if (response.ok) {
        const data = await response.json()
        setGigs(data)
      }
    } catch (error) {
      console.error('Error fetching gigs:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleGigStatus = async (gigId, isActive) => {
    try {
      const response = await fetch(`/api/admin/gigs/${gigId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      })
      if (response.ok) {
        fetchGigs()
      }
    } catch (error) {
      console.error('Error updating gig:', error)
    }
  }

  const filteredGigs = gigs.filter(gig =>
    gig.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gig.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AdminSidebarLayout>
      <div className="min-h-screen bg-[#0a192f] text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-[#10B981]" />
              <h1 className="text-3xl font-bold">Gigs Management</h1>
            </div>
          </div>

          <div className="bg-[#1e293b] rounded-lg p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search gigs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white"
              />
            </div>
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
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#cbd5e1]">Gig</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#cbd5e1]">Seller</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#cbd5e1]">Category</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#cbd5e1]">Price</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#cbd5e1]">Status</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-[#cbd5e1]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#334155]">
                  {filteredGigs.map((gig) => (
                    <tr key={gig.id} className="hover:bg-[#0f172a] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-[#0f172a] rounded-lg flex items-center justify-center">
                            {gig.images?.[0] ? (
                              <img src={gig.images[0]} alt={gig.title} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <Package className="w-6 h-6 text-[#475569]" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-white">{gig.title}</p>
                            <p className="text-sm text-[#94a3b8] line-clamp-1">{gig.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#94a3b8]">{gig.users?.name || 'Unknown'}</td>
                      <td className="px-4 py-3 text-[#94a3b8]">{gig.category}</td>
                      <td className="px-4 py-3 text-[#10B981] font-semibold">KES {gig.price?.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          gig.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {gig.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 hover:bg-[#334155] rounded transition-colors">
                            <Eye className="w-4 h-4 text-[#3B82F6]" />
                          </button>
                          <button 
                            onClick={() => toggleGigStatus(gig.id, gig.isActive)}
                            className="p-2 hover:bg-[#334155] rounded transition-colors"
                          >
                            {gig.isActive ? 
                              <XCircle className="w-4 h-4 text-[#EF4444]" /> :
                              <CheckCircle className="w-4 h-4 text-[#10B981]" />
                            }
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