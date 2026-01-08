'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { useSession } from 'next-auth/react'
import { 
  ShoppingCart, Package, Truck, CheckCircle, Clock, 
  AlertCircle, Search, Filter, Eye, MessageCircle, 
  Download, RefreshCw, DollarSign, Calendar
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'

export default function OrdersManagement() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Mock orders data for demonstration
  const mockOrders = [
    {
      id: 'ORD-001',
      product: 'Premium Wireless Headphones',
      customer: 'John Kamau',
      customerEmail: 'john.kamau@email.com',
      amount: 2500,
      status: 'pending',
      date: '2024-01-15T10:30:00Z',
      quantity: 1,
      shippingAddress: 'Nairobi, Kenya',
      paymentMethod: 'M-Pesa'
    },
    {
      id: 'ORD-002',
      product: 'Smart Fitness Watch',
      customer: 'Mary Wanjiku',
      customerEmail: 'mary.w@email.com',
      amount: 15000,
      status: 'processing',
      date: '2024-01-14T15:45:00Z',
      quantity: 1,
      shippingAddress: 'Mombasa, Kenya',
      paymentMethod: 'Card'
    },
    {
      id: 'ORD-003',
      product: 'Phone Protection Case',
      customer: 'David Ochieng',
      customerEmail: 'david.o@email.com',
      amount: 1700,
      status: 'shipped',
      date: '2024-01-13T09:20:00Z',
      quantity: 2,
      shippingAddress: 'Kisumu, Kenya',
      paymentMethod: 'M-Pesa'
    },
    {
      id: 'ORD-004',
      product: 'Bluetooth Speaker',
      customer: 'Sarah Muthoni',
      customerEmail: 'sarah.m@email.com',
      amount: 3500,
      status: 'delivered',
      date: '2024-01-12T14:10:00Z',
      quantity: 1,
      shippingAddress: 'Nakuru, Kenya',
      paymentMethod: 'M-Pesa'
    },
    {
      id: 'ORD-005',
      product: 'Gaming Mouse',
      customer: 'Peter Kiprotich',
      customerEmail: 'peter.k@email.com',
      amount: 1200,
      status: 'cancelled',
      date: '2024-01-11T11:30:00Z',
      quantity: 1,
      shippingAddress: 'Eldoret, Kenya',
      paymentMethod: 'Card'
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrders(mockOrders)
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-600/20 text-yellow-400'
      case 'processing': return 'bg-yellow-600/20 text-yellow-400'
      case 'shipped': return 'bg-purple-600/20 text-purple-400'
      case 'delivered': return 'bg-green-600/20 text-green-400'
      case 'cancelled': return 'bg-red-600/20 text-red-400'
      default: return 'bg-gray-600/20 text-gray-400'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return Clock
      case 'processing': return Package
      case 'shipped': return Truck
      case 'delivered': return CheckCircle
      case 'cancelled': return AlertCircle
      default: return Clock
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    totalRevenue: orders.reduce((sum, o) => sum + o.amount, 0)
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to manage orders</h1>
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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-yellow-400 bg-clip-text text-transparent mb-2">>
                Order Management
              </h1>
              <p className="text-gray-400">Track and manage your customer orders</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-gray-600 hover:bg-gray-800">
                <Download className="w-5 h-5 mr-2" />
                Export Orders
              </Button>
              <Button variant="outline" className="border-gray-600 hover:bg-gray-800">
                <RefreshCw className="w-5 h-5 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            {[
              { 
                label: 'Total Orders', 
                value: orderStats.total, 
                icon: ShoppingCart, 
                color: 'text-yellow-400',
                bg: 'bg-yellow-500/10'
              },
              { 
                label: 'Pending', 
                value: orderStats.pending, 
                icon: Clock, 
                color: 'text-yellow-400',
                bg: 'bg-yellow-500/10'
              },
              { 
                label: 'Processing', 
                value: orderStats.processing, 
                icon: Package, 
                color: 'text-yellow-400',
                bg: 'bg-yellow-500/10'
              },
              { 
                label: 'Shipped', 
                value: orderStats.shipped, 
                icon: Truck, 
                color: 'text-purple-400',
                bg: 'bg-purple-500/10'
              },
              { 
                label: 'Total Revenue', 
                value: `KES ${orderStats.totalRevenue.toLocaleString()}`, 
                icon: DollarSign, 
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
                placeholder="Search orders, products, or customers..."
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
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </motion.div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading orders...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => {
              const StatusIcon = getStatusIcon(order.status)
              
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${getStatusColor(order.status).replace('text-', 'bg-').replace('400', '500/10')}`}>
                        <StatusIcon className={`w-5 h-5 ${getStatusColor(order.status).split(' ')[1]}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-lg">{order.id}</h3>
                        <p className="text-gray-400 text-sm">
                          {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <span className="text-2xl font-bold text-green-400">
                        KES {order.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Product Info */}
                    <div>
                      <h4 className="font-medium text-gray-300 mb-2">Product</h4>
                      <p className="text-white font-semibold">{order.product}</p>
                      <p className="text-gray-400 text-sm">Quantity: {order.quantity}</p>
                    </div>

                    {/* Customer Info */}
                    <div>
                      <h4 className="font-medium text-gray-300 mb-2">Customer</h4>
                      <p className="text-white font-semibold">{order.customer}</p>
                      <p className="text-gray-400 text-sm">{order.customerEmail}</p>
                      <p className="text-gray-400 text-sm">{order.shippingAddress}</p>
                    </div>

                    {/* Payment Info */}
                    <div>
                      <h4 className="font-medium text-gray-300 mb-2">Payment</h4>
                      <p className="text-white font-semibold">{order.paymentMethod}</p>
                      <p className="text-gray-400 text-sm">
                        {order.status === 'delivered' ? 'Paid' : 
                         order.status === 'cancelled' ? 'Refunded' : 'Pending'}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6 pt-4 border-t border-gray-700">
                    <Button variant="outline" size="sm" className="border-gray-600 hover:bg-gray-700">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-600 hover:bg-gray-700">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact Customer
                    </Button>
                    {order.status === 'pending' && (
                      <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                        <Package className="w-4 h-4 mr-2" />
                        Mark as Processing
                      </Button>
                    )}
                    {order.status === 'processing' && (
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        <Truck className="w-4 h-4 mr-2" />
                        Mark as Shipped
                      </Button>
                    )}
                    {order.status === 'shipped' && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Delivered
                      </Button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {filteredOrders.length === 0 && !loading && (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No orders found</h3>
            <p className="text-gray-400">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Orders will appear here when customers make purchases'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}