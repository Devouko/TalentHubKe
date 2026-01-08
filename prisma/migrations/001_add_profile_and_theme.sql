-- CreateTable
CREATE TABLE "theme_settings" (
    "id" TEXT NOT NULL,
    "primaryColor" TEXT NOT NULL DEFAULT '#3b82f6',
    "secondaryColor" TEXT NOT NULL DEFAULT '#10b981',
    "accentColor" TEXT NOT NULL DEFAULT '#8b5cf6',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "theme_settings_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "users" ADD COLUMN "bio" TEXT;
ALTER TABLE "users" ADD COLUMN "password" TEXT;
ALTER TABLE "users" ADD COLUMN "profileImage" TEXT;

-- Insert default theme
INSERT INTO "theme_settings" ("id", "primaryColor", "secondaryColor", "accentColor", "isActive", "createdAt", "updatedAt")
VALUES ('default', '#3b82f6', '#10b981', '#8b5cf6', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);