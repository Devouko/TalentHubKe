/*
  Warnings:

  - The `sellerStatus` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "sellerStatus",
ADD COLUMN     "sellerStatus" "SellerStatus" NOT NULL DEFAULT 'NOT_APPLIED';
