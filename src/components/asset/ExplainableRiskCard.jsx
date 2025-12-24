import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Info, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ExplainableRiskCard({ asset }) {
  const riskFactors = asset.risk_factors || [
    { factor: 'Proximity to flood plain', contribution: 35, data_source: 'Environment Canada' },
    { factor: 'Historical flooding events', contribution: 25, data_source: 'Municipal Records' },
    { factor: 'Soil saturation levels', contribution: 20, data_source: 'Agriculture Canada' },
    { factor: 'Infrastructure age', contribution: 20, data_source: 'Asset Registry' },
  ];

  const confidenceColors = {
    high: 'bg-emerald-100 text-emerald-700',
    medium: 'bg-amber-100 text-amber-700',
    low: 'bg-rose-100 text-rose-700'
  };

  const confidence = asset.risk_confidence || 'medium';

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="w-5 h-5 text-slate-500" />
            Risk Explanation
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge className={confidenceColors[confidence]}>
                  Confidence: {confidence}
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  Confidence level indicates the reliability of this assessment based on 
                  data quality and model certainty.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Plain Language Summary */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-slate-700 leading-relaxed">
              {asset.risk_explanation || 
                "Risk increased due to rising temperatures and reduced soil moisture in the region. Historical data shows increased frequency of extreme weather events affecting similar infrastructure."}
            </p>
          </div>
        </div>

        {/* Contributing Factors */}
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Contributing Factors</h4>
          <div className="space-y-3">
            {riskFactors.map((factor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-1"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{factor.factor}</span>
                  <span className="font-medium text-slate-900">{factor.contribution}%</span>
                </div>
                <Progress value={factor.contribution} className="h-2" />
                <p className="text-xs text-slate-400">Source: {factor.data_source}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Data Sources */}
        <div className="border-t border-slate-100 pt-4">
          <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            Data Sources Used
          </h4>
          <div className="flex flex-wrap gap-2">
            {['Environment Canada', 'Census Data', 'OpenStreetMap', 'Municipal Records'].map((source) => (
              <Badge key={source} variant="outline" className="text-xs">
                {source}
              </Badge>
            ))}
          </div>
        </div>

        {/* Uncertainties */}
        <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
          <div className="flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-amber-800">Known Uncertainties</p>
              <p className="text-xs text-amber-700 mt-1">
                Climate projections carry inherent uncertainty. Local conditions may vary. 
                Assessment should be reviewed with on-ground expertise.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}