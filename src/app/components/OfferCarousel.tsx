'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useOffers } from '@/hooks/useDynamicSettings'
import Link from 'next/link'

export default function OfferCarousel() {
  const offers = useOffers()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (offers.length === 0) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % offers.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [offers.length])

  if (offers.length === 0 || !offers[current]) return null

  return (
    <section className="py-16 px-6 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="relative h-96 rounded-3xl overflow-hidden"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${offers[current]?.image || ''})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-center px-12 max-w-2xl">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl font-bold text-white mb-4"
              >
                {offers[current].title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-slate-300 mb-8"
              >
                {offers[current].description}
              </motion.p>
              {offers[current].link && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link href={offers[current].link}>
                    <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full font-semibold text-lg hover:shadow-lg transition-all">
                      {offers[current].buttonText}
                    </button>
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={() => setCurrent((prev) => (prev - 1 + offers.length) % offers.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={() => setCurrent((prev) => (prev + 1) % offers.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {offers.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === current ? 'bg-emerald-500 w-8' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
