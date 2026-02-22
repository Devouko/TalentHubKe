'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const partners = [
  { name: 'Safaricom', logo: '📱' },
  { name: 'Equity Bank', logo: '🏦' },
  { name: 'KCB', logo: '💳' },
  { name: 'Airtel', logo: '📡' },
  { name: 'NCBA', logo: '🏛️' },
  { name: 'Co-op Bank', logo: '🤝' },
  { name: 'Absa', logo: '💼' },
  { name: 'Standard Chartered', logo: '🌟' }
]

export default function CompanyCards3D() {
  return (
    <section className="py-16 px-6 border-t border-slate-800 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-slate-400 text-lg mb-12"
        >
          Trusted by Leading Organizations
        </motion.h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
          {partners.map((partner, i) => (
            <TiltCard key={partner.name} partner={partner} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function TiltCard({ partner, index }: { partner: { name: string; logo: string }; index: number }) {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateXValue = ((y - centerY) / centerY) * -10
    const rotateYValue = ((x - centerX) / centerX) * 10

    setRotateX(rotateXValue)
    setRotateY(rotateYValue)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
      }}
    >
      <motion.div
        className="relative p-6 bg-gradient-to-br from-slate-800 to-slate-900 border border-emerald-500/20 rounded-xl hover:border-emerald-500/50 transition-all group cursor-pointer"
        animate={{
          rotateX,
          rotateY,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        whileHover={{ y: -10, scale: 1.05 }}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:to-teal-500/10 rounded-xl transition-all duration-500" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <motion.div
            className="text-3xl"
            whileHover={{ scale: 1.2, rotate: 360 }}
            transition={{ duration: 0.5 }}
            style={{ transform: 'translateZ(20px)' }}
          >
            {partner.logo}
          </motion.div>
          <span className="text-sm text-slate-300 group-hover:text-white transition-colors text-center">
            {partner.name}
          </span>
        </div>

        {/* Shadow */}
        <motion.div
          className="absolute inset-0 -z-10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(to bottom right, rgba(16, 185, 129, 0.3), rgba(20, 184, 166, 0.3))',
          }}
        />
      </motion.div>
    </motion.div>
  )
}
