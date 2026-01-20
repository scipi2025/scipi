-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "displayOrder" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "projects_displayOrder_idx" ON "projects"("displayOrder");
