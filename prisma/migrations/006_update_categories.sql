-- Migration to update categories to new standardized values
-- Run this after deploying the new category constants

-- Update existing gigs to use new categories
UPDATE gigs SET 
  category = CASE 
    WHEN category ILIKE '%web%' OR category ILIKE '%development%' OR category ILIKE '%programming%' THEN 'Digital-products'
    WHEN category ILIKE '%design%' OR category ILIKE '%graphic%' OR category ILIKE '%logo%' THEN 'Digital-products'
    WHEN category ILIKE '%marketing%' OR category ILIKE '%social%' THEN 'Accounts'
    WHEN category ILIKE '%account%' THEN 'Accounts'
    WHEN category ILIKE '%proxy%' OR category ILIKE '%proxies%' THEN 'Proxies'
    WHEN category ILIKE '%gmail%' OR category ILIKE '%email%' THEN 'Bulk_Gmails'
    WHEN category ILIKE '%kyc%' OR category ILIKE '%verification%' OR category ILIKE '%identity%' THEN 'KYC'
    ELSE 'Digital-products'
  END
WHERE category NOT IN ('Accounts', 'Digital-products', 'Proxies', 'Bulk_Gmails', 'KYC');

-- Update existing products to use new categories
UPDATE products SET 
  category = CASE 
    WHEN category ILIKE '%electronics%' OR category ILIKE '%gadgets%' THEN 'Digital-products'
    WHEN category ILIKE '%fashion%' OR category ILIKE '%clothing%' THEN 'Digital-products'
    WHEN category ILIKE '%home%' OR category ILIKE '%garden%' THEN 'Digital-products'
    WHEN category ILIKE '%health%' OR category ILIKE '%beauty%' THEN 'Digital-products'
    WHEN category ILIKE '%sports%' OR category ILIKE '%fitness%' THEN 'Digital-products'
    WHEN category ILIKE '%books%' OR category ILIKE '%media%' THEN 'Digital-products'
    WHEN category ILIKE '%art%' OR category ILIKE '%crafts%' THEN 'Digital-products'
    WHEN category ILIKE '%digital%' THEN 'Digital-products'
    WHEN category ILIKE '%account%' THEN 'Accounts'
    WHEN category ILIKE '%proxy%' OR category ILIKE '%proxies%' THEN 'Proxies'
    WHEN category ILIKE '%gmail%' OR category ILIKE '%email%' THEN 'Bulk_Gmails'
    WHEN category ILIKE '%kyc%' OR category ILIKE '%verification%' THEN 'KYC'
    ELSE 'Digital-products'
  END
WHERE category NOT IN ('Accounts', 'Digital-products', 'Proxies', 'Bulk_Gmails', 'KYC');

-- Update existing projects to use new categories
UPDATE projects SET 
  category = CASE 
    WHEN category ILIKE '%web%' OR category ILIKE '%development%' OR category ILIKE '%mobile%' THEN 'Digital-products'
    WHEN category ILIKE '%design%' OR category ILIKE '%graphic%' THEN 'Digital-products'
    WHEN category ILIKE '%marketing%' OR category ILIKE '%social%' THEN 'Accounts'
    WHEN category ILIKE '%account%' THEN 'Accounts'
    WHEN category ILIKE '%proxy%' OR category ILIKE '%proxies%' THEN 'Proxies'
    WHEN category ILIKE '%gmail%' OR category ILIKE '%email%' THEN 'Bulk_Gmails'
    WHEN category ILIKE '%kyc%' OR category ILIKE '%verification%' THEN 'KYC'
    ELSE 'Digital-products'
  END
WHERE category NOT IN ('Accounts', 'Digital-products', 'Proxies', 'Bulk_Gmails', 'KYC');

-- Clear and repopulate categories table with new standardized categories
DELETE FROM categories;

INSERT INTO categories (id, name, description, icon, isActive, createdAt) VALUES
('accounts', 'Accounts', 'Social media, gaming, and business accounts', '👤', true, NOW()),
('digital-products', 'Digital-products', 'Software, templates, courses, and digital assets', '💾', true, NOW()),
('proxies', 'Proxies', 'Proxy services and solutions', '🔒', true, NOW()),
('bulk-gmails', 'Bulk_Gmails', 'Gmail accounts in bulk quantities', '📧', true, NOW()),
('kyc', 'KYC', 'Know Your Customer verification services', '🆔', true, NOW());