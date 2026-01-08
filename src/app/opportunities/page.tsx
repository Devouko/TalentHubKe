'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Search, Filter, Star, Clock, DollarSign, User, ShoppingCart } from 'lucide-react'

interface Gig {
  id: string
  title: string
  description: string
  price: number
  deliveryTime: number
  category: string
  subcategory?: string
  tags: string[]
  images: string[]
  rating: number
  reviewCount: number
  seller: {
    id: string
    name: string
    email: string
  }
  createdAt: string
}

const categories = [
  'All Categories',
  'Programming & Tech',
  'Design & Creative', 
  'Writing & Content',
  'Digital Marketing',
  'Video & Animation',
  'AI & Data Science',
  'Business & Consulting',
  'Finance & Accounting'
]

export default function Opportunities() {
  const [gigs, setGigs] = useState<Gig[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    fetchGigs()
  }, [selectedCategory, searchTerm])

  const fetchGigs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategory !== 'All Categories') {
        params.append('category', selectedCategory)
      }
      if (searchTerm) {
        params.append('search', searchTerm)
      }

      const response = await fetch(`/api/gigs?${params}`)
      if (response.ok) {
        const data = await response.json()
        setGigs(data)
      }
    } catch (error) {
      console.error('Failed to fetch gigs:', error)
    } finally {
      setLoading(false)
    }
  }

  const sortedGigs = [...gigs].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Browse Opportunities
          </h1>
          <p className="text-gray-400">Discover amazing services from talented freelancers</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 p-6 bg-gradient-to-br from-purple-600/10 to-cyan-600/10 backdrop-blur border border-purple-500/20 rounded-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 px-4 py-3 bg-[#1a1a2e] rounded-lg border border-purple-500/20">
              <Search className="w-5 h-5 text-purple-400" />
              <input
                type="text"
                placeholder="Search gigs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none w-full"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-[#1a1a2e] border border-purple-500/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-[#1a1a2e] border border-purple-500/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={fetchGigs}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg font-semibold"
            >
              <Filter className="w-5 h-5" />
              Apply Filters
            </motion.button>
          </div>
        </motion.div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-6 bg-gradient-to-br from-purple-600/10 to-cyan-600/10 backdrop-blur border border-purple-500/20 rounded-xl animate-pulse">
                <div className="h-4 bg-purple-500/20 rounded mb-4"></div>
                <div className="h-3 bg-purple-500/20 rounded mb-2"></div>
                <div className="h-3 bg-purple-500/20 rounded mb-4"></div>
                <div className="h-8 bg-purple-500/20 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedGigs.map((gig, i) => (
              <motion.div
                key={gig.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-6 bg-gradient-to-br from-purple-600/10 to-cyan-600/10 backdrop-blur border border-purple-500/20 rounded-xl group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{gig.seller.name}</h4>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-gray-400">{gig.rating.toFixed(1)} ({gig.reviewCount})</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-purple-600/20 border border-purple-500/30 rounded-full text-xs">
                    {gig.category}
                  </span>
                </div>

                <h3 className="font-bold text-lg mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">
                  {gig.title}
                </h3>

                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {gig.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {gig.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-1 bg-cyan-600/20 border border-cyan-500/30 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                  {gig.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-600/20 border border-gray-500/30 rounded text-xs">
                      +{gig.tags.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-green-400" />
                      <span className="font-bold text-lg">${gig.price}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-gray-400">{gig.deliveryTime}d</span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && sortedGigs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">No gigs found</h3>
            <p className="text-gray-400">Try adjusting your search criteria</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}