'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Store, TrendingUp, DollarSign, Package, Plus, Eye, Edit, Trash2, ShoppingCart, LogOut, User } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SellerDashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [gigs, setGigs] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalEarnings: 0,
    activeGigs: 0,
    activeProducts: 0,
    completedOrders: 0,
    avgRating: 0
  })

  useEffect(() => {
    fetchSellerData()
  }, [])

  const fetchSellerData = async () => {
    try {
      const [gigsResponse, productsResponse, ordersResponse] = await Promise.all([
        fetch(`/api/gigs?sellerId=${session?.user?.id}`),
        fetch(`/api/products?sellerId=${session?.user?.id}`),
        fetch(`/api/orders?sellerId=${session?.user?.id}`)
      ])

      const [gigsData, productsData, ordersData] = await Promise.all([
        gigsResponse.ok ? gigsResponse.json() : [],
        productsResponse.ok ? productsResponse.json() : { products: [] },
        ordersResponse.ok ? ordersResponse.json() : []
      ])

      setGigs(gigsData)
      setProducts(productsData.products || productsData || [])
      setOrders(ordersData)

      const totalEarnings = ordersData
        .filter(order => order.status === 'COMPLETED')
        .reduce((sum, order) => sum + order.totalAmount, 0)
      
      const completedOrders = ordersData.filter(order => order.status === 'COMPLETED').length
      const avgRating = gigsData.length > 0 
        ? gigsData.reduce((sum, gig) => sum + gig.rating, 0) / gigsData.length
        : 0

      setStats({
        totalEarnings,
        activeGigs: gigsData.length,
        activeProducts: Array.isArray(productsData.products) ? productsData.products.length : (Array.isArray(productsData) ? productsData.length : 0),
        completedOrders,
        avgRating: Number(avgRating.toFixed(1))
      })
    } catch (error) {
      console.error('Error fetching seller data:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteGig = async (gigId) => {
    if (confirm('Are you sure you want to delete this gig?')) {
      try {
        const response = await fetch(`/api/gigs/${gigId}`, { method: 'DELETE' })
        if (response.ok) {
          setGigs(prev => prev.filter(gig => gig.id !== gigId))
          setStats(prev => ({ ...prev, activeGigs: prev.activeGigs - 1 }))
        }
      } catch (error) {
        console.error('Error deleting gig:', error)
      }
    }
  }

  const deleteProduct = async (productId) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/products/${productId}`, { method: 'DELETE' })
        if (response.ok) {
          setProducts(prev => prev.filter(product => product.id !== productId))
          setStats(prev => ({ ...prev, activeProducts: prev.activeProducts - 1 }))
        }
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-slate-800/90 backdrop-blur-xl border-r border-slate-700/50 z-40 overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-lg font-bold text-white">{session?.user?.name?.[0] || 'S'}</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">{session?.user?.name || 'Seller'}</h3>
              <p className="text-sm text-slate-400">Seller Dashboard</p>
            </div>
          </div>
        </div>
        
        <nav className="p-6 space-y-3">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'gigs', label: 'My Gigs', icon: Package },
            { id: 'products', label: 'My Products', icon: ShoppingCart },
            { id: 'shop', label: 'Shop', icon: Store },
            { id: 'orders', label: 'Orders', icon: Store },
            { id: 'create', label: 'Create Gig', icon: Plus }
          ].map(item => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg transform scale-105'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white hover:transform hover:scale-105'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Sign Out Button */}
        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200 border border-slate-700/50 hover:border-red-500/50"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 min-h-screen">
        <div className="p-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Seller Overview</h1>
              <div className="text-sm text-slate-400">
                Welcome back, {session?.user?.name}!
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-6 rounded-2xl shadow-xl border border-emerald-400/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm font-medium">Total Earnings</p>
                    <p className="text-3xl font-bold text-white mt-1">KES {stats.totalEarnings.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl">
                    <DollarSign className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-6 rounded-2xl shadow-xl border border-blue-400/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Active Gigs</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats.activeGigs}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-2xl shadow-xl border border-purple-400/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Active Products</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats.activeProducts}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl">
                    <ShoppingCart className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-2xl shadow-xl border border-orange-400/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Completed Orders</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats.completedOrders}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Store className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
              <h3 className="text-2xl font-semibold mb-6 text-white">Recent Orders</h3>
              <div className="space-y-4">
                {Array.isArray(orders) && orders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-600/30 hover:bg-slate-700/50 transition-all duration-200">
                    <div>
                      <p className="font-medium text-white">{order.gig?.title || order.product?.title || 'Order'}</p>
                      <p className="text-sm text-slate-400">Order #{order.id.slice(0, 8)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-400 text-lg">KES {order.totalAmount?.toLocaleString()}</p>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        order.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        order.status === 'IN_PROGRESS' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 
                        'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
                {(!Array.isArray(orders) || orders.length === 0) && (
                  <div className="text-center py-8 text-slate-400">
                    <Store className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No orders yet. Start promoting your gigs!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gigs' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">My Gigs</h1>
              <button
                onClick={() => router.push('/create-gig')}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 px-6 py-3 rounded-xl flex items-center gap-2 font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Create New Gig
              </button>
            </div>

            {gigs.length === 0 ? (
              <div className="text-center py-16 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                <Package className="w-20 h-20 text-slate-400 mx-auto mb-6 opacity-50" />
                <h3 className="text-2xl font-semibold text-slate-300 mb-3">No Gigs Yet</h3>
                <p className="text-slate-400 mb-6 max-w-md mx-auto">Create your first gig to start earning and showcase your skills to potential clients</p>
                <button
                  onClick={() => router.push('/create-gig')}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 px-8 py-4 rounded-xl flex items-center gap-2 mx-auto font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Gig
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gigs.map(gig => (
                  <div key={gig.id} className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105">
                    <div className="h-48 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center relative overflow-hidden">
                      {gig.images?.[0] ? (
                        <img src={gig.images[0]} alt={gig.title} className="w-full h-full object-cover" />
                      ) : (
                        <Eye className="w-16 h-16 text-slate-400 opacity-50" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-white text-xl mb-3 line-clamp-1">{gig.title}</h3>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">{gig.description}</p>
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-2xl font-bold text-emerald-400">KES {gig.price?.toLocaleString()}</span>
                        <span className="text-sm text-slate-400 bg-slate-700/50 px-3 py-1 rounded-full">{gig.orderCount || 0} orders</span>
                      </div>
                      <div className="flex gap-3">
                        <button className="flex-1 px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 hover:border-blue-500/50 rounded-xl text-blue-400 font-medium transition-all duration-200 flex items-center justify-center gap-2">
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button 
                          onClick={() => deleteGig(gig.id)}
                          className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 rounded-xl text-red-400 font-medium transition-all duration-200"
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
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">My Products</h1>
              <button 
                onClick={() => router.push('/create-product')}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>
            
            {products.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No Products Yet</h3>
                <p className="text-gray-400 mb-4">Start selling digital products to your customers</p>
                <button
                  onClick={() => router.push('/create-product')}
                  className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Product
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <div key={product.id} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                    <div className="h-48 bg-gradient-to-br from-green-600/20 to-blue-600/20 flex items-center justify-center">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingCart className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-white text-lg mb-2">{product.title}</h3>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xl font-bold text-green-400">KES {product.price?.toLocaleString()}</span>
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
        )}

        {activeTab === 'shop' && (
          <div className="space-y-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">My Shop</h1>
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 text-center">
              <Store className="w-20 h-20 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-3">Your Online Store</h3>
              <p className="text-slate-400 mb-6 max-w-2xl mx-auto">Manage your products, view analytics, and customize your storefront. Your shop is your digital marketplace presence.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <div className="bg-slate-700/30 p-4 rounded-xl">
                  <p className="text-3xl font-bold text-emerald-400 mb-1">{stats.activeProducts}</p>
                  <p className="text-sm text-slate-400">Active Products</p>
                </div>
                <div className="bg-slate-700/30 p-4 rounded-xl">
                  <p className="text-3xl font-bold text-emerald-400 mb-1">{stats.completedOrders}</p>
                  <p className="text-sm text-slate-400">Total Sales</p>
                </div>
                <div className="bg-slate-700/30 p-4 rounded-xl">
                  <p className="text-3xl font-bold text-emerald-400 mb-1">KES {stats.totalEarnings.toLocaleString()}</p>
                  <p className="text-sm text-slate-400">Revenue</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('products')}
                className="mt-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg"
              >
                Manage Products
              </button>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Orders</h1>
            
            {!Array.isArray(orders) || orders.length === 0 ? (
              <div className="text-center py-16 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                <Store className="w-20 h-20 text-slate-400 mx-auto mb-6 opacity-50" />
                <h3 className="text-2xl font-semibold text-slate-300 mb-3">No Orders Yet</h3>
                <p className="text-slate-400 max-w-md mx-auto">Orders will appear here when customers purchase your gigs or products. Start promoting your services!</p>
              </div>
            ) : (
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-700/50 shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-700/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 uppercase tracking-wider">Order</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 uppercase tracking-wider">Buyer</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {orders.map(order => (
                        <tr key={order.id} className="hover:bg-slate-700/30 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-semibold text-white">{order.gig?.title || order.product?.title || 'Order'}</div>
                              <div className="text-sm text-slate-400">#{order.id.slice(0, 8)}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300 font-medium">{order.buyer?.name || 'Unknown'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-emerald-400">
                            KES {order.totalAmount?.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                              order.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                              order.status === 'IN_PROGRESS' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                              'bg-slate-500/20 text-slate-400 border-slate-500/30'
                            }`}>
                              {order.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'create' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Create New Gig</h1>
            <div className="bg-gray-800 rounded-xl p-6 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">Gig Creation</h3>
              <p className="text-gray-400 mb-4">Use the dedicated gig creation page for the full experience</p>
              <button
                onClick={() => router.push('/create-gig')}
                className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                Go to Gig Creator
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}