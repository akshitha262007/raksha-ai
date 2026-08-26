import React, { useState } from 'react';
import { Landmark, Users, ShieldAlert, Radio, AlertOctagon, CheckCircle2 } from 'lucide-react';

export default function DistrictCollectorView({ riskScore = 0.72, t }) {
  const [evacuationIssued, setEvacuationIssued] = useState(false);

  // Dynamic estimated population at risk calculation based on risk score
  const popAtRisk = Math.round(12400 + (riskScore * 18500));

  const infraThreats = [
    { name: 'Singtam Teesta Hydro Bridge #3', status: riskScore > 0.6 ? 'HIGH RISK OF SCOUR' : 'NORMAL MONITORING', level: riskScore > 0.6 ? 'HIGH' : 'LOW' },
    { name: 'Pakyong Highway Cut Substation', status: riskScore > 0.75 ? 'MANDATORY SHUTDOWN ADVISED' : 'OPERATIONAL', level: riskScore > 0.75 ? 'CRITICAL' : 'SAFE' },
    { name: 'Mangan North Power Grid Line', status: 'STABLE (LoRa Mesh Monitored)', level: 'SAFE' }
  ];

  const handleIssueEvacuation = () => {
    setEvacuationIssued(true);
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🚨 MANDATORY EVACUATION ORDER DISPATCHED', {
        body: `District Collector issued immediate evacuation order for ${popAtRisk.toLocaleString()} citizens in Sikkim high-risk geofence sectors.`,
        icon: '/vite.svg'
      });
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-950 border border-amber-800 rounded-lg text-amber-400">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">{t.collectorTitle}</h2>
            <p className="text-xs text-slate-400">Executive Strategic Oversight & Public Safety Directives</p>
          </div>
        </div>

        <button
          onClick={handleIssueEvacuation}
          disabled={evacuationIssued}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold font-mono rounded-lg transition shadow-lg ${
            evacuationIssued 
              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 cursor-default'
              : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/20'
          }`}
        >
          <AlertOctagon className="w-4 h-4" />
          <span>{evacuationIssued ? t.evacuationIssued : t.issueEvacuationBtn}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Population at Risk Card */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-slate-400 font-mono uppercase tracking-wider">{t.popAtRisk}</div>
            <div className="text-3xl font-extrabold font-mono text-amber-400 mt-1">
              {popAtRisk.toLocaleString()} <span className="text-xs font-normal text-slate-400">citizens</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Geofence: Gangtok, Pakyong & Mangan Sectors</div>
          </div>
          <Users className="w-10 h-10 text-amber-400/40 shrink-0" />
        </div>

        {/* Evacuation Alert Status */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="text-slate-400 font-mono uppercase tracking-wider">Public Safety Evacuation Directive</div>
          <div className="flex items-center gap-2 mt-2">
            {evacuationIssued ? (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold rounded-md">
                <CheckCircle2 className="w-4 h-4" /> EVACUATION ORDER ACTIVE
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-950 text-yellow-400 border border-yellow-800 font-bold rounded-md">
                <Radio className="w-4 h-4 animate-pulse" /> STANDBY DIRECTIVE (AMBER)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Critical Infrastructure Threat Table */}
      <div>
        <h3 className="text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">
          {t.infraThreat}
        </h3>
        <div className="space-y-2">
          {infraThreats.map((item, idx) => (
            <div key={idx} className="bg-slate-950 p-2.5 rounded border border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="font-sans text-slate-200">{item.name}</span>
              <span className={`px-2 py-0.5 rounded font-bold border ${
                item.level === 'CRITICAL' ? 'bg-red-950 text-red-400 border-red-800' :
                item.level === 'HIGH' ? 'bg-amber-950 text-amber-400 border-amber-800' :
                'bg-emerald-950 text-emerald-400 border-emerald-800'
              }`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
