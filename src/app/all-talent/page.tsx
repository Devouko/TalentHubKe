'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Search, Star, MapPin, Users, Eye, MessageCircle, Phone, RefreshCw, ShoppingCart, Menu, X, ArrowRight } from 'lucide-react'
import { useAutoRefresh } from '@/hooks/useAutoRefresh'
import { useCart } from '../context/CartContext'
import { usePlatformSettings } from '@/hooks/useDynamicSettings'
import { toast } from 'sonner'

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
  const router = useRouter()
  const { cart } = useCart()
  const platformSettings = usePlatformSettings()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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
      toast.error('Please sign in to hire talent')
      return
    }
    
    setHireLoading(talent.id)
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: talent.id })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast.success(`Conversation started with ${talent.name}!`, {
          description: 'Check your messages to continue the conversation.',
          action: {
            label: 'View Messages',
            onClick: () => router.push('/messages')
          }
        })
      } else {
        toast.error(data.error || 'Failed to start conversation')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to start conversation. Please try again.')
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
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 pt-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Find Talent</h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg">Connect with world-class freelancers and agencies</p>
            </div>
            <button
              onClick={() => manualRefresh()}
              disabled={refreshing}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search talent..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-900 dark:text-white placeholder-slate-400 text-lg shadow-sm"
              />
            </div>
            
            <div className="flex gap-3 overflow-x-auto pb-2">
              {skills.map(skill => (
                <button
                  key={skill}
                  onClick={() => setSelectedSkill(skill)}
                  className={`px-6 py-3 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all shadow-sm ${
                    selectedSkill === skill
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/20'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-blue-300'
                  }`}
                >
                  {skill.charAt(0).toUpperCase() + skill.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading && !refreshing ? (
          <div className="text-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-slate-500 dark:text-slate-400 mt-4 font-medium">Loading talent...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTalents.map(talent => (
              <div key={talent.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:border-blue-500 transition-all hover:shadow-2xl group overflow-hidden relative transform hover:-translate-y-1">
                <div className="absolute top-6 right-6">
                   <div className="flex items-center gap-1 bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 rounded-full border border-orange-100 dark:border-orange-900/30">
                      <Star className="w-4 h-4 text-orange-500 fill-current" />
                      <span className="text-sm font-bold text-orange-600 dark:text-orange-400">{getAverageRating(talent.gigs)}</span>
                   </div>
                </div>

                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-orange-500 rounded-3xl flex items-center justify-center overflow-hidden shadow-xl transform rotate-2 group-hover:rotate-0 transition-transform">
                    {talent.profileImage ? (
                      <img src={talent.profileImage} alt={talent.name} className="w-full h-full object-cover -rotate-2 group-hover:rotate-0 transition-transform" />
                    ) : (
                      <span className="text-2xl font-bold text-white -rotate-2 group-hover:rotate-0 transition-transform">{talent.name?.[0] || 'T'}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors mb-1">{talent.name || 'Talented User'}</h3>
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">{talent.userType === 'FREELANCER' ? 'Freelancer' : 'Agency'}</p>
                    {talent.county && (
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                        <MapPin className="w-4 h-4" />
                        <span>{talent.county}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-slate-600 dark:text-slate-400 text-base mb-6 line-clamp-2 leading-relaxed">
                    {talent.bio || 'Experienced professional ready to help with your projects.'}
                  </p>
                  
                  <div className="flex items-center gap-6 text-sm font-semibold text-slate-500 dark:text-slate-400 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>{talent._count?.orders || 0} orders</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>{talent._count?.gigs || 0} services</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {talent.gigs?.length > 0 ? (
                      talent.gigs.slice(0, 3).map(gig => 
                        gig.tags?.slice(0, 2).map((tag, index) => (
                          <span key={`${gig.id}-${index}`} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium">
                            {tag}
                          </span>
                        ))
                      ).flat().slice(0, 4)
                    ) : (
                      ['Design', 'Development'].map((skill, index) => (
                        <span key={index} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Starting at</span>
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">
                      KES {talent.gigs?.length > 0 ? getAveragePrice(talent.gigs).toLocaleString() : '2,500'}/hr
                    </span>
                  </div>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={() => viewProfile(talent.id)}
                      disabled={profileLoading}
                      className="px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 rounded-xl transition-all flex items-center justify-center text-slate-600 dark:text-slate-400 font-medium"
                      title="View Profile"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => hireNow(talent)}
                      disabled={hireLoading === talent.id}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white disabled:opacity-50 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20"
                    >
                      {hireLoading === talent.id ? 'Hiring...' : 'Hire'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredTalents.length === 0 && !loading && !refreshing && (
          <div className="text-center py-24 bg-slate-50 dark:bg-slate-900/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No talent found</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              {searchTerm || selectedSkill !== 'all' 
                ? 'Try adjusting your search or filters to find the right talent.' 
                : 'There is no talent available at the moment. Please check back later.'}
            </p>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button 
              onClick={() => setSelectedProfile(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors bg-slate-100 dark:bg-slate-800 w-10 h-10 rounded-full flex items-center justify-center z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-6 mb-8 items-start">
                  <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-orange-500 rounded-3xl flex items-center justify-center overflow-hidden shadow-xl transform rotate-3">
                    {selectedProfile.profileImage ? (
                      <img src={selectedProfile.profileImage} alt={selectedProfile.name} className="w-full h-full object-cover -rotate-3" />
                    ) : (
                      <span className="text-3xl font-bold text-white -rotate-3">{selectedProfile.name?.[0] || 'T'}</span>
                    )}
                  </div>
                  <div className="pt-2">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{selectedProfile.name}</h2>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">{selectedProfile.userType === 'FREELANCER' ? 'Freelancer' : 'Agency'}</p>
                      {selectedProfile.county && (
                        <div className="flex items-center gap-1 text-sm font-medium text-slate-400">
                          <MapPin className="w-4 h-4" />
                          <span>{selectedProfile.county}</span>
                        </div>
                      )}
                    </div>
                  </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="mb-8">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">About Professional</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">{selectedProfile.bio || 'No bio available'}</p>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Services & Pricing</h3>
                    <div className="grid gap-4">
                      {selectedProfile.gigs?.map((gig: any) => (
                        <div key={gig.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-blue-500 transition-colors group">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{gig.title}</h4>
                            <div className="flex flex-col items-end">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Price</span>
                              <span className="text-blue-600 dark:text-blue-400 font-bold">KES {gig.price.toLocaleString()}</span>
                            </div>
                          </div>
                          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 leading-relaxed line-clamp-2">{gig.description}</p>
                          <div className="flex items-center gap-6 text-xs font-bold text-slate-400">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4 text-blue-500" />
                              <span>{gig.deliveryTime} DAYS DELIVERY</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Star className="w-4 h-4 text-orange-500 fill-current" />
                              <span>{gig.rating || 0} ({gig.reviewCount || 0})</span>
                            </div>
                          </div>
                        </div>
                      )) || <p className="text-slate-400">No services available</p>}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Recent Reviews</h3>
                    <div className="space-y-4">
                      {selectedProfile.reviews?.map((review: any) => (
                        <div key={review.id} className="bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 rounded-2xl p-6">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-xl flex items-center justify-center">
                              <span className="text-white font-bold text-sm">{review.reviewer.name?.[0] || 'U'}</span>
                            </div>
                            <div>
                              <p className="text-slate-900 dark:text-white text-sm font-bold">{review.reviewer.name}</p>
                              <div className="flex items-center gap-1 mt-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-orange-500 fill-current' : 'text-slate-300 dark:text-slate-700'}`} />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 text-sm italic leading-relaxed">"{review.comment}"</p>
                        </div>
                      )) || <p className="text-slate-400">No reviews yet</p>}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-3xl p-6">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Performance Stats</h3>
                    <div className="space-y-5">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-500">Average Rating</span>
                        <div className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-lg">
                          <Star className="w-4 h-4 text-orange-500 fill-current" />
                          <span className="text-orange-700 dark:text-orange-400 font-bold">{selectedProfile.avgRating || 0}</span>
                        </div>
                      </div>
                      <div className="h-[1px] bg-slate-200 dark:bg-slate-800"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-500">Completed Orders</span>
                        <span className="text-slate-900 dark:text-white font-bold">{selectedProfile._count?.orders || 0}</span>
                      </div>
                      <div className="h-[1px] bg-slate-200 dark:bg-slate-800"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-500">Service Gigs</span>
                        <span className="text-slate-900 dark:text-white font-bold">{selectedProfile._count?.gigs || 0}</span>
                      </div>
                      <div className="h-[1px] bg-slate-200 dark:bg-slate-800"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-500">Total Reviews</span>
                        <span className="text-slate-900 dark:text-white font-bold">{selectedProfile._count?.reviews || 0}</span>
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
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20"
                    >
                      <MessageCircle className="w-5 h-5" />
                      {hireLoading === selectedProfile?.id ? 'STARTING...' : 'HIRE NOW'}
                    </button>
                    {selectedProfile.phoneNumber && (
                      <a 
                        href={`tel:${selectedProfile.phoneNumber}`}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 no-underline hover:bg-slate-50 dark:hover:bg-slate-700"
                      >
                        <Phone className="w-5 h-5" />
                        CALL TALENT
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}