import React from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Droplets, Flame, Thermometer, CloudLightning, Layers } from 'lucide-react';

const RISK_TYPES = [
  { id: 'all', label: 'All Risks', icon: Layers, color: 'bg-slate-500' },
  { id: 'flood', label: 'Flood Risk', icon: Droplets, color: 'bg-blue-500' },
  { id: 'wildfire', label: 'Wildfire Risk', icon: Flame, color: 'bg-orange-500' },
  { id: 'heat', label: 'Heat Risk', icon: Thermometer, color: 'bg-red-500' },
  { id: 'storm', label: 'Storm Risk', icon: CloudLightning, color: 'bg-purple-500' },
];

const TIME_HORIZONS = [
  { id: 'immediate', label: 'Current' },
  { id: '10_years', label: '10 Years' },
  { id: '30_years', label: '30 Years' },
];

export default function MapFilters({ 
  selectedRisk, 
  onRiskChange, 
  selectedTimeHorizon, 
  onTimeHorizonChange,
  assetCount 
}) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-48">
          <label className="text-xs font-medium text-slate-500 mb-2 block">Climate Risk Type</label>
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
        
        <div className="w-40">
          <label className="text-xs font-medium text-slate-500 mb-2 block">Time Horizon</label>
          <Select value={selectedTimeHorizon} onValueChange={onTimeHorizonChange}>
            <SelectTrigger>
              <SelectValue />
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

        <div className="text-right">
          <p className="text-xs text-slate-500">Showing</p>
          <Badge variant="secondary" className="text-lg font-bold">
            {assetCount} assets
          </Badge>
        </div>
      </div>
    </div>
  );
}