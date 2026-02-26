'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'
import { Textarea } from '@/app/components/ui/textarea'
import { Calendar as CalendarIcon, Plus } from 'lucide-react'
import { toast } from 'sonner'

interface ScheduleInterviewModalProps {
  applicationId: string
  onScheduled?: () => void
}

export default function ScheduleInterviewModal({ applicationId, onScheduled }: ScheduleInterviewModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    scheduledAt: '',
    duration: 30,
    type: 'VIDEO',
    questions: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const questions = formData.questions
        .split('\n')
        .filter(q => q.trim())
        .map(q => q.trim())

      const res = await fetch('/api/interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId,
          scheduledAt: new Date(formData.scheduledAt).toISOString(),
          duration: formData.duration,
          type: formData.type,
          questions
        })
      })

      if (res.ok) {
        toast.success('Interview scheduled successfully')
        setOpen(false)
        onScheduled?.()
      } else {
        const error = await res.json()
        toast.error(error.error || 'Failed to schedule interview')
      }
    } catch (error) {
      toast.error('Failed to schedule interview')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <CalendarIcon className="w-4 h-4 mr-2" />
          Schedule Interview
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Interview</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="scheduledAt">Date & Time</Label>
            <Input
              id="scheduledAt"
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              min="15"
              max="180"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              required
            />
          </div>

          <div>
            <Label htmlFor="type">Interview Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VIDEO">Video Call</SelectItem>
                <SelectItem value="PHONE">Phone Call</SelectItem>
                <SelectItem value="IN_PERSON">In Person</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="questions">Interview Questions (one per line)</Label>
            <Textarea
              id="questions"
              placeholder="Tell me about yourself&#10;What are your strengths?&#10;Why do you want this position?"
              rows={5}
              value={formData.questions}
              onChange={(e) => setFormData({ ...formData, questions: e.target.value })}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Scheduling...' : 'Schedule Interview'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
