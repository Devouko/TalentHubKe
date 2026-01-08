'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Palette, Save, RotateCcw, Eye, Download, Upload } from 'lucide-react'

interface ThemeSettings {
  id: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  borderColor: string
  isActive: boolean
}

export default function ThemePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    id: '',
    primaryColor: '#3b82f6',
    secondaryColor: '#10b981',
    accentColor: '#8b5cf6',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    borderColor: '#e5e7eb',
    isActive: true
  })
  const [loading, setLoading] = useState(true)
  const [previewMode, setPreviewMode] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user?.userType !== 'ADMIN') {
      router.push('/auth')
      return
    }
    fetchThemeSettings()
  }, [session, status, router])

  const fetchThemeSettings = async () => {
    try {
      const response = await fetch('/api/admin/theme')
      if (response.ok) {
        const data = await response.json()
        if (data) {
          setThemeSettings(data)
        }
      }
    } catch (error) {
      console.error('Failed to fetch theme settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveThemeSettings = async () => {
    try {
      const response = await fetch('/api/admin/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(themeSettings)
      })
      
      if (response.ok) {
        alert('Theme settings saved successfully!')
        applyTheme()
      }
    } catch (error) {
      console.error('Failed to save theme settings:', error)
    }
  }

  const applyTheme = () => {
    const root = document.documentElement
    root.style.setProperty('--primary-color', themeSettings.primaryColor)
    root.style.setProperty('--secondary-color', themeSettings.secondaryColor)
    root.style.setProperty('--accent-color', themeSettings.accentColor)
    root.style.setProperty('--background-color', themeSettings.backgroundColor)
    root.style.setProperty('--text-color', themeSettings.textColor)
    root.style.setProperty('--border-color', themeSettings.borderColor)
  }

  const resetToDefaults = () => {
    setThemeSettings({
      ...themeSettings,
      primaryColor: '#3b82f6',
      secondaryColor: '#10b981',
      accentColor: '#8b5cf6',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      borderColor: '#e5e7eb'
    })
  }

  const exportTheme = () => {
    const themeData = JSON.stringify(themeSettings, null, 2)
    const blob = new Blob([themeData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'theme-settings.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedTheme = JSON.parse(e.target?.result as string)
          setThemeSettings({ ...themeSettings, ...importedTheme })
        } catch (error) {
          alert('Invalid theme file')
        }
      }
      reader.readAsText(file)
    }
  }

  const presetThemes = [
    {
      name: 'Default Blue',
      colors: {
        primaryColor: '#3b82f6',
        secondaryColor: '#10b981',
        accentColor: '#8b5cf6',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        borderColor: '#e5e7eb'
      }
    },
    {
      name: 'Dark Mode',
      colors: {
        primaryColor: '#6366f1',
        secondaryColor: '#10b981',
        accentColor: '#f59e0b',
        backgroundColor: '#111827',
        textColor: '#f9fafb',
        borderColor: '#374151'
      }
    },
    {
      name: 'Purple Theme',
      colors: {
        primaryColor: '#8b5cf6',
        secondaryColor: '#ec4899',
        accentColor: '#06b6d4',
        backgroundColor: '#faf5ff',
        textColor: '#581c87',
        borderColor: '#d8b4fe'
      }
    },
    {
      name: 'Green Nature',
      colors: {
        primaryColor: '#059669',
        secondaryColor: '#84cc16',
        accentColor: '#f59e0b',
        backgroundColor: '#f0fdf4',
        textColor: '#064e3b',
        borderColor: '#bbf7d0'
      }
    }
  ]

  if (status === 'loading' || loading) {
    return <div className="p-6">Loading theme settings...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Theme Management</h1>
          <p className="text-gray-600">Customize the platform's appearance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? 'Exit Preview' : 'Preview'}
          </Button>
          <Button onClick={saveThemeSettings}>
            <Save className="w-4 h-4 mr-2" />
            Save Theme
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Color Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Color Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={themeSettings.primaryColor}
                    onChange={(e) => setThemeSettings({...themeSettings, primaryColor: e.target.value})}
                    className="w-16 h-10 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    value={themeSettings.primaryColor}
                    onChange={(e) => setThemeSettings({...themeSettings, primaryColor: e.target.value})}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={themeSettings.secondaryColor}
                    onChange={(e) => setThemeSettings({...themeSettings, secondaryColor: e.target.value})}
                    className="w-16 h-10 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    value={themeSettings.secondaryColor}
                    onChange={(e) => setThemeSettings({...themeSettings, secondaryColor: e.target.value})}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="accentColor">Accent Color</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="accentColor"
                    type="color"
                    value={themeSettings.accentColor}
                    onChange={(e) => setThemeSettings({...themeSettings, accentColor: e.target.value})}
                    className="w-16 h-10 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    value={themeSettings.accentColor}
                    onChange={(e) => setThemeSettings({...themeSettings, accentColor: e.target.value})}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="backgroundColor">Background Color</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="backgroundColor"
                    type="color"
                    value={themeSettings.backgroundColor}
                    onChange={(e) => setThemeSettings({...themeSettings, backgroundColor: e.target.value})}
                    className="w-16 h-10 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    value={themeSettings.backgroundColor}
                    onChange={(e) => setThemeSettings({...themeSettings, backgroundColor: e.target.value})}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="textColor">Text Color</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="textColor"
                    type="color"
                    value={themeSettings.textColor}
                    onChange={(e) => setThemeSettings({...themeSettings, textColor: e.target.value})}
                    className="w-16 h-10 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    value={themeSettings.textColor}
                    onChange={(e) => setThemeSettings({...themeSettings, textColor: e.target.value})}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="borderColor">Border Color</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="borderColor"
                    type="color"
                    value={themeSettings.borderColor}
                    onChange={(e) => setThemeSettings({...themeSettings, borderColor: e.target.value})}
                    className="w-16 h-10 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    value={themeSettings.borderColor}
                    onChange={(e) => setThemeSettings({...themeSettings, borderColor: e.target.value})}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={resetToDefaults}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset to Defaults
              </Button>
              <Button variant="outline" onClick={exportTheme}>
                <Download className="w-4 h-4 mr-2" />
                Export Theme
              </Button>
              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={importTheme}
                  className="hidden"
                  id="import-theme"
                />
                <Button variant="outline" onClick={() => document.getElementById('import-theme')?.click()}>
                  <Upload className="w-4 h-4 mr-2" />
                  Import Theme
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="p-6 rounded-lg border-2 space-y-4"
              style={{
                backgroundColor: themeSettings.backgroundColor,
                color: themeSettings.textColor,
                borderColor: themeSettings.borderColor
              }}
            >
              <h3 className="text-xl font-bold">Sample Content</h3>
              <p>This is how your theme will look on the platform.</p>
              
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 rounded font-medium text-white"
                  style={{ backgroundColor: themeSettings.primaryColor }}
                >
                  Primary Button
                </button>
                <button
                  className="px-4 py-2 rounded font-medium text-white"
                  style={{ backgroundColor: themeSettings.secondaryColor }}
                >
                  Secondary Button
                </button>
                <button
                  className="px-4 py-2 rounded font-medium text-white"
                  style={{ backgroundColor: themeSettings.accentColor }}
                >
                  Accent Button
                </button>
              </div>

              <div 
                className="p-4 rounded border"
                style={{ borderColor: themeSettings.borderColor }}
              >
                <h4 className="font-semibold mb-2">Card Component</h4>
                <p className="text-sm opacity-75">This is a sample card with the current theme applied.</p>
              </div>

              <div className="flex items-center gap-4">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: themeSettings.primaryColor }}
                ></div>
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: themeSettings.secondaryColor }}
                ></div>
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: themeSettings.accentColor }}
                ></div>
                <span className="text-sm">Color Palette</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preset Themes */}
      <Card>
        <CardHeader>
          <CardTitle>Preset Themes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {presetThemes.map((preset, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-semibold mb-3">{preset.name}</h4>
                <div className="flex gap-2 mb-3">
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: preset.colors.primaryColor }}
                    title="Primary"
                  ></div>
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: preset.colors.secondaryColor }}
                    title="Secondary"
                  ></div>
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: preset.colors.accentColor }}
                    title="Accent"
                  ></div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setThemeSettings({...themeSettings, ...preset.colors})}
                  className="w-full"
                >
                  Apply Theme
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Apply Theme Button */}
      {previewMode && (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border">
          <Button onClick={applyTheme}>
            Apply Current Theme
          </Button>
        </div>
      )}
    </div>
  )
}