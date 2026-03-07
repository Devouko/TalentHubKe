# API Endpoints Documentation

Base URL: `http://localhost:3000`

## Authentication

### POST /api/auth/signin
Login with credentials
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### POST /api/auth/register
Register new user
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "userType": "CLIENT"
}
```

### POST /api/auth/signup
Signup (supports ADMIN creation)
```json
{
  "email": "admin@example.com",
  "password": "admin123",
  "name": "Admin User",
  "userType": "ADMIN"
}
```

### GET /api/auth/test
Test authentication

---

## Users

### GET /api/users
Get all users

### GET /api/users?id={userId}
Get user by ID

### GET /api/users?type=talent
Get talent users (FREELANCER/AGENCY)

### POST /api/users
Create user
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "userType": "CLIENT"
}
```

### PUT /api/users?id={userId}
Update user
```json
{
  "name": "Updated Name"
}
```

### DELETE /api/users?id={userId}
Delete user

### GET /api/users/{id}
Get specific user

### GET /api/check-user
Check current user

---

## Gigs

### GET /api/gigs
Get all active gigs

### GET /api/gigs?id={gigId}
Get gig by ID

### POST /api/gigs
Create gig (Auth: FREELANCER/AGENCY/ADMIN)
```json
{
  "title": "Web Development",
  "description": "Full stack development",
  "category": "Programming",
  "subcategory": "Web Development",
  "price": 5000,
  "deliveryTime": 7,
  "tags": ["react", "nodejs"],
  "images": []
}
```

### PUT /api/gigs?id={gigId}
Update gig (Auth: Owner/ADMIN)
```json
{
  "title": "Updated Title",
  "price": 6000
}
```

### DELETE /api/gigs?id={gigId}
Delete gig (Auth: Owner/ADMIN)

---

## Products

### GET /api/products
Get all products

### GET /api/products?category={category}
Get products by category

---

## Orders

### GET /api/orders
Get orders

---

## Cart

### GET /api/cart
Get cart items

### POST /api/cart/clear
Clear cart

---

## Categories

### GET /api/categories
Get all categories

---

## Reviews

### GET /api/reviews
Get all reviews

### GET /api/reviews/{id}
Get review by ID

### GET /api/reviews/gigs
Get gig reviews

### GET /api/reviews/products
Get product reviews

### GET /api/reviews/sellers
Get seller reviews

### GET /api/reviews/stats
Get review statistics

### GET /api/product-reviews
Get product reviews

### GET /api/product-reviews/{id}
Get product review by ID

### GET /api/product-reviews/stats
Get product review stats

### GET /api/seller-reviews
Get seller reviews

### GET /api/seller-reviews/{id}
Get seller review by ID

### GET /api/seller-reviews/stats
Get seller review stats

---

## Sellers

### GET /api/sellers
Get all sellers

### GET /api/sellers/{id}
Get seller by ID

### POST /api/seller-application
Submit seller application
```json
{
  "bio": "Experienced developer",
  "skills": ["React", "Node.js"],
  "portfolio": "https://portfolio.com"
}
```

### GET /api/seller-applications
Get seller applications

---

## Projects

### GET /api/projects
Get projects

---

## Applications

### GET /api/applications
Get applications

### GET /api/applications/{id}
Get application by ID

---

## Bids

### GET /api/bids
Get bids

---

## Messages & Conversations

### GET /api/messages
Get messages

### GET /api/conversations
Get conversations

---

## Notifications

### GET /api/notifications
Get notifications

### GET /api/notifications/{id}
Get notification by ID

---

## Payments (M-Pesa)

### POST /api/mpesa/stkpush
Initiate M-Pesa STK Push
```json
{
  "phoneNumber": "254712345678",
  "amount": 1000
}
```

### POST /api/mpesa/callback
M-Pesa callback endpoint

### POST /api/payments/mpesa
M-Pesa payment
```json
{
  "phoneNumber": "254712345678",
  "amount": 1000
}
```

---

## Checkout

### POST /api/checkout
Process checkout
```json
{
  "items": [],
  "total": 5000
}
```

### POST /api/test-checkout
Test checkout

---

## Escrow

### GET /api/escrow
Get escrow transactions

---

## Profile

### GET /api/profile
Get user profile

### POST /api/profile/education
Update education
```json
{
  "school": "University Name",
  "degree": "Bachelor of Science",
  "fieldOfStudy": "Computer Science",
  "startDate": "2020-01-01",
  "endDate": "2024-01-01"
}
```

---

## Interviews

### GET /api/interviews
Get interviews

---

## Hire Talent

### POST /api/hire-talent
Hire talent
```json
{
  "talentId": "TALENT_ID",
  "projectDetails": "Project description",
  "budget": 10000
}
```

---

## Metrics

### GET /api/metrics
Get platform metrics

### GET /api/user/analytics
Get user analytics

### GET /api/user/stats
Get user statistics

---

## Theme

### GET /api/theme
Get theme settings

### POST /api/theme/init
Initialize theme

---

## Admin Endpoints (Requires ADMIN role)

### GET /api/admin/analytics
Get admin analytics

### GET /api/admin/stats
Get admin statistics

### GET /api/admin/metrics
Get admin metrics

### GET /api/admin/users
Get all users (admin)

### GET /api/admin/users/{id}
Get user by ID (admin)

### GET /api/admin/sellers
Get all sellers (admin)

### GET /api/admin/products
Get all products (admin)

### GET /api/admin/products/{id}
Get product by ID (admin)

### PUT /api/admin/products/{id}/stock
Update product stock
```json
{
  "stock": 100
}
```

### POST /api/admin/products/stock/bulk
Bulk update stock
```json
{
  "updates": [
    {"id": "PRODUCT_ID", "stock": 50}
  ]
}
```

### GET /api/admin/categories
Get categories (admin)

### GET /api/admin/products/categories
Get product categories

### GET /api/admin/products/categories/{id}
Get category by ID

### GET /api/admin/reviews
Get all reviews (admin)

### GET /api/admin/escrow
Get escrow transactions (admin)

### GET /api/admin/offers
Get offers (admin)

### GET /api/admin/skills
Get skills (admin)

### GET /api/admin/colors
Get colors (admin)

### GET /api/admin/logs
Get system logs

### GET /api/admin/security
Get security settings

### GET /api/admin/platform
Get platform settings

### GET /api/admin/settings
Get admin settings

### POST /api/admin/settings
Update admin settings
```json
{
  "siteName": "My Marketplace",
  "maintenanceMode": false
}
```

### GET /api/admin/theme
Get admin theme

### POST /api/admin/backup
Create database backup

---

## Utilities

### GET /api/health
Health check endpoint

### GET /api/test-connection
Test API connection

### GET /api/test-db
Test database connection

### POST /api/send-email
Send email
```json
{
  "to": "user@example.com",
  "subject": "Test Email",
  "body": "Email content"
}
```

### POST /api/whatsapp-order
Send WhatsApp order notification
```json
{
  "phone": "254712345678",
  "orderId": "ORDER_ID"
}
```

### POST /api/upload
Upload file

### POST /api/uploadthing
UploadThing endpoint

---

## Purchases

### GET /api/purchases
Get user purchases

---

## User Types
- `CLIENT` - Regular client user
- `FREELANCER` - Freelance seller
- `AGENCY` - Agency seller
- `ADMIN` - Administrator

## Authentication
Most endpoints require authentication via NextAuth session. Include session cookie in requests.

## Response Format
Success:
```json
{
  "data": {},
  "message": "Success"
}
```

Error:
```json
{
  "error": "Error message"
}
```

## Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error
