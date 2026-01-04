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
  Alert,
  AlertDescription,
  AlertTitle,
} from "./ui/alert";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import {
  Eye,
  Wind,
  Droplets,
  Navigation,
  AlertTriangle,
  Satellite,
  RefreshCw,
  MapPin,
  Zap,
  CloudRain,
  Gauge,
} from "lucide-react";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoidGFtYWtpaWkiLCJhIjoiY21qemtjMWp5MDBobDNwb3F1emFsNDV3NSJ9.JdlzkWCF5oyOLUdBV9Illg";
const OPENWEATHER_API_KEY = "a96c621bdb7a200005963f01601a9020";

interface Storm {
  id: string;
  name: string;
  category: string;
  status: string;
  windSpeed: number;
  location: {
    lat: number;
    lon: number;
    area: string;
  };
  movement: string;
  pressure: number;
  warnings: string[];
  affectedAreas: string[];
  nextUpdate: string;
  severity: "high" | "medium" | "low";
}

interface WeatherStation {
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  status: string;
  windSpeed: number;
  rainfall: number;
  pressure: number;
}

export function MapboxStormTracking() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [activeStorms, setActiveStorms] = useState<Storm[]>([]);
  const [weatherStations, setWeatherStations] = useState<
    WeatherStation[]
  >([
    {
      name: "Manila Observatory",
      location: "Quezon City",
      latitude: 14.64,
      longitude: 121.0776,
      status: "Active",
      windSpeed: 0,
      rainfall: 0,
      pressure: 1012,
    },
    {
      name: "PAGASA Science Garden",
      location: "Quezon City",
      latitude: 14.6507,
      longitude: 121.0494,
      status: "Active",
      windSpeed: 0,
      rainfall: 0,
      pressure: 1012,
    },
    {
      name: "Subic Bay",
      location: "Zambales",
      latitude: 14.82,
      longitude: 120.272,
      status: "Active",
      windSpeed: 0,
      rainfall: 0,
      pressure: 1012,
    },
    {
      name: "Tanay",
      location: "Rizal",
      latitude: 14.5008,
      longitude: 121.2867,
      status: "Active",
      windSpeed: 0,
      rainfall: 0,
      pressure: 1012,
    },
    {
      name: "Puerto Princesa",
      location: "Palawan",
      latitude: 9.7392,
      longitude: 118.7353,
      status: "Active",
      windSpeed: 0,
      rainfall: 0,
      pressure: 1012,
    },
    {
      name: "Mactan",
      location: "Cebu",
      latitude: 10.3091,
      longitude: 123.9794,
      status: "Active",
      windSpeed: 0,
      rainfall: 0,
      pressure: 1012,
    },
    {
      name: "Davao Airport",
      location: "Davao City",
      latitude: 7.1253,
      longitude: 125.6456,
      status: "Active",
      windSpeed: 0,
      rainfall: 0,
      pressure: 1012,
    },
    {
      name: "Laoag",
      location: "Ilocos Norte",
      latitude: 18.1782,
      longitude: 120.5931,
      status: "Active",
      windSpeed: 0,
      rainfall: 0,
      pressure: 1012,
    },
  ]);

  // Fetch real storm data from OpenWeatherMap
  const fetchStormData = async () => {
    try {
      // Fetch weather data for multiple points around the Philippines
      const checkPoints = [
        { lat: 15.5, lon: 125.2, name: "Eastern Luzon" },
        { lat: 12.0, lon: 125.0, name: "Eastern Visayas" },
        { lat: 8.5, lon: 126.5, name: "Eastern Mindanao" },
        { lat: 18.0, lon: 122.0, name: "Northern Luzon" },
        { lat: 10.0, lon: 119.0, name: "Western Palawan" },
      ];

      const stormData: Storm[] = [];

      for (const point of checkPoints) {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${point.lat}&lon=${point.lon}&appid=${OPENWEATHER_API_KEY}&units=metric`,
          );

          if (response.ok) {
            const data = await response.json();

            // Check for storm conditions (high winds or heavy rain)
            const windSpeedKmh = Math.round(
              data.wind.speed * 3.6,
            );

            if (windSpeedKmh > 60) {
              // Tropical storm or stronger
              let category = "Tropical Depression";
              let severity: "high" | "medium" | "low" = "low";

              if (windSpeedKmh > 118) {
                category = "Typhoon";
                severity = "high";
              } else if (windSpeedKmh > 88) {
                category = "Severe Tropical Storm";
                severity = "high";
              } else if (windSpeedKmh > 62) {
                category = "Tropical Storm";
                severity = "medium";
              }

              stormData.push({
                id: `storm_${point.name.replace(/\s+/g, "_")}`,
                name: `System ${point.name}`,
                category,
                status: "Active",
                windSpeed: windSpeedKmh,
                location: {
                  lat: point.lat,
                  lon: point.lon,
                  area: point.name,
                },
                movement: data.wind.deg
                  ? `${getWindDirection(data.wind.deg)} at ${windSpeedKmh} km/h`
                  : "Stationary",
                pressure: data.main.pressure,
                warnings:
                  severity === "high"
                    ? ["Storm Warning", "Heavy Rain"]
                    : ["Storm Watch"],
                affectedAreas: [point.name],
                nextUpdate: "3 hours",
                severity,
              });
            }
          }
        } catch (error) {
          console.error(
            `Error fetching data for ${point.name}:`,
            error,
          );
        }
      }

      setActiveStorms(stormData);
    } catch (error) {
      console.error("Error fetching storm data:", error);
    }
  };

  // Fetch weather station data
  const fetchWeatherStations = async () => {
    const updatedStations = await Promise.all(
      weatherStations.map(async (station) => {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${station.latitude}&lon=${station.longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`,
          );

          if (response.ok) {
            const data = await response.json();
            return {
              ...station,
              windSpeed: Math.round(data.wind.speed * 3.6),
              rainfall: data.rain ? data.rain["1h"] || 0 : 0,
              pressure: data.main.pressure,
            };
          }
        } catch (error) {
          console.error(
            `Error fetching data for ${station.name}:`,
            error,
          );
        }
        return station;
      }),
    );

    setWeatherStations(updatedStations);
  };

  const getWindDirection = (deg: number): string => {
    const directions = [
      "N",
      "NE",
      "E",
      "SE",
      "S",
      "SW",
      "W",
      "NW",
    ];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };

  const refreshData = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchStormData(),
      fetchWeatherStations(),
    ]);
    setLastUpdated(new Date());
    setRefreshing(false);
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [122.0, 12.0], // Center of Philippines
      zoom: 5,
      pitch: 0,
      bearing: 0,
    });

    map.current.on("load", () => {
      setLoading(false);

      // Add weather radar layer
      if (map.current) {
        // Precipitation layer
        map.current.addLayer({
          id: "precipitation-layer",
          type: "raster",
          source: {
            type: "raster",
            tiles: [
              `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
            ],
            tileSize: 256,
          },
          paint: {
            "raster-opacity": 0.6,
          },
        });

        // Wind layer
        map.current.addLayer({
          id: "wind-layer",
          type: "raster",
          source: {
            type: "raster",
            tiles: [
              `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
            ],
            tileSize: 256,
          },
          paint: {
            "raster-opacity": 0.4,
          },
        });

        // Clouds layer
        map.current.addLayer({
          id: "clouds-layer",
          type: "raster",
          source: {
            type: "raster",
            tiles: [
              `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
            ],
            tileSize: 256,
          },
          paint: {
            "raster-opacity": 0.3,
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
      new mapboxgl.ScaleControl({
        maxWidth: 100,
        unit: "metric",
      }),
      "bottom-left",
    );

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update markers
  useEffect(() => {
    if (!map.current || loading) return;

    // Clear existing markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    // Add storm markers
    activeStorms.forEach((storm) => {
      const el = document.createElement("div");
      el.className = "storm-marker";

      const size =
        storm.severity === "high"
          ? 50
          : storm.severity === "medium"
            ? 40
            : 30;
      const color =
        storm.severity === "high"
          ? "#ef4444"
          : storm.severity === "medium"
            ? "#f59e0b"
            : "#3b82f6";

      el.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: radial-gradient(circle, ${color} 0%, transparent 70%);
        border: 2px solid ${color};
        cursor: pointer;
        animation: pulse 2s infinite;
      `;

      const marker = new mapboxgl.Marker(el)
        .setLngLat([storm.location.lon, storm.location.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div style="padding: 12px; min-width: 250px;">
            <div style="font-weight: bold; font-size: 16px; margin-bottom: 4px;">${storm.name}</div>
            <div style="color: #6b7280; margin-bottom: 8px;">${storm.category}</div>
            <div style="border-top: 1px solid #e5e7eb; padding-top: 8px; margin-top: 8px;">
              <div style="margin-bottom: 6px;">
                <strong>Wind:</strong> ${storm.windSpeed} km/h
              </div>
              <div style="margin-bottom: 6px;">
                <strong>Pressure:</strong> ${storm.pressure} hPa
              </div>
              <div style="margin-bottom: 6px;">
                <strong>Movement:</strong> ${storm.movement}
              </div>
              <div style="margin-bottom: 6px;">
                <strong>Location:</strong> ${storm.location.area}
              </div>
              ${
                storm.warnings.length > 0
                  ? `
                <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
                  <strong style="color: #ef4444;">Warnings:</strong>
                  <div style="color: #dc2626; margin-top: 4px;">${storm.warnings.join(", ")}</div>
                </div>
              `
                  : ""
              }
            </div>
          </div>
        `),
        )
        .addTo(map.current!);

      markers.current.push(marker);
    });

    // Add weather station markers
    weatherStations.forEach((station) => {
      const el = document.createElement("div");
      el.style.cssText = `
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #3b82f6;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        cursor: pointer;
      `;

      const marker = new mapboxgl.Marker(el)
        .setLngLat([station.longitude, station.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 15 }).setHTML(`
          <div style="padding: 8px;">
            <div style="font-weight: bold; margin-bottom: 4px;">${station.name}</div>
            <div style="font-size: 12px; color: #6b7280; margin-bottom: 6px;">${station.location}</div>
            <div style="font-size: 12px;">
              <div>💨 Wind: ${station.windSpeed} km/h</div>
              <div>💧 Rain: ${station.rainfall} mm</div>
              <div>🌡️ Pressure: ${station.pressure} hPa</div>
            </div>
          </div>
        `),
        )
        .addTo(map.current!);

      markers.current.push(marker);
    });
  }, [activeStorms, weatherStations, loading]);

  // Initial data fetch
  useEffect(() => {
    refreshData();

    // Update every 10 minutes
    const interval = setInterval(refreshData, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500";
      case "maintenance":
        return "bg-yellow-500";
      case "offline":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-4 p-4">
      {/* Header with Real-time Updates */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Satellite className="h-5 w-5 text-blue-600" />
              <span>Live Storm Tracking</span>
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              disabled={refreshing}
              className="flex items-center space-x-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live Updates</span>
            </div>
            <span className="text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Storm Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Real-time Weather Radar</span>
          </CardTitle>
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
          <div className="p-4 border-t">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>High Alert</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Medium Alert</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <span>Weather Station</span>
                </div>
              </div>
              <span>Data from OpenWeatherMap & PAGASA</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Storms */}
      {activeStorms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-orange-600" />
              <span>
                Active Storm Systems ({activeStorms.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeStorms.map((storm) => (
                <div
                  key={storm.id}
                  className="p-4 border rounded-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base">
                        {storm.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {storm.category}
                      </p>
                    </div>
                    <Badge
                      className={getSeverityColor(
                        storm.severity,
                      )}
                    >
                      {storm.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Wind className="h-4 w-4 text-blue-500" />
                      <span>{storm.windSpeed} km/h</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Gauge className="h-4 w-4 text-gray-500" />
                      <span>{storm.pressure} hPa</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Navigation className="h-4 w-4 text-green-500" />
                      <span>{storm.movement}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-red-500" />
                      <span>{storm.location.area}</span>
                    </div>
                  </div>

                  {storm.warnings.length > 0 && (
                    <Alert className="bg-red-50 border-red-200">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertTitle className="text-red-800">
                        Active Warnings
                      </AlertTitle>
                      <AlertDescription className="text-red-700">
                        {storm.warnings.join(", ")}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeStorms.length === 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-8 text-center">
            <Eye className="h-12 w-12 mx-auto mb-2 text-green-600" />
            <p className="text-green-800">
              No active storm systems detected
            </p>
            <p className="text-xs text-green-600 mt-1">
              Philippines region is currently clear of major
              weather disturbances
            </p>
          </CardContent>
        </Card>
      )}

      {/* Weather Stations Status */}
      <Card>
        <CardHeader>
          <CardTitle>
            Weather Station Network ({weatherStations.length}{" "}
            stations)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weatherStations
              .slice(0, 5)
              .map((station, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${getStatusColor(station.status)}`}
                    ></div>
                    <div>
                      <p className="text-sm">{station.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {station.location}
                      </p>
                    </div>
                  </div>
                  {station.status === "Active" && (
                    <div className="text-right text-xs space-y-1">
                      <div className="flex items-center space-x-1">
                        <Wind className="h-3 w-3" />
                        <span>{station.windSpeed} km/h</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Droplets className="h-3 w-3" />
                        <span>{station.rainfall} mm</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            {weatherStations.length > 5 && (
              <p className="text-xs text-center text-muted-foreground pt-2">
                + {weatherStations.length - 5} more stations
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <Card className="bg-indigo-50 border-indigo-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-2">
            <Satellite className="h-5 w-5 text-indigo-600 mt-0.5" />
            <div>
              <p className="text-sm text-indigo-800">
                Live Weather Data
              </p>
              <p className="text-xs text-indigo-600 mt-1">
                Real-time storm tracking with precipitation,
                wind, and cloud layers. Data updates every 10
                minutes from OpenWeatherMap API. Click markers
                for details.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <style jsx global>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}