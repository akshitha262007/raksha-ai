import React, { useState } from 'react';
import { useWebPush } from '../hooks/useWebPush';
import { Bell, BellOff, Send, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function AlertPanel() {
  const { permission, isSubscribed, vapidPublicKey, requestPermission, sendNotification } = useWebPush();
  const [alertLog, setAlertLog] = useState([
    { id: 1, title: 'Geofence System Active', body: 'Monitoring Sikkim sector 24h precipitation telemetry.', time: 'System Boot' }
  ]);

  const handleTestAlert = () => {
    const title = '🚨 CRITICAL LANDSLIDE WARNING: Gangtok Sector A';
    const body = 'Precipitation exceeded 210mm in 24h. Slope instability index 85%. Immediate evacuation ordered.';
    
    sendNotification(title, body);
    
    setAlertLog(prev => [
      { id: Date.now(), title, body, time: new Date().toLocaleTimeString() },
      ...prev
    ]);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <span>VAPID Web Push Alert Panel</span>
          </h2>
          <p className="text-xs text-slate-400">Standalone Browser-Native Push Infrastructure (Zero Paid SMS APIs)</p>
        </div>

        <div className="flex items-center gap-2">
          {permission === 'granted' ? (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-mono rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>VAPID Push Active</span>
            </span>
          ) : (
            <button
              onClick={requestPermission}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs rounded-lg transition shadow-md"
            >
              <Bell className="w-4 h-4" />
              <span>Enable Browser Push</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold text-slate-300">VAPID Public Key Handshake Pattern</div>
          <div className="text-[11px] font-mono text-slate-500 truncate max-w-md mt-0.5">
            Key: {vapidPublicKey}
          </div>
        </div>

        <button
          onClick={handleTestAlert}
          disabled={permission !== 'granted'}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-medium text-xs rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-red-600/20"
        >
          <Send className="w-4 h-4" />
          <span>Dispatch Web Push Warning</span>
        </button>
      </div>

      <div>
        <h3 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">
          Recent Push Alert Log Stream
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {alertLog.map((log) => (
            <div key={log.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs flex items-start gap-3">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">{log.title}</span>
                  <span className="font-mono text-[10px] text-slate-500">{log.time}</span>
                </div>
                <p className="text-slate-400 text-[11px] mt-1">{log.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
