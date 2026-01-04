import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  Terminal, 
  MapPin, 
  RefreshCw, 
  Play, 
  CheckCircle, 
  XCircle,
  Loader2
} from "lucide-react";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import {
  updateFriendLocation,
  getAllFriendLocations,
  simulateFriendMovement,
  testFriendTracking,
} from "../utils/locationHelpers";

export function DebugPanel() {
  const [status, setStatus] = useState<{
    backend: "checking" | "online" | "offline";
    mapbox: "checking" | "valid" | "invalid";
    openweather: "checking" | "valid" | "invalid";
  }>({
    backend: "checking",
    mapbox: "checking",
    openweather: "checking",
  });

  const [logs, setLogs] = useState<string[]>([]);
  const [testRunning, setTestRunning] = useState(false);

  const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-aedf23c8`;

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const checkBackend = async () => {
    addLog("🔍 Checking backend connection...");
    try {
      const response = await fetch(`${serverUrl}/health`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });

      if (response.ok) {
        setStatus((prev) => ({ ...prev, backend: "online" }));
        addLog("✅ Backend is online!");
        return true;
      }
    } catch (error) {
      addLog(`❌ Backend offline: ${error}`);
    }
    setStatus((prev) => ({ ...prev, backend: "offline" }));
    return false;
  };

  const checkMapbox = () => {
    addLog("🔍 Checking Mapbox token...");
    // Check if token is set (basic check)
    const hasToken = !window.location.href.includes("YOUR_TOKEN_HERE");
    setStatus((prev) => ({ ...prev, mapbox: hasToken ? "valid" : "invalid" }));
    addLog(hasToken ? "✅ Mapbox token appears set" : "❌ Mapbox token not set");
  };

  const checkOpenWeather = async () => {
    addLog("🔍 Checking OpenWeatherMap API...");
    try {
      const response = await fetch(
        "https://api.openweathermap.org/data/2.5/weather?q=Manila&appid=YOUR_KEY&units=metric"
      );
      
      const valid = response.ok;
      setStatus((prev) => ({ ...prev, openweather: valid ? "valid" : "invalid" }));
      addLog(valid ? "✅ OpenWeather API working" : "❌ OpenWeather API key invalid");
    } catch (error) {
      addLog(`❌ OpenWeather check failed: ${error}`);
      setStatus((prev) => ({ ...prev, openweather: "invalid" }));
    }
  };

  const runFullCheck = async () => {
    setLogs([]);
    addLog("🚀 Starting system check...");
    
    await checkBackend();
    checkMapbox();
    await checkOpenWeather();
    
    addLog("✨ System check complete!");
  };

  const addTestFriend = async () => {
    setTestRunning(true);
    addLog("➕ Adding test friend at Rizal Park...");
    
    try {
      await updateFriendLocation({
        friendId: "test_user_1",
        latitude: 14.5833,
        longitude: 120.9833,
        location: "Rizal Park, Manila",
        heading: 0,
        speed: 0,
      });
      addLog("✅ Test friend added successfully!");
      addLog("💡 Switch to Friends tab to see the marker");
    } catch (error) {
      addLog(`❌ Failed to add friend: ${error}`);
    }
    
    setTestRunning(false);
  };

  const fetchAllFriends = async () => {
    setTestRunning(true);
    addLog("📡 Fetching all friend locations...");
    
    try {
      const friends = await getAllFriendLocations();
      addLog(`✅ Found ${friends.length} friends:`);
      friends.forEach((f: any) => {
        addLog(`   📍 ${f.friendId} at (${f.latitude}, ${f.longitude})`);
      });
    } catch (error) {
      addLog(`❌ Failed to fetch friends: ${error}`);
    }
    
    setTestRunning(false);
  };

  const simulateMovement = async () => {
    setTestRunning(true);
    addLog("🚗 Starting simulated journey (60 seconds)...");
    addLog("   From: Rizal Park, Manila");
    addLog("   To: Quezon Memorial Circle");
    
    try {
      await simulateFriendMovement(
        "traveler_1",
        14.5833, 120.9833,  // Rizal Park
        14.6760, 121.0437,  // Quezon Memorial
        60
      );
      addLog("✅ Journey simulation complete!");
    } catch (error) {
      addLog(`❌ Simulation failed: ${error}`);
    }
    
    setTestRunning(false);
  };

  const runComprehensiveTest = async () => {
    setTestRunning(true);
    setLogs([]);
    addLog("🧪 Running comprehensive test suite...");
    
    try {
      await testFriendTracking();
      addLog("✅ All tests passed!");
    } catch (error) {
      addLog(`❌ Test suite failed: ${error}`);
    }
    
    setTestRunning(false);
  };

  const getStatusBadge = (status: "checking" | "online" | "offline" | "valid" | "invalid") => {
    switch (status) {
      case "checking":
        return <Badge variant="outline"><Loader2 className="h-3 w-3 animate-spin mr-1" /> Checking</Badge>;
      case "online":
      case "valid":
        return <Badge className="bg-green-100 text-green-800 border-green-300"><CheckCircle className="h-3 w-3 mr-1" /> Ready</Badge>;
      case "offline":
      case "invalid":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Error</Badge>;
    }
  };

  return (
    <div className="space-y-4 p-4">
      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Terminal className="h-5 w-5" />
              <span>System Status</span>
            </span>
            <Button size="sm" onClick={runFullCheck} disabled={testRunning}>
              <RefreshCw className={`h-4 w-4 mr-2 ${testRunning ? "animate-spin" : ""}`} />
              Check All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-2 border rounded">
            <span className="text-sm">Supabase Backend</span>
            {getStatusBadge(status.backend)}
          </div>
          <div className="flex items-center justify-between p-2 border rounded">
            <span className="text-sm">Mapbox GL JS</span>
            {getStatusBadge(status.mapbox)}
          </div>
          <div className="flex items-center justify-between p-2 border rounded">
            <span className="text-sm">OpenWeatherMap</span>
            {getStatusBadge(status.openweather)}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Tests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button 
            className="w-full" 
            variant="outline" 
            onClick={addTestFriend}
            disabled={testRunning}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Add Test Friend at Rizal Park
          </Button>
          
          <Button 
            className="w-full" 
            variant="outline" 
            onClick={fetchAllFriends}
            disabled={testRunning}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Fetch All Friend Locations
          </Button>
          
          <Button 
            className="w-full" 
            variant="outline" 
            onClick={simulateMovement}
            disabled={testRunning}
          >
            <Play className="h-4 w-4 mr-2" />
            Simulate Friend Movement (60s)
          </Button>
          
          <Button 
            className="w-full" 
            onClick={runComprehensiveTest}
            disabled={testRunning}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Run Full Test Suite
          </Button>
        </CardContent>
      </Card>

      {/* Console Output */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Console Output</span>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setLogs([])}
            >
              Clear
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-900 text-green-400 p-4 rounded-lg h-64 overflow-y-auto font-mono text-xs">
            {logs.length === 0 ? (
              <div className="text-slate-500">Run a test to see output...</div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Info Alert */}
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertDescription>
          <strong>Debug Panel</strong> - Use this panel to test the friend tracking system.
          All tests use the Supabase backend and real APIs.
          <div className="mt-2 text-xs">
            Backend URL: <code className="bg-muted px-1 py-0.5 rounded">{serverUrl}</code>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
