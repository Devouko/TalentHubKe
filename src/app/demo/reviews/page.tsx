'use client'

import { ReviewSectionComplete } from '@/components/reviews/ReviewSectionComplete'
import { ReviewForm } from '@/components/reviews/ReviewForm'
import { ReviewList } from '@/components/reviews/ReviewList'
import { StarRating } from '@/components/reviews/StarRating'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ReviewDemoPage() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Review System Demo</h1>

      <Tabs defaultValue="complete" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="complete">Complete</TabsTrigger>
          <TabsTrigger value="form">Form Only</TabsTrigger>
          <TabsTrigger value="list">List Only</TabsTrigger>
          <TabsTrigger value="rating">Rating</TabsTrigger>
        </TabsList>

        <TabsContent value="complete" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Complete Review Section</CardTitle>
            </CardHeader>
            <CardContent>
              <ReviewSectionComplete
                type="gig"
                targetId="gig_demo_123"
                orderId="ord_demo_456"
                canReview={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="form" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gig Review Form</CardTitle>
              </CardHeader>
              <CardContent>
                <ReviewForm
                  type="gig"
                  targetId="gig_demo_123"
                  orderId="ord_demo_456"
                  onSuccess={() => alert('Review submitted!')}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Review Form</CardTitle>
              </CardHeader>
              <CardContent>
                <ReviewForm
                  type="product"
                  targetId="prod_demo_123"
                  onSuccess={() => alert('Review submitted!')}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Seller Review Form</CardTitle>
              </CardHeader>
              <CardContent>
                <ReviewForm
                  type="seller"
                  targetId="seller_demo_123"
                  orderId="ord_demo_789"
                  onSuccess={() => alert('Review submitted!')}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Review List</CardTitle>
            </CardHeader>
            <CardContent>
              <ReviewList type="gig" targetId="gig_demo_123" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rating" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Star Rating Examples</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm font-medium mb-2">Small (Display Only)</p>
                <StarRating rating={4.5} size="sm" />
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Medium (Display Only)</p>
                <StarRating rating={3.7} size="md" />
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Large (Display Only)</p>
                <StarRating rating={5} size="lg" />
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Interactive (Click to Rate)</p>
                <StarRating
                  rating={0}
                  size="lg"
                  interactive
                  onRatingChange={(rating) => alert(`Rated ${rating} stars`)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Usage Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">API Endpoints:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>POST /api/reviews - Submit gig review</li>
              <li>POST /api/product-reviews - Submit product review</li>
              <li>POST /api/seller-reviews - Submit seller review</li>
              <li>GET /api/reviews?gigId=xxx - Get gig reviews</li>
              <li>GET /api/reviews/stats?gigId=xxx - Get review stats</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Components:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>ReviewSectionComplete - Full review section with stats</li>
              <li>ReviewForm - Submit new reviews</li>
              <li>ReviewList - Display paginated reviews</li>
              <li>StarRating - Display or input ratings</li>
              <li>useReviewStats - Hook for fetching statistics</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Features:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>✅ Star rating system (1-5 stars)</li>
              <li>✅ Optional comments (500 chars)</li>
              <li>✅ Order validation</li>
              <li>✅ Pagination support</li>
              <li>✅ Rating statistics & distribution</li>
              <li>✅ Verified review badges</li>
              <li>✅ Responsive design</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
