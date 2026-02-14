-- CreateTable
CREATE TABLE "website_visits" (
    "id" TEXT NOT NULL,
    "adminId" TEXT,
    "visitorId" TEXT NOT NULL,
    "isAuthenticated" BOOLEAN NOT NULL DEFAULT false,
    "isNewVisitor" BOOLEAN NOT NULL DEFAULT false,
    "path" TEXT NOT NULL,
    "query" TEXT,
    "fullPath" TEXT NOT NULL,
    "host" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "browser" TEXT,
    "operatingSystem" TEXT,
    "deviceType" TEXT,
    "country" TEXT,
    "region" TEXT,
    "city" TEXT,
    "referer" TEXT,
    "refererHost" TEXT,
    "source" TEXT,
    "screenWidth" INTEGER,
    "screenHeight" INTEGER,
    "viewportWidth" INTEGER,
    "viewportHeight" INTEGER,
    "language" TEXT,
    "timezone" TEXT,
    "platform" TEXT,
    "pageTitle" TEXT,
    "doNotTrack" BOOLEAN,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmTerm" TEXT,
    "utmContent" TEXT,
    "visitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "website_visits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "website_visits_visitedAt_idx" ON "website_visits"("visitedAt");

-- CreateIndex
CREATE INDEX "website_visits_path_idx" ON "website_visits"("path");

-- CreateIndex
CREATE INDEX "website_visits_visitorId_idx" ON "website_visits"("visitorId");

-- CreateIndex
CREATE INDEX "website_visits_adminId_idx" ON "website_visits"("adminId");

-- CreateIndex
CREATE INDEX "website_visits_source_idx" ON "website_visits"("source");

-- CreateIndex
CREATE INDEX "website_visits_browser_idx" ON "website_visits"("browser");

-- CreateIndex
CREATE INDEX "website_visits_deviceType_idx" ON "website_visits"("deviceType");

-- AddForeignKey
ALTER TABLE "website_visits" ADD CONSTRAINT "website_visits_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
