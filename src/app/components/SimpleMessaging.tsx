'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Send, MessageCircle } from 'lucide-react'

export default function SimpleMessaging() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState([
    { id: '1', text: 'Welcome to the messaging system!', userName: 'System', userId: 'system' }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [isOpen, setIsOpen] = useState(false)

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
    }
  }

  if (!session) return null

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 h-96 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-white font-semibold">Messages</h3>
          </div>
          
          <div className="h-64 overflow-y-auto p-4 space-y-2">
            {messages.map((msg) => (
              <div key={msg.id} className={`p-2 rounded ${msg.userId === session.user?.id ? 'bg-purple-600 ml-8' : 'bg-gray-800 mr-8'}`}>
                <div className="text-xs text-gray-300">{msg.userName}</div>
                <div className="text-white text-sm">{msg.text}</div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
              />
              <button
                onClick={sendMessage}
                className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}