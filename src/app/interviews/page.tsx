'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Calendar, Clock, Video, Phone, MapPin, X } from 'lucide-react'
import { toast } from 'sonner'
import PageLayout from '@/components/layouts/PageLayout'

export default function InterviewsPage() {
  const { data: session } = useSession()
  const [interviews, setInterviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    if (session?.user?.id) fetchInterviews()
  }, [session])

  const fetchInterviews = async () => {
    try {
      const res = await fetch(`/api/interviews?userId=${session?.user?.id}`)
      if (res.ok) setInterviews(await res.json())
    } catch (error) {
      console.error('Failed to fetch interviews:', error)
      toast.error('Failed to load interviews')
    } finally {
      setLoading(false)
    }
  }

  const handleJoinCall = (interview: any) => {
    if (interview.type === 'VIDEO') {
      window.open(`/video-call/${interview.id}`, '_blank')
    } else if (interview.type === 'PHONE') {
      window.location.href = `tel:${interview.application?.applicant?.phoneNumber || ''}`
    } else {
      toast.info('In-person interview details sent to your email')
    }
  }

  const handleReschedule = async (interviewId: string) => {
    setActionLoading(interviewId)
    try {
      const res = await fetch(`/api/interviews/${interviewId}/reschedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request_reschedule' })
      })
      
      if (res.ok) {
        toast.success('Reschedule request sent')
        fetchInterviews()
      } else {
        toast.error('Failed to request reschedule')
      }
    } catch (error) {
      console.error('Failed to reschedule:', error)
      toast.error('Failed to request reschedule')
    } finally {
      setActionLoading(null)
    }
  }

  const handleCancel = async (interviewId: string) => {
    if (!confirm('Are you sure you want to cancel this interview?')) return
    
    setActionLoading(interviewId)
    try {
      const res = await fetch(`/api/interviews/${interviewId}`, {
        method: 'DELETE'
      })
      
      if (res.ok) {
        toast.success('Interview cancelled')
        fetchInterviews()
      } else {
        toast.error('Failed to cancel interview')
      }
    } catch (error) {
      console.error('Failed to cancel:', error)
      toast.error('Failed to cancel interview')
    } finally {
      setActionLoading(null)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'VIDEO': return <Video className="w-4 h-4" />
      case 'PHONE': return <Phone className="w-4 h-4" />
      case 'IN_PERSON': return <MapPin className="w-4 h-4" />
      default: return <Video className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <PageLayout variant="light">
        <div className="container-custom py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-1/4"></div>
            <div className="h-32 bg-slate-200 rounded"></div>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout variant="light">
      <div className="container-custom py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 mb-2">My Interviews</h1>
          <p className="text-slate-600">Manage your scheduled interviews</p>
        </div>

        {interviews.length === 0 ? (
          <div className="card card-hover p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto text-slate-400 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Interviews Scheduled</h3>
            <p className="text-slate-600">You don't have any interviews scheduled yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {interviews.map((interview) => (
              <div key={interview.id} className="card card-hover p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{interview.application?.job?.title}</h3>
                    <p className="text-slate-600">with {interview.application?.applicant?.name}</p>
                  </div>
                  <span className={`badge ${
                    interview.status === 'SCHEDULED' ? 'badge-info' :
                    interview.status === 'COMPLETED' ? 'badge-success' :
                    'badge-error'
                  }`}>
                    {interview.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-4 h-4" />
                    {new Date(interview.scheduledAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-4 h-4" />
                    {new Date(interview.scheduledAt).toLocaleTimeString()} ({interview.duration} min)
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    {getTypeIcon(interview.type)}
                    {interview.type}
                  </div>
                  <div className="text-slate-600">
                    {interview.application?.applicant?.email}
                  </div>
                </div>

                {interview.questions?.length > 0 && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-xl">
                    <h4 className="font-bold text-slate-900 mb-2">Questions:</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                      {interview.questions.map((q: string, i: number) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {interview.status === 'SCHEDULED' && (
                  <div className="mt-4 flex gap-3">
                    <button 
                      onClick={() => handleJoinCall(interview)}
                      disabled={actionLoading === interview.id}
                      className="btn btn-primary flex-1 disabled:opacity-50"
                    >
                      {interview.type === 'VIDEO' ? 'Join Call' : 'Details'}
                    </button>
                    <button 
                      onClick={() => handleReschedule(interview.id)}
                      disabled={actionLoading === interview.id}
                      className="btn btn-secondary disabled:opacity-50"
                    >
                      Reschedule
                    </button>
                    <button 
                      onClick={() => handleCancel(interview.id)}
                      disabled={actionLoading === interview.id}
                      className="btn bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  )
}
