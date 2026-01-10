'use client'

import { useState, useEffect } from 'react'
import { Briefcase, Search, Eye, Trash2, Edit, Star } from 'lucide-react'
import AdminSidebarLayout from '../AdminSidebarLayout'

export default function AdminGigsPage() {
  const [gigs, setGigs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchGigs()
  }, [])

  const fetchGigs = async () => {
    try {
      const response = await fetch('/api/gigs')
      const data = await response.json()
      setGigs(data || [])
    } catch (error) {
      console.error('Error fetching gigs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredGigs = gigs.filter(gig =>
    gig.title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AdminSidebarLayout>
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-purple-400" />
              <h1 className="text-3xl font-bold">All Gigs</h1>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search gigs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading gigs...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGigs.map(gig => (
                <div key={gig.id} className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-purple-500 transition-colors">
                  <h3 className="font-semibold text-white text-lg mb-2">{gig.title}</h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{gig.description}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-300">{gig.rating || 5.0}</span>
                    <span className="text-gray-500 text-sm">• {gig.category}</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-green-400">KES {gig.price?.toLocaleString()}</span>
                    <span className="text-sm text-gray-400">{gig.deliveryTime} days</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1">
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminSidebarLayout>
  )
}