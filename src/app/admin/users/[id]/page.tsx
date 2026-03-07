'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import AdminSidebarLayout from '../../AdminSidebarLayout'

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userType: '',
    isVerified: false,
    phoneNumber: '',
    county: '',
    balance: 0
  })

  useEffect(() => {
    fetchUser()
  }, [params.id])

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/admin/users/${params.id}`)
      if (!response.ok) {
        console.error('Failed to fetch user:', response.status)
        setLoading(false)
        return
      }
      const data = await response.json()
      if (data.error) {
        console.error('Error:', data.error)
        setLoading(false)
        return
      }
      setUser(data)
      setFormData({
        name: data.name || '',
        email: data.email || '',
        userType: data.userType || '',
        isVerified: data.isVerified || false,
        phoneNumber: data.phoneNumber || '',
        county: data.county || '',
        balance: data.balance || 0
      })
    } catch (error) {
      console.error('Error fetching user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const response = await fetch(`/api/admin/users/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (response.ok) {
        alert('User updated successfully')
        router.push('/admin/users')
      } else {
        alert('Failed to update user')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Error updating user')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminSidebarLayout>
        <div className="min-h-screen bg-[#0a192f] text-white flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#10B981]" />
        </div>
      </AdminSidebarLayout>
    )
  }

  if (!user) {
    return (
      <AdminSidebarLayout>
        <div className="min-h-screen bg-[#0a192f] text-white flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">User not found</h2>
            <button onClick={() => router.push('/admin/users')} className="text-[#10B981]">
              Back to Users
            </button>
          </div>
        </div>
      </AdminSidebarLayout>
    )
  }

  return (
    <AdminSidebarLayout>
      <div className="min-h-screen bg-[#0a192f] text-white p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.push('/admin/users')}
            className="flex items-center gap-2 text-[#94a3b8] hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Users
          </button>

          <div className="bg-[#1e293b] rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6">Edit User</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">User Type</label>
                <select
                  value={formData.userType}
                  onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white"
                >
                  <option value="CLIENT">Client</option>
                  <option value="FREELANCER">Freelancer</option>
                  <option value="AGENCY">Agency</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="text"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">County</label>
                <input
                  type="text"
                  value={formData.county}
                  onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Balance</label>
                <input
                  type="number"
                  value={formData.balance}
                  onChange={(e) => setFormData({ ...formData, balance: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isVerified"
                  checked={formData.isVerified}
                  onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                  className="w-4 h-4 text-[#10B981] bg-[#0f172a] border-[#334155] rounded focus:ring-[#10B981]"
                />
                <label htmlFor="isVerified" className="text-sm font-medium">Verified User</label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2 bg-[#10B981] hover:bg-[#059669] disabled:opacity-50 rounded-lg font-medium transition-colors"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/admin/users')}
                  className="px-6 py-2 bg-[#334155] hover:bg-[#475569] rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>

            <div className="mt-8 pt-8 border-t border-[#334155]">
              <h2 className="text-xl font-bold mb-4">User Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#0f172a] p-4 rounded-lg">
                  <p className="text-[#94a3b8] text-sm">Orders</p>
                  <p className="text-2xl font-bold">{user._count?.orders || 0}</p>
                </div>
                <div className="bg-[#0f172a] p-4 rounded-lg">
                  <p className="text-[#94a3b8] text-sm">Gigs</p>
                  <p className="text-2xl font-bold">{user._count?.gigs || 0}</p>
                </div>
                <div className="bg-[#0f172a] p-4 rounded-lg">
                  <p className="text-[#94a3b8] text-sm">Products</p>
                  <p className="text-2xl font-bold">{user._count?.products || 0}</p>
                </div>
                <div className="bg-[#0f172a] p-4 rounded-lg">
                  <p className="text-[#94a3b8] text-sm">Reviews</p>
                  <p className="text-2xl font-bold">{user._count?.reviews || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminSidebarLayout>
  )
}
