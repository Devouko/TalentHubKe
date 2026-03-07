'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Menu, X, Zap, Shield, Globe, Sparkles, Network } from 'lucide-react'

// Enhanced animated background paths inspired by 21st.dev
function BackgroundPaths() {
  const paths = useMemo(() => {
    const generatePath = (index: number) => {
      const startX = (index % 4) * 25 + Math.random() * 10
      const startY = Math.floor(index / 4) * 25 + Math.random() * 10
      const cp1X = startX + 20 + Math.random() * 30
      const cp1Y = startY + Math.random() * 40 - 20
      const cp2X = startX + 40 + Math.random() * 20
      const cp2Y = startY + Math.random() * 40 - 20
      const endX = startX + 60 + Math.random() * 20
      const endY = startY + Math.random() * 30 - 15
      
      return {
        id: index,
        d: `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`,
        duration: 15 + Math.random() * 25,
        delay: Math.random() * 8,
        strokeWidth: 0.08 + Math.random() * 0.12,
        opacity: 0.15 + Math.random() * 0.25
      }
    }
    
    return Array.from({ length: 36 }, (_, i) => generatePath(i))
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="gradient-orange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#fb923c" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#fdba74" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="gradient-purple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#c084fc" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        
        {paths.map((path, index) => {
          const gradientId = index % 3 === 0 ? 'gradient-blue' : index % 3 === 1 ? 'gradient-orange' : 'gradient-purple'
          
          return (
            <motion.path
              key={path.id}
              d={path.d}
              stroke={`url(#${gradientId})`}
              strokeWidth={path.strokeWidth}
              fill="none"
              strokeLinecap="round"
              initial={{ 
                pathLength: 0, 
                opacity: 0,
                pathOffset: 0
              }}
              animate={{ 
                pathLength: [0, 1, 1, 0],
                opacity: [0, path.opacity, path.opacity, 0],
                pathOffset: [0, 0, 1, 1]
              }}
              transition={{
                duration: path.duration,
                repeat: Infinity,
                delay: path.delay,
                ease: "easeInOut",
                times: [0, 0.3, 0.7, 1]
              }}
            />
          )
        })}
        
        {/* Mirrored paths for symmetry */}
        {paths.slice(0, 18).map((path, index) => {
          const mirroredD = path.d.replace(/M (\d+\.?\d*)/g, (match, x) => `M ${100 - parseFloat(x)}`)
            .replace(/C (\d+\.?\d*) (\d+\.?\d*), (\d+\.?\d*) (\d+\.?\d*), (\d+\.?\d*) (\d+\.?\d*)/g, 
              (match, x1, y1, x2, y2, x3, y3) => 
                `C ${100 - parseFloat(x1)} ${y1}, ${100 - parseFloat(x2)} ${y2}, ${100 - parseFloat(x3)} ${y3}`)
          
          const gradientId = index % 2 === 0 ? 'gradient-blue' : 'gradient-purple'
          
          return (
            <motion.path
              key={`mirror-${path.id}`}
              d={mirroredD}
              stroke={`url(#${gradientId})`}
              strokeWidth={path.strokeWidth * 0.8}
              fill="none"
              strokeLinecap="round"
              initial={{ 
                pathLength: 0, 
                opacity: 0 
              }}
              animate={{ 
                pathLength: [0, 1, 1, 0],
                opacity: [0, path.opacity * 0.6, path.opacity * 0.6, 0]
              }}
              transition={{
                duration: path.duration * 1.2,
                repeat: Infinity,
                delay: path.delay + 2,
                ease: "easeInOut",
                times: [0, 0.3, 0.7, 1]
              }}
            />
          )
        })}
      </svg>
      
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white pointer-events-none" />
    </div>
  )
}

function Logo() {
  return (
    <div className="flex items-center gap-2 group">
      <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform overflow-hidden">
        <div className="absolute inset-0 bg-orange-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-none stroke-current stroke-2">
          <circle cx="12" cy="12" r="3" />
          <circle cx="12" cy="4" r="2" />
          <circle cx="4" cy="20" r="2" />
          <circle cx="20" cy="20" r="2" />
          <path d="M12 6v3M5.5 18.5l2.5-2.5M18.5 18.5l-2.5-2.5" />
        </svg>
      </div>
      <span className="text-xl font-black tracking-tight text-slate-900 italic">
        Talanta<span className="text-blue-600">Hub</span>
      </span>
    </div>
  )
}

export default function Home() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      setShowScrollTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 text-slate-900 selection:bg-blue-100 selection:text-blue-900 font-sans antialiased overflow-x-hidden relative">
      <BackgroundPaths />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/70 backdrop-blur-xl border-b border-slate-200/50 shadow-lg shadow-slate-900/5 py-3' 
          : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="relative z-10">
            <Logo />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {['Services', 'Opportunities', 'Success Stories'].map((item) => (
              <Link 
                key={item}
                href={`/${item.toLowerCase().replace(' ', '-')}`} 
                className="relative text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <Link 
                href="/dashboard"
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-slate-900 to-slate-700 text-white text-sm font-black hover:from-blue-600 hover:to-blue-500 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 hover:scale-105"
              >
                Go to Hub
              </Link>
            ) : (
              <>
                <Link href="/auth" className="text-sm font-black text-slate-900 hover:text-blue-600 px-4 uppercase tracking-widest transition-colors">
                  Hub Login
                </Link>
                <Link 
                  href="/auth/signup"
                  className="px-8 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-black hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 hover:scale-105"
                >
                  Join TalantaHub
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200 mt-4 pt-4 bg-white/95 backdrop-blur-xl"
          >
            <div className="flex flex-col gap-4 px-6 pb-6">
              {['Services', 'Opportunities', 'Success Stories'].map((item) => (
                <Link 
                  key={item}
                  href={`/${item.toLowerCase().replace(' ', '-')}`} 
                  className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
              
              <div className="flex flex-col gap-3 pt-4 border-t border-slate-200">
                {session ? (
                  <Link 
                    href="/dashboard"
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-slate-900 to-slate-700 text-white text-sm font-black hover:from-blue-600 hover:to-blue-500 transition-all shadow-xl text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Go to Hub
                  </Link>
                ) : (
                  <>
                    <Link 
                      href="/auth" 
                      className="text-sm font-black text-slate-900 hover:text-blue-600 px-4 uppercase tracking-widest text-center py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Hub Login
                    </Link>
                    <Link 
                      href="/auth/signup"
                      className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-black hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg shadow-blue-500/30 text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Join TalantaHub
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span 
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-blue-50 to-orange-50 text-blue-700 text-[10px] font-black tracking-[0.2em] uppercase mb-8 border border-blue-200/50 shadow-sm backdrop-blur-sm"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Sparkles className="w-3 h-3 text-orange-500 fill-current animate-pulse" />
              Talent Meets Opportunity
            </motion.span>
            
            <motion.h1 
              className="text-6xl lg:text-[10rem] font-black text-slate-900 tracking-tighter mb-8 leading-[0.8]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              CONNECT <br />
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-400 to-orange-500 animate-gradient">
                  THE HUB.
                </span>
                <motion.span
                  className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-blue-400/20 to-orange-500/20 blur-2xl -z-10"
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </span>
            </motion.h1>
            
            <motion.p 
              className="max-w-xl mx-auto text-lg lg:text-xl text-slate-600 mb-12 leading-relaxed font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              The professional network for the next generation of global talent. 
              Find work, build connections, and scale your career.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <Link 
                href="/browse-gigs"
                className="group w-full sm:w-auto px-10 py-5 rounded-full bg-gradient-to-r from-slate-900 to-slate-700 text-white font-black flex items-center justify-center gap-3 hover:from-blue-600 hover:to-blue-500 transition-all shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-1 hover:scale-105"
              >
                Find Talent
                <Network className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
              </Link>
              <Link 
                href="/auth/signup"
                className="w-full sm:w-auto px-10 py-5 rounded-full bg-white/80 backdrop-blur-sm text-slate-900 border-2 border-slate-200 font-black hover:border-orange-500 hover:bg-white transition-all flex items-center justify-center gap-3 group shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-105"
              >
                Join the Hub
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-6xl font-black mb-4 tracking-tight">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500">TalantaHub</span>
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Built for the modern workforce with cutting-edge technology and security
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Vetted Network",
                desc: "Every member of the hub is verified to ensure professional quality and security across all interactions.",
                color: "blue",
                gradient: "from-blue-500 to-blue-600"
              },
              {
                icon: Zap,
                title: "Creative Sparks",
                desc: "Our AI-powered engine identifies unique skill combinations to spark innovation in every project.",
                color: "orange",
                gradient: "from-orange-500 to-orange-600"
              },
              {
                icon: Globe,
                title: "Global Reach",
                desc: "Scale your talent search across continents with unified payment processing and compliance.",
                color: "blue",
                gradient: "from-blue-500 to-purple-600"
              }
            ].map((feat, i) => (
              <motion.div 
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative p-10 rounded-[2.5rem] bg-white/60 backdrop-blur-sm hover:bg-white border border-slate-200/50 hover:border-slate-300/50 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] transition-all duration-500 group overflow-hidden"
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 text-white`}>
                  <feat.icon className="w-8 h-8" />
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feat.gradient} blur-xl opacity-50 group-hover:opacity-75 transition-opacity`} />
                </div>
                
                <h3 className="relative text-2xl font-black mb-4 tracking-tight">{feat.title}</h3>
                <p className="relative text-slate-600 leading-relaxed font-medium">{feat.desc}</p>
                
                {/* Decorative corner */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-slate-100 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 lg:py-32 relative bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl lg:text-6xl font-black mb-4 tracking-tight">
              How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500">Works</span>
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Get started in minutes with our simple three-step process
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12 relative">
            {/* Connection line */}
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-orange-500 to-blue-600 opacity-20" />
            
            {[
              {
                step: '01',
                title: 'Create Your Profile',
                description: 'Sign up and showcase your skills, experience, and portfolio. Our AI helps optimize your profile for maximum visibility.',
                icon: '👤'
              },
              {
                step: '02',
                title: 'Connect & Collaborate',
                description: 'Browse opportunities or post your project. Our smart matching algorithm connects you with the perfect fit.',
                icon: '🤝'
              },
              {
                step: '03',
                title: 'Get Paid Securely',
                description: 'Work with confidence using our escrow system. Payments are protected and released when milestones are met.',
                icon: '💰'
              }
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative"
              >
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-orange-500 text-white text-4xl mb-6 shadow-xl shadow-blue-500/20 relative">
                    <span className="relative z-10">{item.icon}</span>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600 to-orange-500 blur-xl opacity-50 animate-pulse-glow" />
                  </div>
                  
                  <div className="text-6xl font-black text-slate-200 mb-4">{item.step}</div>
                  <h3 className="text-2xl font-black mb-4 tracking-tight">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed font-medium">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="py-16 bg-white border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8">
              Trusted by Leading Companies
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-center"
              >
                <div className="w-32 h-16 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xs hover:bg-slate-200 transition-colors">
                  COMPANY {i}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-orange-500 opacity-95" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-6xl font-black text-white mb-4 tracking-tight">
              Trusted by Thousands
            </h2>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Join a thriving community of professionals making an impact
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '50K+', label: 'Active Talents' },
              { value: '10K+', label: 'Projects Completed' },
              { value: '95%', label: 'Success Rate' },
              { value: '150+', label: 'Countries' }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl lg:text-7xl font-black text-white mb-2 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-blue-100 font-bold uppercase tracking-widest text-xs">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-6xl font-black mb-4 tracking-tight">
              Success <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500">Stories</span>
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Real experiences from professionals who found their perfect match
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                quote: "TalantaHub connected me with clients I never thought I'd reach. The platform is intuitive and the payment system is seamless.",
                author: "Sarah Chen",
                role: "UI/UX Designer",
                avatar: "SC"
              },
              {
                quote: "Finding quality developers was always a challenge. TalantaHub's vetting process saved us countless hours and delivered exceptional talent.",
                author: "Michael Rodriguez",
                role: "Tech Lead, StartupCo",
                avatar: "MR"
              },
              {
                quote: "The escrow system gives me peace of mind. I know I'll get paid for my work, and clients know they're protected too.",
                author: "Amara Okafor",
                role: "Full-Stack Developer",
                avatar: "AO"
              }
            ].map((testimonial, i) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative p-8 rounded-3xl bg-white/60 backdrop-blur-sm border border-slate-200/50 hover:border-slate-300/50 hover:shadow-xl transition-all duration-500 group"
              >
                <div className="absolute top-6 left-6 text-6xl text-blue-600/10 font-black">"</div>
                
                <p className="text-slate-700 leading-relaxed mb-6 relative z-10 font-medium">
                  {testimonial.quote}
                </p>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-orange-500 flex items-center justify-center text-white font-black text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-black text-slate-900">{testimonial.author}</div>
                    <div className="text-sm text-slate-500 font-medium">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-slate-300 mb-12 leading-relaxed max-w-2xl mx-auto">
              Join thousands of professionals who are already building their future on TalantaHub
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                href="/auth/signup"
                className="group w-full sm:w-auto px-12 py-6 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-black text-lg flex items-center justify-center gap-3 hover:from-blue-500 hover:to-blue-400 transition-all shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 hover:scale-105"
              >
                Get Started Free
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link 
                href="/browse-gigs"
                className="w-full sm:w-auto px-12 py-6 rounded-full bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 font-black text-lg hover:bg-white/20 hover:border-white/30 transition-all flex items-center justify-center gap-3 group"
              >
                Explore Opportunities
                <Network className="w-6 h-6 group-hover:rotate-45 transition-transform duration-300" />
              </Link>
            </div>
            
            <p className="mt-8 text-sm text-slate-400 font-medium">
              No credit card required • Free to join • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-5 gap-12 mb-16">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <Logo />
              </div>
              <p className="text-slate-400 leading-relaxed mb-6 font-medium">
                The professional network for the next generation of global talent. 
                Connect, collaborate, and grow your career.
              </p>
              <div className="flex gap-4">
                {['twitter', 'linkedin', 'github', 'instagram'].map((social) => (
                  <Link
                    key={social}
                    href={`#${social}`}
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all hover:scale-110"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5 bg-white/50 rounded-full" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            {[
              {
                title: 'Platform',
                links: ['Browse Talent', 'Find Work', 'How It Works', 'Pricing']
              },
              {
                title: 'Resources',
                links: ['Help Center', 'Blog', 'Success Stories', 'API Docs']
              },
              {
                title: 'Company',
                links: ['About Us', 'Careers', 'Contact', 'Press Kit']
              }
            ].map((column) => (
              <div key={column.title}>
                <h4 className="text-sm font-black uppercase tracking-widest mb-6">
                  {column.title}
                </h4>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-slate-400 font-medium">
              © {new Date().getFullYear()} TalantaHub. All rights reserved.
            </p>
            <div className="flex gap-8">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-sm text-slate-400 hover:text-white transition-colors font-medium"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-110 transition-all flex items-center justify-center group"
          aria-label="Scroll to top"
        >
          <ArrowRight className="w-6 h-6 -rotate-90 group-hover:-translate-y-1 transition-transform" />
        </motion.button>
      )}
    </div>
  )
}
