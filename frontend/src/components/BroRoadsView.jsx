import React from 'react';
import { HardHat, Truck, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';

export default function BroRoadsView({ t }) {
  const roadStatus = [
    { highway: 'NH-10 Gangtok-Siliguri Arterial', section: 'Mile 27 Debris Slide', status: 'BLOCKED (Clearing Active)', eta: '2.5 Hours', Machinery: '2x JCB 3DX, 1x Caterpillar Bulldozer' },
    { highway: 'Pakyong Airport Link Road', section: 'Cut Road Slump Point B', status: 'PARTIAL (Single-Lane Controlled)', eta: '45 Mins', Machinery: '1x Excavator' },
    { highway: 'Mangan North Defense Corridor', section: 'Chungthang Cut', status: 'OPEN (Monitored)', eta: 'Clear', Machinery: 'Standby Unit' }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col gap-4">
      <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
        <div className="p-2 bg-orange-950 border border-orange-800 rounded-lg text-orange-400">
          <HardHat className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white">{t.broTitle}</h2>
          <p className="text-xs text-slate-400">Border Roads Organisation Highway Debris Clearance & Heavy Machinery Deployment</p>
        </div>
      </div>

      <div className="space-y-3">
        {roadStatus.map((road, idx) => (
          <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div>
              <div className="font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-orange-400" />
                <span>{road.highway}</span>
              </div>
              <div className="text-slate-400 text-[11px] mt-0.5">Section: {road.section}</div>
              <div className="text-slate-500 font-mono text-[11px] mt-1">Assigned Equipment: {road.Machinery}</div>
            </div>

            <div className="flex items-center gap-3 font-mono">
              <span className={`px-2.5 py-1 rounded text-[11px] font-bold border ${
                road.status.includes('BLOCKED') ? 'bg-red-950 text-red-400 border-red-800' :
                road.status.includes('PARTIAL') ? 'bg-amber-950 text-amber-400 border-amber-800' :
                'bg-emerald-950 text-emerald-400 border-emerald-800'
              }`}>
                {road.status}
              </span>
              <div className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>ETA: <strong className="text-cyan-400">{road.eta}</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
