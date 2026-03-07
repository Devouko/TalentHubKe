# Messaging & Notifications Setup Guide

## Database Setup (Prisma + Neon)

The messaging and notification system uses standard Prisma ORM with your existing Neon PostgreSQL database.

### 1. Apply Schema Changes

```bash
# Push schema changes to Neon database
npm run db:push

# Generate Prisma client
npm run db:generate
```

### 2. Database Models Added

- **Conversation**: Direct user-to-user messaging
- **Notification**: System notifications for users
- **Updated Message**: Now supports both order-based and conversation messaging

### 3. Features Implemented

✅ **Messaging System:**
- Direct user conversations
- Order-based messaging
- Real-time message interface
- Message history and search

✅ **Notification System:**
- Order updates
- New messages
- Payment notifications
- Review notifications
- System notifications

✅ **UI Components:**
- Notification dropdown with unread count
- Floating messaging widget
- Full messaging page
- Responsive design

### 4. API Endpoints

- `GET/POST /api/conversations` - Manage conversations
- `GET/PATCH /api/notifications` - Handle notifications
- `GET/POST /api/messages` - Send/receive messages

### 5. Usage

The system is automatically integrated into your layout:
- Bell icon shows notifications
- Message icon opens chat interface
- Visit `/messages` for full messaging experience

### 6. Neon Database Compatibility

This implementation uses:
- Standard Prisma schema definitions
- `prisma db push` for schema sync
- PostgreSQL-compatible queries
- Proper foreign key relationships
- Optimized indexes for performance

No manual SQL required - everything works through Prisma ORM with your existing Neon setup.