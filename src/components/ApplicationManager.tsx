'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { User, Calendar, Clock, CheckCircle, X, Eye, MessageCircle } from 'lucide-react'
import { toast } from '@/lib/toast'

interface Application {
  id: string
  jobId: string
  applicantId: string
  coverLetter: string
  skills: string
  experience: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'INTERVIEWED'
  createdAt: string
  job: { title: string }
  applicant: { name: string; email: string }
}

export default function ApplicationManager() {
  const { data: session } = useSession()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [showInterviewModal, setShowInterviewModal] = useState(false)
  const [interviewData, setInterviewData] = useState({
    scheduledAt: '',
    questions: ['Tell me about yourself', 'Why are you interested in this position?'],
    duration: 30,
    type: 'VIDEO'
  })

  useEffect(() => {
    if (session?.user?.id) {
      fetchApplications()
    }
  }, [session?.user?.id])

  const fetchApplications = async () => {
    try {
      const response = await fetch(`/api/applications?posterId=${session?.user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setApplications(data)
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const scheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedApplication) return

    try {
      const response = await fetch('/api/interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: selectedApplication.id,
          ...interviewData
        })
      })

      if (response.ok) {
        toast.success('Interview scheduled successfully!')
        setShowInterviewModal(false)
        setSelectedApplication(null)
        fetchApplications()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to schedule interview')
      }
    } catch (error) {
      toast.error('Failed to schedule interview')
    }
  }

  const updateApplicationStatus = async (applicationId: string, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        toast.success(`Application ${status.toLowerCase()}`)
        fetchApplications()
      }
    } catch (error) {
      toast.error('Failed to update application')
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
        <p className="text-slate-600 dark:text-slate-400 mt-4">Loading applications...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Job Applications</h2>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          {applications.length} total applications
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-300 mb-2">No Applications Yet</h3>
          <p className="text-slate-400">Applications for your jobs will appear here</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map((application) => (
            <div key={application.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{application.job.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Applied by {application.applicant.name} • {new Date(application.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  application.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  application.status === 'ACCEPTED' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  application.status === 'REJECTED' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                }`}>
                  {application.status}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <h4 className="font-medium text-sm text-slate-700 dark:text-slate-300">Skills:</h4>
                  <p className="text-slate-600 dark:text-slate-400">{application.skills}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-slate-700 dark:text-slate-300">Cover Letter:</h4>
                  <p className="text-slate-600 dark:text-slate-400">{application.coverLetter}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-slate-700 dark:text-slate-300">Experience:</h4>
                  <p className="text-slate-600 dark:text-slate-400">{application.experience}</p>
                </div>
              </div>

              {application.status === 'PENDING' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedApplication(application)
                      setShowInterviewModal(true)
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Schedule Interview
                  </button>
                  <button
                    onClick={() => updateApplicationStatus(application.id, 'ACCEPTED')}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Accept
                  </button>
                  <button
                    onClick={() => updateApplicationStatus(application.id, 'REJECTED')}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                  <button className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm font-medium flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showInterviewModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Schedule Interview</h3>
              <div className="mb-4 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <h4 className="font-semibold">{selectedApplication.applicant.name}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {selectedApplication.job.title}
                </p>
              </div>

              <form onSubmit={scheduleInterview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Interview Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={interviewData.scheduledAt}
                    onChange={(e) => setInterviewData({...interviewData, scheduledAt: e.target.value})}
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Duration (minutes)
                  </label>
                  <select
                    value={interviewData.duration}
                    onChange={(e) => setInterviewData({...interviewData, duration: parseInt(e.target.value)})}
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>1 hour</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Interview Type</label>
                  <select
                    value={interviewData.type}
                    onChange={(e) => setInterviewData({...interviewData, type: e.target.value})}
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                  >
                    <option value="VIDEO">Video Call</option>
                    <option value="PHONE">Phone Call</option>
                    <option value="IN_PERSON">In Person</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowInterviewModal(false)}
                    className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Schedule Interview
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}