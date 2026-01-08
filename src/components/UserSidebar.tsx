'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Briefcase, FileText, Eye, UserPlus, Store, X, Menu } from 'lucide-react'
import { useState } from 'react'

export function UserSidebar() {
  const { data: session } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-gray-900 hover:bg-gray-800 rounded-lg text-white lg:hidden"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className={`fixed left-0 top-0 h-full bg-gray-900 border-r border-gray-800 transition-all z-40 ${sidebarOpen ? 'w-64' : 'w-0 lg:w-16'} lg:w-64`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`font-bold text-white ${sidebarOpen || window.innerWidth >= 1024 ? 'block' : 'hidden'} lg:block`}>
              TalentHub
            </h2>
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="text-gray-400 hover:text-white lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="space-y-2">
            <Link href="/gigs" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
              <Briefcase className="w-5 h-5" />
              <span className={`${sidebarOpen || window.innerWidth >= 1024 ? 'block' : 'hidden'} lg:block`}>Browse Gigs</span>
            </Link>
            
            <Link href="/jobs" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
              <FileText className="w-5 h-5" />
              <span className={`${sidebarOpen || window.innerWidth >= 1024 ? 'block' : 'hidden'} lg:block`}>Find Jobs</span>
            </Link>
            
            <Link href="/opportunities" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
              <Eye className="w-5 h-5" />
              <span className={`${sidebarOpen || window.innerWidth >= 1024 ? 'block' : 'hidden'} lg:block`}>Opportunities</span>
            </Link>
            
            {session?.user?.sellerStatus !== 'APPROVED' && (
              <Link href="/apply-seller" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
                <UserPlus className="w-5 h-5" />
                <span className={`${sidebarOpen || window.innerWidth >= 1024 ? 'block' : 'hidden'} lg:block`}>Become Seller</span>
              </Link>
            )}
            
            {session?.user?.sellerStatus === 'APPROVED' && (
              <Link href="/seller-dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
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