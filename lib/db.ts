import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: pg.Pool | undefined;
};

// Use DATABASE_URL or DATABASE_POSTGRES_PRISMA_URL from environment variable
const connectionString = process.env.DATABASE_URL || process.env.DATABASE_POSTGRES_PRISMA_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL or DATABASE_POSTGRES_PRISMA_URL environment variable is not set');
}

// Supabase (and many hosted Postgres providers) require SSL in production.
// Node-postgres will otherwise try to validate the full certificate chain and can fail
// with: "self-signed certificate in certificate chain".
const shouldUseSsl =
  process.env.VERCEL === '1' ||
  process.env.NODE_ENV === 'production' ||
  connectionString.includes('supabase.com');

const pool =
  globalForPrisma.pool ??
  new pg.Pool({
    connectionString,
    ssl: shouldUseSsl ? { rejectUnauthorized: false } : false,
  });

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}
