'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, X } from 'lucide-react'
import { slugify, generateSKU } from '@/lib/utils/product-helpers'
import { CATEGORY_OPTIONS, CATEGORY_DETAILS } from '@/constants/categories'
import { toast } from 'sonner'

interface ProductFormProps {
  mode: 'create' | 'edit'
  initialData?: any
}

export default function ProductForm({ mode, initialData }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [categories, setCategories] = useState<any[]>(CATEGORY_OPTIONS.map(cat => ({
    id: cat,
    name: CATEGORY_DETAILS[cat].name
  })))
  const [imageUrls, setImageUrls] = useState<string[]>(initialData?.images?.map((img: any) => img.url) || [])
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    sku: initialData?.sku || generateSKU(),
    description: initialData?.description || '',
    shortDescription: initialData?.shortDescription || '',
    price: initialData?.price || '',
    comparePrice: initialData?.comparePrice || '',
    costPrice: initialData?.costPrice || '',
    quantity: initialData?.quantity || 0,
    lowStockThreshold: initialData?.lowStockThreshold || 10,
    trackInventory: initialData?.trackInventory ?? true,
    isDigital: initialData?.isDigital ?? false,
    categoryId: initialData?.categoryId || '',
    brand: initialData?.brand || '',
    tags: initialData?.tags?.join(', ') || '',
    metaTitle: initialData?.metaTitle || '',
    metaDescription: initialData?.metaDescription || '',
    isActive: initialData?.isActive ?? true,
    isFeatured: initialData?.isFeatured ?? false
  })

  useEffect(() => {
    // Categories are now loaded from constants
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    setUploading(true)
    try {
      const newUrls: string[] = []
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader()
        const url = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string)
          reader.readAsDataURL(files[i])
        })
        newUrls.push(url)
      }
      setImageUrls([...imageUrls, ...newUrls].slice(0, 10))
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.categoryId) {
      toast.error('Please select a category')
      return
    }
    
    if (imageUrls.length === 0) {
      toast.error('Please upload at least one product image')
      return
    }
    
    setLoading(true)

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        comparePrice: formData.comparePrice ? Number(formData.comparePrice) : null,
        costPrice: formData.costPrice ? Number(formData.costPrice) : null,
        quantity: Number(formData.quantity),
        lowStockThreshold: Number(formData.lowStockThreshold),
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        categoryId: formData.categoryId || null,
        images: imageUrls.map((url, index) => ({ url, alt: formData.name, position: index }))
      }

      const url = mode === 'create' ? '/api/admin/products' : `/api/admin/products/${initialData.id}`
      const method = mode === 'create' ? 'POST' : 'PATCH'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const responseData = await res.json()

      if (res.ok) {
        toast.success(`Product ${mode === 'create' ? 'created' : 'updated'} successfully`)
        router.push('/admin/products')
        router.refresh()
      } else {
        if (responseData.details && Array.isArray(responseData.details)) {
          const errorMessages = responseData.details.map((e: any) => {
            const path = Array.isArray(e.path) ? e.path.join('.') : String(e.path || '')
            return `${path}: ${e.message}`
          }).join(', ')
          toast.error(`Validation failed: ${errorMessages}`)
        } else {
          toast.error(responseData.error || 'Failed to save product')
        }
      }
    } catch (error) {
      toast.error('Failed to save product: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-[#1e293b] rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#cbd5e1] mb-2">Product Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: slugify(e.target.value) })}
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
            <label className="block text-sm font-medium text-[#cbd5e1] mb-2">SKU *</label>
            <input
              type="text"
              required
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
              className="w-full px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#cbd5e1] mb-2">Category *</label>
            <select
              required
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white"
            >
              <option value="">Select Category</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#cbd5e1] mb-2">Short Description</label>
            <input
              type="text"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              className="w-full px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#cbd5e1] mb-2">Description *</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#1e293b] rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Product Images</h2>
        <div className="space-y-4">
          <label className="flex items-center gap-2 px-4 py-2 bg-[#10B981] hover:bg-[#059669] rounded-lg cursor-pointer transition-all w-fit">
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'Uploading...' : `Choose Images (${imageUrls.length}/10)`}</span>
            <input type="file" multiple accept="image/*" onChange={handleImageUpload} disabled={uploading || imageUrls.length >= 10} className="hidden" />
          </label>
          {imageUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {imageUrls.map((url, i) => (
                <div key={i} className="relative group">
                  <img src={url} alt={`Product ${i + 1}`} className="w-full h-24 object-cover rounded-lg border border-[#334155]" />
                  <button type="button" onClick={() => setImageUrls(imageUrls.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 p-1 bg-[#EF4444] rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#1e293b] rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#cbd5e1] mb-2">Price (KES) *</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#cbd5e1] mb-2">Compare Price (KES)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.comparePrice}
              onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
              className="w-full px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#cbd5e1] mb-2">Cost Price (KES)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.costPrice}
              onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
              className="w-full px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#1e293b] rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Inventory</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#cbd5e1] mb-2">Quantity *</label>
            <input
              type="number"
              required
              min="0"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="w-full px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#cbd5e1] mb-2">Low Stock Threshold</label>
            <input
              type="number"
              min="0"
              value={formData.lowStockThreshold}
              onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
              className="w-full px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.trackInventory}
                onChange={(e) => setFormData({ ...formData, trackInventory: e.target.checked })}
                className="w-4 h-4 text-[#10B981] bg-[#0f172a] border-[#334155] rounded focus:ring-[#10B981]"
              />
              <span className="text-sm text-[#cbd5e1]">Track Inventory</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isDigital}
                onChange={(e) => setFormData({ ...formData, isDigital: e.target.checked })}
                className="w-4 h-4 text-[#10B981] bg-[#0f172a] border-[#334155] rounded focus:ring-[#10B981]"
              />
              <span className="text-sm text-[#cbd5e1]">Digital Product</span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-[#1e293b] rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Organization</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#cbd5e1] mb-2">Brand</label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#cbd5e1] mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] text-white"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#1e293b] rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Status</h2>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-[#10B981] bg-[#0f172a] border-[#334155] rounded focus:ring-[#10B981]"
            />
            <span className="text-sm text-[#cbd5e1]">Active</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="w-4 h-4 text-[#10B981] bg-[#0f172a] border-[#334155] rounded focus:ring-[#10B981]"
            />
            <span className="text-sm text-[#cbd5e1]">Featured</span>
          </label>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-[#10B981] hover:bg-[#059669] rounded-lg font-semibold disabled:opacity-50 transition-all"
        >
          {loading ? 'Saving...' : mode === 'create' ? 'Create Product' : 'Update Product'}
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
  )
}
