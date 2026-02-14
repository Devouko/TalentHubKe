"use client"

import { createContext, useContext, useEffect, useState } from 'react'

interface SystemThemeContextType {
  theme: string
  setTheme: (theme: string) => void
}

const SystemThemeContext = createContext<SystemThemeContextType | undefined>(undefined)

export function SystemThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('default')

  useEffect(() => {
    // Load theme from localStorage or fetch from API
    const loadTheme = async () => {
      try {
        const saved = localStorage.getItem('system-theme')
        if (saved) {
          setTheme(saved)
          document.documentElement.setAttribute('data-theme', saved)
        } else {
          // Fetch from API
          const response = await fetch('/api/theme')
          const data = await response.json()
          if (data.theme) {
            setTheme(data.theme)
            document.documentElement.setAttribute('data-theme', data.theme)
            localStorage.setItem('system-theme', data.theme)
          }
        }
      } catch (error) {
        console.error('Failed to load theme:', error)
      }
    }

    loadTheme()
  }, [])

  const updateTheme = (newTheme: string) => {
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('system-theme', newTheme)
  }

  return (
    <SystemThemeContext.Provider value={{ theme, setTheme: updateTheme }}>
      {children}
    </SystemThemeContext.Provider>
  )
}

export function useSystemTheme() {
  const context = useContext(SystemThemeContext)
  if (context === undefined) {
    throw new Error('useSystemTheme must be used within a SystemThemeProvider')
  }
  return context
}