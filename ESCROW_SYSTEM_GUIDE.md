# Escrow System Implementation Guide

## Overview

A robust escrow management system for the talent marketplace with complete transaction lifecycle, dispute resolution, and audit logging.

## Features

✅ **Complete Transaction Lifecycle**
- INITIATED → FUNDED → DELIVERED → RELEASED
- Support for disputes, refunds, cancellations, and expiry

✅ **Security**
- Row-level locking with Prisma transactions
- Role-based access control
- Immutable audit logs
- State validation

✅ **Business Logic**
- 2.5% platform fee (configurable)
- 3-day buyer confirmation window
- 7-day delivery deadline
- Auto-release after confirmation deadline
- Dispute freeze on fund movement

## Database Schema

### Escrow Transactions
```prisma
model escrow_transactions {
  id                     String       @id
  amount                 Float
  currency               String       @default("KES")
  platformFeePercent     Float        @default(0.025)
  status                 EscrowStatus @default(INITIATED)
  buyerId                String
  sellerId               String?
  orderId                String       @unique
  expiresAt              DateTime
  deliveryDeadline       DateTime
  confirmationDeadline   DateTime
  // ... timestamps and relations
}
```

### Status Flow
```
INITIATED → FUNDED → DELIVERED → RELEASED
              ↓         ↓
          CANCELLED  DISPUTED → RESOLVED → RELEASED/REFUNDED
              ↓
          EXPIRED
```

## API Endpoints

### 1. Initiate Escrow
```http
POST /api/escrow
Authorization: Bearer {token}

{
  "sellerId": "user_123",
  "orderId": "order_456",
  "amount": 5000,
  "currency": "KES",
  "productId": "prod_789",
  "items": [
    { "productId": "prod_789", "quantity": 1, "price": 5000 }
  ]
}
```

### 2. Fund Escrow
```http
POST /api/escrow/fund

{
  "escrowId": "esc_123",
  "paymentRef": "MPESA_REF_456"
}
```

### 3. Mark Delivered
```http
POST /api/escrow/deliver
Authorization: Bearer {seller_token}

{
  "escrowId": "esc_123",
  "proofOfDelivery": {
    "trackingNumber": "TRK123",
    "images": ["url1", "url2"]
  }
}
```

### 4. Confirm Delivery
```http
POST /api/escrow/confirm
Authorization: Bearer {buyer_token}

{
  "escrowId": "esc_123"
}
```

### 5. Raise Dispute
```http
POST /api/escrow/dispute
Authorization: Bearer {buyer_token}

{
  "escrowId": "esc_123",
  "reason": "Product not as described",
  "evidence": {
    "images": ["url1", "url2"],
    "description": "Details..."
  }
}
```

### 6. Resolve Dispute (Admin)
```http
POST /api/escrow/resolve
Authorization: Bearer {admin_token}

{
  "escrowId": "esc_123",
  "decision": "RELEASE",
  "notes": "Seller provided sufficient proof"
}
```

### 7. Cancel Escrow
```http
POST /api/escrow/cancel
Authorization: Bearer {token}

{
  "escrowId": "esc_123"
}
```

### 8. Get Transaction Details
```http
GET /api/escrow/{id}
Authorization: Bearer {token}
```

### 9. Get User Transactions
```http
GET /api/escrow
Authorization: Bearer {token}
```

### 10. Get All Transactions (Admin)
```http
GET /api/admin/escrow
Authorization: Bearer {admin_token}
```

## Usage Examples

### Complete Purchase Flow

```typescript
// 1. Buyer initiates escrow
const escrow = await fetch('/api/escrow', {
  method: 'POST',
  body: JSON.stringify({
    sellerId: 'seller_123',
    orderId: 'order_456',
    amount: 5000,
    items: [{ productId: 'prod_1', quantity: 1, price: 5000 }]
  })
})

// 2. Payment gateway funds escrow
await fetch('/api/escrow/fund', {
  method: 'POST',
  body: JSON.stringify({
    escrowId: escrow.id,
    paymentRef: 'MPESA_123'
  })
})

// 3. Seller delivers
await fetch('/api/escrow/deliver', {
  method: 'POST',
  body: JSON.stringify({
    escrowId: escrow.id,
    proofOfDelivery: { trackingNumber: 'TRK123' }
  })
})

// 4. Buyer confirms
await fetch('/api/escrow/confirm', {
  method: 'POST',
  body: JSON.stringify({ escrowId: escrow.id })
})
```

### Dispute Flow

```typescript
// Buyer raises dispute
const dispute = await fetch('/api/escrow/dispute', {
  method: 'POST',
  body: JSON.stringify({
    escrowId: 'esc_123',
    reason: 'Product damaged',
    evidence: { images: ['url1'] }
  })
})

// Admin resolves
await fetch('/api/escrow/resolve', {
  method: 'POST',
  body: JSON.stringify({
    escrowId: 'esc_123',
    decision: 'REFUND',
    notes: 'Product was damaged as claimed'
  })
})
```

## Service Methods

```typescript
import { escrowService } from '@/lib/escrow.service'

// Initiate
await escrowService.initiate({
  buyerId, sellerId, orderId, amount
})

// Fund
await escrowService.fundEscrow(escrowId, paymentRef)

// Deliver
await escrowService.markDelivered(escrowId, sellerId, proof)

// Confirm
await escrowService.confirmDelivery(escrowId, buyerId)

// Dispute
await escrowService.raiseDispute(escrowId, buyerId, reason, evidence)

// Resolve
await escrowService.resolveDispute(escrowId, adminId, decision, notes)

// Cancel
await escrowService.cancelEscrow(escrowId, userId)

// Auto-release (cron job)
await escrowService.autoRelease(escrowId)

// Expire stale (cron job)
await escrowService.expireStaleEscrows()
```

## Migration

```bash
# Generate migration
npx prisma migrate dev --name escrow_system_upgrade

# Apply to production
npx prisma migrate deploy
```

## Cron Jobs Setup

Add to your cron scheduler:

```typescript
// Auto-release escrows past confirmation deadline
// Run every hour
cron.schedule('0 * * * *', async () => {
  const escrows = await prisma.escrow_transactions.findMany({
    where: {
      status: 'DELIVERED',
      confirmationDeadline: { lt: new Date() }
    }
  })
  
  for (const escrow of escrows) {
    await escrowService.autoRelease(escrow.id)
  }
})

// Expire stale escrows
// Run daily at 2 AM
cron.schedule('0 2 * * *', async () => {
  await escrowService.expireStaleEscrows()
})
```

## Security Features

1. **Transaction Isolation**: Uses Prisma transactions with proper isolation
2. **State Validation**: Validates status before transitions
3. **Authorization**: Checks user ownership before operations
4. **Audit Trail**: Immutable logs for all state changes
5. **Dispute Freeze**: No fund movement during disputes

## Platform Fee Calculation

```typescript
const platformFee = amount * 0.025  // 2.5%
const sellerPayout = amount - platformFee
```

## Testing

```bash
npm run test:escrow
```

## Monitoring

Track these metrics:
- Escrow creation rate
- Average time to release
- Dispute rate
- Auto-release vs manual confirmation rate
- Platform fee revenue

## Support

For issues or questions, check:
1. Audit logs: `escrow_audit_logs` table
2. Transaction status
3. Dispute records
4. System logs
