'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BarChart3, Users, ShoppingCart, DollarSign, Settings, Palette, MessageSquare, X, Package, LogOut, Briefcase, PlusCircle, Store, FileText, Star, Eye, UserCheck } from 'lucide-react'
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
      <div className={`fixed left-0 top-0 h-full bg-slate-900 border-r border-slate-800 transition-transform duration-300 z-50 overflow-y-auto w-64 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <button
          onClick={close}
          className="absolute top-4 right-4 p-2 lg:hidden"
        >
          <X className="w-5 h-5 text-white" />
        </button>
        <div className="p-4">
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="font-black text-xl text-white tracking-tight italic">
              Talanta<span className="text-blue-500">Hub</span> <span className="text-xs uppercase bg-blue-600 px-1.5 py-0.5 rounded ml-1 not-italic tracking-normal">Admin</span>
            </h2>
          </div>
          <nav className="space-y-1">
            <Link href="/admin" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all">
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </Link>
            <Link href="/admin/users" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all">
              <Users className="w-5 h-5" />
              <span className="font-medium">Users</span>
            </Link>
            <Link href="/admin/sellers" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all">
              <Store className="w-5 h-5" />
              <span className="font-medium">Sellers</span>
            </Link>
            <Link href="/admin/talent" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all">
              <UserCheck className="w-5 h-5" />
              <span className="font-medium">Talent</span>
            </Link>
            <Link href="/admin/gigs" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all">
              <Briefcase className="w-5 h-5" />
              <span className="font-medium">Gigs</span>
            </Link>
            <Link href="/admin/products" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all">
              <Package className="w-5 h-5" />
              <span className="font-medium">Products</span>
            </Link>
            <Link href="/admin/opportunities" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all">
              <PlusCircle className="w-5 h-5" />
              <span className="font-medium">Opportunities</span>
            </Link>
            <Link href="/admin/escrow" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all">
              <DollarSign className="w-5 h-5" />
              <span className="font-medium">Escrow</span>
            </Link>
            <Link href="/admin/reviews" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all">
              <Star className="w-5 h-5" />
              <span className="font-medium">Reviews</span>
            </Link>
            <Link href="/admin/messages" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all">
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium">Messages</span>
            </Link>
            <Link href="/admin/settings" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all">
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </Link>
            <Link href="/admin/theme" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all">
              <Palette className="w-5 h-5" />
              <span className="font-medium">Theme</span>
            </Link>
            <div className="pt-4 mt-4 border-t border-slate-800">
              <button onClick={handleSignOut} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-900/20 text-slate-400 hover:text-red-400 transition-all">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </nav>
        </div>
      </div>
      
      <div className="lg:ml-64 transition-all min-h-screen">
        {children}
      </div>
    </>
  )
}