'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ReviewForm } from './ReviewForm'
import { ReviewList } from './ReviewList'
import { StarRating } from './StarRating'
import { useReviewStats } from '@/hooks/useReviewStats'
import { Progress } from '@/components/ui/progress'

interface ReviewSectionProps {
  type: 'gig' | 'product' | 'seller'
  targetId: string
  orderId?: string
  canReview?: boolean
  className?: string
}

export function ReviewSection({ type, targetId, orderId, canReview = false, className }: ReviewSectionProps) {
  const [showForm, setShowForm] = useState(false)
  const { stats, loading } = useReviewStats(type, targetId)

  const handleReviewSuccess = () => {
    setShowForm(false)
    window.location.reload()
  }

  return (
    <div className={className}>
      {/* Statistics */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
          
          {loading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-8 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">{stats.averageRating.toFixed(1)}</div>
                  <StarRating rating={stats.averageRating} size="lg" />
                  <p className="text-sm text-gray-600 mt-2">
                    {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const dist = stats.distribution.find(d => d.rating === rating)
                    const count = dist?.count || 0
                    const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0

                    return (
                      <div key={rating} className="flex items-center gap-2">
                        <span className="text-sm w-8">{rating} ★</span>
                        <Progress value={percentage} className="flex-1 h-2" />
                        <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {canReview && !showForm && (
                <Button onClick={() => setShowForm(true)} className="w-full">
                  Write a Review
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Review Form */}
      {showForm && (
        <div className="mb-6">
          <ReviewForm
            type={type}
            targetId={targetId}
            orderId={orderId}
            onSuccess={handleReviewSuccess}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Review List */}
      <ReviewList type={type} targetId={targetId} />
    </div>
  )
}
