'use client'

import { useState, useEffect } from 'react'
import { Star, Search, Trash2, Filter, Eye } from 'lucide-react'
import AdminSidebarLayout from '../AdminSidebarLayout'
import { formatDistanceToNow } from 'date-fns'

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([])
  const [stats, setStats] = useState({ total: 0, gig: 0, product: 0, seller: 0, avgRating: 0 })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterRating, setFilterRating] = useState('all')
  const [selectedReview, setSelectedReview] = useState(null)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/admin/reviews')
      if (!res.ok) throw new Error('Failed to fetch')
      
      const data = await res.json()
      setReviews(data.reviews || [])
      setStats(data.stats || { total: 0, gig: 0, product: 0, seller: 0, avgRating: 0 })
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteReview = async (id, type) => {
    if (!confirm('Delete this review?')) return

    try {
      const endpoint = type === 'gig' ? '/api/reviews' : 
                      type === 'product' ? '/api/product-reviews' : '/api/seller-reviews'
      const res = await fetch(`${endpoint}/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchReviews()
      }
    } catch (error) {
      console.error('Error deleting review:', error)
    }
  }

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.reviewer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || review.type === filterType
    const matchesRating = filterRating === 'all' || review.rating === parseInt(filterRating)
    return matchesSearch && matchesType && matchesRating
  })

  return (
    <AdminSidebarLayout>
      <div className="min-h-screen bg-[#0a192f] text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Star className="w-8 h-8 text-[#10B981]" />
            <h1 className="text-3xl font-bold">Reviews Management</h1>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-[#1e293b] rounded-lg p-4">
              <p className="text-[#94a3b8] text-sm">Total Reviews</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="bg-[#1e293b] rounded-lg p-4">
              <p className="text-[#94a3b8] text-sm">Gig Reviews</p>
              <p className="text-2xl font-bold text-[#3B82F6]">{stats.gig}</p>
            </div>
            <div className="bg-[#1e293b] rounded-lg p-4">
              <p className="text-[#94a3b8] text-sm">Product Reviews</p>
              <p className="text-2xl font-bold text-[#8B5CF6]">{stats.product}</p>
            </div>
            <div className="bg-[#1e293b] rounded-lg p-4">
              <p className="text-[#94a3b8] text-sm">Seller Reviews</p>
              <p className="text-2xl font-bold text-[#F59E0B]">{stats.seller}</p>
            </div>
            <div className="bg-[#1e293b] rounded-lg p-4">
              <p className="text-[#94a3b8] text-sm">Avg Rating</p>
              <p className="text-2xl font-bold text-[#10B981]">{stats.avgRating} ⭐</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-[#1e293b] rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reviews..."
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
                <option value="all">All Types</option>
                <option value="gig">Gig Reviews</option>
                <option value="product">Product Reviews</option>
                <option value="seller">Seller Reviews</option>
              </select>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>

          {/* Reviews Table */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981] mx-auto"></div>
            </div>
          ) : (
            <div className="bg-[#1e293b] rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#0f172a]">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#cbd5e1]">Reviewer</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#cbd5e1]">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#cbd5e1]">Rating</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#cbd5e1]">Comment</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#cbd5e1]">Date</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-[#cbd5e1]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#334155]">
                  {filteredReviews.map((review) => (
                    <tr key={`${review.type}-${review.id}`} className="hover:bg-[#0f172a] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-[#10B981] rounded-full flex items-center justify-center text-sm font-bold">
                            {review.reviewer?.name?.charAt(0) || 'U'}
                          </div>
                          <span className="text-white">{review.reviewer?.name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          review.type === 'gig' ? 'bg-blue-500/20 text-blue-400' :
                          review.type === 'product' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {review.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
                              }`}
                            />
                          ))}
                          <span className="ml-1 text-[#94a3b8]">{review.rating}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-[#94a3b8] line-clamp-2 max-w-md">
                          {review.comment || 'No comment'}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-[#94a3b8] text-sm">
                        {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedReview(review)}
                            className="p-2 hover:bg-[#334155] rounded transition-colors"
                          >
                            <Eye className="w-4 h-4 text-[#3B82F6]" />
                          </button>
                          <button
                            onClick={() => deleteReview(review.id, review.type)}
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
              {filteredReviews.length === 0 && (
                <div className="text-center py-12 text-[#94a3b8]">
                  No reviews found
                </div>
              )}
            </div>
          )}

          {/* Review Details Modal */}
          {selectedReview && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedReview(null)}>
              <div className="bg-[#1e293b] rounded-lg max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Review Details</h2>
                  <button onClick={() => setSelectedReview(null)} className="text-gray-400 hover:text-white">
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-[#94a3b8] text-sm mb-1">Reviewer</p>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-[#10B981] rounded-full flex items-center justify-center font-bold">
                        {selectedReview.reviewer?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-medium">{selectedReview.reviewer?.name || 'Unknown'}</p>
                        <p className="text-sm text-[#94a3b8]">{selectedReview.reviewer?.email}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-[#94a3b8] text-sm mb-1">Type</p>
                    <span className={`px-3 py-1 rounded text-sm font-medium ${
                      selectedReview.type === 'gig' ? 'bg-blue-500/20 text-blue-400' :
                      selectedReview.type === 'product' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {selectedReview.type.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <p className="text-[#94a3b8] text-sm mb-1">Rating</p>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < selectedReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-lg font-semibold">{selectedReview.rating}/5</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-[#94a3b8] text-sm mb-1">Comment</p>
                    <p className="text-white bg-[#0f172a] p-3 rounded">
                      {selectedReview.comment || 'No comment provided'}
                    </p>
                  </div>

                  {selectedReview.images?.length > 0 && (
                    <div>
                      <p className="text-[#94a3b8] text-sm mb-2">Images</p>
                      <div className="flex gap-2 flex-wrap">
                        {selectedReview.images.map((img, i) => (
                          <img key={i} src={img} alt="Review" className="w-20 h-20 object-cover rounded" />
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-[#94a3b8] text-sm mb-1">Date</p>
                    <p className="text-white">
                      {new Date(selectedReview.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={() => {
                        deleteReview(selectedReview.id, selectedReview.type)
                        setSelectedReview(null)
                      }}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded transition-colors"
                    >
                      Delete Review
                    </button>
                    <button
                      onClick={() => setSelectedReview(null)}
                      className="px-4 py-2 bg-[#334155] hover:bg-[#475569] rounded transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminSidebarLayout>
  )
}