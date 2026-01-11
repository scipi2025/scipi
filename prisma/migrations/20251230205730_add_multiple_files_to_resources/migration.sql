/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `resources` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "resources" DROP COLUMN "fileUrl";

-- CreateTable
CREATE TABLE "resource_files" (
    "id" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resource_files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "resource_files_resourceId_idx" ON "resource_files"("resourceId");

-- AddForeignKey
ALTER TABLE "resource_files" ADD CONSTRAINT "resource_files_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;
