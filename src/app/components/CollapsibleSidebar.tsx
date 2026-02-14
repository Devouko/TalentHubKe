'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'

interface CollapsibleSidebarProps {
  children: React.ReactNode
  navbar: React.ReactNode
}

export default function CollapsibleSidebar({ children, navbar }: CollapsibleSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-white dark:bg-slate-900">
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:z-auto w-64`}>
        {/* Close button for mobile */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Navbar with hamburger */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={() => setIsOpen(true)}
              className="p-2 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            {navbar}
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 p-6">
          {/* Content goes here */}
        </div>
      </div>
    </div>
  )
}