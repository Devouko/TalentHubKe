'use client'

import { useState } from 'react'
import { Palette, Save } from 'lucide-react'
import AdminSidebarLayout from '../AdminSidebarLayout'

export default function AdminThemePage() {
  const [themeSettings, setThemeSettings] = useState({
    primaryColor: '#8b5cf6',
    secondaryColor: '#ec4899',
    backgroundColor: '#000000',
    textColor: '#ffffff'
  })

  const handleColorChange = (key, value) => {
    setThemeSettings(prev => ({ ...prev, [key]: value }))
    document.documentElement.style.setProperty(`--${key}`, value)
  }

  const saveTheme = () => {
    localStorage.setItem('admin-theme-settings', JSON.stringify(themeSettings))
    alert('Theme settings saved!')
  }

  return (
    <AdminSidebarLayout>
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Palette className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold">Theme Management</h1>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-6">Color Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Primary Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={themeSettings.primaryColor}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    className="w-12 h-12 rounded border border-gray-600"
                  />
                  <input
                    type="text"
                    value={themeSettings.primaryColor}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Secondary Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={themeSettings.secondaryColor}
                    onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                    className="w-12 h-12 rounded border border-gray-600"
                  />
                  <input
                    type="text"
                    value={themeSettings.secondaryColor}
                    onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                    className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Background Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={themeSettings.backgroundColor}
                    onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                    className="w-12 h-12 rounded border border-gray-600"
                  />
                  <input
                    type="text"
                    value={themeSettings.backgroundColor}
                    onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                    className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Text Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={themeSettings.textColor}
                    onChange={(e) => handleColorChange('textColor', e.target.value)}
                    className="w-12 h-12 rounded border border-gray-600"
                  />
                  <input
                    type="text"
                    value={themeSettings.textColor}
                    onChange={(e) => handleColorChange('textColor', e.target.value)}
                    className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={saveTheme}
                className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save Theme Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminSidebarLayout>
  )
}