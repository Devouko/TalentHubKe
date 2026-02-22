'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Menu, X, ShoppingCart } from 'lucide-react'
import { useUser } from './context/UserContext'
import { useCart } from './context/CartContext'
import { usePlatformSettings } from '@/hooks/useDynamicSettings'
import CustomCursor from './components/CustomCursor'
import Hero3D from './components/Hero3D'
import CompanyCards3D from './components/CompanyCards3D'
import CategoriesGrid3D from './components/CategoriesGrid3D'
import StatsSection3D from './components/StatsSection3D'
import OfferCarousel from './components/OfferCarousel'

export default function Home() {
  const { data: session } = useSession()
  const { userType } = useUser()
  const { cart } = useCart()
  const platformSettings = usePlatformSettings()
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
    <div className="min-h-screen text-white overflow-x-hidden relative bg-slate-950">
      <CustomCursor />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-slate-950/80 backdrop-blur-xl border-b border-emerald-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-r from-emerald-500 to-teal-500">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold text-white">{platformSettings.platformName}</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/products" className="text-slate-300 hover:text-white transition-colors">
                Products
              </Link>
              <Link href="/browse-gigs" className="text-slate-300 hover:text-white transition-colors">
                Browse Gigs
              </Link>
              <Link href="/all-talent" className="text-slate-300 hover:text-white transition-colors">
                Find Talent
              </Link>
              {session?.user?.userType === 'ADMIN' && (
                <Link href="/admin" className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold">
                  Admin
                </Link>
              )}
            </div>

            <div className="hidden md:flex items-center gap-4">
              {session && (
                <Link href="/checkout" className="relative text-slate-300 hover:text-white transition-colors">
                  <ShoppingCart className="w-6 h-6" />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </Link>
              )}
              {!session ? (
                <>
                  <Link href="/auth" className="text-slate-300 hover:text-white transition-colors">
                    Log In
                  </Link>
                  <Link href="/auth/signup">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg hover:shadow-emerald-500/50 transition-all"
                    >
                      Sign Up
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </Link>
                </>
              ) : (
                <Link href="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-emerald-500/50 transition-all"
                  >
                    Dashboard
                  </motion.button>
                </Link>
              )}
            </div>

            <button 
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden mt-4 p-4 bg-slate-800/90 backdrop-blur-xl rounded-xl border border-emerald-500/20"
            >
              <div className="flex flex-col gap-4">
                <Link href="/products" className="text-slate-300 hover:text-white transition-colors">
                  Products
                </Link>
                <Link href="/browse-gigs" className="text-slate-300 hover:text-white transition-colors">
                  Browse Gigs
                </Link>
                <Link href="/all-talent" className="text-slate-300 hover:text-white transition-colors">
                  Find Talent
                </Link>
                {session && (
                  <Link href="/checkout" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
                    <ShoppingCart className="w-5 h-5" />
                    Cart {cart.length > 0 && `(${cart.length})`}
                  </Link>
                )}
                <div className="border-t border-slate-700 pt-4 flex flex-col gap-2">
                  {!session ? (
                    <>
                      <Link href="/auth" className="w-full text-left text-slate-300 hover:text-white transition-colors">
                        Log In
                      </Link>
                      <Link href="/auth/signup" className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full transition-all text-center">
                        Sign Up
                      </Link>
                    </>
                  ) : (
                    <Link href="/dashboard" className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full transition-all text-center">
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
      <Hero3D heroContent={heroContent} />

      {/* Offer Carousel */}
      <OfferCarousel />

      {/* Partners Section */}
      <CompanyCards3D />

      {/* Categories */}
      <CategoriesGrid3D />

      {/* Stats Section */}
      <StatsSection3D />

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <span className="text-2xl font-bold text-white">{platformSettings.platformName}</span>
              </div>
              <p className="text-slate-400 text-sm">
                The world's premier talent marketplace connecting businesses with top freelancers and agencies.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">For Clients</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li className="hover:text-emerald-400 cursor-pointer transition-colors">Find Freelancers</li>
                <li className="hover:text-emerald-400 cursor-pointer transition-colors">Post a Project</li>
                <li className="hover:text-emerald-400 cursor-pointer transition-colors">How It Works</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">For Freelancers</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li className="hover:text-emerald-400 cursor-pointer transition-colors">Find Work</li>
                <li className="hover:text-emerald-400 cursor-pointer transition-colors">Create Profile</li>
                <li className="hover:text-emerald-400 cursor-pointer transition-colors">Success Stories</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li className="hover:text-emerald-400 cursor-pointer transition-colors">About Us</li>
                <li className="hover:text-emerald-400 cursor-pointer transition-colors">Careers</li>
                <li className="hover:text-emerald-400 cursor-pointer transition-colors">Contact</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-center text-slate-400 text-sm">
            © 2025 {platformSettings.platformName}. All rights reserved. Built with ❤️ in Kenya
          </div>
        </div>
      </footer>
    </div>
  )
}
