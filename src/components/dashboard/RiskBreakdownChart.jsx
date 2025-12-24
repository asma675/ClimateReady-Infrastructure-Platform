import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = {
  flood: '#3B82F6',
  wildfire: '#F97316',
  heat: '#EF4444',
  storm: '#8B5CF6'
};

export default function RiskBreakdownChart({ data }) {
  const chartData = [
    { name: 'Flood', value: data?.flood_risk || 0, key: 'flood' },
    { name: 'Wildfire', value: data?.wildfire_risk || 0, key: 'wildfire' },
    { name: 'Heat', value: data?.heat_risk || 0, key: 'heat' },
    { name: 'Storm', value: data?.storm_risk || 0, key: 'storm' },
  ];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" barCategoryGap="20%">
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={70} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
            formatter={(value) => [`${value}%`, 'Risk Level']}
          />
          <Bar dataKey="value" radius={[0, 8, 8, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.key]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}