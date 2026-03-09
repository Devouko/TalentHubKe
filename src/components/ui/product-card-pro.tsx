'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/ui-utils'
import Image from 'next/image'
import { ShoppingCart, Eye, Heart } from 'lucide-react'
import { useState } from 'react'

interface ProductCardProProps {
  id: string
  title: string
  description: string
  price: number
  image: string
  category: string
  onBuyNow: () => void
  onQuickView?: () => void
  delay?: number
}

/**
 * Professional Product Card with Advanced Animations
 * Based on UI/UX Pro Max Skill - Motion-Driven + Glassmorphism
 */
export function ProductCardPro({
  id,
  title,
  description,
  price,
  image,
  category,
  onBuyNow,
  onQuickView,
  delay = 0
}: ProductCardProProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      {/* Glass Card */}
      <div className={cn(
        'relative overflow-hidden rounded-2xl border transition-all duration-500',
        'bg-white/60 backdrop-blur-sm border-slate-200/50',
        'hover:shadow-2xl hover:border-blue-300/50'
      )}>
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
          <Image
            src={image || '/placeholder.png'}
            alt={title}
            fill
            className={cn(
              'object-cover transition-transform duration-700',
              isHovered && 'scale-110'
            )}
          />
          
          {/* Overlay on Hover */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
          />
          
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 20
            }}
            transition={{ duration: 0.3 }}
            className="absolute top-4 right-4 flex flex-col gap-2"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsFavorite(!isFavorite)}
              className={cn(
                'p-2 rounded-full backdrop-blur-md transition-colors',
                isFavorite 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              )}
            >
              <Heart className={cn('w-4 h-4', isFavorite && 'fill-current')} />
            </motion.button>
            
            {onQuickView && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onQuickView}
                className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors"
              >
                <Eye className="w-4 h-4" />
              </motion.button>
            )}
          </motion.div>
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/90 backdrop-blur-sm text-slate-900">
              {category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">
            {title}
          </h3>
          <p className="text-sm text-slate-600 mb-4 line-clamp-2">
            {description}
          </p>
          
          {/* Price and Action */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-black text-slate-900">
                KES {price.toLocaleString()}
              </span>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBuyNow}
              className={cn(
                'px-4 py-2 rounded-full font-black text-sm uppercase tracking-wider',
                'bg-gradient-to-r from-blue-600 to-blue-500 text-white',
                'shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40',
                'transition-all duration-300',
                'flex items-center gap-2'
              )}
            >
              <ShoppingCart className="w-4 h-4" />
              Buy Now
            </motion.button>
          </div>
        </div>

        {/* Shimmer Effect on Hover */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: isHovered ? '100%' : '-100%' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
        />
      </div>
    </motion.div>
  )
}
