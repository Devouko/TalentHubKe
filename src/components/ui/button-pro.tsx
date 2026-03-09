'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/ui-utils'
import { ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProProps extends Omit<HTMLMotionProps<"button">, 'children'> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'accent' | 'dark' | 'ghost' | 'glass'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  glow?: boolean
}

/**
 * Professional Button Component with Animations
 * Based on UI/UX Pro Max Skill - Micro-interactions
 */
export function ButtonPro({ 
  children, 
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  glow = false,
  className,
  disabled,
  ...props 
}: ButtonProProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40',
    secondary: 'bg-white/80 backdrop-blur-sm border-2 border-slate-200 text-slate-900 hover:border-blue-500 hover:bg-white shadow-lg',
    accent: 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40',
    dark: 'bg-gradient-to-r from-slate-900 to-slate-700 text-white hover:from-blue-600 hover:to-blue-500 shadow-xl',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 border border-transparent hover:border-slate-200',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      disabled={disabled || loading}
      className={cn(
        'rounded-full font-black uppercase tracking-widest transition-all duration-300 cursor-pointer',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'inline-flex items-center justify-center gap-2',
        variants[variant],
        sizes[size],
        glow && 'animate-pulse',
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!loading && icon && iconPosition === 'left' && icon}
      {children}
      {!loading && icon && iconPosition === 'right' && icon}
    </motion.button>
  )
}
