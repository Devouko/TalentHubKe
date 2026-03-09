'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Briefcase, FileText, Eye, UserPlus, Store, X, Menu, ShoppingBag } from 'lucide-react'
import { useState } from 'react'

export function UserSidebar() {
  const { data: session } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-slate-900 hover:bg-slate-800 rounded-lg text-white shadow-lg shadow-black/20 lg:hidden transition-all"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className={`fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-r border-slate-700/50 shadow-2xl shadow-black/20 transition-all z-40 ${sidebarOpen ? 'w-64' : 'w-0 lg:w-16'} lg:w-64`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`font-bold text-white ${sidebarOpen || window.innerWidth >= 1024 ? 'block' : 'hidden'} lg:block`}>
              TalentHub
            </h2>
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="text-slate-400 hover:text-white lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="space-y-2">
            <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-white transition-all">
              <ShoppingBag className="w-5 h-5" />
              <span className={`${sidebarOpen || window.innerWidth >= 1024 ? 'block' : 'hidden'} lg:block`}>Shop</span>
            </Link>
            
            <Link href="/gigs" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-white transition-all">
              <Briefcase className="w-5 h-5" />
              <span className={`${sidebarOpen || window.innerWidth >= 1024 ? 'block' : 'hidden'} lg:block`}>Browse Gigs</span>
            </Link>
            
            <Link href="/jobs" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-white transition-all">
              <FileText className="w-5 h-5" />
              <span className={`${sidebarOpen || window.innerWidth >= 1024 ? 'block' : 'hidden'} lg:block`}>Find Jobs</span>
            </Link>
            
            <Link href="/opportunities" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-white transition-all">
              <Eye className="w-5 h-5" />
              <span className={`${sidebarOpen || window.innerWidth >= 1024 ? 'block' : 'hidden'} lg:block`}>Opportunities</span>
            </Link>
            
            {session?.user?.sellerStatus !== 'APPROVED' && (
              <Link href="/apply-seller" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-white transition-all">
                <UserPlus className="w-5 h-5" />
                <span className={`${sidebarOpen || window.innerWidth >= 1024 ? 'block' : 'hidden'} lg:block`}>Become Seller</span>
              </Link>
            )}
            
            {session?.user?.sellerStatus === 'APPROVED' && (
              <Link href="/seller-dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-white transition-all">
                <Store className="w-5 h-5" />
                <span className={`${sidebarOpen || window.innerWidth >= 1024 ? 'block' : 'hidden'} lg:block`}>Seller Dashboard</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </>
  )
}