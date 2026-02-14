'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Search, Code, Layers, DollarSign, 
  Users, CheckCircle, Star, Brain, Award, LineChart, Sparkles,
  Shield, FileText, Languages, Lock, BadgeCheck, Scale, CreditCard,
  TrendingUp, Briefcase, Play, ArrowRight, Menu, X
} from 'lucide-react'
import { useUser } from './context/UserContext'

const categories = [
  { icon: Code, name: 'Programming & Tech', count: '12,345', gradient: 'from-emerald-500 to-teal-500' },
  { icon: Layers, name: 'Design & Creative', count: '8,901', gradient: 'from-pink-500 to-purple-500' },
  { icon: FileText, name: 'Writing & Content', count: '6,543', gradient: 'from-yellow-500 to-orange-500' },
  { icon: TrendingUp, name: 'Digital Marketing', count: '5,432', gradient: 'from-orange-500 to-red-500' },
  { icon: Play, name: 'Video & Animation', count: '4,321', gradient: 'from-red-500 to-pink-500' },
  { icon: Brain, name: 'AI & Data Science', count: '3,210', gradient: 'from-emerald-500 to-teal-500' },
  { icon: Briefcase, name: 'Business & Consulting', count: '2,987', gradient: 'from-emerald-500 to-teal-500' },
  { icon: LineChart, name: 'Finance & Accounting', count: '1,876', gradient: 'from-yellow-500 to-orange-500' }
]

const partners = [
  { name: 'Safaricom', logo: '📱' },
  { name: 'Equity Bank', logo: '🏦' },
  { name: 'KCB', logo: '💳' },
  { name: 'Airtel', logo: '📡' },
  { name: 'NCBA', logo: '🏛️' },
  { name: 'Co-op Bank', logo: '🤝' },
  { name: 'Absa', logo: '💼' },
  { name: 'Standard Chartered', logo: '🌟' }
]

export default function Home() {
  const { data: session } = useSession()
  const { userType } = useUser()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const getHeroContent = () => {
    if (!mounted || !session) {
      return {
        title: 'Talent Marketplace that developers love',
        description: 'Connect with world-class talent • AI-powered matching • Secure payments • Instant delivery',
        cta1: { text: 'Get Started', href: '/auth/signup' },
        cta2: { text: 'Browse Talent', href: '/browse-gigs' }
      }
    }
    
    const content = {
      client: {
        title: 'Find World-Class Talent for Any Project',
        description: 'AI-powered matching • Secure payments • 24/7 support',
        cta1: { text: 'Post a Project', href: '/create-gig' },
        cta2: { text: 'Browse Talent', href: '/browse-gigs' }
      },
      freelancer: {
        title: 'Showcase Your Skills, Grow Your Business',
        description: 'Premium tools • Global clients • Instant payments',
        cta1: { text: 'Create Gig', href: '/create-gig' },
        cta2: { text: 'Browse Projects', href: '/browse-gigs' }
      },
      agency: {
        title: 'Scale Your Agency with Enterprise Tools',
        description: 'Team management • White-label solutions • Advanced analytics',
        cta1: { text: 'Get Started', href: '/dashboard' },
        cta2: { text: 'View Features', href: '/browse-gigs' }
      }
    }
    return content[userType] || content.client
  }

  if (!mounted) return null

  const heroContent = getHeroContent()

  return (
    <div className="min-h-screen text-slate-900 dark:text-white overflow-x-hidden relative bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-r from-emerald-500 to-teal-500">
                <span className="text-slate-900 dark:text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold">TalentHub</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/products" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                Products
              </Link>
              <Link href="/browse-gigs" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                Browse Gigs
              </Link>
              <Link href="/all-talent" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                Find Talent
              </Link>
              {session?.user?.userType === 'ADMIN' && (
                <Link href="/admin" className="text-emerald-500 hover:text-emerald-600 transition-colors font-semibold">
                  Admin
                </Link>
              )}
            </div>

            <div className="hidden md:flex items-center gap-4">
              {!session ? (
                <>
                  <Link href="/auth" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                    Log In
                  </Link>
                  <Link href="/auth/signup" className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-all hover:shadow-lg">
                    Sign Up
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </>
              ) : (
                <Link href="/dashboard" className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full transition-all hover:shadow-lg">
                  Dashboard
                </Link>
              )}
            </div>

            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden mt-4 p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl border border-slate-200 dark:border-slate-700"
            >
              <div className="flex flex-col gap-4">
                <Link href="/products" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Products
                </Link>
                <Link href="/browse-gigs" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Browse Gigs
                </Link>
                <Link href="/all-talent" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Find Talent
                </Link>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-4 flex flex-col gap-2">
                  {!session ? (
                    <>
                      <Link href="/auth" className="w-full text-left text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                        Log In
                      </Link>
                      <Link href="/auth/signup" className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full transition-all">
                        Sign Up
                      </Link>
                    </>
                  ) : (
                    <Link href="/dashboard" className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full transition-all">
                      Dashboard
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden min-h-[80vh] flex items-center">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)] animate-pulse"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-full mb-8"
            >
              ⭐ Top Rated Marketplace 2025
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                {heroContent.title}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              {heroContent.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Link href={heroContent.cta1.href}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-full font-semibold text-lg transition-all shadow-lg"
                >
                  {heroContent.cta1.text}
                </motion.button>
              </Link>
              <Link href={heroContent.cta2?.href || '/browse-gigs'}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-full font-semibold text-lg transition-all"
                >
                  {heroContent.cta2?.text || 'Browse Gigs'}
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 px-6 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center">
            {partners.map((partner, i) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center gap-2 p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-xl hover:border-slate-300 dark:hover:border-slate-600 transition-all group"
              >
                <div className="text-2xl group-hover:scale-110 transition-transform">
                  {partner.logo}
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                  {partner.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Explore <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Categories</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Discover talented professionals across various industries and skill sets
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-2xl cursor-pointer group transition-all duration-300 shadow-sm hover:shadow-lg"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${cat.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <cat.icon className="w-8 h-8 text-slate-900 dark:text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{cat.name}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{cat.count} active professionals</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { icon: Users, label: 'Active Freelancers', value: '2.5', suffix: 'M+' },
              { icon: CheckCircle, label: 'Projects Completed', value: '10', suffix: 'M+' },
              { icon: DollarSign, label: 'Total Earnings', value: '5', suffix: 'B+' },
              { icon: Star, label: 'Average Rating', value: '4.9', suffix: '/5' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-lg transition-all"
              >
                <stat.icon className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <div className="text-4xl font-bold mb-2">
                  <span>{stat.value}</span>
                  <span>{stat.suffix}</span>
                </div>
                <div className="text-slate-600 dark:text-slate-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <span className="text-slate-900 dark:text-white font-bold text-sm">T</span>
                </div>
                <span className="text-2xl font-bold">TalentHub</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                The world's premier talent marketplace connecting businesses with top freelancers and agencies.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Clients</h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-sm">
                <li className="hover:text-emerald-500 cursor-pointer transition-colors">Find Freelancers</li>
                <li className="hover:text-emerald-500 cursor-pointer transition-colors">Post a Project</li>
                <li className="hover:text-emerald-500 cursor-pointer transition-colors">How It Works</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Freelancers</h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-sm">
                <li className="hover:text-emerald-500 cursor-pointer transition-colors">Find Work</li>
                <li className="hover:text-emerald-500 cursor-pointer transition-colors">Create Profile</li>
                <li className="hover:text-emerald-500 cursor-pointer transition-colors">Success Stories</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-sm">
                <li className="hover:text-emerald-500 cursor-pointer transition-colors">About Us</li>
                <li className="hover:text-emerald-500 cursor-pointer transition-colors">Careers</li>
                <li className="hover:text-emerald-500 cursor-pointer transition-colors">Contact</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-600 dark:text-slate-400 text-sm">
            © 2025 TalentHub. All rights reserved. Built with ❤️ in Kenya
          </div>
        </div>
      </footer>
    </div>
  )
}