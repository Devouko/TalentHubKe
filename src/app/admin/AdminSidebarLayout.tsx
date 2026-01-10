'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BarChart3, Users, ShoppingCart, DollarSign, Settings, Palette, MessageSquare, X, Package, LogOut, Briefcase, PlusCircle, Store, FileText, Star, Eye } from 'lucide-react'
import Link from 'next/link'

interface AdminSidebarLayoutProps {
  children: React.ReactNode
}

export default function AdminSidebarLayout({ children }: AdminSidebarLayoutProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showColorPicker, setShowColorPicker] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth')
      return
    }
    if (session.user?.userType !== 'ADMIN') {
      router.push('/dashboard')
      return
    }
  }, [session, status, router])

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false })
      setTimeout(() => router.push('/'), 1500)
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const handleColorChange = (color: string) => {
    document.documentElement.style.setProperty('--primary-color', color)
    localStorage.setItem('admin-theme-color', color)
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session || session.user?.userType !== 'ADMIN') {
    return null
  }

  return (
    <>
      {/* Admin Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-gray-900 border-r border-gray-700 transition-all z-50 overflow-y-auto ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`font-bold text-white ${sidebarOpen ? 'block' : 'hidden'}`}>Admin Panel</h2>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
            </button>
          </div>
          <nav className="space-y-2">
            <Link href="/admin" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
              <BarChart3 className="w-5 h-5" />
              {sidebarOpen && <span>Dashboard</span>}
            </Link>
            <Link href="/admin/users" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
              <Users className="w-5 h-5" />
              {sidebarOpen && <span>Users</span>}
            </Link>
            <Link href="/admin/gigs" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
              <Briefcase className="w-5 h-5" />
              {sidebarOpen && <span>All Gigs</span>}
            </Link>
            <Link href="/admin/create-gig" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
              <PlusCircle className="w-5 h-5" />
              {sidebarOpen && <span>Create Gig</span>}
            </Link>
            <Link href="/admin/opportunities" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
              <Eye className="w-5 h-5" />
              {sidebarOpen && <span>Opportunities</span>}
            </Link>
            <Link href="/admin/jobs" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
              <FileText className="w-5 h-5" />
              {sidebarOpen && <span>Jobs</span>}
            </Link>
            <Link href="/admin/seller-dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
              <Store className="w-5 h-5" />
              {sidebarOpen && <span>Seller Dashboard</span>}
            </Link>
            <Link href="/admin/reviews" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
              <Star className="w-5 h-5" />
              {sidebarOpen && <span>Reviews</span>}
            </Link>
            <Link href="/admin/messages" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
              <MessageSquare className="w-5 h-5" />
              {sidebarOpen && <span>Messages</span>}
            </Link>
            <Link href="/admin/products" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
              <Package className="w-5 h-5" />
              {sidebarOpen && <span>Products</span>}
            </Link>
            <Link href="/admin/escrow" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
              <DollarSign className="w-5 h-5" />
              {sidebarOpen && <span>Escrow</span>}
            </Link>
            <Link href="/admin/theme" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
              <Palette className="w-5 h-5" />
              {sidebarOpen && <span>Theme</span>}
            </Link>
            <Link href="/admin/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
              <Settings className="w-5 h-5" />
              {sidebarOpen && <span>Settings</span>}
            </Link>
            <button onClick={() => setShowColorPicker(!showColorPicker)} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
              <Palette className="w-5 h-5" />
              {sidebarOpen && <span>Theme Colors</span>}
            </button>
            <button onClick={handleSignOut} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-800 text-gray-300 hover:text-white">
              <LogOut className="w-5 h-5" />
              {sidebarOpen && <span>Sign Out</span>}
            </button>
          </nav>
          {showColorPicker && sidebarOpen && (
            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
              <h3 className="text-white text-sm mb-3">System Colors</h3>
              <div className="grid grid-cols-4 gap-2">
                {['#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#06b6d4', '#84cc16'].map(color => (
                  <button key={color} onClick={() => handleColorChange(color)} className="w-8 h-8 rounded border-2 border-gray-600 hover:border-white" style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-16'} transition-all min-h-screen`}>
        {children}
      </div>
    </>
  )
}