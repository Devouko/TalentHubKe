'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import Alert from '../../../components/ui/Alert';

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'CLIENT'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false
        });

        if (result?.ok) {
          // Get user session to determine redirect
          const sessionResponse = await fetch('/api/auth/session')
          const session = await sessionResponse.json()
          
          setAlert({ type: 'success', message: 'Account created successfully!' })
          
          setTimeout(() => {
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
              router.push('/dashboard')
            }
          }, 1500)
        }
      } else {
        setAlert({ type: 'error', message: 'Failed to create account. Please try again.' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
        <div className="flex min-h-[600px]">
          {/* Left Side - Hero */}
          <div className="flex-1 bg-gradient-to-br from-blue-900/80 via-blue-800/60 to-white/80 p-12 flex flex-col justify-center relative overflow-hidden">
            {/* Abstract Background Pattern */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl"></div>
              <div className="absolute bottom-20 right-10 w-40 h-40 bg-teal-400/20 rounded-full blur-xl"></div>
              <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-cyan-400/20 rounded-full blur-lg"></div>
            </div>
            
            <div className="relative z-10">
              <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                Create your
                <br />
                Account
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                Share your artwork
                <br />
                and Get projects!
              </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="flex-1 bg-white/95 backdrop-blur-sm p-12 flex flex-col justify-center">
            <div className="max-w-sm mx-auto w-full">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Sign Up</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder="First name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-800 placeholder-gray-500"
                    required
                  />
                </div>

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

                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-800 placeholder-gray-500"
                    required
                  />
                </div>

                <div>
                  <select
                    value={formData.userType}
                    onChange={(e) => setFormData(prev => ({ ...prev, userType: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-800"
                  >
                    <option value="CLIENT">Client</option>
                    <option value="FREELANCER">Freelancer</option>
                    <option value="AGENCY">Agency</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" id="terms" className="rounded" required />
                  <label htmlFor="terms">Accept Terms & Conditions</label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? 'Creating Account...' : 'Join us'}
                  {!loading && <span>→</span>}
                </button>

                <div className="text-center text-gray-500 text-sm">or</div>

                <button
                  type="button"
                  className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <span>🔍</span> Sign up with Google
                </button>

                <button
                  type="button"
                  className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <span>🍎</span> Sign up with Apple
                </button>

                <p className="text-center text-sm text-gray-600 mt-6">
                  Already have an account?{' '}
                  <Link href="/auth" className="text-teal-600 hover:text-teal-700 font-medium">
                    Sign in
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
  );
}