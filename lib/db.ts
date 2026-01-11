import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// Use DATABASE_URL or DATABASE_POSTGRES_PRISMA_URL from environment variable
const connectionString = process.env.DATABASE_URL || process.env.DATABASE_POSTGRES_PRISMA_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL or DATABASE_POSTGRES_PRISMA_URL environment variable is not set');
}

// Supabase requires SSL - we need to configure it properly
const isProduction = process.env.VERCEL === '1' || 
                     process.env.NODE_ENV === 'production' || 
                     connectionString.includes('supabase.com');

// Create pool with SSL configuration
const pool = new pg.Pool({
  connectionString,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  // Connection pool settings for serverless
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
