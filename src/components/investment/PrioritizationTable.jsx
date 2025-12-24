import React from 'react';
import { motion } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Eye, CheckCircle, Clock } from 'lucide-react';

const STATUS_STYLES = {
  proposed: { color: 'bg-slate-100 text-slate-700', icon: Clock },
  under_review: { color: 'bg-blue-100 text-blue-700', icon: Clock },
  approved: { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  in_progress: { color: 'bg-amber-100 text-amber-700', icon: Clock },
  completed: { color: 'bg-green-100 text-green-700', icon: CheckCircle },
};

export default function PrioritizationTable({ projects, onProjectSelect, onSort, sortConfig }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  const SortButton = ({ column, label }) => (
    <Button
      variant="ghost"
      size="sm"
      className="p-0 h-auto font-medium hover:bg-transparent"
      onClick={() => onSort?.(column)}
    >
      {label}
      <ArrowUpDown className="w-3 h-3 ml-1 text-slate-400" />
    </Button>
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="w-12">#</TableHead>
            <TableHead><SortButton column="name" label="Project" /></TableHead>
            <TableHead><SortButton column="estimated_cost" label="Cost" /></TableHead>
            <TableHead><SortButton column="risk_reduction_impact" label="Risk Reduction" /></TableHead>
            <TableHead><SortButton column="population_benefit" label="Population Benefit" /></TableHead>
            <TableHead><SortButton column="equity_score" label="Equity Score" /></TableHead>
            <TableHead><SortButton column="cost_benefit_ratio" label="Cost-Benefit" /></TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-16"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project, index) => {
            const StatusIcon = STATUS_STYLES[project.status]?.icon || Clock;
            return (
              <motion.tr
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => onProjectSelect?.(project)}
              >
                <TableCell className="font-bold text-slate-400">
                  {index + 1}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-slate-900">{project.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{project.project_type?.replace('_', ' ')}</p>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(project.estimated_cost)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-slate-100 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full"
                        style={{ width: `${project.risk_reduction_impact || 0}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-600">{project.risk_reduction_impact || 0}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-slate-700">
                  {(project.population_benefit || 0).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge className={`${
                    (project.equity_score || 0) > 70 ? 'bg-emerald-100 text-emerald-700' :
                    (project.equity_score || 0) > 40 ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {project.equity_score || 0}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">
                  {(project.cost_benefit_ratio || 0).toFixed(2)}x
                </TableCell>
                <TableCell>
                  <Badge className={STATUS_STYLES[project.status]?.color || 'bg-slate-100 text-slate-700'}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {project.status?.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={(e) => {
                    e.stopPropagation();
                    onProjectSelect?.(project);
                  }}>
                    <Eye className="w-4 h-4 text-slate-400" />
                  </Button>
                </TableCell>
              </motion.tr>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}