# Reviews Management API Documentation

## Overview
Complete API endpoints for managing reviews across gigs, sellers, and products with ratings, comments, and statistics.

---

## 1. Gig Reviews

### GET /api/reviews
Fetch gig reviews with filtering and pagination.

**Query Parameters:**
- `gigId` (optional): Filter by gig ID
- `userId` (optional): Filter by reviewer ID
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 10): Items per page

**Response:**
```json
{
  "reviews": [
    {
      "id": "rev_123",
      "gigId": "gig_456",
      "orderId": "ord_789",
      "reviewerId": "user_101",
      "rating": 5,
      "comment": "Excellent work!",
      "images": ["url1", "url2"],
      "isVerified": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "users": { "id": "user_101", "name": "John", "image": "url" },
      "gigs": { "id": "gig_456", "title": "Logo Design" }
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 50, "pages": 5 }
}
```

### POST /api/reviews
Create a new gig review (requires authentication).

**Request Body:**
```json
{
  "gigId": "gig_456",
  "orderId": "ord_789",
  "rating": 5,
  "comment": "Great service!",
  "images": ["url1", "url2"]
}
```

**Validation:**
- Order must be completed
- User must be the buyer
- No duplicate reviews per order

**Response:** `201 Created`

### GET /api/reviews/[id]
Get a specific review by ID.

**Response:**
```json
{
  "id": "rev_123",
  "rating": 5,
  "comment": "Excellent!",
  "users": { "id": "user_101", "name": "John" },
  "gigs": { "id": "gig_456", "title": "Logo Design" },
  "orders": { "id": "ord_789", "status": "COMPLETED" }
}
```

### PATCH /api/reviews/[id]
Update a review (only by reviewer).

**Request Body:**
```json
{
  "rating": 4,
  "comment": "Updated review",
  "images": ["url1"]
}
```

**Response:** `200 OK`

### DELETE /api/reviews/[id]
Delete a review (reviewer or admin only).

**Response:** `200 OK`

### GET /api/reviews/stats
Get review statistics for a gig or user.

**Query Parameters:**
- `gigId` (required if no userId): Gig ID
- `userId` (required if no gigId): User ID

**Response:**
```json
{
  "averageRating": 4.5,
  "totalReviews": 100,
  "distribution": [
    { "rating": 5, "count": 60 },
    { "rating": 4, "count": 25 },
    { "rating": 3, "count": 10 },
    { "rating": 2, "count": 3 },
    { "rating": 1, "count": 2 }
  ]
}
```

---

## 2. Seller Reviews

### GET /api/seller-reviews
Fetch seller reviews with filtering.

**Query Parameters:**
- `sellerId` (optional): Filter by seller ID
- `reviewerId` (optional): Filter by reviewer ID
- `page` (optional, default: 1)
- `limit` (optional, default: 10)

**Response:**
```json
{
  "reviews": [
    {
      "id": "srev_123",
      "sellerId": "user_456",
      "reviewerId": "user_789",
      "orderId": "ord_101",
      "rating": 5,
      "comment": "Professional seller",
      "createdAt": "2024-01-01T00:00:00Z",
      "users_seller_reviews_reviewerIdTousers": { "name": "John" },
      "users_seller_reviews_sellerIdTousers": { "name": "Jane" }
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 30, "pages": 3 }
}
```

### POST /api/seller-reviews
Create a seller review (requires authentication).

**Request Body:**
```json
{
  "sellerId": "user_456",
  "orderId": "ord_789",
  "rating": 5,
  "comment": "Great communication"
}
```

**Response:** `201 Created`

### GET /api/seller-reviews/[id]
Get a specific seller review.

### PATCH /api/seller-reviews/[id]
Update a seller review (only by reviewer).

**Request Body:**
```json
{
  "rating": 4,
  "comment": "Updated feedback"
}
```

### DELETE /api/seller-reviews/[id]
Delete a seller review (reviewer or admin only).

### GET /api/seller-reviews/stats
Get seller review statistics.

**Query Parameters:**
- `sellerId` (required): Seller ID

**Response:**
```json
{
  "averageRating": 4.8,
  "totalReviews": 150,
  "distribution": [
    { "rating": 5, "count": 120 },
    { "rating": 4, "count": 20 },
    { "rating": 3, "count": 7 },
    { "rating": 2, "count": 2 },
    { "rating": 1, "count": 1 }
  ]
}
```

---

## 3. Product Reviews

### GET /api/product-reviews
Fetch product reviews with filtering.

**Query Parameters:**
- `productId` (optional): Filter by product ID
- `userId` (optional): Filter by reviewer ID
- `page` (optional, default: 1)
- `limit` (optional, default: 10)

**Response:**
```json
{
  "reviews": [
    {
      "id": "prev_123",
      "productId": "prod_456",
      "userId": "user_789",
      "rating": 4,
      "title": "Good quality",
      "comment": "Worth the price",
      "isVerified": false,
      "createdAt": "2024-01-01T00:00:00Z",
      "users": { "name": "John" },
      "products": { "title": "Laptop" }
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 200, "pages": 20 }
}
```

### POST /api/product-reviews
Create a product review (requires authentication).

**Request Body:**
```json
{
  "productId": "prod_456",
  "rating": 5,
  "title": "Excellent product",
  "comment": "Highly recommended"
}
```

**Response:** `201 Created`

### GET /api/product-reviews/[id]
Get a specific product review.

### PATCH /api/product-reviews/[id]
Update a product review (only by reviewer).

**Request Body:**
```json
{
  "rating": 5,
  "title": "Updated title",
  "comment": "Updated comment"
}
```

### DELETE /api/product-reviews/[id]
Delete a product review (reviewer or admin only).

### GET /api/product-reviews/stats
Get product review statistics.

**Query Parameters:**
- `productId` (required): Product ID

**Response:**
```json
{
  "averageRating": 4.3,
  "totalReviews": 500,
  "distribution": [
    { "rating": 5, "count": 250 },
    { "rating": 4, "count": 150 },
    { "rating": 3, "count": 70 },
    { "rating": 2, "count": 20 },
    { "rating": 1, "count": 10 }
  ]
}
```

---

## Features

✅ **Authentication & Authorization**
- Session-based authentication
- Role-based access control
- Owner and admin permissions

✅ **Validation**
- Zod schema validation
- Rating constraints (1-5)
- Order completion checks
- Duplicate prevention

✅ **Auto-Updates**
- Automatic rating aggregation
- Review count updates
- Real-time statistics

✅ **Pagination**
- Configurable page size
- Total count and pages
- Efficient database queries

✅ **Filtering**
- By gig/product/seller
- By reviewer
- Date ordering

---

## Error Responses

**401 Unauthorized:**
```json
{ "error": "Unauthorized" }
```

**403 Forbidden:**
```json
{ "error": "Forbidden" }
```

**404 Not Found:**
```json
{ "error": "Review not found" }
```

**400 Bad Request:**
```json
{ "error": "Order must be completed" }
```

**500 Internal Server Error:**
```json
{ "error": "Failed to fetch reviews" }
```

---

## Usage Examples

### Create Gig Review
```bash
curl -X POST https://api.example.com/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "gigId": "gig_123",
    "orderId": "ord_456",
    "rating": 5,
    "comment": "Excellent work!"
  }'
```

### Get Review Statistics
```bash
curl https://api.example.com/api/reviews/stats?gigId=gig_123
```

### Update Review
```bash
curl -X PATCH https://api.example.com/api/reviews/rev_123 \
  -H "Content-Type: application/json" \
  -d '{ "rating": 4, "comment": "Updated" }'
```

### Delete Review
```bash
curl -X DELETE https://api.example.com/api/reviews/rev_123
```
