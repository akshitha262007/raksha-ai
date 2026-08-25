"use client";

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Zap, 
  MapPin, 
  Layers, 
  Radio, 
  FileText, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  RefreshCw, 
  PhoneCall, 
  Users, 
  CloudRain, 
  Droplets, 
  Mountain, 
  Crosshair, 
  Info, 
  Clock, 
  ArrowUpRight,
  ShieldCheck,
  Navigation,
  Globe,
  UploadCloud,
  Check,
  Volume2,
  VolumeX,
  Smartphone,
  Bell,
  Siren,
  Truck,
  UserCheck,
  AlertCircle,
  BarChart3,
  PieChart,
  History,
  Sparkles,
  Play,
  XCircle,
  CornerDownRight,
  Shield,
  ArrowRight,
  ChevronRight,
  Languages,
  Eye,
  Lock,
  MessageSquare,
  Cpu,
  ToggleLeft,
  ToggleRight,
  Sliders,
  Compass
} from 'lucide-react';
import { useDisasterData } from '@/hooks/useDisasterData';
import { 
  LandslideZone, 
  ResourceNode, 
  AlertLanguage, 
  calculateSpatialDistanceKm,
  explainAiRiskReasoning
} from '@/lib/engine';
import { validatePhoneNumber, maskPhoneNumber } from '@/lib/services/sms/smsService';

export default function Page() {
  const {
    zones,
    resources,
    incidents,
    responseUnits,
    logs,
    activeAlert,
    demoMode,
    dataSources,
    sensorFusion,
    groundVerificationState,
    isOptimizing,
    isAutoStreamActive,
    isGatewaySimulating,
    gatewayStep,
    selectedLanguage,
    isSpeechPlaying,
    realSmsState,
    realSmsHistory,
    setDemoMode,
    setSelectedLanguage,
    toggleDataSource,
    simulateSatelliteFailure,
    requestGroundVerification,
    executeOptimization,
    addCitizenReport,
    toggleAutoStream,
    playVoiceAlert,
    sendRealTestSms,
    dispatchEmergencyAlert,
    acknowledgeAssignment,
    updateUnitStatus,
    triggerOverdueAndEscalate,
  } = useDisasterData();

  const [activeTab, setActiveTab] = useState<'command' | 'citizen' | 'citizen-alerts' | 'response-ops'>('command');
  const [selectedZoneId, setSelectedZoneId] = useState<string>('zone-tawang');
  const [mapLayer, setMapLayer] = useState<'bhuvan' | 'risk' | 'geology' | 'historical' | 'terrain' | 'rainfall'>('bhuvan');
  const [logFilter, setLogFilter] = useState<string>('ALL');

  // Citizen Form State
  const [reportRegion, setReportRegion] = useState<string>('zone-tawang');
  const [fissureType, setFissureType] = useState<string>('Deep Structural Fissures');
  const [seepageLevel, setSeepageLevel] = useState<string>('Heavy Muddy Runoff');
  const [reporterName, setReporterName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  // REAL SMS TEST STATE
  const [testPhoneNumber, setTestPhoneNumber] = useState<string>('+919876543210');
  const [phoneValidationError, setPhoneValidationError] = useState<string | null>(null);
  
  const defaultTestMessage = `RAKSHA AI — TEST ALERT\nThis is a demonstration of the Raksha AI Citizen Early Warning System.\nSimulated landslide risk: EXTREME\nLocation: Zone 4\nNO EMERGENCY ACTION IS REQUIRED.`;
  const [testMessageText, setTestMessageText] = useState<string>(defaultTestMessage);

  // Confirmation Modal State
  const [showSmsConfirmModal, setShowSmsConfirmModal] = useState<boolean>(false);

  // Preview Editing
  const [isEditingMessage, setIsEditingMessage] = useState<boolean>(false);
  const [customAlertText, setCustomAlertText] = useState<string>('');

  // Selected Unit Modal State
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>('unit-rescue-a');

  // AI Explainability Drawer State
  const [showAiExplainability, setShowAiExplainability] = useState<boolean>(false);

  const selectedZone = zones.find(z => z.id === selectedZoneId) || zones[0];
  const selectedUnit = responseUnits.find(u => u.id === selectedUnitId) || responseUnits[0];

  const satelliteSource = dataSources.find(s => s.id === 'satellite');
  const isSatelliteAvailable = satelliteSource?.enabled && satelliteSource?.status === 'Available';

  const handleCitizenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    addCitizenReport({
      zoneId: reportRegion,
      fissureType,
      seepageLevel,
      description,
      reporterName: reporterName || 'Anonymous Citizen Reporter',
    });

    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setDescription('');
      setReporterName('');
    }, 4000);
  };

  const handlePhoneInputChange = (value: string) => {
    setTestPhoneNumber(value);
    if (!value.trim()) {
      setPhoneValidationError('Phone number cannot be empty.');
    } else {
      const check = validatePhoneNumber(value);
      if (!check.isValid) {
        setPhoneValidationError(check.error || 'Invalid phone format.');
      } else {
        setPhoneValidationError(null);
      }
    }
  };

  const isUnicode = /[^\u0000-\u007F]/.test(testMessageText);
  const charLimitPerSegment = isUnicode ? 70 : 160;
  const charLength = testMessageText.length;
  const segmentCount = Math.ceil(charLength / charLimitPerSegment) || 1;

  const handleOpenSmsConfirm = () => {
    const check = validatePhoneNumber(testPhoneNumber);
    if (!check.isValid) {
      setPhoneValidationError(check.error || 'Please enter a valid phone number.');
      return;
    }
    setPhoneValidationError(null);
    setShowSmsConfirmModal(true);
  };

  const handleConfirmSendSms = () => {
    setShowSmsConfirmModal(false);
    sendRealTestSms(testPhoneNumber, testMessageText);
  };

  const filteredLogs = logFilter === 'ALL' 
    ? logs 
    : logs.filter(l => l.type === logFilter);

  const criticalCount = zones.filter(z => z.riskLevel === 'Critical').length;
  const moderateCount = zones.filter(z => z.riskLevel === 'Moderate').length;
  const safeCount = zones.filter(z => z.riskLevel === 'Safe').length;

  const currentLanguageMessage = customAlertText || activeAlert.messages[selectedLanguage];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans bg-tech-grid">
      
      {/* ========================================================================= */}
      {/* HEADER NAVBAR */}
      {/* ========================================================================= */}
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50 px-4 lg:px-8 py-3">
        <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-950/50">
                <ShieldAlert className="h-6 w-6 animate-pulse text-cyan-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-xl tracking-wider text-white flex items-center gap-2">
                    RAKSHA<span className="text-cyan-400 font-extrabold">-AI</span>
                  </h1>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-700/50">
                    SIH PS 26001
                  </span>

                  <button
                    onClick={() => setDemoMode(!demoMode)}
                    className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold transition-all border ${
                      demoMode
                        ? 'bg-amber-950/90 text-amber-300 border-amber-500/80 shadow-sm animate-pulse'
                        : 'bg-slate-900 text-slate-400 border-slate-700'
                    }`}
                    title="Toggle Demo Simulation Mode"
                  >
                    <span>🧪</span>
                    <span>{demoMode ? 'DEMO MODE ACTIVE' : 'LIVE SYSTEM'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  Multi-Source Landslide Early Warning & Risk Assessment Platform • NER
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <button 
                onClick={toggleAutoStream}
                className="flex items-center gap-1.5 text-xs bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full text-slate-300"
              >
                <span className={`h-2 w-2 rounded-full ${isAutoStreamActive ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
                {isAutoStreamActive ? 'LIVE 4s' : 'PAUSED'}
              </button>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-6 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg">
              <Cpu className="h-4 w-4 text-cyan-400" />
              <span>AI Sensor Fusion: <strong className="text-emerald-400 font-normal">{sensorFusion.activeSourceCount}/7 Channels Active</strong></span>
            </div>

            <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg">
              <Activity className="h-4 w-4 text-amber-400" />
              <span>Telemetry Loop:</span>
              <button 
                onClick={toggleAutoStream}
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <span className={`h-2.5 w-2.5 rounded-full ${isAutoStreamActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span className="text-slate-200">{isAutoStreamActive ? 'PULSING (4s Sync)' : 'PAUSED'}</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-rose-400 font-bold bg-rose-950/60 border border-rose-900 px-2 py-0.5 rounded">
                {criticalCount} Critical
              </span>
              <span className="text-amber-400 font-bold bg-amber-950/60 border border-amber-900 px-2 py-0.5 rounded">
                {moderateCount} Moderate
              </span>
              <span className="text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-900 px-2 py-0.5 rounded">
                {safeCount} Safe
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={executeOptimization}
              disabled={isOptimizing}
              className={`w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg ${
                isOptimizing 
                  ? 'bg-cyan-950 border border-cyan-600 text-cyan-300 cursor-wait' 
                  : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border border-cyan-400/30 shadow-cyan-900/40 hover:shadow-cyan-600/30'
              }`}
            >
              <Zap className={`h-4 w-4 ${isOptimizing ? 'animate-spin text-cyan-400' : 'text-yellow-300'}`} />
              <span>{isOptimizing ? 'Evaluating Spatial Proximity Matrix...' : 'Execute Optimization Engine'}</span>
            </button>
          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* NAVIGATION TAB CONTROLLER */}
      {/* ========================================================================= */}
      <div className="border-b border-slate-800 bg-slate-900/60 px-4 lg:px-8 py-2">
        <div className="max-w-[1800px] mx-auto flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab('command')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-xs md:text-sm transition-all whitespace-nowrap ${
                activeTab === 'command'
                  ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-700/60 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Cpu className="h-4 w-4 text-cyan-400" />
              <span>Multi-Source Risk Engine</span>
            </button>

            <button
              onClick={() => setActiveTab('citizen-alerts')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-xs md:text-sm transition-all whitespace-nowrap ${
                activeTab === 'citizen-alerts'
                  ? 'bg-rose-950/90 text-rose-300 border border-rose-700/60 shadow-sm ring-1 ring-rose-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Siren className="h-4 w-4 text-rose-400 animate-pulse" />
              <span>🚨 Citizen Alerts</span>
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 text-[10px] border border-rose-500/40 font-mono">
                WARN
              </span>
            </button>

            <button
              onClick={() => setActiveTab('response-ops')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-xs md:text-sm transition-all whitespace-nowrap ${
                activeTab === 'response-ops'
                  ? 'bg-amber-950/90 text-amber-300 border border-amber-700/60 shadow-sm ring-1 ring-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Truck className="h-4 w-4 text-amber-400" />
              <span>🚑 Response Operations</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px] border border-amber-500/40 font-mono">
                TRACK
              </span>
            </button>

            <button
              onClick={() => setActiveTab('citizen')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-xs md:text-sm transition-all whitespace-nowrap ${
                activeTab === 'citizen'
                  ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-700/60 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <FileText className="h-4 w-4 text-emerald-400" />
              <span>Citizen Field Reporter</span>
            </button>
          </div>

          <div className="text-xs text-slate-400 hidden lg:flex items-center gap-3 font-mono">
            <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-cyan-300">
              Multi-Source: Satellite + Rain + Soil + Slope + History + Weather + Ground Sensors
            </span>
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-[1800px] w-full mx-auto p-4 lg:p-6 flex flex-col gap-6">

        {/* ========================================================================= */}
        {/* VIEWPORT 1: MULTI-SOURCE RISK ASSESSMENT & AI SENSOR FUSION ENGINE */}
        {/* ========================================================================= */}
        {activeTab === 'command' && (
          <div className="flex flex-col gap-6">

            {/* 1. AI SENSOR FUSION ENGINE HERO & METRICS (Req #2, #5, #7, #8, #9, #15, #18) */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-cyan-950 border border-cyan-500/60 rounded-2xl p-5 shadow-2xl flex flex-col gap-4 font-mono">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-cyan-950 border border-cyan-500/80 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-950">
                    <Cpu className="h-7 w-7 animate-pulse text-cyan-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-extrabold text-white tracking-wide uppercase">
                        🧠 AI SENSOR FUSION ENGINE & MULTI-SOURCE SUMMARY
                      </h2>
                      <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-700 text-cyan-300 text-[10px]">
                        MULTI-CHANNEL RISK MATRIX
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 font-sans">
                      Synthesizes 7 independent observational streams to calculate landslide probability, confidence metrics, and fault-tolerant early warnings.
                    </p>
                  </div>
                </div>

                {/* Judge Demo Trigger: Simulate Satellite Failure (Req #5 & #20) */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={simulateSatelliteFailure}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs border flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                      isSatelliteAvailable
                        ? 'bg-rose-950 hover:bg-rose-900 text-rose-300 border-rose-700 animate-pulse'
                        : 'bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border-emerald-700'
                    }`}
                  >
                    <Zap className="h-4 w-4 text-yellow-300" />
                    <span>{isSatelliteAvailable ? '🧪 SIMULATE SATELLITE FAILURE' : '🟢 RESTORE SATELLITE DATA'}</span>
                  </button>
                </div>
              </div>

              {/* FUSION GAUGES & METRIC CARDS (Req #2, #7, #9) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Landslide Probability Meter */}
                <div className="bg-slate-950 p-4 rounded-xl border border-rose-900/80 flex flex-col justify-between">
                  <span className="text-slate-400 text-xs flex items-center justify-between">
                    <span>Combined Landslide Probability</span>
                    <TrendingUp className="h-4 w-4 text-rose-400" />
                  </span>
                  <div className="my-2 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-rose-400">{sensorFusion.combinedProbability}%</span>
                    <span className="text-xs text-slate-400">Risk Probability</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-500"
                      style={{ width: `${sensorFusion.combinedProbability}%` }}
                    />
                  </div>
                </div>

                {/* Dynamic Confidence Score */}
                <div className="bg-slate-950 p-4 rounded-xl border border-cyan-900/80 flex flex-col justify-between">
                  <span className="text-slate-400 text-xs flex items-center justify-between">
                    <span>AI Model Confidence</span>
                    <ShieldCheck className="h-4 w-4 text-cyan-400" />
                  </span>
                  <div className="my-2 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-cyan-300">{sensorFusion.confidenceScore}%</span>
                    <span className="text-xs text-slate-400">Signal Certainty</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="h-full bg-cyan-400 transition-all duration-500"
                      style={{ width: `${sensorFusion.confidenceScore}%` }}
                    />
                  </div>
                </div>

                {/* Risk Level Category Badge */}
                <div className="bg-slate-950 p-4 rounded-xl border border-amber-900/80 flex flex-col justify-between">
                  <span className="text-slate-400 text-xs flex items-center justify-between">
                    <span>Evaluated Warning Classification</span>
                    <Siren className="h-4 w-4 text-amber-400" />
                  </span>
                  <div className="my-1">
                    <span className="text-sm font-bold text-amber-300 block leading-tight">
                      {sensorFusion.warningCategory}
                    </span>
                    <span className="text-[10px] text-slate-400">Risk & Confidence Separated</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold">
                    {sensorFusion.activeSourceCount} of {sensorFusion.totalSourceCount} Channels Active
                  </span>
                </div>

                {/* Ground Verification Prompt / Status (Req #10) */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <span className="text-slate-400 text-xs flex items-center justify-between">
                    <span>Ground Verification Workflow</span>
                    <Radio className="h-4 w-4 text-emerald-400" />
                  </span>
                  <div>
                    <span className="text-xs text-slate-300 font-bold block mb-1">
                      Status: {groundVerificationState === 'Requested' ? '🟡 Awaiting Field Confirmation' : '🟢 Standing By'}
                    </span>
                    <button
                      onClick={requestGroundVerification}
                      className="w-full py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 font-bold text-[11px] flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                      <Radio className="h-3.5 w-3.5 text-cyan-400" />
                      <span>📡 Request Ground Verification</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* SATELLITE UNAVAILABLE NOTICE / FAULT TOLERANCE BANNER (Req #5) */}
              {!isSatelliteAvailable && (
                <div className="bg-rose-950/80 border border-rose-600 p-4 rounded-xl flex items-start justify-between gap-3 text-xs text-rose-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-rose-300 text-sm">
                        🔴 SATELLITE OBSERVATION TEMPORARILY UNAVAILABLE (SIMULATED BLACKOUT)
                      </h4>
                      <p className="mt-1 leading-relaxed text-slate-300">
                        Satellite observation is unavailable. Risk assessment continues uninterrupted using independent environmental and terrain indicators (Rainfall, Soil Moisture, Slope, History, Weather). Confidence has decreased gracefully from 91% to {sensorFusion.confidenceScore}%.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* CONFLICTING SIGNALS CHECK BANNER (Req #8) */}
              {sensorFusion.hasConflictingSignals && (
                <div className="bg-amber-950/80 border border-amber-600 p-4 rounded-xl flex items-start gap-3 text-xs text-amber-200">
                  <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-amber-300 text-sm">
                      ⚠️ DATA CONSISTENCY CHECK — CONFLICTING SIGNALS DETECTED
                    </h4>
                    <p className="mt-1 leading-relaxed text-slate-300">
                      {sensorFusion.conflictDescription}
                    </p>
                    <div className="mt-2 font-bold text-amber-300">
                      Raksha AI Recommendation: Continue monitoring and increase observation frequency. Request local ground verification.
                    </div>
                  </div>
                </div>
              )}

              {/* SATELLITE NON-GROUND-TRUTH TOOLTIP (Req #4) */}
              <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-xs font-sans text-slate-400 flex items-start gap-2">
                <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200">Why multiple sources?</strong> Satellite imagery is one observation source, not the sole determinant of risk. Cloud cover, spatial resolution, and orbital revisit frequency create uncertainty. Raksha AI combines independent environmental and terrain indicators to guarantee robust early warning.
                </div>
              </div>
            </div>

            {/* 2. MULTI-SOURCE DATA CHANNELS (7 CARDS) & DATA HEALTH TOGGLES (Req #1 & #6) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4 font-mono">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                  <Sliders className="h-4 w-4" /> 🧠 MULTI-SOURCE RISK ASSESSMENT CHANNELS ({dataSources.length})
                </h3>
                <span className="text-[10px] text-slate-500">Toggle Data Source Health</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                {dataSources.map(source => {
                  const isEnabled = source.enabled && source.status !== 'Unavailable';

                  return (
                    <div
                      key={source.id}
                      className={`bg-slate-950 border rounded-xl p-4 flex flex-col justify-between gap-3 transition-all ${
                        isEnabled
                          ? 'border-slate-800 hover:border-slate-700'
                          : 'border-rose-900/80 bg-rose-950/10'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{source.icon}</span>
                          <div>
                            <h4 className="font-bold text-slate-100">{source.name}</h4>
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                              source.dataType === 'LIVE DATA' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : source.dataType === 'DEMO DATA' ? 'bg-amber-950 text-amber-400 border-amber-800' : 'bg-cyan-950 text-cyan-400 border-cyan-800'
                            }`}>
                              {source.dataType}
                            </span>
                          </div>
                        </div>

                        {/* Data Source Toggle Switch (Req #6) */}
                        <button
                          onClick={() => toggleDataSource(source.id)}
                          className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                            source.enabled
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                              : 'bg-rose-950 text-rose-400 border border-rose-700'
                          }`}
                        >
                          {source.enabled ? '🟢 ON' : '🔴 OFF'}
                        </button>
                      </div>

                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex flex-col gap-1.5">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">Current Reading:</span>
                          <span className="font-bold text-slate-100">{source.valueDisplay}</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">Confidence:</span>
                          <span className="font-bold text-cyan-300">{source.individualConfidence}%</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">Risk Weight:</span>
                          <span className="font-bold text-rose-400">{source.weight}% Weight</span>
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                        {source.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="text-[10px] text-slate-500 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                * Prototype weighting scheme — requires validation with regional historical landslide datasets before operational deployment.
              </div>
            </div>

            {/* 3. WHY IS THIS AREA AT RISK? & DETECTION VS PREDICTION (Req #3 & #15) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono">
              
              {/* Contributing Factors Explanation (Req #3) */}
              <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-rose-400 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" /> WHY IS THIS AREA AT RISK?
                  </h3>
                  <span className="text-[10px] text-slate-500">Causal Factors</span>
                </div>

                <p className="text-xs text-slate-200 bg-slate-950 p-3.5 rounded-xl border border-slate-800 leading-relaxed font-sans">
                  Heavy rainfall (142 mm / 24h) and high soil moisture (87%) indicate increasing soil pore-water saturation. The area also features steep terrain gradient (38°) and a history of 3 recorded landslide events. These independent environmental signals together increase the predicted probability of slope failure to <strong>{sensorFusion.combinedProbability}%</strong>.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
                    <span>🌧️</span>
                    <span className="font-bold text-slate-200">Heavy Rainfall</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
                    <span>💧</span>
                    <span className="font-bold text-slate-200">Soil Moisture 87%</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
                    <span>⛰️</span>
                    <span className="font-bold text-slate-200">Steep Slope 38°</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
                    <span>📚</span>
                    <span className="font-bold text-slate-200">Historical Events</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
                    <span>🌦️</span>
                    <span className="font-bold text-slate-200">Rain Forecast +80mm</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
                    <span>📡</span>
                    <span className="font-bold text-slate-200">+4.8mm Movement</span>
                  </div>
                </div>
              </div>

              {/* Detection vs Prediction Card (Req #15) */}
              <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                    <Compass className="h-4 w-4" /> Detection vs Early Prediction
                  </h3>
                  <span className="text-[10px] text-slate-500">Core Paradigm</span>
                </div>

                <div className="flex flex-col gap-3 text-xs font-sans">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <strong className="text-slate-400 font-mono block text-[11px]">POST-EVENT DETECTION:</strong>
                    <span className="text-slate-300">Identifies evidence after a landslide has already occurred (e.g. scar on satellite photo).</span>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-cyan-700/60">
                    <strong className="text-cyan-400 font-mono block text-[11px]">RAKSHA AI EARLY PREDICTION:</strong>
                    <span className="text-slate-200">Uses multi-source precursors (rain, pore pressure, slope, forecast) to estimate probability <em>before</em> failure happens.</span>
                  </div>
                </div>
              </div>

            </div>

            {/* 4. GEOSPATIAL MAP WITH MULTI-SOURCE LAYERS (Req #11, #12, #13) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Map Viewport & Layer Switcher */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-cyan-400" />
                    <h2 className="text-sm font-bold tracking-wide uppercase text-slate-300">
                      Geospatial Risk & Multi-Source Map Layers
                    </h2>
                  </div>

                  {/* Multi-Source Layer Switcher */}
                  <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-lg text-xs font-mono">
                    <button
                      onClick={() => setMapLayer('bhuvan')}
                      className={`px-2 py-1 rounded transition-colors ${
                        mapLayer === 'bhuvan' ? 'bg-cyan-950 text-cyan-300 border border-cyan-700' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      ISRO Bhuvan
                    </button>
                    <button
                      onClick={() => setMapLayer('historical')}
                      className={`px-2 py-1 rounded transition-colors ${
                        mapLayer === 'historical' ? 'bg-cyan-950 text-cyan-300 border border-cyan-700' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Historical
                    </button>
                    <button
                      onClick={() => setMapLayer('terrain')}
                      className={`px-2 py-1 rounded transition-colors ${
                        mapLayer === 'terrain' ? 'bg-cyan-950 text-cyan-300 border border-cyan-700' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Slope Gradient
                    </button>
                    <button
                      onClick={() => setMapLayer('rainfall')}
                      className={`px-2 py-1 rounded transition-colors ${
                        mapLayer === 'rainfall' ? 'bg-cyan-950 text-cyan-300 border border-cyan-700' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Rain Trigger
                    </button>
                  </div>
                </div>

                <div className="relative bg-slate-900/90 border border-slate-800 rounded-2xl h-[520px] overflow-hidden flex flex-col justify-between shadow-2xl">
                  <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
                    <div className="bg-slate-950/90 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono text-cyan-400 pointer-events-auto flex items-center gap-2">
                      <Crosshair className="h-4 w-4 animate-spin text-cyan-400" />
                      <span>Layer: {mapLayer.toUpperCase()}</span>
                    </div>

                    <div className="bg-slate-950/90 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-lg text-xs text-slate-300 pointer-events-auto flex items-center gap-3 font-mono">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" /> Geofence Alert
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Truck className="h-3.5 w-3.5 text-amber-400" /> LIVE GPS
                      </span>
                    </div>
                  </div>

                  <div className="relative w-full h-full bg-[#050913] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-tech-grid opacity-30" />
                    
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      {zones.map(z => {
                        const zX = ((z.lng - 88.0) / (95.0 - 88.0)) * 100;
                        const zY = 100 - ((z.lat - 23.0) / (28.5 - 23.0)) * 100;

                        if (z.riskLevel === 'Critical') {
                          return (
                            <g key={`geofence-${z.id}`}>
                              <circle
                                cx={`${zX}%`}
                                cy={`${zY}%`}
                                r="45"
                                fill="rgba(244, 63, 94, 0.15)"
                                stroke="#f43f5e"
                                strokeWidth="2"
                                strokeDasharray="4 4"
                                className="animate-pulse"
                              />
                            </g>
                          );
                        }
                        return null;
                      })}

                      {responseUnits.map(unit => {
                        const uX = ((unit.currentLng - 88.0) / (95.0 - 88.0)) * 100;
                        const uY = 100 - ((unit.currentLat - 23.0) / (28.5 - 23.0)) * 100;

                        const tX = ((unit.targetLng - 88.0) / (95.0 - 88.0)) * 100;
                        const tY = 100 - ((unit.targetLat - 23.0) / (28.5 - 23.0)) * 100;

                        return (
                          <g key={`unit-vector-${unit.id}`}>
                            <line
                              x1={`${uX}%`}
                              y1={`${uY}%`}
                              x2={`${tX}%`}
                              y2={`${tY}%`}
                              stroke="#f59e0b"
                              strokeWidth="2"
                              strokeDasharray="6 6"
                              className="animate-pulse"
                            />
                          </g>
                        );
                      })}
                    </svg>

                    {zones.map(z => {
                      const zX = ((z.lng - 88.0) / (95.0 - 88.0)) * 100;
                      const zY = 100 - ((z.lat - 23.0) / (28.5 - 23.0)) * 100;
                      const isSelected = z.id === selectedZoneId;

                      return (
                        <div
                          key={`marker-${z.id}`}
                          onClick={() => setSelectedZoneId(z.id)}
                          style={{ left: `${zX}%`, top: `${zY}%` }}
                          className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                        >
                          <div className={`relative flex items-center justify-center p-2 rounded-full border transition-transform duration-300 ${
                            z.riskLevel === 'Critical' 
                              ? 'bg-rose-950 border-rose-500 shadow-lg shadow-rose-950' 
                              : z.riskLevel === 'Moderate'
                              ? 'bg-amber-950 border-amber-500 shadow-lg shadow-amber-950'
                              : 'bg-emerald-950 border-emerald-500'
                          } ${isSelected ? 'scale-125 ring-2 ring-cyan-400' : 'group-hover:scale-110'}`}>
                            <MapPin className={`h-4 w-4 ${
                              z.riskLevel === 'Critical' ? 'text-rose-400' : z.riskLevel === 'Moderate' ? 'text-amber-400' : 'text-emerald-400'
                            }`} />
                          </div>

                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col bg-slate-950 border border-slate-800 p-2.5 rounded-lg shadow-2xl z-30 w-48 text-xs font-mono pointer-events-none">
                            <span className="font-bold text-slate-100">{z.name}</span>
                            <span className="text-slate-400">{z.state}</span>
                            <span className={`font-bold ${z.riskLevel === 'Critical' ? 'text-rose-400' : 'text-amber-400'}`}>
                              Risk: {z.riskScore}% ({z.riskLevel})
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Selected Zone: <strong className="text-cyan-300">{selectedZone.name} ({selectedZone.state})</strong></span>
                    <span className="text-[11px] text-amber-300 font-bold">Rainfall: 142mm/24h • Slope: 38°</span>
                  </div>
                </div>
              </div>

              {/* Prediction Timeline (Req #14) */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h2 className="text-sm font-bold tracking-wide uppercase text-slate-300 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-cyan-400" />
                    Risk Evolution Timeline
                  </h2>
                  <span className="text-xs text-slate-500 font-mono">Telemetry Trend</span>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col gap-3 font-mono text-xs h-[520px] overflow-y-auto">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-400">08:00 AM — MODERATE RISK</span>
                      <span className="text-[10px] text-slate-400">Telemetry Sync</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Rainfall: 42 mm/h | Soil moisture: 58%</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-amber-800/80 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-300">10:00 AM — HIGH RISK</span>
                      <span className="text-[10px] text-slate-400">Telemetry Rain ↑</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Rainfall surged to 98 mm/h | Soil moisture reached 74%.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-700/80 flex flex-col gap-1 animate-pulse">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-400">12:00 PM — EXTREME RISK</span>
                      <span className="text-[10px] text-slate-400">Critical Anomaly</span>
                    </div>
                    <p className="text-[11px] text-rose-200">Rainfall peak 142 mm/24h + soil moisture 87% triggered Sensor Fusion Extreme Risk (87%).</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEWPORT 2: CITIZEN EARLY WARNING SYSTEM */}
        {/* ========================================================================= */}
        {activeTab === 'citizen-alerts' && (
          <div className="flex flex-col gap-6">

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col gap-3 font-mono">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Siren className="h-5 w-5 text-rose-400 animate-pulse" />
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    CITIZEN EARLY WARNING PIPELINE — SENSOR FUSION SYNC
                  </h2>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">
                  Fusion Probability: {sensorFusion.combinedProbability}% (Conf: {sensorFusion.confidenceScore}%)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-emerald-700/60 flex flex-col gap-1.5">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <Smartphone className="h-4 w-4" /> 🧪 REAL TEST SMS (Server API)
                  </span>
                  <p className="text-[11px] text-slate-300">
                    Sends one real test SMS to an authorized test phone number via server-side SMS provider integration.
                  </p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-rose-800/60 flex flex-col gap-1.5">
                  <span className="font-bold text-rose-400 flex items-center gap-1.5">
                    <Siren className="h-4 w-4" /> 🚨 EMERGENCY SIMULATION
                  </span>
                  <p className="text-[11px] text-slate-300">
                    Simulates public emergency gateway broadcast delivery metrics for citizens in affected geofence.
                  </p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-cyan-800/60 flex flex-col gap-1.5">
                  <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <Globe className="h-4 w-4" /> 🏛️ FUTURE DEPLOYMENT
                  </span>
                  <p className="text-[11px] text-slate-300">
                    Requires formal authorization & API binding to India's official Cell Broadcast emergency infrastructure.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 flex flex-col gap-5">
                <div className="bg-slate-900/90 border border-emerald-600/50 rounded-2xl p-5 shadow-2xl flex flex-col gap-4 font-mono">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5 text-emerald-400 animate-pulse" />
                      <div>
                        <h3 className="font-extrabold text-sm uppercase tracking-wider text-emerald-400">
                          📱 SEND TEST SMS — REAL MESSAGE
                        </h3>
                        <span className="text-[10px] text-slate-400 font-normal">
                          Server-Side SMS Provider Integration
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] font-bold">
                      TEST SMS ONLY
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    This sends one real test SMS to the phone number entered below. It does not issue a public emergency alert.
                  </p>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                      <span>Recipient phone number (International format)</span>
                      <span className="text-[10px] text-slate-400 font-normal">e.g. +91XXXXXXXXXX</span>
                    </label>
                    <input
                      type="text"
                      value={testPhoneNumber}
                      onChange={(e) => handlePhoneInputChange(e.target.value)}
                      placeholder="+919876543210"
                      className={`bg-slate-950 border rounded-xl p-3 text-xs text-slate-100 font-mono focus:outline-none ${
                        phoneValidationError ? 'border-rose-500 ring-1 ring-rose-500/50' : 'border-slate-800 focus:border-emerald-500'
                      }`}
                    />
                    {phoneValidationError && (
                      <span className="text-[11px] font-bold text-rose-400 flex items-center gap-1">
                        <XCircle className="h-3.5 w-3.5" /> {phoneValidationError}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                        <MessageSquare className="h-3.5 w-3.5 text-cyan-400" /> Test SMS Message Content
                      </label>

                      <button
                        onClick={() => setTestMessageText(defaultTestMessage)}
                        className="text-[10px] text-cyan-400 hover:underline font-bold flex items-center gap-1"
                      >
                        <Sparkles className="h-3 w-3 text-yellow-300" /> Reset Default Payload
                      </button>
                    </div>

                    <textarea
                      value={testMessageText}
                      onChange={(e) => setTestMessageText(e.target.value)}
                      rows={5}
                      className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 font-mono focus:border-cyan-500 focus:outline-none leading-relaxed"
                    />

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>
                        Characters: <strong className="text-slate-200">{charLength}</strong> ({isUnicode ? 'Unicode 70/seg' : 'GSM 160/seg'})
                      </span>
                      <span>
                        SMS Segments: <strong className="text-cyan-300">{segmentCount}</strong>
                      </span>
                    </div>

                    {segmentCount > 1 && (
                      <span className="text-[10px] text-amber-400">
                        ⚠️ Message exceeds 1 standard SMS segment. Multi-segment SMS may incur additional provider charges.
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleOpenSmsConfirm}
                    disabled={realSmsState.sending}
                    className="py-3 px-5 rounded-xl font-extrabold text-xs uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-950 border border-emerald-400/40 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Smartphone className={`h-4 w-4 ${realSmsState.sending ? 'animate-spin' : ''}`} />
                    <span>{realSmsState.sending ? 'Sending test SMS...' : '📱 SEND TEST SMS'}</span>
                  </button>

                  {realSmsState.success === true && (
                    <div className="bg-emerald-950/80 border border-emerald-600 p-4 rounded-xl flex flex-col gap-2 text-xs font-mono">
                      <div className="flex items-center justify-between border-b border-emerald-800 pb-2">
                        <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4" /> 🟢 TEST SMS SENT
                        </span>
                        <span className="text-[10px] text-slate-400">Sent at: {realSmsState.timestamp}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Recipient</span>
                          <span className="font-bold text-slate-100">{maskPhoneNumber(realSmsState.phone || '')}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Provider Status</span>
                          <span className="font-bold text-emerald-400 uppercase">Submitted</span>
                        </div>
                        {realSmsState.messageId && (
                          <div className="col-span-2">
                            <span className="text-slate-400 block text-[10px]">Provider Reference ID</span>
                            <span className="font-mono text-cyan-300">{realSmsState.messageId}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {realSmsState.success === false && (
                    <div className="bg-rose-950/80 border border-rose-600 p-4 rounded-xl flex flex-col gap-2 text-xs font-mono text-rose-200">
                      <div className="flex items-center justify-between border-b border-rose-800 pb-2 font-bold text-rose-300">
                        <span className="flex items-center gap-1.5">
                          <XCircle className="h-4 w-4 text-rose-400" /> 🔴 SMS NOT SENT
                        </span>
                        <span className="text-[10px] text-slate-400">{realSmsState.timestamp}</span>
                      </div>
                      <p className="text-[11px] font-normal leading-relaxed">{realSmsState.error}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-6 flex flex-col gap-5">
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-yellow-300" /> Multilingual Citizen Warning Generator
                    </h3>
                    <span className="text-[10px] text-slate-500 font-mono">Accessible Warning Text</span>
                  </div>

                  <div className="flex flex-col gap-2 font-mono text-xs">
                    <label className="text-slate-300 font-bold flex items-center gap-2">
                      <Languages className="h-4 w-4 text-cyan-400" /> Citizen Language Selector:
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {[
                        { code: 'en', label: 'English' },
                        { code: 'hi', label: 'हिंदी (Hindi)' },
                        { code: 'as', label: 'অসমীয়া (Assamese)' },
                        { code: 'bn', label: 'বাংলা (Bengali)' },
                        { code: 'ne', label: 'नेपाली (Nepali)' },
                        { code: 'mn', label: 'Manipuri' },
                      ].map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => setSelectedLanguage(lang.code as AlertLanguage)}
                          className={`p-2 rounded-xl border text-center transition-all text-xs font-semibold ${
                            selectedLanguage === lang.code
                              ? 'bg-cyan-950 border-cyan-500 text-cyan-300 ring-1 ring-cyan-500/50'
                              : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
                          }`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Active Multilingual Script Preview Card */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-cyan-800/80 flex flex-col gap-2 font-sans">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 font-mono text-xs">
                      <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                        <Languages className="h-3.5 w-3.5 text-cyan-400" />
                        {selectedLanguage === 'en' && '🇬🇧 ENGLISH ALERT SCRIPT'}
                        {selectedLanguage === 'hi' && '🇮🇳 HINDI (हिंदी) ALERT SCRIPT'}
                        {selectedLanguage === 'as' && '🇮🇳 ASSAMESE (অসমীয়া) ALERT SCRIPT'}
                        {selectedLanguage === 'bn' && '🇮🇳 BENGALI (বাংলা) ALERT SCRIPT'}
                        {selectedLanguage === 'ne' && '🇳🇵 NEPALI (नेपाली) ALERT SCRIPT'}
                        {selectedLanguage === 'mn' && '🇮🇳 MANIPURI ALERT SCRIPT'}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold">
                        🔊 AUDIO READY
                      </span>
                    </div>

                    <div className="text-xs text-slate-100 font-medium whitespace-pre-wrap leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                      {currentLanguageMessage}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <button
                      onClick={() => setCustomAlertText('')}
                      className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 flex items-center justify-center gap-2 transition-all cursor-pointer font-mono"
                    >
                      <Sparkles className="h-4 w-4 text-yellow-300" />
                      <span>✨ REGENERATE SCRIPT</span>
                    </button>

                    <button
                      onClick={() => playVoiceAlert(currentLanguageMessage, selectedLanguage)}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs border flex items-center justify-center gap-2 transition-all cursor-pointer font-mono ${
                        isSpeechPlaying
                          ? 'bg-amber-950 border-amber-500 text-amber-300 animate-pulse'
                          : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-emerald-400/40 shadow-lg shadow-emerald-950'
                      }`}
                    >
                      {isSpeechPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-white" />}
                      <span>{isSpeechPlaying ? 'PLAYING AUDIO...' : '🔊 PLAY VOICE ALERT'}</span>
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-rose-900/80 rounded-2xl p-5 shadow-xl flex flex-col gap-4 font-mono">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-rose-400 flex items-center gap-2">
                      <Siren className="h-4 w-4 animate-pulse" /> 🚨 EMERGENCY SIMULATION GATEWAY
                    </h3>
                    <span className="text-[10px] text-slate-500">Mass Geofence Delivery</span>
                  </div>

                  <button
                    onClick={() => dispatchEmergencyAlert()}
                    disabled={isGatewaySimulating}
                    className="py-3 px-5 rounded-xl font-extrabold text-xs uppercase tracking-wider bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-950 border border-rose-400/40 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Siren className={`h-4 w-4 ${isGatewaySimulating ? 'animate-spin' : ''}`} />
                    <span>{isGatewaySimulating ? 'SIMULATING EMERGENCY GATEWAY...' : '🚨 SIMULATE EMERGENCY ALERT BROADCAST'}</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEWPORT 3: EMERGENCY RESPONSE ACCOUNTABILITY */}
        {/* ========================================================================= */}
        {activeTab === 'response-ops' && (
          <div className="flex flex-col gap-6">

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold tracking-wide uppercase text-white flex items-center gap-2">
                    <Truck className="h-5 w-5 text-amber-400" />
                    INCIDENT RESPONSE STATUS & SENSOR FUSION REASONING
                  </h2>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                    Prob: {sensorFusion.combinedProbability}% • Conf: {sensorFusion.confidenceScore}%
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Incident dispatch and deployment tracking updated automatically by AI Sensor Fusion predictions.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs flex-wrap">
                <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                  Citizen Alert: 🟢 Dispatched
                </span>
                <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                  Rescue Team: 🟢 Accepted
                </span>
                <span className="px-2.5 py-1 rounded bg-amber-950 text-amber-400 border border-amber-800 font-bold">
                  Medical Team: 🟡 En Route
                </span>
                <span className="px-2.5 py-1 rounded bg-rose-950 text-rose-400 border border-rose-800 font-bold animate-pulse">
                  Evacuation: 🔴 Awaiting Response
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 flex flex-col gap-5">
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-rose-400 flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4" /> Active Disaster Incidents ({incidents.length})
                    </h3>
                    <span className="text-[10px] text-slate-500 font-mono">Live Dispatch Feed</span>
                  </div>

                  <div className="flex flex-col gap-3">
                    {incidents.map(inc => (
                      <div key={inc.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 font-mono">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-xs text-cyan-400 font-bold">{inc.id}</span>
                            <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2 mt-0.5">
                              <span>🔴 {inc.hazard}</span>
                              <span className="text-xs text-slate-400 font-normal">• 📍 {inc.zoneName} ({inc.state})</span>
                            </h4>
                          </div>

                          <span className="text-xs px-2.5 py-1 rounded bg-rose-950 text-rose-400 border border-rose-800 font-bold">
                            {inc.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-xs bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
                          <div>
                            <span className="text-slate-500 block text-[10px]">Sensor Fusion Prob</span>
                            <span className="font-bold text-rose-400">{sensorFusion.combinedProbability}%</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Confidence Score</span>
                            <span className="font-bold text-cyan-300">{sensorFusion.confidenceScore}%</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Target Response</span>
                            <span className="font-bold text-emerald-400">{inc.targetResponseTimeMinutes} mins (Target)</span>
                          </div>
                        </div>

                        <div className="mt-1 flex flex-col gap-2">
                          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                            Response Units Assigned
                          </span>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {responseUnits.filter(u => u.incidentId === inc.id).map(unit => (
                              <button
                                key={unit.id}
                                onClick={() => setSelectedUnitId(unit.id)}
                                className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                                  unit.id === selectedUnitId
                                    ? 'bg-slate-900 border-cyan-500 ring-1 ring-cyan-500/50'
                                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                                }`}
                              >
                                <div>
                                  <span className="font-bold text-slate-200 block text-[11px]">{unit.role}: {unit.unitName}</span>
                                  <span className="text-[10px] text-slate-400">{unit.personnelCount} Personnel</span>
                                </div>

                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                  unit.status === 'Accepted' || unit.status === 'En Route'
                                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                                    : unit.status === 'Overdue'
                                    ? 'bg-rose-950 text-rose-400 border-rose-800 animate-pulse'
                                    : 'bg-amber-950 text-amber-400 border-amber-800'
                                }`}>
                                  {unit.status}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col gap-5 font-mono">
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-amber-400 flex items-center gap-2">
                      <UserCheck className="h-4 w-4" /> Emergency Assignment Controls
                    </h3>
                    <span className="text-[10px] text-slate-500">Unit ID: {selectedUnit.id}</span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-3 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-bold text-slate-200">{selectedUnit.unitName}</span>
                      <span className={`px-2.5 py-0.5 rounded border text-[10px] font-bold ${
                        selectedUnit.status === 'Accepted' || selectedUnit.status === 'En Route'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                          : selectedUnit.status === 'Overdue'
                          ? 'bg-rose-950 text-rose-400 border-rose-800 animate-pulse'
                          : 'bg-amber-950 text-amber-400 border-amber-800'
                      }`}>
                        {selectedUnit.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => acknowledgeAssignment(selectedUnit.id)}
                        className="flex-1 py-2 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>ACCEPT ASSIGNMENT</span>
                      </button>

                      <button
                        onClick={() => updateUnitStatus(selectedUnit.id, 'En Route')}
                        className="flex-1 py-2 rounded-lg bg-amber-950 hover:bg-amber-900 border border-amber-700 text-amber-300 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                      >
                        <Truck className="h-3.5 w-3.5" />
                        <span>DISPATCH EN ROUTE</span>
                      </button>
                    </div>

                    <button
                      onClick={() => triggerOverdueAndEscalate(selectedUnit.id)}
                      className="w-full py-2 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-700 text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer mt-1"
                    >
                      <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                      <span>SIMULATE ACKNOWLEDGEMENT OVERDUE & ESCALATE</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* VIEWPORT 4: CITIZEN FIELD REPORTER */}
        {activeTab === 'citizen' && (
          <div className="max-w-4xl mx-auto w-full flex flex-col gap-6 font-mono">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
                <div className="h-10 w-10 rounded-xl bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Citizen Field Reporter Portal
                  </h2>
                  <p className="text-xs text-slate-400">
                    Report real-world ground truth observations directly to Raksha AI's Sensor Fusion Engine.
                  </p>
                </div>
              </div>

              {formSubmitted ? (
                <div className="bg-emerald-950/60 border border-emerald-500/50 p-6 rounded-xl text-center flex flex-col items-center gap-3">
                  <CheckCircle2 className="h-12 w-12 text-emerald-400 animate-bounce" />
                  <h3 className="text-lg font-bold text-emerald-300">FIELD REPORT SUCCESSFULLY SUBMITTED</h3>
                  <p className="text-xs text-slate-300 max-w-md">
                    Your report has been logged into the Raksha AI telemetry stream. Soil moisture and landslide risk metrics for the targeted zone have been dynamically adjusted.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleCitizenSubmit} className="flex flex-col gap-5 text-xs">
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-300 font-bold">Select Monitored Region / Sector</label>
                    <select
                      value={reportRegion}
                      onChange={(e) => setReportRegion(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:border-cyan-500 focus:outline-none"
                    >
                      {zones.map(z => (
                        <option key={z.id} value={z.id}>
                          {z.name} ({z.state}) — Current Risk: {z.riskLevel}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-slate-300 font-bold">Fissure & Crack Classification</label>
                      <select
                        value={fissureType}
                        onChange={(e) => setFissureType(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:border-cyan-500 focus:outline-none"
                      >
                        <option value="Deep Structural Fissures">Deep Structural Fissures (&gt; 15cm width)</option>
                        <option value="Surface Tension Cracks">Surface Tension Cracks</option>
                        <option value="Retaining Wall Shear">Retaining Wall Shear Deflection</option>
                        <option value="Road Slump & Escarpment">Road Slump & Escarpment</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-slate-300 font-bold">Water Seepage Level</label>
                      <select
                        value={seepageLevel}
                        onChange={(e) => setSeepageLevel(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:border-cyan-500 focus:outline-none"
                      >
                        <option value="Heavy Muddy Runoff">Heavy Muddy Runoff (Active Erosion)</option>
                        <option value="Clear Water Spring Burst">Clear Water Spring Burst</option>
                        <option value="Pooling Moisture">Pooling Moisture / Saturated Turf</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-slate-300 font-bold">Reporter Name (Optional)</label>
                    <input
                      type="text"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      placeholder="e.g. Tsering Dorjee / Local Warden"
                      className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-slate-300 font-bold">Incident Description & Observations *</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      placeholder="Describe what you observed on the slope..."
                      className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:border-cyan-500 focus:outline-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="py-3 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 cursor-pointer transition-all mt-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Submit Ground Truth Incident Report</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* LOG TICKER TERMINAL */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl font-mono text-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-400" />
              <h3 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                Real-Time Telemetry & Log Ticker ({filteredLogs.length})
              </h3>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto text-[10px]">
              {['ALL', 'INFO', 'WARNING', 'ALERT', 'OPTIMIZE', 'CITIZEN_REPORT', 'ACCOUNTABILITY', 'ESCALATION'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setLogFilter(filter)}
                  className={`px-2.5 py-1 rounded font-bold transition-all ${
                    logFilter === filter
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
            {filteredLogs.map(log => {
              let badgeColor = 'bg-slate-950 text-slate-400 border-slate-800';
              if (log.type === 'ALERT') badgeColor = 'bg-rose-950 text-rose-400 border-rose-800';
              if (log.type === 'WARNING') badgeColor = 'bg-amber-950 text-amber-400 border-amber-800';
              if (log.type === 'OPTIMIZE') badgeColor = 'bg-cyan-950 text-cyan-400 border-cyan-800';
              if (log.type === 'CITIZEN_REPORT') badgeColor = 'bg-emerald-950 text-emerald-400 border-emerald-800';
              if (log.type === 'ACCOUNTABILITY') badgeColor = 'bg-amber-950 text-amber-300 border-amber-800';
              if (log.type === 'ESCALATION') badgeColor = 'bg-rose-950 text-rose-300 border-rose-800 font-bold animate-pulse';

              return (
                <div key={log.id} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/70 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${badgeColor}`}>
                        {log.type}
                      </span>
                      <span className="font-semibold text-slate-200">{log.message}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                  </div>
                  {log.details && (
                    <span className="text-[11px] text-slate-400 pl-2 border-l border-slate-800">
                      {log.details}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </main>

      {/* CONFIRMATION MODAL FOR REAL TEST SMS */}
      {showSmsConfirmModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/60 rounded-2xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4 font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-emerald-400 animate-pulse" />
                Send Real Test SMS?
              </h3>
              <button
                onClick={() => setShowSmsConfirmModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px] mb-0.5">Recipient Number:</span>
                <span className="font-mono text-cyan-300 text-sm font-bold">{testPhoneNumber}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] mb-0.5">Message Preview:</span>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-200 font-sans text-xs whitespace-pre-wrap max-h-36 overflow-y-auto">
                  {testMessageText}
                </div>
              </div>

              <div className="bg-amber-950/40 border border-amber-800/60 p-3 rounded-xl text-[11px] text-amber-300">
                ⚠️ <strong>Disclaimer:</strong> This will send one real test SMS to the authorized phone number specified above and may incur provider charges.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowSmsConfirmModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 transition-all cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmSendSms}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Send Test SMS</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950 py-3.5 px-6 text-center text-xs text-slate-500 font-mono">
        <p>RAKSHA-AI • Multi-Source Landslide Early Warning System • SIH PS 26001</p>
      </footer>

    </div>
  );
}
