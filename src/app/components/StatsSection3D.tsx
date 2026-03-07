'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Users, CheckCircle, DollarSign, Star } from 'lucide-react'

const stats = [
  { icon: Users, label: 'Active Freelancers', value: '2.5', suffix: 'M+', color: 'from-emerald-500 to-teal-500' },
  { icon: CheckCircle, label: 'Projects Completed', value: '10', suffix: 'M+', color: 'from-teal-500 to-cyan-500' },
  { icon: DollarSign, label: 'Total Earnings', value: '5', suffix: 'B+', color: 'from-emerald-500 to-green-500' },
  { icon: Star, label: 'Average Rating', value: '4.9', suffix: '/5', color: 'from-yellow-500 to-emerald-500' }
]

export default function StatsSection3D() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8])

  return (
    <section ref={ref} className="py-24 px-6 bg-slate-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/30 rounded-full blur-3xl" />
      </div>

      {/* Animated Grid */}
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:100px_100px]"
        style={{ opacity }}
      />

      <motion.div 
        className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10"
        style={{ opacity, scale }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="group relative"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true, amount: 0.5 }}
            whileHover={{ y: -10 }}
          >
            {/* 3D Card Container */}
            <div 
              className="relative h-72 rounded-2xl overflow-hidden"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Card Background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/20 rounded-2xl"
                whileHover={{ 
                  borderColor: 'rgba(16, 185, 129, 0.5)',
                  boxShadow: '0 0 50px rgba(16, 185, 129, 0.3)'
                }}
                transition={{ duration: 0.3 }}
              />

              {/* Animated Glow */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-t ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}
              />

              {/* Floating Icon */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
                <motion.div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  whileHover={{
                    scale: 1.2,
                    rotate: 360,
                  }}
                >
                  <stat.icon className="w-10 h-10 text-white" />
                </motion.div>
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 pt-24">
                <motion.div
                  className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  viewport={{ once: true }}
                >
                  {stat.value}
                  <span className="text-3xl">{stat.suffix}</span>
                </motion.div>
                
                <p className="text-slate-300 text-center text-sm">{stat.label}</p>
              </div>

              {/* Particle Effect on Hover */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${30 + i * 10}%`,
                    }}
                    animate={{
                      y: [0, -50],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
