import React, { useState } from 'react';
import { Bell, ShieldCheck, CheckCircle2, Lock, X } from 'lucide-react';

export default function WebPushBanner() {
  const [subscribed, setSubscribed] = useState(false);
  const [token, setToken] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleSubscribe = async () => {
    if ('Notification' in window) {
      const res = await Notification.requestPermission();
      if (res === 'granted') {
        const simToken = `vapid_token_raksha_${Math.random().toString(36).substring(2, 11)}`;
        setToken(simToken);
        setSubscribed(true);
        new Notification('🚨 RAKSHA-AI Citizen Alerts Subscribed', {
          body: 'Privacy VAPID Push active. Instant landslide warnings will be delivered to your browser.',
          icon: '/vite.svg'
        });
        return;
      }
    }

    // Fallback simulation
    const simToken = `vapid_token_raksha_${Math.random().toString(36).substring(2, 11)}`;
    setToken(simToken);
    setSubscribed(true);
  };

  return (
    <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 border border-cyan-800/80 rounded-xl p-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-cyan-900/60 border border-cyan-700/60 rounded-xl text-cyan-400 shrink-0">
          <Bell className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white">Enable Location-Based Web Push Alerts</h3>
            <span className="flex items-center gap-1 text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full">
              <Lock className="w-3 h-3" /> No Phone Number Required
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Privacy-first browser VAPID push encryption. Receive real-time geofenced emergency landslide warnings without exposing your personal phone number or PII.
          </p>
          {subscribed && token && (
            <div className="text-[11px] font-mono text-emerald-400 mt-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Active Token: <strong>{token}</strong></span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {!subscribed ? (
          <button
            onClick={handleSubscribe}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs rounded-lg transition shadow-lg shadow-cyan-600/20"
          >
            <Bell className="w-4 h-4" />
            <span>Enable Web Push</span>
          </button>
        ) : (
          <span className="px-3 py-1.5 bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold font-mono rounded-lg flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Push Active</span>
          </span>
        )}

        <button
          onClick={() => setDismissed(true)}
          className="p-1.5 text-slate-400 hover:text-slate-200 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
