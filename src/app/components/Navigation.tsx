/**
 * Navigation Component
 * 
 * Global navigation bar that appears on all pages. Provides:
 * - Logo and branding
 * - Main navigation links
 * - User type selector (Client/Freelancer/Agency)
 * - User balance display
 * - Notification and cart icons
 * - Authentication controls (Sign In/Out)
 * - Theme toggle for light/dark mode
 * 
 * Features:
 * - Responsive design with mobile considerations
 * - Active page highlighting
 * - Badge notifications for cart and messages
 * - Smooth animations with Framer Motion
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Bell, ShoppingCart, User, Wallet } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { useCart } from '../context/CartContext'
import { UserType } from '../types/gig.types'
import { ThemeToggle } from './theme-toggle'

/**
 * Navigation Component
 * 
 * Renders the main navigation bar with all navigation elements,
 * user controls, and theme switching functionality.
 * 
 * @returns JSX navigation element
 */
export default function Navigation() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { userType, setUserType, balance } = useUser()
  const { cart } = useCart()

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/onboarding', label: 'Get Started' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/opportunities', label: 'Browse Gigs' },
    { href: '/create-gig', label: 'Create Gig' },
    { href: '/apply-seller', label: 'Become Seller' },
    { href: '/seller-dashboard', label: 'Seller Dashboard' },
    { href: '/pos', label: 'POS System' },
    { href: '/reviews', label: 'Reviews' }
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Link href="/">
            <motion.div 
              className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              TalentHub
            </motion.div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}>
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    pathname === link.href 
                      ? 'bg-primary/20 text-primary' 
                      : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                </motion.span>
              </Link>
            ))}

            {/* User Type Selector */}
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value as UserType)}
              className="bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="client">Client</option>
              <option value="freelancer">Freelancer</option>
              <option value="agency">Agency</option>
            </select>

            {/* User Balance Display */}
            <motion.div 
              className="flex items-center gap-2 px-4 py-2 bg-accent rounded-lg border border-border"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Wallet className="w-5 h-5 text-green-500" />
              <span className="font-semibold">${balance.toFixed(2)}</span>
            </motion.div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notification Bell */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 hover:bg-accent rounded-full transition-colors"
            >
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </motion.button>

            {/* Shopping Cart */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 hover:bg-accent rounded-full transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full text-xs flex items-center justify-center text-primary-foreground">
                  {cart.length}
                </span>
              )}
            </motion.button>

            {/* Authentication Controls */}
            {session ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => signOut()}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                <User className="w-5 h-5" />
                <span>{session.user?.name || 'User'}</span>
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => signIn()}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                <User className="w-5 h-5" />
                <span>Sign In</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}