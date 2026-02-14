-- CreateTable
CREATE TABLE "SystemTheme" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "primary" TEXT NOT NULL,
    "secondary" TEXT NOT NULL,
    "accent" TEXT NOT NULL,
    "background" TEXT NOT NULL DEFAULT '0 0% 100%',
    "foreground" TEXT NOT NULL DEFAULT '240 10% 3.9%',
    "muted" TEXT NOT NULL DEFAULT '240 4.8% 95.9%',
    "border" TEXT NOT NULL DEFAULT '240 5.9% 90%',
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemTheme_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SystemTheme_name_key" ON "SystemTheme"("name");

-- Insert default themes
INSERT INTO "SystemTheme" ("id", "name", "primary", "secondary", "accent", "background", "foreground", "muted", "border", "isActive", "createdAt", "updatedAt") VALUES
('theme_default_001', 'Default', '262 83% 58%', '123 100% 50%', '84 100% 50%', '0 0% 100%', '240 10% 3.9%', '240 4.8% 95.9%', '240 5.9% 90%', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('theme_darkblue_002', 'Dark Blue', '217 91% 60%', '142 76% 36%', '47 96% 53%', '222 84% 5%', '210 40% 98%', '217 33% 17%', '217 33% 17%', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('theme_forest_003', 'Forest Green', '142 76% 36%', '47 96% 53%', '217 91% 60%', '0 0% 100%', '240 10% 3.9%', '240 4.8% 95.9%', '240 5.9% 90%', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('theme_purple_004', 'Purple', '262 83% 58%', '270 95% 75%', '280 100% 70%', '0 0% 100%', '240 10% 3.9%', '240 4.8% 95.9%', '240 5.9% 90%', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);