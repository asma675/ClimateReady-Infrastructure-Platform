import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Droplets,
  Flame,
  Thermometer,
  CloudLightning,
  Layers
} from 'lucide-react';

/* =========================
   Risk Type Filters
========================= */
const RISK_TYPES = [
  { id: 'all', label: 'All Risks', icon: Layers },
  { id: 'flood', label: 'Flood Risk', icon: Droplets },
  { id: 'wildfire', label: 'Wildfire Risk', icon: Flame },
  { id: 'heat', label: 'Heat Risk', icon: Thermometer },
  { id: 'storm', label: 'Storm Risk', icon: CloudLightning },
];

/* =========================
   FIXED: Time Horizons
   (must match asset data)
========================= */
const TIME_HORIZONS = [
  { id: 'current', label: 'Current' },
  { id: '2030', label: '2030' },
  { id: '2050', label: '2050' },
];

export default function MapFilters({
  selectedRisk,
  onRiskChange,
  selectedTimeHorizon,
  onTimeHorizonChange,
  assetCount,
}) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
      <div className="flex flex-wrap items-center gap-4">

        {/* Climate Risk Type */}
        <div className="flex-1 min-w-48">
          <label className="text-xs font-medium text-slate-500 mb-2 block">
            Climate Risk Type
          </label>
          <div className="flex flex-wrap gap-2">
            {RISK_TYPES.map((risk) => {
              const Icon = risk.icon;
              const isActive = selectedRisk === risk.id;

              return (
                <Button
                  key={risk.id}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => onRiskChange(risk.id)}
                  className={`gap-2 ${isActive ? 'bg-slate-900' : ''}`}
                >
                  <Icon className="w-4 h-4" />
                  {risk.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Time Horizon */}
        <div className="w-40">
          <label className="text-xs font-medium text-slate-500 mb-2 block">
            Time Horizon
          </label>
          <Select
            value={selectedTimeHorizon}
            onValueChange={onTimeHorizonChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select horizon" />
            </SelectTrigger>
            <SelectContent>
              {TIME_HORIZONS.map((horizon) => (
                <SelectItem key={horizon.id} value={horizon.id}>
                  {horizon.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Asset Count */}
        <div className="text-right ml-auto">
          <p className="text-xs text-slate-500">Showing</p>
          <Badge variant="secondary" className="text-lg font-bold">
            {assetCount} assets
          </Badge>
        </div>

      </div>
    </div>
  );
}
