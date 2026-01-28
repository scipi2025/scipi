-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "imageUrl" TEXT;

-- CreateTable
CREATE TABLE "project_sections" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT,
    "titleEn" TEXT,
    "content" TEXT,
    "contentEn" TEXT,
    "backgroundColor" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_section_files" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_section_files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "project_sections_projectId_idx" ON "project_sections"("projectId");

-- CreateIndex
CREATE INDEX "project_sections_displayOrder_idx" ON "project_sections"("displayOrder");

-- CreateIndex
CREATE INDEX "project_section_files_sectionId_idx" ON "project_section_files"("sectionId");

-- AddForeignKey
ALTER TABLE "project_sections" ADD CONSTRAINT "project_sections_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_section_files" ADD CONSTRAINT "project_section_files_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "project_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
