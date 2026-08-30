import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import WebPushBanner from './components/WebPushBanner';
import SensorFusionCard from './components/SensorFusionCard';
import MapView from './components/MapView';
import HazardPredictor from './components/HazardPredictor';
import DispatchOptimizer from './components/DispatchOptimizer';
import DistrictCollectorView from './components/DistrictCollectorView';
import BroRoadsView from './components/BroRoadsView';
import CitizenView from './components/CitizenView';
import TelegramBroadcastCard from './components/TelegramBroadcastCard';
import CapFeedExporter from './components/CapFeedExporter';
import MlCalibrationCard from './components/MlCalibrationCard';
import AuditLogPanel from './components/AuditLogPanel';
import IncidentTicker from './components/IncidentTicker';
import ReportAnomalyModal from './components/ReportAnomalyModal';
import PublicBillboardView from './components/PublicBillboardView';
import { translations } from './i18n/translations';
import { Wifi, WifiOff, ShieldCheck } from 'lucide-react';

export default function App() {
  const [role, setRole] = useState('NdrfCommander'); // Citizen, Collector, NdrfCommander, BroOfficer
  const [lang, setLang] = useState('en');
  const t = translations[lang] || translations.en;

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isPublicBillboardOpen, setIsPublicBillboardOpen] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const [activeParams, setActiveParams] = useState({
    slope_angle: 42.5,
    rainfall_24h: 185.0,
    soil_moisture: 78.0,
    ndvi: 0.15,
    location_name: 'Gangtok-Pakyong Belt, Sikkim'
  });

  const [hazardResult, setHazardResult] = useState({
    risk_score: 0.72,
    risk_category: 'HIGH',
    confidence_score: 0.94,
    key_contributing_factors: ['Steep terrain slope gradient', 'Heavy rainfall saturation'],
    recommended_actions: ['Elevate emergency monitoring station alert status'],
    model_version: 'v2.0-aavishkar-risk-engine',
    factor_of_safety: 0.99,
    layer1_lri: 56.3,
    anomaly_flagged: false,
    alert_color: 'ORANGE',
    layer2_action: 'TARGETED PRE-ALERT'
  });

  const [allocations, setAllocations] = useState([]);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const [auditLogs, setAuditLogs] = useState([
    { id: 1, role: 'Collector', action: 'System Initialization', details: 'Command Portal booted. Geofence geodetic bounds verified.', time: '17:10:00' },
    { id: 2, role: 'NDRF Commander', action: 'LP Optimization Solved', details: 'SciPy LP HiGHS solver allocated 30 units from Gangtok Base to Pakyong Cut.', time: '17:13:00' },
    { id: 3, role: 'BRO Officer', action: 'Highway Clearance Dispatch', details: '2x JCB 3DX deployed to NH-10 Mile 27 debris slide.', time: '17:15:20' }
  ]);

  const [incidentLogs, setIncidentLogs] = useState([
    { id: 1, level: 'INFO', title: 'ISRO Bhuvan GIS Telemetry Sync', message: 'CartoDB Dark Matter tile layer & telemetry streams initialized.', time: '17:10:05' },
    { id: 2, level: 'WARNING', title: 'Rainfall Threshold Exceeded', message: 'Open-Meteo telemetry recorded 185mm/24h precipitation in Gangtok Sector A.', time: '17:12:18' },
    { id: 3, level: 'ACCOUNTABILITY', title: 'NDRF Battalion Mobilized', message: 'SciPy LP HiGHS solver allocated 30 rescue units to Pakyong Landslide Cut.', time: '17:13:00' }
  ]);

  const [citizenReports, setCitizenReports] = useState([
    {
      id: 'CIT-1',
      reporter: 'Sikkim PWD Field Officer',
      type: 'Rockfall / Slope Debris',
      severity: 'HIGH',
      description: 'Active rockfall on Pakyong cut highway. Road partially blocked.',
      latitude: 27.2372,
      longitude: 88.5902,
      time: '17:05'
    }
  ]);

  const alertSentRef = useRef(false);

  const logAuditEvent = (roleTag, actionTitle, detailsText) => {
    setAuditLogs(prev => [
      {
        id: Date.now(),
        role: roleTag,
        action: actionTitle,
        details: detailsText,
        time: new Date().toLocaleTimeString()
      },
      ...prev
    ]);
  };

  // Automated High-Risk Telegram Alert Effect
  useEffect(() => {
    const currentRiskIndex = Math.round((hazardResult?.risk_score || 0) * 100);
    const factorOfSafety = hazardResult?.factor_of_safety ?? 1.5;
    const IS_HIGH_RISK = currentRiskIndex >= 70 || factorOfSafety < 1.0;

    if (IS_HIGH_RISK && !alertSentRef.current) {
      sendAutomaticTelegramAlert(currentRiskIndex, factorOfSafety, activeParams);
      alertSentRef.current = true; // Mark as sent to prevent infinite loop
    } else if (!IS_HIGH_RISK) {
      alertSentRef.current = false; // Reset trigger when risk drops
    }
  }, [hazardResult, activeParams]);

  const sendAutomaticTelegramAlert = async (riskIndex, fs, paramsObj) => {
    const BOT_TOKEN = "8748896465:AAHHCeT23MkgkvlOYIqF_XYb91-c8IKawuw";
    const CHAT_ID = "7125554895";

    const location = paramsObj?.location_name || 'Gangtok-Pakyong Belt, Sikkim Sector';
    const message = `🚨 *RAKSHA-AI AUTOMATED HIGH-RISK ALERT* 🚨\n\n` +
                    `📍 *Sector:* ${location}\n` +
                    `⚠️ *Landslide Risk Index:* ${riskIndex}% (CRITICAL)\n` +
                    `📈 *Factor of Safety (Fs):* ${fs}\n\n` +
                    `📢 *Directive:* AUTOMATIC TRIGGER — Mandatory Evacuation Order Active on NH-10. SDRF teams notified.`;

    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: "Markdown",
        }),
      });
      console.log("⚡ Auto-dispatch triggered on High Risk threshold!");
      logAuditEvent('System Automation', 'Telegram Auto-Dispatch', `Sent high-risk alert for ${location} (Risk: ${riskIndex}%, Fs: ${fs}).`);
    } catch (err) {
      console.error("Auto Telegram Dispatch Failed:", err);
    }
  };

  const handlePredictionChange = (result, params) => {
    if (result) setHazardResult(result);
    if (params) setActiveParams(params);

    if (result?.risk_score >= 0.80) {
      const exists = incidentLogs.some(l => l.title.includes('CRITICAL HAZARD ALERT'));
      if (!exists) {
        setIncidentLogs(prev => [
          {
            id: Date.now(),
            level: 'ACCOUNTABILITY',
            title: `🚨 CRITICAL HAZARD ALERT (${((result?.risk_score || 0) * 100).toFixed(0)}%)`,
            message: `Geofence warning triggered for ${params?.location_name || 'Sikkim Sector'}. SOP evacuation initiated.`,
            time: new Date().toLocaleTimeString()
          },
          ...prev
        ]);

        logAuditEvent(role, 'Emergency Warning Escalated', `Risk index hit ${((result?.risk_score || 0) * 100).toFixed(1)}% in ${params?.location_name || 'Sikkim Sector'}.`);
      }
    }
  };

  const handleReportSubmit = (newReport) => {
    setCitizenReports(prev => [newReport, ...prev]);

    setIncidentLogs(prev => [
      {
        id: Date.now(),
        level: 'ACCOUNTABILITY',
        title: `🚨 GROUND-TRUTH REPORT: ${newReport.type}`,
        message: `${newReport.description} (Severity: ${newReport.severity}, Coords: ${newReport.latitude}, ${newReport.longitude})`,
        time: newReport.time
      },
      ...prev
    ]);

    logAuditEvent('Citizen/Field', 'Ground-Truth Report Logged', `Field report #${newReport.id} (${newReport.type}) pinned on GIS map.`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Header Bar */}
      <Header
        currentRole={role}
        onRoleChange={(newRole) => {
          setRole(newRole);
          logAuditEvent(newRole, 'RBAC Role Switch', `User switched to ${newRole} view.`);
        }}
        currentLang={lang}
        onLangChange={setLang}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenPublicBillboard={() => setIsPublicBillboardOpen(true)}
        t={t}
      />

      {/* Main Command Workspace */}
      <main className="flex-1 p-4 md:p-6 max-w-[1600px] w-full mx-auto space-y-6">
        {/* Interactive Web Push Privacy Banner */}
        <WebPushBanner />

        {/* Dedicated Citizen / Public Safety View Layout */}
        {role === 'Citizen' ? (
          <div className="space-y-6">
            <CitizenView
              hazardResult={hazardResult}
              params={activeParams}
              onOpenReportModal={() => setIsReportModalOpen(true)}
              t={t}
            />

            {/* Public Evacuation & Hazard GIS Map */}
            <MapView
              allocations={allocations}
              citizenReports={citizenReports}
              t={t}
            />
          </div>
        ) : (
          /* Multi-Agency Command Portal Layout (Collector, Commander, BRO) */
          <>
            {/* 7-Channel AI Sensor Fusion Summary Card */}
            <SensorFusionCard
              params={activeParams}
              result={hazardResult}
              lang={lang}
              t={t}
            />

            {/* Dynamic Agency RBAC View Panel */}
            {role === 'Collector' && (
              <DistrictCollectorView
                riskScore={hazardResult?.risk_score || 0.72}
                t={t}
              />
            )}

            {role === 'BroOfficer' && (
              <BroRoadsView
                t={t}
              />
            )}

            {/* Top Grid: GIS Leaflet Map (Left) & Hazard Predictor (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <MapView
                  allocations={allocations}
                  citizenReports={citizenReports}
                  t={t}
                />
              </div>
              <div className="lg:col-span-5">
                <HazardPredictor
                  onPredictionChange={handlePredictionChange}
                  lang={lang}
                  t={t}
                />
              </div>
            </div>

            {/* Resource Dispatch LP Solver */}
            <DispatchOptimizer
              onAllocationsCalculated={(allocs) => {
                setAllocations(allocs);
                logAuditEvent('NDRF Commander', 'SciPy LP Dispatch Computed', `Allocated ${allocs.length} optimal rescue routes.`);
              }}
              t={t}
            />

            {/* Privacy Broadcasting Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6">
                <TelegramBroadcastCard
                  hazardResult={hazardResult}
                  params={activeParams}
                />
              </div>
              <div className="lg:col-span-6">
                <CapFeedExporter
                  params={activeParams}
                  hazardResult={hazardResult}
                />
              </div>
            </div>

            {/* Post-Mortem ML Local Calibration & Governance Audit Trail Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6">
                <MlCalibrationCard t={t} />
              </div>
              <div className="lg:col-span-6">
                <AuditLogPanel auditLogs={auditLogs} t={t} />
              </div>
            </div>

            {/* Incident Ticker Stream */}
            <IncidentTicker
              logs={incidentLogs}
              onClearLogs={() => setIncidentLogs([])}
              t={t}
            />
          </>
        )}
      </main>

      {/* Citizen Ground-Truth Report Modal */}
      <ReportAnomalyModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitReport={handleReportSubmit}
        t={t}
      />

      {/* Public Digital Billboard Roadside View Modal */}
      <PublicBillboardView
        isOpen={isPublicBillboardOpen}
        onClose={() => setIsPublicBillboardOpen(false)}
        hazardResult={hazardResult}
        params={activeParams}
        t={t}
      />

      {/* Footer with PWA Network Status Badge */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>{t.footerBaseline}</span>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1 rounded-full border border-slate-800 text-slate-300">
          {isOnline ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-bold text-emerald-400">🟢 Online (PWA Cache Active)</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-red-400" />
              <span className="text-[11px] font-bold text-red-400">🔴 Offline - Caching Local Storage</span>
            </>
          )}
        </div>
      </footer>
    </div>
  );
}
