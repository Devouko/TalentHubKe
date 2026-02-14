'use client'

import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean
}

export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(
  ({ className, glow = false, children, ...props }, ref) => {
    return (
      <div className="relative">
        {glow && <GlowLayer />}
        <div
          ref={ref}
          className={cn(
            'relative bg-[var(--surface)] backdrop-blur-xl rounded-2xl border border-[var(--border-subtle)] shadow-xl shadow-black/30 dark:shadow-black/40',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </div>
    )
  }
)

export const GlowLayer = () => (
  <div className="absolute -inset-6 bg-gradient-to-r from-emerald-400/15 via-cyan-400/10 to-indigo-400/15 dark:from-emerald-400/15 dark:via-cyan-400/10 dark:to-indigo-400/15 blur-[120px] opacity-30 dark:opacity-60 pointer-events-none" />
)

Surface.displayName = 'Surface'