-- AlterTable
ALTER TABLE "resources" ADD COLUMN     "fileUrl" TEXT,
ALTER COLUMN "url" DROP NOT NULL;
