'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Search, Star, MapPin, Users, Eye } from 'lucide-react'

export default function AllTalent() {
  const { data: session } = useSession()
  const [talents, setTalents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSkill, setSelectedSkill] = useState('all')

  const skills = ['all', 'design', 'development', 'writing', 'marketing', 'photography']

  useEffect(() => {
    fetchTalents()
  }, [])

  const fetchTalents = async () => {
    try {
      const response = await fetch('/api/users?type=talent')
      const data = await response.json()
      setTalents(data || [])
    } catch (error) {
      console.error('Error fetching talents:', error)
      setTalents([])
    } finally {
      setLoading(false)
    }
  }

  const filteredTalents = talents.filter(talent => {
    const matchesSearch = talent.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSkill = selectedSkill === 'all' || talent.skills?.toLowerCase().includes(selectedSkill)
    return matchesSearch && matchesSkill
  })

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">All Talent</h1>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search talent..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto">
              {skills.map(skill => (
                <button
                  key={skill}
                  onClick={() => setSelectedSkill(skill)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                    selectedSkill === skill
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {skill.charAt(0).toUpperCase() + skill.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading talent...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTalents.map(talent => (
              <div key={talent.id} className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-purple-500 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-white">{talent.name?.[0] || 'T'}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white">{talent.name || 'Talented User'}</h3>
                    <p className="text-gray-400">{talent.title || 'Professional'}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-300 text-sm mb-2">{talent.bio || 'Experienced professional ready to help with your projects.'}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{talent.rating || 4.8}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{talent.completedProjects || 25} projects</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{talent.location || 'Kenya'}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {(talent.skills || 'Design, Development').split(',').map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded-full text-xs">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-green-400">
                    KES {talent.hourlyRate?.toLocaleString() || '2,500'}/hr
                  </span>
                  
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors">
                      View Profile
                    </button>
                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors">
                      Hire Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredTalents.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No talent found</h3>
            <p className="text-gray-400">
              {searchTerm || selectedSkill !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'No talent available at the moment'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}