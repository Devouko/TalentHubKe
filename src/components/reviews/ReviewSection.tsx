'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { StarRating } from './StarRating'
import { ReviewForm } from './ReviewForm'
import { ReviewList } from './ReviewList'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, Star } from 'lucide-react'

interface ReviewSectionProps {
  type: 'gig' | 'product' | 'seller'
  targetId: string
  canReview?: boolean
  orderId?: string
  title?: string
  className?: string
}

export function ReviewSection({ 
  type, 
  targetId, 
  canReview = false, 
  orderId, 
  title,
  className 
}: ReviewSectionProps) {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleReviewSuccess = () => {
    setShowReviewForm(false)
    setRefreshKey(prev => prev + 1)
  }

  const getTitle = () => {
    if (title) return title
    switch (type) {
      case 'gig': return 'Service Reviews'
      case 'product': return 'Product Reviews'
      case 'seller': return 'Seller Reviews'
      default: return 'Reviews'
    }
  }

  const getReviewButtonText = () => {
    switch (type) {
      case 'gig': return 'Review Service'
      case 'product': return 'Review Product'
      case 'seller': return 'Review Seller'
      default: return 'Write Review'
    }
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            {getTitle()}
          </CardTitle>
          {canReview && (
            <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  {getReviewButtonText()}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{getReviewButtonText()}</DialogTitle>
                </DialogHeader>
                <ReviewForm
                  type={type}
                  targetId={targetId}
                  orderId={orderId}
                  onSuccess={handleReviewSuccess}
                  onCancel={() => setShowReviewForm(false)}
                />
              </DialogContent>
            </Dialog>
          )}
        </CardHeader>
        <CardContent>
          <ReviewList 
            key={refreshKey}
            type={type} 
            targetId={targetId} 
          />
        </CardContent>
      </Card>
    </div>
  )
}

// Quick rating display component for cards/listings
interface QuickRatingProps {
  rating: number
  reviewCount: number
  size?: 'sm' | 'md' | 'lg'
  showCount?: boolean
  className?: string
}

export function QuickRating({ 
  rating, 
  reviewCount, 
  size = 'sm', 
  showCount = true,
  className 
}: QuickRatingProps) {
  if (reviewCount === 0) {
    return (
      <div className={className}>
        <span className="text-gray-500 text-sm">No reviews yet</span>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <StarRating rating={rating} size={size} />
      {showCount && (
        <span className="text-sm text-gray-600">
          ({reviewCount})
        </span>
      )}
    </div>
  )
}