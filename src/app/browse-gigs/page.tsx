'use client'

import { CATEGORIES } from '@/constants/categories'
import DashboardLayout from '@/components/layouts/DashboardLayout'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { Search, Star, Heart, Eye, Filter, RefreshCw, Bell, MapPin, DollarSign, Calendar, User } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAutoRefresh } from '@/hooks/useAutoRefresh'

export default function BrowseGigs() {
  const { data: session } = useSession()
  const [gigs, setGigs] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [activeTab, setActiveTab] = useState('ongoing')

  const categories = CATEGORIES

  const fetchGigs = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }
    
    try {
      const response = await fetch('/api/gigs')
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setGigs(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching gigs:', error)
      setGigs([])
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

  const filteredGigs = gigs.filter(gig => {
    const matchesSearch = gig.title?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || gig.category?.toLowerCase() === selectedCategory.toLowerCase()
    
    // Filter by tab - for now, show all gigs in ongoing tab since we don't have status field yet
    const matchesTab = activeTab === 'ongoing' ? true : false
    
    return matchesSearch && matchesCategory && matchesTab
  })

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Browse Gigs</h1>
              <p className="text-slate-500 dark:text-slate-400">Find the perfect gig for your needs</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => manualRefresh()}
                disabled={refreshing}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-slate-200 dark:border-slate-800"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-slate-200 dark:border-slate-800 mb-6">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('ongoing')}
                className={`pb-3 px-2 border-b-2 transition-colors ${
                  activeTab === 'ongoing'
                    ? 'border-blue-600 text-blue-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Ongoing Gigs
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`pb-3 px-2 border-b-2 transition-colors ${
                  activeTab === 'past'
                    ? 'border-blue-600 text-blue-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Past Gigs
              </button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search gigs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`whitespace-nowrap rounded-full ${
                    selectedCategory === category 
                      ? "bg-blue-600 hover:bg-blue-700 text-white" 
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {loading && !refreshing ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-500 dark:text-slate-400">Loading gigs...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-xs font-bold text-slate-400 uppercase tracking-widest">
              <div className="col-span-5">PROJECT</div>
              <div className="col-span-2 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                LOCATION
              </div>
              <div className="col-span-2 flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                PAYMENT
              </div>
              <div className="col-span-3 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                DURATION
              </div>
            </div>

            {/* Gig Cards */}
            {filteredGigs.map(gig => (
              <Card key={gig.id} className="hover:shadow-xl transition-all duration-300 border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 group">
                <CardContent className="p-0">
                  <div className="grid grid-cols-12 gap-4 items-center px-6 py-5">
                    <div className="col-span-5">
                      <h3 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">{gig.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{gig.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-none font-semibold px-2 py-0.5 text-[10px] uppercase tracking-wider">
                          {gig.category}
                        </Badge>
                        {gig.users?.name && (
                          <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {gig.users.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>{gig.location || 'NA'}</span>
                    </div>
                    <div className="col-span-2 flex items-center gap-1 text-sm font-bold text-orange-600 dark:text-orange-400">
                      <span className="text-xs">KES</span>
                      <span className="text-lg">{gig.price?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="col-span-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>{gig.deliveryTime ? `${gig.deliveryTime} days` : 'NA'}</span>
                      </div>
                      <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 shadow-lg shadow-blue-600/20">
                        <Link href={`/gig/${gig.id}`}>Order Now</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredGigs.length === 0 && !loading && !refreshing && (
          <div className="text-center py-24 bg-slate-50 dark:bg-slate-900/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <div className="bg-white dark:bg-slate-800 w-20 h-20 rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No gigs found</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filters to find what you are looking for.' 
                : 'There are no active gigs available at the moment. Please check back later.'}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}