import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { govData } from '@/api/dataClient';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, Search, Filter, MapPin, Users, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

import AssetDetailModal from '../components/modals/AssetDetailModal';
import CreateProjectModal from '../components/modals/CreateProjectModal';

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

const ASSET_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'road', label: 'Roads' },
  { value: 'bridge', label: 'Bridges' },
  { value: 'hospital', label: 'Hospitals' },
  { value: 'school', label: 'Schools' },
  { value: 'power_station', label: 'Power Stations' },
  { value: 'water_treatment', label: 'Water Treatment' },
  { value: 'transit_hub', label: 'Transit Hubs' },
  { value: 'emergency_services', label: 'Emergency Services' },
  { value: 'telecommunications', label: 'Telecommunications' },
  { value: 'dam', label: 'Dams' },
];

export default function Assets() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showCreateProject, setShowCreateProject] = useState(false);
  
  const queryClient = useQueryClient();

  const { data: assets = [], isLoading } = useQuery({
    queryKey: ['assets'],
    queryFn: () => govData.entities.InfrastructureAsset.list('-overall_risk_score', 200),
  });

  const handleCreateProject = async (projectData) => {
    await govData.entities.InvestmentProject.create(projectData);
    queryClient.invalidateQueries({ queryKey: ['projects'] });
    setShowCreateProject(false);
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.location?.municipality?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || asset.asset_type === typeFilter;
    const matchesRisk = riskFilter === 'all' ||
      (riskFilter === 'high' && (asset.overall_risk_score || 0) >= 60) ||
      (riskFilter === 'medium' && (asset.overall_risk_score || 0) >= 30 && (asset.overall_risk_score || 0) < 60) ||
      (riskFilter === 'low' && (asset.overall_risk_score || 0) < 30);
    
    return matchesSearch && matchesType && matchesRisk;
  });

  const getRiskBadge = (score) => {
    if (score >= 60) return <Badge className="bg-rose-100 text-rose-700">{score}% High</Badge>;
    if (score >= 30) return <Badge className="bg-amber-100 text-amber-700">{score}% Medium</Badge>;
    return <Badge className="bg-emerald-100 text-emerald-700">{score}% Low</Badge>;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value || 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <Link to={createPageUrl('Dashboard')}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                Infrastructure Assets
              </h1>
              <p className="text-slate-500 mt-1">
                {assets.length} assets in the registry
              </p>
            </div>
          </div>
          <Link to={createPageUrl('RiskMap')}>
            <Button className="bg-slate-900 gap-2">
              <MapPin className="w-4 h-4" />
              View on Map
            </Button>
          </Link>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-4 mb-6"
        >
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-48">
              <Building className="w-4 h-4 mr-2 text-slate-400" />
              <SelectValue placeholder="Asset Type" />
            </SelectTrigger>
            <SelectContent>
              {ASSET_TYPES.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2 text-slate-400" />
              <SelectValue placeholder="Risk Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risk Levels</SelectItem>
              <SelectItem value="high">High Risk (60+)</SelectItem>
              <SelectItem value="medium">Medium Risk (30-59)</SelectItem>
              <SelectItem value="low">Low Risk (0-29)</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>Asset</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Population</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.map((asset, index) => (
                  <motion.tr
                    key={asset.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedAsset(asset)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{ASSET_ICONS[asset.asset_type] || '🏛️'}</span>
                        <span className="font-medium text-slate-900">{asset.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">
                      {asset.asset_type?.replace('_', ' ')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-slate-600">
                        <MapPin className="w-3 h-3" />
                        {asset.location?.municipality || 'N/A'}, {asset.location?.province || ''}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {asset.condition_rating || 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getRiskBadge(asset.overall_risk_score || 0)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-slate-600">
                        <Users className="w-3 h-3" />
                        {(asset.population_served || 0).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(asset.replacement_value)}
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
            
            {filteredAssets.length === 0 && (
              <CardContent className="py-16 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700">No Assets Found</h3>
                <p className="text-slate-500 mt-2">
                  Try adjusting your search or filters
                </p>
              </CardContent>
            )}
          </Card>
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