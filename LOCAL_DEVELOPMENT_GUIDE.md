# 🎨 Local Development Setup — Full Stack (Frontend + Backend)

## 🚀 Quick Start (5 minutes)

### Step 1: Start Backend (Postgres + Server)
```bash
# Terminal 1: Start Postgres (required for backend)
cd C:\Users\KevinOchiengOmondi\Desktop\SasaMum\backend
docker-compose up -d db

# Wait ~5 seconds for Postgres to start, then:
npm run dev          # Starts on http://localhost:3001
# Expected output: "SasaMum backend (TS) listening on port 3001"
```

### Step 2: Start Frontend (In a new terminal)
```bash
# Terminal 2: Start frontend dev server
cd C:\Users\KevinOchiengOmondi\Desktop\SasaMum
npm run dev          # Starts on http://localhost:3000
# Expected output: "VITE v... ready in XXX ms"
```

### Step 3: Open in Browser
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Backend Health:** http://localhost:3001/health

---

## 🎯 UI Issue Identification Checklist

Once both servers are running, check these areas:

### Visual Issues
- [ ] Layout shifts or misalignment
- [ ] Text overflow or truncation
- [ ] Button/form element spacing
- [ ] Color contrast problems
- [ ] Mobile responsiveness
- [ ] Font rendering issues
- [ ] Icon sizing/alignment
- [ ] Modal/dialog positioning

### Interaction Issues
- [ ] Forms not submitting
- [ ] API calls failing (check Network tab)
- [ ] Navigation not working
- [ ] Search/filter not responding
- [ ] Buttons not clickable
- [ ] Dropdowns not opening

### Data Display Issues
- [ ] Empty states not showing
- [ ] Data not loading
- [ ] Charts/graphs rendering incorrectly
- [ ] Tables missing columns
- [ ] Lists not scrolling

---

## 📋 Browser DevTools Workflow

1. **Open DevTools:** F12 or Right-click → Inspect
2. **Check Console:** Any error messages? (Red ❌)
3. **Check Network:** Failed API calls? (Red status)
4. **Check Elements:** Inspect specific UI elements
5. **Check Responsive:** Toggle Device Toolbar (Ctrl+Shift+M)

---

## 🔧 How to Fix UI Issues

### Common Workflow
1. **Identify issue** in browser (visually or in console)
2. **Locate component** in `src/components/`
3. **Open file** in VS Code
4. **Make changes** (styling, layout, props)
5. **Save file** (auto-reload happens in ~100ms)
6. **Refresh browser** if needed (Ctrl+R)
7. **Verify fix** in browser

---

## 📁 Key Component Directories

| Path | Purpose | Common Issues |
| --- | --- | --- |
| `src/components/Dashboard.tsx` | Main home page | Layout, spacing |
| `src/components/AuthForms.tsx` | Login/signup | Form validation, styling |
| `src/components/ProfilePage.tsx` | User profile | Data rendering |
| `src/components/BottomNavigation.tsx` | Mobile nav | Positioning, icons |
| `src/components/HeaderMenu.tsx` | Top menu | Overflow, alignment |

---

## 🚨 Quick Troubleshooting

### Backend not responding
```bash
# Check if backend is running
curl http://localhost:3001/health

# If not running, restart:
cd backend && npm run dev
```

### Frontend not updating
```bash
# Hard refresh (clears cache)
Ctrl+Shift+R  (or Cmd+Shift+R on Mac)

# Or restart dev server:
# Stop: Ctrl+C
npm run dev
```

### Port already in use
```bash
# Kill process on port 3000 or 3001
# PowerShell:
Get-Process | Where-Object {$_.Port -eq 3000}  # Won't work - use netstat instead:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port:
PORT=3002 npm run dev
```

### Database connection error
```bash
# Check if Postgres is running
docker ps | grep postgres

# Restart if needed
cd backend && docker-compose up -d db
```

---

## 🎨 UI Fix Workflow

### Example: Fixing a button that's too small

1. **See issue:** Button appears too small in browser
2. **Inspect element:** Right-click → Inspect → Find button element
3. **Check styles:** Look at applied CSS in DevTools
4. **Find component:** Search `src/components/` for button component
5. **Edit file:** Increase padding or fontSize
6. **Save:** Auto-reload in browser
7. **Verify:** Check button size looks correct

### Example: API call failing

1. **See issue:** Data not loading, blank page
2. **Check console:** F12 → Console tab → See error message
3. **Check network:** DevTools → Network tab → See failed request
4. **Fix:** Check backend is running, API endpoint is correct
5. **Verify:** Refresh page, data should now load

---

## 📊 Common UI Issues & Fixes

| Issue | Likely Cause | Fix |
| --- | --- | --- |
| Buttons too small | Padding/font size | Increase in Tailwind class |
| Text overlapping | Width constraint missing | Add `truncate` or `max-w-` class |
| Layout broken on mobile | No responsive classes | Add `sm:`, `md:`, `lg:` prefixes |
| Colors wrong | Theme not applied | Check theme provider in `App.tsx` |
| Icons missing | Import path wrong | Verify icon name and import |
| Forms not working | Missing onChange handler | Add event handler to input |

---

## 🔍 Debugging Tips

### View component props
```tsx
// Add console log in component
useEffect(() => {
  console.log('Component props:', { prop1, prop2 });
}, []);
```

### Check API response
```bash
# In browser console:
fetch('http://localhost:3001/api/articles').then(r => r.json()).then(console.log)
```

### View Tailwind classes applied
- DevTools → Elements → Inspect element
- Scroll to Styles section
- See all applied Tailwind classes

---

## ✅ Verification Checklist

Before production deployment, verify:

- [ ] All pages load without errors
- [ ] Navigation works on all routes
- [ ] Forms submit successfully
- [ ] Data displays correctly
- [ ] Mobile layout looks good
- [ ] No console errors (red ❌)
- [ ] All API calls succeed
- [ ] Loading states show/hide correctly
- [ ] Error handling shows user-friendly messages
- [ ] Images load correctly
- [ ] Responsive design works (test at 375px, 768px, 1920px)

---

## 📱 Responsive Design Testing

```bash
# In DevTools, toggle Device Toolbar: Ctrl+Shift+M
# Test these breakpoints:
- Mobile: 375px (iPhone SE)
- Tablet: 768px (iPad)
- Desktop: 1920px (Large desktop)
```

---

## 🎯 Next Steps

1. **Start both servers** (backend + frontend)
2. **Open http://localhost:3000** in browser
3. **Identify UI issues** using the checklist above
4. **Document issues** (screenshot + description)
5. **Fix issues** component by component
6. **Test thoroughly** across devices
7. **Commit fixes** when complete
8. **Notify me** when ready for production

---

## 💡 Pro Tips

- **Auto-reload:** Changes auto-refresh in browser (usually <200ms)
- **DevTools:** Keep open while developing (F12)
- **Console:** Check regularly for errors
- **Network:** Monitor API calls in real-time
- **React DevTools:** Install browser extension for component debugging
- **Keyboard shortcuts:** Ctrl+Shift+R (hard refresh), Ctrl+K (command palette)

---

**Ready to start?** Fire up both servers and let me know what UI issues you find! 🚀
