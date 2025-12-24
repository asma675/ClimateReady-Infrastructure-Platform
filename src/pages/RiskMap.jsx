import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { govData } from '@/api/dataClient';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Maximize2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

import RiskMapView from '../components/map/RiskMapView';
import MapFilters from '../components/map/MapFilters';
import AssetDetailModal from '../components/modals/AssetDetailModal';
import CreateProjectModal from '../components/modals/CreateProjectModal';

export default function RiskMap() {
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [selectedTimeHorizon, setSelectedTimeHorizon] = useState('immediate');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { data: assets = [], refetch } = useQuery({
    queryKey: ['assets', selectedTimeHorizon],
    queryFn: () => govData.entities.InfrastructureAsset.filter({ time_horizon: selectedTimeHorizon }, '-overall_risk_score', 200),
  });

  const { refetch: refetchProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => govData.entities.InvestmentProject.list(),
  });

  const filteredAssets = assets.filter(a => {
    if (selectedRisk === 'all') return true;
    const riskValue = a.climate_risks?.[`${selectedRisk}_risk`] || 0;
    return riskValue > 0;
  });

  const handleCreateProject = async (projectData) => {
    await govData.entities.InvestmentProject.create(projectData);
    refetchProjects();
    setShowCreateProject(false);
  };

  return (
    <div className={`min-h-screen bg-slate-50 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <div className={`${isFullscreen ? 'h-full' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'}`}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 ${isFullscreen ? 'absolute top-4 left-4 right-4 z-10' : ''}`}
        >
          <div className="flex items-center gap-4">
            {!isFullscreen && (
              <Link to={createPageUrl('Dashboard')}>
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
            )}
            <div className={isFullscreen ? 'bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm' : ''}>
              <h1 className="text-2xl font-bold text-slate-900">Climate Risk Map</h1>
              <p className="text-sm text-slate-500">
                Interactive visualization of infrastructure at risk
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`gap-2 ${isFullscreen ? 'bg-white' : ''}`}
          >
            <Maximize2 className="w-4 h-4" />
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </Button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`mb-4 ${isFullscreen ? 'absolute bottom-4 left-4 right-4 z-10' : ''}`}
        >
          <MapFilters
            selectedRisk={selectedRisk}
            onRiskChange={setSelectedRisk}
            selectedTimeHorizon={selectedTimeHorizon}
            onTimeHorizonChange={setSelectedTimeHorizon}
            assetCount={filteredAssets.length}
          />
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`rounded-xl overflow-hidden shadow-lg ${isFullscreen ? 'h-full pt-20 pb-28' : 'h-[600px]'}`}
        >
          <RiskMapView
            assets={filteredAssets}
            onAssetSelect={setSelectedAsset}
            selectedRisk={selectedRisk}
          />
        </motion.div>

        {/* Legend */}
        {!isFullscreen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 p-4 bg-white rounded-xl border border-slate-200"
          >
            <h3 className="font-semibold text-slate-700 mb-3">Map Legend</h3>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#2EC4B6]" />
                <span className="text-sm text-slate-600">Low Risk (0-29%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#F9A825]" />
                <span className="text-sm text-slate-600">Medium Risk (30-59%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#E63946]" />
                <span className="text-sm text-slate-600">High Risk (60%+)</span>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-slate-400">Circle size indicates risk magnitude</span>
              </div>
            </div>
          </motion.div>
        )}
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