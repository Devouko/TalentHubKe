'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface PageLayoutProps {
  children: ReactNode
  variant?: 'light' | 'dark' | 'gradient'
  className?: string
}

export default function PageLayout({ 
  children, 
  variant = 'light',
  className = '' 
}: PageLayoutProps) {
  const backgrounds = {
    light: 'bg-gradient-to-br from-slate-50 via-white to-blue-50/30',
    dark: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
    gradient: 'bg-gradient-to-br from-blue-600 via-blue-500 to-orange-500'
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`min-h-screen ${backgrounds[variant]} ${className}`}
    >
      {children}
    </motion.div>
  )
}
