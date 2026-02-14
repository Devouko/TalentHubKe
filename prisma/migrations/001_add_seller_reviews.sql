-- CreateTable
CREATE TABLE "seller_reviews" (
    "id" TEXT NOT NULL,
    "seller_id" TEXT NOT NULL,
    "reviewer_id" TEXT NOT NULL,
    "rating" SMALLINT NOT NULL,
    "comment" TEXT,
    "order_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seller_reviews_pkey" PRIMARY KEY ("id")
);

-- Add rating field to users table
ALTER TABLE "users" ADD COLUMN "seller_rating" DOUBLE PRECISION DEFAULT 0;
ALTER TABLE "users" ADD COLUMN "seller_review_count" INTEGER DEFAULT 0;

-- CreateIndex
CREATE INDEX "seller_reviews_seller_id_idx" ON "seller_reviews"("seller_id");
CREATE INDEX "seller_reviews_reviewer_id_idx" ON "seller_reviews"("reviewer_id");
CREATE UNIQUE INDEX "seller_reviews_reviewer_id_seller_id_order_id_key" ON "seller_reviews"("reviewer_id", "seller_id", "order_id");

-- Add foreign key constraints
ALTER TABLE "seller_reviews" ADD CONSTRAINT "seller_reviews_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "seller_reviews" ADD CONSTRAINT "seller_reviews_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "seller_reviews" ADD CONSTRAINT "seller_reviews_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;