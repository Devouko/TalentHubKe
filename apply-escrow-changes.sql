-- Add new escrow fields
ALTER TABLE "escrow_transactions" 
  ADD COLUMN IF NOT EXISTS "currency" TEXT DEFAULT 'KES',
  ADD COLUMN IF NOT EXISTS "platformFeePercent" DOUBLE PRECISION DEFAULT 0.025,
  ADD COLUMN IF NOT EXISTS "platformFee" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "sellerPayout" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "orderId" TEXT,
  ADD COLUMN IF NOT EXISTS "paymentRef" TEXT,
  ADD COLUMN IF NOT EXISTS "proofOfDelivery" JSONB,
  ADD COLUMN IF NOT EXISTS "metadata" JSONB,
  ADD COLUMN IF NOT EXISTS "expiresAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "deliveryDeadline" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "confirmationDeadline" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "fundedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "deliveredAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "releasedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "refundedAt" TIMESTAMP(3);

-- Make productId optional
ALTER TABLE "escrow_transactions" ALTER COLUMN "productId" DROP NOT NULL;

-- Update EscrowStatus enum
DO $$ BEGIN
  ALTER TYPE "EscrowStatus" ADD VALUE IF NOT EXISTS 'INITIATED';
  ALTER TYPE "EscrowStatus" ADD VALUE IF NOT EXISTS 'FUNDED';
  ALTER TYPE "EscrowStatus" ADD VALUE IF NOT EXISTS 'IN_PROGRESS';
  ALTER TYPE "EscrowStatus" ADD VALUE IF NOT EXISTS 'DELIVERED';
  ALTER TYPE "EscrowStatus" ADD VALUE IF NOT EXISTS 'DISPUTED';
  ALTER TYPE "EscrowStatus" ADD VALUE IF NOT EXISTS 'RELEASED';
  ALTER TYPE "EscrowStatus" ADD VALUE IF NOT EXISTS 'CANCELLED';
  ALTER TYPE "EscrowStatus" ADD VALUE IF NOT EXISTS 'EXPIRED';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create DisputeStatus enum
DO $$ BEGIN
  CREATE TYPE "DisputeStatus" AS ENUM ('OPEN', 'UNDER_REVIEW', 'RESOLVED', 'CLOSED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create escrow_audit_logs table
CREATE TABLE IF NOT EXISTS "escrow_audit_logs" (
    "id" TEXT NOT NULL,
    "escrowId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "data" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "escrow_audit_logs_pkey" PRIMARY KEY ("id")
);

-- Create escrow_disputes table
CREATE TABLE IF NOT EXISTS "escrow_disputes" (
    "id" TEXT NOT NULL,
    "escrowId" TEXT NOT NULL,
    "raisedBy" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "evidence" JSONB,
    "status" "DisputeStatus" NOT NULL DEFAULT 'OPEN',
    "resolution" TEXT,
    "resolvedBy" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    CONSTRAINT "escrow_disputes_pkey" PRIMARY KEY ("id")
);

-- Add foreign keys if not exists
DO $$ BEGIN
  ALTER TABLE "escrow_audit_logs" ADD CONSTRAINT "escrow_audit_logs_escrowId_fkey" 
    FOREIGN KEY ("escrowId") REFERENCES "escrow_transactions"("id") ON DELETE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "escrow_disputes" ADD CONSTRAINT "escrow_disputes_escrowId_fkey" 
    FOREIGN KEY ("escrowId") REFERENCES "escrow_transactions"("id") ON DELETE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "escrow_disputes" ADD CONSTRAINT "escrow_disputes_raisedBy_fkey" 
    FOREIGN KEY ("raisedBy") REFERENCES "users"("id");
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "escrow_disputes" ADD CONSTRAINT "escrow_disputes_resolvedBy_fkey" 
    FOREIGN KEY ("resolvedBy") REFERENCES "users"("id");
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS "escrow_audit_logs_escrowId_idx" ON "escrow_audit_logs"("escrowId");
CREATE INDEX IF NOT EXISTS "escrow_disputes_escrowId_idx" ON "escrow_disputes"("escrowId");
CREATE INDEX IF NOT EXISTS "escrow_transactions_status_idx" ON "escrow_transactions"("status");
CREATE INDEX IF NOT EXISTS "escrow_transactions_orderId_idx" ON "escrow_transactions"("orderId");
CREATE UNIQUE INDEX IF NOT EXISTS "escrow_disputes_escrowId_key" ON "escrow_disputes"("escrowId");
CREATE UNIQUE INDEX IF NOT EXISTS "escrow_transactions_orderId_key" ON "escrow_transactions"("orderId");
