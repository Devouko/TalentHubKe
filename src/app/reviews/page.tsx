'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Star, User, ThumbsUp, ThumbsDown, Filter, Search } from 'lucide-react'

interface Review {
  id: string
  rating: number
  comment: string
  reviewer: {
    name: string
    avatar: string
    verified: boolean
  }
  seller: {
    id: string
    name: string
    avatar: string
  }
  product: {
    id: string
    name: string
    image: string
  }
  date: string
  helpful: number
  notHelpful: number
  verified: boolean
}

const mockReviews: Review[] = [
  {
    id: '1',
    rating: 5,
    comment: 'Excellent coffee beans! Fresh roast and authentic Kenyan flavor. Fast delivery to Nairobi. Highly recommend!',
    reviewer: { name: 'Mary Wanjiku', avatar: '', verified: true },
    seller: { id: 's1', name: 'Nairobi Coffee Co.', avatar: '' },
    product: { id: 'p1', name: 'Kenyan Coffee Beans - Premium', image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=100' },
    date: '2024-01-15',
    helpful: 12,
    notHelpful: 1,
    verified: true
  },
  {
    id: '2',
    rating: 4,
    comment: 'Beautiful Maasai jewelry. Authentic craftsmanship. Only issue was slightly delayed delivery to Mombasa.',
    reviewer: { name: 'James Kiprotich', avatar: '', verified: true },
    seller: { id: 's2', name: 'Maasai Crafts', avatar: '' },
    product: { id: 'p2', name: 'Maasai Beaded Jewelry', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100' },
    date: '2024-01-12',
    helpful: 8,
    notHelpful: 0,
    verified: true
  },
  {
    id: '3',
    rating: 5,
    comment: 'Perfect kikoy for the beach! Great quality cotton and vibrant colors. Will definitely buy again.',
    reviewer: { name: 'Fatuma Hassan', avatar: '', verified: false },
    seller: { id: 's3', name: 'Coastal Textiles', avatar: '' },
    product: { id: 'p3', name: 'Kikoy Beach Towel', image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=100' },
    date: '2024-01-10',
    helpful: 15,
    notHelpful: 2,
    verified: false
  },
  {
    id: '4',
    rating: 3,
    comment: 'Data bundle worked fine but took longer than expected to activate. Customer service was helpful though.',
    reviewer: { name: 'Peter Mwangi', avatar: '', verified: true },
    seller: { id: 's4', name: 'Digital Services', avatar: '' },
    product: { id: 'p4', name: 'Safaricom Data Bundle', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100' },
    date: '2024-01-08',
    helpful: 5,
    notHelpful: 3,
    verified: true
  }
]

export default function Reviews() {
  const [reviews] = useState<Review[]>(mockReviews)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.product.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'verified' && review.verified) ||
                         (filter === 'high' && review.rating >= 4) ||
                         (filter === 'low' && review.rating <= 2)
    
    return matchesSearch && matchesFilter
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating-high':
        return b.rating - a.rating
      case 'rating-low':
        return a.rating - b.rating
      case 'helpful':
        return b.helpful - a.helpful
      case 'newest':
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime()
    }
  })

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
        }`}
      />
    ))
  }

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: (reviews.filter(r => r.rating === rating).length / reviews.length) * 100
  }))

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
            Reviews & Ratings
          </h1>
          <p className="text-gray-400">Customer feedback for sellers and products</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Rating Overview */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 mb-6">
              <h2 className="text-xl font-bold mb-4">Overall Rating</h2>
              
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-yellow-400 mb-2">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex justify-center mb-2">
                  {renderStars(Math.round(averageRating))}
                </div>
                <div className="text-sm text-gray-400">
                  Based on {reviews.length} reviews
                </div>
              </div>

              <div className="space-y-2">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-2 text-sm">
                    <span className="w-3">{rating}</span>
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Filter by</label>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="all">All Reviews</option>
                    <option value="verified">Verified Only</option>
                    <option value="high">High Ratings (4-5★)</option>
                    <option value="low">Low Ratings (1-2★)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Sort by</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="rating-high">Highest Rating</option>
                    <option value="rating-low">Lowest Rating</option>
                    <option value="helpful">Most Helpful</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Reviews List */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reviews, sellers, or products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {filteredReviews.map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-yellow-500 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{review.reviewer.name}</span>
                        {review.reviewer.verified && (
                          <span className="px-2 py-1 bg-green-600/20 border border-green-500/30 rounded-full text-xs text-green-400">
                            Verified
                          </span>
                        )}
                        <span className="text-gray-400 text-sm">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-sm text-gray-400">
                          {review.rating}/5
                        </span>
                      </div>

                      <p className="text-gray-300 mb-4">{review.comment}</p>

                      {/* Product & Seller Info */}
                      <div className="flex items-center gap-4 mb-4 p-3 bg-gray-700/50 rounded-lg">
                        <img
                          src={review.product.image}
                          alt={review.product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <div className="font-medium text-sm">{review.product.name}</div>
                          <div className="text-gray-400 text-xs">
                            Sold by {review.seller.name}
                          </div>
                        </div>
                      </div>

                      {/* Helpful Buttons */}
                      <div className="flex items-center gap-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 px-3 py-1 bg-green-600/20 border border-green-500/30 rounded-full text-sm hover:bg-green-600/30 transition-colors"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>Helpful ({review.helpful})</span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 px-3 py-1 bg-red-600/20 border border-red-500/30 rounded-full text-sm hover:bg-red-600/30 transition-colors"
                        >
                          <ThumbsDown className="w-3 h-3" />
                          <span>Not Helpful ({review.notHelpful})</span>
                        </motion.button>

                        {review.verified && (
                          <span className="px-2 py-1 bg-green-600/20 border border-green-500/30 rounded-full text-xs text-green-400">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredReviews.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold mb-2">No reviews found</h3>
                <p className="text-gray-400">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}