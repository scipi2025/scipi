-- Add slug columns to projects, events, and resources tables

-- Add slug column to projects (initially nullable)
ALTER TABLE "projects" ADD COLUMN "slug" TEXT;

-- Add slug column to events (initially nullable)
ALTER TABLE "events" ADD COLUMN "slug" TEXT;

-- Add slug column to resources (initially nullable)
ALTER TABLE "resources" ADD COLUMN "slug" TEXT;

-- Generate slugs for existing projects
UPDATE "projects" SET "slug" = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        TRANSLATE(title, 'ăâîșțĂÂÎȘȚáàäéèëíìïóòöúùüñç', 'aaistsaaistaaeeeiiioooouuunc'),
        '[^a-zA-Z0-9\s-]', '', 'g'
      ),
      '\s+', '-', 'g'
    ),
    '-+', '-', 'g'
  )
);

-- Generate slugs for existing events
UPDATE "events" SET "slug" = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        TRANSLATE(title, 'ăâîșțĂÂÎȘȚáàäéèëíìïóòöúùüñç', 'aaistsaaistaaeeeiiioooouuunc'),
        '[^a-zA-Z0-9\s-]', '', 'g'
      ),
      '\s+', '-', 'g'
    ),
    '-+', '-', 'g'
  )
);

-- Generate slugs for existing resources
UPDATE "resources" SET "slug" = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        TRANSLATE(title, 'ăâîșțĂÂÎȘȚáàäéèëíìïóòöúùüñç', 'aaistsaaistaaeeeiiioooouuunc'),
        '[^a-zA-Z0-9\s-]', '', 'g'
      ),
      '\s+', '-', 'g'
    ),
    '-+', '-', 'g'
  )
);

-- Handle duplicates by appending id suffix for projects
UPDATE "projects" p1
SET "slug" = p1."slug" || '-' || SUBSTRING(p1."id", 1, 8)
WHERE EXISTS (
  SELECT 1 FROM "projects" p2 
  WHERE p2."slug" = p1."slug" AND p2."id" < p1."id"
);

-- Handle duplicates by appending id suffix for events
UPDATE "events" e1
SET "slug" = e1."slug" || '-' || SUBSTRING(e1."id", 1, 8)
WHERE EXISTS (
  SELECT 1 FROM "events" e2 
  WHERE e2."slug" = e1."slug" AND e2."id" < e1."id"
);

-- Handle duplicates by appending id suffix for resources
UPDATE "resources" r1
SET "slug" = r1."slug" || '-' || SUBSTRING(r1."id", 1, 8)
WHERE EXISTS (
  SELECT 1 FROM "resources" r2 
  WHERE r2."slug" = r1."slug" AND r2."id" < r1."id"
);

-- Set default for any remaining null slugs (edge case)
UPDATE "projects" SET "slug" = "id" WHERE "slug" IS NULL OR "slug" = '';
UPDATE "events" SET "slug" = "id" WHERE "slug" IS NULL OR "slug" = '';
UPDATE "resources" SET "slug" = "id" WHERE "slug" IS NULL OR "slug" = '';

-- Make slug columns NOT NULL and add unique constraints
ALTER TABLE "projects" ALTER COLUMN "slug" SET NOT NULL;
ALTER TABLE "events" ALTER COLUMN "slug" SET NOT NULL;
ALTER TABLE "resources" ALTER COLUMN "slug" SET NOT NULL;

-- Add unique indexes
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");
CREATE UNIQUE INDEX "resources_slug_key" ON "resources"("slug");
