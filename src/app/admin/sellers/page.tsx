'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Eye, Users } from 'lucide-react'
import AdminSidebarLayout from '../AdminSidebarLayout'

interface SellerApplication {
  id: string
  userId: string
  category: string
  skills: string
  experience: string
  portfolio: string
  description: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
  user: {
    name: string
    email: string
  }
}

export default function SellersPage() {
  const [applications, setApplications] = useState<SellerApplication[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/admin/seller-applications')
      if (response.ok) {
        const data = await response.json()
        setApplications(data)
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateApplicationStatus = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const response = await fetch(`/api/admin/seller-applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (response.ok) {
        fetchApplications()
      }
    } catch (error) {
      console.error('Error updating application:', error)
    }
  }

  return (
    <AdminSidebarLayout>
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Users className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold">Seller Applications</h1>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading applications...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {applications.map(app => (
                <div key={app.id} className="bg-gray-800 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{app.user.name}</h3>
                      <p className="text-gray-400">{app.user.email}</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                        app.status === 'APPROVED' ? 'bg-green-600 text-white' :
                        app.status === 'REJECTED' ? 'bg-red-600 text-white' :
                        'bg-yellow-600 text-white'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {app.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => updateApplicationStatus(app.id, 'APPROVED')}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => updateApplicationStatus(app.id, 'REJECTED')}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Category</p>
                      <p className="text-white">{app.category}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Skills</p>
                      <p className="text-white">{app.skills}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-gray-400">Experience</p>
                      <p className="text-white">{app.experience}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-gray-400">Description</p>
                      <p className="text-white">{app.description}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Portfolio</p>
                      <a href={app.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                        {app.portfolio}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminSidebarLayout>
  )
}