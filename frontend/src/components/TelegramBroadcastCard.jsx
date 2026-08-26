import React, { useState } from 'react';
import { Send, QrCode, ExternalLink, CheckCircle2, MessageSquare } from 'lucide-react';

export default function TelegramBroadcastCard({ hazardResult, params }) {
  const [lastBroadcast, setLastBroadcast] = useState(null);
  const [broadcasting, setBroadcasting] = useState(false);

  const handleSimulateTelegram = () => {
    setBroadcasting(true);
    setTimeout(() => {
      const riskScore = hazardResult?.risk_score || 0.75;
      const location = params?.location_name || 'Gangtok-Pakyong Belt, Sikkim';
      const category = hazardResult?.risk_category || 'HIGH';

      const payload = {
        channel: '@SikkimEmergencyAlerts',
        message: `🚨 *RAKSHA-AI EMERGENCY BROADCAST*\n*Location:* ${location}\n*Hazard Index:* ${Math.round(riskScore * 100)}% (${category})\n*Telemetry:* 24h Rain ${params?.rainfall_24h || 185}mm | Slope ${params?.slope_angle || 42.5}°\n*Advisory:* Evacuate downslope zones. Avoid NH-10 Pakyong Cut.`,
        sentTime: new Date().toLocaleTimeString()
      };

      setLastBroadcast(payload);
      setBroadcasting(false);
    }, 1000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-950 border border-blue-800 rounded-lg text-blue-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Anonymous Telegram Emergency Broadcast</h3>
            <p className="text-xs text-slate-400">Public Channel Dispatch Widget (@SikkimEmergencyAlerts)</p>
          </div>
        </div>

        <a
          href="https://t.me/SikkimEmergencyAlerts"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg transition"
        >
          <span>Join Channel</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        {/* QR Code Placeholder SVG */}
        <div className="sm:col-span-4 bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-white p-2 rounded flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950 fill-current">
              <rect x="0" y="0" width="30" height="30" />
              <rect x="10" y="10" width="10" height="10" fill="#fff" />
              <rect x="70" y="0" width="30" height="30" />
              <rect x="80" y="10" width="10" height="10" fill="#fff" />
              <rect x="0" y="70" width="30" height="30" />
              <rect x="10" y="80" width="10" height="10" fill="#fff" />
              <rect x="40" y="40" width="20" height="20" />
              <rect x="10" y="40" width="10" height="20" />
              <rect x="70" y="40" width="20" height="10" />
              <rect x="40" y="10" width="10" height="20" />
              <rect x="40" y="70" width="20" height="20" />
              <rect x="70" y="70" width="20" height="20" />
            </svg>
          </div>
          <span className="text-[10px] font-mono text-slate-400 mt-2">Scan for @SikkimEmergencyAlerts</span>
        </div>

        {/* Action & Bot Output Stream */}
        <div className="sm:col-span-8 space-y-3">
          <div className="text-xs text-slate-300">
            Automated emergency alert payloads dispatched via Telegram Bot API during high-risk geofence breaches (&gt; 80% risk). Zero user registration or phone numbers required.
          </div>

          <button
            onClick={handleSimulateTelegram}
            disabled={broadcasting}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg transition disabled:opacity-50 w-full shadow-lg shadow-blue-600/20"
          >
            <Send className="w-4 h-4" />
            <span>{broadcasting ? 'Broadcasting Telegram Payload...' : 'Simulate Telegram Bot Broadcast'}</span>
          </button>

          {lastBroadcast && (
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1">
              <div className="flex items-center justify-between text-blue-400 font-bold border-b border-slate-800 pb-1">
                <span>CHANNEL: {lastBroadcast.channel}</span>
                <span className="text-[10px] text-slate-500">{lastBroadcast.sentTime}</span>
              </div>
              <pre className="text-slate-300 font-sans whitespace-pre-wrap pt-1">{lastBroadcast.message}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
