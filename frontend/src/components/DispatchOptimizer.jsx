import React, { useState } from 'react';
import { optimizeDispatch } from '../services/apiService';
import { exportElementToPDF } from '../services/pdfExportService';
import { Truck, Calculator, Download, CheckCircle, AlertOctagon } from 'lucide-react';

const DEFAULT_DEPOTS = [
  { id: 'DEP-1', name: 'NDRF 2nd Battalion (Gangtok Base)', capacity: 40, latitude: 27.3200, longitude: 88.6200 },
  { id: 'DEP-2', name: 'SDRF Emergency Unit (Pakyong Hub)', capacity: 25, latitude: 27.2200, longitude: 88.5800 },
  { id: 'DEP-3', name: 'Army Disaster Relief Depot (Mangan)', capacity: 35, latitude: 27.5000, longitude: 88.5100 }
];

const DEFAULT_SITES = [
  { id: 'SITE-A', name: 'Pakyong Landslide Cut (Critical)', demand: 30, latitude: 27.2372, longitude: 88.5902, severity: 'CRITICAL' },
  { id: 'SITE-B', name: 'Mangan North Sector Block', demand: 35, latitude: 27.5167, longitude: 88.5333, severity: 'HIGH' },
  { id: 'SITE-C', name: 'Singtam Highway Washout', demand: 20, latitude: 27.2333, longitude: 88.5000, severity: 'HIGH' }
];

export default function DispatchOptimizer({ onAllocationsCalculated, t }) {
  const [depots, setDepots] = useState(DEFAULT_DEPOTS);
  const [sites, setSites] = useState(DEFAULT_SITES);
  const [loading, setLoading] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSolve = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await optimizeDispatch({ depots, sites });
      setResult(data);
      if (onAllocationsCalculated && data.allocations) {
        onAllocationsCalculated(data.allocations);
      }
    } catch (err) {
      setError(err.message || 'SciPy LP Optimization failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePDFExport = async () => {
    setExportingPDF(true);
    await exportElementToPDF('dispatch-optimizer-container', 'RAKSHA-AI_Emergency_Dispatch_Plan.pdf');
    setExportingPDF(false);
  };

  return (
    <div id="dispatch-optimizer-container" className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-400" />
            <span>{t.dispatchTitle}</span>
          </h2>
          <p className="text-xs text-slate-400">SciPy Linear Programming Transportation Solver (HiGHS Engine)</p>
        </div>
        
        <div className="flex items-center gap-2">
          {result && (
            <button
              onClick={handlePDFExport}
              disabled={exportingPDF}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-lg transition border border-slate-700 disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>{exportingPDF ? t.exportingPDF : t.exportPDF}</span>
            </button>
          )}

          <button
            onClick={handleSolve}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg transition disabled:opacity-50 shadow-lg shadow-blue-600/20"
          >
            <Calculator className="w-4 h-4" />
            <span>{loading ? t.solvingLP : t.solveLP}</span>
          </button>
        </div>
      </div>

      {/* Depots & Sites Configurations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Depots */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
          <h3 className="text-xs font-bold text-cyan-400 mb-2 uppercase tracking-wider">
            {t.supplyDepots} (m = {depots.length})
          </h3>
          <div className="space-y-2">
            {depots.map((dep, idx) => (
              <div key={dep.id} className="flex items-center justify-between text-xs bg-slate-900 p-2.5 rounded border border-slate-800">
                <div>
                  <div className="font-semibold text-slate-200">{dep.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">Coords: {dep.latitude}, {dep.longitude}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-400">Cap:</span>
                  <input
                    type="number"
                    min="0"
                    value={dep.capacity}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      const next = [...depots];
                      next[idx].capacity = val;
                      setDepots(next);
                    }}
                    className="w-16 bg-slate-950 border border-slate-700 text-right px-2 py-1 rounded text-cyan-400 font-mono font-bold"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disaster Sites */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
          <h3 className="text-xs font-bold text-amber-400 mb-2 uppercase tracking-wider">
            {t.disasterSites} (n = {sites.length})
          </h3>
          <div className="space-y-2">
            {sites.map((site, idx) => (
              <div key={site.id} className="flex items-center justify-between text-xs bg-slate-900 p-2.5 rounded border border-slate-800">
                <div>
                  <div className="font-semibold text-slate-200">{site.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">Coords: {site.latitude}, {site.longitude}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-400">Dem:</span>
                  <input
                    type="number"
                    min="0"
                    value={site.demand}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      const next = [...sites];
                      next[idx].demand = val;
                      setSites(next);
                    }}
                    className="w-16 bg-slate-950 border border-slate-700 text-right px-2 py-1 rounded text-amber-400 font-mono font-bold"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-950/60 border border-red-800 rounded-lg text-xs text-red-300">
          {error}
        </div>
      )}

      {/* Results View */}
      {result && (
        <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 text-xs font-bold font-mono rounded border uppercase ${
                result.status === 'OPTIMAL' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-red-950 text-red-400 border-red-800'
              }`}>
                {result.status} SOLVER STATUS
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Cost Metric: <strong className="text-cyan-400">{result.total_cost} km-units</strong>
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Unmet: <strong className="text-amber-400">{result.unmet_demand}</strong> | Unused: <strong className="text-blue-400">{result.unused_supply}</strong>
            </div>
          </div>

          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono">
                    <th className="p-2.5">Source Depot</th>
                    <th className="p-2.5">Destination Site</th>
                    <th className="p-2.5 text-right">{t.unitsAllocated}</th>
                    <th className="p-2.5 text-right">{t.distanceKm}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {result.allocations.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-900/50">
                      <td className="p-2.5 font-sans font-medium text-slate-300">{item.depot_name}</td>
                      <td className="p-2.5 font-sans text-slate-300">{item.site_name}</td>
                      <td className="p-2.5 text-right font-bold text-cyan-400">{item.units_allocated}</td>
                      <td className="p-2.5 text-right text-slate-400">{item.unit_cost_distance} km</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
