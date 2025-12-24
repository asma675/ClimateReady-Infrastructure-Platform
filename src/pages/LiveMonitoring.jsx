import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { govData } from '@/api/dataClient';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  RefreshCw, 
  Radio, 
  Play, 
  Pause,
  AlertCircle,
  Activity,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';

import LiveAlertFeed from '../components/live/LiveAlertFeed';
import RiskChangeTracker from '../components/live/RiskChangeTracker';
import WeatherConditionsWidget from '../components/live/WeatherConditionsWidget';
import SentimentAnalysisPanel from '../components/live/SentimentAnalysisPanel';

export default function LiveMonitoring() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState('all');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const queryClient = useQueryClient();

  const { data: assets = [] } = useQuery({
    queryKey: ['assets'],
    queryFn: () => govData.entities.InfrastructureAsset.list('-overall_risk_score', 100),
  });

  const { data: alerts = [], refetch: refetchAlerts } = useQuery({
    queryKey: ['all-alerts'],
    queryFn: () => govData.entities.RiskAlert.filter({ status: 'active' }, '-issued_at', 100),
    refetchInterval: autoRefresh ? 30000 : false,
  });

  // Simulate weather alert fetch
  const handleFetchWeatherAlerts = async () => {
    setIsProcessing(true);
    try {
      // Get a random high-risk asset to simulate alert for
      const highRiskAssets = assets.filter(a => (a.overall_risk_score || 0) >= 50);
      if (highRiskAssets.length === 0) {
        toast.info('No high-risk assets to generate alerts for');
        setIsProcessing(false);
        return;
      }

      const targetAsset = highRiskAssets[Math.floor(Math.random() * highRiskAssets.length)];
      
      const response = await govData.functions.invoke('fetchWeatherAlerts', {
        location: targetAsset.location,
        province: targetAsset.location?.province,
        asset_id: targetAsset.id
      });

      toast.success(`${response.data.alerts?.length || 0} weather alerts fetched`);
      queryClient.invalidateQueries({ queryKey: ['all-alerts'] });
      queryClient.invalidateQueries({ queryKey: ['live-alerts'] });
      queryClient.invalidateQueries({ queryKey: ['weather-alerts'] });
    } catch (error) {
      toast.error('Failed to fetch weather alerts');
    }
    setIsProcessing(false);
  };

  // Simulate sentiment analysis
  const handleAnalyzeSentiment = async () => {
    setIsProcessing(true);
    try {
      const highRiskAssets = assets.filter(a => (a.overall_risk_score || 0) >= 50);
      if (highRiskAssets.length === 0) {
        toast.info('No assets to analyze sentiment for');
        setIsProcessing(false);
        return;
      }

      const targetAsset = highRiskAssets[Math.floor(Math.random() * highRiskAssets.length)];
      
      const response = await govData.functions.invoke('analyzeSocialSentiment', {
        asset_id: targetAsset.id,
        location: targetAsset.location?.municipality || 'Canada',
        event_type: ['flood', 'heat', 'storm', 'wildfire'][Math.floor(Math.random() * 4)]
      });

      toast.success('Sentiment analysis completed');
      queryClient.invalidateQueries({ queryKey: ['all-alerts'] });
      queryClient.invalidateQueries({ queryKey: ['social-alerts'] });
    } catch (error) {
      toast.error('Failed to analyze sentiment');
    }
    setIsProcessing(false);
  };

  // Update risk scores for all high-risk assets
  const handleUpdateRiskScores = async () => {
    setIsProcessing(true);
    try {
      const highRiskAssets = assets.filter(a => (a.overall_risk_score || 0) >= 40);
      
      let updatedCount = 0;
      for (const asset of highRiskAssets.slice(0, 5)) { // Update top 5
        try {
          const response = await govData.functions.invoke('updateRiskScore', {
            asset_id: asset.id
          });
          
          if (response.data.score_change > 0) {
            updatedCount++;
          }
        } catch (err) {
          console.error(`Failed to update ${asset.name}:`, err);
        }
      }

      toast.success(`Updated ${updatedCount} asset risk scores`);
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['all-alerts'] });
      queryClient.invalidateQueries({ queryKey: ['rapid-change-alerts'] });
    } catch (error) {
      toast.error('Failed to update risk scores');
    }
    setIsProcessing(false);
  };

  const criticalAlerts = alerts.filter(a => a.severity === 'critical').length;
  const highAlerts = alerts.filter(a => a.severity === 'high').length;

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
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  Live Monitoring
                </h1>
                <div className="flex items-center gap-2 px-3 py-1 bg-red-50 rounded-lg border border-red-200">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-red-700">LIVE</span>
                </div>
              </div>
              <p className="text-slate-500 mt-1">
                Real-time risk assessment and alert management
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={autoRefresh ? 'border-green-200 bg-green-50' : ''}
            >
              {autoRefresh ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {autoRefresh ? 'Auto-Refresh On' : 'Auto-Refresh Off'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => queryClient.invalidateQueries()}
              disabled={isProcessing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
              Refresh All
            </Button>
          </div>
        </motion.div>

        {/* Alert Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
        >
          <Card className="bg-gradient-to-br from-rose-500 to-rose-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-rose-100 text-sm mb-1">Critical Alerts</p>
                  <p className="text-4xl font-bold">{criticalAlerts}</p>
                </div>
                <AlertCircle className="w-12 h-12 text-rose-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm mb-1">High Priority</p>
                  <p className="text-4xl font-bold">{highAlerts}</p>
                </div>
                <AlertCircle className="w-12 h-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Total Active</p>
                  <p className="text-4xl font-bold">{alerts.length}</p>
                </div>
                <Activity className="w-12 h-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-700 to-slate-900 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-sm mb-1">Assets Monitored</p>
                  <p className="text-4xl font-bold">{assets.length}</p>
                </div>
                <Radio className="w-12 h-12 text-slate-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-slate-900">Real-Time Data Integration</h3>
                    <p className="text-sm text-slate-600">Trigger live updates from external sources</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleFetchWeatherAlerts}
                    disabled={isProcessing}
                    className="bg-white"
                  >
                    Fetch Weather Alerts
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleAnalyzeSentiment}
                    disabled={isProcessing}
                    className="bg-white"
                  >
                    Analyze Social Media
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleUpdateRiskScores}
                    disabled={isProcessing}
                    className="bg-white"
                  >
                    Update Risk Scores
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Alert Feed */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <LiveAlertFeed maxAlerts={20} autoRefresh={autoRefresh} />
          </motion.div>

          {/* Right Column - Widgets */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <RiskChangeTracker />
            <WeatherConditionsWidget />
            <SentimentAnalysisPanel />
          </motion.div>
        </div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <Card className="bg-slate-900 text-white">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">System Status: Operational</span>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                  <span>Weather API: Connected</span>
                  <span>•</span>
                  <span>Sentiment Analysis: Active</span>
                  <span>•</span>
                  <span>Last Update: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}