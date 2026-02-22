'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { MessageCircle, Star, MapPin, Loader2 } from 'lucide-react'

export default function HirePage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [talent, setTalent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [hiring, setHiring] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    const fetchTalent = async () => {
      try {
        const response = await fetch(`/api/users/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setTalent(data)
        }
      } catch (error) {
        console.error('Error fetching talent:', error)
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated') {
      fetchTalent()
    }
  }, [params.id, status, router])

  const handleHire = async () => {
    setHiring(true)
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: params.id })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        router.push(`/messages?conversation=${data.conversationId}`)
      } else {
        alert(data.error || 'Failed to start conversation')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to start conversation')
    } finally {
      setHiring(false)
    }
  }

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!talent) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Talent not found</h2>
          <button onClick={() => router.push('/all-talent')} className="text-blue-500 hover:underline">
            Back to all talent
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center overflow-hidden">
              {talent.profileImage ? (
                <img src={talent.profileImage} alt={talent.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold">{talent.name?.[0] || 'T'}</span>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{talent.name}</h1>
              <p className="text-gray-400">{talent.userType === 'FREELANCER' ? 'Freelancer' : 'Agency'}</p>
              {talent.county && (
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{talent.county}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">About</h2>
            <p className="text-gray-300">{talent.bio || 'No bio available'}</p>
          </div>

          {talent.gigs?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Services</h2>
              <div className="grid gap-4">
                {talent.gigs.map((gig: any) => (
                  <div key={gig.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{gig.title}</h3>
                      <span className="text-green-400 font-bold">KES {gig.price.toLocaleString()}</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{gig.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>{gig.deliveryTime} days delivery</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span>{gig.rating || 0} ({gig.reviewCount || 0})</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleHire}
            disabled={hiring}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            {hiring ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Starting conversation...
              </>
            ) : (
              <>
                <MessageCircle className="w-5 h-5" />
                Start Conversation
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
