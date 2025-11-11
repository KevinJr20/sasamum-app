# 🐳 Docker Daemon Not Running - Fix Guide

## 🔴 Problem
Docker client is installed but the Docker Desktop daemon (background service) isn't running.

---

## ✅ Solution: Start Docker Desktop

### Option 1: Quick Start (Easiest)

1. **Open Windows Start Menu**
2. **Search for:** "Docker Desktop"
3. **Click** to launch it
4. **Wait 2-3 minutes** for it to fully start
5. You should see Docker icon in system tray (bottom right)

### Option 2: Via Command Line

```powershell
# Run as Administrator
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
```

### Option 3: Check System Tray

Look for Docker icon (whale 🐳) in bottom right corner:
- ✅ Solid whale = Docker running
- ⚠️ Grayed out whale = Docker stopped

---

## ⏳ Wait for Docker to Start

Docker Desktop takes 2-3 minutes to fully initialize on first start. Watch for:
- Notification "Docker Desktop is running"
- Docker icon becomes solid
- No error messages in system tray

---

## ✔️ Verify Docker is Running

Once Docker Desktop is started, run:

```powershell
docker --version
```

Should show: `Docker version 25.x.x, build xxxxxxxx`

Then verify daemon is running:
```powershell
docker ps
```

Should show container list (may be empty initially).

---

## 🚀 Once Docker is Running

Then start the database:

```powershell
cd c:\Users\KevinOchiengOmondi\Desktop\SasaMum\backend
docker-compose up -d db
```

You should see:
```
[+] Running 2/2
 ✔ Network backend_default     Created
 ✔ Container backend-db-1      Started
```

---

## ✅ Checklist

- [ ] Docker Desktop launched
- [ ] Waited 2-3 minutes
- [ ] Docker icon in system tray is solid (not grayed)
- [ ] `docker --version` works
- [ ] `docker ps` shows containers list
- [ ] `docker-compose up -d db` started successfully
- [ ] Backend ready to start

---

## 🆘 Still Not Working?

Try these:

1. **Restart Docker Desktop:**
   ```powershell
   # Close Docker first, then:
   Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
   Start-Sleep -Seconds 180  # Wait 3 minutes
   docker ps
   ```

2. **Check system resources:**
   - Open Task Manager (Ctrl+Shift+Esc)
   - Look for "Docker Desktop" process
   - Should use 200-500 MB RAM

3. **Check Windows Event Log:**
   - Search: "Event Viewer"
   - Look for Docker-related errors
   - Report errors to Docker support

4. **Reinstall if needed:**
   - Uninstall Docker Desktop
   - Restart computer
   - Reinstall from https://www.docker.com/products/docker-desktop

---

**Once Docker Desktop shows "running", let me know and we'll start the backend! 🚀**
