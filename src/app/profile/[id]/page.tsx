'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Star, Users, Award, MapPin, Mail, Phone, Globe, ArrowLeft, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { ReviewSectionComplete } from '@/components/reviews'
import { useSession } from 'next-auth/react'

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserProfile()
  }, [params.id])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`/api/users/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setUser(data)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">User not found</h1>
          <Link href="/dashboard" className="text-emerald-500 hover:text-emerald-600">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-emerald-500 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-xl"
        >
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                {user.name?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {user.name}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">
                {user.title || 'Professional'}
              </p>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold">{user.sellerRating || 0}</span>
                  <span className="text-slate-600 dark:text-slate-400">({user.sellerReviewCount || 0} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  <span>{user.completedProjects || 0} projects completed</span>
                </div>
              </div>

              <div className="flex gap-3 mb-6">
                <Link
                  href={`/hire/${user.id}`}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/30"
                >
                  Hire Now
                </Link>
                <button className="px-6 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl font-semibold transition-all flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Message
                </button>
              </div>

              <div className="space-y-3">
                {user.email && (
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Mail className="w-5 h-5" />
                    <span>{user.email}</span>
                  </div>
                )}
                {user.location && (
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <MapPin className="w-5 h-5" />
                    <span>{user.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold mb-4">About</h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {user.bio || 'Experienced professional ready to help with your projects.'}
            </p>
          </div>

          {user.skills && (
            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {user.skills.split(',').map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-full font-medium"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold mb-4">Hourly Rate</h2>
            <p className="text-3xl font-bold text-emerald-500">
              KES {user.hourlyRate?.toLocaleString() || '2,500'}/hr
            </p>
          </div>
        </motion.div>

        {/* Seller Reviews Section */}
        <div className="mt-8">
          <ReviewSectionComplete
            type="seller"
            targetId={params.id as string}
            canReview={!!session && session.user?.id !== params.id}
          />
        </div>
      </div>
    </div>
  )
}
