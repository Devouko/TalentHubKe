/**
 * Sidebar Component
 * 
 * Collapsible sidebar navigation that provides:
 * - Main navigation links
 * - User profile section
 * - Quick actions
 * - Theme toggle
 * - Notifications
 * 
 * Features:
 * - Responsive design (collapsible on mobile)
 * - Active page highlighting
 * - User context awareness
 * - Theme-aware styling
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { useSession, signOut } from 'next-auth/react'
import { 
  Home, Briefcase, Plus, Search, MessageCircle, BarChart3, 
  User, Settings, Bell, Menu, X, Wallet, Star, LogOut
} from 'lucide-react'
import { Button } from './ui/button'
import { ThemeToggle } from './theme-toggle'
import { useUser } from '../context/UserContext'
import ProfileDropdown from './ProfileDropdown'
import AdminThemeControl from './AdminThemeControl'

/**
 * Navigation link interface
 */
interface NavLink {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

/**
 * Sidebar Component
 * 
 * Renders a collapsible sidebar with navigation, user info, and quick actions.
 */
export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()
  const { balance } = useUser()

  /**
   * Main navigation links
   */
  const navLinks: NavLink[] = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/opportunities', label: 'Browse Gigs', icon: Search },
    { href: '/gigs', label: 'All Talent', icon: User },
    { href: '/apply-seller', label: 'Apply to Seller', icon: Briefcase },
    { href: '/create-gig', label: 'Create Gig', icon: Plus },
    { href: '/messages', label: 'Messages', icon: MessageCircle, badge: '3' },
    { href: '/seller-dashboard', label: 'Seller Dashboard', icon: Briefcase },
    { href: '/reviews', label: 'Reviews', icon: Star },
    ...(session?.user?.userType === 'ADMIN' ? [{ href: '/admin', label: 'Admin', icon: Settings }] : []),
  ]

  /**
   * Toggle sidebar collapse state
   */
  const toggleSidebar = () => setIsCollapsed(!isCollapsed)

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        className="fixed left-0 top-0 h-full bg-card border-r border-border z-50 flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xl font-bold bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent"
              >
                TalentHub 🇰🇪
              </motion.div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="lg:hidden"
            >
              {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* User Profile Section */}
        {session && (
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <ProfileDropdown />
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 min-w-0"
                >
                  <div className="font-semibold text-foreground truncate">
                    {session.user?.name || 'User'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {session.user?.email}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Balance Display */}
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-3 p-3 bg-accent rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-green-500" />
                  <span className="font-semibold text-foreground">
                    KES {balance.toLocaleString()}
                  </span>
                </div>
                <Button size="sm" className="w-full mt-2 bg-green-600 hover:bg-green-700">
                  Withdraw via M-Pesa
                </Button>
              </motion.div>
            )}
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            const Icon = link.icon

            return (
              <Link key={link.href} href={link.href}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors relative ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="font-medium"
                    >
                      {link.label}
                    </motion.span>
                  )}
                  {link.badge && !isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full"
                    >
                      {link.badge}
                    </motion.span>
                  )}
                  {link.badge && isCollapsed && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                  )}
                </motion.div>
              </Link>
            )
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border space-y-2">
          {/* Admin Theme Control */}
          {session?.user?.userType === 'ADMIN' && (
            <div className="flex items-center justify-center">
              <AdminThemeControl />
            </div>
          )}

          {/* Theme Toggle */}
          <div className="flex items-center justify-center">
            <ThemeToggle />
          </div>

          {/* Settings */}
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Link href="/settings">
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="w-5 h-5 mr-3" />
                  Settings
                </Button>
              </Link>
            </motion.div>
          )}

          {/* Sign Out */}
          {!isCollapsed && session && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => signOut()}
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out
              </Button>
            </motion.div>
          )}

          {/* Notifications */}
          <Button
            variant="ghost"
            size={isCollapsed ? "icon" : "default"}
            className={isCollapsed ? "" : "w-full justify-start"}
          >
            <Bell className="w-5 h-5" />
            {!isCollapsed && <span className="ml-3">Notifications</span>}
            <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </Button>
        </div>
      </motion.aside>

      {/* Main Content Spacer */}
      <div 
        className="transition-all duration-300"
        style={{ marginLeft: isCollapsed ? 80 : 280 }}
      />
    </>
  )
}