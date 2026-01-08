'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Palette } from 'lucide-react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { useThemeColors } from '../context/ThemeContext'

interface ThemeColors {
  primaryColor: string
  secondaryColor: string
  accentColor: string
}

export default function AdminThemeControl() {
  const { data: session } = useSession()
  const { colors, updateColors } = useThemeColors()
  const [isOpen, setIsOpen] = useState(false)
  const [localColors, setLocalColors] = useState(colors)

  useEffect(() => {
    setLocalColors(colors)
  }, [colors])

  const handleSave = async () => {
    try {
      await fetch('/api/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localColors)
      })
      
      updateColors(localColors)
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to update theme:', error)
    }
  }

  if (session?.user?.userType !== 'ADMIN') return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Palette className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Theme Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="primary">Primary Color</Label>
            <div className="flex space-x-2">
              <Input
                id="primary"
                type="color"
                value={localColors.primaryColor}
                onChange={(e) => setLocalColors(prev => ({ ...prev, primaryColor: e.target.value }))}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                value={localColors.primaryColor}
                onChange={(e) => setLocalColors(prev => ({ ...prev, primaryColor: e.target.value }))}
                placeholder="#3b82f6"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondary">Secondary Color</Label>
            <div className="flex space-x-2">
              <Input
                id="secondary"
                type="color"
                value={localColors.secondaryColor}
                onChange={(e) => setLocalColors(prev => ({ ...prev, secondaryColor: e.target.value }))}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                value={localColors.secondaryColor}
                onChange={(e) => setLocalColors(prev => ({ ...prev, secondaryColor: e.target.value }))}
                placeholder="#10b981"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accent">Accent Color</Label>
            <div className="flex space-x-2">
              <Input
                id="accent"
                type="color"
                value={localColors.accentColor}
                onChange={(e) => setLocalColors(prev => ({ ...prev, accentColor: e.target.value }))}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                value={localColors.accentColor}
                onChange={(e) => setLocalColors(prev => ({ ...prev, accentColor: e.target.value }))}
                placeholder="#8b5cf6"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Apply Theme
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}