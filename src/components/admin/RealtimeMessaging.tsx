'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { io, Socket } from 'socket.io-client'
import { MessageCircle, Send, Users, Circle } from 'lucide-react'

interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  timestamp: string
  senderName?: string
}

interface User {
  id: string
  name: string
  isOnline: boolean
}

export default function RealtimeMessaging() {
  const { data: session } = useSession()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [onlineUsers, setOnlineUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (session?.user?.id) {
      const socketInstance = io('http://localhost:3001')
      setSocket(socketInstance)

      socketInstance.emit('join', session.user.id)

      socketInstance.on('receive_message', (data) => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          content: data.message,
          senderId: data.senderId,
          receiverId: session.user.id,
          timestamp: data.timestamp,
          senderName: data.senderName
        }])
      })

      socketInstance.on('user_online', (users) => {
        setOnlineUsers(users)
      })

      return () => {
        socketInstance.disconnect()
      }
    }
  }, [session?.user?.id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedUser || !socket) return

    const messageData = {
      receiverId: selectedUser.id,
      message: newMessage,
      senderId: session?.user?.id,
      senderName: session?.user?.name
    }

    socket.emit('send_message', messageData)
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      content: newMessage,
      senderId: session?.user?.id || '',
      receiverId: selectedUser.id,
      timestamp: new Date().toISOString(),
      senderName: session?.user?.name
    }])
    
    setNewMessage('')
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Real-time Messaging</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-96">
        {/* Online Users */}
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-white">Online Users</span>
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {onlineUsers.map(user => (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  selectedUser?.id === user.id ? 'bg-purple-600' : 'hover:bg-gray-600'
                }`}
              >
                <Circle className="w-2 h-2 text-green-400 fill-current" />
                <span className="text-sm text-white truncate">{user.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2 bg-gray-700 rounded-lg flex flex-col">
          {selectedUser ? (
            <>
              <div className="p-3 border-b border-gray-600">
                <div className="flex items-center gap-2">
                  <Circle className="w-2 h-2 text-green-400 fill-current" />
                  <span className="text-white font-medium">{selectedUser.name}</span>
                </div>
              </div>
              
              <div className="flex-1 p-3 overflow-y-auto">
                <div className="space-y-2">
                  {messages
                    .filter(msg => 
                      (msg.senderId === session?.user?.id && msg.receiverId === selectedUser.id) ||
                      (msg.senderId === selectedUser.id && msg.receiverId === session?.user?.id)
                    )
                    .map(message => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === session?.user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                            message.senderId === session?.user?.id
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-600 text-white'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <form onSubmit={sendMessage} className="p-3 border-t border-gray-600">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg transition-colors"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Select a user to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}