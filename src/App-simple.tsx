import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Cloud } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cloud className="h-6 w-6 text-blue-600" />
            <h1 className="text-lg">WeatherGuard</h1>
          </div>
          <div className="text-xs text-muted-foreground">
            Manila, PH
          </div>
        </div>

        {/* Simple Content */}
        <Card>
          <CardHeader>
            <CardTitle>Weather Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <div className="text-3xl">28°C</div>
              <div className="text-muted-foreground">Partly Cloudy</div>
              <div className="text-sm">Manila, Philippines</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Humidity</div>
                <div>75%</div>
              </div>
              <div>
                <div className="text-muted-foreground">Wind</div>
                <div>12 km/h</div>
              </div>
              <div>
                <div className="text-muted-foreground">Visibility</div>
                <div>8 km</div>
              </div>
              <div>
                <div className="text-muted-foreground">UV Index</div>
                <div>6</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground">
          WeatherGuard - Your Personal Weather Assistant
        </div>
      </div>
    </div>
  );
}