'use client'

import { useEffect, useState } from 'react'
import { FolderOpen, Plus, Edit, Trash2 } from 'lucide-react'
import AdminSidebarLayout from '../../AdminSidebarLayout'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', isActive: true })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/products/categories')
      if (res.ok) setCategories(await res.json())
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingId ? `/api/admin/products/categories/${editingId}` : '/api/admin/products/categories'
      const method = editingId ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setShowModal(false)
        setEditingId(null)
        setFormData({ name: '', slug: '', description: '', isActive: true })
        fetchCategories()
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to save category')
      }
    } catch (error) {
      alert('Failed to save category')
    }
  }

  const handleEdit = (category: any) => {
    setEditingId(category.id)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      isActive: category.isActive
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return
    try {
      const res = await fetch(`/api/admin/products/categories/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchCategories()
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to delete category')
      }
    } catch (error) {
      alert('Failed to delete category')
    }
  }

  return (
    <AdminSidebarLayout>
      <div className="min-h-screen bg-[#0a192f] text-white p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <FolderOpen className="w-8 h-8 text-[#10B981]" />
              <h1 className="text-3xl font-bold">Product Categories</h1>
            </div>
            <button
              onClick={() => {
                setEditingId(null)
                setFormData({ name: '', slug: '', description: '', isActive: true })
                setShowModal(true)
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#10B981] hover:bg-[#059669] rounded-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Category
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981] mx-auto"></div>
            </div>
          ) : (
            <div className="bg-[#1e293b] rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#0f172a]">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#cbd5e1]">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#cbd5e1]">Slug</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#cbd5e1]">Products</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#cbd5e1]">Status</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-[#cbd5e1]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#334155]">
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-[#0f172a] transition-colors">
                      <td className="px-4 py-3 text-white font-medium">{category.name}</td>
                      <td className="px-4 py-3 text-[#94a3b8]">{category.slug}</td>
                      <td className="px-4 py-3 text-[#94a3b8]">{category._count?.products || 0}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${category.isActive ? 'bg-[#10B981] text-white' : 'bg-[#6B7280] text-white'}`}>
                          {category.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleEdit(category)} className="p-2 hover:bg-[#334155] rounded transition-colors">
                            <Edit className="w-4 h-4 text-[#10B981]" />
                          </button>
                          <button onClick={() => handleDelete(category.id)} className="p-2 hover:bg-[#334155] rounded transition-colors">
                            <Trash2 className="w-4 h-4 text-[#EF4444]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {showModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-[#1e293b] rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Category' : 'Create Category'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#cbd5e1] mb-2">Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      className="w-full px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#cbd5e1] mb-2">Slug *</label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#cbd5e1] mb-2">Description</label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="w-4 h-4 text-[#10B981] bg-[#0f172a] border-[#334155] rounded focus:ring-[#10B981]"
                      />
                      <span className="text-sm text-[#cbd5e1]">Active</span>
                    </label>
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-[#10B981] hover:bg-[#059669] rounded-lg font-semibold transition-all"
                    >
                      {editingId ? 'Update' : 'Create'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-2 bg-[#475569] hover:bg-[#334155] rounded-lg font-semibold transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminSidebarLayout>
  )
}
