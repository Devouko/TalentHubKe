'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/ui-utils'
import { ReactNode } from 'react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  icon: ReactNode
  trend?: 'up' | 'down' | 'neutral'
  delay?: number
  variant?: 'default' | 'glass' | 'gradient'
}

/**
 * Professional Stat Card with Animations
 * Based on UI/UX Pro Max Skill - Motion-Driven + Glassmorphism
 */
export function StatCard({ 
  title, 
  value, 
  change, 
  icon, 
  trend = 'neutral',
  delay = 0,
  variant = 'default'
}: StatCardProps) {
  const variants = {
    default: 'bg-white/60 backdrop-blur-sm border-slate-200/50',
    glass: 'bg-white/10 backdrop-blur-md border-white/20',
    gradient: 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border-blue-200/30'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay,
        ease: [0.4, 0, 0.2, 1] 
      }}
      whileHover={{ 
        y: -4, 
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' 
      }}
      className={cn(
        'p-6 rounded-2xl border shadow-sm transition-all duration-300 cursor-pointer',
        variants[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <motion.h3 
            className="text-3xl font-bold text-slate-900"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: delay + 0.2, type: "spring", stiffness: 200 }}
          >
            {value}
          </motion.h3>
          {change !== undefined && (
            <div className={cn(
              'flex items-center gap-1 mt-2 text-sm font-medium',
              trend === 'up' && 'text-green-600',
              trend === 'down' && 'text-red-600',
              trend === 'neutral' && 'text-slate-600'
            )}>
              {trend === 'up' && <ArrowUpRight className="w-4 h-4" />}
              {trend === 'down' && <ArrowDownRight className="w-4 h-4" />}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        <motion.div 
          className={cn(
            'p-3 rounded-xl',
            trend === 'up' && 'bg-green-100 text-green-600',
            trend === 'down' && 'bg-red-100 text-red-600',
            trend === 'neutral' && 'bg-blue-100 text-blue-600'
          )}
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
        >
          {icon}
        </motion.div>
      </div>
    </motion.div>
  )
}
