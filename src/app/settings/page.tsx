'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { User, GraduationCap, Award, Briefcase, Languages, Wrench, CreditCard, MoreVertical, Plus, ArrowLeft, Edit, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Tab = 'basic' | 'education' | 'certification' | 'experience' | 'language' | 'skills' | 'payment'

export default function ProfileSettings() {
  const { data: session } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('basic')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [educationList, setEducationList] = useState<any[]>([])
  const [certificationList, setCertificationList] = useState<any[]>([])
  const [experienceList, setExperienceList] = useState<any[]>([])
  const [languageList, setLanguageList] = useState<any[]>([])
  const [skillsList, setSkillsList] = useState<any[]>([])
  const [paymentList, setPaymentList] = useState<any[]>([])
  const [profileData, setProfileData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    ethnicity: '',
    country: '',
    state: '',
    city: '',
    contactNumber: '',
    primaryEmail: '',
    secondaryEmail: ''
  })

  useEffect(() => {
    if (session?.user) {
      const nameParts = session.user.name?.split(' ') || []
      setProfileData(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts[nameParts.length - 1] || '',
        primaryEmail: session.user.email || ''
      }))
    }
  }, [session])

  const tabs = [
    { id: 'basic', label: 'Basic', icon: User },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'certification', label: 'Certification', icon: Award },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'language', label: 'Language', icon: Languages },
    { id: 'skills', label: 'Skills', icon: Wrench },
    { id: 'payment', label: 'Payment', icon: CreditCard }
  ]

  const handleSave = async () => {
    console.log('Saving profile data:', profileData)
    // API call to save data
  }

  const profileCompletion = 50 // Calculate based on filled fields

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Header Section */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                {session?.user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{session?.user?.name || 'User'}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-muted-foreground">
                    Profile completion: {profileCompletion}%
                  </span>
                  <Badge variant="secondary" className="bg-warning text-warning-foreground">
                    Pending
                  </Badge>
                  <Button variant="outline" size="sm">Verify Your ID</Button>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                Username: {session?.user?.email}
              </p>
              <Button variant="link" size="sm" className="text-primary">
                Change Password
              </Button>
            </div>
          </div>
        </Card>

        {/* Tabs Navigation */}
        <div className="border-b border-border mb-6">
          <div className="flex gap-8 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`flex items-center gap-2 pb-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary text-primary font-medium'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <Card className="p-6">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">First Name*</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country*</Label>
                  <Input
                    id="country"
                    value={profileData.country}
                    onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input
                    id="middleName"
                    value={profileData.middleName}
                    onChange={(e) => setProfileData({ ...profileData, middleName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State/Province*</Label>
                  <Input
                    id="state"
                    value={profileData.state}
                    onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name*</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="city">City*</Label>
                  <Input
                    id="city"
                    value={profileData.city}
                    onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    value={profileData.gender}
                    onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input
                    id="contactNumber"
                    value={profileData.contactNumber}
                    onChange={(e) => setProfileData({ ...profileData, contactNumber: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="primaryEmail">Primary Email ID</Label>
                  <Input
                    id="primaryEmail"
                    type="email"
                    value={profileData.primaryEmail}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div>
                  <Label htmlFor="ethnicity">Ethnicity</Label>
                  <Input
                    id="ethnicity"
                    value={profileData.ethnicity}
                    onChange={(e) => setProfileData({ ...profileData, ethnicity: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="secondaryEmail">Secondary Email ID</Label>
                  <Input
                    id="secondaryEmail"
                    type="email"
                    value={profileData.secondaryEmail}
                    onChange={(e) => setProfileData({ ...profileData, secondaryEmail: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSave}>Save</Button>
              </div>
            </div>
          )}

          {activeTab === 'education' && (
            <div className="space-y-6">
              {educationList.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-5 gap-4 px-4 py-3 bg-muted/50 rounded-lg text-sm font-medium text-muted-foreground">
                    <div>QUALIFICATION</div>
                    <div>SPECIALIZATION</div>
                    <div>COLLEGE/UNIVERSITY/BOARD</div>
                    <div>YEAR OF COMPLETION</div>
                    <div className="text-right">ACTIONS</div>
                  </div>
                  {educationList.map((item, idx) => (
                    <Card key={idx} className="p-4">
                      <div className="grid grid-cols-5 gap-4 items-center">
                        <div>{item.qualification}</div>
                        <div>{item.specialization}</div>
                        <div>{item.institution}</div>
                        <div>{item.year}</div>
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="sm"><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold mb-2">No education added</h3>
                  <p className="text-muted-foreground mb-6">You haven't added any education yet.</p>
                </div>
              )}
              <div className="flex justify-end">
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogTrigger asChild>
                    <Button><Plus className="w-4 h-4 mr-2" />Add New Education</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Education</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Qualification</Label>
                        <Input placeholder="Bachelor's Degree" />
                      </div>
                      <div>
                        <Label>Specialization</Label>
                        <Input placeholder="Computer Science" />
                      </div>
                      <div>
                        <Label>College/University/Board</Label>
                        <Input placeholder="University of Nairobi" />
                      </div>
                      <div>
                        <Label>Year of Completion</Label>
                        <Input type="number" placeholder="2020" />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                        <Button onClick={() => setShowAddDialog(false)}>Save</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}

          {activeTab === 'certification' && (
            <div className="space-y-6">
              {certificationList.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-5 gap-4 px-4 py-3 bg-muted/50 rounded-lg text-sm font-medium text-muted-foreground">
                    <div>CERTIFICATION NAME</div>
                    <div>ISSUING ORGANIZATION</div>
                    <div>ISSUE DATE</div>
                    <div>EXPIRY DATE</div>
                    <div className="text-right">ACTIONS</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold mb-2">No certifications added</h3>
                  <p className="text-muted-foreground mb-6">You haven't added any certifications yet.</p>
                </div>
              )}
              <div className="flex justify-end">
                <Button><Plus className="w-4 h-4 mr-2" />Add New Certification</Button>
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="space-y-6">
              {experienceList.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-5 gap-4 px-4 py-3 bg-muted/50 rounded-lg text-sm font-medium text-muted-foreground">
                    <div>COMPANY</div>
                    <div>POSITION</div>
                    <div>START DATE</div>
                    <div>END DATE</div>
                    <div className="text-right">ACTIONS</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold mb-2">No experience added</h3>
                  <p className="text-muted-foreground mb-6">You haven't added any experience yet.</p>
                </div>
              )}
              <div className="flex justify-end">
                <Button><Plus className="w-4 h-4 mr-2" />Add New Experience</Button>
              </div>
            </div>
          )}

          {activeTab === 'language' && (
            <div className="space-y-6">
              {languageList.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 px-4 py-3 bg-muted/50 rounded-lg text-sm font-medium text-muted-foreground">
                    <div>LANGUAGE</div>
                    <div>PROFICIENCY</div>
                    <div>CERTIFICATION</div>
                    <div className="text-right">ACTIONS</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold mb-2">No language added</h3>
                  <p className="text-muted-foreground mb-6">You haven't added any languages yet.</p>
                </div>
              )}
              <div className="flex justify-end">
                <Button><Plus className="w-4 h-4 mr-2" />Add New Language</Button>
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-6">
              {skillsList.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 px-4 py-3 bg-muted/50 rounded-lg text-sm font-medium text-muted-foreground">
                    <div>SKILL NAME</div>
                    <div>PROFICIENCY</div>
                    <div>REMARKS</div>
                    <div className="text-right">ACTIONS</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold mb-2">No skills added</h3>
                  <p className="text-muted-foreground mb-6">You haven't added any skills yet.</p>
                </div>
              )}
              <div className="flex justify-end">
                <Button><Plus className="w-4 h-4 mr-2" />Add New Skill</Button>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-6">
              {paymentList.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 px-4 py-3 bg-muted/50 rounded-lg text-sm font-medium text-muted-foreground">
                    <div>PROVIDER</div>
                    <div>ACCOUNT</div>
                    <div>STATUS</div>
                    <div className="text-right">ACTIONS</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold mb-2">No payment provider selected</h3>
                  <p className="text-muted-foreground mb-6">You haven't added any payment providers yet.</p>
                </div>
              )}
              <div className="flex justify-end">
                <Button><Plus className="w-4 h-4 mr-2" />Add Payment Provider</Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
