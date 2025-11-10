const { PrismaClient } = require('@prisma/client');

// Reuse client instance during development to avoid exhausting database
// connections when using nodemon / hot reload.
const prisma = global.__prismaClient || new PrismaClient();
if (process.env.NODE_ENV === 'development') global.__prismaClient = prisma;

module.exports = prisma;
