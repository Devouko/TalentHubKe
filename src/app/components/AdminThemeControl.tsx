'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Palette, Plus, Check } from 'lucide-react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { useGlobalTheme } from '../context/GlobalThemeContext'

export default function AdminThemeControl() {
  const { data: session } = useSession()
  const { activeTheme, themes, setActiveTheme, createCustomTheme, isLoading } = useGlobalTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [customTheme, setCustomTheme] = useState({
    name: '',
    primary: '262 83% 58%',
    secondary: '123 100% 50%',
    accent: '84 100% 50%'
  })

  const handleSetTheme = async (themeId: string) => {
    await setActiveTheme(themeId)
  }

  const handleCreateTheme = async () => {
    if (!customTheme.name.trim()) return
    
    await createCustomTheme(customTheme.name, {
      primary: customTheme.primary,
      secondary: customTheme.secondary,
      accent: customTheme.accent
    })
    
    setIsCreating(false)
    setCustomTheme({ name: '', primary: '262 83% 58%', secondary: '123 100% 50%', accent: '84 100% 50%' })
  }

  if (session?.user?.userType !== 'ADMIN') return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Palette className="w-4 h-4" />
          Theme
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>System Theme Settings</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleSetTheme(theme.id)}
                  className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                    activeTheme?.id === theme.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium">{theme.name}</span>
                    {activeTheme?.id === theme.id && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <div 
                      className="w-8 h-8 rounded" 
                      style={{ backgroundColor: `hsl(${theme.primary})` }}
                    />
                    <div 
                      className="w-8 h-8 rounded" 
                      style={{ backgroundColor: `hsl(${theme.secondary})` }}
                    />
                    <div 
                      className="w-8 h-8 rounded" 
                      style={{ backgroundColor: `hsl(${theme.accent})` }}
                    />
                  </div>
                </button>
              ))}
            </div>

            <div className="border-t pt-4">
              {!isCreating ? (
                <Button 
                  onClick={() => setIsCreating(true)}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Custom Theme
                </Button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="theme-name">Theme Name</Label>
                    <Input
                      id="theme-name"
                      value={customTheme.name}
                      onChange={(e) => setCustomTheme(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="My Custom Theme"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Primary</Label>
                      <div className="flex gap-2 mt-1">
                        <div 
                          className="w-8 h-8 rounded border" 
                          style={{ backgroundColor: `hsl(${customTheme.primary})` }}
                        />
                        <Input
                          value={customTheme.primary}
                          onChange={(e) => setCustomTheme(prev => ({ ...prev, primary: e.target.value }))}
                          placeholder="262 83% 58%"
                          className="text-xs"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Secondary</Label>
                      <div className="flex gap-2 mt-1">
                        <div 
                          className="w-8 h-8 rounded border" 
                          style={{ backgroundColor: `hsl(${customTheme.secondary})` }}
                        />
                        <Input
                          value={customTheme.secondary}
                          onChange={(e) => setCustomTheme(prev => ({ ...prev, secondary: e.target.value }))}
                          placeholder="123 100% 50%"
                          className="text-xs"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Accent</Label>
                      <div className="flex gap-2 mt-1">
                        <div 
                          className="w-8 h-8 rounded border" 
                          style={{ backgroundColor: `hsl(${customTheme.accent})` }}
                        />
                        <Input
                          value={customTheme.accent}
                          onChange={(e) => setCustomTheme(prev => ({ ...prev, accent: e.target.value }))}
                          placeholder="84 100% 50%"
                          className="text-xs"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleCreateTheme} className="flex-1">
                      Create & Apply
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsCreating(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}