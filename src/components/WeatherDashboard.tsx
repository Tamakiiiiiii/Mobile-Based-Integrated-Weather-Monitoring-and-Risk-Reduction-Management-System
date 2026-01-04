import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Cloud, Droplets, Wind, Eye, Thermometer, Sun } from "lucide-react";

export function WeatherDashboard() {
  const currentWeather = {
    location: "Manila, Philippines",
    temperature: 28,
    condition: "Partly Cloudy",
    humidity: 75,
    windSpeed: 12,
    visibility: 8,
    uvIndex: 6,
    feelsLike: 32,
    airQuality: "Good"
  };

  return (
    <div className="space-y-4 p-4">
      {/* Current Weather Card */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1627817783271-1b8d21266a74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5ueSUyMHdlYXRoZXIlMjBza3klMjBjbG91ZHN8ZW58MXx8fHwxNzU5NjU1MzU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Weather background"
            className="w-full h-full object-cover"
          />
        </div>
        <CardHeader className="relative">
          <CardTitle className="flex items-center justify-between">
            <span>{currentWeather.location}</span>
            <Badge variant="secondary">{currentWeather.condition}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline">
                <span className="text-4xl font-medium">{currentWeather.temperature}°</span>
                <span className="text-muted-foreground ml-1">C</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Feels like {currentWeather.feelsLike}°C
              </p>
            </div>
            <Sun className="h-16 w-16 text-yellow-500" />
          </div>
        </CardContent>
      </Card>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Droplets className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Humidity</p>
                <p className="text-lg">{currentWeather.humidity}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Wind className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-muted-foreground">Wind</p>
                <p className="text-lg">{currentWeather.windSpeed} km/h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-indigo-500" />
              <div>
                <p className="text-sm text-muted-foreground">Visibility</p>
                <p className="text-lg">{currentWeather.visibility} km</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Thermometer className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">UV Index</p>
                <p className="text-lg">{currentWeather.uvIndex}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Air Quality */}
      <Card>
        <CardHeader>
          <CardTitle>Air Quality</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span>Current Status</span>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {currentWeather.airQuality}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}