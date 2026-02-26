'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, ShoppingCart as CartIcon } from 'lucide-react'
import AddToCartButton from '@/components/AddToCartButton'
import { useCart } from '../context/CartContext'

const categories = ['All', 'Accounts', 'Digital-products', 'Proxies', 'Bulk_Gmails', 'KYC']

interface Product {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  category: string
  rating: number
  reviewCount: number
  stock: number
}

export default function Products() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const { cart } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError('')
        
        const response = await fetch('/api/products')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (data.error) {
          setError(data.error)
          setProducts([])
        } else {
          setProducts(data.products || [])
        }
      } catch (err) {
        console.error('Error fetching products:', err)
        setError('Failed to load products')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery ? (
      product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ) : true
    
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 mb-4 text-6xl">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Failed to load products</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">TalentHub🇰🇪</h1>
          <p className="text-slate-600 dark:text-slate-400">Browse digital products and services</p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-purple-500 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Loading products...</p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-slate-200 dark:border-slate-700"
              >
                <Link href={`/products/${product.id}`}>
                  {product.images?.[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-48 object-cover rounded-lg mb-4 cursor-pointer"
                    />
                  )}
                  <h3 className="text-lg font-semibold mb-2 cursor-pointer hover:text-purple-500">{product.title}</h3>
                </Link>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-purple-500">
                    KSh {product.price?.toLocaleString()}
                  </span>
                  <div className="flex gap-2">
                    <AddToCartButton 
                      product={{
                        id: product.id,
                        title: product.title,
                        price: product.price,
                        images: product.images || []
                      }}
                      className="px-3 py-1 text-sm"
                      redirectToCheckout={false}
                    />
                    <Link
                      href={`/products/${product.id}`}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            console.log('Cart button clicked, navigating to checkout')
            router.push('/checkout')
          }}
          className="fixed bottom-6 right-6 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-all hover:scale-110 cursor-pointer"
          style={{ zIndex: 9999 }}
          aria-label="View Cart"
          type="button"
        >
          <div className="relative pointer-events-none">
            <CartIcon className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {cart.length}
            </span>
          </div>
        </button>
      )}
    </div>
  )
}