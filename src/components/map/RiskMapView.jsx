import React from 'react';
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

const getRiskLevel = (score = 0) => {
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

// ✅ Normalize coordinates across possible asset shapes
function getCoords(asset) {
  const lat =
    asset?.location?.lat ??
    asset?.location?.latitude ??
    asset?.lat ??
    asset?.latitude;

  const lng =
    asset?.location?.lng ??
    asset?.location?.lon ??
    asset?.location?.longitude ??
    asset?.lng ??
    asset?.lon ??
    asset?.longitude;

  // Ensure numbers
  const latNum = typeof lat === 'string' ? parseFloat(lat) : lat;
  const lngNum = typeof lng === 'string' ? parseFloat(lng) : lng;

  if (Number.isFinite(latNum) && Number.isFinite(lngNum)) {
    return { lat: latNum, lng: lngNum };
  }
  return null;
}

function MapBounds({ assets }) {
  const map = useMap();

  React.useEffect(() => {
    const points = assets
      .map(a => getCoords(a))
      .filter(Boolean)
      .map(c => [c.lat, c.lng]);

    if (points.length > 0) {
      map.fitBounds(points, { padding: [50, 50] });
    }
  }, [assets, map]);

  return null;
}

export default function RiskMapView({ assets = [], onAssetSelect, selectedRisk = 'all' }) {
  const filteredAssets = assets.filter(a => {
    const coords = getCoords(a);
    if (!coords) return false;

    if (selectedRisk === 'all') return true;

    // ✅ Align with RiskMap.jsx filtering (show if risk > 0)
    const riskValue = a.climate_risks?.[`${selectedRisk}_risk`] ?? 0;
    return Number(riskValue) > 0;
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
          const coords = getCoords(asset);
          if (!coords) return null;

          const riskScore = Number(asset.overall_risk_score ?? 0);
          const riskLevel = getRiskLevel(riskScore);

          return (
            <CircleMarker
              key={asset.id}
              center={[coords.lat, coords.lng]}
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
                    <span className="text-xl">{ASSET_ICONS[asset.asset_type] ?? '🏛️'}</span>
                    <h3 className="font-semibold text-slate-900">{asset.name}</h3>
                  </div>

                  <div className="space-y-1 text-sm">
                    <p className="text-slate-600">
                      {asset.location?.municipality ?? asset.city ?? asset.location?.city ?? ''}{asset.province || asset.location?.province ? ',' : ''} {asset.province ?? asset.location?.province ?? ''}
                    </p>

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
                        Population served: {Number(asset.population_served).toLocaleString()}
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
