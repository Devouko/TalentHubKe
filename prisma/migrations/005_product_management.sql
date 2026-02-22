-- Product Management System Migration
-- This migration adds necessary fields and tables for the product management system

-- Update products table with new fields (if not exists)
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "name" TEXT;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "slug" TEXT;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "sku" TEXT;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "shortDescription" TEXT;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "lowStockThreshold" INTEGER DEFAULT 10;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "trackInventory" BOOLEAN DEFAULT true;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "isDigital" BOOLEAN DEFAULT false;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "metaTitle" TEXT;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "metaDescription" TEXT;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "createdById" TEXT;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "updatedById" TEXT;

-- Add unique constraints
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_slug_key') THEN
        ALTER TABLE "products" ADD CONSTRAINT "products_slug_key" UNIQUE ("slug");
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_sku_key') THEN
        ALTER TABLE "products" ADD CONSTRAINT "products_sku_key" UNIQUE ("sku");
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "products_categoryId_idx" ON "products"("categoryId");
CREATE INDEX IF NOT EXISTS "products_stockStatus_idx" ON "products"("stockStatus");
CREATE INDEX IF NOT EXISTS "products_isActive_idx" ON "products"("isActive");
CREATE INDEX IF NOT EXISTS "products_isFeatured_idx" ON "products"("isFeatured");
CREATE INDEX IF NOT EXISTS "products_deletedAt_idx" ON "products"("deletedAt");
CREATE INDEX IF NOT EXISTS "stock_history_productId_idx" ON "stock_history"("productId");
CREATE INDEX IF NOT EXISTS "product_categories_slug_idx" ON "product_categories"("slug");
