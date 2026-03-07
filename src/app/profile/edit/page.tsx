'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Plus, Trash2, Save, Briefcase, Award, Globe, CreditCard } from 'lucide-react'

export default function EditProfile() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({ name: '', email: '', phoneNumber: '', county: '', bio: '' })
  const [skills, setSkills] = useState<any[]>([])
  const [experiences, setExperiences] = useState<any[]>([])
  const [certifications, setCertifications] = useState<any[]>([])
  const [languages, setLanguages] = useState<any[]>([])

  useEffect(() => {
    if (session?.user) fetchProfile()
  }, [session])

  const fetchProfile = async () => {
    const res = await fetch('/api/profile')
    if (res.ok) {
      const data = await res.json()
      setProfile(data)
      setSkills(data.skills || [])
      setExperiences(data.experiences || [])
      setCertifications(data.certifications || [])
      setLanguages(data.languages || [])
    }
  }

  const saveProfile = async () => {
    setLoading(true)
    await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    })
    setLoading(false)
    alert('Profile updated')
  }

  const addSkill = async () => {
    const name = prompt('Skill name:')
    if (!name) return
    const res = await fetch('/api/profile/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, level: 'INTERMEDIATE' })
    })
    if (res.ok) fetchProfile()
  }

  const deleteSkill = async (id: string) => {
    await fetch(`/api/profile/skills?id=${id}`, { method: 'DELETE' })
    fetchProfile()
  }

  const addExperience = async () => {
    const title = prompt('Job title:')
    const company = prompt('Company:')
    if (!title || !company) return
    await fetch('/api/profile/experience', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, company, startDate: new Date(), current: true })
    })
    fetchProfile()
  }

  const deleteExperience = async (id: string) => {
    await fetch(`/api/profile/experience?id=${id}`, { method: 'DELETE' })
    fetchProfile()
  }

  const addCertification = async () => {
    const name = prompt('Certification name:')
    const issuer = prompt('Issuer:')
    if (!name || !issuer) return
    await fetch('/api/profile/certification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, issuer, date: new Date() })
    })
    fetchProfile()
  }

  const deleteCertification = async (id: string) => {
    await fetch(`/api/profile/certification?id=${id}`, { method: 'DELETE' })
    fetchProfile()
  }

  const addLanguage = async () => {
    const language = prompt('Language:')
    const proficiency = prompt('Proficiency (BASIC/INTERMEDIATE/FLUENT/NATIVE):')
    if (!language || !proficiency) return
    await fetch('/api/profile/language', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language, proficiency })
    })
    fetchProfile()
  }

  const deleteLanguage = async (id: string) => {
    await fetch(`/api/profile/language?id=${id}`, { method: 'DELETE' })
    fetchProfile()
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
        <div className="space-y-4">
          <input
            placeholder="Name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
          <input
            placeholder="Phone"
            value={profile.phoneNumber}
            onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
          <input
            placeholder="County"
            value={profile.county}
            onChange={(e) => setProfile({ ...profile, county: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
          <textarea
            placeholder="Bio"
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg min-h-[100px]"
          />
          <button onClick={saveProfile} disabled={loading} className="btn-primary">
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Briefcase className="w-5 h-5" /> Skills
          </h2>
          <button onClick={addSkill} className="btn-secondary">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
        <div className="space-y-2">
          {skills.map((skill) => (
            <div key={skill.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span>{skill.name} - {skill.level}</span>
              <button onClick={() => deleteSkill(skill.id)} className="text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Briefcase className="w-5 h-5" /> Experience
          </h2>
          <button onClick={addExperience} className="btn-secondary">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
        <div className="space-y-2">
          {experiences.map((exp) => (
            <div key={exp.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">{exp.title}</div>
                <div className="text-sm text-gray-600">{exp.company}</div>
              </div>
              <button onClick={() => deleteExperience(exp.id)} className="text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Award className="w-5 h-5" /> Certifications
          </h2>
          <button onClick={addCertification} className="btn-secondary">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
        <div className="space-y-2">
          {certifications.map((cert) => (
            <div key={cert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">{cert.name}</div>
                <div className="text-sm text-gray-600">{cert.issuer}</div>
              </div>
              <button onClick={() => deleteCertification(cert.id)} className="text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Globe className="w-5 h-5" /> Languages
          </h2>
          <button onClick={addLanguage} className="btn-secondary">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
        <div className="space-y-2">
          {languages.map((lang) => (
            <div key={lang.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span>{lang.language} - {lang.proficiency}</span>
              <button onClick={() => deleteLanguage(lang.id)} className="text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
