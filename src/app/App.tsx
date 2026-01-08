'use client'

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  Search, Code, Layers, DollarSign, 
  Users, CheckCircle, Star, Brain, Award, LineChart, Sparkles,
  Shield, FileText, Languages, Lock, BadgeCheck, Scale, CreditCard,
  TrendingUp, Briefcase, Play, ArrowRight, Menu, X
} from 'lucide-react';
import { useUser } from './context/UserContext';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Auto-typing component
const AutoTypeText = ({ words }: { words: string[] }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    const typingSpeed = isDeleting ? 50 : 100;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentWord.length) {
          setDisplayText(currentWord.substring(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(currentWord.substring(0, displayText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentWordIndex, words]);

  return (
    <span className="relative">
      {displayText}
      <span className="animate-pulse text-green-400">|</span>
    </span>
  );
};

const categories = [
  { icon: Code, name: 'Programming & Tech', count: '12,345', gradient: 'from-green-500 to-emerald-500' },
  { icon: Layers, name: 'Design & Creative', count: '8,901', gradient: 'from-pink-500 to-purple-500' },
  { icon: FileText, name: 'Writing & Content', count: '6,543', gradient: 'from-yellow-500 to-orange-500' },
  { icon: TrendingUp, name: 'Digital Marketing', count: '5,432', gradient: 'from-orange-500 to-red-500' },
  { icon: Play, name: 'Video & Animation', count: '4,321', gradient: 'from-red-500 to-pink-500' },
  { icon: Brain, name: 'AI & Data Science', count: '3,210', gradient: 'from-green-500 to-emerald-500' },
  { icon: Briefcase, name: 'Business & Consulting', count: '2,987', gradient: 'from-green-500 to-emerald-500' },
  { icon: LineChart, name: 'Finance & Accounting', count: '1,876', gradient: 'from-yellow-500 to-orange-500' }
];

const aiFeatures = [
  { icon: Brain, title: 'Smart Matching', desc: 'AI-powered talent recommendations', gradient: 'from-purple-600 to-purple-400' },
  { icon: Award, title: 'Skill Verification', desc: 'Automated testing & certification', gradient: 'from-green-600 to-green-400' },
  { icon: LineChart, title: 'Price Intelligence', desc: 'Dynamic pricing suggestions', gradient: 'from-green-600 to-green-400' },
  { icon: Sparkles, title: 'Auto Proposals', desc: 'AI-generated project proposals', gradient: 'from-yellow-600 to-yellow-400' },
  { icon: CheckCircle, title: 'Quality Assurance', desc: 'Automated work review', gradient: 'from-pink-600 to-pink-400' },
  { icon: Shield, title: 'Fraud Detection', desc: 'Real-time security monitoring', gradient: 'from-red-600 to-red-400' },
  { icon: FileText, title: 'Smart Contracts', desc: 'Blockchain-based agreements', gradient: 'from-yellow-600 to-yellow-400' },
  { icon: Languages, title: 'Instant Translation', desc: 'Real-time multilingual communication', gradient: 'from-purple-600 to-purple-400' }
];

// Partner logos
const partners = [
  { name: 'Safaricom', logo: '📱' },
  { name: 'Equity Bank', logo: '🏦' },
  { name: 'KCB', logo: '💳' },
  { name: 'Airtel', logo: '📡' },
  { name: 'NCBA', logo: '🏛️' },
  { name: 'Co-op Bank', logo: '🤝' },
  { name: 'Absa', logo: '💼' },
  { name: 'Standard Chartered', logo: '🌟' }
];

const App: React.FC = () => {
  const { data: session } = useSession();
  const { userType } = useUser();
  const heroTitleRef = useRef<HTMLDivElement>(null);
  const floatingIconsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Hero Letter Animation
  useEffect(() => {
    if (heroTitleRef.current) {
      const letters = heroTitleRef.current.querySelectorAll('.letter');
      gsap.fromTo(letters,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.6,
          ease: 'back.out(1.7)'
        }
      );
    }
  }, []);

  // Floating glow animation
  useEffect(() => {
    if (glowRef.current) {
      // Create a timeline for complex animations
      const tl = gsap.timeline({ repeat: -1 });
      
      // Pulsing and scaling animation
      tl.to(glowRef.current, {
        scale: 1.3,
        opacity: 0.9,
        duration: 2,
        ease: 'sine.inOut'
      })
      .to(glowRef.current, {
        scale: 0.8,
        opacity: 0.6,
        duration: 1.5,
        ease: 'sine.inOut'
      })
      .to(glowRef.current, {
        scale: 1.1,
        opacity: 0.8,
        duration: 2.5,
        ease: 'sine.inOut'
      });
      
      // Floating movement animation
      gsap.to(glowRef.current, {
        y: -30,
        x: 20,
        duration: 4,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
      });
      
      // Rotation animation
      gsap.to(glowRef.current, {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: 'none'
      });
    }
  }, []);

  // Floating Icons Animation
  useEffect(() => {
    if (floatingIconsRef.current) {
      const icons = floatingIconsRef.current.querySelectorAll('.float-icon');
      icons.forEach((icon, i) => {
        gsap.to(icon, {
          y: -20,
          duration: 2 + (i * 0.2),
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          delay: i * 0.1
        });
      });
    }
  }, []);

  // Stats Counter Animation
  useEffect(() => {
    if (statsRef.current) {
      const numbers = statsRef.current.querySelectorAll('.stat-number');
      numbers.forEach((num) => {
        const target = parseFloat(num.getAttribute('data-target') || '0');
        gsap.fromTo(num,
          { innerText: 0 },
          {
            innerText: target,
            duration: 2,
            ease: 'power2.out',
            snap: { innerText: 0.1 },
            scrollTrigger: {
              trigger: num,
              start: 'top 80%'
            }
          }
        );
      });
    }
  }, []);

  const getHeroContent = () => {
    if (!mounted || !session) {
      return {
        title: 'Talent Marketplace that',
        subtitle: 'developers love',
        description: 'Connect with world-class talent • AI-powered matching • Secure payments • Instant delivery',
        cta1: { text: 'Get Started', href: '/auth/signup' },
        cta2: { text: 'Contact Us', href: '/contact' }
      };
    }
    
    const content = {
      client: {
        title: 'Find World-Class Talent for Any Project',
        subtitle: 'AI-powered matching • Secure payments • 24/7 support',
        cta1: { text: 'Post a Project', href: '/create-gig' },
        cta2: { text: 'Browse Talent', href: '/opportunities' }
      },
      freelancer: {
        title: 'Showcase Your Skills, Grow Your Business',
        subtitle: 'Premium tools • Global clients • Instant payments',
        cta1: { text: 'Create Gig', href: '/create-gig' },
        cta2: { text: 'Browse Projects', href: '/opportunities' }
      },
      agency: {
        title: 'Scale Your Agency with Enterprise Tools',
        subtitle: 'Team management • White-label solutions • Advanced analytics',
        cta1: { text: 'Get Started', href: '/create-gig' },
        cta2: { text: 'View Features', href: '/opportunities' }
      }
    };
    return content[userType] || content.client;
  };

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  const heroContent = getHeroContent();
  const titleText = heroContent.title;
  const letters = titleText.split('').map((char, i) => (
    <span key={i} className="letter inline-block">{char === ' ' ? '\u00A0' : char}</span>
  ));

  return (
    <div className="min-h-screen text-white overflow-x-hidden relative bg-black">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        
        {/* Floating particles */}
        <div ref={floatingIconsRef} className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="float-icon absolute w-1 h-1 rounded-full opacity-20 bg-green-400"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-r from-green-400 to-yellow-400">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold text-white">TalentHub</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/products">
                <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                  Products
                </span>
              </Link>
              {['Solutions', 'Resources', 'Customers', 'Pricing', 'Docs'].map((item) => (
                <Link key={item} href={`/${item.toLowerCase()}`}>
                  <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                    {item}
                  </span>
                </Link>
              ))}
              {session?.user?.userType === 'ADMIN' && (
                <Link href="/admin">
                  <span className="text-green-400 hover:text-white transition-colors cursor-pointer font-semibold">
                    Admin
                  </span>
                </Link>
              )}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              {!session ? (
                <>
                  <Link href="/auth">
                    <button className="text-gray-300 hover:text-white transition-colors">
                      Log In
                    </button>
                  </Link>
                  <Link href="/auth/signup">
                    <button className="bg-green-500 text-black px-4 py-2 rounded-full flex items-center gap-2 transition-colors hover:opacity-90">
                      Sign Up
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </>
              ) : (
                <Link href="/dashboard">
                  <button className="bg-green-500 text-black px-4 py-2 rounded-full transition-colors hover:opacity-90">
                    Dashboard
                  </button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden mt-4 p-4 bg-gray-900/80 backdrop-blur-xl rounded-xl border border-gray-800"
            >
              <div className="flex flex-col gap-4">
                <Link href="/products">
                  <span className="text-gray-300 hover:text-white transition-colors">
                    Products
                  </span>
                </Link>
                {['Solutions', 'Resources', 'Customers', 'Pricing', 'Docs'].map((item) => (
                  <Link key={item} href={`/${item.toLowerCase()}`}>
                    <span className="text-gray-300 hover:text-white transition-colors">
                      {item}
                    </span>
                  </Link>
                ))}
                {session?.user?.userType === 'ADMIN' && (
                  <Link href="/admin">
                    <span className="text-green-400 hover:text-white transition-colors font-semibold">
                      Admin
                    </span>
                  </Link>
                )}
                <div className="border-t border-gray-800 pt-4 flex flex-col gap-2">
                  {!session ? (
                    <>
                      <Link href="/auth">
                        <button className="w-full text-left text-gray-300 hover:text-white transition-colors">
                          Log In
                        </button>
                      </Link>
                      <Link href="/auth/signup">
                        <button className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full transition-colors">
                          Sign Up
                        </button>
                      </Link>
                    </>
                  ) : (
                    <Link href="/dashboard">
                      <button className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full transition-colors">
                        Dashboard
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </nav>
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-full mb-8"
            >
              ⭐ Top Rated Marketplace 2025
            </motion.div>

            {/* Main Title */}
            <div ref={heroTitleRef} className="mb-6">
              <h1 className="text-5xl md:text-7xl font-bold mb-4">
                <span className="text-green-400">
                  <AutoTypeText words={['AI Infrastructure', 'Talent Marketplace', 'Developer Platform']} />
                </span>
                <span className="text-white block">
                  that developers love
                </span>
              </h1>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-xl md:text-2xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              {heroContent.description || 'Run inference, training, and batch processing with sub-second cold starts, instant autoscaling, and a developer experience that feels local.'}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Link href={heroContent.cta1.href}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold text-lg transition-colors"
                >
                  {heroContent.cta1.text}
                </motion.button>
              </Link>
              <Link href={heroContent.cta2?.href || '/contact'}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gray-800/50 backdrop-blur-xl border border-gray-700 hover:border-gray-600 text-white rounded-full font-semibold text-lg transition-colors"
                >
                  {heroContent.cta2?.text || 'Contact Us'}
                </motion.button>
              </Link>
            </motion.div>

            {/* Glowing Element */}
            <div className="relative flex justify-center mb-20">
              {/* Background glow layers */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[500px] h-60 bg-gradient-to-r from-green-400/10 via-yellow-400/20 to-green-400/10 rounded-full blur-3xl animate-pulse" />
              </div>
              
              {/* Main animated glow */}
              <div 
                ref={glowRef}
                className="relative w-96 h-48 bg-gradient-to-r from-green-400/30 via-yellow-400/40 to-green-400/30 rounded-3xl blur-2xl"
              />
              
              {/* Core light element */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  animate={{
                    scale: [1, 1.1, 0.9, 1],
                    opacity: [0.8, 1, 0.7, 0.8]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-80 h-32 bg-gradient-to-r from-green-400 via-yellow-400 to-green-400 rounded-2xl shadow-2xl shadow-green-400/50"
                />
              </div>
              
              {/* Floating particles around the light */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-green-400 rounded-full"
                    style={{
                      left: `${45 + Math.cos(i * 45 * Math.PI / 180) * 40}%`,
                      top: `${45 + Math.sin(i * 45 * Math.PI / 180) * 30}%`
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                      y: [-20, 0, -20]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center">
            {partners.map((partner, i) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center gap-2 p-4 bg-gray-900/30 backdrop-blur-xl border border-gray-800 rounded-xl hover:border-gray-700 transition-colors group"
              >
                <div className="text-2xl group-hover:scale-110 transition-transform">
                  {partner.logo}
                </div>
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                  {partner.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <div className="p-8 bg-gray-900/30 backdrop-blur-xl border border-gray-800 rounded-3xl">
            <h2 className="text-3xl font-bold text-center mb-8 text-white">
              Find the Perfect <span className="text-green-400">Talent</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700">
                <Code className="w-5 h-5 text-green-400" />
                <input
                  type="text"
                  placeholder="Skills/Service"
                  className="bg-transparent border-none outline-none w-full text-white placeholder:text-gray-400"
                />
              </div>
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700">
                <Layers className="w-5 h-5 text-green-400" />
                <input
                  type="text"
                  placeholder="Category"
                  className="bg-transparent border-none outline-none w-full text-white placeholder:text-gray-400"
                />
              </div>
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700">
                <DollarSign className="w-5 h-5 text-green-500" />
                <input
                  type="text"
                  placeholder="Budget Range"
                  className="bg-transparent border-none outline-none w-full text-white placeholder:text-gray-400"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-colors"
              >
                <Search className="w-5 h-5" />
                <span>Search</span>
              </motion.button>
            </div>
            <div className="flex flex-wrap gap-2 mt-6 justify-center">
              {['Web Development', 'Design', 'Writing', 'Marketing', 'Video', 'AI/ML'].map((tag) => (
                <motion.button
                  key={tag}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gray-800/50 backdrop-blur-xl border border-gray-700 hover:border-gray-600 rounded-full text-sm text-gray-300 hover:text-white transition-colors"
                >
                  {tag}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* AI Features */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Powered by </span>
              <span className="text-green-400">AI Technology</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Leverage cutting-edge AI technology to streamline your workflow and maximize productivity
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aiFeatures.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-6 bg-gray-900/30 backdrop-blur-xl border border-gray-800 hover:border-gray-700 rounded-2xl transition-all duration-300 group"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-green-400 transition-colors">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Explore <span className="text-green-400">Categories</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
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
                className="p-6 bg-gray-900/30 backdrop-blur-xl border border-gray-800 hover:border-gray-700 rounded-2xl cursor-pointer group transition-all duration-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${cat.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <cat.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-green-400 transition-colors">{cat.name}</h3>
                <p className="text-gray-400 text-sm">{cat.count} active professionals</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            ref={statsRef}
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
                className="text-center p-6 bg-gray-900/30 backdrop-blur-xl border border-gray-800 rounded-2xl"
              >
                <stat.icon className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <div className="text-4xl font-bold text-white mb-2">
                  <span className="stat-number" data-target={stat.value}>{stat.value}</span>
                  <span>{stat.suffix}</span>
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Security & </span>
              <span className="text-green-400">Trust</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Your safety and security are our top priorities with enterprise-grade protection
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Lock, title: 'Escrow System', desc: 'Secure payment holding until work completion' },
              { icon: BadgeCheck, title: 'Identity Verification', desc: 'KYC/AML compliance for all users' },
              { icon: Shield, title: 'End-to-End Encryption', desc: 'Military-grade data protection' },
              { icon: Scale, title: 'Dispute Resolution', desc: 'Fair mediation and conflict resolution' },
              { icon: Search, title: 'Background Checks', desc: 'Verified professional credentials' },
              { icon: CreditCard, title: 'PCI Compliance', desc: 'Secure payment processing standards' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-6 bg-gray-900/30 backdrop-blur-xl border border-gray-800 hover:border-green-500/50 rounded-2xl transition-all duration-300 group"
              >
                <item.icon className="w-12 h-12 text-green-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-yellow-400 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <span className="text-2xl font-bold text-white">TalentHub</span>
              </div>
              <p className="text-gray-400 text-sm">
                The world's premier talent marketplace connecting businesses with top freelancers and agencies.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">For Clients</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="hover:text-green-400 cursor-pointer transition-colors">Find Freelancers</li>
                <li className="hover:text-green-400 cursor-pointer transition-colors">Post a Project</li>
                <li className="hover:text-green-400 cursor-pointer transition-colors">How It Works</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">For Freelancers</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="hover:text-green-400 cursor-pointer transition-colors">Find Work</li>
                <li className="hover:text-green-400 cursor-pointer transition-colors">Create Profile</li>
                <li className="hover:text-green-400 cursor-pointer transition-colors">Success Stories</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="hover:text-green-400 cursor-pointer transition-colors">About Us</li>
                <li className="hover:text-green-400 cursor-pointer transition-colors">Careers</li>
                <li className="hover:text-green-400 cursor-pointer transition-colors">Contact</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            © 2025 TalentHub. All rights reserved. Built with ❤️ in Kenya
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;