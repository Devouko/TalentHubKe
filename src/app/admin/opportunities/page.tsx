'use client'

import { Eye } from 'lucide-react'
import AdminSidebarLayout from '../AdminSidebarLayout'

export default function AdminOpportunitiesPage() {
  return (
    <AdminSidebarLayout>
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Eye className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold">Opportunities</h1>
          </div>

          <div className="text-center py-12">
            <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Opportunities Management</h3>
            <p className="text-gray-400">Manage marketplace opportunities</p>
          </div>
        </div>
      </div>
    </AdminSidebarLayout>
  )
}