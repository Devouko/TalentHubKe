'use client'

import { useEffect, useState } from 'react'
import { Package, TrendingUp, TrendingDown } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import AdminSidebarLayout from '../../../AdminSidebarLayout'
import { getStockStatusColor, getChangeTypeLabel } from '@/lib/utils/stock-helpers'

export default function StockManagementPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    changeType: 'ADJUSTMENT',
    quantityChange: 0,
    reason: '',
    notes: ''
  })

  useEffect(() => {
    fetchProduct()
    fetchHistory()
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

  const fetchHistory = async () => {
    try {
      const res = await fetch(`/api/admin/products/${params.id}/stock`)
      if (res.ok) {
        const data = await res.json()
        setHistory(data.history)
      }
    } catch (error) {
      console.error('Failed to fetch history:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/admin/products/${params.id}/stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          quantityChange: Number(formData.quantityChange)
        })
      })
      if (res.ok) {
        setFormData({ changeType: 'ADJUSTMENT', quantityChange: 0, reason: '', notes: '' })
        fetchProduct()
        fetchHistory()
      } else {
        alert('Failed to adjust stock')
      }
    } catch (error) {
      alert('Failed to adjust stock')
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

  return (
    <AdminSidebarLayout>
      <div className="min-h-screen bg-[#0a192f] text-white p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Package className="w-8 h-8 text-[#10B981]" />
            <div>
              <h1 className="text-3xl font-bold">Stock Management</h1>
              <p className="text-[#94a3b8]">{product?.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#1e293b] rounded-lg p-6 text-center">
              <p className="text-[#94a3b8] text-sm mb-2">Current Stock</p>
              <p className="text-4xl font-bold text-white">{product?.quantity}</p>
            </div>
            <div className="bg-[#1e293b] rounded-lg p-6 text-center">
              <p className="text-[#94a3b8] text-sm mb-2">Stock Status</p>
              <span className={`inline-block px-4 py-2 rounded text-lg font-semibold ${getStockStatusColor(product?.stockStatus)}`}>
                {product?.stockStatus.replace('_', ' ')}
              </span>
            </div>
            <div className="bg-[#1e293b] rounded-lg p-6 text-center">
              <p className="text-[#94a3b8] text-sm mb-2">Low Stock Threshold</p>
              <p className="text-4xl font-bold text-[#F59E0B]">{product?.lowStockThreshold}</p>
            </div>
          </div>

          <div className="bg-[#1e293b] rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Adjust Stock</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#cbd5e1] mb-2">Change Type</label>
                  <select
                    value={formData.changeType}
                    onChange={(e) => setFormData({ ...formData, changeType: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white"
                  >
                    <option value="ADJUSTMENT">Adjustment</option>
                    <option value="PURCHASE">Purchase</option>
                    <option value="SALE">Sale</option>
                    <option value="RETURN">Return</option>
                    <option value="DAMAGE">Damage</option>
                    <option value="TRANSFER">Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#cbd5e1] mb-2">Quantity Change</label>
                  <input
                    type="number"
                    required
                    value={formData.quantityChange}
                    onChange={(e) => setFormData({ ...formData, quantityChange: Number(e.target.value) })}
                    className="w-full px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white"
                    placeholder="Use negative for decrease"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#cbd5e1] mb-2">Reason</label>
                <input
                  type="text"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#cbd5e1] mb-2">Notes</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#10B981] hover:bg-[#059669] rounded-lg font-semibold transition-all"
                >
                  Apply Adjustment
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3 bg-[#475569] hover:bg-[#334155] rounded-lg font-semibold transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          <div className="bg-[#1e293b] rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Stock History</h2>
            <div className="space-y-3">
              {history.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-[#0f172a] rounded-lg">
                  <div className="flex items-center gap-4">
                    {item.quantityChange > 0 ? (
                      <TrendingUp className="w-6 h-6 text-[#10B981]" />
                    ) : (
                      <TrendingDown className="w-6 h-6 text-[#EF4444]" />
                    )}
                    <div>
                      <p className="text-white font-medium">{getChangeTypeLabel(item.changeType)}</p>
                      <p className="text-[#94a3b8] text-sm">{item.reason || '-'}</p>
                      {item.notes && <p className="text-[#94a3b8] text-xs mt-1">{item.notes}</p>}
                      <p className="text-[#94a3b8] text-xs mt-1">
                        By: {item.createdBy?.name || 'System'} • {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${item.quantityChange > 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                      {item.quantityChange > 0 ? '+' : ''}{item.quantityChange}
                    </p>
                    <p className="text-[#94a3b8] text-sm">{item.previousQuantity} → {item.newQuantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminSidebarLayout>
  )
}
