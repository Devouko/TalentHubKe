'use client'

import { cn } from '@/lib/ui-utils'

interface SkeletonProps {
  className?: string
  variant?: 'default' | 'card' | 'text' | 'circle'
}

/**
 * Professional Loading Skeleton
 * Based on UI/UX Pro Max Skill - Micro-interactions
 */
export function Skeleton({ className, variant = 'default' }: SkeletonProps) {
  const variants = {
    default: 'h-4 w-full',
    card: 'h-64 w-full rounded-2xl',
    text: 'h-4 w-3/4',
    circle: 'h-12 w-12 rounded-full'
  }

  return (
    <div
      className={cn(
        'animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200',
        'bg-[length:1000px_100%]',
        variants[variant],
        className
      )}
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-2xl overflow-hidden">
      <Skeleton variant="card" className="h-64" />
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton variant="circle" />
      </div>
    </div>
  )
}
