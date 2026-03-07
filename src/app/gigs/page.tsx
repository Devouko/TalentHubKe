'use client'

import { useState, useEffect, useCallback } from 'react'
import { Star, Clock, User, RefreshCw } from 'lucide-react'
import BidButton from '@/components/BidButton'
import InterviewCriteria from '@/components/InterviewCriteria'
import { useSession } from 'next-auth/react'
import { useAutoRefresh } from '@/hooks/useAutoRefresh'

export default function GigsPage() {
  const [gigs, setGigs] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const { data: session } = useSession()

  const fetchGigs = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }
    
    try {
      const response = await fetch('/api/gigs')
      if (response.ok) {
        const data = await response.json()
        setGigs(data)
      } else {
        console.error('Failed to fetch gigs')
      }
    } catch (error) {
      console.error('Network error fetching gigs:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  const { manualRefresh } = useAutoRefresh({
    onRefresh: () => fetchGigs(true),
    interval: 30000, // 30 seconds
    enabled: true
  })

  useEffect(() => {
    fetchGigs()
  }, [])

  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Browse Gigs</h1>
          <button
            onClick={() => manualRefresh()}
            disabled={refreshing}
            className={`px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 text-white ${
              refreshing ? 'cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map((gig) => (
            <div key={gig.id} className="bg-gray-50 dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
              <h3 className="text-xl font-semibold mb-2">{gig.title}</h3>
              <p className="text-gray-600 dark:text-slate-400 text-sm mb-4">{gig.description}</p>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm">{gig.rating || 5.0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{gig.deliveryTime} days</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{gig.seller?.name || 'Seller'}</span>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-emerald-600">
                  KES {gig.price?.toLocaleString()}
                </span>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">
                  Order Now
                </button>
              </div>

              <div className="flex gap-2">
                {session?.user?.id && session.user.id !== gig.sellerId && (
                  <BidButton
                    gigId={gig.id}
                    userId={session.user.id}
                    gigTitle={gig.title}
                    currentPrice={gig.price}
                  />
                )}
                {session?.user?.id === gig.sellerId && (
                  <InterviewCriteria gigId={gig.id} />
                )}
              </div>
            </div>
          ))}
        </div>
        
        {gigs.length === 0 && !loading && !refreshing && (
          <div className="text-center py-12">
            <p className="text-gray-500">No gigs available yet.</p>
          </div>
        )}
        
        {refreshing && (
          <div className="fixed top-4 right-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-3 shadow-lg z-50">
            <div className="flex items-center gap-2 text-sm">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Refreshing gigs...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}