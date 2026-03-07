'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TrendingUp, DollarSign, ShoppingBag, Users, Package, ArrowUpRight, Clock, Plus, Store } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

interface Stats {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  revenueChange: number
  ordersChange: number
}

interface RecentOrder {
  id: string
  customerName: string
  amount: number
  status: string
  createdAt: string
}

interface Product {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  category: string
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState<Stats>({ totalRevenue: 0, totalOrders: 0, totalProducts: 0, revenueChange: 0, ordersChange: 0 })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders')
      ])
      
      if (!productsRes.ok || !ordersRes.ok) {
        throw new Error('Failed to fetch data')
      }
      
      const productsData = await productsRes.json()
      const ordersData = await ordersRes.json()
      
      const orders = Array.isArray(ordersData) ? ordersData : (ordersData.orders || [])
      const products = Array.isArray(productsData) ? productsData : (productsData.products || [])
      
      const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0)
      
      setStats({
        totalRevenue,
        totalOrders: orders.length,
        totalProducts: products.length,
        revenueChange: 0,
        ordersChange: 0
      })
      
      setRecentOrders(orders.slice(0, 5).map((o: any) => ({
        id: o.id,
        customerName: o.customerName || 'Customer',
        amount: o.totalAmount || 0,
        status: (o.status || 'pending').toLowerCase(),
        createdAt: o.createdAt
      })))
      
      setAllProducts(products)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      setStats({ totalRevenue: 0, totalOrders: 0, totalProducts: 0, revenueChange: 0, ordersChange: 0 })
      setRecentOrders([])
      setAllProducts([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-100 border-t-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none italic">
            Talanta<span className="text-blue-600">Hub</span> <span className="text-orange-500">Dashboard</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium">
            Welcome back, <span className="text-slate-900 dark:text-white font-bold">{session?.user?.name || 'User'}</span>. Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {['Overview', 'Shop', 'Orders'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${
                activeTab === tab.toLowerCase()
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: `KES ${stats.totalRevenue.toLocaleString()}`, change: 0, icon: DollarSign, color: 'emerald' },
          { label: 'Total Orders', value: stats.totalOrders, change: 0, icon: ShoppingBag, color: 'blue' },
          { label: 'Total Products', value: stats.totalProducts, change: 0, icon: Package, color: 'purple' },
        ].map((item, i) => (
          <div key={item.label} className="group p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-black/50 transition-all duration-500">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <item.icon className="w-6 h-6" />
              </div>
              {item.change !== 0 && (
                <div className={`flex items-center gap-1 text-xs font-black tracking-tight ${item.change > 0 ? 'text-blue-600' : 'text-red-500'}`}>
                  <TrendingUp className="w-3 h-3" />
                  <span>{item.change > 0 ? '+' : ''}{item.change}%</span>
                </div>
              )}
            </div>
            <h3 className="text-slate-400 dark:text-slate-500 text-xs font-black uppercase tracking-widest">{item.label}</h3>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-2 tracking-tight">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Recent Hub Activity</h2>
            <Link href="/orders" className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-orange-400 hover:text-blue-700 transition-colors">
              View All
            </Link>
          </div>
          <div className="p-8">
            {recentOrders.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-slate-400 font-medium italic">No activity detected in the hub.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl group hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all duration-300">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <ShoppingBag className="w-6 h-6 text-orange-500" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 dark:text-white tracking-tight">{order.customerName}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                          {new Date(order.createdAt).toLocaleDateString()} • #{order.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-slate-900 dark:text-white italic text-lg">KES {order.amount.toLocaleString()}</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mt-2 ${
                        order.status === 'completed' ? 'bg-emerald-500 text-white' :
                        order.status === 'pending' ? 'bg-orange-500 text-white' :
                        'bg-slate-200 text-slate-600'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Quick Actions</h2>
            </div>
            <div className="p-8 space-y-4">
              {[
                { title: 'View Opportunities', icon: Package, href: '/products', color: 'bg-blue-50 text-blue-600' },
                { title: 'Manage Hub Orders', icon: ShoppingBag, href: '/orders', color: 'bg-orange-50 text-orange-600' },
                { title: 'Create Service', icon: Plus, href: '/create-product', color: 'bg-blue-50 text-blue-600' },
              ].map((action) => (
                <Link key={action.title} href={action.href} className="group flex items-center gap-4 p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all duration-300 shadow-sm hover:shadow-xl">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${action.color}`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">{action.title}</span>
                  <ArrowUpRight className="w-4 h-4 ml-auto text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
        </>
      )}

      {activeTab === 'shop' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Shop - Browse Products</h2>
          {allProducts.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
              <Store className="w-20 h-20 text-slate-400 mx-auto mb-6 opacity-50" />
              <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-3">No Products Available</h3>
              <p className="text-slate-500">Check back later for new products</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allProducts.map((product) => (
                <div key={product.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all">
                  <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative">
                    {product.images?.[0] ? (
                      <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-slate-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg line-clamp-1">{product.title}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold">{product.category}</span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-blue-600">KES {product.price.toLocaleString()}</span>
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4" />
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">All Orders</h2>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentOrders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{order.customerName}</p>
                        <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()} • #{order.id.slice(0, 8)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900 dark:text-white">KES {order.amount.toLocaleString()}</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 ${
                        order.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                        order.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
