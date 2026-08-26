import React, { useState } from 'react';
import { ShieldCheck, Filter, Clock, UserCheck } from 'lucide-react';

export default function AuditLogPanel({ auditLogs = [], t }) {
  const [filterRole, setFilterRole] = useState('ALL');

  const filtered = auditLogs.filter(item => {
    if (filterRole === 'ALL') return true;
    return item.role === filterRole;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-bold text-white">{t.auditTitle}</h2>
        </div>

        {/* Role Filter Pills */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
          {['ALL', 'Collector', 'NDRF Commander', 'BRO Officer'].map((r) => (
            <button
              key={r}
              onClick={() => setFilterRole(r)}
              className={`px-2.5 py-1 rounded transition ${
                filterRole === r ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-950 rounded-lg border border-slate-800 p-3 max-h-56 overflow-y-auto space-y-2 font-mono text-xs">
        {filtered.length === 0 ? (
          <div className="text-slate-500 text-center py-6">No governance audit entries matching role filter.</div>
        ) : (
          filtered.map((log) => (
            <div key={log.id} className="bg-slate-900 p-2.5 rounded border border-slate-800 flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-800 text-cyan-400 border border-slate-700 rounded">
                    {log.role}
                  </span>
                  <span className="font-sans font-semibold text-slate-200">{log.action}</span>
                </div>
                <div className="text-[11px] font-sans text-slate-400 mt-1">{log.details}</div>
              </div>
              <span className="text-[10px] text-slate-500 shrink-0">{log.time}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
