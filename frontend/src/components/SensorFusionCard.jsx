import React from 'react';
import { Cpu, Activity, Zap, Droplets, Mountain, Trees, Compass, ShieldCheck, Radio } from 'lucide-react';

export default function SensorFusionCard({ params, result, lang = 'en', t }) {
  const slope = params?.slope_angle ?? 42.5;
  const rain = params?.rainfall_24h ?? 185.0;
  const soil = params?.soil_moisture ?? 78.0;
  const ndvi = params?.ndvi ?? 0.15;

  const seismic = (0.02 + (slope / 60) * 0.08).toFixed(3);
  const porePressure = (12.0 + (soil / 100) * 45.0).toFixed(1);
  const displacement = (0.1 + (rain / 250) * 4.5).toFixed(2);

  const riskProb = result ? Math.round(result.risk_score * 100) : 72;
  const confidence = result ? Math.round(result.confidence_score * 100) : 94;
  const category = result?.risk_category || 'HIGH';

  const channelsData = [
    { key: 'precip', label: t.channels.precip, val: `${rain} mm`, icon: Droplets, color: rain > 150 ? 'text-red-400' : 'text-cyan-400' },
    { key: 'soil', label: t.channels.soil, val: `${soil}%`, icon: Activity, color: soil > 75 ? 'text-amber-400' : 'text-emerald-400' },
    { key: 'slope', label: t.channels.slope, val: `${slope}°`, icon: Mountain, color: slope > 35 ? 'text-amber-400' : 'text-slate-300' },
    { key: 'ndvi', label: t.channels.ndvi, val: `${ndvi}`, icon: Trees, color: ndvi < 0.2 ? 'text-red-400' : 'text-emerald-400' },
    { key: 'seismic', label: t.channels.seismic, val: `${seismic} g`, icon: Zap, color: 'text-purple-400' },
    { key: 'pore', label: t.channels.pore, val: `${porePressure} kPa`, icon: Compass, color: 'text-blue-400' },
    { key: 'displacement', label: t.channels.displacement, val: `${displacement} mm/h`, icon: Cpu, color: displacement > 3.0 ? 'text-red-400' : 'text-amber-400' }
  ];

  const getProgressColor = (prob) => {
    if (prob >= 80) return 'from-red-600 to-rose-500';
    if (prob >= 60) return 'from-amber-500 to-orange-500';
    if (prob >= 35) return 'from-yellow-500 to-amber-400';
    return 'from-emerald-500 to-teal-400';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-950 border border-cyan-800/60 rounded-xl text-cyan-400">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>{t.sensorFusionTitle}</span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800 rounded">
                7 CHANNELS ACTIVE
              </span>
            </h2>
            <p className="text-xs text-slate-400">{t.sensorFusionSub}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {/* LoRa Mesh Telemetry Status Badge */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-bold">{t.loraStatus}</span>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">{t.signalConfidence}</div>
              <div className="flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-base font-bold font-mono text-emerald-400">{confidence}%</span>
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">{t.overallRiskProb}</div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-extrabold font-mono text-white">{riskProb}%</span>
                <span className={`px-2 py-0.5 text-[10px] font-bold font-mono rounded border uppercase ${
                  category === 'CRITICAL' ? 'bg-red-950 text-red-400 border-red-800' :
                  category === 'HIGH' ? 'bg-amber-950 text-amber-400 border-amber-800' :
                  category === 'MEDIUM' ? 'bg-yellow-950 text-yellow-400 border-yellow-800' :
                  'bg-emerald-950 text-emerald-400 border-emerald-800'
                }`}>
                  {category}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Probability Progress Bar */}
      <div>
        <div className="w-full h-3 bg-slate-950 rounded-full p-0.5 border border-slate-800 relative overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(riskProb)} transition-all duration-500 shadow-lg`}
            style={{ width: `${Math.max(5, Math.min(100, riskProb))}%` }}
          ></div>
        </div>
      </div>

      {/* 7 Telemetry Channels Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-1">
        {channelsData.map((ch) => {
          const Icon = ch.icon;
          return (
            <div key={ch.key} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 flex flex-col justify-between hover:border-slate-700 transition">
              <div className="flex items-center justify-between">
                <Icon className={`w-4 h-4 ${ch.color}`} />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <div className="mt-2">
                <div className="text-[10px] text-slate-400 truncate" title={ch.label}>{ch.label}</div>
                <div className="text-xs font-bold font-mono text-white mt-0.5">{ch.val}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
