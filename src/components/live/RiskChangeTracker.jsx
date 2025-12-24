import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { govData } from '@/api/dataClient';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle, Activity } from 'lucide-react';

export default function RiskChangeTracker({ timeWindow = 24 }) {
  const { data: rapidChangeAlerts = [] } = useQuery({
    queryKey: ['rapid-change-alerts'],
    queryFn: () => govData.entities.RiskAlert.filter({ 
      alert_category: 'rapid_risk_change',
      status: 'active'
    }, '-issued_at', 10),
    refetchInterval: 30000,
  });

  const totalRiskIncrease = rapidChangeAlerts.reduce((sum, alert) => 
    sum + (alert.risk_score_change || 0), 0
  );

  const avgChange = rapidChangeAlerts.length > 0 
    ? Math.round(totalRiskIncrease / rapidChangeAlerts.length) 
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="w-5 h-5 text-orange-500" />
          Rapid Risk Changes (24h)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">Assets Affected</p>
            <p className="text-2xl font-bold text-slate-900">{rapidChangeAlerts.length}</p>
          </div>
          <div className="text-center p-3 bg-rose-50 rounded-lg">
            <p className="text-xs text-rose-600 mb-1">Total Increase</p>
            <p className="text-2xl font-bold text-rose-600">+{totalRiskIncrease}</p>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <p className="text-xs text-orange-600 mb-1">Avg Change</p>
            <p className="text-2xl font-bold text-orange-600">+{avgChange}</p>
          </div>
        </div>

        <div className="space-y-3">
          {rapidChangeAlerts.slice(0, 5).map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-3 bg-slate-50 rounded-lg border border-slate-100"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <span className="font-medium text-sm text-slate-700 truncate">
                    {alert.title?.replace('Rapid Risk Increase - ', '')}
                  </span>
                </div>
                <Badge className="bg-rose-100 text-rose-700 border-rose-200">
                  +{alert.risk_score_change}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{alert.previous_risk_score}</span>
                <TrendingUp className="w-3 h-3 text-rose-500" />
                <span className="font-medium text-slate-700">{alert.new_risk_score}</span>
                <span className="ml-auto text-slate-400">
                  {alert.severity} severity
                </span>
              </div>
            </motion.div>
          ))}

          {rapidChangeAlerts.length === 0 && (
            <div className="text-center py-8">
              <TrendingDown className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm text-slate-600">No rapid changes detected</p>
              <p className="text-xs text-slate-400 mt-1">All assets within normal parameters</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}