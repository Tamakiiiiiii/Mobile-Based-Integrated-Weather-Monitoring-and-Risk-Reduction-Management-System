# API Setup Instructions

## Required API Keys

Your WeatherGuard app needs the following API keys to function properly:

### 1. Mapbox Access Token

**Get your token:**
1. Go to [https://www.mapbox.com/](https://www.mapbox.com/)
2. Sign up for a free account
3. Go to your account dashboard
4. Copy your "Default public token" or create a new one
5. Free tier includes 50,000 map loads per month

**Add to your app:**
- Open `/components/MapboxFriendTracking.tsx`
- Replace `YOUR_TOKEN_HERE` on line 28 with your actual token
- Open `/components/MapboxStormTracking.tsx`
- Replace `YOUR_TOKEN_HERE` on line 29 with your actual token

Example:
```typescript
const MAPBOX_TOKEN = "pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6ImNsxxxxxxxxxxxxx";
```

### 2. OpenWeatherMap API Key

**Get your API key:**
1. Go to [https://openweathermap.org/api](https://openweathermap.org/api)
2. Sign up for a free account
3. Go to your API keys section
4. Generate a new API key (takes a few minutes to activate)
5. Free tier includes 1,000 API calls per day

**Add to your app:**
- Open `/components/MapboxFriendTracking.tsx`
- Replace `YOUR_OPENWEATHER_API_KEY_HERE` on line 29 with your actual key
- Open `/components/MapboxStormTracking.tsx`
- Replace `YOUR_OPENWEATHER_API_KEY_HERE` on line 30 with your actual key

Example:
```typescript
const OPENWEATHER_API_KEY = "abc123def456ghi789jkl012mno345pq";
```

## Features Enabled by APIs

### Mapbox Features:
- Interactive maps with navigation controls
- Real-time friend location markers
- Weather overlay layers
- Storm tracking visualization
- Satellite imagery
- 3D terrain views

### OpenWeatherMap Features:
- Current weather conditions for any location
- Real-time temperature, humidity, wind speed
- Weather radar and precipitation data
- Storm detection and tracking
- Wind patterns visualization
- Cloud cover data

## Mock Data Fallback

If you don't add API keys immediately, the app will:
- Use mock data for friend locations and weather
- Still display the UI and functionality
- Show placeholder maps and data

However, for a production app with real-time features, you **must** add valid API keys.

## Rate Limits

**Mapbox Free Tier:**
- 50,000 map loads/month
- Unlimited vector tiles
- Sufficient for development and small production apps

**OpenWeatherMap Free Tier:**
- 1,000 API calls/day
- 60 calls/minute
- Current weather, forecasts, and maps
- Good for development and testing

## Security Note

⚠️ **Important:** In a production environment, you should:
1. Store API keys in environment variables
2. Use a backend server to make API calls
3. Never commit API keys to version control
4. Implement rate limiting and caching
5. Consider using Supabase for secure API key management

## Need Help?

- Mapbox Documentation: https://docs.mapbox.com/
- OpenWeatherMap API Docs: https://openweathermap.org/api
- Contact support if you encounter issues with API keys
