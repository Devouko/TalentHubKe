'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { Send, User, Search, MoreVertical, MessageCircle, Check, CheckCheck } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { toast } from 'sonner'

interface Message {
  id: string
  content: string
  senderId: string
  createdAt: string
  sender: {
    id: string
    name: string
    image?: string
  }
}

interface Conversation {
  id: string
  otherUser: {
    id: string
    name: string
    image?: string
  }
  lastMessage?: {
    content: string
    createdAt: string
    senderId: string
  }
  updatedAt: string
}

export default function MessagesPage() {
  const { data: session } = useSession()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastMessageIdRef = useRef<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' })
  }, [])

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      const response = await fetch('/api/conversations')
      if (response.ok) {
        const data = await response.json()
        setConversations(data || [])
        if (data && data.length > 0 && !activeConversation) {
          setActiveConversation(data[0].id)
        }
      } else {
        console.error('Failed to fetch conversations:', response.statusText)
        setConversations([])
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
      setConversations([])
    }
  }, [activeConversation])

  // Fetch messages for active conversation
  const fetchMessages = useCallback(async (conversationId: string, silent = false) => {
    try {
      const response = await fetch(`/api/messages?conversationId=${conversationId}`)
      if (response.ok) {
        const data = await response.json()
        const newMessages = data || []
        
        // Check if there are new messages
        if (newMessages.length > 0) {
          const latestMessageId = newMessages[newMessages.length - 1]?.id
          
          // Only update if we have new messages
          if (latestMessageId !== lastMessageIdRef.current) {
            setMessages(newMessages)
            lastMessageIdRef.current = latestMessageId
            
            // Scroll to bottom if new message
            if (!silent) {
              setTimeout(() => scrollToBottom(), 100)
            }
            
            // Play sound for new messages from others
            if (newMessages[newMessages.length - 1]?.senderId !== session?.user?.id) {
              playNotificationSound()
            }
          }
        } else {
          setMessages([])
          lastMessageIdRef.current = null
        }
      } else {
        console.error('Failed to fetch messages:', response.statusText)
        setMessages([])
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
      setMessages([])
    }
  }, [session?.user?.id, scrollToBottom])

  // Play notification sound
  const playNotificationSound = () => {
    try {
      const audio = new Audio('/notification.mp3')
      audio.volume = 0.3
      audio.play().catch(() => {}) // Ignore errors if sound fails
    } catch (error) {
      // Ignore sound errors
    }
  }

  // Real-time polling for new messages
  useEffect(() => {
    if (!activeConversation) return

    // Initial fetch
    fetchMessages(activeConversation)

    // Set up polling every 2 seconds
    pollingIntervalRef.current = setInterval(() => {
      fetchMessages(activeConversation, true)
    }, 2000)

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [activeConversation, fetchMessages])

  // Poll conversations every 5 seconds
  useEffect(() => {
    if (!session?.user) return

    fetchConversations()

    const conversationInterval = setInterval(() => {
      fetchConversations()
    }, 5000)

    return () => clearInterval(conversationInterval)
  }, [session, fetchConversations])

  // Send message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeConversation || loading) return

    const messageContent = newMessage.trim()
    setNewMessage('')
    setLoading(true)

    // Optimistic update
    const optimisticMessage: Message = {
      id: `temp_${Date.now()}`,
      content: messageContent,
      senderId: session?.user?.id || '',
      createdAt: new Date().toISOString(),
      sender: {
        id: session?.user?.id || '',
        name: session?.user?.name || 'You',
        image: session?.user?.image || null
      }
    }

    setMessages(prev => [...prev, optimisticMessage])
    setTimeout(() => scrollToBottom(), 50)

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConversation,
          content: messageContent
        })
      })

      if (response.ok) {
        const message = await response.json()
        
        // Replace optimistic message with real one
        setMessages(prev => 
          prev.map(msg => msg.id === optimisticMessage.id ? message : msg)
        )
        
        lastMessageIdRef.current = message.id
        
        // Refresh conversations to update last message
        fetchConversations()
        
        // Focus back on input
        inputRef.current?.focus()
      } else {
        toast.error('Failed to send message')
        // Remove optimistic message on failure
        setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id))
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      toast.error('Failed to send message')
      // Remove optimistic message on failure
      setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id))
    } finally {
      setLoading(false)
    }
  }

  // Handle typing indicator
  const handleTyping = () => {
    setIsTyping(true)
    setTimeout(() => setIsTyping(false), 1000)
  }

  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    if (!conv.otherUser || !conv.otherUser.name) return false
    return conv.otherUser.name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const activeConv = conversations.find(c => c.id === activeConversation)

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please sign in to access messages
          </h1>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Messages</h1>
            <p className="text-slate-500 dark:text-slate-400">Manage your conversations with clients and talent</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden h-[calc(100vh-220px)] flex flex-col md:flex-row">
          {/* Conversations Sidebar */}
          <div className="w-full md:w-1/3 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-900/50">
            {/* Search */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all font-medium"
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
              {filteredConversations.length === 0 ? (
                <div className="p-12 text-center text-slate-400 font-medium">
                  {searchTerm ? 'No conversations found' : 'No conversations yet'}
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  if (!conv.otherUser) return null
                  
                  return (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setActiveConversation(conv.id)
                      lastMessageIdRef.current = null
                    }}
                    className={`w-full p-5 text-left hover:bg-white dark:hover:bg-slate-800 transition-all border-b border-slate-100 dark:border-slate-800/50 relative group ${
                      activeConversation === conv.id ? 'bg-white dark:bg-slate-800 shadow-sm z-10' : ''
                    }`}
                  >
                    {activeConversation === conv.id && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full"></div>
                    )}
                    <div className="flex items-center gap-4">
                      <div className="relative shrink-0">
                        {conv.otherUser.image ? (
                          <img
                            src={conv.otherUser.image}
                            alt={conv.otherUser.name || 'User'}
                            className="w-12 h-12 rounded-2xl object-cover shadow-md"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl flex items-center justify-center shadow-inner">
                            <User className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full shadow-sm"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <p className={`font-bold truncate transition-colors ${
                            activeConversation === conv.id ? 'text-blue-600' : 'text-slate-900 dark:text-white group-hover:text-blue-600'
                          }`}>
                            {conv.otherUser.name || 'Unknown User'}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap ml-2">
                            {formatDistanceToNow(new Date(conv.updatedAt), { addSuffix: false })}
                          </p>
                        </div>
                        {conv.lastMessage && (
                          <p className="text-slate-500 dark:text-slate-400 text-sm truncate font-medium flex items-center gap-1">
                            {conv.lastMessage.senderId === session.user?.id && (
                              <CheckCheck className="w-3 h-3 text-blue-500" />
                            )}
                            {conv.lastMessage.senderId === session.user?.id ? (
                              <span className="text-blue-500/70 font-bold">You:</span>
                            ) : ''}
                            {conv.lastMessage.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                  )
                })
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
            {activeConversation && activeConv && activeConv.otherUser ? (
              <>
                {/* Chat Header */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 z-20">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {activeConv.otherUser?.image ? (
                        <img
                          src={activeConv.otherUser.image}
                          alt={activeConv.otherUser.name || 'User'}
                          className="w-12 h-12 rounded-2xl object-cover shadow-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-tr from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-900/10 rounded-2xl flex items-center justify-center shadow-inner">
                          <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm"></div>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-none mb-1">
                        {activeConv.otherUser?.name || 'Unknown User'}
                      </h2>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Now</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar bg-slate-50/30 dark:bg-slate-950/20">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === session.user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-end gap-3 max-w-[80%] ${message.senderId === session.user?.id ? 'flex-row-reverse' : ''}`}>
                        {message.senderId !== session.user?.id && (
                          <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 shadow-sm">
                            <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <div
                            className={`px-5 py-3 rounded-2xl shadow-sm text-sm font-medium leading-relaxed ${
                              message.senderId === session.user?.id
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-none border border-slate-100 dark:border-slate-700'
                            }`}
                          >
                            <p>{message.content}</p>
                          </div>
                          <div className={`flex items-center gap-1 mt-1.5 ${
                            message.senderId === session.user?.id ? 'justify-end' : ''
                          }`}>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                              {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                            </p>
                            {message.senderId === session.user?.id && (
                              <CheckCheck className="w-3 h-3 text-blue-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                  <form onSubmit={sendMessage} className="relative flex items-center gap-3">
                    <div className="relative flex-1 group">
                      <input
                        ref={inputRef}
                        type="text"
                        value={newMessage}
                        onChange={(e) => {
                          setNewMessage(e.target.value)
                          handleTyping()
                        }}
                        placeholder="Type your message here..."
                        disabled={loading}
                        className="w-full pl-6 pr-12 py-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all font-medium placeholder-slate-400 disabled:opacity-50"
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim() || loading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center shadow-lg shadow-blue-600/20"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-12 bg-slate-50/30 dark:bg-slate-950/10">
                <div className="text-center max-w-sm">
                  <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-8 transform rotate-6 border border-slate-100 dark:border-slate-700">
                    <MessageCircle className="w-10 h-10 text-blue-600 animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Your Messages</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    Select a conversation from the sidebar to start collaborating with talent or clients.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
