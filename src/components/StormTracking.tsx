import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Eye, Wind, Droplets, Navigation, AlertTriangle, Satellite, RefreshCw, MapPin, Zap } from "lucide-react";

export function StormTracking() {
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [activeStorms, setActiveStorms] = useState([]);

  // Mock storm data for the Philippines region
  const mockStormData = [
    {
      id: "storm_001",
      name: "Typhoon Paolo",
      category: "Category 2",
      status: "Active",
      windSpeed: 150,
      location: { lat: 15.5, lon: 125.2, area: "Eastern Luzon" },
      movement: "Northwest at 15 km/h",
      pressure: 985,
      warnings: ["Signal No. 2", "Storm Surge Warning"],
      affectedAreas: ["Aurora", "Quezon", "Camarines Norte"],
      nextUpdate: "3 hours",
      severity: "high"
    },
    {
      id: "storm_002", 
      name: "Tropical Depression Maria",
      category: "Tropical Depression",
      status: "Weakening",
      windSpeed: 55,
      location: { lat: 8.2, lon: 126.8, area: "Mindanao Sea" },
      movement: "West at 20 km/h",
      pressure: 1008,
      warnings: ["Signal No. 1"],
      affectedAreas: ["Surigao del Norte", "Bohol"],
      nextUpdate: "6 hours",
      severity: "medium"
    }
  ];

  const weatherStations = [
    { name: "Manila Observatory", location: "Quezon City", status: "Active", windSpeed: 45, rainfall: 15 },
    { name: "PAGASA Cebu", location: "Cebu City", status: "Active", windSpeed: 32, rainfall: 8 },
    { name: "Davao Weather Station", location: "Davao City", status: "Active", windSpeed: 28, rainfall: 12 },
    { name: "Iloilo Synoptic Station", location: "Iloilo City", status: "Active", windSpeed: 38, rainfall: 22 },
    { name: "Baguio Weather Station", location: "Baguio City", status: "Maintenance", windSpeed: 0, rainfall: 0 }
  ];

  const satelliteData = {
    lastImage: "2 minutes ago",
    coverage: "Western Pacific",
    resolution: "1km",
    bands: ["Visible", "Infrared", "Water Vapor"]
  };

  useEffect(() => {
    // Initial load only
    setActiveStorms(mockStormData);
    
    // Optional: Update timestamp periodically (reduced frequency)
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000); // Every minute instead of 30 seconds

    return () => {
      clearInterval(interval);
    };
  }, []);

  const refreshData = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLastUpdated(new Date());
    setActiveStorms(mockStormData);
    setLoading(false);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500';
      case 'maintenance':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
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
              <span>Storm Tracking Center</span>
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              disabled={loading}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
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
            <span>Philippines Storm Map</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gradient-to-br from-blue-100 via-blue-50 to-green-50 rounded-lg relative overflow-hidden border">
            {/* Simplified Philippines Map */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 300 200" className="w-full h-full">
                {/* Luzon */}
                <path
                  d="M120 40 L160 35 L170 50 L175 65 L170 80 L165 90 L155 95 L145 90 L135 80 L125 65 L120 50 L120 40 Z"
                  fill="#10b981"
                  fillOpacity="0.6"
                  stroke="#059669"
                  strokeWidth="1.5"
                />
                
                {/* Visayas */}
                <ellipse cx="150" cy="110" rx="20" ry="12" fill="#10b981" fillOpacity="0.6" stroke="#059669" strokeWidth="1.5"/>
                
                {/* Mindanao */}
                <path
                  d="M130 140 L170 135 L180 150 L175 165 L165 170 L145 165 L135 155 L130 140 Z"
                  fill="#10b981"
                  fillOpacity="0.6"
                  stroke="#059669"
                  strokeWidth="1.5"
                />
                
                {/* Cities */}
                <circle cx="150" cy="65" r="2" fill="#1e40af" stroke="#ffffff" strokeWidth="1" />
                <text x="155" y="70" className="text-xs fill-slate-700">Manila</text>
                
                <circle cx="160" cy="110" r="1.5" fill="#1e40af" stroke="#ffffff" strokeWidth="1" />
                <text x="165" y="115" className="text-xs fill-slate-700">Cebu</text>
                
                <circle cx="155" cy="155" r="1.5" fill="#1e40af" stroke="#ffffff" strokeWidth="1" />
                <text x="160" y="160" className="text-xs fill-slate-700">Davao</text>
              </svg>
            </div>

            {/* Storm markers - simplified */}
            {activeStorms.map((storm) => {
              const stormX = ((storm.location.lon - 115) / 15) * 100;
              const stormY = ((20 - storm.location.lat) / 13) * 100;
              
              return (
                <div
                  key={storm.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${Math.max(10, Math.min(90, stormX))}%`,
                    top: `${Math.max(10, Math.min(90, stormY))}%`
                  }}
                >
                  <div className="relative group">
                    {/* Simple storm circle */}
                    <div className={`w-6 h-6 rounded-full border-2 ${
                      storm.severity === 'high' 
                        ? 'bg-red-500 border-red-700' 
                        : 'bg-yellow-500 border-yellow-700'
                    }`}></div>
                    
                    {/* Storm name */}
                    <div className="absolute top-7 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="font-medium">{storm.name}</div>
                      <div className="text-muted-foreground text-xs">{storm.windSpeed} km/h</div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Weather stations - simplified */}
            <div className="absolute top-4 left-4 w-2 h-2 bg-blue-600 rounded-full" title="Manila"></div>
            <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-blue-600 rounded-full" title="Cebu"></div>
            <div className="absolute bottom-4 right-1/3 w-2 h-2 bg-blue-600 rounded-full" title="Davao"></div>
          </div>
          
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Active Typhoon</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Tropical Storm</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Weather Station</span>
              </div>
            </div>
            <span>Data from PAGASA</span>
          </div>
        </CardContent>
      </Card>

      {/* Active Storms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-orange-600" />
            <span>Active Storm Systems</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="p-4 border rounded-lg">
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-48 mb-2" />
                  <div className="flex space-x-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : activeStorms.length > 0 ? (
            <div className="space-y-4">
              {activeStorms.map((storm) => (
                <div key={storm.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base">{storm.name}</h4>
                      <p className="text-sm text-muted-foreground">{storm.category}</p>
                    </div>
                    <Badge className={getSeverityColor(storm.severity)}>
                      {storm.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Wind className="h-4 w-4 text-blue-500" />
                      <span>{storm.windSpeed} km/h</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4 text-gray-500" />
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

                  <div className="space-y-2">
                    <p className="text-xs">
                      <strong>Warnings:</strong> {storm.warnings.join(", ")}
                    </p>
                    <p className="text-xs">
                      <strong>Affected Areas:</strong> {storm.affectedAreas.join(", ")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Next update in {storm.nextUpdate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Eye className="h-12 w-12 mx-auto mb-2 text-green-500" />
              <p>No active storm systems</p>
              <p className="text-xs mt-1">Philippines region is currently clear</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weather Stations Status */}
      <Card>
        <CardHeader>
          <CardTitle>Weather Station Network</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weatherStations.map((station, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(station.status)}`}></div>
                  <div>
                    <p className="text-sm">{station.name}</p>
                    <p className="text-xs text-muted-foreground">{station.location}</p>
                  </div>
                </div>
                {station.status === 'Active' && (
                  <div className="text-right text-xs">
                    <div className="flex items-center space-x-1">
                      <Wind className="h-3 w-3" />
                      <span>{station.windSpeed} km/h</span>
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <Droplets className="h-3 w-3" />
                      <span>{station.rainfall}mm</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Satellite Information */}
      <Card className="bg-indigo-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="text-indigo-800 flex items-center space-x-2">
            <Satellite className="h-5 w-5" />
            <span>Satellite Data</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm text-indigo-700">
            <div>
              <p><strong>Last Image:</strong> {satelliteData.lastImage}</p>
              <p><strong>Coverage:</strong> {satelliteData.coverage}</p>
            </div>
            <div>
              <p><strong>Resolution:</strong> {satelliteData.resolution}</p>
              <p><strong>Bands:</strong> {satelliteData.bands.join(", ")}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}