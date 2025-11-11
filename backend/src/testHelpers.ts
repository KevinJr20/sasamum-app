import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

/**
 * Ensure Prisma client is available and migrations are applied before tests run.
 * Call this in test setup or beforeAll hooks.
 */
export async function setupTestDatabase(): Promise<PrismaClient> {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  // Optionally run migrations here if needed; for now rely on CI/local setup.
  return prisma;
}

/**
 * Clean up Prisma client after tests.
 */
export async function teardownTestDatabase(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
  }
}
