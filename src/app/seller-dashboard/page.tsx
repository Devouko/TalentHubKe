'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { 
  DollarSign, Package, Star, TrendingUp, Eye, MessageCircle, 
  Plus, Edit, BarChart3, Calendar, Clock, CheckCircle, ShoppingCart,
  Truck, Users, AlertCircle, Settings, Download, Upload
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function SellerDashboard() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState('overview')

  const stats = {
    totalEarnings: 145850,
    monthlyEarnings: 32400,
    activeProducts: 12,
    totalOrders: 256,
    pendingOrders: 8,
    avgRating: 4.8,
    totalReviews: 189,
    profileViews: 4340,
    conversionRate: 12.5,
    totalProducts: 15,
    lowStockProducts: 3
  }

  const earningsData = [
    { month: 'Jan', earnings: 18500, orders: 32, products: 8 },
    { month: 'Feb', earnings: 22200, orders: 45, products: 10 },
    { month: 'Mar', earnings: 28800, orders: 58, products: 12 },
    { month: 'Apr', earnings: 25500, orders: 44, products: 13 },
    { month: 'May', earnings: 35200, orders: 72, products: 14 },
    { month: 'Jun', earnings: 32400, orders: 69, products: 15 }
  ]

  const orderStatusData = [
    { name: 'Completed', value: 156, color: '#10b981' },
    { name: 'Processing', value: 8, color: '#eab308' },
    { name: 'Shipped', value: 12, color: '#8b5cf6' },
    { name: 'Pending', value: 5, color: '#f59e0b' },
    { name: 'Cancelled', value: 3, color: '#ef4444' }
  ]

  const productPerformance = [
    { product: 'Wireless Headphones', orders: 45, revenue: 112500, rating: 4.9 },
    { product: 'Smart Watch', orders: 32, revenue: 96000, rating: 4.8 },
    { product: 'Phone Case', orders: 68, revenue: 34000, rating: 4.7 },
    { product: 'Bluetooth Speaker', orders: 21, revenue: 52500, rating: 4.6 }
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
      views: 1250,
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
      views: 890,
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
      views: 2100,
      status: 'out-of-stock',
      image: '📱'
    }
  ]

  const lowStockAlerts = [
    { product: 'Smart Fitness Watch', stock: 8, threshold: 10 },
    { product: 'Bluetooth Speaker', stock: 5, threshold: 15 },
    { product: 'Phone Protection Case', stock: 0, threshold: 20 }
  ]

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to access seller dashboard</h1>
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-yellow-400 bg-clip-text text-transparent mb-2">>
                Seller Dashboard
              </h1>
              <p className="text-gray-400">Welcome back, {session.user?.name}! Manage your ecommerce store</p>
            </div>
            <div className="flex gap-3">
              <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Link href="/create-product">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Product
                </Link>
              </Button>
              <Button variant="outline" className="border-gray-600 hover:bg-gray-800">
                <Settings className="w-5 h-5 mr-2" />
                Store Settings
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: DollarSign, label: 'Total Revenue', value: `KES ${stats.totalEarnings.toLocaleString()}`, color: 'text-green-400', bg: 'bg-green-500/10', change: '+12.5%' },
            { icon: ShoppingCart, label: 'Total Orders', value: stats.totalOrders.toString(), color: 'text-yellow-400', bg: 'bg-yellow-500/10', change: '+8.2%' },
            { icon: Package, label: 'Active Products', value: stats.activeProducts.toString(), color: 'text-purple-400', bg: 'bg-purple-500/10', change: '+3' },
            { icon: Star, label: 'Average Rating', value: `${stats.avgRating}/5`, color: 'text-yellow-400', bg: 'bg-yellow-500/10', change: '+0.1' }
          ].map((stat, i) => (
            <Card key={i} className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${stat.bg}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="flex items-center gap-1 text-green-400 text-sm">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Revenue Analytics */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Revenue Analytics</CardTitle>
                <CardDescription>Monthly revenue and order trends</CardDescription>
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

            {/* Product Performance */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Top Performing Products</CardTitle>
                <CardDescription>Revenue and orders by product</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={productPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="product" stroke="#9CA3AF" angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="revenue" fill="#EAB308" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">Recent Orders</CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/seller-dashboard/orders">View All Orders</Link>
                  </Button>
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
                          <p className="text-gray-500 text-xs">Order ID: {order.id}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-green-400 font-bold">KES {order.amount.toLocaleString()}</div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            order.status === 'processing' ? 'bg-yellow-600/20 text-yellow-400' :
                            order.status === 'shipped' ? 'bg-purple-600/20 text-purple-400' :
                            order.status === 'delivered' ? 'bg-green-600/20 text-green-400' :
                            'bg-yellow-600/20 text-yellow-400'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {order.date}
                        </div>
                        <div>Qty: {order.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* My Products */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">My Products</CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/seller-dashboard/products">Manage All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myProducts.map(product => (
                    <div key={product.id} className="p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{product.image}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">{product.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                            <span>KES {product.price.toLocaleString()}</span>
                            <span>Stock: {product.stock}</span>
                            <span>{product.orders} orders</span>
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-400" />
                              {product.rating}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            product.status === 'active' ? 'bg-green-600/20 text-green-400' :
                            product.status === 'low-stock' ? 'bg-yellow-600/20 text-yellow-400' :
                            'bg-red-600/20 text-red-400'
                          }`}>
                            {product.status.replace('-', ' ')}
                          </span>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
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
                  <div className="flex justify-between">
                    <span className="text-gray-400">Conversion:</span>
                    <span className="text-green-400 font-semibold">{stats.conversionRate}%</span>
                  </div>
                </div>
                
                <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                  <Download className="w-4 h-4 mr-2" />
                  Withdraw to M-Pesa
                </Button>
              </CardContent>
            </Card>

            {/* Low Stock Alerts */}
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
                <Button variant="outline" className="w-full mt-3 border-red-500/30 text-red-400 hover:bg-red-600/10">
                  <Upload className="w-4 h-4 mr-2" />
                  Restock Products
                </Button>
              </CardContent>
            </Card>

            {/* Order Status Overview */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { icon: MessageCircle, label: 'Customer Messages', count: '5 new', href: '/messages' },
                    { icon: Truck, label: 'Shipping Labels', count: '8 pending', href: '/shipping' },
                    { icon: BarChart3, label: 'Analytics Report', count: 'View detailed', href: '/analytics' },
                    { icon: Users, label: 'Customer Reviews', count: `${stats.totalReviews} total`, href: '/reviews' }
                  ].map((action, i) => (
                    <Button
                      key={i}
                      variant="ghost"
                      className="w-full justify-between h-auto p-3 text-left hover:bg-gray-700/50"
                      asChild
                    >
                      <Link href={action.href}>
                        <div className="flex items-center gap-3">
                          <action.icon className="w-4 h-4" />
                          <span className="text-sm">{action.label}</span>
                        </div>
                        <span className="text-xs text-gray-400">{action.count}</span>
                      </Link>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}