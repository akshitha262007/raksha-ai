import React, { useState } from 'react';
import { AlertOctagon, Radio, ShieldCheck, MapPin, Navigation, Send, CheckCircle2, PhoneCall, Signal, Truck, Clock, HeartPulse, Cross } from 'lucide-react';

export default function CitizenView({ hazardResult, params, onOpenReportModal, t }) {
  const [sosSent, setSosSent] = useState(false);

  const riskScore = hazardResult?.risk_score || 0.85;
  const category = hazardResult?.risk_category || 'CRITICAL';
  const location = params?.location_name || 'Gangtok-Pakyong Belt, Sikkim Sector';

  const reliefCamps = [
    { name: 'Paljor Stadium Relief Camp', location: 'Gangtok East', capacity: '500 Beds', status: 'OPEN & READY', dist: '1.2 km', supplies: 'Food, Clean Water & Power Available' },
    { name: 'Pakyong High School Grounds', location: 'Pakyong Center', capacity: '300 Beds', status: 'OPEN & READY', dist: '2.8 km', supplies: 'Medical First-Aid & Blankets' },
    { name: 'Mangan Community Relief Center', location: 'Mangan North', capacity: '400 Beds', status: 'OPEN & READY', dist: '4.5 km', supplies: 'Emergency Generator & Supplies' }
  ];

  const medicalPosts = [
    { name: 'STNM Hospital Gangtok', type: 'State Level Referral Hospital', dist: '2.1 km', status: '24/7 Trauma Unit Active', phone: '03592-202016' },
    { name: 'Pakyong Primary Health Center', type: 'Community Health Post', dist: '3.5 km', status: 'Ambulance & First Aid Ready', phone: '03592-257120' }
  ];

  const handleSendSOS = () => {
    setSosSent(true);
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🚨 SOS EMERGENCY LOCATION DISPATCHED', {
        body: `Emergency GPS location (27.3389° N, 88.6065° E) sent to Sikkim SDRF Control Room & LoRa Mesh Node #7.`,
        icon: '/vite.svg'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Dynamic Emergency Risk Alert Card */}
      <div className={`rounded-xl p-6 border shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 ${
        category === 'CRITICAL' ? 'bg-gradient-to-r from-red-950 via-slate-900 to-red-950 border-red-800' :
        category === 'HIGH' ? 'bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-amber-800' :
        'bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-emerald-800'
      }`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl shrink-0 ${
            category === 'CRITICAL' ? 'bg-red-600 text-white animate-bounce' : 'bg-amber-500 text-white'
          }`}>
            <AlertOctagon className="w-8 h-8" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-300">
                CITIZEN PUBLIC SAFETY ADVISORY
              </span>
              <span className={`px-2.5 py-0.5 text-xs font-mono font-bold rounded-full uppercase border ${
                category === 'CRITICAL' ? 'bg-red-950 text-red-400 border-red-800' : 'bg-amber-950 text-amber-400 border-amber-800'
              }`}>
                {category} HAZARD ({Math.round(riskScore * 100)}%)
              </span>
            </div>

            <h2 className="text-2xl font-extrabold text-white mt-1">
              {location}
            </h2>

            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Active landslide threat detected due to heavy rainfall. Avoid NH-10 Pakyong Cut route. Proceed to designated public relief camps immediately.
            </p>
          </div>
        </div>

        {/* SOS Button & Network Signal Status */}
        <div className="flex flex-col sm:flex-row md:flex-col items-end gap-3 shrink-0">
          <button
            onClick={handleSendSOS}
            disabled={sosSent}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-sm font-extrabold font-mono rounded-xl transition shadow-xl ${
              sosSent 
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 cursor-default'
                : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30 animate-pulse'
            }`}
          >
            <Send className="w-5 h-5" />
            <span>{sosSent ? '✓ SOS DISTRESS SENT TO SDRF' : '🚨 SEND EMERGENCY SOS LOCATION'}</span>
          </button>

          {/* Mobile & LoRa Signal Indicator */}
          <div className="flex items-center gap-3 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Signal className="w-3.5 h-3.5" /> 4G Cell Signal Active
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Radio className="w-3.5 h-3.5 animate-pulse" /> LoRa Mesh Backup Ready
            </span>
          </div>
        </div>
      </div>

      {/* 2. Task Force ETA & Dispatch Status Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-950 border border-blue-800 rounded-lg text-blue-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Emergency Task Force Dispatch & Live ETA Tracking</h3>
              <p className="text-xs text-slate-400">NDRF Battalion #4 & SDRF Quick Response Fleet Deployment</p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 bg-cyan-950 text-cyan-400 border border-cyan-800 rounded-lg font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> ETA: 24 MINUTES
            </span>
          </div>
        </div>

        {/* Step-by-Step Dispatch Progress Bar */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span className="font-bold text-white">Active Unit: NDRF 2nd Battalion (Gangtok Hub)</span>
            <span className="text-cyan-400 font-bold">Status: IN TRANSIT TO PAKYONG CUT</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-1">
            <div className="bg-emerald-950 border border-emerald-800 text-emerald-400 p-2 rounded-lg font-bold flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>1. Dispatched (17:10)</span>
            </div>
            <div className="bg-cyan-950 border border-cyan-800 text-cyan-400 p-2 rounded-lg font-bold flex items-center justify-center gap-1 animate-pulse">
              <Truck className="w-3.5 h-3.5" />
              <span>2. In Transit (En Route)</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 text-slate-500 p-2 rounded-lg">
              <span>3. On Site (Est. 17:39)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Local Emergency Help Resources & Medical Posts Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Safe Relief Camps & Medical Help Centers</h3>
          </div>
          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs rounded-lg transition"
          >
            <span>+ Report Road Damage</span>
          </button>
        </div>

        {/* Safe Relief Camps */}
        <div>
          <h4 className="text-xs font-mono font-bold text-slate-300 mb-2 uppercase tracking-wide">
            Verified Safe Shelters & Relief Camps
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {reliefCamps.map((camp, idx) => (
              <div key={idx} className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 text-sm">{camp.name}</span>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 rounded">
                      {camp.status}
                    </span>
                  </div>
                  <div className="text-slate-400 text-xs mt-1">Sector: {camp.location}</div>
                  <div className="text-slate-500 font-mono text-[11px] mt-1">Capacity: {camp.capacity}</div>
                  <div className="text-cyan-400 font-mono text-[11px] mt-1 font-semibold">{camp.supplies}</div>
                </div>

                <div className="flex items-center justify-between text-xs border-t border-slate-800/80 pt-2 font-mono text-cyan-400">
                  <span>Distance: {camp.dist}</span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <Navigation className="w-3.5 h-3.5 text-cyan-400" /> Safe Route Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Medical Posts & Hospital Centers */}
        <div>
          <h4 className="text-xs font-mono font-bold text-slate-300 mb-2 uppercase tracking-wide">
            Nearest Field Hospitals & Medical Emergency Posts
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {medicalPosts.map((med, idx) => (
              <div key={idx} className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-200 flex items-center gap-1.5">
                    <HeartPulse className="w-4 h-4 text-red-400" />
                    <span>{med.name}</span>
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">{med.type} • Distance: {med.dist}</div>
                  <div className="text-emerald-400 font-mono text-[11px] mt-1">{med.status}</div>
                </div>
                <a
                  href={`tel:${med.phone}`}
                  className="px-3 py-1.5 bg-red-950 hover:bg-red-900 border border-red-800 text-red-400 font-mono text-xs font-bold rounded-lg transition flex items-center gap-1 shrink-0"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Hospital</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* One-Tap Direct Emergency Call Action Buttons */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
          <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wide">
            One-Tap Emergency Direct Helpline Calls
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <a
              href="tel:112"
              className="flex items-center justify-center gap-2 p-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition shadow-md"
            >
              <PhoneCall className="w-4 h-4" />
              <span>National Helpline: 112</span>
            </a>
            <a
              href="tel:1070"
              className="flex items-center justify-center gap-2 p-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition shadow-md"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Sikkim Control Room: 1070</span>
            </a>
            <a
              href="tel:1077"
              className="flex items-center justify-center gap-2 p-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition shadow-md"
            >
              <PhoneCall className="w-4 h-4" />
              <span>District Disaster Helpline: 1077</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
