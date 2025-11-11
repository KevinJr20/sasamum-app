# SasaMum Backend (Prisma + Express)

This backend uses Prisma (PostgreSQL by default according to `prisma/schema.prisma`), Express, JWT auth, bcrypt for passwords, and basic validation and security middlewares.

Quick start (PowerShell):

```powershell
Set-Location -Path 'c:\Users\KevinOchiengOmondi\Desktop\SasaMum\backend'
npm install
# generate prisma client
npm run prisma:generate
# If you have a Postgres instance available, point DATABASE_URL to it and apply migrations
$env:DATABASE_URL='postgresql://postgres:postgres@localhost:5432/sasamum_dev'
npm run prisma:migrate
npm run dev
```

Running locally without Postgres
- The project is configured to use PostgreSQL in `prisma/schema.prisma`. If you prefer SQLite for quick experiments, either:
	- Edit `prisma/schema.prisma` to set `provider = "sqlite"` and `url = "file:./dev.db"`, then run `npx prisma migrate dev` to create a local SQLite DB.
	- Or run Postgres via Docker Compose (recommended for parity with production):

```powershell
Set-Location -Path 'c:\Users\KevinOchiengOmondi\Desktop\SasaMum\backend'
docker-compose up -d db
# then set DATABASE_URL to match docker-compose and run migrations
$env:DATABASE_URL='postgresql://postgres:Omondijr69!!@localhost:5432/SasaMum'
npx prisma migrate deploy
npm run dev
```

Tests
- Backend tests use Prisma and expect a PostgreSQL-compatible datasource. In CI we run tests against a Postgres service. To run tests locally, either run a Postgres instance (Docker Compose as above) or temporarily change the datasource to SQLite and apply migrations. Example (Docker):

```powershell
docker-compose up -d db
$env:DATABASE_URL='postgresql://postgres:Omondijr69!!@localhost:5432/SasaMum'
npm test
```

API endpoints are similar to the earlier server but now backed by Prisma and secure password handling.
