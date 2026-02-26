'use client'

import { useState, useEffect } from 'react'
import { Users, Search, Edit, Trash2, Plus, Star, Eye, Mail, Phone, MapPin } from 'lucide-react'
import AdminSidebarLayout from '../AdminSidebarLayout'
import { toast } from 'sonner'

export default function TalentManagement() {
  const [talents, setTalents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [selectedTalent, setSelectedTalent] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchTalents()
  }, [])

  const fetchTalents = async () => {
    try {
      const res = await fetch('/api/users?type=talent')
      const data = await res.json()
      setTalents(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to fetch talents')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this talent?')) return

    try {
      const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setTalents(talents.filter(t => t.id !== id))
        toast.success('Talent deleted successfully')
      } else {
        toast.error('Failed to delete talent')
      }
    } catch (error) {
      toast.error('Error deleting talent')
    }
  }

  const handleEdit = (talent: any) => {
    setSelectedTalent(talent)
    setShowModal(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      bio: formData.get('bio'),
      county: formData.get('county'),
      phoneNumber: formData.get('phoneNumber'),
      userType: formData.get('userType')
    }

    try {
      const res = await fetch(`/api/users?id=${selectedTalent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (res.ok) {
        await fetchTalents()
        setShowModal(false)
        toast.success('Talent updated successfully')
      } else {
        toast.error('Failed to update talent')
      }
    } catch (error) {
      toast.error('Error updating talent')
    }
  }

  const filteredTalents = talents.filter(t => {
    const matchesSearch = t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || t.userType === filterType
    return matchesSearch && matchesType
  })

  return (
    <AdminSidebarLayout>
      <div className="min-h-screen bg-[#0a192f] text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#10B981] mb-2">Talent Management</h1>
              <p className="text-gray-400">Manage freelancers and agencies</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-[#1e293b] px-4 py-2 rounded-lg">
                <span className="text-gray-400">Total: </span>
                <span className="text-[#10B981] font-bold">{talents.length}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#1e293b] rounded-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white"
              >
                <option value="all">All Types</option>
                <option value="FREELANCER">Freelancers</option>
                <option value="AGENCY">Agencies</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981] mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading talents...</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredTalents.map(talent => (
                <div key={talent.id} className="bg-[#1e293b] rounded-lg p-6 hover:border-[#10B981] border border-[#334155] transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-16 h-16 bg-gradient-to-r from-[#10B981] to-cyan-500 rounded-full flex items-center justify-center overflow-hidden">
                        {talent.profileImage ? (
                          <img src={talent.profileImage} alt={talent.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xl font-bold">{talent.name?.[0] || 'T'}</span>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-white">{talent.name || 'Unnamed'}</h3>
                          <span className={`px-2 py-1 rounded text-xs ${
                            talent.userType === 'FREELANCER' 
                              ? 'bg-blue-600/20 text-blue-400' 
                              : 'bg-purple-600/20 text-purple-400'
                          }`}>
                            {talent.userType}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            talent.sellerStatus === 'APPROVED'
                              ? 'bg-green-600/20 text-green-400'
                              : talent.sellerStatus === 'PENDING'
                              ? 'bg-yellow-600/20 text-yellow-400'
                              : 'bg-gray-600/20 text-gray-400'
                          }`}>
                            {talent.sellerStatus}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-400 mb-3">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{talent.email}</span>
                          </div>
                          {talent.phoneNumber && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{talent.phoneNumber}</span>
                            </div>
                          )}
                          {talent.county && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{talent.county}</span>
                            </div>
                          )}
                        </div>

                        {talent.bio && (
                          <p className="text-gray-300 text-sm mb-3 line-clamp-2">{talent.bio}</p>
                        )}

                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-white">{talent.sellerRating || 0}</span>
                          </div>
                          <div className="text-gray-400">
                            <span className="text-white font-semibold">{talent._count?.gigs || 0}</span> Services
                          </div>
                          <div className="text-gray-400">
                            <span className="text-white font-semibold">{talent._count?.orders || 0}</span> Orders
                          </div>
                          <div className="text-gray-400">
                            <span className="text-white font-semibold">{talent._count?.reviews || 0}</span> Reviews
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => window.open(`/profile/${talent.id}`, '_blank')}
                        className="p-2 bg-[#0f172a] hover:bg-[#334155] border border-[#334155] rounded-lg transition-all"
                        title="View Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(talent)}
                        className="p-2 bg-[#0f172a] hover:bg-[#334155] border border-[#334155] rounded-lg transition-all"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(talent.id)}
                        className="p-2 bg-red-600/10 hover:bg-red-600/20 border border-red-600/20 text-red-400 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredTalents.length === 0 && !loading && (
            <div className="text-center py-12 bg-[#1e293b] rounded-lg">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No talents found</h3>
              <p className="text-gray-400">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'No talents available'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && selectedTalent && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1e293b] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Edit Talent</h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={selectedTalent.name}
                    className="w-full px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={selectedTalent.email}
                    className="w-full px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">User Type</label>
                  <select
                    name="userType"
                    defaultValue={selectedTalent.userType}
                    className="w-full px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white"
                  >
                    <option value="FREELANCER">Freelancer</option>
                    <option value="AGENCY">Agency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    defaultValue={selectedTalent.phoneNumber || ''}
                    className="w-full px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">County</label>
                  <input
                    type="text"
                    name="county"
                    defaultValue={selectedTalent.county || ''}
                    className="w-full px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    rows={4}
                    defaultValue={selectedTalent.bio || ''}
                    className="w-full px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-[#10B981] hover:bg-[#059669] text-white py-3 rounded-lg font-semibold transition-all"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-[#334155] hover:bg-[#475569] text-white py-3 rounded-lg font-semibold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminSidebarLayout>
  )
}
