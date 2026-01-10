'use client'

import { useEffect, useState } from 'react'
import { Package, Search, Filter, Edit, Trash2, Plus, Eye, Star } from 'lucide-react'
import AdminSidebarLayout from '../AdminSidebarLayout'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('ALL')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data || [])
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (productId) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/products?id=${productId}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          fetchProducts()
        }
      } catch (error) {
        console.error('Failed to delete product:', error)
      }
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'ALL' || product.category?.toLowerCase() === filterCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  const categories = ['ALL', 'Accounts', 'Digital-products', 'Proxies', 'Bulk_Gmails', 'KYC']

  return (
    <AdminSidebarLayout>
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-purple-400" />
              <h1 className="text-3xl font-bold">Product Management</h1>
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'ALL' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-purple-500 transition-colors">
                  <div className="h-48 bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Eye className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white text-lg mb-2 line-clamp-2">{product.title}</h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-300">{product.rating?.toFixed(1) || '0.0'}</span>
                      <span className="text-gray-500 text-sm">• {product.category}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-green-400">
                        KES {product.price?.toLocaleString() || '0'}
                      </span>
                      <span className="text-sm text-gray-400">{product.stock || 0} in stock</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1">
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button 
                        onClick={() => deleteProduct(product.id)}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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