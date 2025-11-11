# 📌 SasaMum Backend — Quick Reference Card

## ⚡ Most Important Rule
**Run monorepo scripts from repository root, NOT from `backend/`**

```
✅ CORRECT:  cd C:\Users\KevinOchiengOmondi\Desktop\SasaMum && npm run dev:backend
❌ WRONG:    cd C:\Users\KevinOchiengOmondi\Desktop\SasaMum\backend && npm run dev:backend
```

---

## 🎯 Essential Commands

### From Repository Root
```bash
npm run dev:backend      # 🚀 Start backend with auto-reload
npm run test:backend     # 🧪 Run backend tests
npm run lint:backend     # 🔍 Check code quality
npm run format:backend   # 💅 Auto-format code
npm run start:backend    # ▶️  Run compiled version (production)
```

### From Backend Directory (Alternative)
```bash
cd backend
npm run dev              # 🚀 Dev server
npm test                 # 🧪 Tests
npm run lint             # 🔍 Lint
npm run format           # 💅 Format
npm run build            # 🔨 Build
npx tsc --noEmit         # ✅ Type-check
```

---

## 🐳 Docker Setup (For Testing)

```bash
cd backend
docker-compose up -d db        # Start Postgres
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev                     # Server on :3001
```

---

## 📊 Status Checks

| Check | Command | Expected |
| --- | --- | --- |
| Type errors | `npx tsc --noEmit` | 0 |
| Build errors | `npm run build` | 0 |
| Lint errors | `npm run lint` | 0 |
| Line endings | `npm run format` | clean |

---

## 📚 Documentation Files

| File | Purpose |
| --- | --- |
| `QUICK_START_GUIDE.md` | How to use commands correctly |
| `BACKEND_TYPESCRIPT_START_HERE.md` | Master index, start here |
| `BACKEND_TYPESCRIPT_COMPLETED.md` | Executive summary |
| `FINAL_VALIDATION_REPORT.md` | Current status & validation |
| `backend/README.md` | Backend-specific setup |

---

## 🆘 Common Issues

| Issue | Fix |
| --- | --- |
| "Script not found" | Check if in repo root (use `pwd` to verify) |
| Port 3001 in use | Kill process or use `PORT=3002 npm run dev` |
| Docker not found | Install Docker Desktop or use `docker compose` |
| Type errors | Run `npx tsc --noEmit` to see details |

---

## ✨ File Structure

```
backend/
├── src/
│   ├── index.ts              ← Main server
│   ├── prismaClient.ts       ← Database
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── articles.ts
│   │   └── chats.ts
│   ├── types/custom.d.ts
│   ├── testHelpers.ts
│   └── scripts/setup-test-db.ts
├── tsconfig.json
├── .eslintrc.cjs
├── .prettierrc
├── package.json              ← Scripts defined here
└── README.md
```

---

## 🎯 Typical Workflow

```bash
# 1. Start backend development
npm run dev:backend

# 2. Open another terminal, format code
npm run format:backend

# 3. Check quality
npm run lint:backend

# 4. Run tests (requires Postgres)
npm run test:backend

# 5. Build for production
cd backend && npm run build

# 6. Deploy
npm run start:backend
```

---

## ✅ Current Status

- ✅ 100% TypeScript (7 files)
- ✅ 0 Type errors
- ✅ 0 Build errors
- ✅ GitHub Actions CI/CD
- ✅ Production ready

---

**Keep this card handy!** Print it or save it to your favorites. 📌
