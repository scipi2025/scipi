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

const pool = globalForPrisma.pool ?? new pg.Pool({
  connectionString,
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
