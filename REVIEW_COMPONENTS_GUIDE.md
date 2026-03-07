# Review Components Usage Guide

## Overview
Complete frontend implementation for submitting and displaying reviews for gigs, products, and sellers.

---

## Components

### 1. ReviewForm
Submit new reviews with rating and comment.

```tsx
import { ReviewForm } from '@/components/reviews/ReviewForm'

// Gig Review
<ReviewForm
  type="gig"
  targetId="gig_123"
  orderId="ord_456"
  onSuccess={() => console.log('Review submitted')}
  onCancel={() => console.log('Cancelled')}
/>

// Product Review
<ReviewForm
  type="product"
  targetId="prod_123"
  onSuccess={() => console.log('Review submitted')}
/>

// Seller Review
<ReviewForm
  type="seller"
  targetId="user_123"
  orderId="ord_456"
  onSuccess={() => console.log('Review submitted')}
/>
```

### 2. ReviewList
Display paginated list of reviews.

```tsx
import { ReviewList } from '@/components/reviews/ReviewList'

<ReviewList
  type="gig"
  targetId="gig_123"
  className="mt-6"
/>
```

### 3. StarRating
Display or input star ratings.

```tsx
import { StarRating } from '@/components/reviews/StarRating'

// Display only
<StarRating rating={4.5} size="lg" />

// Interactive
<StarRating
  rating={rating}
  interactive
  onRatingChange={(newRating) => setRating(newRating)}
  size="lg"
/>
```

### 4. ReviewSectionComplete
Complete review section with stats, form, and list.

```tsx
import { ReviewSectionComplete } from '@/components/reviews/ReviewSectionComplete'

<ReviewSectionComplete
  type="gig"
  targetId="gig_123"
  orderId="ord_456"
  canReview={true}
  className="mt-8"
/>
```

### 5. useReviewStats Hook
Fetch review statistics.

```tsx
import { useReviewStats } from '@/hooks/useReviewStats'

function MyComponent() {
  const { stats, loading } = useReviewStats('gig', 'gig_123')
  
  return (
    <div>
      <p>Average: {stats.averageRating}</p>
      <p>Total: {stats.totalReviews}</p>
    </div>
  )
}
```

---

## Integration Examples

### Gig Detail Page

```tsx
'use client'

import { ReviewSectionComplete } from '@/components/reviews/ReviewSectionComplete'
import { useSession } from 'next-auth/react'

export default function GigDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const [gig, setGig] = useState(null)
  const [userOrder, setUserOrder] = useState(null)

  // Fetch gig and check if user has completed order
  useEffect(() => {
    // ... fetch logic
  }, [])

  const canReview = session && userOrder?.status === 'COMPLETED'

  return (
    <div>
      {/* Gig details */}
      
      <ReviewSectionComplete
        type="gig"
        targetId={params.id}
        orderId={userOrder?.id}
        canReview={canReview}
      />
    </div>
  )
}
```

### Product Page

```tsx
'use client'

import { ReviewSectionComplete } from '@/components/reviews/ReviewSectionComplete'

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div>
      {/* Product details */}
      
      <ReviewSectionComplete
        type="product"
        targetId={params.id}
        canReview={true}
      />
    </div>
  )
}
```

### Seller Profile Page

```tsx
'use client'

import { ReviewList } from '@/components/reviews/ReviewList'
import { useReviewStats } from '@/hooks/useReviewStats'
import { StarRating } from '@/components/reviews/StarRating'

export default function SellerProfile({ params }: { params: { id: string } }) {
  const { stats } = useReviewStats('seller', params.id)

  return (
    <div>
      {/* Seller info */}
      
      <div className="flex items-center gap-2">
        <StarRating rating={stats.averageRating} />
        <span>({stats.totalReviews} reviews)</span>
      </div>

      <ReviewList type="seller" targetId={params.id} />
    </div>
  )
}
```

### Order Completion Flow

```tsx
'use client'

import { useState } from 'react'
import { ReviewForm } from '@/components/reviews/ReviewForm'
import { Dialog, DialogContent } from '@/components/ui/dialog'

export default function OrderComplete({ order }: { order: any }) {
  const [showReviewDialog, setShowReviewDialog] = useState(false)

  return (
    <div>
      <h2>Order Completed!</h2>
      <button onClick={() => setShowReviewDialog(true)}>
        Leave a Review
      </button>

      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
          <ReviewForm
            type="gig"
            targetId={order.gigId}
            orderId={order.id}
            onSuccess={() => setShowReviewDialog(false)}
            onCancel={() => setShowReviewDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
```

---

## Features

✅ **Star Rating System**
- Interactive star selection
- Half-star display support
- Multiple sizes (sm, md, lg)

✅ **Review Submission**
- Rating validation (1-5 stars)
- Optional comment (500 chars)
- Order validation
- Duplicate prevention

✅ **Review Display**
- Paginated list
- Load more functionality
- Verified badges
- Relative timestamps
- Expandable long comments
- Image attachments

✅ **Statistics**
- Average rating
- Total review count
- Rating distribution bars
- Visual progress indicators

✅ **Responsive Design**
- Mobile-friendly
- Touch-optimized
- Accessible

---

## API Integration

All components automatically connect to:
- `POST /api/reviews` - Gig reviews
- `POST /api/product-reviews` - Product reviews
- `POST /api/seller-reviews` - Seller reviews
- `GET /api/reviews/stats` - Statistics
- `GET /api/product-reviews/stats` - Product stats
- `GET /api/seller-reviews/stats` - Seller stats

---

## Styling

Components use Tailwind CSS and shadcn/ui:
- Consistent design system
- Dark mode ready
- Customizable via className prop
- Accessible color contrast

---

## Error Handling

- Toast notifications for success/error
- Form validation
- Loading states
- Empty states
- Network error handling
