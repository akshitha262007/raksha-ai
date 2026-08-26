import React from 'react';
import { ShieldAlert, Globe, Activity, PlusCircle, UserCheck, Monitor } from 'lucide-react';

export default function Header({
  currentRole = 'NdrfCommander',
  onRoleChange,
  currentLang = 'en',
  onLangChange,
  onOpenReportModal,
  onOpenPublicBillboard,
  t
}) {
  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 shadow-xl">
      <div className="flex items-center space-x-3">
        <div className="p-2.5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/20">
          <ShieldAlert className="w-7 h-7 text-white" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">{t.appTitle}</h1>
            <span className="px-2.5 py-0.5 text-xs font-bold font-mono bg-cyan-950 text-cyan-400 border border-cyan-800/80 rounded-full">
              SIH PS 26001
            </span>
            <span className="px-2.5 py-0.5 text-xs font-bold font-mono bg-red-950 text-red-400 border border-red-800/80 rounded-full">
              {t.incidentId}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {t.brandingSub}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Public Billboard Mode Toggle */}
        <button
          onClick={onOpenPublicBillboard}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950 hover:bg-red-900 border border-red-800 text-red-400 font-mono text-xs font-bold rounded-lg transition shadow-md"
          title="Open High-Contrast Roadside Public Display Mode"
        >
          <Monitor className="w-4 h-4 animate-pulse" />
          <span>Public Display Mode</span>
        </button>

        {/* Multi-Agency RBAC Role Selector */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
          <UserCheck className="w-4 h-4 text-cyan-400" />
          <select
            value={currentRole}
            onChange={(e) => onRoleChange(e.target.value)}
            className="bg-transparent text-slate-200 font-semibold font-mono focus:outline-none cursor-pointer"
          >
            <option value="Citizen" className="bg-slate-900 text-slate-200">{t.roleCitizen || "Citizen / Public View"}</option>
            <option value="Collector" className="bg-slate-900 text-slate-200">{t.roleCollector}</option>
            <option value="NdrfCommander" className="bg-slate-900 text-slate-200">{t.roleNdrf}</option>
            <option value="BroOfficer" className="bg-slate-900 text-slate-200">{t.roleBro}</option>
          </select>
        </div>

        {/* Citizen Report Anomaly Button */}
        <button
          onClick={onOpenReportModal}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs rounded-lg transition shadow-lg shadow-purple-600/20"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.reportAnomalyBtn}</span>
        </button>

        {/* Multi-Language Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <Globe className="w-4 h-4 text-cyan-400 ml-1.5 mr-0.5" />
          {[
            { code: 'en', label: 'EN' },
            { code: 'hi', label: 'HI' },
            { code: 'ne', label: 'NE' },
            { code: 'bn', label: 'BN' }
          ].map((item) => (
            <button
              key={item.code}
              onClick={() => onLangChange(item.code)}
              className={`px-2 py-1 rounded font-bold transition ${
                currentLang === item.code ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
