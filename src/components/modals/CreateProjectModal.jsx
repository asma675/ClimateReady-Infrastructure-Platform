import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';

const PROJECT_TYPES = [
  { value: 'repair', label: 'Repair' },
  { value: 'upgrade', label: 'Upgrade' },
  { value: 'replacement', label: 'Replacement' },
  { value: 'new_construction', label: 'New Construction' },
  { value: 'resilience_improvement', label: 'Resilience Improvement' },
];

export default function CreateProjectModal({ open, onClose, asset, onSubmit }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: asset ? `${asset.name} - Resilience Upgrade` : '',
    description: '',
    project_type: 'resilience_improvement',
    estimated_cost: '',
    risk_reduction_impact: 30,
    timeline_months: 12,
    funding_source: '',
    justification: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const projectData = {
      ...formData,
      asset_id: asset?.id,
      estimated_cost: parseFloat(formData.estimated_cost) || 0,
      population_benefit: asset?.population_served || 0,
      equity_score: calculateEquityScore(asset),
      cost_benefit_ratio: calculateCostBenefit(formData, asset),
      status: 'proposed'
    };

    await onSubmit(projectData);
    setLoading(false);
    onClose();
  };

  const calculateEquityScore = (asset) => {
    if (!asset?.vulnerability_indicators) return 50;
    const vi = asset.vulnerability_indicators;
    return Math.min(100, Math.round(
      (vi.seniors_population_pct || 0) * 0.3 +
      (vi.low_income_pct || 0) * 0.3 +
      (vi.indigenous_community ? 30 : 0) +
      (vi.remote_location ? 10 : 0)
    ));
  };

  const calculateCostBenefit = (form, asset) => {
    const cost = parseFloat(form.estimated_cost) || 1;
    const riskReduction = form.risk_reduction_impact || 0;
    const population = asset?.population_served || 1;
    return Math.round((riskReduction * population / cost) * 10000) / 100;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Investment Project</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter project name"
              required
            />
          </div>

          <div>
            <Label htmlFor="type">Project Type</Label>
            <Select
              value={formData.project_type}
              onValueChange={(value) => setFormData({ ...formData, project_type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cost">Estimated Cost (CAD)</Label>
              <Input
                id="cost"
                type="number"
                value={formData.estimated_cost}
                onChange={(e) => setFormData({ ...formData, estimated_cost: e.target.value })}
                placeholder="e.g., 5000000"
                required
              />
            </div>
            <div>
              <Label htmlFor="timeline">Timeline (months)</Label>
              <Input
                id="timeline"
                type="number"
                value={formData.timeline_months}
                onChange={(e) => setFormData({ ...formData, timeline_months: parseInt(e.target.value) })}
                min={1}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="risk_reduction">Expected Risk Reduction (%)</Label>
            <Input
              id="risk_reduction"
              type="number"
              value={formData.risk_reduction_impact}
              onChange={(e) => setFormData({ ...formData, risk_reduction_impact: parseInt(e.target.value) })}
              min={0}
              max={100}
            />
          </div>

          <div>
            <Label htmlFor="funding">Potential Funding Source</Label>
            <Input
              id="funding"
              value={formData.funding_source}
              onChange={(e) => setFormData({ ...formData, funding_source: e.target.value })}
              placeholder="e.g., Federal Infrastructure Fund"
            />
          </div>

          <div>
            <Label htmlFor="justification">Evidence-Based Justification</Label>
            <Textarea
              id="justification"
              value={formData.justification}
              onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
              placeholder="Describe why this investment is needed based on risk assessment data..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-slate-900">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}