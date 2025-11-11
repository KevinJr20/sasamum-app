# 🐳 Docker Desktop Installation Guide for Windows

## ✅ Good News: Docker Desktop is FREE

No subscription required for personal use!

---

## 📥 Step 1: Download Docker Desktop

1. Go to: **https://www.docker.com/products/docker-desktop**
2. Click **"Download for Windows"**
3. You'll get `Docker Desktop Installer.exe`

---

## 💿 Step 2: Install Docker Desktop

1. **Run the installer** (double-click `Docker Desktop Installer.exe`)
2. **Welcome screen:** Click "Next"
3. **Configuration:**
   - Keep default settings
   - ✅ Check "Use WSL 2 instead of Hyper-V" (if available)
   - ✅ Check "Add Docker to PATH"
   - Click "Next"
4. **Complete installation:** Click "Install"
5. **Restart when prompted** (required!)

---

## ⚙️ Step 3: First Launch & Setup

1. **After restart:** Docker Desktop starts automatically
2. **First launch takes 2-3 minutes** (it's setting up)
3. You should see:
   - Docker icon in system tray (bottom right)
   - "Docker Desktop is running" notification

---

## ✔️ Step 4: Verify Installation

Open PowerShell and run:

```powershell
docker --version
```

You should see:
```
Docker version 25.x.x, build xxxxxxxx
```

If successful, also run:
```powershell
docker run hello-world
```

You should see a "Hello from Docker!" message.

---

## 🚀 Step 5: Start Your Backend with Docker

Once Docker is running:

```powershell
# Terminal 1 - Start Postgres database
cd backend
docker-compose up -d db

# Wait 5-10 seconds for database to start, then:

# Terminal 2 - Start Node.js backend
cd backend
npm run dev
```

---

## ⚠️ Common Issues & Fixes

### Issue 1: "Docker Desktop is not running"
**Solution:**
- Look for Docker icon in system tray (bottom right)
- Right-click it and select "Open"
- Wait 2-3 minutes for it to fully start

### Issue 2: "WSL 2 installation incomplete"
**Solution:**
```powershell
# Download WSL 2 kernel update
# Go to: https://aka.ms/wsl2kernel
# Run installer
# Restart computer
```

### Issue 3: Virtualization not enabled in BIOS
**Symptoms:** Installation fails with "Hyper-V not available"

**Solution:**
1. Restart your computer
2. Enter BIOS (usually F2, Del, or F12 during startup)
3. Find "Virtualization Technology" or "VT-x"
4. Enable it
5. Save and restart
6. Retry Docker installation

### Issue 4: "Cannot connect to Docker daemon"
**Solution:**
```powershell
# Make sure Docker Desktop is running
# Check taskbar for Docker icon
# If not there, search Windows for "Docker Desktop" and launch it
```

---

## 🎯 After Docker is Installed

Run these commands:

```powershell
# Terminal 1: Start Database
cd c:\Users\KevinOchiengOmondi\Desktop\SasaMum\backend
docker-compose up -d db

# You should see:
# Creating postgres_data volume ...
# Creating backend-db-1 ...
```

Wait 5-10 seconds for the database to start, then:

```powershell
# Terminal 2: Start Backend Node Server
cd c:\Users\KevinOchiengOmondi\Desktop\SasaMum\backend
npm run dev

# You should see:
# [3:45:32 PM] Compilation complete
# Server running on http://localhost:3001
```

---

## 📊 Verify Setup

Once both are running:

```powershell
# Check containers are running (in new terminal)
docker ps

# You should see:
# CONTAINER ID  IMAGE         PORTS
# xxxxx         postgres:15   0.0.0.0:5432->5432/tcp
```

---

## 🖥️ Access Your App

Frontend: http://localhost:3000 (already running ✓)
Backend: http://localhost:3001 (will be running after Step 5)

---

## 🧹 Cleanup Commands (Optional)

```powershell
# Stop database
docker-compose down

# Remove database data (reset)
docker-compose down -v

# Stop backend (Ctrl+C in its terminal)
```

---

## ✅ Checklist

- [ ] Downloaded Docker Desktop installer
- [ ] Ran installer and selected default options
- [ ] Restarted computer after installation
- [ ] Verified: `docker --version` works
- [ ] Verified: `docker run hello-world` works
- [ ] Started database: `docker-compose up -d db`
- [ ] Started backend: `npm run dev`
- [ ] Backend is running on http://localhost:3001
- [ ] Frontend already running on http://localhost:3000
- [ ] Ready to do UI testing!

---

## ⏱️ Timeline

- Download: 2 minutes
- Installation: 3-5 minutes
- First launch: 2-3 minutes
- Database startup: 5-10 seconds
- Total: ~15-20 minutes

---

**Need help during installation? Let me know the exact error message and I'll troubleshoot!**

Once Docker is running and you have:
- Backend on http://localhost:3001
- Frontend on http://localhost:3000

We'll start the UI review and fixes! 🎨
