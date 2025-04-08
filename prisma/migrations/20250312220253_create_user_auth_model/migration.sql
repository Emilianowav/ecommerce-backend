/*
  Warnings:

  - You are about to drop the column `userId` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `PaymentMethod` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ShippingAddress` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[profileId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,profileId]` on the table `ShippingAddress` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `profileId` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileId` to the `PaymentMethod` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileId` to the `ShippingAddress` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_userId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "PaymentMethod" DROP CONSTRAINT "PaymentMethod_userId_fkey";

-- DropForeignKey
ALTER TABLE "ShippingAddress" DROP CONSTRAINT "ShippingAddress_userId_fkey";

-- DropIndex
DROP INDEX "Cart_userId_key";

-- DropIndex
DROP INDEX "ShippingAddress_name_userId_key";

-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "userId",
ADD COLUMN     "profileId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "updateAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "userId",
ADD COLUMN     "profileId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PaymentMethod" DROP COLUMN "userId",
ADD COLUMN     "profileId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ShippingAddress" DROP COLUMN "userId",
ADD COLUMN     "profileId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "UserAuth" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'customer',
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAuth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserAuth_username_key" ON "UserAuth"("username");

-- CreateIndex
CREATE UNIQUE INDEX "UserAuth_email_key" ON "UserAuth"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_profileId_key" ON "Cart"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "ShippingAddress_name_profileId_key" ON "ShippingAddress"("name", "profileId");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_id_fkey" FOREIGN KEY ("id") REFERENCES "UserAuth"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingAddress" ADD CONSTRAINT "ShippingAddress_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentMethod" ADD CONSTRAINT "PaymentMethod_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
