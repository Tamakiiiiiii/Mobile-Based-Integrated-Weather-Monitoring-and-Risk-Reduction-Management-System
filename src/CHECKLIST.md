# ✅ Setup Checklist

Complete these steps to get WeatherGuard fully operational:

## 🔑 Step 1: Get API Keys (10 minutes)

### Mapbox
- [ ] Go to https://www.mapbox.com/
- [ ] Create free account
- [ ] Copy your default public token
- [ ] Starts with `pk.ey...`

### OpenWeatherMap
- [ ] Go to https://openweathermap.org/
- [ ] Create free account
- [ ] Generate API key
- [ ] Wait 10 minutes for activation
- [ ] 32-character string

---

## 📝 Step 2: Add Keys to Code (2 minutes)

### File 1: `/components/MapboxFriendTrackingWithBackend.tsx`
- [ ] Open file
- [ ] Line 28: Replace `YOUR_TOKEN_HERE` with Mapbox token
- [ ] Line 29: Replace `YOUR_OPENWEATHER_API_KEY_HERE` with OpenWeather key
- [ ] Save file

### File 2: `/components/MapboxStormTracking.tsx`
- [ ] Open file
- [ ] Line 29: Replace `YOUR_TOKEN_HERE` with Mapbox token
- [ ] Line 30: Replace `YOUR_OPENWEATHER_API_KEY_HERE` with OpenWeather key
- [ ] Save file

---

## 🧪 Step 3: Test the App (5 minutes)

### Basic Tests
- [ ] Refresh the app
- [ ] Go to **Debug tab** (Tab 7)
- [ ] Click "Check All" button
- [ ] Verify all systems show ✅ Ready

### Feature Tests
- [ ] Click "Add Test Friend at Rizal Park"
- [ ] Switch to **Friends tab** (Tab 2)
- [ ] See test friend marker on map
- [ ] Click marker to view weather

### Storm Tracking
- [ ] Go to **Storms tab** (Tab 4)
- [ ] Map should load with weather layers
- [ ] See weather stations (blue dots)
- [ ] Check for any active storms

---

## 🎉 Step 4: Explore Features (10 minutes)

### Weather Dashboard (Tab 1)
- [ ] View current conditions
- [ ] Check temperature and humidity
- [ ] See wind speed and UV index

### Friend Tracking (Tab 2)
- [ ] See friends on interactive map
- [ ] Click markers to fly to location
- [ ] View weather at each location
- [ ] Notice movement indicators

### Forecast (Tab 3)
- [ ] View 24-hour forecast
- [ ] Check 7-day forecast
- [ ] See temperature charts

### Storm Tracking (Tab 4)
- [ ] View weather radar
- [ ] Check precipitation layer
- [ ] See wind patterns
- [ ] Click storm markers

### Emergency (Tab 5 & 6)
- [ ] Check active alerts
- [ ] View safety tips
- [ ] Test SOS button (don't call!)
- [ ] See evacuation centers

### Debug Panel (Tab 7)
- [ ] Run system checks
- [ ] Test backend connection
- [ ] Simulate friend movement
- [ ] View console output

---

## 🔧 Optional: Backend Setup (5 minutes)

Your Supabase backend is already configured! To verify:

### Check Backend
- [ ] Go to Debug tab
- [ ] Click "Check All"
- [ ] Should show "Backend: ✅ Online"

### Test Backend
- [ ] Click "Add Test Friend at Rizal Park"
- [ ] Click "Fetch All Friend Locations"
- [ ] See friend data in console
- [ ] Switch to Friends tab to verify

---

## 📱 Mobile Testing (Optional)

### On Your Phone
- [ ] Open app on mobile device
- [ ] Grant location permissions
- [ ] Go to Friends tab
- [ ] See your location on map
- [ ] Real GPS tracking works!

---

## 🎯 Success Criteria

You're all set when:
- ✅ Maps load without errors
- ✅ Weather data displays
- ✅ Friend markers appear
- ✅ Storm tracking works
- ✅ Backend is connected
- ✅ Debug panel shows all green

---

## ⚠️ Troubleshooting

### Maps are blank
→ Check Mapbox token is correct  
→ Look in browser console for errors

### Weather not loading
→ Verify OpenWeather key  
→ Wait 10 minutes after creating key  
→ Check API key hasn't expired

### Backend errors
→ Supabase should work out of box  
→ Check Debug panel status  
→ Look at console for error messages

### Still stuck?
→ See `/TESTING.md` for detailed help  
→ Check `/DEVELOPER_GUIDE.md` for solutions

---

## 📚 What to Read Next

After setup:
1. **README.md** - Full feature overview
2. **TESTING.md** - Test all features
3. **DEVELOPER_GUIDE.md** - Add new features

---

## 🎊 You're Ready!

Everything checked off? Congratulations! 🎉

Your WeatherGuard app is now:
- 🗺️ Tracking friends in real-time
- 🌤️ Showing live weather data
- 🌪️ Detecting storms automatically
- 📡 Syncing across devices
- 🆘 Ready for emergencies

**Enjoy your weather tracking app!**

---

**Questions?** Check the docs or test with the Debug Panel!
