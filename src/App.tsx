import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Toaster } from "./components/ui/sonner";
import { WeatherDashboard } from "./components/WeatherDashboard";
import { MapboxFriendTrackingWithBackend } from "./components/MapboxFriendTrackingWithBackend";
import { WeatherForecast } from "./components/WeatherForecast";
import { MapboxStormTracking } from "./components/MapboxStormTracking";
import { EmergencyAlerts } from "./components/EmergencyAlerts";
import { SOSButton } from "./components/SOSButton";
import { DebugPanel } from "./components/DebugPanel";
import { Cloud, Users, Calendar, Satellite, Shield, AlertTriangle, Terminal } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("weather");

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cloud className="h-6 w-6 text-blue-600" />
            <h1>WeatherGuard</h1>
          </div>
          <div className="text-xs text-muted-foreground">
            Manila, PH
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsContent value="weather" className="mt-0 flex-1 overflow-y-auto">
            <WeatherDashboard />
          </TabsContent>
          
          <TabsContent value="friends" className="mt-0 flex-1 overflow-y-auto">
            <MapboxFriendTrackingWithBackend />
          </TabsContent>
          
          <TabsContent value="forecast" className="mt-0 flex-1 overflow-y-auto">
            <WeatherForecast />
          </TabsContent>
          
          <TabsContent value="storms" className="mt-0 flex-1 overflow-y-auto">
            <MapboxStormTracking />
          </TabsContent>
          
          <TabsContent value="alerts" className="mt-0 flex-1 overflow-y-auto">
            <EmergencyAlerts />
          </TabsContent>
          
          <TabsContent value="sos" className="mt-0 flex-1 overflow-y-auto">
            <SOSButton />
          </TabsContent>

          <TabsContent value="debug" className="mt-0 flex-1 overflow-y-auto">
            <DebugPanel />
          </TabsContent>

          {/* Bottom Navigation */}
          <div className="flex-shrink-0 bg-background/95 backdrop-blur border-t">
            <TabsList className="grid w-full grid-cols-7 h-16 bg-transparent">
              <TabsTrigger 
                value="weather" 
                className="flex flex-col space-y-1 h-full data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
              >
                <Cloud className="h-4 w-4" />
                <span className="text-xs">Weather</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="friends" 
                className="flex flex-col space-y-1 h-full data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
              >
                <Users className="h-4 w-4" />
                <span className="text-xs">Friends</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="forecast" 
                className="flex flex-col space-y-1 h-full data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
              >
                <Calendar className="h-4 w-4" />
                <span className="text-xs">Forecast</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="storms" 
                className="flex flex-col space-y-1 h-full data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600"
              >
                <Satellite className="h-4 w-4" />
                <span className="text-xs">Storms</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="alerts" 
                className="flex flex-col space-y-1 h-full data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600"
              >
                <Shield className="h-4 w-4" />
                <span className="text-xs">Alerts</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="sos" 
                className="flex flex-col space-y-1 h-full data-[state=active]:bg-red-50 data-[state=active]:text-red-600"
              >
                <AlertTriangle className="h-4 w-4" />
                <span className="text-xs">SOS</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="debug" 
                className="flex flex-col space-y-1 h-full data-[state=active]:bg-purple-50 data-[state=active]:text-purple-600"
              >
                <Terminal className="h-4 w-4" />
                <span className="text-xs">Debug</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      </div>

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}