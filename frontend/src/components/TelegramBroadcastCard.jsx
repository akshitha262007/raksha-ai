import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquare, Zap } from 'lucide-react';

export default function TelegramBroadcastCard({ hazardResult, params }) {
  const [lastBroadcast, setLastBroadcast] = useState(null);
  const [broadcasting, setBroadcasting] = useState(false);
  const [realAlertStatus, setRealAlertStatus] = useState(null);

  const BOT_TOKEN = "8748896465:AAHHCeT23MkgkvlOYIqF_XYb91-c8IKawuw";
  const CHAT_ID = "7125554895";

  const handleSendRealTelegramAlert = async () => {
    setBroadcasting(true);
    setRealAlertStatus(null);

    const currentRiskIndex = Math.round((hazardResult?.risk_score || 0) * 100);
    const factorOfSafety = hazardResult?.factor_of_safety ?? 1.5;
    const isHighRisk = currentRiskIndex >= 70 || factorOfSafety < 1.0;
    const location = params?.location_name || 'Gangtok-Pakyong Belt, Sikkim';

    const message = `🚨 *RAKSHA-AI EMERGENCY BROADCAST* 🚨\n\n` +
                    `📍 *Sector:* ${location}\n` +
                    `⚠️ *Landslide Risk Index:* ${currentRiskIndex}% (${isHighRisk ? 'CRITICAL' : 'LOW'})\n` +
                    `📈 *Factor of Safety (Fs):* ${factorOfSafety}\n\n` +
                    `📢 *Directive:* ${
                      isHighRisk 
                        ? 'Mandatory Evacuation Order Active on NH-10. Proceed to designated NDRF/SDRF relief camps immediately.' 
                        : 'Normal monitoring active. Telemetry within safe operating parameters. No action required.'
                    }`;

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
        setRealAlertStatus({ success: true, msg: `⚡ Telegram alert synced & dispatched to Chat ID ${CHAT_ID}!` });
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
      const currentRiskIndex = Math.round((hazardResult?.risk_score || 0) * 100);
      const factorOfSafety = hazardResult?.factor_of_safety ?? 1.5;
      const isHighRisk = currentRiskIndex >= 70 || factorOfSafety < 1.0;
      const location = params?.location_name || 'Gangtok-Pakyong Belt, Sikkim';

      const payload = {
        channel: '@raksha_ner_alert_bot',
        message: `🚨 *RAKSHA-AI EMERGENCY BROADCAST*\n*Location:* ${location}\n*Hazard Index:* ${currentRiskIndex}% (${isHighRisk ? 'CRITICAL' : 'LOW'})\n*Factor of Safety (Fs):* ${factorOfSafety}\n*Advisory:* ${isHighRisk ? 'Evacuate downslope zones immediately. Avoid NH-10 Pakyong Cut.' : 'Normal monitoring active.'}`,
        sentTime: new Date().toLocaleTimeString()
      };

      setLastBroadcast(payload);
      setBroadcasting(false);
    }, 800);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white shadow-xl flex flex-col gap-4">
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 8 9 8z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-white">
              Anonymous Telegram Emergency Broadcast
            </h3>
            <p className="text-sm text-slate-400">
              Public Channel & Direct Bot Dispatch (<span className="text-blue-400 font-medium font-mono">@raksha_ner_alert_bot</span>)
            </p>
          </div>
        </div>

        {/* Join Channel / Bot Button */}
        <a
          href="https://t.me/raksha_ner_alert_bot"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all shadow-lg shadow-blue-600/20"
        >
          <span>Open Bot</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      {/* Content Body with QR Code */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mt-2">
        {/* Left Box: Scan Info */}
        <div className="bg-amber-100/10 border border-amber-500/20 rounded-xl p-4 flex flex-col items-center justify-center text-center">
          <div className="w-32 h-32 bg-amber-100 rounded-lg flex items-center justify-center p-2 mb-2">
            <img 
              src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://t.me/raksha_ner_alert_bot" 
              alt="QR Code for @raksha_ner_alert_bot" 
              className="w-full h-full object-contain rounded"
            />
          </div>
          <span className="text-xs font-semibold text-amber-300 font-mono">
            Scan for @raksha_ner_alert_bot
          </span>
        </div>

        {/* Right Box: Actions & Description */}
        <div className="md:col-span-2 flex flex-col justify-between space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            Automated emergency alert payloads dispatched via Telegram Bot API during high-risk geofence breaches (&gt; 80% risk). Zero user registration or phone numbers required.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSendRealTelegramAlert}
              disabled={broadcasting}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-all shadow-md shadow-blue-500/20 disabled:opacity-50"
            >
              <Zap className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>{broadcasting ? 'Sending Alert...' : 'Send Real Telegram Alert'}</span>
            </button>

            <button
              onClick={handleSimulateTelegram}
              disabled={broadcasting}
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm px-5 py-2.5 rounded-lg border border-slate-700 transition-all disabled:opacity-50"
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
