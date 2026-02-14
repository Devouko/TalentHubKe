'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Calendar, Package } from 'lucide-react'
import ReviewForm from '@/components/ReviewForm'

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user?.id) {
      fetchPurchases()
    }
  }, [session])

  const fetchPurchases = async () => {
    try {
      const response = await fetch('/api/purchases')
      if (response.ok) {
        const data = await response.json()
        setPurchases(data)
      } else {
        console.error('Failed to fetch purchases')
      }
    } catch (error) {
      console.error('Network error fetching purchases:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Purchases</h1>
        
        <div className="space-y-6">
          {purchases.map((purchase) => (
            <div key={purchase.id} className="bg-card rounded-lg p-6 border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{purchase.gig?.title}</h3>
                  <p className="text-muted-foreground text-sm mb-2">{purchase.gig?.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(purchase.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      <span className="capitalize">{purchase.status.toLowerCase()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary mb-2">
                    KES {purchase.totalAmount?.toLocaleString()}
                  </div>
                  <ReviewForm
                    orderId={purchase.id}
                    gigTitle={purchase.gig?.title}
                    onReviewSubmitted={fetchPurchases}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {purchases.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No completed purchases yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}