'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { ShoppingCart, Plus, Minus, Star, User, CreditCard, Smartphone } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  image: string
  seller: {
    id: string
    name: string
    rating: number
    reviews: number
  }
  category: string
  stock: number
}

interface CartItem extends Product {
  quantity: number
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Kenyan Coffee Beans - Premium',
    price: 850,
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=300',
    seller: { id: 's1', name: 'Nairobi Coffee Co.', rating: 4.8, reviews: 124 },
    category: 'Food & Beverages',
    stock: 50
  },
  {
    id: '2', 
    name: 'Maasai Beaded Jewelry',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300',
    seller: { id: 's2', name: 'Maasai Crafts', rating: 4.9, reviews: 89 },
    category: 'Crafts',
    stock: 25
  },
  {
    id: '3',
    name: 'Kikoy Beach Towel',
    price: 650,
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=300',
    seller: { id: 's3', name: 'Coastal Textiles', rating: 4.7, reviews: 156 },
    category: 'Textiles',
    stock: 30
  },
  {
    id: '4',
    name: 'Safaricom Data Bundle',
    price: 500,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300',
    seller: { id: 's4', name: 'Digital Services', rating: 4.6, reviews: 203 },
    category: 'Digital',
    stock: 100
  }
]

export default function POS() {
  const [products] = useState<Product[]>(mockProducts)
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showCheckout, setShowCheckout] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('mpesa')

  const categories = ['All', 'Food & Beverages', 'Crafts', 'Textiles', 'Digital']

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory)

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id 
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (id: string, change: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, Math.min(item.quantity + change, item.stock))
        return newQuantity === 0 ? null : { ...item, quantity: newQuantity }
      }
      return item
    }).filter(Boolean) as CartItem[])
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleCheckout = () => {
    alert(`Payment of KES ${total.toLocaleString()} via ${paymentMethod.toUpperCase()} processed successfully!`)
    setCart([])
    setShowCheckout(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-yellow-400 bg-clip-text text-transparent mb-2">
            Kenya Marketplace POS
          </h1>
          <p className="text-gray-400">Local products, digital services & more</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Products Section */}
          <div className="lg:col-span-3">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map(cat => (
                <motion.button
                  key={cat}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === cat
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {cat}
                </motion.button>
              ))}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  
                  <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">{product.seller.name}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{product.seller.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-green-400">
                        KES {product.price.toLocaleString()}
                      </span>
                      <div className="text-xs text-gray-400">Stock: {product.stock}</div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                      className="p-2 bg-green-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Cart Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="w-5 h-5" />
                <h2 className="text-xl font-bold">Cart ({itemCount})</h2>
              </div>

              {cart.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Cart is empty</p>
              ) : (
                <>
                  <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-700 rounded-lg">
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">{item.name}</h4>
                          <p className="text-xs text-gray-400">KES {item.price.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 bg-red-600 rounded text-xs"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 bg-green-600 rounded text-xs"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-600 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold">Total:</span>
                      <span className="text-xl font-bold text-green-400">
                        KES {total.toLocaleString()}
                      </span>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowCheckout(true)}
                      className="w-full py-3 bg-gradient-to-r from-green-600 to-yellow-600 rounded-lg font-semibold flex items-center justify-center gap-2"
                    >
                      <Smartphone className="w-4 h-4" />
                      Pay with M-Pesa
                    </motion.button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Checkout Modal */}
        {showCheckout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-800 rounded-xl p-6 max-w-md w-full"
            >
              <h2 className="text-2xl font-bold mb-4">Checkout</h2>
              
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Order Summary</h3>
                <div className="space-y-1 text-sm">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.name} x{item.quantity}</span>
                      <span>KES {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-600 mt-2 pt-2 flex justify-between font-bold">
                  <span>Total:</span>
                  <span className="text-green-400">KES {total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-2">Payment Method</h3>
                <div className="space-y-2">
                  {[
                    { id: 'mpesa', name: 'M-Pesa', icon: Smartphone },
                    { id: 'card', name: 'Card Payment', icon: CreditCard }
                  ].map(method => (
                    <label key={method.id} className="flex items-center gap-3 p-2 bg-gray-700 rounded-lg cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-green-600"
                      />
                      <method.icon className="w-5 h-5" />
                      <span>{method.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCheckout(false)}
                  className="flex-1 py-2 bg-gray-600 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex-1 py-2 bg-green-600 rounded-lg font-semibold"
                >
                  Pay Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}