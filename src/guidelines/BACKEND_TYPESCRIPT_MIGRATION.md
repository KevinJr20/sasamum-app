# Backend TypeScript Migration Guide

## Overview

This guide documents the backend TypeScript migration process and provides instructions for completing the migration for utilities, middleware, and remaining files.

## Migration Status

### ✅ Completed (Core)

- **TypeScript Tooling Setup**
  - `tsconfig.json` configured with incremental migration support (`allowJs: true`)
  - `ts-node-dev` for development (transpile-only for speed)
  - TypeScript build pipeline (`npm run build` → `dist/`)

- **Server Entry Point**
  - `src/index.ts` — Express app entry with middleware, route mounting, error handling
  - Exports `app` for testing (Supertest/Jest)
  - Maintains feature parity with original `index.js`

- **Database Client**
  - `src/prismaClient.ts` — Typed Prisma singleton for dev reuse

- **Routes (All Converted)**
  - `src/routes/auth.ts` — Authentication (register, login)
  - `src/routes/articles.ts` — Article CRUD
  - `src/routes/chats.ts` — Chat message CRUD
  - All use typed Prisma client and express-validator

- **Linting & Formatting**
  - ESLint configured for TypeScript (`.eslintrc.cjs`)
  - Prettier enabled for auto-formatting (`.prettierrc`)
  - All TS files pass lint (warnings acceptable for error handler)

- **CI/CD**
  - GitHub Actions workflow (`.github/workflows/ci.yml`)
  - Runs frontend type-check, build, tests
  - Provisions Postgres service for backend tests
  - Applies migrations before tests (`npx prisma db push`)
  - Runs backend lint and tests

### 🔄 In Progress / Future

- **Type Utilities** — Consider creating `src/types/index.ts` for shared request/response types
- **Middleware** — Migrate authentication middleware (if exists) to TypeScript
- **Error Handling** — Create typed error classes in `src/errors/`
- **Database Utilities** — Move common Prisma queries to `src/db/queries.ts`

## Local Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL 13+ (or Docker)

### Quick Start

#### Option 1: Using Docker Compose (Recommended)

```bash
cd backend
docker-compose up -d db          # Start Postgres service
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev                       # Start ts-node-dev server
```

The server listens on `http://localhost:3001` by default.

#### Option 2: External Postgres

```bash
cd backend
export DATABASE_URL="postgresql://user:password@localhost:5432/sasamum"
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

#### Option 3: SQLite (Quick Testing Only)

Temporarily switch to SQLite in `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

Then run:

```bash
npm run prisma:migrate
npm run dev
```

_Note: Production uses PostgreSQL; SQLite is for quick local testing only._

## Scripts

### Development

```bash
npm run dev              # Start server with ts-node-dev (auto-reload)
npm run build            # Build TypeScript to dist/
npm run start            # Run compiled dist/index.js
```

### Quality Checks

```bash
npm run lint             # Run ESLint
npm run format           # Run Prettier (auto-fix)
```

### Testing

```bash
npm test                 # Run Jest tests (requires DB set up)
```

### Database

```bash
npm run prisma:generate # Generate Prisma client
npm run prisma:migrate  # Create and apply migrations
```

## File Structure

```
backend/
├── src/
│   ├── index.ts                   # Main Express app (exported for tests)
│   ├── prismaClient.ts            # Typed Prisma singleton
│   ├── routes/
│   │   ├── auth.ts                # Authentication endpoints
│   │   ├── articles.ts            # Article endpoints
│   │   └── chats.ts               # Chat endpoints
│   ├── types/
│   │   └── custom.d.ts            # Ambient type declarations (bcrypt)
│   ├── testHelpers.ts             # Database setup/teardown helpers
│   └── scripts/
│       └── setup-test-db.ts       # CI migration helper
├── prisma/
│   ├── schema.prisma              # Prisma schema (PostgreSQL)
│   └── migrations/                # Migration files
├── tests/                         # Jest tests (JS, can be migrated to TS)
├── routes/                        # Legacy JS routes (deprecated)
├── utils/                         # Utilities (if exist, migrate to src/)
├── tsconfig.json                  # TypeScript configuration
├── .eslintrc.cjs                  # ESLint rules
├── .prettierrc                    # Prettier config
├── .eslintignore                  # ESLint ignore patterns
├── package.json                   # Dependencies and scripts
├── Dockerfile                     # Docker build
├── docker-compose.yml             # Postgres + app services
└── README.md                      # Backend setup instructions
```

## Next Steps for Complete Migration

### 1. Migrate Remaining Files (If Present)

- `routes/utils/` → `src/utils/`
- `routes/middleware/` → `src/middleware/`
- Auth middleware, custom validators, etc.

### 2. Create Type Definitions

Create `src/types/index.ts`:

```typescript
import { Request } from 'express';

// Extend Express Request with user context
declare global {
  namespace Express {
    interface Request {
      user?: { id: number; email: string };
    }
  }
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
```

### 3. Improve Error Handling

Create `src/errors/AppError.ts`:

```typescript
export class AppError extends Error {
  constructor(public message: string, public status: number = 500) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
```

### 4. Add Authentication Middleware

Create `src/middleware/auth.ts` with typed token verification.

### 5. Remove `allowJs: true` from tsconfig.json

Once all files are migrated, set `allowJs: false` to enforce TypeScript.

### 6. Update Tests to TypeScript

Migrate `tests/*.test.js` to `src/__tests__/*.test.ts` and update imports.

## Troubleshooting

### "Could not find a declaration file for module X"

Add an ambient declaration in `src/types/custom.d.ts`:

```typescript
declare module 'package-name';
```

Or install `@types/package-name`.

### Database connection errors in tests

Ensure `DATABASE_URL` is set and points to an accessible Postgres instance:

```bash
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sasamum_test"
npm test
```

### `ts-node-dev` not reloading

Restart with `npm run dev`. If issues persist, try `npm run build && npm run start`.

### TypeScript version mismatch warning

The warning about unsupported TypeScript version is safe to ignore; the code works fine with TypeScript 5.9.3.

## CI/CD Integration

The GitHub Actions workflow in `.github/workflows/ci.yml`:

1. Installs backend dependencies
2. Builds TypeScript to `dist/`
3. Sets up Postgres and runs migrations
4. Runs ESLint
5. Runs Jest tests against Postgres

Ensure `DATABASE_URL` in CI matches the Postgres service configuration.

## Root Package.json Scripts (Monorepo)

From repository root:

```bash
npm run dev:backend       # Start backend server
npm run start:backend     # Run compiled backend
npm run test:backend      # Run backend tests
npm run lint:backend      # Lint backend code
npm run format:backend    # Format backend code
```

## Production Deployment

1. Build backend: `npm run build`
2. Set `NODE_ENV=production` and `DATABASE_URL` to production Postgres
3. Run compiled version: `npm run start`
4. Optionally use Docker: `docker build -t sasamum-backend . && docker run ...`

See `Dockerfile` and `docker-compose.yml` for container-based deployment.

---

**Last Updated:** November 2025
**Backend Status:** TypeScript ✅ | Tests ✅ | CI/CD ✅
