# API Endpoints - Complete Documentation

Base URL: `http://localhost:3000`

## ✅ Authentication

### POST /api/auth/signin
Login with credentials
```json
{"email": "user@example.com", "password": "password123"}
```

### POST /api/auth/register
Register new user
```json
{"email": "user@example.com", "password": "password123", "name": "John Doe", "userType": "CLIENT"}
```

### POST /api/auth/signup
Signup (supports ADMIN)
```json
{"email": "admin@example.com", "password": "admin123", "name": "Admin", "userType": "ADMIN"}
```

---

## ✅ Users

### GET /api/users
Get all users

### GET /api/users?id={userId}
Get user by ID

### GET /api/users?type=talent
Get talent users

### PUT /api/users?id={userId}
Update user
```json
{"name": "Updated Name"}
```

---

## ✅ Gigs

### GET /api/gigs
Get all gigs

### GET /api/gigs?id={gigId}
Get gig by ID

### POST /api/gigs (Auth: FREELANCER/AGENCY/ADMIN)
Create gig
```json
{"title": "Web Development", "description": "Full stack", "category": "Programming", "price": 5000, "deliveryTime": 7, "tags": ["react"]}
```

### PUT /api/gigs?id={gigId} (Auth: Owner/ADMIN)
Update gig

### DELETE /api/gigs?id={gigId} (Auth: Owner/ADMIN)
Delete gig

---

## ✅ Products

### GET /api/products
Get all products

### GET /api/products?category={category}
Get products by category

---

## ✅ Orders

### POST /api/orders
Create order
```json
{"items": [{"productId": "ID", "quantity": 1, "price": 1000}], "total": 1000, "phoneNumber": "254712345678", "shippingAddress": "Nairobi"}
```

### GET /api/orders (Auth required)
Get user orders

### GET /api/orders?id={orderId} (Auth required)
Get order by ID

---

## ✅ Cart

### GET /api/cart (Auth required)
Get cart items

### POST /api/cart (Auth required)
Add to cart
```json
{"productId": "PRODUCT_ID", "quantity": 1}
```

### DELETE /api/cart?productId={productId} (Auth required)
Remove from cart

### POST /api/cart/clear (Auth required)
Clear cart

---

## ✅ Reviews

### GET /api/reviews
Get reviews

### GET /api/reviews?gigId={gigId}
Get reviews by gig

### POST /api/reviews (Auth required)
Create review
```json
{"gigId": "GIG_ID", "orderId": "ORDER_ID", "rating": 5, "comment": "Great!"}
```

---

## ✅ Sellers

### GET /api/sellers
Get all sellers with stats

### POST /api/seller-application (Auth required)
Submit seller application
```json
{"businessName": "My Business", "skills": ["React"], "experience": "5 years", "portfolio": ["url"], "description": "Experienced"}
```

### GET /api/seller-applications (Auth: ADMIN)
Get all applications

---

## ✅ Bids

### POST /api/bids (Auth required)
Create bid
```json
{"gigId": "GIG_ID", "bidderId": "USER_ID", "amount": 5000, "proposal": "I can do this", "timeline": 7}
```

### GET /api/bids?gigId={gigId} (Auth: Gig owner)
Get bids for gig

### GET /api/bids?userId={userId} (Auth: User)
Get user's bids

---

## ✅ Applications

### POST /api/applications
Submit job application
```json
{"jobId": "JOB_ID", "applicantId": "USER_ID", "coverLetter": "Interested", "skills": "React", "experience": "5 years"}
```

### GET /api/applications?jobId={jobId}&applicantId={applicantId}
Check application status

### GET /api/applications?posterId={userId}
Get applications for job poster

---

## ✅ Messages

### GET /api/messages?conversationId={convId} (Auth required)
Get messages by conversation

### GET /api/messages?orderId={orderId} (Auth required)
Get messages by order

### POST /api/messages (Auth required)
Send message
```json
{"conversationId": "CONV_ID", "content": "Hello!", "attachments": []}
```

---

## ✅ Notifications

### GET /api/notifications (Auth required)
Get user notifications

---

## ✅ Interviews

### POST /api/interviews (Auth required)
Schedule interview
```json
{"applicationId": "APP_ID", "scheduledAt": "2024-12-31T10:00:00Z", "duration": 30, "type": "VIDEO"}
```

### GET /api/interviews?userId={userId} (Auth required)
Get user interviews

---

## ✅ Escrow

### POST /api/escrow
Create escrow transaction
```json
{"buyerId": "USER_ID", "items": [{"productId": "ID", "quantity": 1, "price": 1000}], "totalAmount": 1000}
```

### GET /api/escrow
Get escrow transactions

### PATCH /api/escrow
Update escrow status
```json
{"id": "ESCROW_ID", "status": "COMPLETED", "adminNotes": "Approved"}
```

---

## ✅ Checkout

### POST /api/checkout
Process checkout
```json
{"items": [{"productId": "ID", "quantity": 1, "price": 1000}], "phoneNumber": "254712345678"}
```

---

## ✅ Hire Talent

### POST /api/hire-talent (Auth required)
Send hire request
```json
{"talentId": "USER_ID", "message": "Want to hire you", "projectDetails": "Build website"}
```

---

## ✅ Profile

### GET /api/profile (Auth required)
Get user profile

### PUT /api/profile (Auth required)
Update profile
```json
{"name": "John Doe", "phoneNumber": "254712345678", "bio": "Developer"}
```

---

## ✅ Payments (M-Pesa)

### POST /api/mpesa/stkpush
Initiate STK Push
```json
{"phoneNumber": "254712345678", "amount": 1000}
```

### POST /api/mpesa/callback
M-Pesa callback (webhook)

---

## ✅ Categories

### GET /api/categories
Get all categories with subcategories

---

## ✅ Utilities

### GET /api/health
Health check

### GET /api/test-db
Test database connection

---

## User Types
- `CLIENT` - Regular client
- `FREELANCER` - Freelance seller
- `AGENCY` - Agency seller
- `ADMIN` - Administrator

## Authentication
Most endpoints require NextAuth session. Include session cookie in requests.

## Response Format
Success: `{"data": {}, "message": "Success"}`
Error: `{"error": "Error message"}`

## Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error
