import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, Users, MapPin } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const ASSET_ICONS = {
  road: '🛣️',
  bridge: '🌉',
  hospital: '🏥',
  school: '🏫',
  power_station: '⚡',
  water_treatment: '💧',
  transit_hub: '🚉',
  emergency_services: '🚨',
  telecommunications: '📡',
  dam: '🏗️'
};

export default function PriorityAssetsList({ assets, onAssetClick }) {
  const sortedAssets = [...assets]
    .sort((a, b) => (b.priority_score || b.overall_risk_score || 0) - (a.priority_score || a.overall_risk_score || 0))
    .slice(0, 5);

  const getRiskColor = (score) => {
    if (score < 30) return 'bg-emerald-100 text-emerald-700';
    if (score < 60) return 'bg-amber-100 text-amber-700';
    return 'bg-rose-100 text-rose-700';
  };

  return (
    <div className="space-y-3">
      {sortedAssets.map((asset, index) => (
        <motion.div
          key={asset.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onAssetClick?.(asset)}
          className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer border border-slate-100"
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl">{ASSET_ICONS[asset.asset_type] || '🏛️'}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-slate-900 truncate">{asset.name}</h4>
                <Badge className={getRiskColor(asset.overall_risk_score || 0)}>
                  {asset.overall_risk_score || 0}%
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {asset.location?.municipality || 'Unknown'}
                </span>
                {asset.population_served && (
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {asset.population_served.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500">Priority</div>
              <div className="font-bold text-slate-900">#{index + 1}</div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}