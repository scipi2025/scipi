-- AlterTable
ALTER TABLE "partners" ALTER COLUMN "logoUrl" DROP NOT NULL;

-- CreateTable
CREATE TABLE "carousel_images" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carousel_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "carousel_images_displayOrder_idx" ON "carousel_images"("displayOrder");

-- CreateIndex
CREATE INDEX "carousel_images_isActive_idx" ON "carousel_images"("isActive");
