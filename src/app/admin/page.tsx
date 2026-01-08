'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { BarChart3, Users, ShoppingCart, DollarSign, TrendingUp, Filter, Calendar, Settings, Palette, MessageSquare, X, Send, MessageCircle, Package, LogOut, Briefcase, PlusCircle, Store, FileText, Star, Eye } from 'lucide-react'
import Link from 'next/link'
import Alert from '../../components/ui/Alert'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [timeFilter, setTimeFilter] = useState('This month')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [messages, setMessages] = useState([{ id: '1', text: 'Welcome!', userName: 'System', userId: 'system' }])
  const [newMessage, setNewMessage] = useState('')
  const [chatOpen, setChatOpen] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  const handleColorChange = (color: string) => {
    document.documentElement.style.setProperty('--primary-color', color)
    localStorage.setItem('admin-theme-color', color)
    setAlert({ type: 'success', message: 'Theme color updated successfully!' })
  }

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false })
      setAlert({ type: 'success', message: 'Signed out successfully!' })
      setTimeout(() => router.push('/'), 1500)
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to sign out. Please try again.' })
    }
  }

  const sendMessage = () => {
    if (newMessage.trim() && session?.user) {
      const message = {
        id: Date.now().toString(),
        text: newMessage,
        userId: session.user.id,
        userName: session.user.name || 'User'
      }
      setMessages(prev => [...prev, message])
      setNewMessage('')
      setAlert({ type: 'success', message: 'Message sent successfully!' })
    }
  }

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth')
      return
    }
    if (session.user?.userType !== 'ADMIN') {
      router.push('/dashboard')
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session || session.user?.userType !== 'ADMIN') {
    return null
  }

  return (
    <>
      {/* Admin Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-gray-900 border-r border-gray-700 transition-all z-50 overflow-y-auto ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`font-bold text-white ${sidebarOpen ? 'block' : 'hidden'}`}>Admin Panel</h2>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
            </button>
          </div>
          <nav className="space-y-2">
            <Link href="/admin" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
              <BarChart3 className="w-5 h-5" />
              {sidebarOpen && <span>Dashboard</span>}
            </Link>
            <Link href="/admin/users" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
              <Users className="w-5 h-5" />
              {sidebarOpen && <span>Users</span>}
            </Link>
            <Link href="/gigs" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
              <Briefcase className="w-5 h-5" />
              {sidebarOpen && <span>All Gigs</span>}
            </Link>
            <Link href="/create-gig" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
              <PlusCircle className="w-5 h-5" />
              {sidebarOpen && <span>Create Gig</span>}
            </Link>
            <Link href="/opportunities" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
              <Eye className="w-5 h-5" />
              {sidebarOpen && <span>Opportunities</span>}
            </Link>
            <Link href="/jobs" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
              <FileText className="w-5 h-5" />
              {sidebarOpen && <span>Jobs</span>}
            </Link>
            <Link href="/seller-dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
              <Store className="w-5 h-5" />
              {sidebarOpen && <span>Seller Dashboard</span>}
            </Link>
            <Link href="/reviews" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
              <Star className="w-5 h-5" />
              {sidebarOpen && <span>Reviews</span>}
            </Link>
            <Link href="/messages" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
              <MessageSquare className="w-5 h-5" />
              {sidebarOpen && <span>Messages</span>}
            </Link>
            <Link href="/admin/products" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
              <Package className="w-5 h-5" />
              {sidebarOpen && <span>Products</span>}
            </Link>
            <Link href="/admin/escrow" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
              <DollarSign className="w-5 h-5" />
              {sidebarOpen && <span>Escrow</span>}
            </Link>
            <Link href="/admin/theme" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
              <Palette className="w-5 h-5" />
              {sidebarOpen && <span>Theme</span>}
            </Link>
            <Link href="/admin/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
              <Settings className="w-5 h-5" />
              {sidebarOpen && <span>Settings</span>}
            </Link>
            <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
              <ShoppingCart className="w-5 h-5" />
              {sidebarOpen && <span>View Site</span>}
            </Link>
            <button onClick={() => setShowColorPicker(!showColorPicker)} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
              <Palette className="w-5 h-5" />
              {sidebarOpen && <span>Theme Colors</span>}
            </button>
            <button onClick={handleSignOut} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-800 text-gray-300 hover:text-white">
              <LogOut className="w-5 h-5" />
              {sidebarOpen && <span>Sign Out</span>}
            </button>
          </nav>
          {showColorPicker && sidebarOpen && (
            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
              <h3 className="text-white text-sm mb-3">System Colors</h3>
              <div className="grid grid-cols-4 gap-2">
                {['#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#06b6d4', '#84cc16'].map(color => (
                  <button key={color} onClick={() => handleColorChange(color)} className="w-8 h-8 rounded border-2 border-gray-600 hover:border-white" style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-16'} transition-all`}>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics</h1>
          <p className="text-gray-400">Marketplace Performance Dashboard</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="bg-gray-800 border-gray-700 text-white">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-40 bg-gray-800 border-gray-700">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="This month">This month</SelectItem>
              <SelectItem value="Last month">Last month</SelectItem>
              <SelectItem value="Last 3 months">Last 3 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Analytics Card */}
        <div className="lg:col-span-2">
          <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-purple-400" />
                  </div>
                  <CardTitle className="text-white">General Stats</CardTitle>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-purple-400">Orders</span>
                  <span className="text-gray-400">Revenue</span>
                  <span className="text-gray-400">Users</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-8 mb-6">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Total Orders</div>
                  <div className="text-4xl font-bold text-white">1,247</div>
                  <div className="text-sm text-green-400">+12% ↗</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Avg. Order Value</div>
                  <div className="text-4xl font-bold text-white">KES 3,450</div>
                  <div className="text-sm text-green-400">+8% ↗</div>
                </div>
              </div>
              
              {/* Chart Area */}
              <div className="h-48 bg-black/20 rounded-lg p-4 flex items-end justify-between">
                {[20, 35, 25, 45, 55, 40, 60, 35, 50, 45, 30, 40].map((height, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div 
                      className={`w-8 rounded-t ${i === 4 ? 'bg-pink-500' : 'bg-purple-500/60'}`}
                      style={{ height: `${height * 2}px` }}
                    />
                    <span className="text-xs text-gray-500 mt-2">{i + 1}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Stats */}
        <div className="space-y-6">
          {/* Platforms */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                Sales Channels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white">Online Store</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-purple-500 rounded-full" />
                    ))}
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-gray-600 rounded-full" />
                    ))}
                  </div>
                  <span className="text-white font-semibold">80%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white">Marketplace</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-blue-500 rounded-full" />
                    ))}
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-gray-600 rounded-full" />
                    ))}
                  </div>
                  <span className="text-white font-semibold">60%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white">Mobile App</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-purple-500 rounded-full" />
                    ))}
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-gray-600 rounded-full" />
                    ))}
                  </div>
                  <span className="text-white font-semibold">50%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Satisfaction */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full" />
                Customer Satisfaction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#374151"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="2"
                    strokeDasharray="85, 100"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ec4899" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">85%</div>
                    <div className="text-xs text-gray-400">Total</div>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-pink-400">• Positive</span>
                  <span className="text-white">65%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-400">• Negative</span>
                  <span className="text-white">15%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">• Neutral</span>
                  <span className="text-white">20%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Top Sellers */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Top Performing Sellers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'Sarah Johnson', role: 'Electronics Seller', sales: 'KES 45,000', progress: 85 },
              { name: 'Mike Chen', role: 'Fashion Retailer', sales: 'KES 38,000', progress: 70 },
              { name: 'Emma Davis', role: 'Home & Garden', sales: 'KES 32,000', progress: 60 }
            ].map((seller, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {seller.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium">{seller.name}</div>
                  <div className="text-gray-400 text-sm">{seller.role}</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">{seller.sales}</div>
                  <div className="w-20 h-2 bg-gray-700 rounded-full mt-1">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      style={{ width: `${seller.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Customer Engagement */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5" />
              Customer Engagement Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'Active Buyers', role: 'Daily Active Users', engagement: '2,450', percentage: 80 },
              { name: 'Return Customers', role: 'Repeat Purchase Rate', engagement: '1,890', percentage: 65 },
              { name: 'New Signups', role: 'Monthly Growth', engagement: '890', percentage: 45 }
            ].map((metric, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium">{metric.name}</div>
                  <div className="text-gray-400 text-sm">{metric.role}</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">{metric.engagement}</div>
                  <div className="text-purple-400 text-sm">{metric.percentage}%</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      </div>
      </div>
      {/* Simple Messaging */}
      <button onClick={() => setChatOpen(!chatOpen)} className="fixed bottom-4 right-4 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg z-50">
        <MessageCircle className="w-6 h-6" />
      </button>
      {chatOpen && (
        <div className="fixed bottom-20 right-4 w-80 h-96 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-white font-semibold">Messages</h3>
          </div>
          <div className="h-64 overflow-y-auto p-4 space-y-2">
            {messages.map((msg) => (
              <div key={msg.id} className={`p-2 rounded ${msg.userId === session?.user?.id ? 'bg-purple-600 ml-8' : 'bg-gray-800 mr-8'}`}>
                <div className="text-xs text-gray-300">{msg.userName}</div>
                <div className="text-white text-sm">{msg.text}</div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} placeholder="Type a message..." className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm" />
              <button onClick={sendMessage} className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Alert Component */}
      {alert && (
        <Alert 
          type={alert.type} 
          message={alert.message} 
          onClose={() => setAlert(null)} 
        />
      )}
    </>
  )
}