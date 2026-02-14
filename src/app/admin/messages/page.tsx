'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Search, Eye, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import AdminSidebarLayout from '../AdminSidebarLayout'

export default function AdminMessagesPage() {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations')
      if (response.ok) {
        const data = await response.json()
        setConversations(data)
      } else {
        console.error('Failed to fetch conversations')
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = 
      conv.buyer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.seller?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.gigTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || conv.orderStatus.toLowerCase() === filterStatus
    return matchesSearch && matchesStatus
  })

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString()
    }
  }

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-400" />
      case 'disputed':
        return <AlertTriangle className="w-4 h-4 text-red-400" />
      default:
        return <Clock className="w-4 h-4 text-yellow-400" />
    }
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-600 text-white'
      case 'in_progress':
        return 'bg-blue-600 text-white'
      case 'disputed':
        return 'bg-red-600 text-white'
      case 'cancelled':
        return 'bg-gray-600 text-white'
      default:
        return 'bg-yellow-600 text-white'
    }
  }

  const totalStats = {
    totalConversations: conversations.length,
    activeConversations: conversations.filter(c => c.orderStatus === 'IN_PROGRESS').length,
    disputedConversations: conversations.filter(c => c.orderStatus === 'DISPUTED').length,
    completedConversations: conversations.filter(c => c.orderStatus === 'COMPLETED').length
  }

  return (
    <AdminSidebarLayout>
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-purple-400" />
              <h1 className="text-3xl font-bold">Messages Management</h1>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Total Conversations</p>
                  <p className="text-2xl font-bold text-white">{totalStats.totalConversations}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-purple-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Active Orders</p>
                  <p className="text-2xl font-bold text-white">{totalStats.activeConversations}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-red-600 to-pink-600 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100">Disputed</p>
                  <p className="text-2xl font-bold text-white">{totalStats.disputedConversations}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Completed</p>
                  <p className="text-2xl font-bold text-white">{totalStats.completedConversations}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-200" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="disputed">Disputed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading conversations...</p>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Participants</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Gig</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Last Message</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Messages</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredConversations.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                          <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No conversations found</p>
                        </td>
                      </tr>
                    ) : (
                      filteredConversations.map(conversation => (
                        <tr key={conversation.id} className="hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">{conversation.buyer?.name?.[0] || 'B'}</span>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-white">{conversation.buyer?.name || 'Unknown Buyer'}</div>
                                  <div className="text-xs text-gray-400">Buyer</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">{conversation.seller?.name?.[0] || 'S'}</span>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-white">{conversation.seller?.name || 'Unknown Seller'}</div>
                                  <div className="text-xs text-gray-400">Seller</div>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-white truncate max-w-xs">
                              {conversation.gigTitle}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(conversation.orderStatus)}
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(conversation.orderStatus)}`}>
                                {conversation.orderStatus.replace('_', ' ').toUpperCase()}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-300 truncate max-w-xs">
                              {conversation.lastMessage}
                            </div>
                            <div className="text-xs text-gray-400">
                              {formatTime(conversation.lastMessageTime)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {conversation.messageCount} messages
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminSidebarLayout>
  )
}