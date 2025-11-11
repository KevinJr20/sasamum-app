# 🚀 Local Setup Options (Docker Not Found)

Docker is not installed on your system. Here are your options:

---

## Option 1: Use SQLite (Easiest - Recommended for Local Dev) ✅

### Pros:
- No Docker installation needed
- Instant setup
- Perfect for UI testing and local development
- Single file database

### Cons:
- Not same as production (production uses PostgreSQL)
- Not suitable for concurrent connections

### Steps:

**1. Update `.env.local` in backend:**
```env
DATABASE_URL="file:./dev.db"
NODE_ENV=development
JWT_SECRET=your-local-jwt-secret-key
FRONTEND_ORIGIN=http://localhost:3000
```

**2. Run Prisma migration:**
```powershell
cd backend
npx prisma db push
```

**3. Start backend:**
```powershell
npm run dev
```

**4. Start frontend (in repo root):**
```powershell
npm run dev
```

**5. Open browser:**
```
http://localhost:3000
```

---

## Option 2: Install Docker Desktop (Best for Production Parity)

### Steps:

1. **Download Docker Desktop for Windows:**
   - Go to: https://www.docker.com/products/docker-desktop
   - Click "Download for Windows"
   - Run installer and follow setup wizard
   - Restart your computer when prompted

2. **Verify installation:**
   ```powershell
   docker --version
   docker run hello-world
   ```

3. **Then run the usual commands:**
   ```powershell
   cd backend
   docker-compose up -d db
   npm run dev
   ```

⚠️ **Note:** Docker Desktop requires virtualization enabled. If you get errors, check:
- BIOS settings (enable Virtualization Technology)
- Windows Hyper-V enabled (if available on your Windows version)

---

## Option 3: Use WSL2 with Docker (Advanced)

If you're on Windows 11, you can use WSL2 (Windows Subsystem for Linux 2):

```powershell
# Install WSL2 (run as Administrator)
wsl --install

# Then install Docker inside WSL2
# Follow Docker Desktop or Docker Engine for Linux installation
```

---

## 🎯 My Recommendation

### For NOW (UI Review & Testing):
**Use Option 1 (SQLite)** - Get the app running immediately and test the UI

```powershell
# Quick start with SQLite:
cd backend
npx prisma db push
npm run dev
```

Then in another terminal:
```powershell
# From repo root
npm run dev
```

Open http://localhost:3000 and start your UI review!

### For Later (Production Parity):
Install Docker Desktop and test with PostgreSQL to match production environment.

---

## 🔧 Quick SQLite Setup

**Step 1:** Create/update `.env.local` in `backend/` directory:
```
DATABASE_URL="file:./dev.db"
NODE_ENV=development
JWT_SECRET=your-dev-secret-123
FRONTEND_ORIGIN=http://localhost:3000
```

**Step 2:** Push schema to SQLite:
```powershell
cd backend
npx prisma db push
```

**Step 3:** Start servers:
```powershell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend (repo root)
npm run dev
```

**Step 4:** Open app:
```
http://localhost:3000
```

---

## ❓ FAQs

**Q: Will SQLite work for testing?**
A: Yes! Perfect for UI testing. API will work identically to PostgreSQL.

**Q: What about data persistence?**
A: SQLite data persists in `backend/dev.db` file. Delete it to reset.

**Q: Can I switch to Docker later?**
A: Yes! Just install Docker and switch DATABASE_URL back to PostgreSQL connection string.

**Q: Will tests work with SQLite?**
A: Yes, but CI/CD still uses PostgreSQL. Local tests with SQLite are fine for development.

---

## 🚨 Troubleshooting

### Error: "prisma db push" fails
```powershell
# Reset everything
cd backend
rm dev.db (or Remove-Item dev.db on Windows)
npx prisma migrate reset
```

### Error: "npm run dev" can't connect to database
- Check `.env.local` has correct DATABASE_URL
- Make sure you ran `npx prisma db push`
- Check `dev.db` file exists

### Port already in use (3000 or 3001)
```powershell
# Find what's using the port
Get-NetTCPConnection -LocalPort 3000

# Kill the process
Stop-Process -Id <PID> -Force
```

---

**Ready to proceed? Just let me know which option you choose!**

Need help with Docker installation? I can provide detailed steps.

Need help with SQLite setup? Run the commands above and report any errors.
