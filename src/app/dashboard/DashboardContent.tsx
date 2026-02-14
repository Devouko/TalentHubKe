'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'motion/react'
import { ShoppingCart, Search, Star, Plus, Heart, Eye, Trash2, X, MessageCircle, Users, Briefcase, Award, TrendingUp, DollarSign, Bell, Settings, LogOut, Palette, UserCheck, Sun, Moon, Package, User, Edit } from 'lucide-react'
import { AdminRedirect } from '@/components/AdminRedirect'
import Alert from '../../components/ui/Alert'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import Image from 'next/image'

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
  const [activeTab, setActiveTab] = useState('all-talent')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [gigs, setGigs] = useState([])
  const [gigLoading, setGigLoading] = useState(false)
  const [gigSearchTerm, setGigSearchTerm] = useState('')
  const [gigCategory, setGigCategory] = useState('all')
  const [createGigForm, setCreateGigForm] = useState({
    title: '',
    description: '',
    category: 'Accounts',
    price: '',
    deliveryTime: '3',
    tags: '',
    requirements: ''
  })
  const [createGigLoading, setCreateGigLoading] = useState(false)
  const [talents, setTalents] = useState([])
  const [talentLoading, setTalentLoading] = useState(false)
  const [talentSearchTerm, setTalentSearchTerm] = useState('')
  const [talentSkill, setTalentSkill] = useState('All')
  const [applySellerForm, setApplySellerForm] = useState({
    skills: '',
    experience: '',
    portfolio: '',
    description: '',
    category: 'Accounts'
  })
  const [applySellerLoading, setApplySellerLoading] = useState(false)
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [messageSearchTerm, setMessageSearchTerm] = useState('')
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations')
      const data = await response.json()
      setConversations(data || [])
    } catch (error) {
      console.error('Error fetching conversations:', error)
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return
    
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConversation.id,
          content: newMessage,
          senderId: session?.user?.id
        })
      })
      if (response.ok) {
        setNewMessage('')
        // Refresh messages
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    if (activeTab === 'home') {
      fetchProducts()
    }
  }, [activeTab])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products')
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
      setAlert({ type: 'error', message: 'Failed to load products' })
    } finally {
      setLoading(false)
    }
  }

  /**
   * Fetches gigs from the API
   * Uses proper error handling and loading states
   */
  const fetchGigs = async () => {
    setGigLoading(true)
    try {
      const response = await fetch('/api/gigs')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setGigs(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching gigs:', error)
      setGigs([])
      setAlert({ type: 'error', message: 'Failed to load gigs. Please try again.' })
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
          category: 'Accounts',
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
          businessName: applySellerForm.businessName || 'Individual Freelancer',
          skills: applySellerForm.skills,
          experience: applySellerForm.experience,
          portfolio: applySellerForm.portfolio,
          description: applySellerForm.description
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setAlert({ type: 'success', message: 'Seller application submitted successfully!' })
        setApplySellerForm({
          skills: '',
          experience: '',
          portfolio: '',
          description: '',
          category: 'Accounts'
        })
      } else {
        setAlert({ type: 'error', message: data.error || 'Failed to submit application.' })
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'An error occurred while submitting your application.' })
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

  const categories = ['all', 'Accounts', 'Digital-products', 'Proxies', 'Bulk_Gmails', 'KYC']
  
  const filteredProducts = Array.isArray(products) ? products.filter(product => {
    const matchesSearch = product.title?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category?.toLowerCase() === selectedCategory
    return matchesSearch && matchesCategory
  }) : []

  const renderDashboardContent = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-emerald-500 to-teal-500 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100">Total Earnings</p>
              <p className="text-2xl font-bold text-white">KES 45,000</p>
            </div>
            <DollarSign className="w-8 h-8 text-emerald-200" />
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-500 to-cyan-500 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Active Gigs</p>
              <p className="text-2xl font-bold text-white">12</p>
            </div>
            <Briefcase className="w-8 h-8 text-blue-200" />
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-emerald-500 to-teal-500 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100">Completed Orders</p>
              <p className="text-2xl font-bold text-white">89</p>
            </div>
            <Award className="w-8 h-8 text-emerald-200" />
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Profile Views</p>
              <p className="text-2xl font-bold text-white">1,234</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-200" />
          </div>
        </motion.div>
      </div>
    </div>
  )

  const renderBrowseGigs = () => {
    const categories = ['all', 'Accounts', 'Digital-products', 'Proxies', 'Bulk_Gmails', 'KYC']
    const filteredGigs = Array.isArray(gigs) ? gigs.filter(gig => {
      const matchesSearch = gig.title?.toLowerCase().includes(gigSearchTerm.toLowerCase())
      const matchesCategory = gigCategory === 'all' || gig.category?.toLowerCase() === gigCategory
      return matchesSearch && matchesCategory
    }) : []

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
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setGigCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  gigCategory === category
                    ? 'bg-emerald-600 text-white'
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading gigs...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGigs.map(gig => (
              <div key={gig.id} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-emerald-500 transition-colors group">
                <div className="h-48 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 flex items-center justify-center relative">
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
                    <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm font-medium transition-colors">Order Now</button>
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
    const skills = ['All', 'Design', 'Development', 'Writing', 'Marketing', 'Photography']
    const filteredTalents = Array.isArray(talents) ? talents.filter(talent => {
      const matchesSearch = talent.name?.toLowerCase().includes(talentSearchTerm.toLowerCase())
      const matchesSkill = talentSkill === 'All' || talent.skills?.toLowerCase().includes(talentSkill.toLowerCase())
      return matchesSearch && matchesSkill
    }) : []

    // Mock data if no talents
    const displayTalents = filteredTalents.length > 0 ? filteredTalents : [
      { id: 1, name: 'peter', email: 'peter@example.com', title: 'Professional', bio: 'Experienced professional ready to help with your projects.', rating: 4.8, completedProjects: 25, skills: 'Design, Development', hourlyRate: 2500, available: true },
      { id: 2, name: 'v675373@gmail.com', email: 'v675373@gmail.com', title: 'Professional', bio: 'Experienced professional ready to help with your projects.', rating: 4.8, completedProjects: 25, skills: 'Design, Development', hourlyRate: 2500, available: true },
      { id: 3, name: 'jane', email: 'jane@example.com', title: 'Professional', bio: 'Experienced professional ready to help with your projects.', rating: 4.8, completedProjects: 25, skills: 'Design, Development', hourlyRate: 2500, available: true },
      { id: 4, name: 'james', email: 'james@example.com', title: 'Professional', bio: 'Experienced professional ready to help with your projects.', rating: 4.8, completedProjects: 25, skills: 'Design, Development', hourlyRate: 2500, available: true }
    ]

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder="Search talent..."
              value={talentSearchTerm}
              onChange={(e) => setTalentSearchTerm(e.target.value)}
              onFocus={() => !talents.length && fetchTalents()}
              className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                isDarkMode 
                  ? 'bg-slate-800/50 backdrop-blur-xl border-slate-700/50 text-white placeholder-gray-400'
                  : 'bg-white/70 backdrop-blur-xl border-gray-200 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
            {skills.map(skill => (
              <button
                key={skill}
                onClick={() => setTalentSkill(skill)}
                className={`px-6 py-3 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  talentSkill === skill
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/50'
                    : isDarkMode
                    ? 'bg-slate-800/50 backdrop-blur-xl text-gray-300 hover:bg-slate-700/50 border border-slate-700/50'
                    : 'bg-white/70 backdrop-blur-xl text-gray-700 hover:bg-white border border-gray-200'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {talentLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
            <p className={`mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading talent...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayTalents.map(talent => (
              <motion.div
                key={talent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl p-6 border-2 transition-all hover:shadow-xl ${
                  isDarkMode
                    ? 'bg-slate-800/50 backdrop-blur-xl border-slate-700/50 hover:border-emerald-500/50'
                    : 'bg-white/70 backdrop-blur-xl border-gray-200 hover:border-emerald-500/50 shadow-lg'
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {talent.name?.[0]?.toUpperCase() || 'T'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-xl font-semibold mb-1 truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {talent.name || 'Talented User'}
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {talent.title || 'Professional'}
                    </p>
                  </div>
                </div>
                
                <p className={`text-sm mb-4 line-clamp-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {talent.bio || 'Experienced professional ready to help with your projects.'}
                </p>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {talent.rating || 4.8}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {talent.completedProjects || 25} projects
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {(talent.skills || 'Design, Development').split(',').slice(0, 2).map((skill, index) => (
                    <span 
                      key={index} 
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isDarkMode
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}">
                  <div>
                    <span className="text-2xl font-bold text-emerald-500">
                      KES {talent.hourlyRate?.toLocaleString() || '2,500'}
                    </span>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>/hr</span>
                    {talent.available && (
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-emerald-500 font-medium">Available</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link 
                      href={`/profile/${talent.id}`}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        isDarkMode
                          ? 'bg-slate-700/50 hover:bg-slate-600/50 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      View Profile
                    </Link>
                    <Link
                      href={`/hire/${talent.id}`}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-emerald-500/30"
                    >
                      Hire Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderApplySeller = () => {
    const categories = ['Accounts', 'Digital-products', 'Proxies', 'Bulk_Gmails', 'KYC', 'other']

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
                  <Award className="w-5 h-5 text-emerald-400 mt-1" />
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
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Experience</label>
                  <textarea
                    placeholder="Describe your professional experience..."
                    value={applySellerForm.experience}
                    onChange={(e) => setApplySellerForm({...applySellerForm, experience: e.target.value})}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white h-24 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    placeholder="Tell us about yourself and why you want to become a seller..."
                    value={applySellerForm.description}
                    onChange={(e) => setApplySellerForm({...applySellerForm, description: e.target.value})}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white h-32 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={applySellerLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
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
    const categories = ['Accounts', 'Digital-products', 'Proxies', 'Bulk_Gmails', 'KYC', 'other']
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
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  value={createGigForm.category}
                  onChange={(e) => setCreateGigForm({...createGigForm, category: e.target.value})}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Delivery Time</label>
                <select
                  value={createGigForm.deliveryTime}
                  onChange={(e) => setCreateGigForm({...createGigForm, deliveryTime: e.target.value})}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                placeholder="Describe your service in detail..."
                value={createGigForm.description}
                onChange={(e) => setCreateGigForm({...createGigForm, description: e.target.value})}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white h-32 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={createGigLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
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
    const filteredConversations = Array.isArray(conversations) ? conversations.filter(conv =>
      conv.otherUser?.name?.toLowerCase().includes(messageSearchTerm.toLowerCase())
    ) : []

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
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                      <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
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
                    <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
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
                              ? 'bg-emerald-600 text-white'
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
                      className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="p-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg transition-colors"
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
            className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64"
          />
        </div>
        
        <button className="relative p-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg" onClick={() => setShowCart(true)}>
          <ShoppingCart className="w-5 h-5" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-teal-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
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
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading products...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-emerald-500 transition-colors group"
            >
              <div className="h-48 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 flex items-center justify-center relative overflow-hidden">
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
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
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
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50'
    }`}>
      <AdminRedirect />
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 border-r transition-all duration-300 z-40 overflow-y-auto ${
        isDarkMode
          ? 'bg-slate-900/50 backdrop-blur-xl border-slate-800/50'
          : 'bg-white/70 backdrop-blur-xl border-gray-200/50 shadow-xl'
      }`}>
        <div className="p-6 border-b ${isDarkMode ? 'border-slate-800/50' : 'border-gray-200/50'}">
          <h1 className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              TalentHub
            </span>
            <span className="ml-2">🇰🇪</span>
          </h1>
        </div>
        
        <nav className="p-4 space-y-2 flex-1">
          {[
            { id: 'home', label: 'Shop', icon: ShoppingCart },
            { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
            { id: 'browse-gigs', label: 'Browse Gigs', icon: Search },
            { id: 'all-talent', label: 'All Talent', icon: Users },
            { id: 'apply-seller', label: 'Apply to Seller', icon: UserCheck },
            { id: 'create-gig', label: 'Create Gig', icon: Plus },
            { id: 'my-products', label: 'My Products', icon: Package },
            { id: 'messages', label: 'Messages', icon: MessageCircle, badge: 3 },
            { id: 'applications', label: 'Applications', icon: Briefcase }
          ].map(item => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  activeTab === item.id
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : isDarkMode
                    ? 'text-gray-300 hover:bg-slate-800/50'
                    : 'text-gray-700 hover:bg-gray-100/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="flex-1 font-medium">{item.label}</span>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="ml-64">
        <header className={`sticky top-0 z-30 border-b transition-all duration-300 ${
          isDarkMode
            ? 'bg-slate-900/50 backdrop-blur-xl border-slate-800/50'
            : 'bg-white/70 backdrop-blur-xl border-gray-200/50 shadow-sm'
        }`}>
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-end gap-4">
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-3 rounded-xl transition-all ${
                  isDarkMode
                    ? 'bg-slate-800/50 hover:bg-slate-700/50 text-yellow-400'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <button className={`relative p-3 rounded-xl transition-all ${
                isDarkMode
                  ? 'bg-slate-800/50 hover:bg-slate-700/50'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}>
                <Bell className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">3</span>
              </button>
              
              {session?.user?.userType === 'ADMIN' && (
                <Link href="/admin" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-emerald-500/30">
                  Admin Panel
                </Link>
              )}

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-all"
                >
                  {session?.user?.profileImage ? (
                    <Image
                      src={session.user.profileImage}
                      alt={session.user.name || 'User'}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                      {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="text-left hidden md:block">
                    <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {session?.user?.name || 'User'}
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {session?.user?.email}
                    </p>
                  </div>
                </button>

                {showProfileDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`absolute right-0 mt-2 w-64 rounded-xl shadow-xl border overflow-hidden z-50 ${
                      isDarkMode
                        ? 'bg-slate-800/95 backdrop-blur-xl border-slate-700'
                        : 'bg-white/95 backdrop-blur-xl border-gray-200'
                    }`}
                  >
                    <div className="p-4 border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}">
                      <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {session?.user?.name}
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {session?.user?.email}
                      </p>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/profile/edit"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          isDarkMode
                            ? 'hover:bg-slate-700/50 text-gray-300'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </Link>
                      <Link
                        href="/settings"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          isDarkMode
                            ? 'hover:bg-slate-700/50 text-gray-300'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          isDarkMode
                            ? 'hover:bg-red-500/10 text-red-400'
                            : 'hover:bg-red-50 text-red-600'
                        }`}
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
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
