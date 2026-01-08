'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface ThemeColors {
  primaryColor: string
  secondaryColor: string
  accentColor: string
}

interface ThemeContextType {
  colors: ThemeColors
  updateColors: (colors: ThemeColors) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeColorsProvider({ children }: { children: React.ReactNode }) {
  const [colors, setColors] = useState<ThemeColors>({
    primaryColor: '#3b82f6',
    secondaryColor: '#10b981',
    accentColor: '#8b5cf6'
  })

  useEffect(() => {
    fetchTheme()
  }, [])

  const fetchTheme = async () => {
    try {
      const response = await fetch('/api/theme')
      const theme = await response.json()
      setColors(theme)
      applyColors(theme)
    } catch (error) {
      console.error('Failed to fetch theme:', error)
    }
  }

  const applyColors = (themeColors: ThemeColors) => {
    document.documentElement.style.setProperty('--primary', themeColors.primaryColor)
    document.documentElement.style.setProperty('--secondary', themeColors.secondaryColor)
    document.documentElement.style.setProperty('--accent', themeColors.accentColor)
  }

  const updateColors = (newColors: ThemeColors) => {
    setColors(newColors)
    applyColors(newColors)
  }

  return (
    <ThemeContext.Provider value={{ colors, updateColors }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useThemeColors() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useThemeColors must be used within a ThemeColorsProvider')
  }
  return context
}