'use client'

import { useState } from 'react'
import { Star, Send, X } from 'lucide-react'

interface ReviewFormProps {
  gigId?: string
  orderId?: string
  onSubmit?: (review: { rating: number; comment: string }) => void
  onCancel?: () => void
}

export default function ReviewForm({ gigId, orderId, onSubmit, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (rating === 0) return

    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment, gigId, orderId })
      })
      
      if (response.ok) {
        setRating(0)
        setComment('')
        onSubmit?.({ rating, comment })
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onCancel?.()
  }

  return (
    <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl p-6">
      <h3 className="text-xl font-bold mb-4 text-white">Leave a Review</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  setRating(star)
                }}
                className="p-1 hover:scale-110 transition-transform"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review..."
          className="w-full p-3 bg-black/20 backdrop-blur-md border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-white placeholder-gray-400"
          rows={3}
        />

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={rating === 0 || isSubmitting}
            onClick={handleSubmit}
            className="flex-1 py-2 bg-purple-600/80 backdrop-blur-md border border-purple-500/30 text-white rounded-lg font-semibold hover:bg-purple-600/90 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit
              </>
            )}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 bg-red-600/80 backdrop-blur-md border border-red-500/30 text-white rounded-lg hover:bg-red-600/90 flex items-center gap-2 transition-all"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}