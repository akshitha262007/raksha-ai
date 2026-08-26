import React from 'react';
import { ShieldAlert, AlertOctagon, X, Volume2, Radio } from 'lucide-react';

export default function PublicBillboardView({ isOpen, onClose, hazardResult, params, t }) {
  if (!isOpen) return null;

  const riskScore = hazardResult?.risk_score || 0.85;
  const category = hazardResult?.risk_category || 'CRITICAL';
  const location = params?.location_name || 'Gangtok-Pakyong High-Risk Sector';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between p-6 sm:p-10 font-sans antialiased select-none">
      {/* Top Header Bar for Billboard */}
      <div className="flex items-center justify-between border-b-4 border-red-600 pb-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-600 rounded-2xl animate-pulse">
            <ShieldAlert className="w-10 h-10 text-white" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black font-mono tracking-widest text-red-500 uppercase">
              SIH PS 26001 PUBLIC EMERGENCY BROADCAST
            </div>
            <div className="text-sm text-slate-300 font-mono">
              SIKKIM DISASTER MANAGEMENT AUTHORITY • DIGITAL ROADSIDE DISPLAY MODE
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold font-mono text-sm rounded-xl border border-slate-700 transition"
        >
          <X className="w-5 h-5" />
          <span>EXIT PUBLIC DISPLAY</span>
        </button>
      </div>

      {/* Main High-Contrast Giant Warning Gauge */}
      <div className="my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 bg-red-950/80 border-4 border-red-600 rounded-3xl p-8 text-center flex flex-col items-center justify-center shadow-2xl">
          <AlertOctagon className="w-20 h-20 text-red-500 animate-bounce mb-3" />
          <div className="text-sm font-mono text-red-300 uppercase tracking-widest font-bold">LANDSLIDE HAZARD RISK INDEX</div>
          <div className="text-7xl sm:text-8xl font-black font-mono text-white mt-2">
            {Math.round(riskScore * 100)}%
          </div>
          <div className="mt-4 px-6 py-2 bg-red-600 text-white font-black font-mono text-xl rounded-full tracking-wider uppercase">
            {category} WARNING
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">AFFECTED SECTOR</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white">{location}</div>

            <div className="grid grid-cols-2 gap-4 pt-2 font-mono text-sm sm:text-base">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-xs">24h Rainfall</span>
                <strong className="text-cyan-400 text-xl">{params?.rainfall_24h || 185} mm</strong>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-xs">Slope Gradient</span>
                <strong className="text-cyan-400 text-xl">{params?.slope_angle || 42.5}°</strong>
              </div>
            </div>
          </div>

          <div className="bg-amber-950/60 border-2 border-amber-600 rounded-3xl p-6 text-amber-200 space-y-2">
            <div className="font-bold font-mono text-sm uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Radio className="w-5 h-5 animate-pulse" />
              <span>PUBLIC EMERGENCY ADVISORY</span>
            </div>
            <p className="text-base sm:text-lg font-semibold leading-relaxed">
              Evacuate downslope settlements immediately. NH-10 Pakyong Cut traffic suspended due to active rockfall. Proceed to designated NDRF relief camps.
            </p>
          </div>
        </div>
      </div>

      {/* Scrolling Bottom Warning Ticker for Roadside Displays */}
      <div className="bg-red-950 border-t-4 border-red-600 p-4 rounded-2xl overflow-hidden font-mono font-black text-lg text-white flex items-center">
        <div className="shrink-0 bg-red-600 px-4 py-1 rounded-lg text-sm uppercase mr-4 tracking-wider">
          LIVE TICKER
        </div>
        <div className="truncate animate-pulse">
          🚨 MANDATORY EVACUATION ORDER IN EFFECT FOR PAKYONG AND MANGAN SECTORS • AVOID HIGHWAY NH-10 • EMERGENCY IVR DISPATCH ACTIVE
        </div>
      </div>
    </div>
  );
}
