import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MapPin, Cloud, Sun, CloudRain } from "lucide-react";

export function FriendTracking() {
  const friends = [
    {
      id: 1,
      name: "Alex Chen",
      location: "Quezon City",
      latitude: 14.6760,
      longitude: 121.0437,
      weather: "Sunny",
      temperature: 29,
      lastSeen: "2 mins ago",
      avatar: "AC",
      status: "online"
    },
    {
      id: 2,
      name: "Maria Santos",
      location: "Makati",
      latitude: 14.5547,
      longitude: 121.0244,
      weather: "Cloudy",
      temperature: 26,
      lastSeen: "5 mins ago",
      avatar: "MS",
      status: "online"
    },
    {
      id: 3,
      name: "John Reyes",
      location: "Pasig",
      latitude: 14.5764,
      longitude: 121.0851,
      weather: "Light Rain",
      temperature: 24,
      lastSeen: "1 hour ago",
      avatar: "JR",
      status: "away"
    }
  ];

  const getWeatherIcon = (weather: string) => {
    switch (weather.toLowerCase()) {
      case 'sunny':
        return <Sun className="h-4 w-4 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="h-4 w-4 text-gray-500" />;
      case 'light rain':
        return <CloudRain className="h-4 w-4 text-blue-500" />;
      default:
        return <Cloud className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4 p-4">
      {/* Mock Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Friends Map</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100"></div>
            <div className="relative z-10 text-center">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="text-sm text-muted-foreground">
                Interactive map showing friends' locations
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Manila Metro Area
              </p>
            </div>
            
            {/* Friend markers on map */}
            <div className="absolute top-4 left-6 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
            <div className="absolute bottom-8 right-8 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
            <div className="absolute top-12 right-12 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white shadow-lg"></div>
          </div>
        </CardContent>
      </Card>

      {/* Friends List */}
      <Card>
        <CardHeader>
          <CardTitle>Friends Weather Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {friends.map((friend) => (
            <div key={friend.id} className="flex items-center space-x-3 p-2 rounded-lg border">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="" alt={friend.name} />
                  <AvatarFallback>{friend.avatar}</AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(friend.status)}`}></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p>{friend.name}</p>
                  <Badge variant="outline" className="text-xs">
                    {friend.location}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  {getWeatherIcon(friend.weather)}
                  <span className="text-sm">{friend.weather}, {friend.temperature}°C</span>
                </div>
                <p className="text-xs text-muted-foreground">{friend.lastSeen}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Weather Sync Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-2">
            <Cloud className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800">Real-time weather sync enabled</p>
              <p className="text-xs text-blue-600 mt-1">
                Friends' weather conditions update automatically based on their location
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}