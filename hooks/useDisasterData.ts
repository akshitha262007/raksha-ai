"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  LandslideZone, 
  ResourceNode, 
  LogEntry, 
  CitizenAlert,
  EmergencyIncident,
  ResponseUnitAssignment,
  AlertLanguage,
  AlertDeliveryReport,
  DataSourceChannel,
  SensorFusionResult,
  DEFAULT_DATA_SOURCES,
  calculateSensorFusion,
  calculateLandslideRisk, 
  getRiskLevel, 
  matchZoneToClosestResource,
  calculateSpatialDistanceKm,
  generateMultilingualCitizenAlert
} from '@/lib/engine';
import { maskPhoneNumber } from '@/lib/services/sms/smsService';

export interface RealSmsRecord {
  id: string;
  time: string;
  rawPhone: string;
  maskedPhone: string;
  messageText: string;
  status: 'Submitted' | 'Delivered' | 'Failed';
  type: 'TEST';
  messageId?: string;
  error?: string;
}

const INITIAL_ZONES: LandslideZone[] = [
  {
    id: 'zone-tawang',
    name: 'Tawang Sector 4',
    state: 'Arunachal Pradesh',
    lat: 27.586,
    lng: 91.859,
    rainfall: 78,
    soilMoisture: 82,
    slopeAngle: 52,
    riskScore: 78.4,
    riskLevel: 'Critical',
    assignedResource: null,
    lastUpdated: new Date().toLocaleTimeString(),
    elevation: 3048,
    geologicalComposition: 'Weathered Gneiss & Loose Granite',
    populationAtRisk: 12430,
    affectedAreaKm2: 42,
    district: 'Tawang District',
    mainHazard: 'Extreme Landslide & Slope Collapse',
    historicalLandslides: 3,
    instabilityRating: 'Severe'
  },
  {
    id: 'zone-cherrapunji',
    name: 'Cherrapunji Plateau',
    state: 'Meghalaya',
    lat: 25.298,
    lng: 91.733,
    rainfall: 92,
    soilMoisture: 88,
    slopeAngle: 44,
    riskScore: 87.1,
    riskLevel: 'Critical',
    assignedResource: null,
    lastUpdated: new Date().toLocaleTimeString(),
    elevation: 1484,
    geologicalComposition: 'Saturated Sandstone & Karst Limestone',
    populationAtRisk: 18920,
    affectedAreaKm2: 65,
    district: 'East Khasi Hills',
    mainHazard: 'Flash Mudslide & Karst Cave-in',
    historicalLandslides: 5,
    instabilityRating: 'Severe'
  },
  {
    id: 'zone-gangtok',
    name: 'Gangtok East Ridge',
    state: 'Sikkim',
    lat: 27.338,
    lng: 88.606,
    rainfall: 38,
    soilMoisture: 54,
    slopeAngle: 38,
    riskScore: 47.9,
    riskLevel: 'Moderate',
    assignedResource: null,
    lastUpdated: new Date().toLocaleTimeString(),
    elevation: 1650,
    geologicalComposition: 'Phyllites & Disintegrated Mica Schists',
    populationAtRisk: 8500,
    affectedAreaKm2: 28,
    district: 'Gangtok District',
    mainHazard: 'Debris Flow & Rockfall',
    historicalLandslides: 2,
    instabilityRating: 'Moderate'
  },
  {
    id: 'zone-haflong',
    name: 'Haflong Hill Cut',
    state: 'Assam',
    lat: 25.170,
    lng: 93.016,
    rainfall: 22,
    soilMoisture: 42,
    slopeAngle: 28,
    riskScore: 32.9,
    riskLevel: 'Safe',
    assignedResource: null,
    lastUpdated: new Date().toLocaleTimeString(),
    elevation: 680,
    geologicalComposition: 'Tertiary Clay & Unconsolidated Sand',
    populationAtRisk: 6200,
    affectedAreaKm2: 18,
    district: 'Dima Hasao',
    mainHazard: 'Clay Stratum Slump',
    historicalLandslides: 1,
    instabilityRating: 'Low'
  },
  {
    id: 'zone-kohima',
    name: 'Kohima Bypass Pass',
    state: 'Nagaland',
    lat: 25.675,
    lng: 94.108,
    rainfall: 64,
    soilMoisture: 72,
    slopeAngle: 48,
    riskScore: 69.6,
    riskLevel: 'Moderate',
    assignedResource: null,
    lastUpdated: new Date().toLocaleTimeString(),
    elevation: 1444,
    geologicalComposition: 'Fractured Disintegrated Shale',
    populationAtRisk: 14100,
    affectedAreaKm2: 36,
    district: 'Kohima District',
    mainHazard: 'Fractured Rock Slide',
    historicalLandslides: 4,
    instabilityRating: 'High'
  }
];

const INITIAL_RESOURCES: ResourceNode[] = [
  {
    id: 'res-ndrf-12',
    name: '12th Battalion NDRF',
    type: 'NDRF',
    lat: 27.100,
    lng: 93.620,
    baseCity: 'Itanagar, Arunachal Pradesh',
    status: 'Available',
    capacity: 120,
    contact: '+91 360-228-4921',
  },
  {
    id: 'res-sdrf-1',
    name: '1st Battalion SDRF',
    type: 'SDRF',
    lat: 25.578,
    lng: 91.893,
    baseCity: 'Shillong, Meghalaya',
    status: 'Available',
    capacity: 85,
    contact: '+91 364-250-1122',
  },
  {
    id: 'res-ndrf-qrt-sikkim',
    name: 'NDRF Rapid Response Base',
    type: 'NDRF',
    lat: 27.330,
    lng: 88.610,
    baseCity: 'Gangtok, Sikkim',
    status: 'Available',
    capacity: 60,
    contact: '+91 3592-202-774',
  },
  {
    id: 'res-ndrf-10',
    name: '10th Battalion NDRF HQ',
    type: 'NDRF',
    lat: 26.144,
    lng: 91.736,
    baseCity: 'Guwahati, Assam',
    status: 'Available',
    capacity: 160,
    contact: '+91 361-284-0199',
  },
  {
    id: 'res-civil-kohima',
    name: 'Nagaland Disaster Taskforce',
    type: 'Civil Defence',
    lat: 25.670,
    lng: 94.100,
    baseCity: 'Kohima, Nagaland',
    status: 'Available',
    capacity: 75,
    contact: '+91 370-229-0050',
  }
];

const INITIAL_INCIDENTS: EmergencyIncident[] = [
  {
    id: '#RAK-2026-0842',
    zoneId: 'zone-tawang',
    zoneName: 'Tawang Sector 4',
    state: 'Arunachal Pradesh',
    hazard: 'Extreme Landslide Risk',
    severity: 'Critical',
    populationAtRisk: 12430,
    detectedTime: '14:32:10',
    status: 'Response Active',
    citizenAlertStatus: 'Dispatched',
    targetResponseTimeMinutes: 15,
    timeline: [
      { id: 't1', time: '14:32:10', icon: '🧠', title: 'AI Detected Extreme Risk', description: 'Telemetry rain 78mm/h & moisture 82% crossed critical threshold.' },
      { id: 't2', time: '14:32:18', icon: '📍', title: 'Affected Geofence Identified', description: 'Zone 4 Tawang Sector (42 sq km) mapped with 12,430 residents.' },
      { id: 't3', time: '14:32:30', icon: '📱', title: 'Citizen Warning Generated', description: 'Multilingual warning compiled & reviewed by duty commander.' },
      { id: 't4', time: '14:32:45', icon: '🚑', title: 'Response Units Assigned', description: 'Rescue Battalion A, SDRF Medical, Police Unit 7 dispatched.' },
      { id: 't5', time: '14:33:04', icon: '✅', title: 'Assignment Acknowledged', description: 'Rescue Battalion A commander confirmed emergency operational dispatch.' },
      { id: 't6', time: '14:34:12', icon: '🚑', title: 'Units Dispatched En Route', description: '28 vehicles & heavy earthmovers departing Itanagar Base.' }
    ]
  },
  {
    id: '#RAK-2026-0843',
    zoneId: 'zone-cherrapunji',
    zoneName: 'Cherrapunji Plateau',
    state: 'Meghalaya',
    hazard: 'Flash Mudslide & Karst Cave-in',
    severity: 'Critical',
    populationAtRisk: 18920,
    detectedTime: '14:15:00',
    status: 'Alert Dispatched',
    citizenAlertStatus: 'Dispatched',
    targetResponseTimeMinutes: 20,
    timeline: [
      { id: 't10', time: '14:15:00', icon: '🧠', title: 'AI Risk Anomaly', description: 'Extreme precipitation (92 mm/hr) detected on karst plateau.' },
      { id: 't11', time: '14:16:30', icon: '📢', title: 'Public Siren Activated', description: 'Cell broadcast & local emergency siren triggered.' }
    ]
  },
  {
    id: '#RAK-2026-0840',
    zoneId: 'zone-kohima',
    zoneName: 'Kohima Bypass Pass',
    state: 'Nagaland',
    hazard: 'Fractured Rock Slide',
    severity: 'Moderate',
    populationAtRisk: 14100,
    detectedTime: '13:50:00',
    status: 'Monitoring',
    citizenAlertStatus: 'Advisory Recommended',
    targetResponseTimeMinutes: 30,
    timeline: [
      { id: 't20', time: '13:50:00', icon: '🔍', title: 'Moderate Risk Advisory', description: 'Continuous rain sensors active on NH-29 slope.' }
    ]
  }
];

const INITIAL_RESPONSE_UNITS: ResponseUnitAssignment[] = [
  {
    id: 'unit-rescue-a',
    incidentId: '#RAK-2026-0842',
    zoneId: 'zone-tawang',
    role: 'Rescue',
    unitName: 'Rescue Battalion A (12th NDRF)',
    type: 'NDRF',
    status: 'En Route',
    assignedAt: '14:32:45',
    acknowledgedAt: '14:33:04',
    dispatchedAt: '14:34:12',
    acknowledgementDeadline: '14:37:45',
    acknowledgementWindowSeconds: 300,
    escalationLevel: 1,
    currentLat: 27.280,
    currentLng: 92.500,
    targetLat: 27.586,
    targetLng: 91.859,
    baseLat: 27.100,
    baseLng: 93.620,
    contact: '+91 360-228-4921',
    personnelCount: 120
  },
  {
    id: 'unit-medical-2',
    incidentId: '#RAK-2026-0842',
    zoneId: 'zone-tawang',
    role: 'Medical',
    unitName: 'SDRF Medical Team 2',
    type: 'Medical Corps',
    status: 'Accepted',
    assignedAt: '14:32:45',
    acknowledgedAt: '14:33:40',
    acknowledgementDeadline: '14:37:45',
    acknowledgementWindowSeconds: 300,
    escalationLevel: 1,
    currentLat: 25.578,
    currentLng: 91.893,
    targetLat: 27.586,
    targetLng: 91.859,
    baseLat: 25.578,
    baseLng: 91.893,
    contact: '+91 364-250-1122',
    personnelCount: 35
  },
  {
    id: 'unit-police-7',
    incidentId: '#RAK-2026-0842',
    zoneId: 'zone-tawang',
    role: 'Police',
    unitName: 'Arunachal Police Unit 7',
    type: 'State Police',
    status: 'En Route',
    assignedAt: '14:32:45',
    acknowledgedAt: '14:33:15',
    dispatchedAt: '14:35:00',
    acknowledgementDeadline: '14:37:45',
    acknowledgementWindowSeconds: 300,
    escalationLevel: 1,
    currentLat: 27.400,
    currentLng: 92.100,
    targetLat: 27.586,
    targetLng: 91.859,
    baseLat: 27.100,
    baseLng: 93.620,
    contact: '+91 360-222-1007',
    personnelCount: 45
  },
  {
    id: 'unit-evac-3',
    incidentId: '#RAK-2026-0842',
    zoneId: 'zone-tawang',
    role: 'Evacuation',
    unitName: 'Civil Defence Evacuation Team 3',
    type: 'Civil Defence',
    status: 'Assigned',
    assignedAt: '14:32:45',
    acknowledgementDeadline: '14:37:45',
    acknowledgementWindowSeconds: 300,
    escalationLevel: 1,
    currentLat: 26.144,
    currentLng: 91.736,
    targetLat: 27.586,
    targetLng: 91.859,
    baseLat: 26.144,
    baseLng: 91.736,
    contact: '+91 361-284-0199',
    personnelCount: 60
  }
];

export function useDisasterData() {
  const [zones, setZones] = useState<LandslideZone[]>(INITIAL_ZONES);
  const [resources, setResources] = useState<ResourceNode[]>(INITIAL_RESOURCES);
  const [incidents, setIncidents] = useState<EmergencyIncident[]>(INITIAL_INCIDENTS);
  const [responseUnits, setResponseUnits] = useState<ResponseUnitAssignment[]>(INITIAL_RESPONSE_UNITS);
  const [demoMode, setDemoMode] = useState<boolean>(true);

  // Multi-Source Data Channels State
  const [dataSources, setDataSources] = useState<DataSourceChannel[]>(DEFAULT_DATA_SOURCES);
  const [groundVerificationState, setGroundVerificationState] = useState<'Idle' | 'Requested' | 'Confirmed'>('Idle');

  const [realSmsHistory, setRealSmsHistory] = useState<RealSmsRecord[]>([
    {
      id: 'sms-hist-1',
      time: '11:42 AM',
      rawPhone: '+919876543210',
      maskedPhone: '+91 98XXXXXX10',
      messageText: 'RAKSHA AI — TEST ALERT\nSimulated hazard: Extreme Landslide Risk (Zone 4). NO EMERGENCY ACTION REQUIRED.',
      status: 'Submitted',
      type: 'TEST',
      messageId: 'SM-TWILIO-991823'
    }
  ]);

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'log-1',
      timestamp: new Date().toLocaleTimeString(),
      type: 'INFO',
      message: 'RAKSHA-AI Sensor Fusion Engine initialized. 7 Multi-Source Channels Active.',
      details: 'Satellite + Rain + Soil + Slope + Historical + Weather + Ground Sensors'
    },
    {
      id: 'log-2',
      timestamp: new Date().toLocaleTimeString(),
      type: 'WARNING',
      message: 'High precipitation anomaly detected in Meghalaya & Arunachal Sectors.',
      details: 'Rainfall intensity > 75 mm/hr. Soil saturation index critical.'
    },
    {
      id: 'log-3',
      timestamp: new Date().toLocaleTimeString(),
      type: 'ACCOUNTABILITY',
      message: 'Incident #RAK-2026-0842 bound to 4 emergency response units.',
      details: 'Rescue, Medical, Police & Evacuation teams assigned.'
    }
  ]);

  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [isAutoStreamActive, setIsAutoStreamActive] = useState<boolean>(true);
  const [isGatewaySimulating, setIsGatewaySimulating] = useState<boolean>(false);
  const [gatewayStep, setGatewayStep] = useState<number>(0);
  const [selectedLanguage, setSelectedLanguage] = useState<AlertLanguage>('en');
  const [isSpeechPlaying, setIsSpeechPlaying] = useState<boolean>(false);
  
  const [realSmsState, setRealSmsState] = useState<{
    sending: boolean;
    success: boolean | null;
    messageId?: string;
    phone?: string;
    error?: string;
    timestamp?: string;
  }>({
    sending: false,
    success: null
  });

  const [activeAlert, setActiveAlert] = useState<CitizenAlert>({
    id: 'alt-001',
    incidentId: '#RAK-2026-0842',
    zoneId: 'zone-tawang',
    hazard: 'Extreme Landslide Risk',
    severity: 'EXTREME',
    affectedZoneName: 'Zone 4 — Tawang Sector 4',
    district: 'Tawang District',
    populationAtRisk: 12430,
    recommendedAction: 'EVACUATE TO A SAFE LOCATION. Avoid steep slopes, unstable terrain and river channels. Follow instructions from local authorities.',
    messages: generateMultilingualCitizenAlert('Extreme Landslide Risk', 'Zone 4 — Tawang Sector 4', 'EXTREME'),
    selectedLanguage: 'en',
    channels: {
      sms: true,
      app: true,
      cellBroadcast: true,
      ivr: true,
      siren: true,
      teams: true
    },
    status: 'APPROVED',
    createdAt: '14:32:30',
    dispatchedAt: '14:33:00',
    deliveryReport: {
      targetPopulation: 12430,
      smsDelivered: 10842,
      appNotifications: 9840,
      voiceCalls: 1102,
      undelivered: 486,
      acknowledged: 7920,
      pending: 80,
      undeliveredSubzones: [
        { name: 'Zone 4B — Upper Ridge', unreachableCount: 126, recommendedIntervention: '🔊 Local Public Announcement & 🚨 Public Siren' },
        { name: 'Zone 4D — Lower Ravine', unreachableCount: 360, recommendedIntervention: '👮 Deploy Local Response Team' }
      ]
    }
  });

  // Calculate Sensor Fusion dynamically
  const sensorFusion: SensorFusionResult = useMemo(() => {
    return calculateSensorFusion(dataSources);
  }, [dataSources]);

  // Helper to add log entries
  const addLog = useCallback((type: LogEntry['type'], message: string, details?: string, zoneId?: string) => {
    const newEntry: LogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
      details,
      zoneId
    };
    setLogs(prev => [newEntry, ...prev.slice(0, 59)]);
  }, []);

  // Multi-Source Actions
  const toggleDataSource = useCallback((sourceId: string) => {
    setDataSources(prev => prev.map(s => {
      if (s.id === sourceId) {
        const nextEnabled = !s.enabled;
        const nextStatus = nextEnabled ? 'Available' : 'Unavailable';
        addLog('INFO', `DATA CHANNEL ${s.name} ${nextEnabled ? 'ENABLED' : 'DISABLED'}.`, `Sensor fusion recalculating risk & confidence.`);
        return {
          ...s,
          enabled: nextEnabled,
          status: s.id === 'groundSensors' ? 'Simulated' : nextStatus
        };
      }
      return s;
    }));
  }, [addLog]);

  const simulateSatelliteFailure = useCallback(() => {
    setDataSources(prev => prev.map(s => {
      if (s.id === 'satellite') {
        const isNowUnavailable = s.status === 'Available';
        addLog(
          'WARNING',
          `SATELLITE SIMULATION: Satellite Observation ${isNowUnavailable ? 'UNAVAILABLE (Cloud / Orbital blackout)' : 'RESTORED'}.`,
          `Sensor fusion confidence dynamically updated.`
        );
        return {
          ...s,
          status: isNowUnavailable ? 'Unavailable' : 'Available',
          enabled: !isNowUnavailable
        };
      }
      return s;
    }));
  }, [addLog]);

  const requestGroundVerification = useCallback(() => {
    setGroundVerificationState('Requested');
    addLog('ACCOUNTABILITY', '📡 GROUND VERIFICATION REQUESTED: Sent dispatch notice to local district warden team.', 'Status: Awaiting field confirmation (Demo Simulation).');
  }, [addLog]);

  // Telemetry loop (4s sensor sync)
  useEffect(() => {
    if (!isAutoStreamActive) return;

    const interval = setInterval(() => {
      setZones(prevZones => {
        return prevZones.map(zone => {
          const rainDelta = (Math.random() * 14 - 6);
          const newRain = Math.min(115, Math.max(5, Math.round(zone.rainfall + rainDelta)));
          const moistureDelta = (Math.random() * 5 - 2);
          const newMoisture = Math.min(98, Math.max(15, Math.round(zone.soilMoisture + moistureDelta)));
          const newScore = calculateLandslideRisk(newRain, newMoisture, zone.slopeAngle);
          const newRiskLevel = getRiskLevel(newScore);

          if (newRiskLevel === 'Critical' && zone.riskLevel !== 'Critical') {
            addLog(
              'ALERT', 
              `CRITICAL RISK ELEVATION: ${zone.name} (${zone.state}) score reached ${newScore}%!`,
              `Rain: ${newRain}mm/hr | Soil Saturation: ${newMoisture}% | Slope: ${zone.slopeAngle}°`,
              zone.id
            );
          }

          return {
            ...zone,
            rainfall: newRain,
            soilMoisture: newMoisture,
            riskScore: newScore,
            riskLevel: newRiskLevel,
            lastUpdated: new Date().toLocaleTimeString(),
          };
        });
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoStreamActive, addLog]);

  // GPS Movement Simulation Loop for En Route / Dispatched units
  useEffect(() => {
    if (!demoMode) return;

    const gpsInterval = setInterval(() => {
      setResponseUnits(prevUnits => {
        return prevUnits.map(unit => {
          if (unit.status === 'En Route') {
            const deltaLat = (unit.targetLat - unit.currentLat) * 0.05;
            const deltaLng = (unit.targetLng - unit.currentLng) * 0.05;

            const nextLat = Number((unit.currentLat + deltaLat).toFixed(4));
            const nextLng = Number((unit.currentLng + deltaLng).toFixed(4));

            const dist = calculateSpatialDistanceKm(nextLat, nextLng, unit.targetLat, unit.targetLng);
            if (dist < 5) {
              addLog('ACCOUNTABILITY', `LIVE GPS: ${unit.unitName} ARRIVED at disaster site (${unit.zoneId}).`, `Spatial clearance confirmed.`);
              return {
                ...unit,
                currentLat: unit.targetLat,
                currentLng: unit.targetLng,
                status: 'Arrived',
                arrivedAt: new Date().toLocaleTimeString()
              };
            }

            return {
              ...unit,
              currentLat: nextLat,
              currentLng: nextLng
            };
          }
          return unit;
        });
      });
    }, 2500);

    return () => clearInterval(gpsInterval);
  }, [demoMode, addLog]);

  // Execute Optimization Engine
  const executeOptimization = useCallback(() => {
    setIsOptimizing(true);
    addLog('OPTIMIZE', 'Executing Optimization Engine: Spatial Proximity & Fleet Allocation...');

    setTimeout(() => {
      setZones(prevZones => {
        let updatedResources = [...resources];

        const updatedZones = prevZones.map(zone => {
          const freshScore = calculateLandslideRisk(zone.rainfall, zone.soilMoisture, zone.slopeAngle);
          const freshLevel = getRiskLevel(freshScore);

          if (freshLevel === 'Critical' || freshLevel === 'Moderate') {
            const matchedRes = matchZoneToClosestResource(zone, updatedResources);

            if (matchedRes) {
              const distanceKm = calculateSpatialDistanceKm(zone.lat, zone.lng, matchedRes.lat, matchedRes.lng);
              
              updatedResources = updatedResources.map(r => 
                r.id === matchedRes.id 
                  ? { ...r, status: 'Dispatched', assignedZoneId: zone.id } 
                  : r
              );

              const assignedResourceUpdated: ResourceNode = {
                ...matchedRes,
                status: 'Dispatched',
                assignedZoneId: zone.id
              };

              addLog(
                'OPTIMIZE',
                `OPTIMIZER MATCH: Bound ${matchedRes.name} -> ${zone.name} (${distanceKm} km hypot distance).`,
                `Fleet Node: ${matchedRes.baseCity} | Capacity: ${matchedRes.capacity} Personnel | Zone Risk: ${freshScore}%`,
                zone.id
              );

              return {
                ...zone,
                riskScore: freshScore,
                riskLevel: freshLevel,
                assignedResource: assignedResourceUpdated,
              };
            }
          }
          return {
            ...zone,
            riskScore: freshScore,
            riskLevel: freshLevel,
          };
        });

        setResources(updatedResources);
        return updatedZones;
      });

      setIsOptimizing(false);
      addLog('INFO', 'Optimization Engine Run Complete. Disaster Response Matrix fully aligned.');
    }, 800);
  }, [resources, addLog]);

  // Citizen incident reporting event handler
  const addCitizenReport = useCallback((report: {
    zoneId: string;
    fissureType: string;
    seepageLevel: string;
    description: string;
    reporterName?: string;
    contact?: string;
  }) => {
    const targetZone = zones.find(z => z.id === report.zoneId);
    const locationName = targetZone ? `${targetZone.name} (${targetZone.state})` : report.zoneId;

    setZones(prev => prev.map(zone => {
      if (zone.id === report.zoneId) {
        const elevatedMoisture = Math.min(99, zone.soilMoisture + 12);
        const elevatedRain = Math.min(110, zone.rainfall + 10);
        const newScore = calculateLandslideRisk(elevatedRain, elevatedMoisture, zone.slopeAngle);
        const newLevel = getRiskLevel(newScore);

        return {
          ...zone,
          soilMoisture: elevatedMoisture,
          rainfall: elevatedRain,
          riskScore: newScore,
          riskLevel: newLevel,
          lastUpdated: new Date().toLocaleTimeString(),
        };
      }
      return zone;
    }));

    addLog(
      'CITIZEN_REPORT',
      `CITIZEN FIELD INCIDENT FILED: ${locationName}`,
      `Fissure Classification: ${report.fissureType} | Seepage: ${report.seepageLevel} | Details: "${report.description}"`,
      report.zoneId
    );
  }, [zones, addLog]);

  // Toggle stream status
  const toggleAutoStream = useCallback(() => {
    setIsAutoStreamActive(prev => !prev);
    addLog('INFO', `Sensor telemetry clock loop ${!isAutoStreamActive ? 'RESUMED' : 'PAUSED'}.`);
  }, [isAutoStreamActive, addLog]);

  // Voice TTS Player
  const playVoiceAlert = useCallback((text: string, lang: AlertLanguage) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      const langCodes: Record<AlertLanguage, string> = {
        en: 'en-IN',
        hi: 'hi-IN',
        as: 'as-IN',
        bn: 'bn-IN',
        ne: 'ne-NP',
        mn: 'hi-IN'
      };
      
      utterance.lang = langCodes[lang] || 'en-IN';
      utterance.rate = 0.9;
      
      utterance.onstart = () => setIsSpeechPlaying(true);
      utterance.onend = () => setIsSpeechPlaying(false);
      utterance.onerror = () => setIsSpeechPlaying(false);

      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeechPlaying(true);
      setTimeout(() => setIsSpeechPlaying(false), 4000);
    }
  }, []);

  // Send REAL Test SMS API Handler (POST /api/test-sms)
  const sendRealTestSms = useCallback(async (recipientPhone: string, messageContent: string) => {
    setRealSmsState({
      sending: true,
      success: null
    });

    const masked = maskPhoneNumber(recipientPhone);
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    try {
      const res = await fetch('/api/test-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient: recipientPhone, message: messageContent })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setRealSmsState({
          sending: false,
          success: true,
          messageId: data.messageId,
          phone: recipientPhone,
          timestamp: timeNow
        });

        const newHistoryRecord: RealSmsRecord = {
          id: `sms-hist-${Date.now()}`,
          time: timeNow,
          rawPhone: recipientPhone,
          maskedPhone: masked,
          messageText: messageContent,
          status: 'Submitted',
          type: 'TEST',
          messageId: data.messageId
        };

        setRealSmsHistory(prev => [newHistoryRecord, ...prev]);
        addLog('INFO', `REAL TEST SMS SUBMITTED: Sent test alert to ${masked}.`, `Message SID: ${data.messageId || 'OK'}`);
      } else {
        const errorMsg = data.error || 'Failed to dispatch test SMS via provider API.';
        setRealSmsState({
          sending: false,
          success: false,
          phone: recipientPhone,
          error: errorMsg,
          timestamp: timeNow
        });

        const newFailedRecord: RealSmsRecord = {
          id: `sms-hist-${Date.now()}`,
          time: timeNow,
          rawPhone: recipientPhone,
          maskedPhone: masked,
          messageText: messageContent,
          status: 'Failed',
          type: 'TEST',
          error: errorMsg
        };

        setRealSmsHistory(prev => [newFailedRecord, ...prev]);
        addLog('WARNING', `REAL TEST SMS FAILED: ${masked}`, errorMsg);
      }
    } catch (err: any) {
      const errorMsg = `API Request Failure: ${err?.message || 'Server network error'}`;
      setRealSmsState({
        sending: false,
        success: false,
        phone: recipientPhone,
        error: errorMsg,
        timestamp: timeNow
      });
      addLog('WARNING', `REAL TEST SMS EXCEPTION`, errorMsg);
    }
  }, [addLog]);

  // Dispatch Emergency Alert (8-step simulation)
  const dispatchEmergencyAlert = useCallback(() => {
    setIsGatewaySimulating(true);
    setGatewayStep(1);

    const steps = [
      { step: 1, delay: 500, log: 'Step 1/8: AI Landslide Risk Validated (Score 78.4% Critical).' },
      { step: 2, delay: 1000, log: 'Step 2/8: Affected Geofence Identified (Zone 4 - Tawang Sector).' },
      { step: 3, delay: 1500, log: 'Step 3/8: Citizen Population Estimated (12,430 residents).' },
      { step: 4, delay: 2000, log: 'Step 4/8: Citizen Warning Message Formatted in 6 Regional Languages.' },
      { step: 5, delay: 2500, log: 'Step 5/8: Target Language Selected & Verified.' },
      { step: 6, delay: 3000, log: 'Step 6/8: Alert Submitted to Emergency Broadcast Gateway.' },
      { step: 7, delay: 3500, log: 'Step 7/8: Multi-channel Delivery Initiated (Cell Broadcast, SMS, Siren).' },
      { step: 8, delay: 4000, log: 'Step 8/8: Gateway Delivery Report Received & Verified.' }
    ];

    steps.forEach(s => {
      setTimeout(() => {
        setGatewayStep(s.step);
        addLog('ALERT', s.log);
      }, s.delay);
    });

    setTimeout(() => {
      setIsGatewaySimulating(false);
      setActiveAlert(prev => ({
        ...prev,
        status: 'DISPATCHED',
        dispatchedAt: new Date().toLocaleTimeString()
      }));

      setIncidents(prev => prev.map(inc => 
        inc.id === '#RAK-2026-0842'
          ? { 
              ...inc, 
              status: 'Response Active', 
              citizenAlertStatus: 'Dispatched',
              timeline: [
                { id: `t-alert-${Date.now()}`, time: new Date().toLocaleTimeString(), icon: '🟢', title: 'Citizen Emergency Warning Dispatched', description: 'Reached 10,842 citizens via SMS & Cell Broadcast.' },
                ...inc.timeline
              ] 
            }
          : inc
      ));

      addLog('ALERT', '🟢 CITIZEN EMERGENCY ALERT DISPATCHED — DEMO', 'Target: 12,430 | SMS: 10,842 | Voice: 1,102 | App: 9,840');
    }, 4500);
  }, [addLog]);

  // Response Unit Actions
  const acknowledgeAssignment = useCallback((unitId: string) => {
    const timeNow = new Date().toLocaleTimeString();
    setResponseUnits(prev => prev.map(unit => {
      if (unit.id === unitId) {
        addLog('ACCOUNTABILITY', `ASSIGNMENT ACKNOWLEDGED: ${unit.unitName} accepted incident responsibility.`, `Acknowledged at ${timeNow}`);
        return {
          ...unit,
          status: 'Accepted',
          acknowledgedAt: timeNow
        };
      }
      return unit;
    }));
  }, [addLog]);

  const updateUnitStatus = useCallback((unitId: string, nextStatus: ResponseUnitAssignment['status']) => {
    const timeNow = new Date().toLocaleTimeString();
    setResponseUnits(prev => prev.map(unit => {
      if (unit.id === unitId) {
        addLog('ACCOUNTABILITY', `RESPONSE STATUS UPDATE: ${unit.unitName} changed status to ${nextStatus.toUpperCase()}.`);
        return {
          ...unit,
          status: nextStatus,
          ...(nextStatus === 'En Route' ? { dispatchedAt: timeNow } : {}),
          ...(nextStatus === 'Arrived' ? { arrivedAt: timeNow } : {})
        };
      }
      return unit;
    }));
  }, [addLog]);

  // Simulate Overdue & Trigger Escalation Workflow
  const triggerOverdueAndEscalate = useCallback((unitId: string) => {
    const unit = responseUnits.find(u => u.id === unitId);
    if (!unit) return;

    setResponseUnits(prev => prev.map(u => {
      if (u.id === unitId) {
        return {
          ...u,
          status: 'Overdue',
          escalationLevel: 3,
          backupRequested: true,
          backupUnitName: '10th NDRF Backup Squadron B'
        };
      }
      return u;
    }));

    addLog('ESCALATION', `⚠️ RESPONSE FAILURE DETECTED: ${unit.unitName} exceeded acknowledgement deadline!`, `Triggering Escalation Level 3 -> Escalated to District Emergency Control Room.`);

    setTimeout(() => {
      addLog('ESCALATION', `BACKUP REQUESTED: Requested 10th NDRF Backup Squadron B to replace ${unit.unitName}.`, `Operational continuity secured.`);
    }, 1500);
  }, [responseUnits, addLog]);

  return {
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
    addLog,
  };
}
