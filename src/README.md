# WeatherGuard - Complete Setup Guide

## Overview

WeatherGuard is a mobile weather advisory app with:
- **Real-time weather tracking** using OpenWeatherMap API
- **Friend location tracking** with Life360-style features using Mapbox
- **Live storm tracking** with precipitation, wind, and cloud layers
- **Emergency alerts** and SOS functionality
- **Supabase backend integration** for real-time data sync across devices

## 🚀 Quick Setup

### Step 1: Get API Keys

#### Mapbox Access Token (Required)
1. Sign up at [https://www.mapbox.com/](https://www.mapbox.com/)
2. Get your default public token from the dashboard
3. Free tier: 50,000 map loads/month

#### OpenWeatherMap API Key (Required)
1. Sign up at [https://openweathermap.org/api](https://openweathermap.org/api)
2. Generate an API key (takes a few minutes to activate)
3. Free tier: 1,000 calls/day

### Step 2: Add Your API Keys

Update these files with your API keys:

**File: `/components/MapboxFriendTrackingWithBackend.tsx`**
```typescript
// Line 28
const MAPBOX_TOKEN = "pk.YOUR_ACTUAL_TOKEN_HERE";

// Line 29
const OPENWEATHER_API_KEY = "YOUR_ACTUAL_API_KEY_HERE";
```

**File: `/components/MapboxStormTracking.tsx`**
```typescript
// Line 29
const MAPBOX_TOKEN = "pk.YOUR_ACTUAL_TOKEN_HERE";

// Line 30
const OPENWEATHER_API_KEY = "YOUR_ACTUAL_API_KEY_HERE";
```

### Step 3: Run the App

The app will work immediately with the API keys. Supabase backend is optional but recommended for real-time features.

## 🗺️ Features Breakdown

### 1. Friend Tracking Map
- **Interactive Mapbox map** showing all friend locations
- **Real-time weather overlays** (temperature, precipitation)
- **Friend markers** with status indicators (online/away/offline)
- **Movement tracking** with speed and direction arrows
- **Weather data** for each friend's location
- **Click to fly** to any friend's location
- **Auto-refresh** every 30 seconds

### 2. Storm Tracking Map
- **Live weather radar** with precipitation layer
- **Wind patterns** visualization
- **Cloud cover** overlay
- **Storm detection** based on wind speeds
- **Weather station network** across the Philippines
- **Interactive markers** with detailed storm info
- **Auto-updates** every 10 minutes

### 3. Backend Integration (Optional but Recommended)

The app includes a Supabase backend for:
- Real-time friend location sync across devices
- Persistent weather data storage
- Storm tracking history
- Cross-device synchronization

## 🔧 Backend Setup (Optional)

Your Supabase backend is already configured! The app will automatically:
1. Check if backend is available
2. Sync friend locations to the database
3. Fetch updates from other devices
4. Store weather and storm data

### Backend API Endpoints

```
GET  /make-server-aedf23c8/health
GET  /make-server-aedf23c8/friends/locations
POST /make-server-aedf23c8/friends/location
GET  /make-server-aedf23c8/friends/location/:friendId
DEL  /make-server-aedf23c8/friends/location/:friendId
GET  /make-server-aedf23c8/friends/weather/:friendId
POST /make-server-aedf23c8/friends/weather
GET  /make-server-aedf23c8/storms/active
POST /make-server-aedf23c8/storms
```

### How It Works

The app checks backend connection on load:
- **If connected**: Syncs friend locations and weather in real-time
- **If not connected**: Uses local data with live weather API

You'll see a status indicator:
- Green "Live" badge = Backend connected
- Info alert = Using local data

## 📱 App Navigation

### Bottom Tab Bar:
1. **Weather** - Current conditions dashboard
2. **Friends** - Live location & weather tracking
3. **Forecast** - 24-hour and weekly forecasts
4. **Storms** - Real-time storm tracking
5. **Alerts** - Emergency notifications
6. **SOS** - Emergency contact button

## 🎯 Using Friend Tracking

### Adding Friends
Currently uses demo data. With backend enabled, you can:
1. Click the "+" button to add friends
2. Friends can share their GPS location
3. See real-time updates as friends move
4. View weather at each friend's location

### Location Sharing
The backend stores:
- Latitude & longitude
- Last seen timestamp
- Movement speed & direction
- Real-time weather data

### Life360-Style Features
- Status indicators (online/away/offline)
- Last seen timestamps
- Movement visualization with arrows
- Location history (with backend)
- Weather at each location

## 🌪️ Storm Tracking Features

### Real-Time Data Sources
- **OpenWeatherMap**: Weather conditions, wind speeds
- **Weather Stations**: 8 stations across Philippines
- **Satellite Layers**: Precipitation, wind, clouds

### Storm Detection
Automatic storm categorization:
- **60-88 km/h**: Tropical Storm
- **88-118 km/h**: Severe Tropical Storm  
- **118+ km/h**: Typhoon

### Visual Indicators
- **Red markers**: High severity storms
- **Yellow markers**: Medium severity
- **Blue dots**: Weather stations
- **Pulsing animation**: Active systems

## 🔐 Security Notes

⚠️ **Important for Production:**

1. **API Keys**: Never commit real API keys to version control
2. **Environment Variables**: Use `.env` files for production
3. **Backend Proxy**: Make API calls from server, not client
4. **Rate Limiting**: Implement caching to avoid API limits
5. **Location Data**: Requires user consent and privacy policy

⚠️ **Privacy Warning**: This prototype collects location data. For production:
- Obtain explicit user consent
- Implement data encryption
- Add privacy policy
- Follow GDPR/local regulations
- Consider Figma Make is not designed for PII in production

## 🐛 Troubleshooting

### Maps not loading?
- Check your Mapbox token is correct
- Ensure token is activated in Mapbox dashboard
- Check browser console for errors

### Weather data not updating?
- Verify OpenWeatherMap API key
- Wait a few minutes for key activation
- Check daily API limit (1,000 calls)

### Backend not connecting?
- Check Supabase project is deployed
- Verify `/supabase/functions/server/index.tsx` is deployed
- Check browser console for error messages

### Storm data not showing?
- This is normal if no storms are active
- API checks for winds > 60 km/h
- System will show "No active storms" when clear

## 📊 API Rate Limits

### Mapbox Free Tier
- 50,000 map loads per month
- Sufficient for development
- Upgrade for production use

### OpenWeatherMap Free Tier
- 1,000 API calls per day
- 60 calls per minute
- Implement caching for production

### Optimization Tips
1. Cache weather data (5-10 minutes)
2. Batch location updates
3. Use CDN for static assets
4. Implement request debouncing

## 🚀 Next Steps

### Enhancements You Could Add:
- [ ] User authentication and profiles
- [ ] Friend circles and groups
- [ ] Location history and heatmaps
- [ ] Push notifications for storms
- [ ] Offline mode with cached data
- [ ] Custom alert zones
- [ ] Share location via SMS/links
- [ ] Export weather reports

### Backend Expansion:
- [ ] Friend request system
- [ ] Location sharing permissions
- [ ] Historical weather data
- [ ] Storm path predictions
- [ ] Group chat integration

## 📚 Documentation Links

- [Mapbox GL JS Docs](https://docs.mapbox.com/mapbox-gl-js/)
- [OpenWeatherMap API Docs](https://openweathermap.org/api)
- [Supabase Docs](https://supabase.com/docs)
- [React Hooks](https://react.dev/reference/react)

## 🎨 Customization

### Map Styles
Change Mapbox style in components:
```typescript
style: "mapbox://styles/mapbox/streets-v12"
// Options: streets-v12, dark-v11, light-v11, satellite-v9
```

### Weather Layers
Toggle layers in OpenWeatherMap:
- Temperature: `temp_new`
- Precipitation: `precipitation_new`
- Wind: `wind_new`
- Clouds: `clouds_new`

### Update Intervals
Modify refresh rates:
```typescript
// Weather: every 5 minutes (currently)
const weatherInterval = setInterval(updateAllWeather, 5 * 60 * 1000);

// Locations: every 30 seconds (currently)
const locationInterval = setInterval(fetchLocations, 30000);
```

## 💡 Tips for Production

1. **Implement Caching**: Reduce API calls with Redis/local storage
2. **Add Authentication**: Secure friend relationships
3. **Use WebSockets**: Real-time updates without polling
4. **Add Analytics**: Track usage and optimize
5. **Error Boundaries**: Graceful error handling
6. **Loading States**: Better user experience
7. **Offline Support**: Service workers for PWA
8. **Compression**: Reduce bundle size

## 🆘 Support

For issues:
1. Check API_SETUP.md for detailed API instructions
2. Review browser console for errors
3. Verify all API keys are correctly added
4. Check Supabase logs for backend issues

---

**Built with:** React, TypeScript, Mapbox GL JS, OpenWeatherMap API, Supabase, Tailwind CSS

**Mobile-First Design** - Optimized for smartphones and tablets
