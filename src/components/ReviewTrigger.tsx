'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import ReviewForm from './ReviewForm'

interface ReviewTriggerProps {
  gigId?: string
  orderId?: string
  buttonText?: string
  className?: string
}

export default function ReviewTrigger({ 
  gigId, 
  orderId, 
  buttonText = "Write a Review",
  className = ""
}: ReviewTriggerProps) {
  const [showForm, setShowForm] = useState(false)

  const handleReviewSubmit = async (review: { rating: number; comment: string }) => {
    console.log('Review submitted:', review)
    setShowForm(false)
  }

  const handleCancel = () => {
    setShowForm(false)
  }

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowForm(true)
  }

  if (showForm) {
    return (
      <ReviewForm
        gigId={gigId}
        orderId={orderId}
        onSubmit={handleReviewSubmit}
        onCancel={handleCancel}
      />
    )
  }

  return (
    <button
      onClick={handleButtonClick}
      className={`flex items-center gap-2 px-4 py-2 bg-purple-600/80 backdrop-blur-md border border-purple-500/30 text-white rounded-lg hover:bg-purple-600/90 transition-all ${className}`}
    >
      <Star className="w-4 h-4" />
      {buttonText}
    </button>
  )
}