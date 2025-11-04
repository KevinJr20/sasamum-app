# SasaMum Backend (Prisma + Express)

This backend uses Prisma (SQLite by default for quick local dev), Express, JWT auth, bcrypt for passwords, and basic validation and security middlewares.

Quick start (PowerShell):

```powershell
Set-Location -Path 'c:\Users\KevinOchiengOmondi\Desktop\SasaMum\backend'
npm install
# generate prisma client and apply initial migration (creates sqlite dev.db)
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Switching to Postgres for production:
- Update `prisma/schema.prisma` datasource url to your Postgres DSN.
- Run `npx prisma migrate deploy` or `npx prisma migrate dev` when developing.

API endpoints are similar to the earlier server but now backed by Prisma and secure password handling.
