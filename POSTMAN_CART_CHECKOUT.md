# Cart & Checkout API Endpoints - Postman Testing

## Base URL
```
http://localhost:3000
```

## Authentication
All endpoints require authentication via NextAuth session cookie.

---

## CART ENDPOINTS

### 1. Get Cart Items
**GET** `/api/cart`

**Headers:**
```
Cookie: next-auth.session-token=<your-session-token>
```

**Response:**
```json
{
  "cart": [
    {
      "id": "cart-item-id",
      "userId": "user-id",
      "productId": "product-id",
      "quantity": 2,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "products": {
        "id": "product-id",
        "title": "Product Name",
        "price": 5000,
        "images": ["image-url"],
        "stock": 10
      }
    }
  ]
}
```

---

### 2. Add to Cart
**POST** `/api/cart`

**Headers:**
```
Content-Type: application/json
Cookie: next-auth.session-token=<your-session-token>
```

**Body:**
```json
{
  "productId": "product-id-here",
  "quantity": 1
}
```

**Response:**
```json
{
  "success": true,
  "cartItem": {
    "id": "cart-item-id",
    "userId": "user-id",
    "productId": "product-id",
    "quantity": 1,
    "products": {
      "id": "product-id",
      "title": "Product Name",
      "price": 5000,
      "images": ["image-url"]
    }
  },
  "message": "Item added to cart"
}
```

---

### 3. Remove from Cart
**DELETE** `/api/cart?productId=<product-id>`

**Headers:**
```
Cookie: next-auth.session-token=<your-session-token>
```

**Response:**
```json
{
  "success": true
}
```

---

### 4. Clear Cart
**DELETE** `/api/cart/clear`

**Headers:**
```
Cookie: next-auth.session-token=<your-session-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Cart cleared successfully"
}
```

---

## CHECKOUT ENDPOINTS

### 5. Create Order (Checkout)
**POST** `/api/checkout`

**Headers:**
```
Content-Type: application/json
Cookie: next-auth.session-token=<your-session-token>
```

**Body:**
```json
{
  "items": [
    {
      "id": "product-id",
      "productId": "product-id",
      "title": "Product Name",
      "price": 5000,
      "quantity": 2
    }
  ],
  "phoneNumber": "254712345678",
  "shippingAddress": "Digital delivery",
  "useEscrow": false
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "order-id",
    "totalAmount": 10000,
    "status": "PENDING",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Order created successfully"
}
```

---

## ESCROW ENDPOINTS

### 6. Create Escrow Transaction
**POST** `/api/escrow`

**Headers:**
```
Content-Type: application/json
Cookie: next-auth.session-token=<your-session-token>
```

**Body:**
```json
{
  "orderId": "order-id",
  "sellerId": "seller-user-id",
  "amount": 10000,
  "currency": "KES"
}
```

**Response:**
```json
{
  "id": "escrow-transaction-id",
  "amount": 10000,
  "status": "INITIATED",
  "buyerId": "buyer-user-id",
  "sellerId": "seller-user-id",
  "orderId": "order-id"
}
```

---

### 7. Get User Escrow Transactions
**GET** `/api/escrow`

**Headers:**
```
Cookie: next-auth.session-token=<your-session-token>
```

**Response:**
```json
[
  {
    "id": "escrow-id",
    "amount": 10000,
    "status": "INITIATED",
    "buyerId": "buyer-id",
    "sellerId": "seller-id",
    "orderId": "order-id",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### 8. Escrow Action (Approve/Reject/Complete/Refund)
**PATCH** `/api/escrow/[id]`

**Headers:**
```
Content-Type: application/json
Cookie: next-auth.session-token=<your-session-token>
```

**Body:**
```json
{
  "action": "approve"
}
```

**Actions:** `approve`, `reject`, `complete`, `refund`

**Response:**
```json
{
  "id": "escrow-id",
  "status": "APPROVED",
  "message": "Escrow approved successfully"
}
```

---

## M-PESA PAYMENT ENDPOINT

### 9. Initiate M-Pesa STK Push
**POST** `/api/mpesa/stkpush`

**Headers:**
```
Content-Type: application/json
Cookie: next-auth.session-token=<your-session-token>
```

**Body:**
```json
{
  "phone": "254712345678",
  "amount": 10000,
  "orderId": "order-id",
  "description": "Order #12345"
}
```

**Response:**
```json
{
  "success": true,
  "message": "STK push sent successfully",
  "checkoutRequestId": "ws_CO_123456789",
  "merchantRequestId": "12345-67890-1"
}
```

---

## TESTING FLOW

### Complete Checkout Flow:
1. **Add items to cart** - POST `/api/cart` (multiple times)
2. **View cart** - GET `/api/cart`
3. **Create order** - POST `/api/checkout`
4. **(Optional) Create escrow** - POST `/api/escrow`
5. **Initiate payment** - POST `/api/mpesa/stkpush`

### Notes:
- Replace `<your-session-token>` with actual NextAuth session token from browser cookies
- Phone numbers must be in format: `254XXXXXXXXX` or `07XXXXXXXX`
- All amounts are in KES (Kenyan Shillings)
- Product IDs must exist in database
- Stock is automatically decremented on checkout
- Cart is automatically cleared after successful checkout
