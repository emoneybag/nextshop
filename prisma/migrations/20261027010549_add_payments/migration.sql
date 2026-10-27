/*
  Warnings:

  - A unique constraint covering the columns `[stripeSessionId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'PENDING';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "stripePaymentIntentId" TEXT,
ADD COLUMN     "stripeSessionId" TEXT,
ALTER COLUMN "status" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_stripeSessionId_key" ON "Order"("stripeSessionId");
