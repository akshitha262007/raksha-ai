import React, { useState } from 'react';
import { generateCAP12Payload, downloadCAP12XML } from '../services/capFeedService';
import { Download, FileCode, CheckCircle2, Copy } from 'lucide-react';

export default function CapFeedExporter({ params, hazardResult }) {
  const [copied, setCopied] = useState(false);
  const { xmlPayload, jsonPayload } = generateCAP12Payload(params, hazardResult);

  const handleCopyXML = () => {
    navigator.clipboard.writeText(xmlPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-950 border border-emerald-800 rounded-lg text-emerald-400">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">CAP 1.2 Feed Payload Exporter (SACHET Integration)</h3>
            <p className="text-xs text-slate-400">OASIS Common Alerting Protocol v1.2 National Cell-Broadcasting Payload</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyXML}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs rounded-lg transition border border-slate-700"
          >
            <Copy className="w-3.5 h-3.5 text-cyan-400" />
            <span>{copied ? 'Copied!' : 'Copy XML'}</span>
          </button>

          <button
            onClick={() => downloadCAP12XML(params, hazardResult)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs rounded-lg transition shadow-lg shadow-emerald-600/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CAP 1.2 XML</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 max-h-48 overflow-y-auto font-mono text-[11px] text-emerald-400">
        <pre className="whitespace-pre-wrap">{xmlPayload}</pre>
      </div>
    </div>
  );
}
