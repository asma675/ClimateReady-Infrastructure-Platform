import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#0D1B2A', '#1B3A4B', '#2EC4B6', '#F9A825', '#E63946', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#6366F1'];

const LABELS = {
  road: 'Roads',
  bridge: 'Bridges',
  hospital: 'Hospitals',
  school: 'Schools',
  power_station: 'Power Stations',
  water_treatment: 'Water Treatment',
  transit_hub: 'Transit Hubs',
  emergency_services: 'Emergency Services',
  telecommunications: 'Telecom',
  dam: 'Dams'
};

export default function AssetTypeDistribution({ assets }) {
  const typeCounts = assets.reduce((acc, asset) => {
    acc[asset.asset_type] = (acc[asset.asset_type] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(typeCounts).map(([type, count]) => ({
    name: LABELS[type] || type,
    value: count
  }));

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: '12px'
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => <span className="text-sm text-slate-600">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}