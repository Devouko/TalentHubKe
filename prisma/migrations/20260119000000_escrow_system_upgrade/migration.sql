-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "DisputeStatus" AS ENUM ('OPEN', 'UNDER_REVIEW', 'RESOLVED', 'CLOSED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- AlterEnum
ALTER TYPE "EscrowStatus" ADD VALUE IF NOT EXISTS 'INITIATED';
ALTER TYPE "EscrowStatus" ADD VALUE IF NOT EXISTS 'FUNDED';
ALTER TYPE "EscrowStatus" ADD VALUE IF NOT EXISTS 'IN_PROGRESS';
ALTER TYPE "EscrowStatus" ADD VALUE IF NOT EXISTS 'DELIVERED';
ALTER TYPE "EscrowStatus" ADD VALUE IF NOT EXISTS 'DISPUTED';
ALTER TYPE "EscrowStatus" ADD VALUE IF NOT EXISTS 'RELEASED';
ALTER TYPE "EscrowStatus" ADD VALUE IF NOT EXISTS 'CANCELLED';
ALTER TYPE "EscrowStatus" ADD VALUE IF NOT EXISTS 'EXPIRED';

-- AlterTable
ALTER TABLE "escrow_transactions" ADD COLUMN IF NOT EXISTS "currency" TEXT NOT NULL DEFAULT 'KES',
ADD COLUMN IF NOT EXISTS "platformFeePercent" DOUBLE PRECISION NOT NULL DEFAULT 0.025,
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
ADD COLUMN IF NOT EXISTS "refundedAt" TIMESTAMP(3),
ALTER COLUMN "productId" DROP NOT NULL;

-- CreateTable
CREATE TABLE IF NOT EXISTS "escrow_audit_logs" (
    "id" TEXT NOT NULL,
    "escrowId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "data" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "escrow_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
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

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "escrow_transactions_orderId_key" ON "escrow_transactions"("orderId");
CREATE UNIQUE INDEX IF NOT EXISTS "escrow_disputes_escrowId_key" ON "escrow_disputes"("escrowId");

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "escrow_audit_logs" ADD CONSTRAINT "escrow_audit_logs_escrowId_fkey" FOREIGN KEY ("escrowId") REFERENCES "escrow_transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "escrow_disputes" ADD CONSTRAINT "escrow_disputes_escrowId_fkey" FOREIGN KEY ("escrowId") REFERENCES "escrow_transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "escrow_disputes" ADD CONSTRAINT "escrow_disputes_raisedBy_fkey" FOREIGN KEY ("raisedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "escrow_disputes" ADD CONSTRAINT "escrow_disputes_resolvedBy_fkey" FOREIGN KEY ("resolvedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
