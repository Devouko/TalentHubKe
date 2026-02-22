'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Edit, Trash2, Package } from 'lucide-react'
import AdminSidebarLayout from '../../AdminSidebarLayout'
import { getStockStatusColor, getChangeTypeLabel } from '@/lib/utils/stock-helpers'
import { formatPrice } from '@/lib/utils/product-helpers'

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [stockHistory, setStockHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProduct()
    fetchStockHistory()
  }, [])

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/admin/products/${params.id}`)
      if (res.ok) setProduct(await res.json())
    } catch (error) {
      console.error('Failed to fetch product:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStockHistory = async () => {
    try {
      const res = await fetch(`/api/admin/products/${params.id}/stock?limit=10`)
      if (res.ok) {
        const data = await res.json()
        setStockHistory(data.history)
      }
    } catch (error) {
      console.error('Failed to fetch stock history:', error)
    }
  }

  const deleteProduct = async () => {
    if (!confirm('Delete this product?')) return
    try {
      const res = await fetch(`/api/admin/products/${params.id}`, { method: 'DELETE' })
      if (res.ok) router.push('/admin/products')
    } catch (error) {
      alert('Failed to delete product')
    }
  }

  if (loading) {
    return (
      <AdminSidebarLayout>
        <div className="min-h-screen bg-[#0a192f] text-white p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981]"></div>
        </div>
      </AdminSidebarLayout>
    )
  }

  if (!product) {
    return (
      <AdminSidebarLayout>
        <div className="min-h-screen bg-[#0a192f] text-white p-6">
          <p>Product not found</p>
        </div>
      </AdminSidebarLayout>
    )
  }

  return (
    <AdminSidebarLayout>
      <div className="min-h-screen bg-[#0a192f] text-white p-6">
        <div className="max-w-6xl mx-auto">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-[#94a3b8] hover:text-white mb-6">
            <ArrowLeft className="w-5 h-5" /> Back
          </button>

          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex gap-2">
              <button
                onClick={() => router.push(`/admin/products/${params.id}/edit`)}
                className="flex items-center gap-2 px-4 py-2 bg-[#10B981] hover:bg-[#059669] rounded-lg transition-all"
              >
                <Edit className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={deleteProduct}
                className="flex items-center gap-2 px-4 py-2 bg-[#EF4444] hover:bg-[#DC2626] rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              <div className="bg-[#1e293b] rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Product Details</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#94a3b8]">SKU:</span>
                    <span className="font-medium">{product.sku}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94a3b8]">Category:</span>
                    <span className="font-medium">{product.category?.name || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94a3b8]">Brand:</span>
                    <span className="font-medium">{product.brand || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94a3b8]">Price:</span>
                    <span className="font-medium text-[#10B981]">{formatPrice(product.price)}</span>
                  </div>
                  {product.comparePrice && (
                    <div className="flex justify-between">
                      <span className="text-[#94a3b8]">Compare Price:</span>
                      <span className="font-medium line-through">{formatPrice(product.comparePrice)}</span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-[#334155]">
                    <p className="text-[#94a3b8] mb-2">Description:</p>
                    <p className="text-white">{product.description}</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#1e293b] rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Stock History</h2>
                <div className="space-y-2">
                  {stockHistory.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 bg-[#0f172a] rounded-lg">
                      <div>
                        <p className="font-medium">{getChangeTypeLabel(entry.changeType)}</p>
                        <p className="text-sm text-[#94a3b8]">{new Date(entry.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${entry.quantityChange > 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                          {entry.quantityChange > 0 ? '+' : ''}{entry.quantityChange}
                        </p>
                        <p className="text-sm text-[#94a3b8]">{entry.previousQuantity} → {entry.newQuantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-[#1e293b] rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Stock Status</h2>
                <div className="text-center">
                  <p className="text-4xl font-bold mb-2">{product.quantity}</p>
                  <span className={`inline-block px-3 py-1 rounded text-sm ${getStockStatusColor(product.stockStatus)}`}>
                    {product.stockStatus.replace('_', ' ')}
                  </span>
                  <p className="text-sm text-[#94a3b8] mt-4">Low Stock Threshold: {product.lowStockThreshold}</p>
                </div>
              </div>

              <div className="bg-[#1e293b] rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Status</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[#94a3b8]">Active:</span>
                    <span className={`px-2 py-1 rounded text-xs ${product.isActive ? 'bg-[#10B981]' : 'bg-[#6B7280]'}`}>
                      {product.isActive ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#94a3b8]">Featured:</span>
                    <span className={`px-2 py-1 rounded text-xs ${product.isFeatured ? 'bg-[#F59E0B]' : 'bg-[#6B7280]'}`}>
                      {product.isFeatured ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#94a3b8]">Digital:</span>
                    <span>{product.isDigital ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminSidebarLayout>
  )
}
