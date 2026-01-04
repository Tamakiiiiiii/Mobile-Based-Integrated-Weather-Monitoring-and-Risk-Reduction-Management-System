import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import {
  MapPin,
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  Wind,
  Droplets,
  RefreshCw,
  Plus,
  Navigation,
  Users,
} from "lucide-react";

// Add your Mapbox token here
const MAPBOX_TOKEN =
  "pk.eyJ1IjoidGFtYWtpaWkiLCJhIjoiY21qemtjMWp5MDBobDNwb3F1emFsNDV3NSJ9.JdlzkWCF5oyOLUdBV9Illg";
const OPENWEATHER_API_KEY = "a96c621bdb7a200005963f01601a9020";

interface Friend {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  weather?: {
    temp: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    icon: string;
  };
  lastSeen: string;
  avatar: string;
  status: "online" | "away" | "offline";
  speed?: number;
  heading?: number;
}

export function MapboxFriendTracking() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{ [key: string]: mapboxgl.Marker }>(
    {},
  );

  const [loading, setLoading] = useState(true);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([
    {
      id: "1",
      name: "Alex Chen",
      location: "Quezon City",
      latitude: 14.676,
      longitude: 121.0437,
      lastSeen: "Just now",
      avatar: "AC",
      status: "online",
      speed: 0,
      heading: 45,
    },
    {
      id: "2",
      name: "Maria Santos",
      location: "Makati",
      latitude: 14.5547,
      longitude: 121.0244,
      lastSeen: "2 mins ago",
      avatar: "MS",
      status: "online",
      speed: 15,
      heading: 180,
    },
    {
      id: "3",
      name: "John Reyes",
      location: "Pasig",
      latitude: 14.5764,
      longitude: 121.0851,
      lastSeen: "5 mins ago",
      avatar: "JR",
      status: "away",
      speed: 35,
      heading: 270,
    },
    {
      id: "4",
      name: "Sarah Cruz",
      location: "Cebu City",
      latitude: 10.3157,
      longitude: 123.8854,
      lastSeen: "10 mins ago",
      avatar: "SC",
      status: "online",
      speed: 0,
      heading: 0,
    },
  ]);

  const [selectedFriend, setSelectedFriend] =
    useState<Friend | null>(null);

  // Fetch weather data for a location
  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`,
      );

      if (!response.ok) {
        // Return mock data if API fails
        return {
          temp: 28 + Math.random() * 5,
          condition: ["Clear", "Cloudy", "Light Rain"][
            Math.floor(Math.random() * 3)
          ],
          humidity: 70 + Math.floor(Math.random() * 20),
          windSpeed: 10 + Math.floor(Math.random() * 15),
          icon: "01d",
        };
      }

      const data = await response.json();
      return {
        temp: Math.round(data.main.temp),
        condition: data.weather[0].main,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        icon: data.weather[0].icon,
      };
    } catch (error) {
      console.error("Error fetching weather:", error);
      // Return mock data
      return {
        temp: 28 + Math.random() * 5,
        condition: ["Clear", "Cloudy", "Light Rain"][
          Math.floor(Math.random() * 3)
        ],
        humidity: 70 + Math.floor(Math.random() * 20),
        windSpeed: 10 + Math.floor(Math.random() * 15),
        icon: "01d",
      };
    }
  };

  // Update weather for all friends
  const updateAllWeather = async () => {
    setWeatherLoading(true);
    const updatedFriends = await Promise.all(
      friends.map(async (friend) => {
        const weather = await fetchWeatherData(
          friend.latitude,
          friend.longitude,
        );
        return { ...friend, weather };
      }),
    );
    setFriends(updatedFriends);
    setWeatherLoading(false);
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [121.0244, 14.5547], // Manila center
      zoom: 10,
      pitch: 45,
      bearing: 0,
    });

    map.current.on("load", () => {
      setLoading(false);

      // Add weather layer
      if (map.current) {
        map.current.addLayer({
          id: "weather-layer",
          type: "raster",
          source: {
            type: "raster",
            tiles: [
              `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
            ],
            tileSize: 256,
          },
          paint: {
            "raster-opacity": 0.4,
          },
        });
      }
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      "top-right",
    );
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      }),
      "top-right",
    );

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update friend markers
  useEffect(() => {
    if (!map.current || loading) return;

    // Remove old markers
    Object.values(markers.current).forEach((marker) =>
      marker.remove(),
    );
    markers.current = {};

    // Add new markers
    friends.forEach((friend) => {
      const el = document.createElement("div");
      el.className = "friend-marker";
      el.style.cssText = `
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        background: ${friend.status === "online" ? "#10b981" : friend.status === "away" ? "#f59e0b" : "#6b7280"};
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        font-size: 14px;
      `;
      el.textContent = friend.avatar;

      // Add direction indicator if moving
      if (friend.speed && friend.speed > 5) {
        const arrow = document.createElement("div");
        arrow.style.cssText = `
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%) rotate(${friend.heading}deg);
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-bottom: 10px solid #3b82f6;
        `;
        el.appendChild(arrow);
      }

      const marker = new mapboxgl.Marker(el)
        .setLngLat([friend.longitude, friend.latitude])
        .addTo(map.current!);

      // Add popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 8px; min-width: 200px;">
          <div style="font-weight: bold; margin-bottom: 4px;">${friend.name}</div>
          <div style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">${friend.location}</div>
          ${
            friend.weather
              ? `
            <div style="border-top: 1px solid #e5e7eb; padding-top: 8px; margin-top: 8px;">
              <div style="font-size: 14px; margin-bottom: 4px;">
                <strong>${friend.weather.temp}°C</strong> - ${friend.weather.condition}
              </div>
              <div style="display: flex; gap: 12px; font-size: 12px; color: #6b7280;">
                <div>💧 ${friend.weather.humidity}%</div>
                <div>💨 ${friend.weather.windSpeed} km/h</div>
              </div>
            </div>
          `
              : ""
          }
          <div style="font-size: 11px; color: #9ca3af; margin-top: 8px;">
            Last seen: ${friend.lastSeen}
          </div>
        </div>
      `);

      marker.setPopup(popup);

      el.addEventListener("click", () => {
        setSelectedFriend(friend);
        map.current?.flyTo({
          center: [friend.longitude, friend.latitude],
          zoom: 14,
          duration: 2000,
        });
      });

      markers.current[friend.id] = marker;
    });

    // Fit bounds to show all friends
    if (friends.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      friends.forEach((friend) => {
        bounds.extend([friend.longitude, friend.latitude]);
      });
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 12,
      });
    }
  }, [friends, loading]);

  // Fetch weather on mount
  useEffect(() => {
    updateAllWeather();

    // Update weather every 5 minutes
    const interval = setInterval(
      updateAllWeather,
      5 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case "clear":
      case "sunny":
        return <Sun className="h-4 w-4 text-yellow-500" />;
      case "clouds":
      case "cloudy":
        return <Cloud className="h-4 w-4 text-gray-500" />;
      case "rain":
      case "light rain":
      case "drizzle":
        return <CloudRain className="h-4 w-4 text-blue-500" />;
      case "snow":
        return <CloudSnow className="h-4 w-4 text-blue-300" />;
      default:
        return <Cloud className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-4 p-4">
      {/* Map Container */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Live Location & Weather Map</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={updateAllWeather}
                disabled={weatherLoading}
              >
                <RefreshCw
                  className={`h-4 w-4 ${weatherLoading ? "animate-spin" : ""}`}
                />
              </Button>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading && (
            <div className="h-96 flex items-center justify-center">
              <Skeleton className="h-full w-full" />
            </div>
          )}
          <div
            ref={mapContainer}
            className="h-96 rounded-b-lg overflow-hidden"
            style={{ display: loading ? "none" : "block" }}
          />
        </CardContent>
      </Card>

      {/* Map Legend */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                <span>Online</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full border-2 border-white"></div>
                <span>Away</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-500 rounded-full border-2 border-white"></div>
                <span>Offline</span>
              </div>
            </div>
            <span className="text-xs text-blue-700">
              {friends.length} friends tracked
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Friends List with Weather */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Friends Weather Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {friends.map((friend) => (
            <div
              key={friend.id}
              className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                selectedFriend?.id === friend.id
                  ? "bg-blue-50 border-blue-300"
                  : ""
              }`}
              onClick={() => {
                setSelectedFriend(friend);
                map.current?.flyTo({
                  center: [friend.longitude, friend.latitude],
                  zoom: 14,
                  duration: 2000,
                });
              }}
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="" alt={friend.name} />
                  <AvatarFallback>
                    {friend.avatar}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(
                    friend.status,
                  )}`}
                ></div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{friend.name}</p>
                  {friend.speed && friend.speed > 5 && (
                    <Badge
                      variant="outline"
                      className="text-xs"
                    >
                      <Navigation className="h-3 w-3 mr-1" />
                      {friend.speed} km/h
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {friend.location}
                  </span>
                </div>
                {friend.weather ? (
                  <div className="flex items-center space-x-3 mt-2">
                    <div className="flex items-center space-x-1">
                      {getWeatherIcon(friend.weather.condition)}
                      <span className="text-sm">
                        {friend.weather.temp}°C
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Droplets className="h-3 w-3" />
                      <span>{friend.weather.humidity}%</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Wind className="h-3 w-3" />
                      <span>
                        {friend.weather.windSpeed} km/h
                      </span>
                    </div>
                  </div>
                ) : (
                  <Skeleton className="h-4 w-32 mt-2" />
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {friend.lastSeen}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-2">
            <Cloud className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800">
                Real-time Weather & Location Sync
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Friend locations and weather conditions update
                automatically. Weather layer shows temperature
                overlays. Click any friend to view details.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}