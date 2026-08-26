import React, { useState } from 'react';
import { X, Send, MapPin, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function ReportAnomalyModal({ isOpen, onClose, onSubmitReport, t }) {
  const [reporter, setReporter] = useState('Local Field Officer / Citizen');
  const [type, setType] = useState('Rockfall / Slope Debris');
  const [severity, setSeverity] = useState('HIGH');
  const [description, setDescription] = useState('Observed active rockfall near Pakyong cut road. Drainage culvert blocked.');
  const [lat, setLat] = useState('27.2372');
  const [lng, setLng] = useState('88.5902');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReport = {
      id: `CIT-${Date.now()}`,
      reporter,
      type,
      severity,
      description,
      latitude: parseFloat(lat) || 27.2372,
      longitude: parseFloat(lng) || 88.5902,
      time: new Date().toLocaleTimeString()
    };

    onSubmitReport(newReport);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-950 border border-purple-800 text-purple-400 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{t.modalTitle}</h3>
              <p className="text-xs text-slate-400">{t.modalSub}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-950 rounded-lg border border-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">{t.reporterName}</label>
            <input
              type="text"
              required
              value={reporter}
              onChange={(e) => setReporter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">{t.anomalyType}</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Rockfall / Slope Debris">Rockfall / Slope Debris</option>
                <option value="Soil Slump / Erosion">Soil Slump / Erosion</option>
                <option value="Road Surface Crack">Road Surface Crack</option>
                <option value="Water Seepage / Mudflow">Water Seepage / Mudflow</option>
                <option value="Bridge / Culvert Hazard">Bridge / Culvert Hazard</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">{t.severity}</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-bold"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">{t.latitude}</label>
              <input
                type="text"
                required
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-cyan-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">{t.longitude}</label>
              <input
                type="text"
                required
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-cyan-400 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">{t.description}</label>
            <textarea
              rows="3"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg transition font-medium"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg transition shadow-lg shadow-purple-600/20"
            >
              <Send className="w-4 h-4" />
              <span>{t.submitReport}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
