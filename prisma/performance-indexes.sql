-- Performance Optimization Indexes
-- Run these to speed up common queries

-- Gigs indexes
CREATE INDEX IF NOT EXISTS idx_gigs_category ON gigs(category);
CREATE INDEX IF NOT EXISTS idx_gigs_seller ON gigs("sellerId");
CREATE INDEX IF NOT EXISTS idx_gigs_active ON gigs("isActive");
CREATE INDEX IF NOT EXISTS idx_gigs_rating ON gigs(rating DESC);
CREATE INDEX IF NOT EXISTS idx_gigs_created ON gigs("createdAt" DESC);

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_seller ON products("sellerId");
CREATE INDEX IF NOT EXISTS idx_products_active ON products("isActive");
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating DESC);

-- Reviews indexes
CREATE INDEX IF NOT EXISTS idx_reviews_gig ON reviews("gigId");
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer ON reviews("reviewerId");
CREATE INDEX IF NOT EXISTS idx_reviews_order ON reviews("orderId");
CREATE INDEX IF NOT EXISTS idx_reviews_created ON reviews("createdAt" DESC);

-- Product reviews indexes
CREATE INDEX IF NOT EXISTS idx_product_reviews_product ON product_reviews("productId");
CREATE INDEX IF NOT EXISTS idx_product_reviews_user ON product_reviews("userId");
CREATE INDEX IF NOT EXISTS idx_product_reviews_created ON product_reviews("createdAt" DESC);

-- Seller reviews indexes
CREATE INDEX IF NOT EXISTS idx_seller_reviews_seller ON seller_reviews("sellerId");
CREATE INDEX IF NOT EXISTS idx_seller_reviews_reviewer ON seller_reviews("reviewerId");
CREATE INDEX IF NOT EXISTS idx_seller_reviews_created ON seller_reviews("createdAt" DESC);

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON orders("buyerId");
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders("createdAt" DESC);

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_type ON users("userType");
CREATE INDEX IF NOT EXISTS idx_users_seller_status ON users("sellerStatus");
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages("senderId");
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages("conversationId");
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages("createdAt" DESC);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications("userId");
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications("isRead");
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications("createdAt" DESC);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_gigs_active_category ON gigs("isActive", category);
CREATE INDEX IF NOT EXISTS idx_products_active_category ON products("isActive", category);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_status ON orders("buyerId", status);
