import "dotenv/config";
import { defineConfig } from "prisma/config";

// Use DATABASE_URL or fallback to DATABASE_POSTGRES_PRISMA_URL (set by Vercel Supabase integration)
const databaseUrl = process.env.DATABASE_URL || process.env.DATABASE_POSTGRES_PRISMA_URL || "";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
