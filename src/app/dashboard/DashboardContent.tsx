'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'motion/react'
import { ShoppingCart, Search, Star, Plus, Heart, Eye, Trash2, X, MessageCircle, Users, Briefcase, Award, TrendingUp, DollarSign, Bell, Settings, LogOut, Palette, UserCheck } from 'lucide-react'
import { AdminRedirect } from '@/components/AdminRedirect'
import Alert from '../../components/ui/Alert'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

export default function DashboardContent() {
  const { data: session } = useSession()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [cart, setCart] = useState([])
  const [showProductForm, setShowProductForm] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [activeTab, setActiveTab] = useState('home')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        setAlert({ type: 'success', message: `${product.title} quantity updated in cart!` })
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      setAlert({ type: 'success', message: `${product.title} added to cart!` })
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth' })
  }

  const categories = ['all', 'electronics', 'fashion', 'home', 'books', 'sports']
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category?.toLowerCase() === selectedCategory
    return matchesSearch && matchesCategory
  })

  const renderDashboardContent = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Total Earnings</p>
              <p className="text-2xl font-bold text-white">KES 45,000</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Active Gigs</p>
              <p className="text-2xl font-bold text-white">12</p>
            </div>
            <Briefcase className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Completed Orders</p>
              <p className="text-2xl font-bold text-white">89</p>
            </div>
            <Award className="w-8 h-8 text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Profile Views</p>
              <p className="text-2xl font-bold text-white">1,234</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>
    </div>
  )

  const renderStoreContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
          />
        </div>
        
        <button className="relative p-2 bg-purple-600 hover:bg-purple-700 rounded-lg" onClick={() => setShowCart(true)}>
          <ShoppingCart className="w-5 h-5" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </button>
      </div>
      
      <div className="flex gap-2 overflow-x-auto">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading products...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-purple-500 transition-colors group"
            >
              <div className="h-48 bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center relative overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center">
                    <Eye className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button className="p-2 bg-black/50 hover:bg-black/70 rounded-full">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-white text-lg mb-2 line-clamp-2">
                  {product.title}
                </h3>
                
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-300">{product.rating?.toFixed(1) || '0.0'}</span>
                  </div>
                  <span className="text-gray-500 text-sm">({product.reviewCount || 0})</span>
                  <span className="text-gray-500 text-sm">• {product.stock || 0} left</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-400">
                    KES {product.price?.toLocaleString() || '0'}
                  </span>
                  
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboardContent()
      case 'home':
      default:
        return renderStoreContent()
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <AdminRedirect />
      
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800 z-40 overflow-y-auto">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-white">{session?.user?.name?.[0] || 'U'}</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">{session?.user?.name || 'User'}</h3>
              <p className="text-sm text-gray-400">{session?.user?.email}</p>
            </div>
          </div>
        </div>
        
        <nav className="p-4 space-y-2 flex-1">
          {[
            { id: 'home', label: 'Home', icon: ShoppingCart },
            { id: 'dashboard', label: 'Dashboard', icon: TrendingUp }
          ].map(item => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="flex-1">{item.label}</span>
              </button>
            )
          })}
        </nav>
        
        <div className="p-4 space-y-2 border-t border-gray-800">
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="ml-64">
        <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  TalentHub
                </span>
                <span className="ml-2">🇰🇪</span>
              </h1>
              
              {session?.user?.userType === 'ADMIN' && (
                <Link href="/admin" className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium">
                  Admin Panel
                </Link>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {renderContent()}
        </main>
        
        {alert && (
          <Alert 
            type={alert.type} 
            message={alert.message} 
            onClose={() => setAlert(null)} 
          />
        )}
      </div>
    </div>
  )
}