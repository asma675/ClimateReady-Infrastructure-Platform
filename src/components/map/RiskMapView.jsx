import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const RISK_COLORS = {
  low: '#2EC4B6',
  medium: '#F9A825',
  high: '#E63946'
};

const getRiskLevel = (score) => {
  if (score < 30) return 'low';
  if (score < 60) return 'medium';
  return 'high';
};

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

function MapBounds({ assets }) {
  const map = useMap();
  
  React.useEffect(() => {
    if (assets.length > 0) {
      const bounds = assets
        .filter(a => a.location?.lat && a.location?.lng)
        .map(a => [a.location.lat, a.location.lng]);
      
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [assets, map]);
  
  return null;
}

export default function RiskMapView({ assets, onAssetSelect, selectedRisk = 'all' }) {
  const filteredAssets = assets.filter(a => {
    if (!a.location?.lat || !a.location?.lng) return false;
    if (selectedRisk === 'all') return true;
    
    const riskValue = a.climate_risks?.[`${selectedRisk}_risk`] || 0;
    return riskValue > 30;
  });

  const defaultCenter = [56.1304, -106.3468]; // Canada center

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border border-slate-200">
      <MapContainer
        center={defaultCenter}
        zoom={4}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBounds assets={filteredAssets} />
        
        {filteredAssets.map((asset) => {
          const riskScore = asset.overall_risk_score || 0;
          const riskLevel = getRiskLevel(riskScore);
          
          return (
            <CircleMarker
              key={asset.id}
              center={[asset.location.lat, asset.location.lng]}
              radius={8 + (riskScore / 20)}
              fillColor={RISK_COLORS[riskLevel]}
              color="#fff"
              weight={2}
              opacity={1}
              fillOpacity={0.8}
              eventHandlers={{
                click: () => onAssetSelect?.(asset)
              }}
            >
              <Popup>
                <div className="min-w-48">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{ASSET_ICONS[asset.asset_type]}</span>
                    <h3 className="font-semibold text-slate-900">{asset.name}</h3>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="text-slate-600">{asset.location?.municipality}, {asset.location?.province}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Risk Score:</span>
                      <Badge className={`${
                        riskLevel === 'low' ? 'bg-emerald-100 text-emerald-700' :
                        riskLevel === 'medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {riskScore}%
                      </Badge>
                    </div>
                    {asset.population_served && (
                      <p className="text-slate-500">
                        Population served: {asset.population_served.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full mt-3"
                    onClick={() => onAssetSelect?.(asset)}
                  >
                    View Details <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}