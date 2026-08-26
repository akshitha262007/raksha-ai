import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { generateDroneWaypoints, downloadKML } from '../services/droneWaypointService';
import { CloudRain, Layers, MapPin, Navigation, Signal, Download, Plane } from 'lucide-react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const citizenIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const droneIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [22, 36],
  iconAnchor: [11, 36],
  popupAnchor: [1, -30],
  shadowSize: [36, 36]
});

const HIGH_RISK_ZONES = [
  { id: 'Z1', name: 'Gangtok East Sector A', lat: 27.3389, lng: 88.6065, risk: 0.85, category: 'CRITICAL' },
  { id: 'Z2', name: 'Pakyong Slide Point B', lat: 27.2372, lng: 88.5902, risk: 0.72, category: 'HIGH' },
  { id: 'Z3', name: 'Mangan North Belt C', lat: 27.5167, lng: 88.5333, risk: 0.91, category: 'CRITICAL' },
  { id: 'Z4', name: 'Namchi South Slope D', lat: 27.1667, lng: 88.3500, risk: 0.48, category: 'MEDIUM' }
];

const RESCUE_DEPOTS = [
  { id: 'DEP-1', name: 'NDRF 2nd Battalion (Gangtok Base)', lat: 27.3200, lng: 88.6200, capacity: 40 },
  { id: 'DEP-2', name: 'SDRF Emergency Unit (Pakyong Hub)', lat: 27.2200, lng: 88.5800, capacity: 25 },
  { id: 'DEP-3', name: 'Army Disaster Relief Hub (Mangan)', lat: 27.5000, lng: 88.5100, capacity: 35 }
];

export default function MapView({ allocations = [], citizenReports = [], t }) {
  const [showRadar, setShowRadar] = useState(true);
  const [lowBandwidthMode, setLowBandwidthMode] = useState(false);
  const [showDroneGrid, setShowDroneGrid] = useState(true);

  const center = [27.3389, 88.6065];
  const droneWaypoints = generateDroneWaypoints(center[0], center[1]);

  const routePolylines = (allocations || []).map((alloc, idx) => {
    const depot = RESCUE_DEPOTS.find(d => d.id === alloc.depot_id) || RESCUE_DEPOTS[idx % RESCUE_DEPOTS.length];
    const siteZone = HIGH_RISK_ZONES.find(z => z.id === alloc.site_id) || HIGH_RISK_ZONES[idx % HIGH_RISK_ZONES.length];

    return {
      id: `route-${idx}`,
      fromName: alloc.depot_name || depot.name,
      toName: alloc.site_name || siteZone.name,
      units: alloc.units_allocated,
      positions: [
        [depot.lat, depot.lng],
        [siteZone.lat, siteZone.lng]
      ]
    };
  });

  const handleExportDroneKML = () => {
    downloadKML(droneWaypoints, 'RAKSHA-AI_Drone_Survey_FlightPlan.kml');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col h-[580px] shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>{t.gisTitle}</span>
          </h2>
          <p className="text-xs text-slate-400">{t.gisSub}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Low Bandwidth Mode Toggle */}
          <button
            onClick={() => setLowBandwidthMode(!lowBandwidthMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono border transition ${
              lowBandwidthMode 
                ? 'bg-amber-950 text-amber-400 border-amber-800 font-bold' 
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            <Signal className="w-3.5 h-3.5" />
            <span>{lowBandwidthMode ? t.lowBandwidthOn : t.lowBandwidthOff}</span>
          </button>

          {/* RainViewer Radar Toggle */}
          {!lowBandwidthMode && (
            <button
              onClick={() => setShowRadar(!showRadar)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono border transition ${
                showRadar 
                  ? 'bg-blue-950 text-blue-400 border-blue-700 shadow-md shadow-blue-900/30' 
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              <CloudRain className={`w-3.5 h-3.5 ${showRadar ? 'text-blue-400 animate-bounce' : 'text-slate-500'}`} />
              <span>{showRadar ? t.radarToggleOn : t.radarToggleOff}</span>
            </button>
          )}

          {/* Export Drone KML Button */}
          <button
            onClick={handleExportDroneKML}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-mono rounded-lg transition shadow-md shadow-purple-600/20"
          >
            <Plane className="w-3.5 h-3.5" />
            <span>{t.downloadKmlBtn}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 w-full rounded-lg overflow-hidden border border-slate-800 relative z-0">
        <MapContainer center={center} zoom={10} maxZoom={15} scrollWheelZoom={true} className="w-full h-full">
          {/* Tile layer active only when low-bandwidth mode is OFF */}
          {!lowBandwidthMode && (
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              maxZoom={15}
              maxNativeZoom={15}
            />
          )}

          {/* RainViewer Live Radar Cloud Overlay */}
          {!lowBandwidthMode && showRadar && (
            <TileLayer
              attribution='&copy; <a href="https://www.rainviewer.com/">RainViewer</a>'
              url="https://tilecache.rainviewer.com/v2/radar/nowcast/{z}/{x}/{y}/2/1_1.png"
              opacity={0.55}
              maxZoom={15}
              maxNativeZoom={15}
            />
          )}

          {/* High-Risk Landslide Hotspots */}
          {HIGH_RISK_ZONES.map((zone) => {
            const color = zone.category === 'CRITICAL' ? '#ef4444' : zone.category === 'HIGH' ? '#f59e0b' : '#3b82f6';
            return (
              <React.Fragment key={zone.id}>
                <Circle
                  center={[zone.lat, zone.lng]}
                  radius={4500}
                  pathOptions={{ color: color, fillColor: color, fillOpacity: 0.25, weight: 2 }}
                />
                <Marker position={[zone.lat, zone.lng]}>
                  <Popup>
                    <div className="p-1 font-sans text-slate-900">
                      <strong className="text-sm font-bold block">{zone.name}</strong>
                      <div className="text-xs mt-1">
                        Risk Rating: <span className="font-bold text-red-600">{zone.category} ({Math.round(zone.risk * 100)}%)</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}

          {/* Rescue Depots */}
          {RESCUE_DEPOTS.map((depot) => (
            <Marker key={depot.id} position={[depot.lat, depot.lng]}>
              <Popup>
                <div className="p-1 font-sans text-slate-900">
                  <strong className="text-sm font-bold block text-cyan-700">{depot.name}</strong>
                  <div className="text-xs mt-1">Capacity: <strong>{depot.capacity} Units</strong></div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Route Polylines */}
          {routePolylines.map((route) => (
            <Polyline
              key={route.id}
              positions={route.positions}
              pathOptions={{ color: '#06b6d4', weight: 3, dashArray: '6, 8', opacity: 0.8 }}
            />
          ))}

          {/* Drone Waypoint Pins */}
          {showDroneGrid && droneWaypoints.map((wp) => (
            <Marker key={wp.id} position={[wp.latitude, wp.longitude]} icon={droneIcon}>
              <Popup>
                <div className="p-1 text-xs text-slate-900 font-sans">
                  <strong className="text-amber-700 font-bold block">✈️ {wp.name}</strong>
                  <div>Altitude: {wp.altitudeMeters}m AGL</div>
                  <div>Coords: {wp.latitude}, {wp.longitude}</div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Citizen Ground-Truth Pins */}
          {(citizenReports || []).map((rep) => (
            <Marker key={rep.id} position={[rep.latitude, rep.longitude]} icon={citizenIcon}>
              <Popup>
                <div className="p-1 text-xs text-slate-900 font-sans">
                  <strong className="text-purple-700 font-bold block">🚨 Citizen Report: {rep.type}</strong>
                  <div>Severity: <span className="font-bold text-red-600">{rep.severity}</span></div>
                  <div>Reporter: {rep.reporter}</div>
                  <div className="text-[11px] text-slate-600 mt-1">{rep.description}</div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Map Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-3 text-xs text-slate-400 border-t border-slate-800/80 pt-2.5 font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> {t.hazardLegend}</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> {t.depotLegend}</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> {t.dronePinLegend}</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> {t.citizenPinLegend}</span>
        </div>
        <div className="text-[11px] text-slate-500">
          {lowBandwidthMode ? 'Degraded Field Vector Mode' : 'CartoDB Dark Matter GIS • Sikkim Sector'}
        </div>
      </div>
    </div>
  );
}
