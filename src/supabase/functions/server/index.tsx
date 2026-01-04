import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-aedf23c8/health", (c) => {
  return c.json({ status: "ok" });
});

// Friend Location Routes

// Get all friends' locations
app.get("/make-server-aedf23c8/friends/locations", async (c) => {
  try {
    const friends = await kv.getByPrefix("friend_location:");
    return c.json({ friends });
  } catch (error) {
    console.error("Error fetching friend locations:", error);
    return c.json({ error: "Failed to fetch friend locations" }, 500);
  }
});

// Update a friend's location
app.post("/make-server-aedf23c8/friends/location", async (c) => {
  try {
    const body = await c.req.json();
    const { friendId, latitude, longitude, location, heading, speed } = body;

    if (!friendId || latitude === undefined || longitude === undefined) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const locationData = {
      friendId,
      latitude,
      longitude,
      location,
      heading,
      speed,
      timestamp: new Date().toISOString(),
      lastSeen: "Just now",
    };

    await kv.set(`friend_location:${friendId}`, locationData);

    return c.json({ success: true, data: locationData });
  } catch (error) {
    console.error("Error updating friend location:", error);
    return c.json({ error: "Failed to update location" }, 500);
  }
});

// Get a specific friend's location
app.get("/make-server-aedf23c8/friends/location/:friendId", async (c) => {
  try {
    const friendId = c.req.param("friendId");
    const location = await kv.get(`friend_location:${friendId}`);

    if (!location) {
      return c.json({ error: "Friend not found" }, 404);
    }

    return c.json({ location });
  } catch (error) {
    console.error("Error fetching friend location:", error);
    return c.json({ error: "Failed to fetch friend location" }, 500);
  }
});

// Delete a friend's location
app.delete("/make-server-aedf23c8/friends/location/:friendId", async (c) => {
  try {
    const friendId = c.req.param("friendId");
    await kv.del(`friend_location:${friendId}`);

    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting friend location:", error);
    return c.json({ error: "Failed to delete friend location" }, 500);
  }
});

// Friend Weather Routes

// Get weather data for a friend
app.get("/make-server-aedf23c8/friends/weather/:friendId", async (c) => {
  try {
    const friendId = c.req.param("friendId");
    const weather = await kv.get(`friend_weather:${friendId}`);

    if (!weather) {
      return c.json({ error: "Weather data not found" }, 404);
    }

    return c.json({ weather });
  } catch (error) {
    console.error("Error fetching friend weather:", error);
    return c.json({ error: "Failed to fetch weather data" }, 500);
  }
});

// Update weather data for a friend
app.post("/make-server-aedf23c8/friends/weather", async (c) => {
  try {
    const body = await c.req.json();
    const { friendId, temp, condition, humidity, windSpeed, icon } = body;

    if (!friendId) {
      return c.json({ error: "Missing friendId" }, 400);
    }

    const weatherData = {
      friendId,
      temp,
      condition,
      humidity,
      windSpeed,
      icon,
      timestamp: new Date().toISOString(),
    };

    await kv.set(`friend_weather:${friendId}`, weatherData);

    return c.json({ success: true, data: weatherData });
  } catch (error) {
    console.error("Error updating friend weather:", error);
    return c.json({ error: "Failed to update weather data" }, 500);
  }
});

// Storm Tracking Routes

// Get all active storms
app.get("/make-server-aedf23c8/storms/active", async (c) => {
  try {
    const storms = await kv.getByPrefix("storm:");
    return c.json({ storms });
  } catch (error) {
    console.error("Error fetching storms:", error);
    return c.json({ error: "Failed to fetch storms" }, 500);
  }
});

// Update storm data
app.post("/make-server-aedf23c8/storms", async (c) => {
  try {
    const body = await c.req.json();
    const { stormId, name, category, windSpeed, location, pressure, warnings, severity } = body;

    if (!stormId) {
      return c.json({ error: "Missing stormId" }, 400);
    }

    const stormData = {
      id: stormId,
      name,
      category,
      windSpeed,
      location,
      pressure,
      warnings,
      severity,
      timestamp: new Date().toISOString(),
    };

    await kv.set(`storm:${stormId}`, stormData);

    return c.json({ success: true, data: stormData });
  } catch (error) {
    console.error("Error updating storm data:", error);
    return c.json({ error: "Failed to update storm data" }, 500);
  }
});

Deno.serve(app.fetch);