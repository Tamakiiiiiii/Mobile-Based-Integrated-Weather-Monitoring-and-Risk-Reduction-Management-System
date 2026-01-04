import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { AlertTriangle, Phone, MapPin, Clock } from "lucide-react";
import { toast } from "sonner@2.0.3";

export function SOSButton() {
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [sosTimer, setSosTimer] = useState(0);

  const friends = [
    { name: "Alex Chen", phone: "+63 917 123 4567", status: "notified" },
    { name: "Maria Santos", phone: "+63 917 234 5678", status: "delivered" },
    { name: "John Reyes", phone: "+63 917 345 6789", status: "seen" }
  ];

  const emergencyContacts = [
    { name: "Emergency Hotline", phone: "911", type: "emergency" },
    { name: "Local Police", phone: "(02) 8722-0650", type: "police" },
    { name: "Fire Department", phone: "(02) 8426-0246", type: "fire" },
    { name: "Medical Emergency", phone: "(02) 8789-7700", type: "medical" }
  ];

  const handleSOSPress = () => {
    if (!isSOSActive) {
      setIsSOSActive(true);
      setSosTimer(Date.now());
      
      // Show toast notification
      toast.error("SOS Alert Activated!", {
        description: "Emergency message sent to your friends and emergency contacts.",
        duration: 5000,
      });

      // Auto-deactivate after 5 minutes for demo
      setTimeout(() => {
        setIsSOSActive(false);
        setSosTimer(0);
      }, 300000);
    } else {
      setIsSOSActive(false);
      setSosTimer(0);
      toast.success("SOS Alert Deactivated");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'seen':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'notified':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatElapsedTime = () => {
    if (!sosTimer) return "00:00";
    const elapsed = Math.floor((Date.now() - sosTimer) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4 p-4">
      {/* SOS Button */}
      <Card className={`text-center ${isSOSActive ? 'bg-red-50 border-red-200' : ''}`}>
        <CardContent className="p-6">
          <div className="space-y-4">
            <AlertTriangle className={`h-16 w-16 mx-auto ${isSOSActive ? 'text-red-600 animate-pulse' : 'text-gray-400'}`} />
            
            <div>
              <h2 className={`text-lg mb-2 ${isSOSActive ? 'text-red-800' : ''}`}>
                Emergency SOS
              </h2>
              <p className={`text-sm mb-4 ${isSOSActive ? 'text-red-600' : 'text-muted-foreground'}`}>
                {isSOSActive 
                  ? "SOS Alert is active. Your location and emergency message have been sent."
                  : "Press and hold to send emergency alert to friends and emergency services"
                }
              </p>
            </div>

            {isSOSActive && (
              <div className="flex items-center justify-center space-x-2 text-red-600">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Active for: {formatElapsedTime()}</span>
              </div>
            )}

            <Button
              size="lg"
              variant={isSOSActive ? "destructive" : "outline"}
              className={`w-full h-16 text-lg ${
                isSOSActive 
                  ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                  : 'border-red-200 text-red-600 hover:bg-red-50'
              }`}
              onClick={handleSOSPress}
            >
              {isSOSActive ? 'STOP SOS ALERT' : 'EMERGENCY SOS'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active SOS Status */}
      {isSOSActive && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-red-800">
            <strong>Emergency Alert Active</strong><br />
            Your current location (Manila, Philippines) and emergency message have been sent to your emergency contacts.
          </AlertDescription>
        </Alert>
      )}

      {/* Friends Notification Status */}
      <Card>
        <CardContent className="p-4">
          <h3 className="mb-3 flex items-center space-x-2">
            <Phone className="h-4 w-4" />
            <span>Friends Alert Status</span>
          </h3>
          <div className="space-y-2">
            {friends.map((friend, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                <div>
                  <p className="text-sm">{friend.name}</p>
                  <p className="text-xs text-muted-foreground">{friend.phone}</p>
                </div>
                <Badge className={getStatusColor(friend.status)}>
                  {friend.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card>
        <CardContent className="p-4">
          <h3 className="mb-3 flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Emergency Contacts</span>
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {emergencyContacts.map((contact, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-between h-auto p-3"
                onClick={() => {
                  toast.success(`Calling ${contact.name}...`, {
                    description: `Dialing ${contact.phone}`,
                  });
                }}
              >
                <div className="text-left">
                  <p className="text-sm">{contact.name}</p>
                  <p className="text-xs text-muted-foreground">{contact.phone}</p>
                </div>
                <Phone className="h-4 w-4" />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Location Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-2">
            <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800">Current Location Sharing</p>
              <p className="text-xs text-blue-600 mt-1">
                Location: Manila, Philippines (14.5995° N, 120.9842° E)
              </p>
              <p className="text-xs text-blue-600">
                Last updated: Just now • Accuracy: ±5 meters
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SOS Message Preview */}
      <Card>
        <CardContent className="p-4">
          <h3 className="mb-2">SOS Message Template</h3>
          <div className="bg-muted p-3 rounded-lg text-sm">
            <p className="text-muted-foreground">
              "🚨 EMERGENCY ALERT 🚨<br />
              I need immediate assistance. My current location is Manila, Philippines (14.5995° N, 120.9842° E). 
              Please contact emergency services or come to my location if possible. 
              This message was sent automatically via Weather Advisory App."
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}