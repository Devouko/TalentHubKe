'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { SystemTheme } from '@/lib/theme.service'

interface GlobalThemeContextType {
  activeTheme: SystemTheme | null
  themes: SystemTheme[]
  setActiveTheme: (themeId: string) => Promise<void>
  createCustomTheme: (name: string, colors: any) => Promise<void>
  isLoading: boolean
}

const GlobalThemeContext = createContext<GlobalThemeContextType | undefined>(undefined)

export function GlobalThemeProvider({ children }: { children: React.ReactNode }) {
  const [activeTheme, setActiveThemeState] = useState<SystemTheme | null>(null)
  const [themes, setThemes] = useState<SystemTheme[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadThemes()
  }, [])

  const loadThemes = async () => {
    try {
      const response = await fetch('/api/theme')
      const data = await response.json()
      
      if (data.success) {
        setActiveThemeState(data.data.activeTheme)
        setThemes(data.data.themes)
        
        if (data.data.activeTheme) {
          applyTheme(data.data.activeTheme)
        }
      }
    } catch (error) {
      console.error('Failed to load themes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const applyTheme = (theme: SystemTheme) => {
    const root = document.documentElement
    
    root.style.setProperty('--primary', theme.primary)
    root.style.setProperty('--secondary', theme.secondary)
    root.style.setProperty('--accent', theme.accent)
    root.style.setProperty('--background', theme.background)
    root.style.setProperty('--foreground', theme.foreground)
    root.style.setProperty('--muted', theme.muted)
    root.style.setProperty('--border', theme.border)
    root.style.setProperty('--card', theme.background)
    root.style.setProperty('--card-foreground', theme.foreground)
    root.style.setProperty('--popover', theme.background)
    root.style.setProperty('--popover-foreground', theme.foreground)
    root.style.setProperty('--primary-foreground', theme.background)
    root.style.setProperty('--secondary-foreground', theme.foreground)
    root.style.setProperty('--accent-foreground', theme.foreground)
    root.style.setProperty('--muted-foreground', theme.foreground)
    root.style.setProperty('--input', theme.border)
    root.style.setProperty('--ring', theme.primary)
  }

  const setActiveTheme = async (themeId: string) => {
    try {
      const response = await fetch('/api/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeId })
      })
      
      const data = await response.json()
      
      if (data.success) {
        const newActiveTheme = themes.find(t => t.id === themeId)
        if (newActiveTheme) {
          setActiveThemeState(newActiveTheme)
          applyTheme(newActiveTheme)
        }
      }
    } catch (error) {
      console.error('Failed to set active theme:', error)
    }
  }

  const createCustomTheme = async (name: string, colors: any) => {
    try {
      const response = await fetch('/api/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, colors })
      })
      
      const data = await response.json()
      
      if (data.success) {
        await loadThemes() // Reload themes to include the new one
      }
    } catch (error) {
      console.error('Failed to create custom theme:', error)
    }
  }

  return (
    <GlobalThemeContext.Provider value={{
      activeTheme,
      themes,
      setActiveTheme,
      createCustomTheme,
      isLoading
    }}>
      {children}
    </GlobalThemeContext.Provider>
  )
}

export function useGlobalTheme() {
  const context = useContext(GlobalThemeContext)
  if (context === undefined) {
    throw new Error('useGlobalTheme must be used within a GlobalThemeProvider')
  }
  return context
}