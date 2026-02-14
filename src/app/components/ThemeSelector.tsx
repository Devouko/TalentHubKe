"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Palette, Check } from 'lucide-react'

const themes = [
  { name: 'Default', value: 'default', colors: ['bg-slate-900', 'bg-slate-800', 'bg-indigo-600'] },
  { name: 'Blue', value: 'blue', colors: ['bg-blue-900', 'bg-blue-800', 'bg-blue-600'] },
  { name: 'Green', value: 'green', colors: ['bg-emerald-900', 'bg-emerald-800', 'bg-emerald-600'] },
  { name: 'Purple', value: 'purple', colors: ['bg-purple-900', 'bg-purple-800', 'bg-purple-600'] }
]

export function ThemeSelector() {
  const { data: session } = useSession()
  const [theme, setTheme] = useState('default')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session) {
      fetch('/api/theme')
        .then(res => res.json())
        .then(data => setTheme(data.theme || 'default'))
        .catch(() => setTheme('default'))
    }
  }, [session])

  const handleThemeChange = async (newTheme: string) => {
    if (!session) return
    
    setLoading(true)
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    
    try {
      await fetch('/api/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: newTheme })
      })
    } catch (error) {
      console.error('Failed to save theme:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!session) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Theme</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {themes.map((themeOption) => (
          <button
            key={themeOption.value}
            onClick={() => handleThemeChange(themeOption.value)}
            disabled={loading}
            className={`p-4 rounded-lg border-2 transition-all hover:scale-105 disabled:opacity-50 ${
              theme === themeOption.value 
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{themeOption.name}</span>
              {theme === themeOption.value && (
                <Check className="w-4 h-4 text-indigo-600" />
              )}
            </div>
            <div className="flex gap-1">
              {themeOption.colors.map((color, index) => (
                <div key={index} className={`w-6 h-6 rounded ${color}`} />
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}