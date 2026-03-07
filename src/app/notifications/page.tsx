'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { Bell, Check, Trash2, Clock, Info, MessageCircle, ShoppingCart, Star } from 'lucide-react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'

interface Notification {
  id: string
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt: string
  entityType?: string
}

export default function NotificationsPage() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastNotificationIdRef = useRef<string | null>(null)

  const fetchNotifications = useCallback(async (silent = false) => {
    try {
      const response = await fetch('/api/notifications')
      if (response.ok) {
        const data = await response.json()
        
        if (Array.isArray(data)) {
          // Check for new notifications
          if (data.length > 0 && lastNotificationIdRef.current) {
            const latestNotification = data[0]
            
            if (latestNotification.id !== lastNotificationIdRef.current) {
              toast.info(latestNotification.title, {
                description: latestNotification.message,
                duration: 5000
              })
            }
          }
          
          if (data.length > 0) {
            lastNotificationIdRef.current = data[0].id
          }
          
          setNotifications(data)
        } else {
          setNotifications([])
        }
      } else {
        console.error('Failed to fetch notifications')
        if (!silent) setNotifications([])
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
      if (!silent) setNotifications([])
    } finally {
      if (!silent) {
        setLoading(false)
      }
    }
  }, [])

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true })
      })
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
        )
        toast.success('Marked as read')
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
      toast.error('Failed to mark as read')
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setNotifications(prev => prev.filter(n => n.id !== notificationId))
        toast.success('Notification deleted')
      }
    } catch (error) {
      console.error('Failed to delete notification:', error)
      toast.error('Failed to delete notification')
    }
  }

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.isRead)
    
    if (unread.length === 0) {
      toast.info('No unread notifications')
      return
    }
    
    try {
      for (const n of unread) {
        await fetch(`/api/notifications/${n.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isRead: true })
        })
      }
      
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      toast.success(`Marked ${unread.length} notifications as read`)
    } catch (error) {
      console.error('Failed to mark all as read:', error)
      toast.error('Failed to mark all as read')
    }
  }

  useEffect(() => {
    if (!session?.user?.id) return

    fetchNotifications()

    pollingIntervalRef.current = setInterval(() => {
      fetchNotifications(true)
    }, 10000) // Poll every 10 seconds

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [session?.user?.id, fetchNotifications])

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.isRead)

  if (!session) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-24">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Please sign in</h2>
            <p className="text-slate-500 dark:text-slate-400">Sign in to view your notifications</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Notifications</h1>
            <p className="text-slate-500 dark:text-slate-400">Stay updated with your latest activities</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
            >
              Mark all as read
            </button>
          </div>
        </div>

        <div className="flex gap-4 mb-6 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setFilter('all')}
            className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 ${
              filter === 'all' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            All Notifications
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 ${
              filter === 'unread' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            Unread
            {notifications.filter(n => !n.isRead).length > 0 && (
              <span className="ml-2 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {notifications.filter(n => !n.isRead).length}
              </span>
            )}
          </button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-24 bg-slate-50 dark:bg-slate-900/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
              <div className="bg-white dark:bg-slate-800 w-20 h-20 rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-6">
                <Bell className="w-10 h-10 text-slate-300" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No notifications</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                {filter === 'all' 
                  ? "You don't have any notifications yet." 
                  : "You've read all your notifications!"}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`group p-6 rounded-2xl border transition-all hover:shadow-md ${
                  !notification.isRead 
                    ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30' 
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'
                }`}
              >
                <div className="flex gap-4">
                  <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                    !notification.isRead ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}>
                    {notification.type === 'MESSAGE' ? <MessageCircle className="w-6 h-6" /> :
                     notification.type === 'ORDER' ? <ShoppingCart className="w-6 h-6" /> :
                     notification.type === 'REVIEW' ? <Star className="w-6 h-6" /> :
                     notification.type === 'SUCCESS' ? <Check className="w-6 h-6" /> : 
                     notification.type === 'INFO' ? <Info className="w-6 h-6" /> :
                     <Bell className="w-6 h-6" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-bold transition-colors ${
                        !notification.isRead ? 'text-blue-900 dark:text-blue-100' : 'text-slate-900 dark:text-white'
                      }`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-4">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-widest"
                        >
                          Mark as read
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-xs font-bold text-red-500 hover:text-red-600 uppercase tracking-widest flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
