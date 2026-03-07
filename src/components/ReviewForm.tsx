'use client'

import { useState } from 'react'
import { MessageSquare } from 'lucide-react'
import { ReviewForm as SharedReviewForm } from './reviews/ReviewForm'

interface ReviewFormProps {
  orderId: string
  gigTitle: string
  onReviewSubmitted?: () => void
}

export default function ReviewForm({ orderId, gigTitle, onReviewSubmitted }: ReviewFormProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
      >
        <MessageSquare className="w-4 h-4" />
        Leave Review
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg w-full max-w-md">
        <SharedReviewForm
          type="gig"
          targetId={orderId} // Note: In SharedReviewForm, gigId is targetId when type is 'gig'
          orderId={orderId}
          onSuccess={() => {
            setIsOpen(false)
            onReviewSubmitted?.()
          }}
          onCancel={() => setIsOpen(false)}
        />
      </div>
    </div>
  )
}