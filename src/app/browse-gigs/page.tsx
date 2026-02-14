'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { Search, Star, Heart, Eye, Filter, RefreshCw } from 'lucide-react'
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

  const categories = ['all', 'design', 'development', 'writing', 'marketing', 'video']

  const fetchGigs = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }
    
    try {
      const response = await fetch('/api/gigs')
      const data = await response.json()
      setGigs(data || [])
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
    const matchesCategory = selectedCategory === 'all' || gig.category?.toLowerCase() === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-foreground">Browse Gigs</h1>
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
            <div className="animate-pulse bg-muted h-4 w-full rounded mb-4"></div>
            <p className="text-muted-foreground">Loading gigs...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGigs.map(gig => (
              <Card key={gig.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="h-48 bg-muted flex items-center justify-center relative">
                    {gig.images && gig.images.length > 0 ? (
                      <img 
                        src={gig.images[0]} 
                        alt={gig.title} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <Eye className="w-12 h-12 text-muted-foreground" />
                    )}
                    
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-4">
                    <CardTitle className="text-lg font-semibold mb-2 line-clamp-2">
                      {gig.title}
                    </CardTitle>
                    
                    <CardDescription className="text-sm mb-3 line-clamp-2">
                      {gig.description}
                    </CardDescription>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm">{gig.rating || 5.0}</span>
                      </div>
                      <span className="text-muted-foreground text-sm">({gig.reviewCount || 0})</span>
                      <Badge variant="secondary" className="ml-auto">
                        {gig.category}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary">
                        KES {gig.price?.toLocaleString() || '5,000'}
                      </span>
                      
                      <Link href={`/gig/${gig.id}`}>
                        <Button size="sm">
                          Order Now
                        </Button>
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