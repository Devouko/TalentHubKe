# Review System Usage Examples

## 1. Product Page Integration

```tsx
import { ReviewSection, QuickRating } from '@/components/reviews'

function ProductPage({ product, userCanReview }) {
  return (
    <div>
      {/* Product details */}
      <div className="mb-4">
        <QuickRating 
          rating={product.rating} 
          reviewCount={product.reviewCount}
          size="md"
        />
      </div>

      {/* Reviews section */}
      <ReviewSection
        type="product"
        targetId={product.id}
        canReview={userCanReview}
        className="mt-8"
      />
    </div>
  )
}
```

## 2. Gig/Service Page Integration

```tsx
import { ReviewSection, QuickRating } from '@/components/reviews'

function GigPage({ gig, order, userCanReview }) {
  return (
    <div>
      {/* Gig details */}
      <div className="mb-4">
        <QuickRating 
          rating={gig.rating} 
          reviewCount={gig.reviewCount}
        />
      </div>

      {/* Reviews section */}
      <ReviewSection
        type="gig"
        targetId={gig.id}
        canReview={userCanReview}
        orderId={order?.id} // Required for gig reviews
        className="mt-8"
      />
    </div>
  )
}
```

## 3. Seller Profile Integration

```tsx
import { ReviewSection, QuickRating } from '@/components/reviews'

function SellerProfile({ seller, userCanReview, orderId }) {
  return (
    <div>
      {/* Seller info */}
      <div className="mb-4">
        <QuickRating 
          rating={seller.sellerRating} 
          reviewCount={seller.sellerReviewCount}
        />
      </div>

      {/* Seller reviews */}
      <ReviewSection
        type="seller"
        targetId={seller.id}
        canReview={userCanReview}
        orderId={orderId} // Optional for seller reviews
        title="Customer Reviews"
        className="mt-8"
      />
    </div>
  )
}
```

## 4. Product Card in Listings

```tsx
import { QuickRating } from '@/components/reviews'

function ProductCard({ product }) {
  return (
    <div className="border rounded-lg p-4">
      <h3>{product.title}</h3>
      <p>${product.price}</p>
      
      <QuickRating 
        rating={product.rating} 
        reviewCount={product.reviewCount}
        size="sm"
        className="mt-2"
      />
    </div>
  )
}
```

## 5. Order Completion - Review Prompt

```tsx
import { ReviewForm } from '@/components/reviews'

function OrderCompletionModal({ order }) {
  return (
    <div>
      <h2>Order Completed!</h2>
      <p>How was your experience?</p>
      
      <ReviewForm
        type="gig"
        targetId={order.gigId}
        orderId={order.id}
        onSuccess={() => {
          // Handle success (close modal, show thank you, etc.)
        }}
      />
    </div>
  )
}
```

## API Usage Examples

### Create a Review
```typescript
// Gig review
const response = await fetch('/api/reviews/gigs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    rating: 5,
    comment: 'Excellent service!',
    gigId: 'gig_123',
    orderId: 'order_456'
  })
})

// Product review
const response = await fetch('/api/reviews/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    rating: 4,
    comment: 'Good quality product',
    productId: 'product_123'
  })
})

// Seller review
const response = await fetch('/api/reviews/sellers', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    rating: 5,
    comment: 'Professional and reliable',
    sellerId: 'seller_123',
    orderId: 'order_456' // optional
  })
})
```

### Fetch Reviews
```typescript
// Get gig reviews
const response = await fetch('/api/reviews/gigs?gigId=gig_123&page=1&limit=10')
const data = await response.json()
// Returns: { reviews: [], total: number, averageRating: number }

// Get product reviews
const response = await fetch('/api/reviews/products?productId=product_123')
const data = await response.json()

// Get seller reviews
const response = await fetch('/api/reviews/sellers?sellerId=seller_123')
const data = await response.json()
// Returns: { reviews: [], averageRating: number, totalReviews: number }
```

## Database Migration

Run the migration to add seller reviews:
```bash
npx prisma db push
# or
npx prisma migrate dev --name add-seller-reviews
```

## Features Included

✅ **Star Rating System** (1-5 stars)
✅ **Gig/Service Reviews** (linked to completed orders)
✅ **Product Reviews** (any user can review)
✅ **Seller Reviews** (separate seller rating system)
✅ **Review Verification** (verified purchases)
✅ **Image Support** (for gig reviews)
✅ **Pagination** (load more reviews)
✅ **Average Rating Calculation** (auto-updated)
✅ **Review Count Tracking**
✅ **Responsive UI Components**
✅ **Form Validation**
✅ **API Rate Limiting Ready**