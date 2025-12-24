import React from 'react';
import StatCard from '../dashboard/StatCard';
import { DollarSign, TrendingDown, Users, Scale } from 'lucide-react';

export default function InvestmentSummaryCards({ projects }) {
  const totalInvestment = projects.reduce((sum, p) => sum + (p.estimated_cost || 0), 0);
  const avgRiskReduction = projects.length > 0 
    ? Math.round(projects.reduce((sum, p) => sum + (p.risk_reduction_impact || 0), 0) / projects.length)
    : 0;
  const totalPopulation = projects.reduce((sum, p) => sum + (p.population_benefit || 0), 0);
  const avgEquity = projects.length > 0
    ? Math.round(projects.reduce((sum, p) => sum + (p.equity_score || 0), 0) / projects.length)
    : 0;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Investment Required"
        value={formatCurrency(totalInvestment)}
        subtitle={`${projects.length} projects`}
        icon={DollarSign}
      />
      <StatCard
        title="Avg. Risk Reduction"
        value={`${avgRiskReduction}%`}
        subtitle="Per project"
        icon={TrendingDown}
        trend="up"
        trendValue="12% improvement"
      />
      <StatCard
        title="Population Benefit"
        value={totalPopulation.toLocaleString()}
        subtitle="People served"
        icon={Users}
      />
      <StatCard
        title="Avg. Equity Score"
        value={avgEquity}
        subtitle="Vulnerability consideration"
        icon={Scale}
      />
    </div>
  );
}