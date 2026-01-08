'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Settings, Palette, MessageSquare, Users, BarChart3, X } from 'lucide-react'
import Link from 'next/link'

export default function AdminSidebar() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(true)
  const [showColorPicker, setShowColorPicker] = useState(false)

  const handleColorChange = (color: string) => {
    document.documentElement.style.setProperty('--primary-color', color)
    localStorage.setItem('admin-theme-color', color)
  }

  if (session?.user?.userType !== 'ADMIN') return null

  return (
    <>
      <div className={`fixed left-0 top-0 h-full bg-gray-900 border-r border-gray-700 transition-all z-50 ${isOpen ? 'w-64' : 'w-16'}`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`font-bold text-white ${isOpen ? 'block' : 'hidden'}`}>Admin Panel</h2>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white">
              {isOpen ? <X className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
            </button>
          </div>

          <nav className="space-y-2">
            <Link href="/admin" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
              <BarChart3 className="w-5 h-5" />
              {isOpen && <span>Dashboard</span>}
            </Link>
            
            <Link href="/admin/users" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
              <Users className="w-5 h-5" />
              {isOpen && <span>Users</span>}
            </Link>

            <button 
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white"
            >
              <Palette className="w-5 h-5" />
              {isOpen && <span>Theme Colors</span>}
            </button>

            <Link href="/admin/messages" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
              <MessageSquare className="w-5 h-5" />
              {isOpen && <span>Messages</span>}
            </Link>
          </nav>

          {showColorPicker && isOpen && (
            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
              <h3 className="text-white text-sm mb-3">System Colors</h3>
              <div className="grid grid-cols-4 gap-2">
                {['#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#06b6d4', '#84cc16'].map(color => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className="w-8 h-8 rounded border-2 border-gray-600 hover:border-white"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={`${isOpen ? 'ml-64' : 'ml-16'} transition-all`} />
    </>
  )
}