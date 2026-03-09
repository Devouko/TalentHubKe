'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/ui-utils'
import { ReactNode } from 'react'

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, 'children'> {
  children: ReactNode
  variant?: 'default' | 'premium' | 'subtle'
  hover?: boolean
  glow?: boolean
}

/**
 * Professional Glassmorphic Card Component
 * Based on UI/UX Pro Max Skill - Glassmorphism Style
 */
export function GlassCard({ 
  children, 
  variant = 'default', 
  hover = true,
  glow = false,
  className,
  ...props 
}: GlassCardProps) {
  const variants = {
    default: 'bg-white/10 backdrop-blur-md border-white/20',
    premium: 'bg-white/15 backdrop-blur-xl border-white/30',
    subtle: 'bg-white/5 backdrop-blur-sm border-white/10'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      whileHover={hover ? { 
        y: -4, 
        boxShadow: glow 
          ? '0 20px 40px rgba(59, 130, 246, 0.3)' 
          : '0 20px 40px rgba(0, 0, 0, 0.1)' 
      } : undefined}
      className={cn(
        'rounded-2xl border transition-all duration-300',
        variants[variant],
        glow && 'shadow-lg shadow-blue-500/20',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}
