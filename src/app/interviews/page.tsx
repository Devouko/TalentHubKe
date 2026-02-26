'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { Calendar, Clock, Video, Phone, MapPin } from 'lucide-react'
import { format } from 'date-fns'

interface Interview {
  id: string
  scheduledAt: string
  duration: number
  type: 'VIDEO' | 'PHONE' | 'IN_PERSON'
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
  questions?: string[]
  application: {
    job: { title: string }
    applicant: { name: string; email: string }
  }
}

export default function InterviewsPage() {
  const { data: session } = useSession()
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.id) {
      fetchInterviews()
    }
  }, [session])

  const fetchInterviews = async () => {
    try {
      const res = await fetch(`/api/interviews?userId=${session?.user?.id}`)
      if (res.ok) {
        const data = await res.json()
        setInterviews(data)
      }
    } catch (error) {
      console.error('Failed to fetch interviews:', error)
    } finally {
      setLoading(false)
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return <Badge className="bg-blue-500">Scheduled</Badge>
      case 'COMPLETED':
        return <Badge className="bg-green-500">Completed</Badge>
      case 'CANCELLED':
        return <Badge className="bg-red-500">Cancelled</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Interviews</h1>
        <p className="text-gray-600 mt-2">Manage your scheduled interviews</p>
      </div>

      {interviews.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Interviews Scheduled</h3>
            <p className="text-gray-600">You don't have any interviews scheduled yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {interviews.map((interview) => (
            <Card key={interview.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{interview.application.job.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      with {interview.application.applicant.name}
                    </p>
                  </div>
                  {getStatusBadge(interview.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">
                      {format(new Date(interview.scheduledAt), 'PPP')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">
                      {format(new Date(interview.scheduledAt), 'p')} ({interview.duration} min)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(interview.type)}
                    <span className="text-sm capitalize">{interview.type.toLowerCase()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {interview.application.applicant.email}
                    </span>
                  </div>
                </div>

                {interview.questions && interview.questions.length > 0 && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Interview Questions:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {interview.questions.map((q, i) => (
                        <li key={i} className="text-sm text-gray-700">{q}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {interview.status === 'SCHEDULED' && (
                  <div className="mt-4 flex gap-2">
                    <Button className="flex-1">
                      {interview.type === 'VIDEO' ? 'Join Video Call' : 'View Details'}
                    </Button>
                    <Button variant="outline">Reschedule</Button>
                    <Button variant="destructive">Cancel</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
