'use client'

import { cn } from '@/lib/utils'
import { Surface } from './surface'

interface GlassSidebarProps {
  children: React.ReactNode
  className?: string
}

interface GlassSidebarItemProps {
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
  className?: string
}

export function GlassSidebar({ children, className }: GlassSidebarProps) {
  return (
    <Surface className={cn('h-full', className)}>
      <div className="p-6 space-y-2">
        {children}
      </div>
    </Surface>
  )
}

export function GlassSidebarItem({ 
  children, 
  active = false, 
  onClick, 
  className 
}: GlassSidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 group',
        active 
          ? 'bg-[var(--accent-soft)] text-[var(--accent)] shadow-[0_0_18px_rgba(16,185,129,.35)]' 
          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)]',
        className
      )}
    >
      {children}
    </button>
  )
}