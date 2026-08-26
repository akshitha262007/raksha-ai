import React, { useEffect } from 'react';
import { useHazardPredictor } from '../hooks/useHazardPredictor';
import { playEmergencyAudioBeep, speakEmergencyIvrNotice } from '../services/audioIvrService';
import { Gauge, AlertTriangle, CheckCircle2, Play, RefreshCw, Sparkles, Volume2 } from 'lucide-react';

export default function HazardPredictor({ onPredictionChange, lang = 'en', t }) {
  const { params, updateParam, loading, result, error, executePrediction } = useHazardPredictor();

  useEffect(() => {
    executePrediction();
  }, []);

  useEffect(() => {
    if (result && onPredictionChange) {
      onPredictionChange(result, params);

      // Play emergency audio beep tone if risk > 80%
      if (result.risk_score >= 0.80) {
        playEmergencyAudioBeep();
      }
    }
  }, [result, params]);

  const handleSliderChange = (key, value) => {
    updateParam(key, value);
    executePrediction({ ...params, [key]: value });
  };

  const applyPreset = (preset) => {
    let customParams = {};
    if (preset === 'cloudburst') {
      customParams = { slope_angle: 52.0, rainfall_24h: 340.0, soil_moisture: 92.0, ndvi: 0.05, location_name: 'Mangan Cloudburst Sector' };
    } else if (preset === 'monsoon') {
      customParams = { slope_angle: 38.0, rainfall_24h: 210.0, soil_moisture: 85.0, ndvi: 0.25, location_name: 'Gangtok Monsoon Belt' };
    } else if (preset === 'erosion') {
      customParams = { slope_angle: 45.0, rainfall_24h: 140.0, soil_moisture: 65.0, ndvi: -0.05, location_name: 'Pakyong Erosion Cut' };
    } else {
      customParams = { slope_angle: 18.0, rainfall_24h: 25.0, soil_moisture: 35.0, ndvi: 0.70, location_name: 'Namchi Baseline Zone' };
    }

    Object.entries(customParams).forEach(([k, v]) => updateParam(k, v));
    executePrediction(customParams);
  };

  const handleTriggerIvr = () => {
    playEmergencyAudioBeep();
    speakEmergencyIvrNotice(null, lang);
  };

  const getBadgeColor = (category) => {
    switch (category) {
      case 'CRITICAL': return 'bg-red-950 text-red-400 border-red-800';
      case 'HIGH': return 'bg-amber-950 text-amber-400 border-amber-800';
      case 'MEDIUM': return 'bg-yellow-950 text-yellow-400 border-yellow-800';
      default: return 'bg-emerald-950 text-emerald-400 border-emerald-800';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Gauge className="w-5 h-5 text-cyan-400" />
            <span>{t.predictorTitle}</span>
          </h2>
          <p className="text-xs text-slate-400">Heuristic Risk Pipeline (XGBoost Classifier Interface)</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Voice IVR Call Trigger */}
          <button
            onClick={handleTriggerIvr}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950 hover:bg-red-900 text-red-400 border border-red-800 font-mono text-xs rounded-lg transition shadow-md"
            title="Trigger Web Speech Synthesis Emergency Phone IVR Dispatch"
          >
            <Volume2 className="w-4 h-4 animate-pulse" />
            <span>{t.triggerIvrBtn}</span>
          </button>

          <button
            onClick={() => executePrediction()}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs rounded-lg transition disabled:opacity-50 shadow-md shadow-cyan-600/20"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span>{loading ? t.evaluating : t.runPipeline}</span>
          </button>
        </div>
      </div>

      {/* What-If Scenario Presets */}
      <div>
        <div className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{t.whatIfTitle}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => applyPreset('cloudburst')}
            className="bg-slate-950 hover:bg-red-950/40 border border-slate-800 hover:border-red-800 text-slate-300 hover:text-red-300 p-2 rounded-lg text-left transition font-medium"
          >
            {t.scenarioCloudburst}
          </button>
          <button
            onClick={() => applyPreset('monsoon')}
            className="bg-slate-950 hover:bg-amber-950/40 border border-slate-800 hover:border-amber-800 text-slate-300 hover:text-amber-300 p-2 rounded-lg text-left transition font-medium"
          >
            {t.scenarioMonsoon}
          </button>
          <button
            onClick={() => applyPreset('erosion')}
            className="bg-slate-950 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-800 text-slate-300 hover:text-purple-300 p-2 rounded-lg text-left transition font-medium"
          >
            {t.scenarioErosion}
          </button>
          <button
            onClick={() => applyPreset('safe')}
            className="bg-slate-950 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-800 text-slate-300 hover:text-emerald-300 p-2 rounded-lg text-left transition font-medium"
          >
            {t.scenarioSafe}
          </button>
        </div>
      </div>

      {/* Input Sliders & Parameters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Slope Angle */}
        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-300 font-medium">{t.channels.slope}</span>
            <span className="font-mono font-bold text-cyan-400">{params.slope_angle}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="60"
            step="0.5"
            value={params.slope_angle}
            onChange={(e) => handleSliderChange('slope_angle', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>

        {/* 24h Rainfall */}
        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-300 font-medium">{t.channels.precip}</span>
            <span className="font-mono font-bold text-cyan-400">{params.rainfall_24h} mm</span>
          </div>
          <input
            type="range"
            min="0"
            max="400"
            step="1"
            value={params.rainfall_24h}
            onChange={(e) => handleSliderChange('rainfall_24h', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>

        {/* Soil Moisture */}
        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-300 font-medium">{t.channels.soil}</span>
            <span className="font-mono font-bold text-cyan-400">{params.soil_moisture}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={params.soil_moisture}
            onChange={(e) => handleSliderChange('soil_moisture', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>

        {/* NDVI */}
        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-300 font-medium">{t.channels.ndvi}</span>
            <span className="font-mono font-bold text-cyan-400">{params.ndvi}</span>
          </div>
          <input
            type="range"
            min="-0.2"
            max="1.0"
            step="0.05"
            value={params.ndvi}
            onChange={(e) => handleSliderChange('ndvi', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-950/60 border border-red-800 rounded-lg text-xs text-red-300">
          {error}
        </div>
      )}

      {/* Output Results Panel */}
      {result && (
        <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <div>
              <div className="text-xs text-slate-400 font-mono">CALCULATED HAZARD RISK INDEX</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold font-mono text-white">
                  {(result.risk_score * 100).toFixed(1)}%
                </span>
                <span className="text-xs text-slate-400 font-mono">({result.risk_score} / 1.0)</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 text-xs font-bold font-mono border rounded-md uppercase tracking-wider ${getBadgeColor(result.risk_category)}`}>
                {result.risk_category}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <h4 className="font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Primary Risk Triggers</span>
              </h4>
              <ul className="space-y-1.5 text-slate-400">
                {result.key_contributing_factors.map((f, i) => (
                  <li key={i} className="bg-slate-900/60 p-2 rounded border border-slate-800/40">
                    • {f}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>SOP Recommendations</span>
              </h4>
              <ul className="space-y-1.5 text-slate-400">
                {result.recommended_actions.map((a, i) => (
                  <li key={i} className="bg-slate-900/60 p-2 rounded border border-slate-800/40">
                    ✓ {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
