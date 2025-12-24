import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { govData } from '@/api/dataClient';
import { motion } from 'framer-motion';
import { Building, AlertTriangle, TrendingUp, DollarSign, RefreshCw, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

import StatCard from '../components/dashboard/StatCard';
import RiskScoreGauge from '../components/dashboard/RiskScoreGauge';
import AssetTypeDistribution from '../components/dashboard/AssetTypeDistribution';
import PriorityAssetsList from '../components/dashboard/PriorityAssetsList';
import AssetDetailModal from '../components/modals/AssetDetailModal';
import CreateProjectModal from '../components/modals/CreateProjectModal';

export default function Dashboard() {
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showCreateProject, setShowCreateProject] = useState(false);

  const { data: assets = [], isLoading: assetsLoading, refetch: refetchAssets } = useQuery({
    queryKey: ['assets'],
    queryFn: () => govData.entities.InfrastructureAsset.list('-overall_risk_score', 100),
  });

  const { data: projects = [], refetch: refetchProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => govData.entities.InvestmentProject.list('-priority_rank', 50),
  });

  const totalAssets = assets.length;
  const highRiskAssets = assets.filter(a => (a.overall_risk_score || 0) >= 60).length;
  const avgRiskScore = assets.length > 0 
    ? Math.round(assets.reduce((sum, a) => sum + (a.overall_risk_score || 0), 0) / assets.length)
    : 0;
  const totalInvestment = projects.reduce((sum, p) => sum + (p.estimated_cost || 0), 0);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  const handleCreateProject = async (projectData) => {
    await govData.entities.InvestmentProject.create(projectData);
    refetchProjects();
    setShowCreateProject(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Infrastructure Risk Dashboard
            </h1>
            <p className="text-slate-500 mt-1">
              Evidence-based climate risk assessment for public infrastructure
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => refetchAssets()} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Link to={createPageUrl('LiveMonitoring')}>
              <Button variant="outline" className="gap-2 border-red-200 bg-red-50 text-red-700 hover:bg-red-100">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Live Monitoring
              </Button>
            </Link>
            <Link to={createPageUrl('RiskMap')}>
              <Button className="bg-slate-900 gap-2">
                <Plus className="w-4 h-4" />
                View Risk Map
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Assets"
            value={totalAssets}
            subtitle="Monitored infrastructure"
            icon={Building}
          />
          <StatCard
            title="High Risk Assets"
            value={highRiskAssets}
            subtitle="Requiring attention"
            icon={AlertTriangle}
            trend={highRiskAssets > 5 ? 'up' : 'down'}
            trendValue={`${Math.round((highRiskAssets / totalAssets) * 100) || 0}% of total`}
          />
          <StatCard
            title="Average Risk Score"
            value={avgRiskScore}
            subtitle="Portfolio-wide"
            icon={TrendingUp}
          />
          <StatCard
            title="Planned Investment"
            value={formatCurrency(totalInvestment)}
            subtitle={`${projects.length} projects`}
            icon={DollarSign}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Risk Overview */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Portfolio Risk Overview</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <RiskScoreGauge score={avgRiskScore} size={160} label="Average Risk" />
              <div className="mt-6 w-full space-y-3">
                <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                  <span className="text-sm font-medium text-emerald-700">Low Risk (0-29)</span>
                  <span className="font-bold text-emerald-700">
                    {assets.filter(a => (a.overall_risk_score || 0) < 30).length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                  <span className="text-sm font-medium text-amber-700">Medium Risk (30-59)</span>
                  <span className="font-bold text-amber-700">
                    {assets.filter(a => (a.overall_risk_score || 0) >= 30 && (a.overall_risk_score || 0) < 60).length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-rose-50 rounded-lg">
                  <span className="text-sm font-medium text-rose-700">High Risk (60+)</span>
                  <span className="font-bold text-rose-700">
                    {assets.filter(a => (a.overall_risk_score || 0) >= 60).length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Asset Distribution */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Asset Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {assets.length > 0 ? (
                <AssetTypeDistribution assets={assets} />
              ) : (
                <div className="h-72 flex items-center justify-center text-slate-400">
                  No assets to display
                </div>
              )}
            </CardContent>
          </Card>

          {/* Priority Assets */}
          <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Priority Assets</CardTitle>
              <Link to={createPageUrl('Investments')}>
                <Button variant="ghost" size="sm">View All →</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {assets.length > 0 ? (
                <PriorityAssetsList 
                  assets={assets} 
                  onAssetClick={setSelectedAsset}
                />
              ) : (
                <div className="h-64 flex items-center justify-center text-slate-400">
                  No priority assets
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Responsible AI Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900">Responsible AI Notice</h4>
              <p className="text-sm text-blue-700 mt-1">
                This platform provides decision support only. All risk assessments include uncertainty measures 
                and should be reviewed with domain experts. Final investment decisions remain with human authorities.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <AssetDetailModal
        asset={selectedAsset}
        open={!!selectedAsset}
        onClose={() => setSelectedAsset(null)}
        onCreateProject={(asset) => {
          setSelectedAsset(null);
          setShowCreateProject(true);
        }}
      />

      <CreateProjectModal
        open={showCreateProject}
        onClose={() => setShowCreateProject(false)}
        asset={selectedAsset}
        onSubmit={handleCreateProject}
      />
    </div>
  );
}