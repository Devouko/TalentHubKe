'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Trash2, ShoppingCart, Plus, Minus } from 'lucide-react'

export default function CartPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [cart, setCart] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) fetchCart()
  }, [session])

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart')
      if (res.ok) {
        const data = await res.json()
        console.log('Cart data:', data)
        setCart(data.cart || [])
      } else {
        console.error('Failed to fetch cart:', res.status)
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity })
      })
      fetchCart()
    } catch (error) {
      console.error('Error updating cart:', error)
    }
  }

  const removeItem = async (productId: string) => {
    try {
      await fetch(`/api/cart?productId=${productId}`, { method: 'DELETE' })
      fetchCart()
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  const clearCart = async () => {
    try {
      await fetch('/api/cart/clear', { method: 'POST' })
      fetchCart()
    } catch (error) {
      console.error('Error clearing cart:', error)
    }
  }

  const total = cart.reduce((sum, item) => sum + (item.products?.price || 0) * item.quantity, 0)

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="mb-4">Please sign in to view your cart</p>
        <button onClick={() => router.push('/auth/signin')} className="btn-primary">
          Sign In
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Shopping Cart</h1>
        {cart.length > 0 && (
          <button onClick={clearCart} className="text-sm text-red-600 hover:text-red-700">
            Clear Cart
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="card p-12 text-center">
          <ShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-base font-semibold mb-1">Your cart is empty</h3>
          <p className="text-sm text-gray-600 mb-4">Add items to get started</p>
          <button onClick={() => router.push('/products')} className="btn-primary">
            Browse Products
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {cart.map((item) => {
              const product = item.products
              if (!product) {
                console.warn('Product not found for cart item:', item)
                return null
              }
              return (
                <div key={item.id} className="card p-4">
                  <div className="flex gap-4">
                    {product.images?.[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold">{product.title}</h3>
                      <p className="text-sm text-gray-600">
                        KES {product.price?.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        KES {((product.price || 0) * item.quantity).toLocaleString()}
                      </p>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-red-600 hover:text-red-700 mt-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="card p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-semibold text-emerald-600">
                KES {total.toLocaleString()}
              </span>
            </div>
            <button
              onClick={() => router.push('/checkout')}
              className="w-full btn-primary"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  )
}
