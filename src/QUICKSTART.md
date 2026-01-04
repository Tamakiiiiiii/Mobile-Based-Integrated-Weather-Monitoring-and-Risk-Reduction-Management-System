# ⚡ Quick Start - API Keys Setup

## 🔑 Get Your API Keys (5 minutes)

### 1️⃣ Mapbox Token
```
URL: https://account.mapbox.com/
1. Sign up (free)
2. Go to "Access tokens"
3. Copy your "Default public token"
```

### 2️⃣ OpenWeatherMap Key
```
URL: https://home.openweathermap.org/api_keys
1. Sign up (free)
2. Generate API key
3. Wait 10 minutes for activation
```

---

## 📝 Add Keys to Your App

### File 1: `/components/MapboxFriendTrackingWithBackend.tsx`

**Line 28 & 29:**
```typescript
const MAPBOX_TOKEN = "pk.ey...YOUR_MAPBOX_TOKEN";
const OPENWEATHER_API_KEY = "abc123...YOUR_OWM_KEY";
```

### File 2: `/components/MapboxStormTracking.tsx`

**Line 29 & 30:**
```typescript
const MAPBOX_TOKEN = "pk.ey...YOUR_MAPBOX_TOKEN";
const OPENWEATHER_API_KEY = "abc123...YOUR_OWM_KEY";
```

---

## ✅ Verify Setup

1. Save both files
2. Refresh the app
3. Click "Friends" tab → Map should load
4. Click "Storms" tab → Map should load

---

## 🎉 You're Done!

**Without keys**: App shows mock data  
**With keys**: Full real-time weather tracking! 

**Need help?** Check `/API_SETUP.md` for detailed instructions.

---

## 🔒 Security Reminder

⚠️ These are **public tokens** for client-side use.  
For production, use environment variables and a backend proxy.

---

## 📊 Free Tier Limits

**Mapbox**: 50,000 map loads/month  
**OpenWeather**: 1,000 API calls/day

Plenty for development and testing! 🚀
