-- Add new fields to categories table
ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "image" TEXT;
ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;
ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- Create platform_settings table
CREATE TABLE IF NOT EXISTS "platform_settings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "platformName" TEXT NOT NULL DEFAULT 'TalentHub',
    "platformTagline" TEXT NOT NULL DEFAULT 'Talent Marketplace that developers love',
    "platformLogo" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#10b981',
    "secondaryColor" TEXT NOT NULL DEFAULT '#14b8a6',
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "platform_settings_pkey" PRIMARY KEY ("id")
);

-- Create offer_carousels table
CREATE TABLE IF NOT EXISTS "offer_carousels" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT NOT NULL,
    "link" TEXT,
    "buttonText" TEXT NOT NULL DEFAULT 'Learn More',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "offer_carousels_pkey" PRIMARY KEY ("id")
);
