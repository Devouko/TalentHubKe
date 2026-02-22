'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Upload, User, Mail, Phone, MapPin, Save, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { UploadButton } from '@/utils/uploadthing'
import Image from 'next/image'

export default function EditProfile() {
  const { data: session, update } = useSession()
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    county: '',
    bio: '',
    profileImage: ''
  })

  useEffect(() => {
    if (session?.user) {
      fetchProfile()
    }
  }, [session])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        setProfileData({
          name: data.name || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          county: data.county || '',
          bio: data.bio || '',
          profileImage: data.profileImage || ''
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      })

      if (response.ok) {
        await update()
        alert('Profile updated successfully!')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const profileCompletion = 50

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              {profileData.profileImage ? (
                <Image
                  src={profileData.profileImage}
                  alt="Profile"
                  width={120}
                  height={120}
                  className="rounded-full object-cover border-4 border-primary/20"
                />
              ) : (
                <div className="w-30 h-30 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground text-4xl font-bold border-4 border-primary/20">
                  {profileData.name?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              <div className="absolute bottom-0 right-0 bg-primary rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors">
                <Camera className="w-4 h-4 text-primary-foreground" />
              </div>
            </div>
            
            {/* Profile Info */}
            <div>
              <h1 className="text-2xl font-bold mb-2">{profileData.name || 'User'}</h1>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm text-muted-foreground">
                  Profile completion: {profileCompletion}%
                </span>
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${profileCompletion}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-warning/20 text-warning border-warning/30">
                  Pending
                </Badge>
                <Button variant="outline" size="sm">Verify Your ID</Button>
              </div>
            </div>
          </div>
          
          {/* Credentials */}
          <div className="text-sm text-muted-foreground space-y-1">
            <div>Username: {profileData.email}</div>
            <Button variant="link" size="sm" className="text-primary p-0 h-auto">
              Change Password
            </Button>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Profile Picture</h3>
        <div className="flex items-center gap-4">
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              if (res?.[0]?.url) {
                setProfileData({ ...profileData, profileImage: res[0].url })
              }
            }}
            onUploadError={(error) => {
              console.error('Upload error:', error)
            }}
            appearance={{
              button: "bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              allowedContent: "text-muted-foreground text-xs"
            }}
          />
          <span className="text-xs text-muted-foreground">Images up to 4MB, max 5</span>
        </div>
      </div>

      {/* Basic Information Form */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-6">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name
            </Label>
            <Input
              id="name"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={profileData.email}
              disabled
              className="mt-2 bg-muted"
            />
          </div>

          <div>
            <Label htmlFor="phoneNumber" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </Label>
            <Input
              id="phoneNumber"
              value={profileData.phoneNumber}
              onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="county" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              County
            </Label>
            <Input
              id="county"
              value={profileData.county}
              onChange={(e) => setProfileData({ ...profileData, county: e.target.value })}
              className="mt-2"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              className="w-full min-h-[120px] mt-2 p-3 rounded-md border border-input bg-background text-foreground resize-vertical"
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  )
}
