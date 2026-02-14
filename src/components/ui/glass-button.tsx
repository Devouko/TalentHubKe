'use client'

import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant = 'primary', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'relative px-6 py-3 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)] disabled:opacity-50 disabled:cursor-not-allowed',
          variant === 'primary' && 'bg-[var(--accent)] text-white hover:shadow-[0_0_20px_rgba(16,185,129,.4)] hover:scale-[1.02]',
          variant === 'secondary' && 'bg-transparent border border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--surface)]',
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

GlassButton.displayName = 'GlassButton'