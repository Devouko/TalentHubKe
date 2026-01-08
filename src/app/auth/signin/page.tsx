'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { User, Lock } from 'lucide-react'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false
    })

    if (result?.ok) {
      // Get user session to determine redirect
      const response = await fetch('/api/auth/session')
      const session = await response.json()
      
      if (session?.user?.userType) {
        switch (session.user.userType) {
          case 'ADMIN':
            router.push('/admin')
            break
          case 'FREELANCER':
          case 'AGENCY':
            router.push('/seller-dashboard')
            break
          case 'CLIENT':
          default:
            router.push('/dashboard')
            break
        }
      } else {
        router.push('/')
      }
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 bg-gradient-to-br from-purple-600/10 to-cyan-600/10 backdrop-blur border border-purple-500/20 rounded-xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Sign In
          </h1>
          <p className="text-gray-400">Access your TalentHub account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="flex items-center gap-3 px-4 py-3 bg-[#1a1a2e]/50 rounded-xl border border-purple-500/20">
              <User className="w-5 h-5 text-purple-400" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-none outline-none w-full"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 px-4 py-3 bg-[#1a1a2e]/50 rounded-xl border border-purple-500/20">
              <Lock className="w-5 h-5 text-purple-400" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent border-none outline-none w-full"
                required
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl font-semibold disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </motion.button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Demo: test@example.com / password
        </div>
      </motion.div>
    </div>
  )
}