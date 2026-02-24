'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { Search, Star, MapPin, Users, Eye, MessageCircle, Phone, RefreshCw } from 'lucide-react'
import { useAutoRefresh } from '@/hooks/useAutoRefresh'

interface Talent {
  id: string
  name: string
  email: string
  userType: string
  bio?: string
  profileImage?: string
  county?: string
  phoneNumber?: string
  sellerStatus: string
  gigs: Array<{
    id: string
    title: string
    price: number
    rating: number
    reviewCount: number
    category: string
    tags: string[]
  }>
  _count: {
    gigs: number
    orders: number
    reviews: number
  }
}

export default function AllTalent() {
  const { data: session } = useSession()
  const [talents, setTalents] = useState<Talent[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSkill, setSelectedSkill] = useState('all')
  const [selectedProfile, setSelectedProfile] = useState<any>(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [hireLoading, setHireLoading] = useState<string | null>(null)

  const skills = ['all', 'design', 'development', 'writing', 'marketing', 'photography']

  const fetchTalents = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }
    
    try {
      const response = await fetch('/api/users?type=talent')
      if (!response.ok) {
        throw new Error('Failed to fetch talents')
      }
      const data = await response.json()
      setTalents(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching talents:', error)
      setTalents([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  const { manualRefresh } = useAutoRefresh({
    onRefresh: () => fetchTalents(true),
    interval: 30000, // 30 seconds
    enabled: true
  })

  useEffect(() => {
    fetchTalents()
  }, [])

  const viewProfile = async (talentId: string) => {
    if (profileLoading) return
    
    setProfileLoading(true)
    try {
      const response = await fetch(`/api/users/${talentId}`)
      if (response.ok) {
        const profile = await response.json()
        setSelectedProfile(profile)
      } else {
        console.error('Failed to fetch profile')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setProfileLoading(false)
    }
  }

  const hireNow = async (talent: Talent) => {
    if (!session) {
      window.location.href = '/auth/signin'
      return
    }
    
    if (hireLoading === talent.id) return
    
    setHireLoading(talent.id)
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: talent.id })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        window.location.href = `/messages?conversation=${data.conversationId}`
      } else {
        alert(data.error || 'Failed to start conversation')
      }
    } catch (error) {
      console.error('Error creating conversation:', error)
      alert('Failed to start conversation. Please try again.')
    } finally {
      setHireLoading(null)
    }
  }

  const filteredTalents = talents.filter(talent => {
    const matchesSearch = talent.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSkill = selectedSkill === 'all' || 
      talent.gigs?.some(gig => gig.tags?.some(tag => tag.toLowerCase().includes(selectedSkill)))
    return matchesSearch && matchesSkill
  })

  const getAveragePrice = (gigs: any[]) => {
    if (!gigs?.length) return 2500
    return Math.round(gigs.reduce((sum, gig) => sum + gig.price, 0) / gigs.length)
  }

  const getAverageRating = (gigs: any[]) => {
    if (!gigs?.length) return 4.8
    const totalRating = gigs.reduce((sum, gig) => sum + (gig.rating || 0), 0)
    return Math.round((totalRating / gigs.length) * 10) / 10
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">All Talent</h1>
            <button
              onClick={() => manualRefresh()}
              disabled={refreshing}
              className={`px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 disabled:opacity-50 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                refreshing ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search talent..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-gray-400"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto">
              {skills.map(skill => (
                <button
                  key={skill}
                  onClick={() => setSelectedSkill(skill)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedSkill === skill
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white'
                      : 'bg-white/10 backdrop-blur-xl border border-white/20 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {skill.charAt(0).toUpperCase() + skill.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading && !refreshing ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading talent...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTalents.map(talent => (
              <div key={talent.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:border-emerald-500 transition-all shadow-lg hover:shadow-emerald-500/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center overflow-hidden shadow-lg">
                    {talent.profileImage ? (
                      <img src={talent.profileImage} alt={talent.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-bold text-white">{talent.name?.[0] || 'T'}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white">{talent.name || 'Talented User'}</h3>
                    <p className="text-gray-400">{talent.userType === 'FREELANCER' ? 'Freelancer' : 'Agency'}</p>
                    {talent.county && (
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <MapPin className="w-3 h-3" />
                        <span>{talent.county}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-300 text-sm mb-2 line-clamp-2">
                    {talent.bio || 'Experienced professional ready to help with your projects.'}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{getAverageRating(talent.gigs)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{talent._count?.orders || 0} orders</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{talent._count?.gigs || 0} services</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {talent.gigs?.length > 0 ? (
                      talent.gigs.slice(0, 3).map(gig => 
                        gig.tags?.slice(0, 2).map((tag, index) => (
                          <span key={`${gig.id}-${index}`} className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded-full text-xs">
                            {tag}
                          </span>
                        ))
                      ).flat().slice(0, 4)
                    ) : (
                      ['Design', 'Development'].map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded-full text-xs">
                          {skill}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-green-400">
                    {talent.gigs?.length > 0 ? (
                      `KES ${getAveragePrice(talent.gigs).toLocaleString()}/project`
                    ) : (
                      'KES 2,500/hr'
                    )}
                  </span>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => viewProfile(talent.id)}
                      disabled={profileLoading}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-all flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      {profileLoading ? 'Loading...' : 'View'}
                    </button>
                    <button 
                      onClick={() => hireNow(talent)}
                      disabled={hireLoading === talent.id}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-all flex items-center gap-1 shadow-lg"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {hireLoading === talent.id ? 'Hiring...' : 'Hire'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredTalents.length === 0 && !loading && !refreshing && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No talent found</h3>
            <p className="text-gray-400">
              {searchTerm || selectedSkill !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'No talent available at the moment'}
            </p>
          </div>
        )}
        
        {refreshing && (
          <div className="fixed top-4 right-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-3 shadow-lg z-50">
            <div className="flex items-center gap-2 text-sm text-white">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Refreshing talent...</span>
            </div>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center overflow-hidden shadow-lg">
                    {selectedProfile.profileImage ? (
                      <img src={selectedProfile.profileImage} alt={selectedProfile.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold text-white">{selectedProfile.name?.[0] || 'T'}</span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedProfile.name}</h2>
                    <p className="text-gray-400">{selectedProfile.userType === 'FREELANCER' ? 'Freelancer' : 'Agency'}</p>
                    {selectedProfile.county && (
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedProfile.county}</span>
                      </div>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedProfile(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-2">About</h3>
                    <p className="text-gray-300">{selectedProfile.bio || 'No bio available'}</p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Services</h3>
                    <div className="grid gap-4">
                      {selectedProfile.gigs?.map((gig: any) => (
                        <div key={gig.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-white">{gig.title}</h4>
                            <span className="text-green-400 font-bold">KES {gig.price.toLocaleString()}</span>
                          </div>
                          <p className="text-gray-400 text-sm mb-2">{gig.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span>{gig.deliveryTime} days delivery</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span>{gig.rating || 0} ({gig.reviewCount || 0})</span>
                            </div>
                          </div>
                        </div>
                      )) || <p className="text-gray-400">No services available</p>}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Reviews</h3>
                    <div className="space-y-4">
                      {selectedProfile.reviews?.map((review: any) => (
                        <div key={review.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold">{review.reviewer.name?.[0] || 'U'}</span>
                            </div>
                            <div>
                              <p className="text-white text-sm font-medium">{review.reviewer.name}</p>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-300 text-sm">{review.comment}</p>
                        </div>
                      )) || <p className="text-gray-400">No reviews yet</p>}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-4 mb-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Stats</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Rating</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-white">{selectedProfile.avgRating || 0}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Orders</span>
                        <span className="text-white">{selectedProfile._count?.orders || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Services</span>
                        <span className="text-white">{selectedProfile._count?.gigs || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Reviews</span>
                        <span className="text-white">{selectedProfile._count?.reviews || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button 
                      onClick={() => {
                        const currentProfile = selectedProfile
                        setSelectedProfile(null)
                        hireNow(currentProfile)
                      }}
                      disabled={hireLoading === selectedProfile?.id}
                      className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {hireLoading === selectedProfile?.id ? 'Starting...' : 'Start Conversation'}
                    </button>
                    {selectedProfile.phoneNumber && (
                      <a 
                        href={`tel:${selectedProfile.phoneNumber}`}
                        className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 no-underline"
                      >
                        <Phone className="w-4 h-4" />
                        Call Now
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}