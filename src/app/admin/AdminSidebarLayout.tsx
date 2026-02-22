'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BarChart3, Users, ShoppingCart, DollarSign, Settings, Palette, MessageSquare, X, Package, LogOut, Briefcase, PlusCircle, Store, FileText, Star, Eye } from 'lucide-react'
import Link from 'next/link'
import { useSidebar } from '../context/SidebarContext'

interface AdminSidebarLayoutProps {
  children: React.ReactNode
}

export default function AdminSidebarLayout({ children }: AdminSidebarLayoutProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { isOpen, close } = useSidebar()
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
      <div className={`fixed left-0 top-0 h-full bg-gray-900 border-r border-gray-700 transition-transform duration-300 z-50 overflow-y-auto w-64 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <button
          onClick={close}
          className="absolute top-4 right-4 p-2 lg:hidden"
        >
          <X className="w-5 h-5 text-white" />
        </button>
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-bold text-white">Admin Panel</h2>
          </div>
          <nav className="space-y-2">
            <Link href="/admin" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
              <BarChart3 className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link href="/admin/users" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
              <Users className="w-5 h-5" />
              <span>Users</span>
            </Link>
            <Link href="/admin/sellers" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
              <Users className="w-5 h-5" />
              <span>Sellers</span>
            </Link>
            <Link href="/admin/products" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
              <Package className="w-5 h-5" />
              <span>Products</span>
            </Link>
            <Link href="/admin/theme" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
              <Palette className="w-5 h-5" />
              <span>Theme</span>
            </Link>
            <button onClick={handleSignOut} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-800 text-gray-300 hover:text-white">
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </nav>
        </div>
      </div>
      
      <div className="lg:ml-64 transition-all min-h-screen">
        {children}
      </div>
    </>
  )
}