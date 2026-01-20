-- AlterTable
ALTER TABLE "events" ADD COLUMN     "dateText" TEXT,
ADD COLUMN     "displayOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "location" TEXT;

-- CreateIndex
CREATE INDEX "events_displayOrder_idx" ON "events"("displayOrder");
