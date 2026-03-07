-- Escrow System Migration
-- This migration updates the escrow system to support full transaction lifecycle

-- Update EscrowStatus enum
ALTER TYPE "EscrowStatus" RENAME TO "EscrowStatus_old";
CREATE TYPE "EscrowStatus" AS ENUM ('INITIATED', 'FUNDED', 'IN_PROGRESS', 'DELIVERED', 'DISPUTED', 'RELEASED', 'REFUNDED', 'CANCELLED', 'EXPIRED');

-- Update escrow_transactions table
ALTER TABLE "escrow_transactions" 
  ADD COLUMN "currency" TEXT DEFAULT 'KES',
  ADD COLUMN "platformFeePercent" DOUBLE PRECISION DEFAULT 0.025,
  ADD COLUMN "platformFee" DOUBLE PRECISION,
  ADD COLUMN "sellerPayout" DOUBLE PRECISION,
  ADD COLUMN "orderId" TEXT,
  ADD COLUMN "paymentRef" TEXT,
  ADD COLUMN "proofOfDelivery" JSONB,
  ADD COLUMN "metadata" JSONB,
  ADD COLUMN "expiresAt" TIMESTAMP(3),
  ADD COLUMN "deliveryDeadline" TIMESTAMP(3),
  ADD COLUMN "confirmationDeadline" TIMESTAMP(3),
  ADD COLUMN "fundedAt" TIMESTAMP(3),
  ADD COLUMN "deliveredAt" TIMESTAMP(3),
  ADD COLUMN "releasedAt" TIMESTAMP(3),
  ADD COLUMN "refundedAt" TIMESTAMP(3);

-- Make productId optional
ALTER TABLE "escrow_transactions" ALTER COLUMN "productId" DROP NOT NULL;

-- Add unique constraint on orderId
ALTER TABLE "escrow_transactions" ADD CONSTRAINT "escrow_transactions_orderId_key" UNIQUE ("orderId");

-- Update status column to use new enum
ALTER TABLE "escrow_transactions" ALTER COLUMN "status" TYPE "EscrowStatus" USING "status"::text::"EscrowStatus";
ALTER TABLE "escrow_transactions" ALTER COLUMN "status" SET DEFAULT 'INITIATED'::"EscrowStatus";

-- Drop old enum
DROP TYPE "EscrowStatus_old";

-- Create escrow_audit_logs table
CREATE TABLE "escrow_audit_logs" (
    "id" TEXT NOT NULL,
    "escrowId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "data" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "escrow_audit_logs_pkey" PRIMARY KEY ("id")
);

-- Create DisputeStatus enum
CREATE TYPE "DisputeStatus" AS ENUM ('OPEN', 'UNDER_REVIEW', 'RESOLVED', 'CLOSED');

-- Create escrow_disputes table
CREATE TABLE "escrow_disputes" (
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

-- Add unique constraint on escrowId for disputes
CREATE UNIQUE INDEX "escrow_disputes_escrowId_key" ON "escrow_disputes"("escrowId");

-- Add foreign keys
ALTER TABLE "escrow_audit_logs" ADD CONSTRAINT "escrow_audit_logs_escrowId_fkey" FOREIGN KEY ("escrowId") REFERENCES "escrow_transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "escrow_disputes" ADD CONSTRAINT "escrow_disputes_escrowId_fkey" FOREIGN KEY ("escrowId") REFERENCES "escrow_transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "escrow_disputes" ADD CONSTRAINT "escrow_disputes_raisedBy_fkey" FOREIGN KEY ("raisedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "escrow_disputes" ADD CONSTRAINT "escrow_disputes_resolvedBy_fkey" FOREIGN KEY ("resolvedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Create indexes for performance
CREATE INDEX "escrow_audit_logs_escrowId_idx" ON "escrow_audit_logs"("escrowId");
CREATE INDEX "escrow_audit_logs_timestamp_idx" ON "escrow_audit_logs"("timestamp");
CREATE INDEX "escrow_disputes_escrowId_idx" ON "escrow_disputes"("escrowId");
CREATE INDEX "escrow_disputes_status_idx" ON "escrow_disputes"("status");
CREATE INDEX "escrow_transactions_status_idx" ON "escrow_transactions"("status");
CREATE INDEX "escrow_transactions_buyerId_idx" ON "escrow_transactions"("buyerId");
CREATE INDEX "escrow_transactions_sellerId_idx" ON "escrow_transactions"("sellerId");
CREATE INDEX "escrow_transactions_orderId_idx" ON "escrow_transactions"("orderId");
