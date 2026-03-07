'use client'

import { CATEGORY_OPTIONS } from '@/constants/categories'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Plus, X, Package, Truck } from 'lucide-react'

const productCategories = CATEGORY_OPTIONS

export default function CreateProduct() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    comparePrice: '',
    category: '',
    productType: 'Physical Product',
    inventory: '',
    shippingTime: '',
    tags: [] as string[],
    features: [] as string[]
  })
  const [tagInput, setTagInput] = useState('')
  const [featureInput, setFeatureInput] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) return

    setLoading(true)
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
          category: formData.category,
          stock: parseInt(formData.inventory) || 0,
          shippingTime: parseInt(formData.shippingTime) || 3,
          tags: formData.tags,
          features: formData.features
        })
      })

      if (response.ok) {
        router.push('/seller-dashboard/products')
      }
    } catch (error) {
      console.error('Failed to create product:', error)
    } finally {
      setLoading(false)
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }))
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
  }

  const addFeature = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      setFormData(prev => ({ ...prev, features: [...prev.features, featureInput.trim()] }))
      setFeatureInput('')
    }
  }

  const removeFeature = (feature: string) => {
    setFormData(prev => ({ ...prev, features: prev.features.filter(f => f !== feature) }))
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-lg font-semibold mb-4">Please sign in to create a product</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-semibold mb-1">Create New Product</h1>
          <p className="text-sm text-gray-600">List your product and start selling</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="card p-4">
            <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
              <Package className="w-4 h-4" /> Basic Information
            </h2>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="Premium Wireless Headphones"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="Describe your product in detail..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">Category</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value="">Select Category</option>
                    {productCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-1">Product Type</label>
                  <select
                    value={formData.productType}
                    onChange={(e) => setFormData(prev => ({ ...prev, productType: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value="Physical Product">Physical Product</option>
                    <option value="Digital Download">Digital Download</option>
                    <option value="Service">Service</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h2 className="text-base font-semibold mb-3">Pricing & Inventory</h2>
            
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm mb-1">Price (KES)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="2500"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Compare Price</label>
                <input
                  type="number"
                  min="1"
                  value={formData.comparePrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, comparePrice: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="3000"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Stock Quantity</label>
                <input
                  type="number"
                  min="0"
                  value={formData.inventory}
                  onChange={(e) => setFormData(prev => ({ ...prev, inventory: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="50"
                />
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
              <Truck className="w-4 h-4" /> Shipping
            </h2>
            
            <div>
              <label className="block text-sm mb-1">Shipping Time (days)</label>
              <input
                type="number"
                min="1"
                value={formData.shippingTime}
                onChange={(e) => setFormData(prev => ({ ...prev, shippingTime: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                placeholder="3"
              />
            </div>
          </div>

          <div className="card p-4">
            <h2 className="text-base font-semibold mb-3">Product Features</h2>
            
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                className="flex-1 px-3 py-2 border rounded-lg text-sm"
                placeholder="Add a feature"
              />
              <button type="button" onClick={addFeature} className="btn-secondary">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.features.map(feature => (
                <span key={feature} className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs">
                  {feature}
                  <button type="button" onClick={() => removeFeature(feature)} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h2 className="text-base font-semibold mb-3">Tags</h2>
            
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 border rounded-lg text-sm"
                placeholder="Add a tag"
              />
              <button type="button" onClick={addTag} className="btn-secondary">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full btn-primary py-3">
            {loading ? 'Creating Product...' : 'Create Product'}
          </button>
        </form>
      </div>
    </div>
  )
}
