#!/usr/bin/env node

/**
 * Utility script to ensure Prisma is ready for tests.
 * Generates Prisma client and applies pending migrations.
 * Used in CI before running test suite.
 */

import { execSync } from 'child_process';

async function main() {
  console.log('🔧 Preparing database for tests...');

  try {
    console.log('  → Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });

    console.log('  → Running migrations...');
    execSync('npx prisma migrate deploy --preview-feature 2>/dev/null || npx prisma db push', {
      stdio: 'inherit',
    });

    console.log('✅ Database ready for tests!');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

main();
