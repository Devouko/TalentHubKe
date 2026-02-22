'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
      
      const target = e.target as HTMLElement
      if (target && (target.tagName === 'BUTTON' || target.tagName === 'A')) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  if (!isVisible) return null

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{ left: position.x, top: position.y }}
        animate={{
          x: -12,
          y: -12,
          scale: isHovering ? 2 : 1,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      >
        <div className="w-6 h-6 rounded-full bg-emerald-500 opacity-50 blur-sm" />
      </motion.div>

      {/* Trail */}
      <motion.div
        className="fixed pointer-events-none z-[9998] hidden md:block"
        style={{ left: position.x, top: position.y }}
        animate={{ x: -4, y: -4 }}
        transition={{ type: 'spring', stiffness: 150, damping: 15 }}
      >
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
      </motion.div>
    </>
  )
}
