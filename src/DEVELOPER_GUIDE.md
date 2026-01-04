# Developer Guide

## Architecture Overview

```
WeatherGuard App
├── Frontend (React + TypeScript)
│   ├── Components
│   │   ├── MapboxFriendTrackingWithBackend.tsx  (Main friend tracking)
│   │   ├── MapboxStormTracking.tsx              (Storm visualization)
│   │   ├── WeatherDashboard.tsx                 (Current weather)
│   │   ├── WeatherForecast.tsx                  (Forecasts)
│   │   ├── EmergencyAlerts.tsx                  (Alerts)
│   │   └── SOSButton.tsx                        (Emergency)
│   └── Utils
│       └── locationHelpers.tsx                  (GPS & location utils)
│
├── Backend (Supabase Edge Functions)
│   └── /supabase/functions/server/
│       ├── index.tsx                            (API routes)
│       └── kv_store.tsx                         (Database wrapper)
│
└── External APIs
    ├── Mapbox GL JS                             (Maps)
    ├── OpenWeatherMap                           (Weather data)
    └── Nominatim                                (Geocoding)
```

## Component Structure

### MapboxFriendTrackingWithBackend

**Purpose**: Main component for friend location tracking with weather overlay

**Key Features**:
- Mapbox GL JS integration
- Real-time location markers
- Weather overlay layers
- Backend synchronization
- Automatic refresh (30s intervals)

**State Management**:
```typescript
- friends: Friend[]              // All friend data
- selectedFriend: Friend | null  // Currently selected friend
- loading: boolean               // Map initialization
- weatherLoading: boolean        // Weather API calls
- backendConnected: boolean      // Backend status
```

**Data Flow**:
1. Component mounts → Check backend connection
2. Fetch friend locations from backend OR use local data
3. For each friend → Fetch weather from OpenWeatherMap
4. Render map with markers
5. Poll for updates every 30 seconds

### MapboxStormTracking

**Purpose**: Real-time storm tracking with weather radar

**Key Features**:
- Dark theme Mapbox map
- Precipitation/wind/cloud layers
- Storm detection algorithm
- Weather station network
- Automatic updates (10 min intervals)

**Storm Detection Logic**:
```typescript
Wind Speed → Category
60-88 km/h  → Tropical Storm
88-118 km/h → Severe Tropical Storm
118+ km/h   → Typhoon
```

**Data Sources**:
- OpenWeatherMap weather API (5 checkpoints around Philippines)
- Weather station network (8 locations)
- Real-time radar tiles

## Backend API Reference

### Friend Location Endpoints

#### GET `/friends/locations`
Fetch all friend locations
```typescript
Response: {
  friends: Array<{
    friendId: string;
    latitude: number;
    longitude: number;
    location: string;
    heading: number;
    speed: number;
    timestamp: string;
    lastSeen: string;
  }>
}
```

#### POST `/friends/location`
Update a friend's location
```typescript
Request: {
  friendId: string;
  latitude: number;
  longitude: number;
  location?: string;
  heading?: number;
  speed?: number;
}

Response: {
  success: boolean;
  data: LocationData;
}
```

#### GET `/friends/location/:friendId`
Get specific friend's location
```typescript
Response: {
  location: LocationData;
}
```

### Weather Endpoints

#### POST `/friends/weather`
Update weather data for a friend
```typescript
Request: {
  friendId: string;
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}
```

### Storm Endpoints

#### GET `/storms/active`
Fetch all active storms
```typescript
Response: {
  storms: Array<StormData>;
}
```

#### POST `/storms`
Update storm data
```typescript
Request: {
  stormId: string;
  name: string;
  category: string;
  windSpeed: number;
  location: { lat, lon, area };
  pressure: number;
  warnings: string[];
  severity: "high" | "medium" | "low";
}
```

## Location Helpers API

### Basic Location Updates

```typescript
import { updateFriendLocation } from "../utils/locationHelpers";

// Update a friend's location
await updateFriendLocation({
  friendId: "user123",
  latitude: 14.5995,
  longitude: 120.9842,
  location: "Manila",
  heading: 180,
  speed: 30
});
```

### Real-time GPS Tracking

```typescript
import { startLocationSharing, stopLocationSharing } from "../utils/locationHelpers";

// Start sharing your location
const watchId = startLocationSharing(
  "myUserId",
  (lat, lon) => {
    console.log("Location updated:", lat, lon);
  }
);

// Stop sharing
stopLocationSharing(watchId);
```

### Simulate Movement (Testing)

```typescript
import { simulateFriendMovement } from "../utils/locationHelpers";

// Simulate a friend moving from point A to B
await simulateFriendMovement(
  "friend123",
  14.5995, 120.9842,  // Start: Manila
  14.6760, 121.0437,  // End: Quezon City
  60                   // Duration: 60 seconds
);
```

### Get Current Location

```typescript
import { getCurrentLocation } from "../utils/locationHelpers";

try {
  const position = await getCurrentLocation();
  const { latitude, longitude } = position.coords;
  console.log("Current location:", latitude, longitude);
} catch (error) {
  console.error("Location access denied:", error);
}
```

### Reverse Geocoding

```typescript
import { reverseGeocode } from "../utils/locationHelpers";

const locationName = await reverseGeocode(14.5995, 120.9842);
console.log("Location name:", locationName); // "Manila"
```

### Distance Calculation

```typescript
import { calculateDistance, formatDistance } from "../utils/locationHelpers";

const distance = calculateDistance(
  14.5995, 120.9842,  // Manila
  14.6760, 121.0437   // Quezon City
);

console.log(formatDistance(distance)); // "8.5 km"
```

## Adding New Features

### Example: Add Friend Request System

1. **Create Backend Endpoint**

```typescript
// In /supabase/functions/server/index.tsx

app.post("/make-server-aedf23c8/friends/request", async (c) => {
  const { fromUserId, toUserId } = await c.req.json();
  
  await kv.set(`friend_request:${fromUserId}:${toUserId}`, {
    status: "pending",
    timestamp: new Date().toISOString()
  });
  
  return c.json({ success: true });
});

app.post("/make-server-aedf23c8/friends/accept", async (c) => {
  const { fromUserId, toUserId } = await c.req.json();
  
  // Update request status
  await kv.set(`friend_request:${fromUserId}:${toUserId}`, {
    status: "accepted",
    timestamp: new Date().toISOString()
  });
  
  // Add to friends list
  await kv.set(`friends:${fromUserId}:${toUserId}`, true);
  await kv.set(`friends:${toUserId}:${fromUserId}`, true);
  
  return c.json({ success: true });
});
```

2. **Create Frontend Component**

```typescript
// In /components/FriendRequests.tsx

export function FriendRequests() {
  const [requests, setRequests] = useState([]);
  
  const acceptRequest = async (fromUserId: string) => {
    await fetch(`${serverUrl}/friends/accept`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({
        fromUserId,
        toUserId: currentUserId
      })
    });
    
    // Refresh requests
    fetchRequests();
  };
  
  // ... component UI
}
```

### Example: Add Location History

1. **Backend Storage**

```typescript
app.post("/make-server-aedf23c8/location/history", async (c) => {
  const { friendId, latitude, longitude } = await c.req.json();
  
  const timestamp = Date.now();
  const historyKey = `location_history:${friendId}:${timestamp}`;
  
  await kv.set(historyKey, {
    latitude,
    longitude,
    timestamp: new Date().toISOString()
  });
  
  return c.json({ success: true });
});

app.get("/make-server-aedf23c8/location/history/:friendId", async (c) => {
  const friendId = c.req.param("friendId");
  const history = await kv.getByPrefix(`location_history:${friendId}:`);
  
  return c.json({ history });
});
```

2. **Render History on Map**

```typescript
// Add path line to Mapbox
useEffect(() => {
  if (!map.current || !locationHistory.length) return;
  
  map.current.addSource('route', {
    type: 'geojson',
    data: {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: locationHistory.map(h => [h.longitude, h.latitude])
      }
    }
  });
  
  map.current.addLayer({
    id: 'route',
    type: 'line',
    source: 'route',
    paint: {
      'line-color': '#3b82f6',
      'line-width': 3
    }
  });
}, [locationHistory]);
```

## Testing Guide

### Unit Testing Location Helpers

```typescript
import { testFriendTracking } from "../utils/locationHelpers";

// Run comprehensive test suite
await testFriendTracking();
```

### Manual Testing Checklist

**Friend Tracking:**
- [ ] Map loads with all friends
- [ ] Markers show correct colors (online/away/offline)
- [ ] Clicking marker opens popup
- [ ] Weather data displays for each friend
- [ ] Backend sync indicator shows status
- [ ] Refresh button updates data

**Storm Tracking:**
- [ ] Map loads with weather layers
- [ ] Storm markers appear for high winds
- [ ] Weather stations display data
- [ ] Clicking markers shows details
- [ ] Auto-refresh works (10 min)
- [ ] "No storms" message when clear

**Backend Integration:**
- [ ] Health check endpoint responds
- [ ] Friend locations sync to database
- [ ] Weather data persists
- [ ] Cross-device sync works
- [ ] Error handling shows alerts

### Browser Console Testing

```javascript
// Test backend connection
fetch('https://YOUR_PROJECT.supabase.co/functions/v1/make-server-aedf23c8/health')
  .then(r => r.json())
  .then(console.log);

// Test location update
fetch('https://YOUR_PROJECT.supabase.co/functions/v1/make-server-aedf23c8/friends/location', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ANON_KEY'
  },
  body: JSON.stringify({
    friendId: 'test123',
    latitude: 14.5995,
    longitude: 120.9842
  })
}).then(r => r.json()).then(console.log);
```

## Performance Optimization

### Caching Strategy

```typescript
// Cache weather data for 5 minutes
const WEATHER_CACHE_DURATION = 5 * 60 * 1000;
const weatherCache = new Map<string, { data: any; timestamp: number }>();

const fetchWeatherCached = async (lat: number, lon: number) => {
  const key = `${lat},${lon}`;
  const cached = weatherCache.get(key);
  
  if (cached && Date.now() - cached.timestamp < WEATHER_CACHE_DURATION) {
    return cached.data;
  }
  
  const data = await fetchWeatherData(lat, lon);
  weatherCache.set(key, { data, timestamp: Date.now() });
  
  return data;
};
```

### Debounce Location Updates

```typescript
import { debounce } from "lodash";

const debouncedLocationUpdate = debounce(async (location) => {
  await updateFriendLocation(location);
}, 5000); // Update max once per 5 seconds
```

### Batch API Calls

```typescript
// Update multiple friends at once
const batchUpdateLocations = async (friends: Friend[]) => {
  const updates = friends.map(f => 
    updateFriendLocation({
      friendId: f.id,
      latitude: f.latitude,
      longitude: f.longitude
    })
  );
  
  await Promise.all(updates);
};
```

## Deployment Checklist

### Pre-Deployment
- [ ] Add all API keys to production environment
- [ ] Test on multiple devices/browsers
- [ ] Verify all endpoints work
- [ ] Check error handling
- [ ] Test offline behavior
- [ ] Review security (CORS, API keys)

### Production Configuration
- [ ] Use environment variables for keys
- [ ] Enable HTTPS only
- [ ] Set up CDN for assets
- [ ] Configure rate limiting
- [ ] Add monitoring/analytics
- [ ] Implement error tracking (Sentry)

### Post-Deployment
- [ ] Monitor API usage
- [ ] Check server logs
- [ ] Test real-time sync
- [ ] Verify GPS accuracy
- [ ] Monitor performance metrics

## Common Issues & Solutions

### Issue: Maps not rendering
**Solution**: 
- Check Mapbox token is correct
- Ensure `mapbox-gl.css` is imported
- Check browser console for WebGL errors

### Issue: Weather data not updating
**Solution**:
- Verify OpenWeatherMap API key
- Check API rate limits
- Ensure coordinates are valid
- Look for CORS errors

### Issue: Backend not syncing
**Solution**:
- Check Supabase project is deployed
- Verify Edge Function is running
- Check CORS headers
- Test with curl/Postman

### Issue: GPS not working
**Solution**:
- Ensure HTTPS (required for geolocation)
- Check browser permissions
- Test on actual device (not simulator)
- Add error handling for denied permissions

## Resources

- [Mapbox GL JS Examples](https://docs.mapbox.com/mapbox-gl-js/example/)
- [OpenWeatherMap API Docs](https://openweathermap.org/api)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Geolocation API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)

## Contributing

When adding features:
1. Follow TypeScript strict mode
2. Add proper error handling
3. Include loading states
4. Document new API endpoints
5. Update README with new features
6. Test on mobile devices

---

**Happy Coding!** 🚀
