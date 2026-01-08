'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { 
  Package, Plus, Edit, Trash2, Eye, Star, AlertCircle, 
  Search, Filter, MoreVertical, TrendingUp, DollarSign
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'

export default function ProductsManagement() {
  const { data: session } = useSession()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    if (session?.user?.id) {
      fetchProducts()
    }
  }, [session])

  const fetchProducts = async () => {
    try {
      const response = await fetch(`/api/products?sellerId=${session?.user?.id}`)
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const getProductStatus = (product) => {
    if (!product.isActive) return 'inactive'
    // Simulate stock levels for demo
    const stock = Math.floor(Math.random() * 50)
    if (stock === 0) return 'out-of-stock'
    if (stock < 10) return 'low-stock'
    return 'active'
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase())
    const status = getProductStatus(product)
    const matchesStatus = statusFilter === 'all' || status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to manage products</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                Product Management
              </h1>
              <p className="text-gray-400">Manage your product inventory and listings</p>
            </div>
            <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Link href="/create-product">
                <Plus className="w-5 h-5 mr-2" />
                Add New Product
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[
              { 
                label: 'Total Products', 
                value: products.length, 
                icon: Package, 
                color: 'text-green-400',
                bg: 'bg-green-500/10'
              },
              { 
                label: 'Active Products', 
                value: products.filter(p => p.isActive).length, 
                icon: TrendingUp, 
                color: 'text-yellow-400',
                bg: 'bg-yellow-500/10'
              },
              { 
                label: 'Total Revenue', 
                value: `KES ${(products.reduce((sum, p) => sum + (p.price * (p.orderCount || 0)), 0)).toLocaleString()}`, 
                icon: DollarSign, 
                color: 'text-yellow-400',
                bg: 'bg-yellow-500/10'
              },
              { 
                label: 'Avg Rating', 
                value: products.length > 0 ? (products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.length).toFixed(1) : '0.0', 
                icon: Star, 
                color: 'text-green-400',
                bg: 'bg-green-500/10'
              }
            ].map((stat, i) => (
              <Card key={i} className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${stat.bg}`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div>
                      <div className="text-lg font-bold">{stat.value}</div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => {
              const status = getProductStatus(product)
              const stock = Math.floor(Math.random() * 50) // Simulated stock
              
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden"
                >
                  {/* Product Image */}
                  <div className="h-48 bg-gradient-to-br from-green-600/20 to-yellow-600/20 flex items-center justify-center">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-16 h-16 text-gray-400" />
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-white text-lg truncate flex-1">
                        {product.title}
                      </h3>
                      <Button variant="ghost" size="sm" className="p-1">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>

                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex justify-between items-center mb-3">
                      <span className="text-2xl font-bold text-green-400">
                        KES {product.price.toLocaleString()}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        status === 'active' ? 'bg-green-600/20 text-green-400' :
                        status === 'low-stock' ? 'bg-yellow-600/20 text-yellow-400' :
                        status === 'out-of-stock' ? 'bg-red-600/20 text-red-400' :
                        'bg-gray-600/20 text-gray-400'
                      }`}>
                        {status === 'out-of-stock' ? 'Out of Stock' :
                         status === 'low-stock' ? 'Low Stock' :
                         status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-sm text-gray-400 mb-4">
                      <div className="text-center">
                        <div className="font-semibold text-white">{stock}</div>
                        <div>Stock</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-white">{product.orderCount || 0}</div>
                        <div>Orders</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-white flex items-center justify-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400" />
                          {product.rating?.toFixed(1) || '0.0'}
                        </div>
                        <div>Rating</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 border-gray-600 hover:bg-gray-700">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 border-gray-600 hover:bg-gray-700">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-600 text-red-400 hover:bg-red-600/10">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Low Stock Warning */}
                    {status === 'low-stock' && (
                      <div className="mt-3 p-2 bg-yellow-600/10 border border-yellow-600/20 rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 text-xs">Low stock - consider restocking</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No products found</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Start by creating your first product'}
            </p>
            <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600">
              <Link href="/create-product">
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Product
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}