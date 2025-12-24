import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, MapPin, Calendar, Users, DollarSign, FileText } from 'lucide-react';
import RiskScoreGauge from '../dashboard/RiskScoreGauge';
import RiskBreakdownChart from '../dashboard/RiskBreakdownChart';
import ExplainableRiskCard from '../asset/ExplainableRiskCard';
import VulnerabilityOverlay from '../asset/VulnerabilityOverlay';

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

const CONDITION_COLORS = {
  excellent: 'bg-emerald-100 text-emerald-700',
  good: 'bg-blue-100 text-blue-700',
  fair: 'bg-amber-100 text-amber-700',
  poor: 'bg-orange-100 text-orange-700',
  critical: 'bg-rose-100 text-rose-700'
};

export default function AssetDetailModal({ asset, open, onClose, onCreateProject }) {
  if (!asset) return null;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value || 0);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{ASSET_ICONS[asset.asset_type]}</span>
            <div>
              <DialogTitle className="text-xl">{asset.name}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="capitalize">
                  {asset.asset_type?.replace('_', ' ')}
                </Badge>
                <Badge className={CONDITION_COLORS[asset.condition_rating] || 'bg-slate-100 text-slate-700'}>
                  {asset.condition_rating || 'Unknown'} Condition
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-4 gap-4 py-4 border-b border-slate-100">
          <div className="text-center">
            <MapPin className="w-5 h-5 text-slate-400 mx-auto mb-1" />
            <p className="text-xs text-slate-500">Location</p>
            <p className="text-sm font-medium">{asset.location?.municipality || 'N/A'}, {asset.location?.province || ''}</p>
          </div>
          <div className="text-center">
            <Calendar className="w-5 h-5 text-slate-400 mx-auto mb-1" />
            <p className="text-xs text-slate-500">Year Built</p>
            <p className="text-sm font-medium">{asset.year_built || 'Unknown'}</p>
          </div>
          <div className="text-center">
            <Users className="w-5 h-5 text-slate-400 mx-auto mb-1" />
            <p className="text-xs text-slate-500">Population Served</p>
            <p className="text-sm font-medium">{(asset.population_served || 0).toLocaleString()}</p>
          </div>
          <div className="text-center">
            <DollarSign className="w-5 h-5 text-slate-400 mx-auto mb-1" />
            <p className="text-xs text-slate-500">Replacement Value</p>
            <p className="text-sm font-medium">{formatCurrency(asset.replacement_value)}</p>
          </div>
        </div>

        <Tabs defaultValue="risk" className="mt-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
            <TabsTrigger value="explanation">AI Explanation</TabsTrigger>
            <TabsTrigger value="equity">Equity Lens</TabsTrigger>
          </TabsList>

          <TabsContent value="risk" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-center">
                <RiskScoreGauge 
                  score={asset.overall_risk_score || 0} 
                  size={180} 
                  label="Overall Risk Score" 
                />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Risk Breakdown</h4>
                <RiskBreakdownChart data={asset.climate_risks} />
              </div>
            </div>
            
            {asset.recommended_actions?.length > 0 && (
              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Recommended Actions
                </h4>
                <ul className="space-y-2">
                  {asset.recommended_actions.map((action, idx) => (
                    <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                      <span className="text-emerald-500 mt-1">•</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </TabsContent>

          <TabsContent value="explanation" className="mt-4">
            <ExplainableRiskCard asset={asset} />
          </TabsContent>

          <TabsContent value="equity" className="mt-4">
            <VulnerabilityOverlay asset={asset} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => onCreateProject?.(asset)} className="bg-slate-900">
            Create Investment Project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}