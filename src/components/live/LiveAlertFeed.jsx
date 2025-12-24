import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { govData } from '@/api/dataClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  Flame, 
  Droplets, 
  Wind, 
  Thermometer, 
  Clock,
  MapPin,
  Users,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const SEVERITY_STYLES = {
  critical: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', icon: 'text-rose-500' },
  high: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: 'text-orange-500' },
  medium: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: 'text-amber-500' },
  low: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'text-blue-500' },
  info: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700', icon: 'text-slate-500' }
};

const CATEGORY_ICONS = {
  flood_warning: Droplets,
  heat_advisory: Thermometer,
  storm_warning: Wind,
  wildfire_alert: Flame,
  infrastructure_failure: AlertTriangle,
  rapid_risk_change: AlertTriangle
};

export default function LiveAlertFeed({ maxAlerts = 10, autoRefresh = true }) {
  const [selectedAlert, setSelectedAlert] = useState(null);

  const { data: alerts = [], isLoading, refetch } = useQuery({
    queryKey: ['live-alerts'],
    queryFn: () => govData.entities.RiskAlert.filter({ status: 'active' }, '-issued_at', maxAlerts),
    refetchInterval: autoRefresh ? 30000 : false, // Refresh every 30 seconds
  });

  const handleResolveAlert = async (alert) => {
    await govData.entities.RiskAlert.update(alert.id, { status: 'resolved' });
    refetch();
  };

  const getCategoryIcon = (category) => {
    return CATEGORY_ICONS[category] || AlertTriangle;
  };

  return (
    <Card className="h-full">
      <CardHeader className="border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="relative">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              {alerts.length > 0 && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full"
                />
              )}
            </div>
            Live Alert Feed
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Live
            </Badge>
            <Badge variant="secondary">{alerts.length} Active</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-slate-200 border-t-slate-600 rounded-full mx-auto" />
            <p className="text-sm text-slate-500 mt-2">Loading alerts...</p>
          </div>
        ) : alerts.length === 0 ? (
          <div className="p-8 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-700">All Clear</h3>
            <p className="text-sm text-slate-500 mt-1">No active alerts at this time</p>
          </div>
        ) : (
          <div className="max-h-[600px] overflow-y-auto">
            <AnimatePresence mode="popLayout">
              {alerts.map((alert, index) => {
                const style = SEVERITY_STYLES[alert.severity] || SEVERITY_STYLES.info;
                const Icon = getCategoryIcon(alert.alert_category);
                
                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`border-b border-slate-100 ${style.bg} hover:bg-opacity-80 transition-all cursor-pointer`}
                    onClick={() => setSelectedAlert(alert)}
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${style.bg} border ${style.border}`}>
                          <Icon className={`w-5 h-5 ${style.icon}`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className={`font-semibold ${style.text}`}>{alert.title}</h4>
                            <Badge 
                              className={`flex-shrink-0 ${style.bg} ${style.text} border ${style.border}`}
                            >
                              {alert.severity}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                            {alert.description}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {alert.issued_at ? formatDistanceToNow(new Date(alert.issued_at), { addSuffix: true }) : 'Just now'}
                            </span>
                            {alert.affected_population && (
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {alert.affected_population.toLocaleString()} affected
                              </span>
                            )}
                            {alert.geolocation && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {alert.geolocation.radius_km}km radius
                              </span>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {alert.data_source}
                            </Badge>
                          </div>

                          {alert.risk_score_change && alert.risk_score_change > 0 && (
                            <div className="mt-2 flex items-center gap-2 text-xs">
                              <div className="flex items-center gap-1 text-rose-600 font-medium">
                                ↑ +{alert.risk_score_change} points
                              </div>
                              <span className="text-slate-400">
                                ({alert.previous_risk_score} → {alert.new_risk_score})
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {alert.recommended_actions && alert.recommended_actions.length > 0 && (
                        <div className="mt-3 ml-14 space-y-1">
                          <p className="text-xs font-medium text-slate-600 mb-1">Recommended Actions:</p>
                          {alert.recommended_actions.slice(0, 2).map((action, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                              <span className="text-emerald-500 mt-0.5">•</span>
                              <span>{action}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-3 ml-14 flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResolveAlert(alert);
                          }}
                          className="h-7 text-xs"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Mark Resolved
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}