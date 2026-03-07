'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { PlusCircle, Plus } from 'lucide-react'
import AdminSidebarLayout from '../AdminSidebarLayout'

export default function AdminCreateGigPage() {
  const { data: session } = useSession()
  const [gigForm, setGigForm] = useState({
    title: '',
    description: '',
    category: 'Accounts',
    price: '',
    deliveryTime: '3',
    tags: '',
    requirements: '',
    image: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch('/api/gigs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...gigForm,
          sellerId: session?.user?.id,
          price: parseFloat(gigForm.price),
          deliveryTime: parseInt(gigForm.deliveryTime)
        })
      })
      
      if (response.ok) {
        setGigForm({
          title: '',
          description: '',
          category: 'Accounts',
          price: '',
          deliveryTime: '3',
          tags: '',
          requirements: '',
          image: ''
        })
        alert('Gig created successfully!')
      } else {
        alert('Failed to create gig')
      }
    } catch (error) {
      console.error('Error creating gig:', error)
      alert('Error creating gig')
    } finally {
      setLoading(false)
    }
  }

  const categories = ['Accounts', 'Digital-products', 'Proxies', 'Bulk_Gmails', 'KYC']
  const deliveryOptions = [
    { value: '1', label: '1 day' },
    { value: '3', label: '3 days' },
    { value: '7', label: '1 week' },
    { value: '14', label: '2 weeks' },
    { value: '30', label: '1 month' }
  ]

  return (
    <AdminSidebarLayout>
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <PlusCircle className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold">Create Gig</h1>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Gig Title</label>
                <input
                  type="text"
                  placeholder="I will create a professional service for your business"
                  value={gigForm.title}
                  onChange={(e) => setGigForm({...gigForm, title: e.target.value})}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    value={gigForm.category}
                    onChange={(e) => setGigForm({...gigForm, category: e.target.value})}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price (KES)</label>
                  <input
                    type="number"
                    placeholder="5000"
                    value={gigForm.price}
                    onChange={(e) => setGigForm({...gigForm, price: e.target.value})}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Delivery Time</label>
                  <select
                    value={gigForm.deliveryTime}
                    onChange={(e) => setGigForm({...gigForm, deliveryTime: e.target.value})}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    {deliveryOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={gigForm.image}
                    onChange={(e) => setGigForm({...gigForm, image: e.target.value})}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
                <input
                  type="text"
                  placeholder="service, professional, business"
                  value={gigForm.tags}
                  onChange={(e) => setGigForm({...gigForm, tags: e.target.value})}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  placeholder="Describe your service in detail..."
                  value={gigForm.description}
                  onChange={(e) => setGigForm({...gigForm, description: e.target.value})}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white h-32 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Requirements</label>
                <textarea
                  placeholder="What do you need from the buyer to get started?"
                  value={gigForm.requirements}
                  onChange={(e) => setGigForm({...gigForm, requirements: e.target.value})}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white h-24 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {loading ? 'Creating...' : 'Publish Gig'}
                {!loading && <Plus className="w-5 h-5" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminSidebarLayout>
  )
}