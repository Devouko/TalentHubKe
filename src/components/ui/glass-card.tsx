'use client'

import { cn } from '@/lib/utils'
import { forwardRef } from 'react'
import { Surface } from './surface'
import { useGSAPHover } from '@/hooks/useGSAP'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean
  hover?: boolean
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, glow = false, hover = true, children, ...props }, ref) => {
    const hoverProps = useGSAPHover()

    return (
      <Surface
        ref={ref}
        glow={glow}
        className={cn(
          'group cursor-pointer transition-all duration-300',
          hover && 'hover:-translate-y-1 hover:shadow-2xl',
          className
        )}
        {...(hover ? hoverProps : {})}
        {...props}
      >
        {children}
      </Surface>
    )
  }
)

GlassCard.displayName = 'GlassCard'