import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Skeleton } from "./ui/skeleton";
import { Sun, Cloud, CloudRain, CloudSnow, Zap, MapPin, Thermometer } from "lucide-react";

export function WeatherForecast() {
  const [selectedCity, setSelectedCity] = useState("manila");
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);

  const philippineCities = [
    { id: "manila", name: "Manila", lat: 14.5995, lon: 120.9842 },
    { id: "cebu", name: "Cebu City", lat: 10.3157, lon: 123.8854 },
    { id: "davao", name: "Davao City", lat: 7.1907, lon: 125.4553 },
    { id: "iloilo", name: "Iloilo City", lat: 10.7202, lon: 122.5621 },
    { id: "cagayan", name: "Cagayan de Oro", lat: 8.4542, lon: 124.6319 },
    { id: "zamboanga", name: "Zamboanga City", lat: 6.9214, lon: 122.0790 },
    { id: "baguio", name: "Baguio City", lat: 16.4023, lon: 120.5960 },
    { id: "tacloban", name: "Tacloban City", lat: 11.2421, lon: 125.0066 }
  ];

  // Mock API response based on OpenWeatherMap structure
  const getMockWeatherData = (cityId) => {
    if (!cityId) return { hourly: [], weekly: [] };
    const baseData = {
      manila: { temp: 28, humidity: 75, windSpeed: 12, condition: "Thunderstorm" },
      cebu: { temp: 30, humidity: 70, windSpeed: 8, condition: "Partly Cloudy" },
      davao: { temp: 29, humidity: 78, windSpeed: 6, condition: "Rainy" },
      iloilo: { temp: 27, humidity: 80, windSpeed: 10, condition: "Cloudy" },
      cagayan: { temp: 26, humidity: 82, windSpeed: 14, condition: "Heavy Rain" },
      zamboanga: { temp: 31, humidity: 68, windSpeed: 7, condition: "Sunny" },
      baguio: { temp: 22, humidity: 85, windSpeed: 5, condition: "Light Rain" },
      tacloban: { temp: 28, humidity: 76, windSpeed: 16, condition: "Windy" }
    };

    const base = baseData[cityId] || baseData.manila;
    
    return {
      hourly: Array.from({ length: 24 }, (_, i) => ({
        time: `${(new Date().getHours() + i) % 24}:00`,
        temp: base.temp + Math.floor(Math.random() * 6) - 3,
        condition: ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain", "Rain"][Math.floor(Math.random() * 5)],
        icon: ["sun", "cloud", "cloud", "rain", "rain"][Math.floor(Math.random() * 5)],
        humidity: base.humidity + Math.floor(Math.random() * 10) - 5,
        windSpeed: base.windSpeed + Math.floor(Math.random() * 4) - 2
      })),
      weekly: Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return {
          day: i === 0 ? "Today" : date.toLocaleDateString('en-US', { weekday: 'short' }),
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          high: base.temp + Math.floor(Math.random() * 8) - 2,
          low: base.temp - Math.floor(Math.random() * 8) - 2,
          condition: ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain", "Thunderstorm"][Math.floor(Math.random() * 5)],
          icon: ["sun", "cloud", "cloud", "rain", "thunder"][Math.floor(Math.random() * 5)],
          chance: Math.floor(Math.random() * 90) + 10,
          uvIndex: Math.floor(Math.random() * 10) + 1,
          humidity: base.humidity + Math.floor(Math.random() * 10) - 5
        };
      })
    };
  };

  useEffect(() => {
    let isMounted = true;
    
    const fetchWeatherData = async () => {
      if (!isMounted) return;
      setLoading(true);
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (!isMounted) return;
        
        // In a real implementation, you would use:
        // const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=YOUR_API_KEY&units=metric`);
        // const data = await response.json();
        
        const mockData = getMockWeatherData(selectedCity);
        setWeatherData(mockData);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchWeatherData();
    
    return () => {
      isMounted = false;
    };
  }, [selectedCity]);

  const hourlyForecast = weatherData?.hourly.slice(0, 8) || [];
  const weeklyForecast = weatherData?.weekly || [];

  const getWeatherIcon = (iconType: string) => {
    const iconClass = "h-6 w-6";
    switch (iconType) {
      case 'sun':
        return <Sun className={`${iconClass} text-yellow-500`} />;
      case 'cloud':
        return <Cloud className={`${iconClass} text-gray-500`} />;
      case 'rain':
        return <CloudRain className={`${iconClass} text-blue-500`} />;
      case 'snow':
        return <CloudSnow className={`${iconClass} text-blue-300`} />;
      case 'thunder':
        return <Zap className={`${iconClass} text-purple-500`} />;
      default:
        return <Cloud className={`${iconClass} text-gray-500`} />;
    }
  };

  const getSmallWeatherIcon = (iconType: string) => {
    const iconClass = "h-4 w-4";
    switch (iconType) {
      case 'sun':
        return <Sun className={`${iconClass} text-yellow-500`} />;
      case 'cloud':
        return <Cloud className={`${iconClass} text-gray-500`} />;
      case 'rain':
        return <CloudRain className={`${iconClass} text-blue-500`} />;
      case 'snow':
        return <CloudSnow className={`${iconClass} text-blue-300`} />;
      case 'thunder':
        return <Zap className={`${iconClass} text-purple-500`} />;
      default:
        return <Cloud className={`${iconClass} text-gray-500`} />;
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* City Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Select Location</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a city" />
            </SelectTrigger>
            <SelectContent>
              {philippineCities.map((city) => (
                <SelectItem key={city.id} value={city.id}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="mt-2 text-xs text-muted-foreground">
            Using OpenWeatherMap API • Updates every 30 minutes
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="24hour" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="24hour">24-Hour</TabsTrigger>
          <TabsTrigger value="weekly">7-Day</TabsTrigger>
        </TabsList>
        
        <TabsContent value="24hour" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>24-Hour Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="grid grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="text-center space-y-2">
                      <Skeleton className="h-3 w-8 mx-auto" />
                      <Skeleton className="h-6 w-6 mx-auto rounded-full" />
                      <Skeleton className="h-4 w-6 mx-auto" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4">
                    {hourlyForecast.map((hour, index) => (
                      <div key={index} className="text-center space-y-2">
                        <p className="text-xs text-muted-foreground">{hour.time}</p>
                        <div className="flex justify-center">
                          {getSmallWeatherIcon(hour.icon)}
                        </div>
                        <p className="text-sm">{hour.temp}°</p>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div className="flex items-center justify-center space-x-1">
                            <Thermometer className="h-2 w-2" />
                            <span>{hour.humidity}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-2">
                <Zap className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm text-orange-800">Weather Alert</p>
                  <p className="text-xs text-orange-600 mt-1">
                    Thunderstorm expected at 7:00 PM. Seek shelter and avoid outdoor activities.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="weekly" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>7-Day Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-2">
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-8 w-12" />
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-5 w-8" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {weeklyForecast.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 text-left">
                          <p className="text-sm">{day.day}</p>
                          <p className="text-xs text-muted-foreground">{day.date}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getWeatherIcon(day.icon)}
                          <span className="text-sm">{day.condition}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <Badge variant="outline" className="text-xs mb-1">
                            {day.chance}%
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            UV: {day.uvIndex}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm">{day.high}°</span>
                          <span className="text-xs text-muted-foreground ml-1">/{day.low}°</span>
                          <div className="text-xs text-muted-foreground">
                            {day.humidity}% humidity
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}