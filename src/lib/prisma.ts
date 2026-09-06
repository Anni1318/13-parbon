import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDbUrl() {
  const raw = process.env.DATABASE_URL;
  if (!raw) return undefined;
  if (raw.includes('pooler.supabase.com') && !raw.includes('connection_limit=')) {
    return raw + (raw.includes('?') ? '&' : '?') + 'connection_limit=10&connect_timeout=15';
  }
  return raw;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getDbUrl(),
      },
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
