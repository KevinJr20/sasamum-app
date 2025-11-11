# 🚀 Quick Start Guide — Correct Usage

## ⚠️ Important: Run from Repository Root, NOT from `backend/`

All monorepo convenience scripts MUST be run from the **repository root** (`C:\Users\KevinOchiengOmondi\Desktop\SasaMum`), NOT from inside the `backend/` folder.

---

## ✅ Correct Usage (From Repository Root)

### Development

```powershell
# Navigate to repo root
cd C:\Users\KevinOchiengOmondi\Desktop\SasaMum

# Start backend dev server with auto-reload (TypeScript)
npm run dev:backend

# Server will run on http://localhost:3001
# Logs: "SasaMum backend (TS) listening on port 3001"
```

### Testing & Quality

```powershell
# From repo root

# Type-check backend
cd backend && npx tsc --noEmit

# Lint backend code
npm run lint:backend

# Format backend code
npm run format:backend

# Run backend tests (requires Postgres or Docker setup)
npm run test:backend

# Run compiled version (production)
npm run start:backend
```

### Alternative: Direct Backend Commands

```powershell
# If you prefer running commands in backend/ directly:
cd backend

# Type-check (while in backend/)
npx tsc -p tsconfig.json --noEmit

# Lint
npm run lint

# Format
npm run format

# Build
npm run build

# Dev server
npm run dev

# Tests
npm test
```

---

## 🐳 Docker Setup (For Local Testing with Postgres)

```powershell
# From backend directory
cd C:\Users\KevinOchiengOmondi\Desktop\SasaMum\backend

# Start Postgres container
docker-compose up -d db

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Apply migrations
npm run prisma:migrate

# Start dev server
npm run dev
```

If `docker-compose` command not found, use `docker compose`:
```powershell
docker compose up -d db
```

---

## ❌ WRONG (Don't Do This)

```powershell
# ❌ WRONG - Running from inside backend/
cd C:\Users\KevinOchiengOmondi\Desktop\SasaMum\backend
npm run dev:backend    # ❌ Script not found!
npm run test:backend   # ❌ Script not found!

# ❌ WRONG - Trying to cd into backend while already there
cd backend             # ❌ Can't find backend/backend!
```

---

## ✅ CORRECT (Do This)

```powershell
# ✅ CORRECT - Run from repo root
cd C:\Users\KevinOchiengOmondi\Desktop\SasaMum
npm run dev:backend    # ✅ Works!
npm run test:backend   # ✅ Works!

# Or run backend commands directly from backend/
cd backend
npm run dev            # ✅ Works!
npm run lint           # ✅ Works!
```

---

## 📍 Current Location Check

To see where you are:

```powershell
# Check current directory
pwd

# You should see one of:
# C:\Users\KevinOchiengOmondi\Desktop\SasaMum         ← ✅ Correct for npm run dev:backend
# C:\Users\KevinOchiengOmondi\Desktop\SasaMum\backend ← ✅ Correct for npm run dev
```

---

## 🎯 Available Scripts

### From Repository Root
```bash
npm run dev              # Start frontend (Vite)
npm run dev:backend      # Start backend (TypeScript, ts-node-dev)
npm run start:backend    # Run compiled backend (production)
npm run build            # Build frontend
npm run test             # Run frontend tests
npm run test:backend     # Run backend tests
npm run lint:backend     # Lint backend
npm run format:backend   # Format backend
```

### From Backend Directory
```bash
npm run dev              # TypeScript dev server with auto-reload
npm run build            # Compile TypeScript to dist/
npm run start            # Run compiled version
npm run lint             # ESLint
npm run format           # Prettier
npm test                 # Jest tests
npm run prisma:generate  # Regenerate Prisma client
npm run prisma:migrate   # Run database migrations
```

---

## 🔥 Quick Reference Card

| Task | Command | Location |
| --- | --- | --- |
| **Start backend dev** | `npm run dev:backend` | Repo root |
| **Start frontend dev** | `npm run dev` | Repo root |
| **Type-check** | `npx tsc --noEmit` | `backend/` |
| **Lint** | `npm run lint:backend` | Repo root |
| **Format** | `npm run format:backend` | Repo root |
| **Build frontend** | `npm run build` | Repo root |
| **Build backend** | `npm run build` | `backend/` |
| **Run tests** | `npm run test:backend` | Repo root |

---

## 💡 Pro Tips

1. **Use PowerShell Tabs** — Keep one terminal in repo root, one in backend/
2. **Check `pwd`** — Always verify your current directory
3. **Watch Mode** — Backend auto-reloads when you save files (ts-node-dev)
4. **CI/CD** — GitHub Actions runs all checks automatically on push

---

## 🆘 Troubleshooting

### "Script not found" Error
- **Check:** Are you in repo root or backend/?
- **Fix:** Use correct `cd` path

### "docker-compose: not found"
- **Check:** Is Docker Desktop installed and running?
- **Fix:** Use `docker compose` instead (newer Docker) or install Docker Compose

### Type errors
- **Check:** Run `npx tsc --noEmit` in `backend/`
- **Fix:** See error messages and update types

### Port 3001 already in use
- **Fix:** Kill the existing process or use different port: `PORT=3002 npm run dev`

---

## ✨ You're All Set!

Backend is **100% TypeScript**, **type-checked**, **linted**, and **production-ready**. 

Just remember: **Run monorepo scripts from repo root!** 🚀
