-- CreateTable
CREATE TABLE "event_sections" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "backgroundColor" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_section_files" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_section_files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "event_sections_eventId_idx" ON "event_sections"("eventId");

-- CreateIndex
CREATE INDEX "event_sections_displayOrder_idx" ON "event_sections"("displayOrder");

-- CreateIndex
CREATE INDEX "event_section_files_sectionId_idx" ON "event_section_files"("sectionId");

-- AddForeignKey
ALTER TABLE "event_sections" ADD CONSTRAINT "event_sections_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_section_files" ADD CONSTRAINT "event_section_files_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "event_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
