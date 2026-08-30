import React, { useState } from 'react';
import { Send, QrCode, ExternalLink, CheckCircle2, MessageSquare, Zap } from 'lucide-react';

export default function TelegramBroadcastCard({ hazardResult, params }) {
  const [lastBroadcast, setLastBroadcast] = useState(null);
  const [broadcasting, setBroadcasting] = useState(false);
  const [realAlertStatus, setRealAlertStatus] = useState(null);

  const BOT_TOKEN = "8748896465:AAHHCeT23MkgkvlOYIqF_XYb91-c8IKawuw";
  const CHAT_ID = "7125554895";

  const handleSendRealTelegramAlert = async () => {
    setBroadcasting(true);
    setRealAlertStatus(null);

    const riskScore = hazardResult?.risk_score || 0.88;
    const category = hazardResult?.risk_category || 'CRITICAL ALERT';
    const fs = hazardResult?.factor_of_safety || 0.93;
    const location = params?.location_name || 'Gangtok-Pakyong Belt, Sikkim (Node #7)';

    const message = `🚨 *RAKSHA-AI EMERGENCY BROADCAST* 🚨\n\n` +
                    `📍 *Sector:* ${location}\n` +
                    `⚠️ *Landslide Risk Index:* ${Math.round(riskScore * 100)}% (${category})\n` +
                    `📈 *Factor of Safety (Fs):* ${fs}\n\n` +
                    `📢 *Directive:* Mandatory Evacuation Order Active on NH-10. Proceed to designated NDRF/SDRF relief camps immediately.`;

    try {
      const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: "Markdown",
        }),
      });

      if (res.ok) {
        setRealAlertStatus({ success: true, msg: "⚡ Real Telegram Emergency Dispatch Sent to Chat ID: 7125554895!" });
        setLastBroadcast({
          channel: `Chat ID: ${CHAT_ID}`,
          message: message,
          sentTime: new Date().toLocaleTimeString()
        });
      } else {
        const errData = await res.json();
        console.error("Telegram Dispatch Failed:", errData);
        setRealAlertStatus({ success: false, msg: `Telegram Dispatch Failed: ${errData.description || 'API Error'}` });
      }
    } catch (err) {
      console.error("Network Error:", err);
      setRealAlertStatus({ success: false, msg: `Network Error: ${err.message}` });
    } finally {
      setBroadcasting(false);
    }
  };

  const handleSimulateTelegram = () => {
    setBroadcasting(true);
    setRealAlertStatus(null);
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
    }, 800);
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
            <p className="text-xs text-slate-400">Public Channel & Direct Bot Dispatch (@SikkimEmergencyAlerts)</p>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={handleSendRealTelegramAlert}
              disabled={broadcasting}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-lg transition disabled:opacity-50 shadow-lg shadow-blue-600/20"
            >
              <Zap className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>⚡ Send Real Telegram Alert</span>
            </button>

            <button
              onClick={handleSimulateTelegram}
              disabled={broadcasting}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-lg transition disabled:opacity-50 border border-slate-700"
            >
              <Send className="w-4 h-4 text-blue-400" />
              <span>Simulate Payload Preview</span>
            </button>
          </div>

          {realAlertStatus && (
            <div className={`p-2.5 rounded-lg border text-xs font-mono flex items-center gap-2 ${
              realAlertStatus.success ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-red-950 text-red-300 border-red-800'
            }`}>
              {realAlertStatus.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <Send className="w-4 h-4 text-red-400 shrink-0" />}
              <span>{realAlertStatus.msg}</span>
            </div>
          )}

          {lastBroadcast && (
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1">
              <div className="flex items-center justify-between text-blue-400 font-bold border-b border-slate-800 pb-1">
                <span>RECIPIENT: {lastBroadcast.channel}</span>
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
