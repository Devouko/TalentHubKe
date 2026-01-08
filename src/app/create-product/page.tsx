'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Plus, X, DollarSign, Package, Truck } from 'lucide-react'

const productCategories = [
  'Electronics & Gadgets',
  'Fashion & Clothing',
  'Home & Garden',
  'Health & Beauty',
  'Sports & Fitness',
  'Books & Media',
  'Art & Crafts',
  'Digital Products'
]

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
      const response = await fetch('/api/gigs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          deliveryTime: formData.shippingTime || '7'
        })
      })

      if (response.ok) {
        router.push('/seller-dashboard')
      }
    } catch (error) {
      console.error('Failed to create product:', error)
    } finally {
      setLoading(false)
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const addFeature = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }))
      setFeatureInput('')
    }
  }

  const removeFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }))
  }

  if (!session) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to create a product</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white pt-20 px-4" style={{ backgroundColor: 'var(--primary)' }}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--secondary)' }}>
            Create New Product
          </h1>
          <p className="text-gray-400">List your product and start selling</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="p-6 border rounded-xl" style={{ 
            backgroundColor: 'var(--neutral)', 
            borderColor: 'rgba(127, 255, 0, 0.2)' 
          }}>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Basic Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Product Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: 'var(--primary)', 
                    borderColor: 'var(--accent)', 
                    color: 'var(--text-primary)',
                    '--tw-ring-color': 'var(--accent)'
                  }}
                  placeholder="Premium Wireless Headphones"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: 'var(--primary)', 
                    borderColor: 'var(--accent)', 
                    color: 'var(--text-primary)',
                    '--tw-ring-color': 'var(--accent)'
                  }}
                  placeholder="Describe your product in detail..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: 'var(--primary)', 
                      borderColor: 'var(--accent)', 
                      color: 'var(--text-primary)'
                    }}
                  >
                    <option value="">Select Category</option>
                    {productCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Product Type</label>
                  <select
                    value={formData.productType}
                    onChange={(e) => setFormData(prev => ({ ...prev, productType: e.target.value }))}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: 'var(--primary)', 
                      borderColor: 'var(--accent)', 
                      color: 'var(--text-primary)'
                    }}
                  >
                    <option value="Physical Product">Physical Product</option>
                    <option value="Digital Download">Digital Download</option>
                    <option value="Service">Service</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border rounded-xl" style={{ 
            backgroundColor: 'var(--neutral)', 
            borderColor: 'rgba(127, 255, 0, 0.2)' 
          }}>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Pricing & Inventory
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Price (KES)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: 'var(--primary)', 
                    borderColor: 'var(--accent)', 
                    color: 'var(--text-primary)'
                  }}
                  placeholder="2500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Compare Price (Optional)</label>
                <input
                  type="number"
                  min="1"
                  value={formData.comparePrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, comparePrice: e.target.value }))}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: 'var(--primary)', 
                    borderColor: 'var(--accent)', 
                    color: 'var(--text-primary)'
                  }}
                  placeholder="3000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Stock Quantity</label>
                <input
                  type="number"
                  min="0"
                  value={formData.inventory}
                  onChange={(e) => setFormData(prev => ({ ...prev, inventory: e.target.value }))}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: 'var(--primary)', 
                    borderColor: 'var(--accent)', 
                    color: 'var(--text-primary)'
                  }}
                  placeholder="50"
                />
              </div>
            </div>
          </div>

          <div className="p-6 border rounded-xl" style={{ 
            backgroundColor: 'var(--neutral)', 
            borderColor: 'rgba(127, 255, 0, 0.2)' 
          }}>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Shipping
            </h2>
            
            <div>
              <label className="block text-sm font-medium mb-2">Shipping Time (days)</label>
              <input
                type="number"
                min="1"
                value={formData.shippingTime}
                onChange={(e) => setFormData(prev => ({ ...prev, shippingTime: e.target.value }))}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: 'var(--primary)', 
                  borderColor: 'var(--accent)', 
                  color: 'var(--text-primary)'
                }}
                placeholder="3"
              />
            </div>
          </div>

          <div className="p-6 border rounded-xl" style={{ 
            backgroundColor: 'var(--neutral)', 
            borderColor: 'rgba(127, 255, 0, 0.2)' 
          }}>
            <h2 className="text-xl font-semibold mb-4">Product Features</h2>
            
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: 'var(--primary)', 
                  borderColor: 'var(--accent)', 
                  color: 'var(--text-primary)'
                }}
                placeholder="Add a feature"
              />
              <motion.button
                type="button"
                onClick={addFeature}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-lg"
                style={{ backgroundColor: 'var(--secondary)' }}
              >
                <Plus className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.features.map(feature => (
                <motion.span
                  key={feature}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 px-3 py-1 border rounded-full text-sm"
                  style={{ 
                    backgroundColor: 'rgba(127, 255, 0, 0.2)', 
                    borderColor: 'rgba(127, 255, 0, 0.3)' 
                  }}
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeFeature(feature)}
                    className="hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              ))}
            </div>
          </div>

          <div className="p-6 border rounded-xl" style={{ 
            backgroundColor: 'var(--neutral)', 
            borderColor: 'rgba(127, 255, 0, 0.2)' 
          }}>
            <h2 className="text-xl font-semibold mb-4">Tags</h2>
            
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: 'var(--primary)', 
                  borderColor: 'var(--accent)', 
                  color: 'var(--text-primary)'
                }}
                placeholder="Add a tag"
              />
              <motion.button
                type="button"
                onClick={addTag}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-lg"
                style={{ backgroundColor: 'var(--secondary)' }}
              >
                <Plus className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 px-3 py-1 border rounded-full text-sm"
                  style={{ 
                    backgroundColor: 'rgba(127, 255, 0, 0.2)', 
                    borderColor: 'rgba(127, 255, 0, 0.3)' 
                  }}
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              ))}
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-xl font-semibold disabled:opacity-50"
            style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}
          >
            {loading ? 'Creating Product...' : 'Create Product'}
          </motion.button>
        </motion.form>
      </div>
    </div>
  )
}