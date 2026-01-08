'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'motion/react'
import { ShoppingCart, Search, Star, Plus, Heart, Eye, Trash2, X, MessageCircle, Users, Briefcase, Award, TrendingUp, DollarSign, Bell, Settings, LogOut, Palette, UserCheck } from 'lucide-react'
import { AdminRedirect } from '@/components/AdminRedirect'
import Alert from '../../components/ui/Alert'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

export default function DashboardContent() {
  const { data: session } = useSession()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [cart, setCart] = useState([])
  const [showProductForm, setShowProductForm] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [activeTab, setActiveTab] = useState('home')
  const [gigs, setGigs] = useState([])
  const [gigLoading, setGigLoading] = useState(false)
  const [gigSearchTerm, setGigSearchTerm] = useState('')
  const [gigCategory, setGigCategory] = useState('all')
  const [createGigForm, setCreateGigForm] = useState({
    title: '',
    description: '',
    category: 'design',
    price: '',
    deliveryTime: '3',
    tags: '',
    requirements: ''
  })
  const [createGigLoading, setCreateGigLoading] = useState(false)
  const [talents, setTalents] = useState([])
  const [talentLoading, setTalentLoading] = useState(false)
  const [talentSearchTerm, setTalentSearchTerm] = useState('')
  const [talentSkill, setTalentSkill] = useState('all')
  const [applySellerForm, setApplySellerForm] = useState({
    skills: '',
    experience: '',
    portfolio: '',
    description: '',
    category: 'design'
  })
  const [applySellerLoading, setApplySellerLoading] = useState(false)
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [messageSearchTerm, setMessageSearchTerm] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchGigs = async () => {
    setGigLoading(true)
    try {
      const response = await fetch('/api/gigs')
      const data = await response.json()
      setGigs(data || [])
    } catch (error) {
      console.error('Error fetching gigs:', error)
      setGigs([])
    } finally {
      setGigLoading(false)
    }
  }

  const handleCreateGig = async (e) => {
    e.preventDefault()
    setCreateGigLoading(true)
    try {
      const response = await fetch('/api/gigs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...createGigForm,
          sellerId: session?.user?.id,
          price: parseFloat(createGigForm.price),
          deliveryTime: parseInt(createGigForm.deliveryTime)
        })
      })
      if (response.ok) {
        setAlert({ type: 'success', message: 'Gig created successfully!' })
        setCreateGigForm({
          title: '',
          description: '',
          category: 'design',
          price: '',
          deliveryTime: '3',
          tags: '',
          requirements: ''
        })
      } else {
        setAlert({ type: 'error', message: 'Failed to create gig.' })
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'An error occurred.' })
    } finally {
      setCreateGigLoading(false)
    }
  }

  const fetchTalents = async () => {
    setTalentLoading(true)
    try {
      const response = await fetch('/api/users?type=talent')
      const data = await response.json()
      setTalents(data || [])
    } catch (error) {
      console.error('Error fetching talents:', error)
      setTalents([])
    } finally {
      setTalentLoading(false)
    }
  }

  const handleApplySeller = async (e) => {
    e.preventDefault()
    setApplySellerLoading(true)
    try {
      const response = await fetch('/api/seller-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session?.user?.id,
          ...applySellerForm
        })
      })
      if (response.ok) {
        setAlert({ type: 'success', message: 'Seller application submitted successfully!' })
        setApplySellerForm({
          skills: '',
          experience: '',
          portfolio: '',
          description: '',
          category: 'design'
        })
      } else {
        setAlert({ type: 'error', message: 'Failed to submit application.' })
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'An error occurred.' })
    } finally {
      setApplySellerLoading(false)
    }
  }

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        setAlert({ type: 'success', message: `${product.title} quantity updated in cart!` })
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      setAlert({ type: 'success', message: `${product.title} added to cart!` })
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth' })
  }

  const categories = ['all', 'electronics', 'fashion', 'home', 'books', 'sports']
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category?.toLowerCase() === selectedCategory
    return matchesSearch && matchesCategory
  })

  const renderDashboardContent = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Total Earnings</p>
              <p className="text-2xl font-bold text-white">KES 45,000</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Active Gigs</p>
              <p className="text-2xl font-bold text-white">12</p>
            </div>
            <Briefcase className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Completed Orders</p>
              <p className="text-2xl font-bold text-white">89</p>
            </div>
            <Award className="w-8 h-8 text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Profile Views</p>
              <p className="text-2xl font-bold text-white">1,234</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>
    </div>
  )

  const renderBrowseGigs = () => {
    const categories = ['all', 'design', 'development', 'writing', 'marketing', 'video']
    const filteredGigs = gigs.filter(gig => {
      const matchesSearch = gig.title?.toLowerCase().includes(gigSearchTerm.toLowerCase())
      const matchesCategory = gigCategory === 'all' || gig.category?.toLowerCase() === gigCategory
      return matchesSearch && matchesCategory
    })

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Browse Gigs</h2>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search gigs..."
              value={gigSearchTerm}
              onChange={(e) => setGigSearchTerm(e.target.value)}
              onFocus={() => !gigs.length && fetchGigs()}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setGigCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  gigCategory === category
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {gigLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading gigs...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGigs.map(gig => (
              <div key={gig.id} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-purple-500 transition-colors group">
                <div className="h-48 bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center relative">
                  {gig.image ? (
                    <img src={gig.image} alt={gig.title} className="w-full h-full object-cover" />
                  ) : (
                    <Eye className="w-12 h-12 text-gray-400" />
                  )}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 bg-black/50 hover:bg-black/70 rounded-full">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white text-lg mb-2">{gig.title}</h3>
                  <p className="text-gray-400 text-sm mb-3">{gig.description}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-300">{gig.rating || 5.0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-green-400">KES {gig.price?.toLocaleString() || '5,000'}</span>
                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors">Order Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderAllTalent = () => {
    const skills = ['all', 'design', 'development', 'writing', 'marketing', 'photography']
    const filteredTalents = talents.filter(talent => {
      const matchesSearch = talent.name?.toLowerCase().includes(talentSearchTerm.toLowerCase())
      const matchesSkill = talentSkill === 'all' || talent.skills?.toLowerCase().includes(talentSkill)
      return matchesSearch && matchesSkill
    })

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">All Talent</h2>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search talent..."
              value={talentSearchTerm}
              onChange={(e) => setTalentSearchTerm(e.target.value)}
              onFocus={() => !talents.length && fetchTalents()}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto">
            {skills.map(skill => (
              <button
                key={skill}
                onClick={() => setTalentSkill(skill)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  talentSkill === skill
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {skill.charAt(0).toUpperCase() + skill.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {talentLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading talent...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTalents.map(talent => (
              <div key={talent.id} className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-purple-500 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-white">{talent.name?.[0] || 'T'}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white">{talent.name || 'Talented User'}</h3>
                    <p className="text-gray-400">{talent.title || 'Professional'}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-gray-300 text-sm mb-2">{talent.bio || 'Experienced professional ready to help with your projects.'}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{talent.rating || 4.8}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{talent.completedProjects || 25} projects</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(talent.skills || 'Design, Development').split(',').map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded-full text-xs">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-green-400">
                    KES {talent.hourlyRate?.toLocaleString() || '2,500'}/hr
                  </span>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors">
                      View Profile
                    </button>
                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors">
                      Hire Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderApplySeller = () => {
    const categories = ['design', 'development', 'writing', 'marketing', 'video', 'other']

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Apply to Seller</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Why Become a Seller?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-yellow-400 mt-1" />
                  <div>
                    <h4 className="font-medium">Build Your Reputation</h4>
                    <p className="text-sm text-gray-400">Get reviews and build a strong profile</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-purple-400 mt-1" />
                  <div>
                    <h4 className="font-medium">Earn Money</h4>
                    <p className="text-sm text-gray-400">Set your own prices and earn from your skills</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <UserCheck className="w-5 h-5 text-green-400 mt-1" />
                  <div>
                    <h4 className="font-medium">Global Reach</h4>
                    <p className="text-sm text-gray-400">Connect with clients from around the world</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-6">Application Form</h3>
              
              <form onSubmit={handleApplySeller} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    value={applySellerForm.category}
                    onChange={(e) => setApplySellerForm({...applySellerForm, category: e.target.value})}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Skills</label>
                  <input
                    type="text"
                    placeholder="e.g., Graphic Design, Logo Design, Branding"
                    value={applySellerForm.skills}
                    onChange={(e) => setApplySellerForm({...applySellerForm, skills: e.target.value})}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Experience</label>
                  <textarea
                    placeholder="Describe your professional experience..."
                    value={applySellerForm.experience}
                    onChange={(e) => setApplySellerForm({...applySellerForm, experience: e.target.value})}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white h-24 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Portfolio URL</label>
                  <input
                    type="url"
                    placeholder="https://your-portfolio.com"
                    value={applySellerForm.portfolio}
                    onChange={(e) => setApplySellerForm({...applySellerForm, portfolio: e.target.value})}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    placeholder="Tell us about yourself and why you want to become a seller..."
                    value={applySellerForm.description}
                    onChange={(e) => setApplySellerForm({...applySellerForm, description: e.target.value})}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white h-32 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={applySellerLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {applySellerLoading ? 'Submitting...' : 'Submit Application'}
                  {!applySellerLoading && <UserCheck className="w-5 h-5" />}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderCreateGig = () => {
    const categories = ['design', 'development', 'writing', 'marketing', 'video', 'other']
    const deliveryOptions = [
      { value: '1', label: '1 day' },
      { value: '3', label: '3 days' },
      { value: '7', label: '1 week' },
      { value: '14', label: '2 weeks' },
      { value: '30', label: '1 month' }
    ]

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Create Gig</h2>
        
        <div className="bg-gray-800 rounded-xl p-6">
          <form onSubmit={handleCreateGig} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Gig Title</label>
                <input
                  type="text"
                  placeholder="I will create a professional logo design for your business"
                  value={createGigForm.title}
                  onChange={(e) => setCreateGigForm({...createGigForm, title: e.target.value})}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  value={createGigForm.category}
                  onChange={(e) => setCreateGigForm({...createGigForm, category: e.target.value})}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Price (KES)</label>
                <input
                  type="number"
                  placeholder="5000"
                  value={createGigForm.price}
                  onChange={(e) => setCreateGigForm({...createGigForm, price: e.target.value})}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Delivery Time</label>
                <select
                  value={createGigForm.deliveryTime}
                  onChange={(e) => setCreateGigForm({...createGigForm, deliveryTime: e.target.value})}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  {deliveryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
                <input
                  type="text"
                  placeholder="logo, design, branding, business"
                  value={createGigForm.tags}
                  onChange={(e) => setCreateGigForm({...createGigForm, tags: e.target.value})}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                placeholder="Describe your service in detail..."
                value={createGigForm.description}
                onChange={(e) => setCreateGigForm({...createGigForm, description: e.target.value})}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white h-32 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={createGigLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {createGigLoading ? 'Creating...' : 'Publish Gig'}
              {!createGigLoading && <Plus className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </div>
    )
  }

  const renderMessages = () => {
    const filteredConversations = conversations.filter(conv =>
      conv.otherUser?.name?.toLowerCase().includes(messageSearchTerm.toLowerCase())
    )

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Messages</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-300px)]">
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={messageSearchTerm}
                  onChange={(e) => setMessageSearchTerm(e.target.value)}
                  onFocus={() => !conversations.length && fetchConversations()}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            
            <div className="overflow-y-auto h-full">
              {filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-gray-400">
                  <p>No conversations yet</p>
                </div>
              ) : (
                filteredConversations.map(conversation => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors ${
                      selectedConversation?.id === conversation.id ? 'bg-gray-700' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {conversation.otherUser?.name?.[0] || 'U'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate">
                          {conversation.otherUser?.name || 'Unknown User'}
                        </h3>
                        <p className="text-sm text-gray-400 truncate">
                          {conversation.lastMessage || 'No messages yet'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-2 bg-gray-800 rounded-xl flex flex-col">
            {selectedConversation ? (
              <>
                <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {selectedConversation.otherUser?.name?.[0] || 'U'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        {selectedConversation.otherUser?.name || 'Unknown User'}
                      </h3>
                      <p className="text-sm text-green-400">Online</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map(message => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === session?.user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderId === session?.user?.id
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-700 text-white'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(message.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-4 border-t border-gray-700">
                  <form onSubmit={sendMessage} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="p-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                  <p>Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderSellerDashboard = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Seller Dashboard</h2>
      <div className="text-center py-12">
        <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-300 mb-2">Seller Dashboard</h3>
        <p className="text-gray-400">Manage your gigs and orders</p>
      </div>
    </div>
  )

  const renderReviews = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Reviews</h2>
      <div className="text-center py-12">
        <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-300 mb-2">Reviews</h3>
        <p className="text-gray-400">View and manage reviews</p>
      </div>
    </div>
  )

  const renderStoreContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
          />
        </div>
        
        <button className="relative p-2 bg-purple-600 hover:bg-purple-700 rounded-lg" onClick={() => setShowCart(true)}>
          <ShoppingCart className="w-5 h-5" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </button>
      </div>
      
      <div className="flex gap-2 overflow-x-auto">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading products...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-purple-500 transition-colors group"
            >
              <div className="h-48 bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center relative overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center">
                    <Eye className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button className="p-2 bg-black/50 hover:bg-black/70 rounded-full">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-white text-lg mb-2 line-clamp-2">
                  {product.title}
                </h3>
                
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-300">{product.rating?.toFixed(1) || '0.0'}</span>
                  </div>
                  <span className="text-gray-500 text-sm">({product.reviewCount || 0})</span>
                  <span className="text-gray-500 text-sm">• {product.stock || 0} left</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-400">
                    KES {product.price?.toLocaleString() || '0'}
                  </span>
                  
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return renderStoreContent()
      case 'dashboard':
        return renderDashboardContent()
      case 'browse-gigs':
        return renderBrowseGigs()
      case 'all-talent':
        return renderAllTalent()
      case 'apply-seller':
        return renderApplySeller()
      case 'create-gig':
        return renderCreateGig()
      case 'messages':
        return renderMessages()
      default:
        return renderStoreContent()
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <AdminRedirect />
      
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800 z-40 overflow-y-auto">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-white">{session?.user?.name?.[0] || 'U'}</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">{session?.user?.name || 'User'}</h3>
              <p className="text-sm text-gray-400">{session?.user?.email}</p>
            </div>
          </div>
        </div>
        
        <nav className="p-4 space-y-2 flex-1">
          {[
            { id: 'home', label: 'Home', icon: ShoppingCart },
            { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
            { id: 'browse-gigs', label: 'Browse Gigs', icon: Search },
            { id: 'all-talent', label: 'All Talent', icon: Users },
            { id: 'apply-seller', label: 'Apply to Seller', icon: UserCheck },
            { id: 'create-gig', label: 'Create Gig', icon: Plus },
            { id: 'messages', label: 'Messages', icon: MessageCircle, badge: 3 }
          ].map(item => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
        
        <div className="p-4 space-y-2 border-t border-gray-800">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="ml-64">
        <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  TalentHub
                </span>
                <span className="ml-2">🇰🇪</span>
              </h1>
              
              <div className="flex items-center gap-4">
                <button className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
                </button>
                
                {session?.user?.userType === 'ADMIN' && (
                  <Link href="/admin" className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium">
                    Admin Panel
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {renderContent()}
        </main>
        
        {alert && (
          <Alert 
            type={alert.type} 
            message={alert.message} 
            onClose={() => setAlert(null)} 
          />
        )}
      </div>
    </div>
  )
}