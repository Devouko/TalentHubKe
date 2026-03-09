'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { ShoppingCart, Package, Plus, Edit, Trash2, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layouts/DashboardLayout'

export default function SellerDashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [checkoutProduct, setCheckoutProduct] = useState<any>(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [showCreateProduct, setShowCreateProduct] = useState(false)
  const [showOrders, setShowOrders] = useState(false)
  const [processingPayment, setProcessingPayment] = useState(false)

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      const data = await response.json()
      setOrders(Array.isArray(data) ? data : (data.orders || []))
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrders([])
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBuyNow = (product: any) => {
    setCheckoutProduct(product)
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!checkoutProduct || !phoneNumber || processingPayment) return

    setProcessingPayment(true)
    try {
      const cleanPhone = phoneNumber.replace(/\s/g, '')
      
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ 
            id: checkoutProduct.id, 
            title: checkoutProduct.title, 
            price: checkoutProduct.price, 
            quantity: 1 
          }],
          total: checkoutProduct.price,
          phoneNumber: cleanPhone,
          shippingAddress: 'Digital delivery'
        })
      })

      const orderData = await orderResponse.json()
      if (!orderResponse.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to create order')
      }

      const mpesaResponse = await fetch('/api/mpesa/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone,
          amount: Math.round(checkoutProduct.price),
          orderId: orderData.order.id,
          description: `Order for ${checkoutProduct.title}`
        })
      })

      const mpesaData = await mpesaResponse.json()
      if (mpesaResponse.ok && mpesaData.success) {
        alert('Payment request sent! Check your phone for M-Pesa prompt.')
        setCheckoutProduct(null)
        setPhoneNumber('')
      } else {
        throw new Error(mpesaData.error || 'Payment failed')
      }
    } catch (error: any) {
      alert(error.message || 'Checkout failed')
    } finally {
      setProcessingPayment(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-100 border-t-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (checkoutProduct) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <button 
            onClick={() => setCheckoutProduct(null)} 
            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </button>
          
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-lg">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Complete Your Purchase</h2>
            
            <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-start gap-4">
                {checkoutProduct.images?.[0] && (
                  <img 
                    src={checkoutProduct.images[0]} 
                    alt={checkoutProduct.title} 
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{checkoutProduct.title}</h3>
                  <p className="text-slate-500 mb-4">{checkoutProduct.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-blue-600">KES {checkoutProduct.price.toLocaleString()}</span>
                    <span className="text-sm px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full font-semibold">
                      {checkoutProduct.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleCheckout} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  M-Pesa Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="254712345678"
                  className="w-full px-4 py-4 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  required
                />
                <p className="text-sm text-slate-500 mt-2">Enter your M-Pesa registered phone number</p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Order Summary</h4>
                <div className="flex justify-between items-center text-blue-800 dark:text-blue-200">
                  <span>Product Price:</span>
                  <span className="font-bold">KES {checkoutProduct.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-blue-800 dark:text-blue-200 mt-1">
                  <span>Processing Fee:</span>
                  <span className="font-bold">KES 0</span>
                </div>
                <hr className="my-2 border-blue-200 dark:border-blue-700" />
                <div className="flex justify-between items-center text-blue-900 dark:text-blue-100 font-bold text-lg">
                  <span>Total:</span>
                  <span>KES {checkoutProduct.price.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={processingPayment || !phoneNumber}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 px-6 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-500/20"
              >
                {processingPayment ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Processing Payment...
                  </div>
                ) : (
                  `Pay KES ${checkoutProduct.price.toLocaleString()}`
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
              <p>🔒 Secure payment powered by M-Pesa</p>
              <p>You will receive an M-Pesa prompt on your phone to complete the payment</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">TalentaHub Marketplace</h1>
            <p className="text-slate-500 dark:text-slate-400">Discover and purchase digital products from talented creators</p>
          </div>
          <button
            onClick={() => router.push('/create-product')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <Package className="w-20 h-20 text-slate-400 mx-auto mb-6 opacity-50" />
            <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-3">No Products Available</h3>
            <p className="text-slate-500 mb-8">Be the first to add a product to the marketplace!</p>
            <button
              onClick={() => router.push('/create-product')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl flex items-center gap-2 mx-auto font-semibold transition-all"
            >
              <Plus className="w-5 h-5" />
              Add First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <div key={product.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
                <div className="h-48 bg-slate-100 dark:bg-slate-900 flex items-center justify-center relative overflow-hidden">
                  {product.images?.[0] ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  ) : (
                    <Package className="w-12 h-12 text-slate-400" />
                  )}
                  <div className="absolute top-3 right-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 font-semibold backdrop-blur-sm">
                      {product.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2 line-clamp-1">{product.title}</h3>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                      KES {product.price?.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-full">
                      {product.stock || 0} available
                    </span>
                  </div>

                  <button 
                    onClick={() => handleBuyNow(product)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={() => { fetchOrders(); setShowOrders(true); }}
            className="px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold transition-all"
          >
            View Orders
          </button>
        </div>
      </div>

      {showCreateProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Create Product</h3>
            <p className="text-slate-500 mb-6">Product creation form would go here</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateProduct(false)}
                className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl">
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {showOrders && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">My Orders</h3>
              <button
                onClick={() => setShowOrders(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            {orders.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No orders found</p>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">KES {order.totalAmount?.toLocaleString()}</p>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">{order.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
