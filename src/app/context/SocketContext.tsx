'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { io, Socket } from 'socket.io-client'

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
  joinOrder: (orderId: string) => void
  leaveOrder: (orderId: string) => void
  sendMessage: (message: any) => void
  onNewMessage: (callback: (message: any) => void) => void
  onUserTyping: (callback: (data: any) => void) => void
  sendTyping: (orderId: string, isTyping: boolean) => void
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  joinOrder: () => {},
  leaveOrder: () => {},
  sendMessage: () => {},
  onNewMessage: () => {},
  onUserTyping: () => {},
  sendTyping: () => {}
})

export const useSocket = () => useContext(SocketContext)

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user) {
      const socketInstance = io('http://localhost:3001')
      
      socketInstance.on('connect', () => {
        setIsConnected(true)
        socketInstance.emit('join', {
          userId: session.user.id,
          userName: session.user.name
        })
      })

      socketInstance.on('disconnect', () => {
        setIsConnected(false)
      })

      setSocket(socketInstance)

      return () => {
        socketInstance.disconnect()
      }
    }
  }, [session])

  const joinOrder = (orderId: string) => {
    if (socket) {
      socket.emit('joinOrder', orderId)
    }
  }

  const leaveOrder = (orderId: string) => {
    if (socket) {
      socket.emit('leaveOrder', orderId)
    }
  }

  const sendMessage = (message: any) => {
    if (socket) {
      socket.emit('sendMessage', message)
    }
  }

  const onNewMessage = (callback: (message: any) => void) => {
    if (socket) {
      socket.on('newMessage', callback)
      return () => socket.off('newMessage', callback)
    }
  }

  const onUserTyping = (callback: (data: any) => void) => {
    if (socket) {
      socket.on('userTyping', callback)
      return () => socket.off('userTyping', callback)
    }
  }

  const sendTyping = (orderId: string, isTyping: boolean) => {
    if (socket) {
      socket.emit('typing', { orderId, isTyping })
    }
  }

  return (
    <SocketContext.Provider value={{
      socket,
      isConnected,
      joinOrder,
      leaveOrder,
      sendMessage,
      onNewMessage,
      onUserTyping,
      sendTyping
    }}>
      {children}
    </SocketContext.Provider>
  )
}