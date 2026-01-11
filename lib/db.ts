import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: pg.Pool | undefined;
};

// Use DATABASE_URL from environment variable (required for Vercel/production)
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Enable SSL if running on Vercel or in production, or if connection string contains pooler.supabase.com
const useSSL = process.env.VERCEL === '1' || 
               process.env.NODE_ENV === 'production' || 
               connectionString.includes('supabase.com');

const pool = globalForPrisma.pool ?? new pg.Pool({
  connectionString,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
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
