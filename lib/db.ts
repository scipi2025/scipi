import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: pg.Pool | undefined;
};

// Use DATABASE_URL from environment variable (required for Vercel/production)
let connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Determine if we're in production (Vercel sets this)
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';

// For Supabase in production, ensure sslmode is set in the connection string
if (isProduction && !connectionString.includes('sslmode=')) {
  const separator = connectionString.includes('?') ? '&' : '?';
  connectionString = `${connectionString}${separator}sslmode=require`;
}

const pool = globalForPrisma.pool ?? new pg.Pool({
  connectionString,
  // SSL configuration for production
  ssl: isProduction ? {
    rejectUnauthorized: false,
  } : undefined,
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
