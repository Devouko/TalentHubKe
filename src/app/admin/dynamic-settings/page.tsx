'use client'

import { useState, useEffect } from 'react'
import { Layers, Globe, Image, Plus, Trash2, Save, MoveUp, MoveDown } from 'lucide-react'
import AdminSidebarLayout from '../AdminSidebarLayout'

export default function DynamicSettingsPage() {
  const [categories, setCategories] = useState([])
  const [platform, setPlatform] = useState({ platformName: '', platformTagline: '', primaryColor: '', secondaryColor: '' })
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [catRes, platRes, offRes] = await Promise.all([
        fetch('/api/admin/categories'),
        fetch('/api/admin/platform'),
        fetch('/api/admin/offers')
      ])
      setCategories(await catRes.json())
      setPlatform(await platRes.json())
      setOffers(await offRes.json())
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveCategory = async (cat) => {
    const method = cat.id ? 'PUT' : 'POST'
    await fetch('/api/admin/categories', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cat)
    })
    fetchData()
  }

  const deleteCategory = async (id) => {
    await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' })
    fetchData()
  }

  const savePlatform = async () => {
    await fetch('/api/admin/platform', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(platform)
    })
    alert('Platform settings saved!')
  }

  const saveOffer = async (offer) => {
    const method = offer.id ? 'PUT' : 'POST'
    await fetch('/api/admin/offers', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(offer)
    })
    fetchData()
  }

  const deleteOffer = async (id) => {
    await fetch(`/api/admin/offers?id=${id}`, { method: 'DELETE' })
    fetchData()
  }

  const moveItem = (arr, idx, dir) => {
    const newArr = [...arr]
    const newIdx = idx + dir
    if (newIdx < 0 || newIdx >= arr.length) return arr
    ;[newArr[idx], newArr[newIdx]] = [newArr[newIdx], newArr[idx]]
    newArr.forEach((item, i) => item.order = i)
    return newArr
  }

  if (loading) return <AdminSidebarLayout><div className="p-6 text-white">Loading...</div></AdminSidebarLayout>

  return (
    <AdminSidebarLayout>
      <div className="min-h-screen bg-black text-white p-6">
        <h1 className="text-3xl font-bold mb-8">Dynamic Settings</h1>

        {/* Platform Settings */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold">Platform Settings</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Platform Name"
              value={platform.platformName}
              onChange={(e) => setPlatform({ ...platform, platformName: e.target.value })}
              className="p-3 bg-gray-700 rounded-lg"
            />
            <input
              placeholder="Tagline"
              value={platform.platformTagline}
              onChange={(e) => setPlatform({ ...platform, platformTagline: e.target.value })}
              className="p-3 bg-gray-700 rounded-lg"
            />
            <input
              type="color"
              value={platform.primaryColor}
              onChange={(e) => setPlatform({ ...platform, primaryColor: e.target.value })}
              className="p-3 bg-gray-700 rounded-lg"
            />
            <input
              type="color"
              value={platform.secondaryColor}
              onChange={(e) => setPlatform({ ...platform, secondaryColor: e.target.value })}
              className="p-3 bg-gray-700 rounded-lg"
            />
          </div>
          <button onClick={savePlatform} className="mt-4 bg-purple-600 px-6 py-2 rounded-lg flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Platform
          </button>
        </div>

        {/* Categories */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold">Categories</h2>
            </div>
            <button
              onClick={() => setCategories([...categories, { name: '', description: '', icon: '', image: '', order: categories.length, isActive: true }])}
              className="bg-purple-600 px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          {categories.map((cat, idx) => (
            <div key={idx} className="bg-gray-700 p-4 rounded-lg mb-3 grid grid-cols-6 gap-3 items-center">
              <input
                placeholder="Name"
                value={cat.name}
                onChange={(e) => {
                  const newCats = [...categories]
                  newCats[idx].name = e.target.value
                  setCategories(newCats)
                }}
                className="p-2 bg-gray-600 rounded col-span-2"
              />
              <input
                placeholder="Icon"
                value={cat.icon || ''}
                onChange={(e) => {
                  const newCats = [...categories]
                  newCats[idx].icon = e.target.value
                  setCategories(newCats)
                }}
                className="p-2 bg-gray-600 rounded"
              />
              <input
                placeholder="Image URL"
                value={cat.image || ''}
                onChange={(e) => {
                  const newCats = [...categories]
                  newCats[idx].image = e.target.value
                  setCategories(newCats)
                }}
                className="p-2 bg-gray-600 rounded"
              />
              <div className="flex gap-2">
                <button onClick={() => setCategories(moveItem(categories, idx, -1))} className="p-2 bg-gray-600 rounded">
                  <MoveUp className="w-4 h-4" />
                </button>
                <button onClick={() => setCategories(moveItem(categories, idx, 1))} className="p-2 bg-gray-600 rounded">
                  <MoveDown className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-2">
                <button onClick={() => saveCategory(cat)} className="p-2 bg-green-600 rounded">
                  <Save className="w-4 h-4" />
                </button>
                <button onClick={() => deleteCategory(cat.id)} className="p-2 bg-red-600 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Offer Carousel */}
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Image className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold">Offer Carousel</h2>
            </div>
            <button
              onClick={() => setOffers([...offers, { title: '', description: '', image: '', link: '', buttonText: 'Learn More', order: offers.length, isActive: true }])}
              className="bg-purple-600 px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          {offers.map((offer, idx) => (
            <div key={idx} className="bg-gray-700 p-4 rounded-lg mb-3">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                  placeholder="Title"
                  value={offer.title}
                  onChange={(e) => {
                    const newOffers = [...offers]
                    newOffers[idx].title = e.target.value
                    setOffers(newOffers)
                  }}
                  className="p-2 bg-gray-600 rounded"
                />
                <input
                  placeholder="Button Text"
                  value={offer.buttonText}
                  onChange={(e) => {
                    const newOffers = [...offers]
                    newOffers[idx].buttonText = e.target.value
                    setOffers(newOffers)
                  }}
                  className="p-2 bg-gray-600 rounded"
                />
                <input
                  placeholder="Image URL"
                  value={offer.image}
                  onChange={(e) => {
                    const newOffers = [...offers]
                    newOffers[idx].image = e.target.value
                    setOffers(newOffers)
                  }}
                  className="p-2 bg-gray-600 rounded"
                />
                <input
                  placeholder="Link"
                  value={offer.link || ''}
                  onChange={(e) => {
                    const newOffers = [...offers]
                    newOffers[idx].link = e.target.value
                    setOffers(newOffers)
                  }}
                  className="p-2 bg-gray-600 rounded"
                />
              </div>
              <textarea
                placeholder="Description"
                value={offer.description || ''}
                onChange={(e) => {
                  const newOffers = [...offers]
                  newOffers[idx].description = e.target.value
                  setOffers(newOffers)
                }}
                className="p-2 bg-gray-600 rounded w-full mb-3"
                rows={2}
              />
              <div className="flex gap-2">
                <button onClick={() => setOffers(moveItem(offers, idx, -1))} className="p-2 bg-gray-600 rounded">
                  <MoveUp className="w-4 h-4" />
                </button>
                <button onClick={() => setOffers(moveItem(offers, idx, 1))} className="p-2 bg-gray-600 rounded">
                  <MoveDown className="w-4 h-4" />
                </button>
                <button onClick={() => saveOffer(offer)} className="p-2 bg-green-600 rounded">
                  <Save className="w-4 h-4" />
                </button>
                <button onClick={() => deleteOffer(offer.id)} className="p-2 bg-red-600 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminSidebarLayout>
  )
}
