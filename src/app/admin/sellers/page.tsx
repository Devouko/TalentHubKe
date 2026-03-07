'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Eye, Users } from 'lucide-react'
import AdminSidebarLayout from '../AdminSidebarLayout'

interface SellerApplication {
  id: string
  userId: string
  businessName: string
  skills: string[]
  experience: string
  portfolio: string[]
  description: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
  users: {
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
      const response = await fetch('/api/admin/sellers')
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
      const response = await fetch('/api/admin/sellers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          applicationId: id, 
          action: status === 'APPROVED' ? 'approve' : 'reject' 
        })
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
            <div className="p-3 bg-blue-600/10 rounded-2xl">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight italic">Seller <span className="text-blue-500">Applications</span></h1>
              <p className="text-slate-500 font-medium">Review and manage marketplace sellers</p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-800 border-t-blue-600"></div>
              <p className="text-slate-500 mt-4 font-medium tracking-tight">Loading applications...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {applications.map(app => (
                <div key={app.id} className="bg-gray-800 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{app.users.name}</h3>
                      <p className="text-gray-400">{app.users.email}</p>
                      <p className="text-gray-300 mt-2">Business: {app.businessName}</p>
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
                      <p className="text-gray-400">Skills</p>
                      <p className="text-white">{app.skills.join(', ')}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Experience</p>
                      <p className="text-white">{app.experience}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-gray-400">Description</p>
                      <p className="text-white">{app.description}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-gray-400">Portfolio</p>
                      <div className="flex flex-wrap gap-2">
                        {app.portfolio.map((link, i) => (
                          <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                            Link {i + 1}
                          </a>
                        ))}
                      </div>
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