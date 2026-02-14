'use client'

import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { StarRating } from './StarRating'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface Review {
  id: string
  rating: number
  comment?: string
  images: string[]
  isVerified: boolean
  createdAt: string
  reviewer: {
    id: string
    name: string
    image?: string
  }
}

interface ReviewListProps {
  type: 'gig' | 'product' | 'seller'
  targetId: string
  className?: string
}

export function ReviewList({ type, targetId, className }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchReviews()
  }, [targetId, type])

  const fetchReviews = async (pageNum = 1) => {
    try {
      const endpoint = `/api/reviews/${type}s`
      const params = new URLSearchParams({
        [`${type}Id`]: targetId,
        page: pageNum.toString(),
        limit: '10'
      })

      const response = await fetch(`${endpoint}?${params}`)
      const data = await response.json()

      if (pageNum === 1) {
        setReviews(data.reviews || [])
      } else {
        setReviews(prev => [...prev, ...(data.reviews || [])])
      }

      setAverageRating(data.averageRating || 0)
      setTotalReviews(data.total || data.totalReviews || 0)
      setHasMore((data.reviews?.length || 0) === 10)
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchReviews(nextPage)
  }

  const toggleExpanded = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews)
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId)
    } else {
      newExpanded.add(reviewId)
    }
    setExpandedReviews(newExpanded)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Summary */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          <StarRating rating={averageRating} size="lg" />
          <span className="text-lg font-semibold">
            {averageRating.toFixed(1)} out of 5
          </span>
        </div>
        <p className="text-gray-600">
          Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {reviews.map((review) => {
          const isExpanded = expandedReviews.has(review.id)
          const shouldTruncate = review.comment && review.comment.length > 200

          return (
            <Card key={review.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={review.reviewer.image} />
                    <AvatarFallback>
                      {review.reviewer.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{review.reviewer.name}</span>
                      {review.isVerified && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Verified
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <StarRating rating={review.rating} size="sm" />
                      <span className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                      </span>
                    </div>

                    {review.comment && (
                      <div>
                        <p className="text-gray-700 leading-relaxed">
                          {shouldTruncate && !isExpanded
                            ? `${review.comment.substring(0, 200)}...`
                            : review.comment
                          }
                        </p>
                        {shouldTruncate && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpanded(review.id)}
                            className="mt-1 p-0 h-auto text-blue-600 hover:text-blue-800"
                          >
                            {isExpanded ? (
                              <>
                                Show less <ChevronUp className="w-4 h-4 ml-1" />
                              </>
                            ) : (
                              <>
                                Show more <ChevronDown className="w-4 h-4 ml-1" />
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    )}

                    {review.images.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {review.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Review image ${index + 1}`}
                            className="w-16 h-16 object-cover rounded border"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center mt-6">
          <Button variant="outline" onClick={loadMore}>
            Load More Reviews
          </Button>
        </div>
      )}

      {reviews.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No reviews yet. Be the first to leave a review!
        </div>
      )}
    </div>
  )
}