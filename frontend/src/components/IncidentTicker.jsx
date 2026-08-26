import React, { useState } from 'react';
import { Terminal, ShieldAlert, AlertTriangle, Info, Pause, Play, Trash2 } from 'lucide-react';

export default function IncidentTicker({ logs = [], onClearLogs, t }) {
  const [filter, setFilter] = useState('ALL');
  const [isPaused, setIsPaused] = useState(false);

  const filteredLogs = logs.filter(item => {
    if (filter === 'ALL') return true;
    return item.level === filter;
  });

  const getLevelBadge = (level) => {
    switch (level) {
      case 'ACCOUNTABILITY':
      case 'CRITICAL':
        return 'bg-red-950 text-red-400 border-red-800';
      case 'WARNING':
        return 'bg-amber-950 text-amber-400 border-amber-800';
      default:
        return 'bg-blue-950 text-blue-400 border-blue-800';
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 'ACCOUNTABILITY':
      case 'CRITICAL':
        return <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-400 shrink-0" />;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-white">{t.tickerTitle}</h2>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Pills */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
            {['ALL', 'INFO', 'WARNING', 'ACCOUNTABILITY'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilter(lvl)}
                className={`px-2.5 py-1 rounded transition ${
                  filter === lvl ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl === 'ALL' ? t.filterAll : lvl === 'INFO' ? t.filterInfo : lvl === 'WARNING' ? t.filterWarn : t.filterAccountability}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition"
            title={isPaused ? "Resume Ticker" : "Pause Ticker"}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onClearLogs}
            className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-red-400 transition"
            title="Clear Log Stream"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Log Ticker Stream Box */}
      <div className="bg-slate-950 rounded-lg border border-slate-800 p-3 max-h-72 overflow-y-auto space-y-2 font-mono text-xs">
        {filteredLogs.length === 0 ? (
          <div className="text-slate-500 text-center py-6">No incident logs matching filter.</div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="bg-slate-900/80 p-2.5 rounded border border-slate-800/60 flex items-start gap-3 hover:border-slate-700 transition">
              {getLevelIcon(log.level)}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded border ${getLevelBadge(log.level)}`}>
                      {log.level}
                    </span>
                    <span className="font-sans font-semibold text-slate-200">{log.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{log.time}</span>
                </div>
                <div className="text-[11px] font-sans text-slate-400 mt-1">{log.message}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
