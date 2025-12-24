import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { govData } from '@/api/dataClient';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, FileDown, Filter, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

import InvestmentSummaryCards from '../components/investment/InvestmentSummaryCards';
import PrioritizationTable from '../components/investment/PrioritizationTable';
import CreateProjectModal from '../components/modals/CreateProjectModal';

export default function Investments() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ column: 'priority_rank', direction: 'asc' });
  
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => govData.entities.InvestmentProject.list('-cost_benefit_ratio', 100),
  });

  const { data: assets = [] } = useQuery({
    queryKey: ['assets'],
    queryFn: () => govData.entities.InfrastructureAsset.list(),
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({ id, data }) => govData.entities.InvestmentProject.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });

  const handleCreateProject = async (projectData) => {
    await govData.entities.InvestmentProject.create(projectData);
    queryClient.invalidateQueries({ queryKey: ['projects'] });
    setShowCreateModal(false);
  };

  const handleStatusChange = (project, newStatus) => {
    updateProjectMutation.mutate({ id: project.id, data: { status: newStatus } });
  };

  const filteredProjects = projects.filter(p => 
    statusFilter === 'all' || p.status === statusFilter
  );

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const aVal = a[sortConfig.column] || 0;
    const bVal = b[sortConfig.column] || 0;
    return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
  });

  const handleSort = (column) => {
    setSortConfig(prev => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const statusCounts = {
    all: projects.length,
    proposed: projects.filter(p => p.status === 'proposed').length,
    under_review: projects.filter(p => p.status === 'under_review').length,
    approved: projects.filter(p => p.status === 'approved').length,
    in_progress: projects.filter(p => p.status === 'in_progress').length,
    completed: projects.filter(p => p.status === 'completed').length,
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
                Investment Prioritization
              </h1>
              <p className="text-slate-500 mt-1">
                "If we fund only 3 projects this year, which matter most?"
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <FileDown className="w-4 h-4" />
              Export Report
            </Button>
            <Button onClick={() => setShowCreateModal(true)} className="bg-slate-900 gap-2">
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <InvestmentSummaryCards projects={projects} />
        </motion.div>

        {/* Status Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <TabsList className="bg-white border border-slate-200 p-1">
              <TabsTrigger value="all" className="gap-2">
                All <Badge variant="secondary">{statusCounts.all}</Badge>
              </TabsTrigger>
              <TabsTrigger value="proposed" className="gap-2">
                Proposed <Badge variant="secondary">{statusCounts.proposed}</Badge>
              </TabsTrigger>
              <TabsTrigger value="under_review" className="gap-2">
                Under Review <Badge variant="secondary">{statusCounts.under_review}</Badge>
              </TabsTrigger>
              <TabsTrigger value="approved" className="gap-2">
                Approved <Badge variant="secondary">{statusCounts.approved}</Badge>
              </TabsTrigger>
              <TabsTrigger value="in_progress" className="gap-2">
                In Progress <Badge variant="secondary">{statusCounts.in_progress}</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Prioritization Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {sortedProjects.length > 0 ? (
            <PrioritizationTable
              projects={sortedProjects}
              onProjectSelect={setSelectedProject}
              onSort={handleSort}
              sortConfig={sortConfig}
            />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Filter className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700">No Projects Found</h3>
                <p className="text-slate-500 text-center mt-2 max-w-md">
                  No investment projects match your current filter. Create a new project or adjust filters.
                </p>
                <Button onClick={() => setShowCreateModal(true)} className="mt-4 bg-slate-900">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Project
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Methodology Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-4 bg-slate-100 rounded-xl border border-slate-200"
        >
          <h4 className="font-semibold text-slate-700 mb-2">Prioritization Methodology</h4>
          <p className="text-sm text-slate-600">
            Projects are ranked using a multi-criteria decision analysis (MCDA) approach that considers:
            <strong> Risk Reduction Impact</strong> (30%), <strong>Cost-Benefit Ratio</strong> (25%), 
            <strong>Population Benefit</strong> (25%), and <strong>Equity Score</strong> (20%). 
            This methodology aligns with Treasury Board guidelines for evidence-based investment decisions.
          </p>
        </motion.div>
      </div>

      {/* Modals */}
      <CreateProjectModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        asset={null}
        onSubmit={handleCreateProject}
      />
    </div>
  );
}