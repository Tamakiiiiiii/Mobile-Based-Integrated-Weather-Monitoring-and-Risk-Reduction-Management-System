import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AlertTriangle, Shield, Umbrella, Wind, Waves, Thermometer, Info } from "lucide-react";

export function EmergencyAlerts() {
  const activeAlerts = [
    {
      id: 1,
      type: "Thunderstorm",
      severity: "High",
      title: "Severe Thunderstorm Warning",
      description: "Heavy rain and strong winds expected in Metro Manila area",
      timeRemaining: "Active for next 4 hours",
      icon: "thunder"
    },
    {
      id: 2,
      type: "Flood",
      severity: "Medium",
      title: "Flood Watch",
      description: "Potential flooding in low-lying areas due to heavy rainfall",
      timeRemaining: "Valid until midnight",
      icon: "flood"
    }
  ];

  const calamityTips = [
    {
      type: "Thunderstorm",
      icon: "thunder",
      title: "Thunderstorm Safety",
      tips: [
        "Stay indoors and avoid using electrical appliances",
        "Avoid taking baths or showers during storms",
        "Stay away from windows and doors",
        "If outdoors, seek shelter immediately",
        "Don't use phones connected to landlines"
      ]
    },
    {
      type: "Flood",
      icon: "flood",
      title: "Flood Preparedness",
      tips: [
        "Move to higher ground immediately",
        "Avoid walking or driving through flood waters",
        "Keep emergency supplies ready",
        "Listen to local emergency broadcasts",
        "Have an evacuation plan ready"
      ]
    },
    {
      type: "Heat Wave",
      icon: "heat",
      title: "Heat Wave Protection",
      tips: [
        "Stay hydrated - drink plenty of water",
        "Stay indoors during peak hours (10 AM - 4 PM)",
        "Wear light-colored, loose-fitting clothing",
        "Never leave children or pets in vehicles",
        "Use fans or air conditioning if available"
      ]
    },
    {
      type: "Strong Winds",
      icon: "wind",
      title: "Wind Storm Safety",
      tips: [
        "Secure loose outdoor objects",
        "Stay away from trees and power lines",
        "Avoid driving high-profile vehicles",
        "Close and secure all doors and windows",
        "Have backup power sources ready"
      ]
    }
  ];

  const getAlertIcon = (iconType: string) => {
    switch (iconType) {
      case 'thunder':
        return <AlertTriangle className="h-5 w-5" />;
      case 'flood':
        return <Waves className="h-5 w-5" />;
      case 'heat':
        return <Thermometer className="h-5 w-5" />;
      case 'wind':
        return <Wind className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getTipIcon = (iconType: string) => {
    const iconClass = "h-6 w-6";
    switch (iconType) {
      case 'thunder':
        return <AlertTriangle className={`${iconClass} text-yellow-600`} />;
      case 'flood':
        return <Waves className={`${iconClass} text-blue-600`} />;
      case 'heat':
        return <Thermometer className={`${iconClass} text-red-600`} />;
      case 'wind':
        return <Wind className={`${iconClass} text-gray-600`} />;
      default:
        return <Info className={`${iconClass} text-blue-600`} />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
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

  return (
    <div className="space-y-4 p-4">
      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-red-500" />
            <span>Active Weather Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeAlerts.length > 0 ? (
            activeAlerts.map((alert) => (
              <Alert key={alert.id} className="border-red-200 bg-red-50">
                <div className="flex items-start space-x-3">
                  {getAlertIcon(alert.icon)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <AlertTitle className="text-red-800">{alert.title}</AlertTitle>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <AlertDescription className="text-red-700">
                      {alert.description}
                    </AlertDescription>
                    <p className="text-xs text-red-600 mt-2">{alert.timeRemaining}</p>
                  </div>
                </div>
              </Alert>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-2 text-green-500" />
              <p>No active weather alerts</p>
              <p className="text-xs mt-1">Stay safe and check back regularly</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Emergency Banner */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1531132089310-f0e1e64bf85d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxlbWVyZ2VuY3klMjBhbGVydCUyMHdhcm5pbmd8ZW58MXx8fHwxNzU5NjU1MzYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Emergency background"
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="relative p-6 text-center">
          <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-orange-600" />
          <h3 className="text-lg mb-2">Emergency Preparedness</h3>
          <p className="text-sm text-muted-foreground">
            Stay informed about weather conditions and follow safety guidelines
          </p>
        </CardContent>
      </Card>

      {/* Safety Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Safety Tips & Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {calamityTips.map((tip, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                {getTipIcon(tip.icon)}
                <h4 className="text-sm">{tip.title}</h4>
              </div>
              <ul className="space-y-1">
                {tip.tips.map((tipItem, tipIndex) => (
                  <li key={tipIndex} className="text-xs text-muted-foreground flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>{tipItem}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Emergency Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-blue-700">Emergency Hotline</p>
              <p className="text-blue-900">911</p>
            </div>
            <div>
              <p className="text-blue-700">Weather Bureau</p>
              <p className="text-blue-900">(02) 8284-0800</p>
            </div>
            <div>
              <p className="text-blue-700">Disaster Risk Reduction</p>
              <p className="text-blue-900">(02) 8911-1406</p>
            </div>
            <div>
              <p className="text-blue-700">Red Cross</p>
              <p className="text-blue-900">(02) 8527-0000</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}