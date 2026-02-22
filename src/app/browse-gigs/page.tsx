'use client'

import { CATEGORIES } from '@/constants/categories'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { Search, Star, Heart, Eye, Filter, RefreshCw, Bell, MapPin, DollarSign, Calendar } from 'lucide-react'
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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Browse Gigs</h1>
              <p className="text-muted-foreground">Find the perfect gig for your needs</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => manualRefresh()}
                disabled={refreshing}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-border mb-6">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('ongoing')}
                className={`pb-3 px-2 border-b-2 transition-colors ${
                  activeTab === 'ongoing'
                    ? 'border-primary text-primary font-medium'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Ongoing Gigs
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`pb-3 px-2 border-b-2 transition-colors ${
                  activeTab === 'past'
                    ? 'border-primary text-primary font-medium'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Past Gigs
              </button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search gigs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {loading && !refreshing ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading gigs...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted/50 rounded-lg text-sm font-medium text-muted-foreground">
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
              <Card key={gig.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-5">
                      <Link href={`/gig/${gig.id}`} className="hover:text-primary transition-colors">
                        <h3 className="font-semibold mb-1">{gig.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">{gig.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">{gig.category}</Badge>
                          {gig.users?.name && (
                            <span className="text-xs text-muted-foreground">by {gig.users.name}</span>
                          )}
                        </div>
                      </Link>
                    </div>
                    <div className="col-span-2 flex items-center gap-1 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{gig.location || 'NA'}</span>
                    </div>
                    <div className="col-span-2 flex items-center gap-1 text-sm font-semibold text-primary">
                      <DollarSign className="w-4 h-4" />
                      <span>KES {gig.price?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="col-span-3 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{gig.deliveryTime ? `${gig.deliveryTime} days` : 'NA'}</span>
                      </div>
                      <Link href={`/gig/${gig.id}`}>
                        <Button size="sm">View</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredGigs.length === 0 && !loading && !refreshing && (
          <div className="text-center py-12">
            <Eye className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No gigs found</h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'No gigs available at the moment'}
            </p>
          </div>
        )}
        
        {refreshing && (
          <div className="fixed top-4 right-4 bg-background border rounded-lg p-3 shadow-lg z-50">
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