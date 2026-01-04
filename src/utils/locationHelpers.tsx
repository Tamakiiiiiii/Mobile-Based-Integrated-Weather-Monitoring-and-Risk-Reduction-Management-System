// Helper utilities for testing and simulating friend location updates

import { projectId, publicAnonKey } from "../utils/supabase/info";

const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-aedf23c8`;

/**
 * Update a friend's location in the backend
 * Use this function to simulate location updates or implement real GPS tracking
 */
export const updateFriendLocation = async (friendData: {
  friendId: string;
  latitude: number;
  longitude: number;
  location?: string;
  heading?: number;
  speed?: number;
}) => {
  try {
    const response = await fetch(`${serverUrl}/friends/location`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(friendData),
    });

    if (!response.ok) {
      throw new Error("Failed to update location");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating friend location:", error);
    throw error;
  }
};

/**
 * Get all friends' locations from the backend
 */
export const getAllFriendLocations = async () => {
  try {
    const response = await fetch(`${serverUrl}/friends/locations`, {
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch locations");
    }

    const data = await response.json();
    return data.friends || [];
  } catch (error) {
    console.error("Error fetching friend locations:", error);
    throw error;
  }
};

/**
 * Simulate a friend moving along a path
 * Useful for testing the real-time tracking features
 */
export const simulateFriendMovement = async (
  friendId: string,
  startLat: number,
  startLon: number,
  endLat: number,
  endLon: number,
  durationSeconds: number = 60
) => {
  const steps = 20;
  const intervalMs = (durationSeconds * 1000) / steps;
  
  const latStep = (endLat - startLat) / steps;
  const lonStep = (endLon - startLon) / steps;
  
  for (let i = 0; i <= steps; i++) {
    const currentLat = startLat + (latStep * i);
    const currentLon = startLon + (lonStep * i);
    
    // Calculate heading (simplified)
    const heading = Math.atan2(lonStep, latStep) * (180 / Math.PI);
    
    // Calculate speed (km/h)
    const distance = Math.sqrt(Math.pow(latStep, 2) + Math.pow(lonStep, 2)) * 111; // rough km conversion
    const speed = (distance / intervalMs) * 3600000; // km/h
    
    await updateFriendLocation({
      friendId,
      latitude: currentLat,
      longitude: currentLon,
      heading: (heading + 360) % 360,
      speed: Math.round(speed),
    });
    
    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }
};

/**
 * Get current device GPS location
 * Use this to share your real location with friends
 */
export const getCurrentLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  });
};

/**
 * Start watching device location and update backend
 * This enables real-time location sharing
 */
export const startLocationSharing = (
  friendId: string,
  onLocationUpdate?: (lat: number, lon: number) => void
): number => {
  if (!navigator.geolocation) {
    console.error("Geolocation is not supported");
    return -1;
  }

  let lastLat = 0;
  let lastLon = 0;
  let lastTime = Date.now();

  const watchId = navigator.geolocation.watchPosition(
    async (position) => {
      const { latitude, longitude, heading, speed } = position.coords;
      
      // Calculate movement
      const now = Date.now();
      const timeDelta = (now - lastTime) / 1000; // seconds
      
      let calculatedSpeed = 0;
      let calculatedHeading = heading || 0;
      
      if (lastLat !== 0 && lastLon !== 0) {
        const latDiff = latitude - lastLat;
        const lonDiff = longitude - lastLon;
        const distance = Math.sqrt(Math.pow(latDiff, 2) + Math.pow(lonDiff, 2)) * 111; // km
        calculatedSpeed = (distance / timeDelta) * 3600; // km/h
        
        if (lonDiff !== 0 || latDiff !== 0) {
          calculatedHeading = Math.atan2(lonDiff, latDiff) * (180 / Math.PI);
          calculatedHeading = (calculatedHeading + 360) % 360;
        }
      }
      
      // Update backend
      try {
        await updateFriendLocation({
          friendId,
          latitude,
          longitude,
          heading: Math.round(calculatedHeading),
          speed: Math.round(speed || calculatedSpeed),
        });
      } catch (error) {
        console.error("Failed to update location:", error);
      }
      
      // Update local state
      lastLat = latitude;
      lastLon = longitude;
      lastTime = now;
      
      // Callback
      if (onLocationUpdate) {
        onLocationUpdate(latitude, longitude);
      }
    },
    (error) => {
      console.error("Geolocation error:", error);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5000
    }
  );

  return watchId;
};

/**
 * Stop watching device location
 */
export const stopLocationSharing = (watchId: number) => {
  if (watchId >= 0) {
    navigator.geolocation.clearWatch(watchId);
  }
};

/**
 * Reverse geocode coordinates to location name
 * Uses OpenStreetMap Nominatim (free, no API key needed)
 */
export const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`
    );
    
    if (!response.ok) {
      throw new Error("Geocoding failed");
    }
    
    const data = await response.json();
    
    // Extract city/area name
    const address = data.address;
    return address.city || address.town || address.village || address.county || "Unknown Location";
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return "Unknown Location";
  }
};

/**
 * Calculate distance between two coordinates in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

/**
 * Format distance for display
 */
export const formatDistance = (distanceKm: number): string => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
};

/**
 * Example: Test the friend tracking system
 */
export const testFriendTracking = async () => {
  console.log("🧪 Testing friend tracking system...");
  
  // Test 1: Update multiple friend locations
  const testFriends = [
    { friendId: "1", latitude: 14.6760, longitude: 121.0437, location: "Quezon City" },
    { friendId: "2", latitude: 14.5547, longitude: 121.0244, location: "Makati" },
    { friendId: "3", latitude: 14.5764, longitude: 121.0851, location: "Pasig" },
  ];
  
  for (const friend of testFriends) {
    try {
      await updateFriendLocation(friend);
      console.log(`✅ Updated location for friend ${friend.friendId}`);
    } catch (error) {
      console.error(`❌ Failed to update friend ${friend.friendId}:`, error);
    }
  }
  
  // Test 2: Fetch all locations
  try {
    const locations = await getAllFriendLocations();
    console.log(`✅ Fetched ${locations.length} friend locations`);
  } catch (error) {
    console.error("❌ Failed to fetch locations:", error);
  }
  
  console.log("🏁 Test complete!");
};

// Export all utilities
export default {
  updateFriendLocation,
  getAllFriendLocations,
  simulateFriendMovement,
  getCurrentLocation,
  startLocationSharing,
  stopLocationSharing,
  reverseGeocode,
  calculateDistance,
  formatDistance,
  testFriendTracking,
};
