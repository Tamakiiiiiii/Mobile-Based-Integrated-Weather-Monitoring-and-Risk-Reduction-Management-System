# Testing Your WeatherGuard App

## 🧪 Quick Tests You Can Run

### Test 1: Check Backend Connection

Open browser console (F12) and run:

```javascript
// Check if backend is alive
fetch('https://bmaixhphttpjoktleafr.supabase.co/functions/v1/make-server-aedf23c8/health')
  .then(r => r.json())
  .then(data => console.log('Backend status:', data))
  .catch(err => console.error('Backend offline:', err));
```

Expected output: `{ status: "ok" }`

---

### Test 2: Add a Test Friend Location

```javascript
// Add a friend at Rizal Park, Manila
fetch('https://bmaixhphttpjoktleafr.supabase.co/functions/v1/make-server-aedf23c8/friends/location', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtYWl4aHBodHRwam9rdGxlYWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1MTc0ODcsImV4cCI6MjA4MzA5MzQ4N30.Ba_1jLQnxn5obgIB7v6osX8ssYeNsCWuRDVxtdrWwN8'
  },
  body: JSON.stringify({
    friendId: 'test_user_1',
    latitude: 14.5833,
    longitude: 120.9833,
    location: 'Rizal Park, Manila',
    heading: 90,
    speed: 0
  })
})
.then(r => r.json())
.then(data => console.log('Location added:', data));
```

Then refresh the Friends tab to see the new marker!

---

### Test 3: Fetch All Friend Locations

```javascript
fetch('https://bmaixhphttpjoktleafr.supabase.co/functions/v1/make-server-aedf23c8/friends/locations', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtYWl4aHBodHRwam9rdGxlYWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1MTc0ODcsImV4cCI6MjA4MzA5MzQ4N30.Ba_1jLQnxn5obgIB7v6osX8ssYeNsCWuRDVxtdrWwN8'
  }
})
.then(r => r.json())
.then(data => console.log('All friends:', data));
```

---

### Test 4: Simulate Movement (Advanced)

Add this to a React component:

```typescript
import { simulateFriendMovement } from './utils/locationHelpers';

// Button click handler
const simulateJourney = async () => {
  console.log('🚗 Starting simulated journey...');
  
  // Simulate moving from Manila to Quezon City (takes 60 seconds)
  await simulateFriendMovement(
    'traveler_1',
    14.5833, 120.9833,  // Rizal Park, Manila
    14.6760, 121.0437,  // Quezon Memorial Circle
    60                   // 60 seconds
  );
  
  console.log('✅ Journey complete!');
};
```

Watch the marker move in real-time on the map!

---

### Test 5: Real GPS Tracking (Mobile)

Add this button to test real GPS:

```typescript
import { startLocationSharing, stopLocationSharing } from './utils/locationHelpers';

const [watchId, setWatchId] = useState<number>(-1);

const toggleSharing = () => {
  if (watchId === -1) {
    // Start sharing
    const id = startLocationSharing('my_user_id', (lat, lon) => {
      console.log('📍 My location:', lat, lon);
    });
    setWatchId(id);
  } else {
    // Stop sharing
    stopLocationSharing(watchId);
    setWatchId(-1);
  }
};

return (
  <button onClick={toggleSharing}>
    {watchId === -1 ? 'Start Sharing Location' : 'Stop Sharing'}
  </button>
);
```

**Note**: Requires HTTPS and location permissions!

---

## 🗺️ Interactive Map Testing

### Add Custom Markers

In the Friends tab, you can:
- Click any friend marker to see their details
- View weather at their location
- See movement indicators (arrows) if they're moving
- Click the map to fly to different areas

### Test Weather Layers

The map includes:
- **Temperature layer** (colored overlay)
- **Real-time friend locations** (colored circles)
- **Weather data popups** (click markers)

### Navigation Controls

- **Zoom**: Mouse wheel or +/- buttons
- **Pan**: Click and drag
- **Rotate**: Right-click and drag
- **Tilt**: Ctrl + drag
- **Compass**: Click to reset north

---

## 🌪️ Storm Tracking Testing

In the Storms tab:

1. **Check for Active Storms**
   - If winds > 60 km/h detected, storms appear
   - Red markers = High severity
   - Yellow markers = Medium severity

2. **View Weather Stations**
   - Blue dots = Weather stations
   - Click for current conditions
   - 8 stations across Philippines

3. **Weather Layers**
   - Precipitation (rain intensity)
   - Wind patterns
   - Cloud cover

---

## 📊 Expected Behavior

### With API Keys:
✅ Interactive maps load  
✅ Weather data is real and current  
✅ Storm detection works automatically  
✅ Friend locations show actual weather  

### Without API Keys:
⚠️ Mock maps displayed  
⚠️ Sample weather data shown  
⚠️ Limited functionality  

---

## 🐛 Troubleshooting Commands

### Check if Mapbox token is valid:
```javascript
console.log('Mapbox token:', 'pk.ey...' === 'YOUR_TOKEN_HERE' ? 
  '❌ NOT SET' : '✅ Set');
```

### Check if OpenWeather key is valid:
```javascript
fetch('https://api.openweathermap.org/data/2.5/weather?q=Manila&appid=YOUR_KEY')
  .then(r => r.ok ? console.log('✅ Weather API working') : console.log('❌ Invalid key'))
  .catch(() => console.log('❌ API error'));
```

### Test Supabase connection:
```javascript
fetch('https://bmaixhphttpjoktleafr.supabase.co/functions/v1/make-server-aedf23c8/health')
  .then(r => r.ok ? console.log('✅ Backend online') : console.log('❌ Backend error'))
  .catch(() => console.log('❌ Cannot reach backend'));
```

---

## 📱 Mobile Testing

For best results, test on:
- ✅ iPhone/Android with GPS enabled
- ✅ Chrome/Safari (latest versions)
- ✅ HTTPS connection (required for GPS)
- ✅ Location permissions granted

---

## 🎯 Feature Checklist

Test each feature:
- [ ] Maps render properly
- [ ] Friend markers appear
- [ ] Weather data loads
- [ ] Storm detection works
- [ ] Backend syncs data
- [ ] Location updates in real-time
- [ ] Popups show information
- [ ] Refresh button works
- [ ] Navigation controls responsive
- [ ] Mobile-friendly UI

---

## 💡 Pro Tips

1. **Use Browser DevTools** (F12) to monitor:
   - Network requests
   - Console errors
   - API responses

2. **Test Incrementally**:
   - First: Get maps working (API keys)
   - Second: Test backend (health check)
   - Third: Add friends (POST locations)
   - Fourth: Test real GPS (mobile)

3. **Monitor Rate Limits**:
   - Mapbox: 50k loads/month
   - OpenWeather: 1k calls/day
   - Cache data to avoid limits!

---

## 🆘 Common Issues

**Maps blank?** → Check Mapbox token  
**Weather not loading?** → Check OpenWeather key  
**Backend errors?** → Check Supabase deployment  
**GPS not working?** → Need HTTPS + permissions  

See `/DEVELOPER_GUIDE.md` for detailed troubleshooting!

---

Happy Testing! 🚀
