'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { 
  DollarSign, Package, Star, TrendingUp, Eye, MessageCircle, 
  Plus, Edit, BarChart3, Clock, ShoppingCart,
  Truck, Users, AlertCircle, Settings, Download, Upload, Bell, LogOut
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function SellerDashboard() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState('overview')
  const [createProductForm, setCreateProductForm] = useState({
    title: '',
    description: '',
    category: 'Accounts',
    price: '',
    stock: '',
    images: []
  })
  const [createProductLoading, setCreateProductLoading] = useState(false)

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth' })
  }

  const handleCreateProduct = async (e) => {
    e.preventDefault()
    setCreateProductLoading(true)
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...createProductForm,
          sellerId: session?.user?.id,
          price: parseFloat(createProductForm.price),
          stock: parseInt(createProductForm.stock)
        })
      })
      if (response.ok) {
        alert('Product created successfully!')
        setCreateProductForm({
          title: '',
          description: '',
          category: 'Accounts',
          price: '',
          stock: '',
          images: []
        })
        setActiveTab('products')
      } else {
        alert('Failed to create product.')
      }
    } catch (error) {
      alert('An error occurred.')
    } finally {
      setCreateProductLoading(false)
    }
  }

  const stats = {
    totalEarnings: 145850,
    monthlyEarnings: 32400,
    activeProducts: 12,
    totalOrders: 256,
    pendingOrders: 8,
    avgRating: 4.8,
    conversionRate: 12.5
  }

  const earningsData = [
    { month: 'Jan', earnings: 18500 },
    { month: 'Feb', earnings: 22200 },
    { month: 'Mar', earnings: 28800 },
    { month: 'Apr', earnings: 25500 },
    { month: 'May', earnings: 35200 },
    { month: 'Jun', earnings: 32400 }
  ]

  const orderStatusData = [
    { name: 'Completed', value: 156, color: '#10b981' },
    { name: 'Processing', value: 8, color: '#eab308' },
    { name: 'Shipped', value: 12, color: '#8b5cf6' },
    { name: 'Pending', value: 5, color: '#f59e0b' }
  ]

  const productPerformance = [
    { product: 'Headphones', orders: 45, revenue: 112500 },
    { product: 'Smart Watch', orders: 32, revenue: 96000 },
    { product: 'Phone Case', orders: 68, revenue: 34000 },
    { product: 'Speaker', orders: 21, revenue: 52500 }
  ]

  const recentOrders = [
    {
      id: 'ORD-001',
      product: 'Premium Wireless Headphones',
      customer: 'John Kamau',
      amount: 2500,
      status: 'processing',
      date: '2 hours ago',
      quantity: 1
    },
    {
      id: 'ORD-002', 
      product: 'Smart Fitness Watch',
      customer: 'Mary Wanjiku',
      amount: 15000,
      status: 'shipped',
      date: '5 hours ago',
      quantity: 1
    },
    {
      id: 'ORD-003',
      product: 'Phone Protection Case',
      customer: 'David Ochieng',
      amount: 850,
      status: 'delivered',
      date: '1 day ago',
      quantity: 2
    }
  ]

  const myProducts = [
    {
      id: '1',
      title: 'Premium Wireless Headphones',
      price: 2500,
      stock: 25,
      orders: 45,
      rating: 4.9,
      status: 'active',
      image: '🎧'
    },
    {
      id: '2',
      title: 'Smart Fitness Watch',
      price: 15000,
      stock: 8,
      orders: 23,
      rating: 4.8,
      status: 'low-stock',
      image: '⌚'
    },
    {
      id: '3',
      title: 'Phone Protection Case',
      price: 500,
      stock: 0,
      orders: 67,
      rating: 4.7,
      status: 'out-of-stock',
      image: '📱'
    }
  ]

  const lowStockAlerts = [
    { product: 'Smart Fitness Watch', stock: 8 },
    { product: 'Bluetooth Speaker', stock: 5 },
    { product: 'Phone Protection Case', stock: 0 }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview()
      case 'products':
        return renderMyProducts()
      case 'add-product':
        return renderAddProduct()
      case 'orders':
        return renderOrders()
      case 'analytics':
        return renderAnalytics()
      case 'messages':
        return renderMessages()
      default:
        return renderOverview()
    }
  }

  const renderAddProduct = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Add Product</h2>
      
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          <form onSubmit={handleCreateProduct} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Product Title</label>
                <input
                  type="text"
                  placeholder="Premium Gmail Accounts - Aged & Verified"
                  value={createProductForm.title}
                  onChange={(e) => setCreateProductForm({...createProductForm, title: e.target.value})}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  value={createProductForm.category}
                  onChange={(e) => setCreateProductForm({...createProductForm, category: e.target.value})}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="Accounts">Accounts</option>
                  <option value="Digital-products">Digital Products</option>
                  <option value="Proxies">Proxies</option>
                  <option value="Bulk_Gmails">Bulk Gmails</option>
                  <option value="KYC">KYC</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Price (KES)</label>
                <input
                  type="number"
                  placeholder="500"
                  value={createProductForm.price}
                  onChange={(e) => setCreateProductForm({...createProductForm, price: e.target.value})}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Stock Quantity</label>
                <input
                  type="number"
                  placeholder="100"
                  value={createProductForm.stock}
                  onChange={(e) => setCreateProductForm({...createProductForm, stock: e.target.value})}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                placeholder="Describe your product in detail..."
                value={createProductForm.description}
                onChange={(e) => setCreateProductForm({...createProductForm, description: e.target.value})}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white h-32 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Product Images</label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                />
                <p className="text-xs text-gray-400">Upload product images (multiple files supported)</p>
                <div className="text-sm text-gray-400">Or enter image URL:</div>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={createProductForm.images[0] || ''}
                  onChange={(e) => setCreateProductForm({...createProductForm, images: [e.target.value]})}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={createProductLoading}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {createProductLoading ? 'Creating...' : 'Create Product'}
                {!createProductLoading && <Plus className="w-4 h-4 ml-2" />}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveTab('products')}
                className="px-6"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )

  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Revenue Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="earnings" 
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white">Recent Orders</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setActiveTab('orders')}>View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map(order => (
                <div key={order.id} className="p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-white">{order.product}</h3>
                      <p className="text-gray-400 text-sm">Customer: {order.customer}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold">KES {order.amount.toLocaleString()}</div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        order.status === 'processing' ? 'bg-yellow-600/20 text-yellow-400' :
                        order.status === 'shipped' ? 'bg-purple-600/20 text-purple-400' :
                        'bg-green-600/20 text-green-400'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-green-600/10 to-yellow-600/10 border-green-500/20">
          <CardHeader>
            <CardTitle className="text-white">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Revenue:</span>
                <span className="text-green-400 font-bold">KES {stats.monthlyEarnings.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Orders:</span>
                <span className="font-semibold text-white">{stats.pendingOrders}</span>
              </div>
            </div>
            <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
              <Download className="w-4 h-4 mr-2" />
              Withdraw to M-Pesa
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-red-600/10 border-red-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockAlerts.map((alert, i) => (
                <div key={i} className="p-3 bg-red-600/10 rounded-lg border border-red-500/20">
                  <div className="text-sm font-medium text-white">{alert.product}</div>
                  <div className="text-xs text-red-400">
                    {alert.stock === 0 ? 'Out of stock' : `Only ${alert.stock} left`}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderMyProducts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Products</h2>
        <Button 
          onClick={() => setActiveTab('add-product')}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myProducts.map(product => (
          <Card key={product.id} className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">{product.image}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{product.title}</h3>
                  <p className="text-green-400 font-bold">KES {product.price.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Stock:</span>
                  <span className={product.stock > 10 ? 'text-green-400' : product.stock > 0 ? 'text-yellow-400' : 'text-red-400'}>
                    {product.stock}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Orders:</span>
                  <span className="text-white">{product.orders}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderOrders = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Orders</h2>
      
      <div className="grid grid-cols-1 gap-4">
        {recentOrders.map(order => (
          <Card key={order.id} className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-white text-lg">{order.product}</h3>
                  <p className="text-gray-400">Customer: {order.customer}</p>
                  <p className="text-gray-500 text-sm">Order ID: {order.id}</p>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-bold text-xl">KES {order.amount.toLocaleString()}</div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    order.status === 'processing' ? 'bg-yellow-600/20 text-yellow-400' :
                    order.status === 'shipped' ? 'bg-purple-600/20 text-purple-400' :
                    'bg-green-600/20 text-green-400'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {order.date}
                  </div>
                  <div>Qty: {order.quantity}</div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">Update Status</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analytics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Area type="monotone" dataKey="earnings" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Product Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="product" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Bar dataKey="revenue" fill="#EAB308" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderMessages = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Messages</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-300px)]">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Conversations</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-2 p-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="p-3 hover:bg-gray-700/50 rounded-lg cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">C{i}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white">Customer {i}</h4>
                      <p className="text-sm text-gray-400">Last message...</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card className="bg-gray-800/50 border-gray-700 h-full">
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center text-gray-400">
                <MessageCircle className="w-16 h-16 mx-auto mb-4" />
                <p>Choose a conversation to start messaging</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  if (!session) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to access seller dashboard</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800 z-40 overflow-y-auto">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-white">{session?.user?.name?.[0] || 'S'}</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">{session?.user?.name || 'Seller'}</h3>
              <p className="text-sm text-gray-400">{session?.user?.email}</p>
            </div>
          </div>
        </div>
        
        <nav className="p-4 space-y-2 flex-1">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'products', label: 'My Products', icon: Package },
            { id: 'add-product', label: 'Add Product', icon: Plus },
            { id: 'orders', label: 'Orders', icon: ShoppingCart },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'messages', label: 'Messages', icon: MessageCircle, badge: 5 }
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
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
        
        <div className="p-4 space-y-2 border-t border-gray-800">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
      
      <div className="ml-64">
        <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Seller Dashboard
                </span>
              </h1>
              
              <div className="flex items-center gap-4">
                <button className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
                </button>
                
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" onClick={() => setActiveTab('add-product')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Total Revenue</p>
                  <p className="text-2xl font-bold text-white">KES {stats.totalEarnings.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Orders</p>
                  <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-blue-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Active Products</p>
                  <p className="text-2xl font-bold text-white">{stats.activeProducts}</p>
                </div>
                <Package className="w-8 h-8 text-green-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Average Rating</p>
                  <p className="text-2xl font-bold text-white">{stats.avgRating}/5</p>
                </div>
                <Star className="w-8 h-8 text-orange-200" />
              </div>
            </div>
          </div>

          {renderContent()}
        </main>
      </div>
    </div>
  )
}