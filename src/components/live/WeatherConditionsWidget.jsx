import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { govData } from '@/api/dataClient';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, Droplets, Wind, Thermometer, Sun, CloudRain } from 'lucide-react';

export default function WeatherConditionsWidget() {
  const { data: weatherAlerts = [] } = useQuery({
    queryKey: ['weather-alerts'],
    queryFn: () => govData.entities.RiskAlert.filter({ 
      alert_type: 'weather',
      status: 'active'
    }, '-issued_at', 20),
    refetchInterval: 60000, // 1 minute
  });

  // Count alerts by category
  const alertCounts = {
    flood_warning: 0,
    heat_advisory: 0,
    storm_warning: 0,
    wildfire_alert: 0
  };

  weatherAlerts.forEach(alert => {
    if (alertCounts.hasOwnProperty(alert.alert_category)) {
      alertCounts[alert.alert_category]++;
    }
  });

  const conditions = [
    {
      icon: Droplets,
      label: 'Flood Warnings',
      count: alertCounts.flood_warning,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Thermometer,
      label: 'Heat Advisories',
      count: alertCounts.heat_advisory,
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      icon: Wind,
      label: 'Storm Warnings',
      count: alertCounts.storm_warning,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      icon: CloudRain,
      label: 'Wildfire Alerts',
      count: alertCounts.wildfire_alert,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Cloud className="w-5 h-5 text-slate-500" />
          Active Weather Conditions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {conditions.map((condition, index) => {
            const Icon = condition.icon;
            return (
              <div
                key={index}
                className={`p-4 rounded-lg ${condition.bgColor} border border-slate-100 transition-all hover:shadow-sm`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-5 h-5 ${condition.color}`} />
                  {condition.count > 0 && (
                    <Badge className="bg-rose-500 text-white">
                      {condition.count}
                    </Badge>
                  )}
                </div>
                <p className="text-sm font-medium text-slate-700">{condition.label}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {condition.count === 0 ? 'None active' : `${condition.count} active`}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-start gap-2">
            <Sun className="w-4 h-4 text-blue-600 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-blue-900">Data Source</p>
              <p className="text-xs text-blue-700 mt-0.5">
                Environment Canada • Updates every minute
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}