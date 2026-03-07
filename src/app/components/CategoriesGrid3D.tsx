'use client'

import { CATEGORY_DETAILS, CATEGORY_OPTIONS } from '@/constants/categories'

import { motion } from 'framer-motion'
import { Code, Layers, FileText, TrendingUp, Play, Brain, Briefcase, LineChart } from 'lucide-react'
import { useCategories } from '@/hooks/useDynamicSettings'

const defaultCategories = CATEGORY_OPTIONS.map(categoryKey => {
  const details = CATEGORY_DETAILS[categoryKey]
  return {
    icon: Code, // Default icon, will be overridden
    name: details.name,
    count: '0',
    gradient: 'from-emerald-500 to-teal-500',
    description: details.description
  }
})

const iconMap = { Code, Layers, FileText, TrendingUp, Play, Brain, Briefcase, LineChart }

export default function CategoriesGrid3D() {
  const dynamicCategories = useCategories()
  const categories = dynamicCategories.length > 0 
    ? dynamicCategories.map(cat => ({
        icon: iconMap[cat.icon as keyof typeof iconMap] || Code,
        name: cat.name,
        count: '0',
        gradient: 'from-emerald-500 to-teal-500',
        description: cat.description || ''
      }))
    : defaultCategories
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Explore <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Categories</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Discover talented professionals across various industries and skill sets
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative h-64"
              style={{ perspective: '1000px' }}
            >
              {/* Card Container with 3D flip */}
              <motion.div
                className="relative w-full h-full"
                style={{ transformStyle: 'preserve-3d' }}
                whileHover={{ rotateY: 180 }}
                transition={{ duration: 0.6 }}
              >
                {/* Front Face */}
                <div
                  className="absolute inset-0 rounded-2xl p-6 cursor-pointer"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                >
                  <div className="relative h-full bg-gradient-to-br from-slate-800 to-slate-900 border border-emerald-500/20 rounded-2xl p-6 overflow-hidden group-hover:border-emerald-500/50 transition-all duration-300">
                    {/* Glow Effect */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    />

                    {/* Floating Icon */}
                    <motion.div
                      className={`w-16 h-16 bg-gradient-to-br ${cat.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg relative z-10`}
                      animate={{
                        y: [0, -8, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <cat.icon className="w-8 h-8 text-white" />
                    </motion.div>

                    <h3 className="text-xl font-semibold mb-2 text-white relative z-10">{cat.name}</h3>
                    <p className="text-slate-400 text-sm relative z-10">{cat.count} active professionals</p>

                    {/* Decorative Elements */}
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-emerald-500/10 to-transparent rounded-tl-full" />
                  </div>
                </div>

                {/* Back Face */}
                <div
                  className="absolute inset-0 rounded-2xl p-6"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <div className={`relative h-full bg-gradient-to-br ${cat.gradient} rounded-2xl p-6 flex flex-col items-center justify-center text-center`}>
                    <cat.icon className="w-12 h-12 text-white mb-4" />
                    <h3 className="text-xl font-bold text-white mb-3">{cat.name}</h3>
                    <p className="text-white/90 text-sm mb-4">{cat.description}</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2 bg-white text-slate-900 rounded-full font-semibold text-sm"
                    >
                      Explore →
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Hover Shadow */}
              <motion.div
                className="absolute inset-0 -z-10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(to bottom right, ${cat.gradient})`,
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
