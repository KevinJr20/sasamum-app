import { PrismaClient } from '@prisma/client';

// Reuse client during development to avoid exhausting DB connections
declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var __prismaClient: PrismaClient | undefined;
}

const prisma = global.__prismaClient || new PrismaClient();
if (process.env.NODE_ENV === 'development') global.__prismaClient = prisma;

export default prisma;
