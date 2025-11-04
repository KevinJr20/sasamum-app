# SasaMum App - Implementation Plan

## ✅ Completed Tasks

### 1. Mental Wellness Page Updates ✅
- [x] Changed "Ubuntu Sister Support" to "MamaCare Sister Support"
- [x] Linked MamaCare button to open chat
- [x] Changed "Ubuntu Breathing" to "SasaMum Breathing"
- [x] Updated quote to Swahili reaffirmation: "Wewe ni mama mwenye nguvu, mwenye huruma, na mwenye upendo"
- [x] Made Healthcare Provider button green with click-to-call functionality
- [x] Added onNavigateToChat prop to MentalHealthCheck component
- [x] Connected to App.tsx navigation

## 🔄 In Progress / Remaining Tasks

### 2. Sticky Navbar Implementation
**Status:** Need to apply to all pages

**Reference Implementation** (PregnancyBuddySystem & WearablesIntegration):
```tsx
<div className="sticky top-0 z-40 flex items-center justify-between p-4 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
  <Button variant="ghost" size="sm" onClick={onBack}>
    <ArrowLeft className="w-6 h-6" />
  </Button>
  <h1 className="text-lg">Page Title</h1>
  <Button variant="ghost" size="sm">
    <Icon className="w-6 h-6" />
  </Button>
</div>
```

**Pages that need sticky navbar:**
- [ ] Dashboard (has sticky, verify all buttons work)
- [ ] Calendar (has sticky, verify all buttons work)
- [ ] Chat (has sticky, verify all buttons work)
- [ ] Profile (has sticky, verify all buttons work)
- [ ] All other pages with navigation

### 3. Wearables & Sync Page Enhancement
**Current State:** Basic implementation exists
**Needed Enhancements:**
- [ ] Make highly interactive (add more controls)
- [ ] Show all manipulable features
- [ ] Better smart device connection UI
- [ ] Add device pairing flow
- [ ] Show device list (Fitbit, Apple Watch, Samsung, etc.)
- [ ] Real-time sync indicators
- [ ] Historical data charts
- [ ] Export data functionality
- [ ] Integration with pregnancy metrics

### 4. Medications Page Enhancement
**Needed Features:**
- [ ] Edit medication entries
- [ ] Edit appointment entries
- [ ] Edit provider entries
- [ ] More appealing UI design
- [ ] Medication reminders management
- [ ] Dosage tracking
- [ ] Side effects logging
- [ ] Refill reminders

### 5. SasaMum AI Improvements
**Freeze Background:**
- [ ] Add `overflow-hidden` to body when AI is open
- [ ] Make only AI modal scrollable
- [ ] Prevent background interaction

**Screen Overview Feature:**
- [ ] Detect current screen
- [ ] Generate context-aware responses
- [ ] Examples:
  - "What's on this screen?" → Explain Dashboard features
  - "Help me understand this" → Contextual help

### 6. GPS Optimization
**Pages Needing GPS:**
- [ ] Emergency Transport
- [ ] Hospitals Map
- [ ] Childcare Services

**Features to Add:**
- [ ] Request geolocation permission
- [ ] Show accuracy indicator
- [ ] Allow manual location input
- [ ] Location caching
- [ ] Nearby services based on GPS

### 7. Hospitals Map Enhancements
**Needed Features:**
- [ ] Green call buttons (like EmergencyTransport)
- [ ] Interactive map with markers
- [ ] My Location button
- [ ] Map view options (Satellite, Terrain, Traffic)
- [ ] Navigation integration
- [ ] Distance calculation
- [ ] Hospital details popup
- [ ] Filter by services (Maternity, NICU, Emergency)

**Map Implementation Options:**
- Option A: Google Maps API
- Option B: Mapbox
- Option C: Leaflet (OpenStreetMap)

### 8. AI Risk Prediction Enhancement
**Current State:** Basic risk calculator
**Needed Improvements:**
- [ ] More comprehensive risk factors
- [ ] Better risk scoring algorithm
- [ ] Detailed risk breakdown
- [ ] Personalized recommendations
- [ ] When to seek help indicators
- [ ] Provider notification for high risk
- [ ] Historical risk tracking
- [ ] Educational content per risk level

## 📋 Technical Implementation Notes

### Sticky Navbar Pattern
Use this pattern consistently:
```tsx
className="sticky top-0 z-40 flex items-center justify-between p-4 bg-card/95 backdrop-blur-md border-b border-border shadow-sm"
```

### GPS Implementation
```javascript
navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude } = position.coords;
    setUserLocation({ lat: latitude, lng: longitude });
  },
  (error) => {
    console.error('GPS error:', error);
    // Fallback to city selection
  },
  { enableHighAccuracy: true, timeout: 5000 }
);
```

### Freeze Background (AI Modal)
```javascript
// When AI opens:
document.body.style.overflow = 'hidden';

// When AI closes:
document.body.style.overflow = 'auto';
```

### Screen Context Detection
```javascript
const getScreenContext = (currentScreen: string) => {
  switch (currentScreen) {
    case 'dashboard':
      return 'You are on the Dashboard. Here you can see your pregnancy overview, week progress, baby development, and quick access to important features.';
    case 'calendar':
      return 'You are on the Calendar page. Track appointments, add notes about your pregnancy journey, and view important dates.';
    // ... etc
  }
};
```

## 🎯 Priority Order

### High Priority (Complete First)
1. ✅ Mental Wellness updates
2. Sticky navbar on all pages
3. SasaMum AI background freeze
4. Hospitals map with green call buttons

### Medium Priority
5. Wearables enhancement
6. Medications edit functionality
7. GPS optimization

### Lower Priority (Nice to Have)
8. AI screen overview
9. Advanced AI risk prediction
10. Additional wearables features

## 🔍 Testing Checklist

### For Each Page:
- [ ] Sticky header stays visible on scroll
- [ ] Back button works correctly
- [ ] Action buttons are functional
- [ ] Responsive on mobile/tablet/desktop
- [ ] Dark mode works properly
- [ ] Scroll-to-top on page load
- [ ] Content doesn't overlap with navbar
- [ ] Bottom navigation doesn't block content

### For Hospitals/Transport:
- [ ] Green call buttons trigger phone calls
- [ ] GPS location is accurate
- [ ] Map loads correctly
- [ ] Markers show correct locations
- [ ] Directions open properly

### For AI:
- [ ] Background freezes when open
- [ ] Modal is scrollable
- [ ] Close button works
- [ ] Screen context is accurate
- [ ] Responses are relevant

## 📝 Notes

- All call buttons should use `window.location.href = 'tel:phone_number'`
- GPS accuracy can be improved with `enableHighAccuracy: true`
- Map APIs require API keys - need to decide which service to use
- Sticky navbar z-index should be 40 (AI modal is 50)
- Background freeze is critical for UX on AI modal

## 🚀 Next Steps

1. Complete sticky navbar implementation on all pages
2. Implement background freeze for AI
3. Update hospitals map with interactive features
4. Enhance wearables page
5. Add edit functionality to medications
6. Optimize GPS accuracy
7. Implement AI screen context awareness
8. Enhance risk prediction algorithm

---

**Last Updated:** [Current Date]
**Status:** In Progress
