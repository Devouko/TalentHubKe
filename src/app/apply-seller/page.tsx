'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { UserCheck, Upload, Star, Award } from 'lucide-react'
import Alert from '../../components/ui/Alert'

export default function ApplyToSeller() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [formData, setFormData] = useState({
    skills: '',
    experience: '',
    portfolio: '',
    description: '',
    category: 'design'
  })

  const categories = ['design', 'development', 'writing', 'marketing', 'video', 'other']

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/seller-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session?.user?.id,
          ...formData
        })
      })

      if (response.ok) {
        setAlert({ type: 'success', message: 'Seller application submitted successfully! Admin will review your application.' })
        setFormData({
          skills: '',
          experience: '',
          portfolio: '',
          description: '',
          category: 'design'
        })
      } else {
        setAlert({ type: 'error', message: 'Failed to submit application. Please try again.' })
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'An error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Apply to Become a Seller</h1>
          <p className="text-gray-400 text-lg">Join our marketplace and start offering your services to clients worldwide</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Benefits Section */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Why Become a Seller?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-yellow-400 mt-1" />
                  <div>
                    <h4 className="font-medium">Build Your Reputation</h4>
                    <p className="text-sm text-gray-400">Get reviews and build a strong profile</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-purple-400 mt-1" />
                  <div>
                    <h4 className="font-medium">Earn Money</h4>
                    <p className="text-sm text-gray-400">Set your own prices and earn from your skills</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <UserCheck className="w-5 h-5 text-green-400 mt-1" />
                  <div>
                    <h4 className="font-medium">Global Reach</h4>
                    <p className="text-sm text-gray-400">Connect with clients from around the world</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Requirements</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Professional skills in your chosen category</li>
                <li>• Portfolio showcasing your work</li>
                <li>• Commitment to quality service</li>
                <li>• Good communication skills</li>
              </ul>
            </div>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-6">Application Form</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Skills</label>
                  <input
                    type="text"
                    placeholder="e.g., Graphic Design, Logo Design, Branding"
                    value={formData.skills}
                    onChange={(e) => setFormData({...formData, skills: e.target.value})}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Experience</label>
                  <textarea
                    placeholder="Describe your professional experience..."
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white h-24 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Portfolio URL</label>
                  <input
                    type="url"
                    placeholder="https://your-portfolio.com"
                    value={formData.portfolio}
                    onChange={(e) => setFormData({...formData, portfolio: e.target.value})}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    placeholder="Tell us about yourself and why you want to become a seller..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white h-32 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                  {!loading && <UserCheck className="w-5 h-5" />}
                </button>
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