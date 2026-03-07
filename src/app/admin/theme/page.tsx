'use client'

import { ThemeSelector } from '../../components/ThemeSelector'
import AdminSidebarLayout from '../AdminSidebarLayout'
import { Palette } from 'lucide-react'

export default function AdminThemePage() {
  return (
    <AdminSidebarLayout>
      <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Palette className="w-8 h-8 text-indigo-600 dark:text-purple-400" />
            <h1 className="text-3xl font-bold">System Theme Management</h1>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <ThemeSelector />
          </div>
        </div>
      </div>
    </AdminSidebarLayout>
  )
}