'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { User, FileText, Clock, CheckCircle } from 'lucide-react'
import { toast } from '@/lib/toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Textarea } from '@/app/components/ui/textarea'
import { Label } from '@/app/components/ui/label'

interface ApplyButtonProps {
  job: {
    id: string
    title: string
    description: string
    price: number
    sellerId: string
  }
  onApplicationSubmitted?: () => void
}

export default function ApplyButton({ job, onApplicationSubmitted }: ApplyButtonProps) {
  const { data: session } = useSession()
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const [application, setApplication] = useState({
    coverLetter: '',
    skills: '',
    experience: ''
  })

  const checkApplicationStatus = async () => {
    if (!session?.user?.id) return
    
    try {
      const response = await fetch(`/api/applications?jobId=${job.id}&applicantId=${session.user.id}`)
      const data = await response.json()
      setHasApplied(data.hasApplied)
    } catch (error) {
      console.error('Error checking application status:', error)
    }
  }

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.id) {
      toast.error('Please sign in to apply')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.id,
          applicantId: session.user.id,
          ...application
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        toast.success('Application submitted successfully!')
        setHasApplied(true)
        setShowModal(false)
        onApplicationSubmitted?.()
      } else {
        toast.error(data.error || 'Failed to submit application')
      }
    } catch (error) {
      toast.error('Failed to submit application')
    } finally {
      setLoading(false)
    }
  }

  const handleButtonClick = () => {
    if (!session?.user?.id) {
      toast.error('Please sign in to apply')
      return
    }
    
    if (job.sellerId === session.user.id) {
      toast.error('You cannot apply to your own job')
      return
    }

    checkApplicationStatus()
    setShowModal(true)
  }

  if (hasApplied) {
    return (
      <button
        disabled
        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 opacity-75 cursor-not-allowed"
      >
        <CheckCircle className="w-4 h-4" />
        Applied
      </button>
    )
  }

  return (
    <>
      <button
        onClick={handleButtonClick}
        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
      >
        <User className="w-4 h-4" />
        Apply
      </button>

      {showModal && (
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Apply for Job</DialogTitle>
            </DialogHeader>
            
            <div className="mb-4 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
              <h4 className="font-semibold">{job.title}</h4>
            </div>

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <Label>Budget</Label>
                <Input
                  value={`KES ${job.price?.toLocaleString()}`}
                  readOnly
                  className="bg-slate-100 dark:bg-slate-700"
                />
              </div>

              <div>
                <Label>Cover Letter</Label>
                <Textarea
                  value={application.coverLetter}
                  onChange={(e) => setApplication({...application, coverLetter: e.target.value})}
                  placeholder="Why are you interested in this job?"
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label>Relevant Skills</Label>
                <Input
                  value={application.skills}
                  onChange={(e) => setApplication({...application, skills: e.target.value})}
                  placeholder="e.g., Data entry, Excel, Research"
                  required
                />
              </div>

              <div>
                <Label>Experience</Label>
                <Textarea
                  value={application.experience}
                  onChange={(e) => setApplication({...application, experience: e.target.value})}
                  placeholder="Brief description of relevant experience"
                  rows={3}
                  required
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}