'use client'

import { useEffect, useState } from 'react'
import { Package, Search, Plus, Eye, Edit, Trash2, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'
import AdminSidebarLayout from '../AdminSidebarLayout'

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    categoryId: '',
    stockStatus: '',
    isActive: '',
    page: 1
  })
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 })

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [filters])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/products/categories')
      if (res.ok) setCategories(await res.json())
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString())
      })
      const res = await fetch(`/api/admin/products?${params}`)
      if (res.ok) {
        const data = await res.json()
        setProducts(data.products)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      if (res.ok) fetchProducts()
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  return (
    <AdminSidebarLayout>
      <div className="min-h-screen bg-[#0a192f] text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-[#10B981]" />
              <h1 className="text-3xl font-bold">Product Management</h1>
            </div>
            <button
              onClick={() => router.push('/admin/products/new')}
              className="flex items-center gap-2 px-4 py-2 bg-[#10B981] hover:bg-[#059669] rounded-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          </div>

          <div className="bg-[#1e293b] rounded-lg p-4 mb-6 flex gap-4 flex-wrap">
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              className="flex-1 min-w-[200px] px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
            />
            <select
              value={filters.categoryId}
              onChange={(e) => setFilters({ ...filters, categoryId: e.target.value, page: 1 })}
              className="px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
            >
              <option value="">All Categories</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
            <select
              value={filters.stockStatus}
              onChange={(e) => setFilters({ ...filters, stockStatus: e.target.value, page: 1 })}
              className="px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
            >
              <option value="">All Stock Status</option>
              <option value="IN_STOCK">In Stock</option>
              <option value="LOW_STOCK">Low Stock</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
            </select>
            <select
              value={filters.isActive}
              onChange={(e) => setFilters({ ...filters, isActive: e.target.value, page: 1 })}
              className="px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981] mx-auto"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 bg-[#1e293b] rounded-lg">
              <Package className="w-16 h-16 text-[#475569] mx-auto mb-4" />
              <p className="text-[#94a3b8] mb-4">No products found</p>
              <button
                onClick={() => router.push('/admin/products/new')}
                className="px-6 py-2 bg-[#10B981] hover:bg-[#059669] rounded-lg transition-all"
              >
                Create First Product
              </button>
            </div>
          ) : (
            <>
              <div className="bg-[#1e293b] rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#0f172a]">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[#cbd5e1]">Product</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[#cbd5e1]">ID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[#cbd5e1]">Category</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[#cbd5e1]">Price</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[#cbd5e1]">Stock</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[#cbd5e1]">Status</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-[#cbd5e1]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#334155]">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-[#0f172a] transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#0f172a] rounded-lg flex items-center justify-center overflow-hidden">
                              {product.images?.[0] ? (
                                <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                              ) : (
                                <Package className="w-6 h-6 text-[#475569]" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-white">{product.title}</p>
                              {product.isFeatured && <span className="text-xs text-[#F59E0B]">★ Featured</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[#94a3b8]">{product.id.slice(0, 8)}</td>
                        <td className="px-4 py-3 text-[#94a3b8]">{product.category || '-'}</td>
                        <td className="px-4 py-3 text-[#10B981] font-semibold">KES {product.price.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-white">{product.stock}</p>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              product.stock > 10 ? 'bg-green-500/20 text-green-400' :
                              product.stock > 0 ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs ${product.isActive ? 'bg-[#10B981] text-white' : 'bg-[#6B7280] text-white'}`}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => router.push(`/admin/products/${product.id}`)} className="p-2 hover:bg-[#334155] rounded transition-colors">
                              <Eye className="w-4 h-4 text-[#3B82F6]" />
                            </button>
                            <button onClick={() => router.push(`/admin/products/${product.id}/edit`)} className="p-2 hover:bg-[#334155] rounded transition-colors">
                              <Edit className="w-4 h-4 text-[#10B981]" />
                            </button>
                            <button onClick={() => deleteProduct(product.id)} className="p-2 hover:bg-[#334155] rounded transition-colors">
                              <Trash2 className="w-4 h-4 text-[#EF4444]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-[#94a3b8]">Showing {products.length} of {pagination.total} products</p>
                  <div className="flex gap-2">
                    <button
                      disabled={pagination.page === 1}
                      onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}
                      className="px-4 py-2 bg-[#1e293b] hover:bg-[#334155] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Previous
                    </button>
                    <button
                      disabled={pagination.page === pagination.totalPages}
                      onClick={() => setFilters({ ...filters, page: pagination.page + 1 })}
                      className="px-4 py-2 bg-[#1e293b] hover:bg-[#334155] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminSidebarLayout>
  )
}