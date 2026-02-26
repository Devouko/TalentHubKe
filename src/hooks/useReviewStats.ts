'use client'

import { useEffect, useState } from 'react'

interface ReviewStats {
  averageRating: number
  totalReviews: number
  distribution: Array<{ rating: number; count: number }>
}

export function useReviewStats(type: 'gig' | 'product' | 'seller', targetId: string) {
  const [stats, setStats] = useState<ReviewStats>({
    averageRating: 0,
    totalReviews: 0,
    distribution: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!targetId) return

    const fetchStats = async () => {
      try {
        let endpoint = ''
        let params = new URLSearchParams()

        if (type === 'gig') {
          endpoint = '/api/reviews/stats'
          params.append('gigId', targetId)
        } else if (type === 'product') {
          endpoint = '/api/product-reviews/stats'
          params.append('productId', targetId)
        } else if (type === 'seller') {
          endpoint = '/api/seller-reviews/stats'
          params.append('sellerId', targetId)
        }

        const response = await fetch(`${endpoint}?${params}`)
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Failed to fetch review stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [type, targetId])

  return { stats, loading }
}
