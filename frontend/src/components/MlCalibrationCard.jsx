import React, { useState } from 'react';
import { Sliders, CheckCircle2, AlertTriangle, RefreshCw, Cpu } from 'lucide-react';

export default function MlCalibrationCard({ t }) {
  const [feedbackLog, setFeedbackLog] = useState([
    { id: 1, date: '2026-08-25', location: 'Pakyong Cut B', predictedRisk: '84%', outcome: 'Actual Landslide Occurred', weightAdj: '+2.5% Rainfall Weight' },
    { id: 2, date: '2026-08-22', location: 'Namchi Slope D', predictedRisk: '55%', outcome: 'False Alarm / Safe', weightAdj: '-1.0% Slope Weight' }
  ]);

  const [selectedOutcome, setSelectedOutcome] = useState('Landslide Occurred');
  const [sector, setSector] = useState('Mangan North Sector');
  const [calibrated, setCalibrated] = useState(false);

  const handleLogFeedback = (e) => {
    e.preventDefault();
    setCalibrated(true);

    const newLog = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      location: sector,
      predictedRisk: '78%',
      outcome: selectedOutcome,
      weightAdj: selectedOutcome === 'Landslide Occurred' ? '+1.8% Moisture Weight' : '-1.5% Moisture Weight'
    };

    setFeedbackLog([newLog, ...feedbackLog]);
    setTimeout(() => setCalibrated(false), 3000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col gap-4">
      <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
        <div className="p-2 bg-purple-950 border border-purple-800 rounded-lg text-purple-400">
          <Cpu className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white">{t.mlCalibTitle}</h2>
          <p className="text-xs text-slate-400">Post-Disaster Ground Truth Feedback & Local Model Weight Optimization</p>
        </div>
      </div>

      <form onSubmit={handleLogFeedback} className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-400 mb-1">Target Geofence Sector</label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
            >
              <option value="Mangan North Sector">Mangan North Sector</option>
              <option value="Pakyong Slide Belt B">Pakyong Slide Belt B</option>
              <option value="Gangtok Sector A">Gangtok Sector A</option>
              <option value="Singtam Highway Washout">Singtam Highway Washout</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Observed Ground Truth Outcome</label>
            <select
              value={selectedOutcome}
              onChange={(e) => setSelectedOutcome(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-bold"
            >
              <option value="Landslide Occurred">Actual Landslide Occurred</option>
              <option value="False Alarm / Safe">False Alarm / Safe Slope</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={calibrated}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg transition shadow-md shadow-purple-600/20 disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${calibrated ? 'animate-spin' : ''}`} />
          <span>{calibrated ? 'Calibrating...' : t.logFeedbackBtn}</span>
        </button>
      </form>

      {/* Historical Calibration Log */}
      <div>
        <div className="text-xs font-mono text-slate-400 mb-2 uppercase tracking-wide">Historical Model Recalibration Log</div>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {feedbackLog.map((log) => (
            <div key={log.id} className="bg-slate-950 p-2.5 rounded border border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">{log.date}</span>
                <span className="font-bold text-slate-300">{log.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-400">Pred: {log.predictedRisk}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  log.outcome.includes('Landslide') ? 'bg-red-950 text-red-400 border-red-800' : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                }`}>
                  {log.outcome}
                </span>
                <span className="text-cyan-400 text-[11px] font-bold">{log.weightAdj}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
