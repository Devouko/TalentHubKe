'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { UserCheck, Upload, Star, Award, X } from 'lucide-react'
import Alert from '../../components/ui/Alert'
import { UploadDropzone } from '../../utils/uploadthing'
import { showToast } from '../../lib/toast'

export default function ApplyToSeller() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [formData, setFormData] = useState({
    businessName: '',
    skills: '',
    experience: '',
    portfolio: '',
    description: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session?.user?.id) {
      showToast.error('Please log in to submit an application')
      return
    }
    
    setLoading(true)
    setAlert(null)

    try {
      const payload = {
        businessName: formData.businessName || 'Not specified',
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(s => s) : [],
        experience: formData.experience || 'Not specified',
        portfolio: uploadedFiles.length > 0 ? uploadedFiles : (formData.portfolio ? [formData.portfolio] : []),
        description: formData.description || 'Not specified'
      }
      
      const response = await fetch('/api/seller-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const result = await response.json()
      
      if (response.ok) {
        showToast.success('Application submitted successfully!')
        setFormData({
          businessName: '',
          skills: '',
          experience: '',
          portfolio: '',
          description: ''
        })
        setUploadedFiles([])
        
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 2000)
      } else {
        showToast.error(result.error || 'Failed to submit application')
      }
    } catch (error) {
      showToast.error('Network error. Please try again')
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

        {!session ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">Please log in to submit a seller application.</p>
            <button 
              onClick={() => window.location.href = '/auth/signin'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Sign In
            </button>
          </div>
        ) : (
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
                  <Award className="w-5 h-5 text-blue-400 mt-1" />
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
                <li>• All fields are optional - fill what you can</li>
                <li>• Professional skills in your chosen area (if applicable)</li>
                <li>• Portfolio showcasing your work (if available)</li>
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
                {loading && (
                  <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p className="text-blue-300">Submitting your application...</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Business Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="Your business or professional name"
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Skills (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., Graphic Design, Logo Design, Branding (separate with commas)"
                    value={formData.skills}
                    onChange={(e) => setFormData({...formData, skills: e.target.value})}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Experience (Optional)</label>
                  <textarea
                    placeholder="Describe your professional experience..."
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Portfolio Images (Optional)</label>
                  <p className="text-xs text-gray-400 mb-2">Upload images showcasing your work</p>
                  <div className="space-y-4">
                    {process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID ? (
                      <UploadDropzone
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          const urls = res?.map(file => file.url) || []
                          setUploadedFiles(prev => [...prev, ...urls])
                          showToast.success('Images uploaded successfully!')
                        }}
                        onUploadError={(error: Error) => {
                          showToast.error(`Upload failed: ${error.message}`)
                        }}
                        className="ut-button:bg-blue-600 ut-button:ut-readying:bg-blue-500 ut-label:text-blue-400 ut-allowed-content:text-gray-400"
                      />
                    ) : (
                      <div className="p-4 bg-gray-700 border border-gray-600 rounded-lg text-center text-gray-400">
                        <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Image upload not configured. Please use Portfolio URL below instead.</p>
                      </div>
                    )}
                    {uploadedFiles.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {uploadedFiles.map((url, index) => (
                          <div key={index} className="relative">
                            <img src={url} alt={`Portfolio ${index + 1}`} className="w-full h-24 object-cover rounded" />
                            <button
                              type="button"
                              onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Portfolio URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://your-portfolio.com"
                    value={formData.portfolio}
                    onChange={(e) => setFormData({...formData, portfolio: e.target.value})}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description (Optional)</label>
                  <textarea
                    placeholder="Tell us about yourself and why you want to become a seller..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                  {!loading && <UserCheck className="w-5 h-5" />}
                </button>
              </form>
            </div>
          </div>
        </div>
        )}
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