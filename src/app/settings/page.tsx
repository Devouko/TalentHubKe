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

import DashboardLayout from '@/components/layouts/DashboardLayout'

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
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Header Section */}
        <Card className="p-6 mb-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-500/20">
                {session?.user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{session?.user?.name || 'User'}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Profile completion: {profileCompletion}%
                  </span>
                  <Badge variant="secondary" className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-none">
                    Pending
                  </Badge>
                  <Button variant="outline" size="sm" className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-900/20">Verify Your ID</Button>
                </div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Username: {session?.user?.email}
              </p>
              <Button variant="link" size="sm" className="text-blue-600 dark:text-blue-400 p-0 h-auto font-semibold">
                Change Password
              </Button>
            </div>
          </div>
        </Card>

        {/* Tabs Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
          <div className="flex gap-8 overflow-x-auto pb-1 scrollbar-hide">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`flex items-center gap-2 pb-4 px-2 border-b-2 transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
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
        <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName" className="text-slate-700 dark:text-slate-300">First Name*</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    className="mt-1 focus:ring-blue-600 dark:bg-slate-900 dark:border-slate-700"
                  />
                </div>
                <div>
                  <Label htmlFor="country" className="text-slate-700 dark:text-slate-300">Country*</Label>
                  <Input
                    id="country"
                    value={profileData.country}
                    onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                    className="mt-1 focus:ring-blue-600 dark:bg-slate-900 dark:border-slate-700"
                  />
                </div>
                <div>
                  <Label htmlFor="middleName" className="text-slate-700 dark:text-slate-300">Middle Name</Label>
                  <Input
                    id="middleName"
                    value={profileData.middleName}
                    onChange={(e) => setProfileData({ ...profileData, middleName: e.target.value })}
                    className="mt-1 focus:ring-blue-600 dark:bg-slate-900 dark:border-slate-700"
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
                    className="flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                  >
                    <option value="" className="dark:bg-slate-900">Select Gender</option>
                    <option value="male" className="dark:bg-slate-900">Male</option>
                    <option value="female" className="dark:bg-slate-900">Female</option>
                    <option value="other" className="dark:bg-slate-900">Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="contactNumber" className="text-slate-700 dark:text-slate-300">Contact Number</Label>
                  <Input
                    id="contactNumber"
                    value={profileData.contactNumber}
                    onChange={(e) => setProfileData({ ...profileData, contactNumber: e.target.value })}
                    className="mt-1 focus:ring-blue-600 dark:bg-slate-900 dark:border-slate-700"
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth" className="text-slate-700 dark:text-slate-300">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                    className="mt-1 focus:ring-blue-600 dark:bg-slate-900 dark:border-slate-700"
                  />
                </div>
                <div>
                  <Label htmlFor="primaryEmail" className="text-slate-700 dark:text-slate-300">Primary Email ID</Label>
                  <Input
                    id="primaryEmail"
                    type="email"
                    value={profileData.primaryEmail}
                    disabled
                    className="mt-1 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-slate-500"
                  />
                </div>
                <div>
                  <Label htmlFor="ethnicity" className="text-slate-700 dark:text-slate-300">Ethnicity</Label>
                  <Input
                    id="ethnicity"
                    value={profileData.ethnicity}
                    onChange={(e) => setProfileData({ ...profileData, ethnicity: e.target.value })}
                    className="mt-1 focus:ring-blue-600 dark:bg-slate-900 dark:border-slate-700"
                  />
                </div>
                <div>
                  <Label htmlFor="secondaryEmail" className="text-slate-700 dark:text-slate-300">Secondary Email ID</Label>
                  <Input
                    id="secondaryEmail"
                    type="email"
                    value={profileData.secondaryEmail}
                    onChange={(e) => setProfileData({ ...profileData, secondaryEmail: e.target.value })}
                    className="mt-1 focus:ring-blue-600 dark:bg-slate-900 dark:border-slate-700"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white px-8">Save Changes</Button>
              </div>
            </div>
          )}

          {activeTab === 'education' && (
            <div className="space-y-6">
              {educationList.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-5 gap-4 px-4 py-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg text-sm font-medium text-slate-500">
                    <div>QUALIFICATION</div>
                    <div>SPECIALIZATION</div>
                    <div>COLLEGE/UNIVERSITY/BOARD</div>
                    <div>YEAR OF COMPLETION</div>
                    <div className="text-right">ACTIONS</div>
                  </div>
                  {educationList.map((item, idx) => (
                    <Card key={idx} className="p-4 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                      <div className="grid grid-cols-5 gap-4 items-center">
                        <div className="font-medium text-slate-900 dark:text-white">{item.qualification}</div>
                        <div className="text-slate-600 dark:text-slate-400">{item.specialization}</div>
                        <div className="text-slate-600 dark:text-slate-400">{item.institution}</div>
                        <div className="text-slate-600 dark:text-slate-400">{item.year}</div>
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 dark:text-blue-400"><Edit className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">No education added</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6">You haven't added any education credentials yet.</p>
                </div>
              )}
              <div className="flex justify-end">
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white"><Plus className="w-4 h-4 mr-2" />Add New Education</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] dark:bg-slate-800 dark:border-slate-700">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">Add Education</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div>
                        <Label className="text-slate-700 dark:text-slate-300">Qualification</Label>
                        <Input placeholder="Bachelor's Degree" className="mt-1 focus:ring-blue-600 dark:bg-slate-900 dark:border-slate-700" />
                      </div>
                      <div>
                        <Label className="text-slate-700 dark:text-slate-300">Specialization</Label>
                        <Input placeholder="Computer Science" className="mt-1 focus:ring-blue-600 dark:bg-slate-900 dark:border-slate-700" />
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
    </DashboardLayout>
  )
}
