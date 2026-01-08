'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Alert from '../../components/ui/Alert'
import { useRoleBasedRedirect } from '../../hooks/useRoleBasedRedirect'

export default function SignInPage() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const router = useRouter()
  const { session } = useRoleBasedRedirect()

  // Redirect if already authenticated
  if (session) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setAlert(null)

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      })

      if (result?.ok) {
        setAlert({ type: 'success', message: 'Signed in successfully!' })
        // Role-based redirect will be handled by useRoleBasedRedirect hook
      } else {
        setAlert({ type: 'error', message: 'Invalid email or password' })
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'An error occurred during sign in' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
        <div className="flex min-h-[600px]">
          {/* Left Side - Hero */}
          <div className="flex-1 bg-gradient-to-br from-blue-900/80 via-blue-800/60 to-teal-900/80 p-12 flex flex-col justify-center relative overflow-hidden">
            {/* Abstract Background Pattern */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl"></div>
              <div className="absolute bottom-20 right-10 w-40 h-40 bg-teal-400/20 rounded-full blur-xl"></div>
              <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-cyan-400/20 rounded-full blur-lg"></div>
            </div>
            
            <div className="relative z-10">
              <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                Welcome
                <br />
                Back
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                Continue your journey
                <br />
                and grow your business!
              </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="flex-1 bg-white/95 backdrop-blur-sm p-12 flex flex-col justify-center">
            <div className="max-w-sm mx-auto w-full">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Sign In</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-800 placeholder-gray-500"
                    required
                  />
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-800 placeholder-gray-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                  {!loading && <span>→</span>}
                </button>

                <div className="text-center text-gray-500 text-sm">or</div>

                <button
                  type="button"
                  className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <span>🔍</span> Sign in with Google
                </button>

                <button
                  type="button"
                  className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <span>🍎</span> Sign in with Apple
                </button>

                <p className="text-center text-sm text-gray-600 mt-6">
                  Don't have an account?{' '}
                  <Link href="/auth/signup" className="text-teal-600 hover:text-teal-700 font-medium">
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {alert && (
        <Alert 
          type={alert.type} 
          message={alert.message} 
          onClose={() => setAlert(null)} 
        />
      )}
    </div>
  )
}